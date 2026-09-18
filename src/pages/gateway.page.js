/**
 * Trang Cổng Vào (Gateway Page - QR00)
 * Chịu trách nhiệm: Đón tiếp nhà thám hiểm, nhập nickname, hiển thị hộ chiếu nếu đã có tài khoản
 */
import { createElement } from '../utils/dom.js';
import { createButton } from '../components/button.js';
import { createCard } from '../components/card.js';
import { playerService } from '../services/player.service.js';
import { stationService } from '../services/station.service.js';
import { audioService } from '../services/audio.service.js';
import { navigateToStation } from '../utils/url.js';
import { GAME_CONFIG } from '../config/game.config.js';
import { MESSAGES_DATA } from '../data/messages.data.js';

export function renderGatewayPage(container) {
  container.innerHTML = '';
  const page = createElement('main', { class: 'page-container', id: 'page-gateway' });

  const player = playerService.getPlayer();

  // 1. Hero Section: Trăng tròn + Thỏ ngọc
  const hero = createElement('section', { class: 'gateway-hero', 'aria-label': 'Giới thiệu hành trình' }, [
    createElement('div', { class: 'gateway-hero__moon', 'aria-hidden': 'true' }, ['🌕']),
    createElement('h1', { class: 'gateway-hero__title' }, [MESSAGES_DATA.welcome.title]),
    createElement('p', { class: 'gateway-hero__subtitle' }, [MESSAGES_DATA.welcome.subtitle]),
    createElement('div', { class: 'gateway-hero__callout' }, [MESSAGES_DATA.welcome.mascotCallout]),
  ]);
  page.appendChild(hero);

  // 2. Nội dung chính: Nếu đã có player -> Hiển thị Hộ chiếu thám hiểm; nếu chưa có -> Form nhập nickname
  if (!player) {
    // FORM NHẬP TÊN
    const formCard = createCard({
      variant: 'gold',
      id: 'gateway-form-card',
      children: [
        createElement('div', { class: 'gateway-form' }, [
          createElement('div', { class: 'form-group' }, [
            createElement(
              'label',
              { for: 'input-nickname', class: 'form-label' },
              [MESSAGES_DATA.welcome.nicknamePrompt]
            ),
            createElement('input', {
              id: 'input-nickname',
              type: 'text',
              class: 'nickname-input',
              placeholder: GAME_CONFIG.nickname.placeholder,
              maxLength: GAME_CONFIG.nickname.maxLength,
              autocomplete: 'off',
              autocapitalize: 'words',
              'aria-required': 'true',
            }),
            createElement('div', { id: 'nickname-error', class: 'form-error', 'aria-live': 'polite' }),
          ]),
          createButton({
            id: 'btn-start-adventure',
            text: MESSAGES_DATA.welcome.ctaStart,
            icon: '🚀',
            variant: 'primary',
            onClick: () => {
              const input = document.getElementById('input-nickname');
              const errorEl = document.getElementById('nickname-error');
              if (!input || !errorEl) return;

              const result = playerService.createPlayer(input.value);
              if (!result.success) {
                errorEl.textContent = result.error || 'Vui lòng kiểm tra lại tên!';
                input.focus();
                audioService.playWrongSound();
                return;
              }

              audioService.playSuccessSound();
              // Sau khi tạo player, tải lại view gateway hoặc chuyển đến Trạm 01
              renderGatewayPage(container);
            },
          }),
        ]),
      ],
    });

    // Lời nhắn quan sát mô hình 3D vật lý
    const noticeCard = createCard({
      children: [
        createElement('div', { style: 'text-align: center;' }, [
          createElement('p', { style: 'font-size: var(--font-size-xs); color: var(--color-text-muted); line-height: 1.6;' }, [
            '🗺️ Sau khi bắt đầu, bạn hãy tìm các mã QR đặt tại các trạm trên mô hình Trung Thu 3D để quét và mở khóa nhiệm vụ nhé!',
          ]),
        ]),
      ],
    });

    page.appendChild(formCard);
    page.appendChild(noticeCard);
  } else {
    // HỘ CHIẾU NHÀ THÁM HIỂM (Khi người chơi đã có thông tin)
    const passportCard = createCard({
      variant: 'gold',
      id: 'passport-card',
      children: [
        createElement('div', { style: 'text-align: center; margin-bottom: var(--spacing-4);' }, [
          createElement('span', { style: 'font-size: 2.5rem;', 'aria-hidden': 'true' }, ['🧭']),
          createElement('h2', { style: 'color: var(--color-accent-gold); margin-top: 4px;' }, ['HỘ CHIẾU THÁM HIỂM']),
          createElement('p', { style: 'font-size: var(--font-size-sm); color: var(--color-text-main); margin-top: 4px;' }, [
            'Xin chào ',
            createElement('strong', { style: 'color: var(--color-accent-gold); font-size: 1.1em;' }, [player.nickname]),
            '!',
          ]),
        ]),

        // Bảng tóm tắt điểm và huy hiệu
        createElement('div', {
          style: 'display: flex; gap: var(--spacing-3); margin-bottom: var(--spacing-4);',
        }, [
          createElement('div', {
            style: 'flex: 1; text-align: center; padding: 12px; background: rgba(255,255,255,0.06); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);',
          }, [
            createElement('span', { style: 'font-size: 0.75rem; color: var(--color-text-muted); display: block;' }, ['TỔNG ĐIỂM']),
            createElement('strong', { style: 'font-size: 1.5rem; color: var(--color-accent-gold); display: block;' }, [
              `${player.totalScore || 0}`,
            ]),
          ]),
          createElement('div', {
            style: 'flex: 1; text-align: center; padding: 12px; background: rgba(255,255,255,0.06); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);',
          }, [
            createElement('span', { style: 'font-size: 0.75rem; color: var(--color-text-muted); display: block;' }, ['TRẠM HOÀN THÀNH']),
            createElement('strong', { style: 'font-size: 1.5rem; color: var(--color-primary-light); display: block;' }, [
              `${(player.completedStations || []).length} / 1`,
            ]),
          ]),
        ]),

        // Danh sách huy hiệu đã đạt
        createElement('div', { style: 'margin-bottom: var(--spacing-4);' }, [
          createElement('h3', { style: 'font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: 8px;' }, [
            'HUY HIỆU ĐÃ NHẬN:',
          ]),
          createElement('div', {
            style: 'display: flex; flex-wrap: wrap; gap: 8px; min-height: 44px; align-items: center;',
          }, (player.badges && player.badges.length > 0)
            ? player.badges.map((bId) => {
                const badge = stationService.getBadgeById(bId);
                return createElement('span', {
                  style: 'display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(250,204,21,0.15); border: 1px solid var(--color-border-highlight); border-radius: var(--radius-pill); font-size: var(--font-size-xs); color: var(--color-accent-gold); font-weight: 600;',
                }, [
                  createElement('span', {}, [badge ? badge.icon : '🏅']),
                  createElement('span', {}, [badge ? badge.name : bId]),
                ]);
              })
            : [
                createElement('span', { style: 'font-size: var(--font-size-xs); color: var(--color-text-muted); font-style: italic;' }, [
                  'Chưa có huy hiệu. Hãy quét mã QR tại Trạm 01 để bắt đầu nhé!',
                ]),
              ]),
        ]),

        // Nút truy cập nhanh Trạm 01: Cung Trăng
        createButton({
          id: 'btn-go-station-01',
          text: playerService.hasCompletedStation('station-01')
            ? 'XEM LẠI TRẠM 01 (CUNG TRĂNG)'
            : 'KHÁM PHÁ TRẠM 01 (CUNG TRĂNG)',
          icon: '🌕',
          variant: 'primary',
          onClick: () => {
            navigateToStation('01');
          },
        }),

        // Nút đổi tên / reset chơi lại nếu muốn test
        createElement('div', { style: 'margin-top: 12px; text-align: center;' }, [
          createButton({
            id: 'btn-reset-player',
            text: 'Đổi tên hoặc Chơi lại từ đầu',
            variant: 'ghost',
            className: 'app-btn--secondary',
            onClick: () => {
              if (window.confirm('Bạn có chắc muốn làm lại hành trình từ đầu không?')) {
                playerService.resetProgress();
                renderGatewayPage(container);
              }
            },
          }),
        ]),
      ],
    });

    page.appendChild(passportCard);
  }

  container.appendChild(page);
}
