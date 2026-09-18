/**
 * Component thanh thông tin người chơi (Player Profile Bar)
 */
import { createElement } from '../utils/dom.js';
import { createScoreDisplay } from './score-display.js';
import { audioService } from '../services/audio.service.js';
import { navigateToGateway } from '../utils/url.js';

/**
 * Tạo thanh Header người chơi
 * @param {Object} props
 * @param {Object|null} props.player
 * @param {Function} [props.onReset]
 * @returns {HTMLElement}
 */
export function createPlayerProfile({ player, onReset }) {
  const container = createElement('header', { class: 'player-bar', id: 'player-bar' });

  if (!player) {
    // Khi chưa có player (ở Gateway), hiển thị logo nhỏ
    const brand = createElement('div', { class: 'player-bar__info' }, [
      createElement('span', { class: 'player-bar__avatar', 'aria-hidden': 'true' }, ['🌕']),
      createElement('span', { class: 'player-bar__name' }, ['Trung Thu 4.0']),
    ]);
    container.appendChild(brand);
  } else {
    // Đã có player: avatar thỏ + tên + điểm
    const info = createElement('div', { class: 'player-bar__info' }, [
      createElement('span', { class: 'player-bar__avatar', 'aria-hidden': 'true' }, ['🐰']),
      createElement('span', { class: 'player-bar__name', title: player.nickname }, [player.nickname]),
      createScoreDisplay(player.totalScore || 0),
    ]);
    container.appendChild(info);
  }

  // Nút hành động: Tắt/bật âm thanh & Reset/Home
  const actions = createElement('div', { class: 'player-bar__actions' });

  // Nút Audio toggle
  const soundIcon = audioService.isMuted() ? '🔇' : '🔊';
  const soundBtn = createElement(
    'button',
    {
      class: 'icon-btn',
      id: 'btn-sound-toggle',
      'aria-label': audioService.isMuted() ? 'Bật âm thanh' : 'Tắt âm thanh',
      title: audioService.isMuted() ? 'Bật âm thanh' : 'Tắt âm thanh',
      onClick: () => {
        const isMuted = audioService.toggleMute();
        soundBtn.textContent = isMuted ? '🔇' : '🔊';
        soundBtn.setAttribute('aria-label', isMuted ? 'Bật âm thanh' : 'Tắt âm thanh');
        soundBtn.title = isMuted ? 'Bật âm thanh' : 'Tắt âm thanh';
      },
    },
    [soundIcon]
  );
  actions.appendChild(soundBtn);

  // Nếu đã có player, có thể có nút về Cổng (Passport)
  if (player) {
    const homeBtn = createElement(
      'button',
      {
        class: 'icon-btn',
        id: 'btn-home-nav',
        'aria-label': 'Về cổng vào',
        title: 'Về cổng vào',
        onClick: () => {
          navigateToGateway();
        },
      },
      ['🏠']
    );
    actions.appendChild(homeBtn);
  }

  container.appendChild(actions);
  return container;
}
