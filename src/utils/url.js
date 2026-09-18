/**
 * Tiện ích xử lý URL và truy xuất Query Parameters
 */

/**
 * Lấy mã trạm (station code/id) từ URL query parameters
 * Ví dụ: ?station=01 hoặc ?station=station-01
 * @returns {string|null}
 */
export function getStationParam() {
  try {
    const params = new URLSearchParams(window.location.search);
    const station = params.get('station');
    if (!station) return null;
    return station.trim();
  } catch {
    return null;
  }
}

/**
 * Chuyển hướng hoặc cập nhật URL đến một trạm cụ thể mà không cần reload
 * @param {string} stationCode Ví dụ: '01'
 */
export function navigateToStation(stationCode) {
  const url = new URL(window.location.href);
  url.searchParams.set('station', stationCode);
  window.history.pushState({}, '', url.toString());
  window.dispatchEvent(new CustomEvent('app:navigate', { detail: { station: stationCode } }));
}

/**
 * Chuyển hướng về cổng vào (Gateway)
 */
export function navigateToGateway() {
  const url = new URL(window.location.href);
  url.searchParams.delete('station');
  window.history.pushState({}, '', url.toString());
  window.dispatchEvent(new CustomEvent('app:navigate', { detail: { station: null } }));
}
