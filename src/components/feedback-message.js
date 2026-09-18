/**
 * Component hiển thị thông báo phản hồi kết quả (Feedback Message)
 */
import { createElement } from '../utils/dom.js';
import { createButton } from './button.js';
import { MESSAGES_DATA } from '../data/messages.data.js';

/**
 * Tạo khối phản hồi kết quả trả lời
 * @param {Object} props
 * @param {'wrong'|'correct'} props.type
 * @param {Function} [props.onRetry]
 * @param {Function} [props.onContinue]
 * @param {Object} [props.customData]
 * @returns {HTMLElement}
 */
export function createFeedbackMessage({ type, onRetry, onContinue, customData = {} }) {
  if (type === 'wrong') {
    const banner = createElement('div', { class: 'feedback-banner feedback-banner--wrong', id: 'feedback-wrong' }, [
      createElement('div', { style: 'font-size: 2.2rem; margin-bottom: 8px;', 'aria-hidden': 'true' }, [
        MESSAGES_DATA.feedback.wrong.icon,
      ]),
      createElement('h3', {}, [MESSAGES_DATA.feedback.wrong.title]),
      createElement('p', { style: 'margin: 8px 0 16px;' }, [MESSAGES_DATA.feedback.wrong.desc]),
      createButton({
        text: MESSAGES_DATA.feedback.wrong.retryBtn,
        onClick: onRetry,
        variant: 'secondary',
        icon: '🔄',
        id: 'btn-retry-answer',
      }),
    ]);
    return banner;
  }

  if (type === 'correct') {
    const banner = createElement('div', { class: 'feedback-banner feedback-banner--correct', id: 'feedback-correct' }, [
      createElement('div', { style: 'font-size: 2.5rem; margin-bottom: 8px;', 'aria-hidden': 'true' }, [
        MESSAGES_DATA.feedback.correct.icon,
      ]),
      createElement('h3', {}, [MESSAGES_DATA.feedback.correct.title]),
      createElement('p', { style: 'margin: 6px 0 12px; font-weight: 500;' }, [MESSAGES_DATA.feedback.correct.desc]),
      createElement(
        'div',
        {
          style: 'display: inline-block; padding: 6px 14px; background: rgba(250, 204, 21, 0.2); border: 1px solid var(--color-border-highlight); border-radius: var(--radius-pill); color: var(--color-accent-gold); font-weight: 700; margin-bottom: 16px;',
        },
        [customData.pointsBadge || '⭐ +10 điểm']
      ),
    ]);

    if (onContinue) {
      banner.appendChild(
        createButton({
          text: MESSAGES_DATA.feedback.correct.continueBtn,
          onClick: onContinue,
          variant: 'primary',
          icon: '🚀',
          id: 'btn-continue-journey',
        })
      );
    }

    return banner;
  }

  return createElement('div');
}
