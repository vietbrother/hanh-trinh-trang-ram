/**
 * Dịch vụ lưu trữ cục bộ (LocalStorage Service)
 * Tách biệt hoàn toàn tầng lưu trữ khỏi UI và logic nghiệp vụ.
 */
import { APP_CONFIG } from '../config/app.config.js';

const STORAGE_KEY_PLAYER = `${APP_CONFIG.storagePrefix}player_v1`;
const STORAGE_KEY_AUDIO_MUTED = `${APP_CONFIG.storagePrefix}audio_muted`;

export const storageService = {
  /**
   * Đọc dữ liệu người chơi
   * @returns {Object|null}
   */
  getPlayer() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PLAYER);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[StorageService] Không thể đọc player từ localStorage:', e);
      return null;
    }
  },

  /**
   * Lưu dữ liệu người chơi
   * @param {Object} player 
   * @returns {boolean}
   */
  savePlayer(player) {
    try {
      localStorage.setItem(STORAGE_KEY_PLAYER, JSON.stringify(player));
      return true;
    } catch (e) {
      console.error('[StorageService] Lỗi khi lưu player:', e);
      return false;
    }
  },

  /**
   * Xóa toàn bộ dữ liệu người chơi (dành cho reset hành trình)
   */
  clearPlayer() {
    try {
      localStorage.removeItem(STORAGE_KEY_PLAYER);
      return true;
    } catch (e) {
      console.warn('[StorageService] Lỗi khi xóa player:', e);
      return false;
    }
  },

  /**
   * Đọc trạng thái âm thanh (tắt/bật)
   * @returns {boolean}
   */
  isAudioMuted() {
    try {
      return localStorage.getItem(STORAGE_KEY_AUDIO_MUTED) === 'true';
    } catch {
      return false;
    }
  },

  /**
   * Lưu trạng thái âm thanh
   * @param {boolean} isMuted 
   */
  setAudioMuted(isMuted) {
    try {
      localStorage.setItem(STORAGE_KEY_AUDIO_MUTED, String(isMuted));
    } catch (e) {
      console.warn('[StorageService] Lỗi khi lưu cài đặt âm thanh:', e);
    }
  },
};
