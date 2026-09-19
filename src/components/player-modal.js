/**
 * Component Modal Cài Đặt Người Chơi (Player Settings Modal)
 * Hỗ trợ Đổi tên biệt danh và Chơi lại từ đầu an toàn trong môi trường Web & iFrame
 */
import { createElement } from '../utils/dom.js';
import { createButton } from './button.js';
import { playerService } from '../services/player.service.js';
import { audioService } from '../services/audio.service.js';
import { GAME_CONFIG } from '../config/game.config.js';

export function closePlayerSettingsModal() {
  const existing = document.getElementById('player-settings-modal');
  if (existing) {
    existing.remove();
  }
}

/**
 * Mở modal quản lý tài khoản: Đổi tên hoặc Chơi lại từ đầu
 * @param {Object} props
 * @param {Object} props.player
 * @param {Function} [props.onRenameSuccess]
 * @param {Function} [props.onResetSuccess]
 * @param {Function} [props.onClose]
 */
export function openPlayerSettingsModal({
  player,
  onRenameSuccess,
  onResetSuccess,
  onClose,
}) {
  // Đảm bảo không có modal trùng lặp
  closePlayerSettingsModal();

  const currentPlayer = player || playerService.getPlayer() || { nickname: '', totalScore: 0 };

  // 1. Overlay
  const overlay = createElement('div', {
    class: 'modal-overlay',
    id: 'player-settings-modal',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'modal-settings-title',
  });

  // 2. Card
  const card = createElement('div', { class: 'modal-card', id: 'player-settings-card' });

  // 3. Header
  const header = createElement('div', { class: 'modal-header' }, [
    createElement('h2', { class: 'modal-title', id: 'modal-settings-title' }, [
      createElement('span', { 'aria-hidden': 'true' }, ['⚙️']),
      'Cài Đặt Nhà Thám Hiểm',
    ]),
    createElement(
      'button',
      {
        class: 'modal-close-btn',
        id: 'btn-modal-close',
        type: 'button',
        'aria-label': 'Đóng cài đặt',
        onClick: () => {
          handleClose();
        },
      },
      ['✕']
    ),
  ]);
  card.appendChild(header);

  // Thông tin ngắn về người chơi hiện tại
  const currentInfo = createElement('div', {
    style: 'font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--spacing-4);',
  }, [
    'Đang chơi với tên: ',
    createElement('strong', { style: 'color: var(--color-accent-gold); font-size: 1.1em;' }, [
      currentPlayer.nickname || 'Chưa đặt tên',
    ]),
    ` • Điểm số: ⭐ ${currentPlayer.totalScore || 0}`,
  ]);
  card.appendChild(currentInfo);

  // ==========================================
  // PHẦN 1: ĐỔI TÊN NGƯỜI CHƠI
  // ==========================================
  const renameSection = createElement('div', { class: 'modal-section', id: 'modal-rename-section' });

  const renameTitle = createElement('div', { class: 'modal-section__title' }, [
    createElement('span', { 'aria-hidden': 'true' }, ['✏️']),
    'Đổi tên biệt danh (Giữ nguyên điểm)',
  ]);
  renameSection.appendChild(renameTitle);

  const renameInput = createElement('input', {
    id: 'modal-nickname-input',
    type: 'text',
    class: 'nickname-input',
    style: 'margin-bottom: 8px;',
    value: currentPlayer.nickname || '',
    placeholder: GAME_CONFIG.nickname.placeholder,
    maxLength: GAME_CONFIG.nickname.maxLength,
    autocomplete: 'off',
    autocapitalize: 'words',
    'aria-label': 'Nhập tên mới',
  });
  renameSection.appendChild(renameInput);

  const renameError = createElement('div', {
    id: 'modal-nickname-error',
    class: 'form-error',
    'aria-live': 'polite',
    style: 'margin-bottom: 8px; min-height: 18px;',
  });
  renameSection.appendChild(renameError);

  function executeRename() {
    const val = renameInput.value;
    const result = playerService.updateNickname(val);

    if (!result.success) {
      renameError.textContent = result.error || 'Vui lòng kiểm tra lại tên!';
      renameInput.focus();
      try {
        audioService.playWrongSound();
      } catch {
        // Safe
      }
      return;
    }

    // Đổi tên thành công
    renameError.textContent = '';
    try {
      audioService.playSuccessSound();
    } catch {
      // Safe
    }

    closePlayerSettingsModal();

    if (typeof onRenameSuccess === 'function') {
      onRenameSuccess(result.player);
    }
  }

  // Cho phép nhấn Enter trên input để lưu ngay
  renameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeRename();
    }
  });

  const saveBtn = createButton({
    id: 'btn-save-new-name',
    text: 'LƯU TÊN MỚI',
    icon: '💾',
    variant: 'primary',
    onClick: () => {
      executeRename();
    },
  });
  renameSection.appendChild(saveBtn);
  card.appendChild(renameSection);

  // Divider
  const divider = createElement('div', { class: 'modal-divider' }, ['HOẶC']);
  card.appendChild(divider);

  // ==========================================
  // PHẦN 2: CHƠI LẠI TỪ ĐẦU
  // ==========================================
  const resetSection = createElement('div', { class: 'modal-section', id: 'modal-reset-section' });

  const resetTitle = createElement('div', { class: 'modal-section__title' }, [
    createElement('span', { 'aria-hidden': 'true' }, ['🔄']),
    'Chơi lại từ đầu (Bắt đầu hành trình mới)',
  ]);
  resetSection.appendChild(resetTitle);

  const resetDesc = createElement('p', {
    style: 'font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: 12px; line-height: 1.5;',
  }, [
    'Xóa toàn bộ điểm số, huy hiệu và các trạm đã vượt qua để bạn hoặc bé khác bắt đầu lại từ đầu.',
  ]);
  resetSection.appendChild(resetDesc);

  // Hộp xác nhận inline an toàn (không dùng window.confirm)
  const confirmBox = createElement('div', {
    class: 'reset-confirm-box',
    id: 'reset-confirm-box',
    style: 'display: none;',
  }, [
    createElement('p', {
      style: 'font-weight: 700; color: #fca5a5; font-size: var(--font-size-xs); margin-bottom: 10px;',
    }, [
      '⚠️ Bạn có chắc chắn muốn xóa điểm và chơi lại từ đầu không?',
    ]),
    createElement('div', { style: 'display: flex; gap: 8px; justify-content: center;' }, [
      createButton({
        id: 'btn-confirm-reset-yes',
        text: 'Đồng ý chơi lại',
        variant: 'primary',
        className: 'btn-danger-outline',
        icon: '✓',
        onClick: () => {
          playerService.resetProgress();
          try {
            audioService.playTapSound();
          } catch {
            // Safe
          }
          closePlayerSettingsModal();
          if (typeof onResetSuccess === 'function') {
            onResetSuccess();
          }
        },
      }),
      createButton({
        id: 'btn-confirm-reset-no',
        text: 'Không, giữ nguyên',
        variant: 'ghost',
        onClick: () => {
          confirmBox.style.display = 'none';
          startOverBtn.style.display = '';
        },
      }),
    ]),
  ]);

  const startOverBtn = createButton({
    id: 'btn-start-over-trigger',
    text: 'CHƠI LẠI TỪ ĐẦU',
    icon: '🔄',
    variant: 'ghost',
    className: 'btn-danger-outline',
    onClick: () => {
      startOverBtn.style.display = 'none';
      confirmBox.style.display = 'block';
    },
  });

  resetSection.appendChild(startOverBtn);
  resetSection.appendChild(confirmBox);
  card.appendChild(resetSection);

  // Đóng modal khi click ra ngoài overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      handleClose();
    }
  });

  // Đóng modal khi nhấn Escape
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }
  document.addEventListener('keydown', handleKeyDown);

  function handleClose() {
    document.removeEventListener('keydown', handleKeyDown);
    closePlayerSettingsModal();
    if (typeof onClose === 'function') {
      onClose();
    }
  }

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  // Tự động focus vào ô nhập tên
  setTimeout(() => {
    renameInput.focus();
    renameInput.select();
  }, 100);
}
