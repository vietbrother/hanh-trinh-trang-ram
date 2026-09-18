/**
 * Dịch vụ quản lý các Trạm Thám Hiểm (Station Service)
 */
import { STATIONS_DATA } from '../data/stations.data.js';
import { BADGES_DATA } from '../data/badges.data.js';
import { playerService } from './player.service.js';

export const STATION_STATUS = {
  AVAILABLE: 'AVAILABLE',
  COMPLETED: 'COMPLETED',
  LOCKED: 'LOCKED',
};

export const stationService = {
  /**
   * Lấy danh sách tất cả các trạm
   * @returns {Array}
   */
  getAllStations() {
    return STATIONS_DATA;
  },

  /**
   * Tìm trạm dựa trên tham số query từ mã QR (ví dụ: '01' hoặc 'station-01')
   * @param {string} param 
   * @returns {Object|null}
   */
  getStationByParam(param) {
    if (!param || typeof param !== 'string') return null;
    const cleanParam = param.trim().toLowerCase();

    return STATIONS_DATA.find((st) => {
      const matchCode = st.code && st.code.toLowerCase() === cleanParam;
      const matchId = st.id && st.id.toLowerCase() === cleanParam;
      // Cho phép '1' khớp với '01'
      const matchLooseNumber = parseInt(st.code, 10) === parseInt(cleanParam, 10);
      return matchCode || matchId || matchLooseNumber;
    }) || null;
  },

  /**
   * Xác định trạng thái của một trạm đối với người chơi hiện tại
   * @param {string} stationId 
   * @returns {string} Trạng thái: AVAILABLE | COMPLETED | LOCKED
   */
  getStationStatus(stationId) {
    if (playerService.hasCompletedStation(stationId)) {
      return STATION_STATUS.COMPLETED;
    }
    // Trong tương lai nếu có thứ tự mở khóa, có thể kiểm tra trạm trước đó ở đây
    return STATION_STATUS.AVAILABLE;
  },

  /**
   * Lấy thông tin huy hiệu theo ID
   * @param {string} badgeId 
   * @returns {Object|null}
   */
  getBadgeById(badgeId) {
    return BADGES_DATA[badgeId] || null;
  },
};
