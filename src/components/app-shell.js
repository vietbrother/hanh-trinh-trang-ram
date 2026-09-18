/**
 * Component Khung ứng dụng (App Shell)
 * Đảm bảo layout mobile-first chuẩn mực, responsive, an toàn
 */
import { createElement } from '../utils/dom.js';
import { createPlayerProfile } from './player-profile.js';
import { playerService } from '../services/player.service.js';

export function createAppShell() {
  const root = createElement('div', { id: 'app' });

  // 1. Header người chơi
  const headerMount = createElement('div', { id: 'header-mount' });
  const player = playerService.getPlayer();
  headerMount.appendChild(createPlayerProfile({ player }));

  // 2. Vùng chứa nội dung trang (Page content)
  const pageMount = createElement('div', { id: 'page-mount', style: 'flex: 1; display: flex; flex-direction: column;' });

  root.appendChild(headerMount);
  root.appendChild(pageMount);

  return { root, headerMount, pageMount };
}
