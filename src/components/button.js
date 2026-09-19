/**
 * Reusable Button Component
 */
import { createElement } from '../utils/dom.js';
import { audioService } from '../services/audio.service.js';

/**
 * Tạo một button tái sử dụng
 * @param {Object} props
 * @param {string} props.text - Nhãn nút
 * @param {Function} props.onClick - Handler
 * @param {'primary'|'secondary'|'audio'|'ghost'} [props.variant='primary']
 * @param {string} [props.icon] - Biểu tượng emoji hoặc ký tự
 * @param {string} [props.className] - Lớp CSS bổ sung
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.id]
 * @param {string} [props.type='button']
 * @returns {HTMLButtonElement}
 */
export function createButton({
  text,
  onClick,
  variant = 'primary',
  icon = '',
  className = '',
  disabled = false,
  id = '',
  type = 'button',
}) {
  const children = [];

  if (icon) {
    children.push(createElement('span', { class: 'btn-icon', 'aria-hidden': 'true' }, [icon]));
  }
  children.push(createElement('span', { class: 'btn-text' }, [text]));

  const btn = createElement('button', {
    id: id || undefined,
    type,
    class: `app-btn app-btn--${variant} ${className}`.trim(),
    disabled: disabled ? 'disabled' : undefined,
    onClick: (e) => {
      if (!disabled) {
        audioService.unlockAudio();
        if (typeof onClick === 'function') {
          onClick(e);
        }
      }
    },
  }, children);

  return btn;
}

