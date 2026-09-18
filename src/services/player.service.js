/**
 * Dịch vụ quản lý thông tin và tiến trình người chơi (Player Service)
 * Đảm bảo tính toàn vẹn của logic nghiệp vụ (Single Source of Truth).
 */
import { storageService } from './storage.service.js';
import { GAME_CONFIG } from '../config/game.config.js';
import { validateNickname } from '../utils/validation.js';

export const playerService = {
  /**
   * Lấy thông tin người chơi hiện tại
   * @returns {Object|null}
   */
  getPlayer() {
    return storageService.getPlayer();
  },

  /**
   * Kiểm tra người chơi đã khởi tạo hay chưa
   * @returns {boolean}
   */
  hasPlayer() {
    const player = this.getPlayer();
    return !!(player && player.nickname && typeof player.nickname === 'string');
  },

  /**
   * Khởi tạo người chơi mới tại cổng vào (Gateway)
   * @param {string} rawNickname
   * @returns {{ success: boolean, player?: Object, error?: string }}
   */
  createPlayer(rawNickname) {
    const validation = validateNickname(rawNickname);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const newPlayer = {
      nickname: validation.sanitizedValue,
      totalScore: GAME_CONFIG.initialScore,
      completedStations: [], // Danh sách stationId đã hoàn thành
      badges: [],            // Danh sách badgeId đã nhận
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.savePlayer(newPlayer);
    this._dispatchPlayerUpdate(newPlayer);

    return { success: true, player: newPlayer };
  },

  /**
   * Kiểm tra xem người chơi đã hoàn thành trạm này chưa
   * @param {string} stationId
   * @returns {boolean}
   */
  hasCompletedStation(stationId) {
    const player = this.getPlayer();
    if (!player || !Array.isArray(player.completedStations)) return false;
    return player.completedStations.includes(stationId);
  },

  /**
   * Kiểm tra người chơi đã sở hữu huy hiệu hay chưa
   * @param {string} badgeId
   * @returns {boolean}
   */
  hasBadge(badgeId) {
    const player = this.getPlayer();
    if (!player || !Array.isArray(player.badges)) return false;
    return player.badges.includes(badgeId);
  },

  /**
   * Hoàn thành trạm và trao thưởng (Điểm + Huy hiệu)
   * QUAN TRỌNG: Ngăn chặn tuyệt đối việc cộng điểm hoặc trao huy hiệu trùng lặp
   * @param {string} stationId
   * @param {number} points
   * @param {string} badgeId
   * @param {Object} [extraData={}] Dữ liệu bổ sung (như creativeDesign cho Trạm 05)
   * @returns {{ success: boolean, alreadyCompleted: boolean, pointsAwarded: number, player: Object }}
   */
  completeStation(stationId, points = GAME_CONFIG.defaultRewardPoints, badgeId = null, extraData = {}) {
    let player = this.getPlayer();
    if (!player) {
      throw new Error('Chưa có thông tin người chơi!');
    }

    // Business rule: Trạm chỉ được nhận thưởng một lần duy nhất
    if (this.hasCompletedStation(stationId)) {
      // Nếu có extraData mới (ví dụ cập nhật thiết kế đèn), có thể lưu thêm mà không cộng điểm
      if (extraData && Object.keys(extraData).length > 0) {
        player = {
          ...player,
          ...extraData,
          updatedAt: new Date().toISOString(),
        };
        storageService.savePlayer(player);
        this._dispatchPlayerUpdate(player);
      }

      return {
        success: true,
        alreadyCompleted: true,
        pointsAwarded: 0,
        player,
      };
    }

    // Cập nhật tiến trình an toàn
    const updatedCompleted = [...(player.completedStations || []), stationId];
    const updatedBadges = [...(player.badges || [])];
    if (badgeId && !updatedBadges.includes(badgeId)) {
      updatedBadges.push(badgeId);
    }

    const updatedScore = Number(player.totalScore || 0) + Number(points);

    player = {
      ...player,
      totalScore: updatedScore,
      completedStations: updatedCompleted,
      badges: updatedBadges,
      ...extraData,
      updatedAt: new Date().toISOString(),
    };

    storageService.savePlayer(player);
    this._dispatchPlayerUpdate(player);

    return {
      success: true,
      alreadyCompleted: false,
      pointsAwarded: points,
      player,
    };
  },

  /**
   * Kiểm tra người chơi đã hoàn thành toàn bộ hành trình (đủ 5 trạm) chưa
   * @param {number} totalStations
   * @returns {boolean}
   */
  isJourneyCompleted(totalStations = 5) {
    const player = this.getPlayer();
    if (!player || !Array.isArray(player.completedStations)) return false;
    return player.completedStations.length >= totalStations;
  },

  /**
   * Đếm số trạm đã hoàn thành
   * @returns {number}
   */
  getCompletedCount() {
    const player = this.getPlayer();
    return player?.completedStations?.length || 0;
  },

  /**
   * Xóa toàn bộ dữ liệu và reset game
   */
  resetProgress() {
    storageService.clearPlayer();
    this._dispatchPlayerUpdate(null);
  },

  /**
   * Phát sự kiện khi dữ liệu người chơi thay đổi để UI đồng bộ
   * @private
   */
  _dispatchPlayerUpdate(player) {
    window.dispatchEvent(new CustomEvent('player:changed', { detail: { player } }));
  },
};
