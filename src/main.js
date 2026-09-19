/**
 * Entry Point chính của TRUNG THU 4.0 — HÀNH TRÌNH TRĂNG RẰM
 * Chạy trực tiếp trên trình duyệt bằng Vanilla JS ES Modules
 */
import './styles/reset.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';

import { createAppShell } from './components/app-shell.js';
import { createPlayerProfile } from './components/player-profile.js';
import { renderGatewayPage } from './pages/gateway.page.js';
import { renderStationPage } from './pages/station.page.js';
import { getStationParam } from './utils/url.js';
import { playerService } from './services/player.service.js';

function initApp() {
  const rootContainer = document.getElementById('root') || document.body;
  rootContainer.innerHTML = '';

  const { root, headerMount, pageMount } = createAppShell();
  rootContainer.appendChild(root);

  /**
   * Bộ điều phối Router định tuyến không cần thư viện bên ngoài
   */
  function route() {
    const stationCode = getStationParam();
    if (stationCode) {
      renderStationPage(pageMount, stationCode);
    } else {
      renderGatewayPage(pageMount);
    }
  }

  /**
   * Cập nhật lại thanh thông tin người chơi khi điểm hoặc tên thay đổi
   */
  function refreshHeader() {
    headerMount.innerHTML = '';
    const player = playerService.getPlayer();
    headerMount.appendChild(createPlayerProfile({ player }));
  }

  // Lắng nghe sự kiện điều hướng nội bộ và nút Back/Forward của trình duyệt
  window.addEventListener('popstate', route);
  window.addEventListener('app:navigate', route);
  window.addEventListener('player:changed', () => {
    refreshHeader();
    // Nếu đang ở cổng chính (Gateway), cập nhật lại nội dung trang phù hợp với trạng thái người chơi
    if (!getStationParam()) {
      route();
    }
  });

  // Khởi chạy route ban đầu
  route();
}

// Khởi chạy khi DOM sẵn sàng
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
