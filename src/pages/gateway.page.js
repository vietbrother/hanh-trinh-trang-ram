/**
 * Trang Cổng Vào (Gateway Page - QR00)
 * Chịu trách nhiệm: Đón tiếp nhà thám hiểm, nhập nickname, hiển thị hộ chiếu nếu đã có tài khoản
 */
import { createElement } from '../utils/dom.js';
import { createButton } from '../components/button.js';
import { createCard } from '../components/card.js';
import { createPassport } from '../components/passport.js';
import { openPlayerSettingsModal } from '../components/player-modal.js';
import { playerService } from '../services/player.service.js';
import { audioService } from '../services/audio.service.js';
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
              // Sau khi tạo player, tải lại view gateway với Hộ chiếu đầy đủ
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
            '🗺️ Sau khi bắt đầu, bạn hãy tìm các mã QR đặt tại các trạm (01..05) trên mô hình Trung Thu 3D để quét và mở khóa nhiệm vụ nhé!',
          ]),
        ]),
      ],
    });

    page.appendChild(formCard);
    page.appendChild(noticeCard);
  } else {
    // HỘ CHIẾU NHÀ THÁM HIỂM (Đầy đủ 5 trạm, điểm số, checklist và celebration)
    const passportComponent = createPassport({
      player,
      onResetRequest: () => {
        openPlayerSettingsModal({
          player,
          onRenameSuccess: () => {
            renderGatewayPage(container);
          },
          onResetSuccess: () => {
            renderGatewayPage(container);
          },
        });
      },
    });

    page.appendChild(passportComponent);
  }

  container.appendChild(page);
}
