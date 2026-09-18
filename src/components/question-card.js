/**
 * Component thẻ câu hỏi tương tác (Question Card)
 * Tái sử dụng cho mọi trạm trong tương lai (Trạm 01, 02, 03,...)
 */
import { createElement } from '../utils/dom.js';
import { audioService } from '../services/audio.service.js';

/**
 * Tạo thẻ câu hỏi nhiệm vụ
 * @param {Object} props
 * @param {Object} props.question - Dữ liệu câu hỏi { id, text, options }
 * @param {Function} props.onAnswerSelected - Callback khi chọn đáp án (option)
 * @param {boolean} [props.disabled=false]
 * @returns {HTMLElement}
 */
export function createQuestionCard({ question, onAnswerSelected, disabled = false }) {
  const container = createElement('div', { class: 'app-card app-card--gold', id: 'question-card' });

  // Tiêu đề câu hỏi
  const title = createElement('h3', { style: 'margin-bottom: var(--spacing-2); color: var(--color-accent-gold);' }, [
    '❓ Câu hỏi thử thách',
  ]);
  const text = createElement('p', { style: 'color: var(--color-text-main); font-weight: 600;' }, [
    question.text,
  ]);

  // Danh sách các lựa chọn
  const optionsList = createElement('div', { class: 'question-options-list', role: 'group', 'aria-label': question.text });

  question.options.forEach((opt) => {
    const btn = createElement(
      'button',
      {
        type: 'button',
        class: 'question-option',
        id: `btn-opt-${opt.id}`,
        disabled: disabled ? 'disabled' : undefined,
        onClick: () => {
          audioService.playTapSound();
          if (typeof onAnswerSelected === 'function') {
            onAnswerSelected(opt);
          }
        },
      },
      [
        createElement('div', { class: 'question-option__icon', 'aria-hidden': 'true' }, [opt.icon]),
        createElement('div', { class: 'question-option__content' }, [
          createElement('span', { class: 'question-option__label' }, [opt.label]),
          opt.description ? createElement('span', { class: 'question-option__desc' }, [opt.description]) : null,
        ]),
      ]
    );

    optionsList.appendChild(btn);
  });

  container.appendChild(title);
  container.appendChild(text);
  container.appendChild(optionsList);

  return container;
}
