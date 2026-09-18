/**
 * Component hiển thị điểm số (Score Display)
 */
import { createElement } from '../utils/dom.js';

/**
 * Tạo huy hiệu hiển thị điểm số của người chơi
 * @param {number} score
 * @returns {HTMLElement}
 */
export function createScoreDisplay(score = 0) {
  return createElement('div', { class: 'player-bar__score-badge', id: 'player-score-badge' }, [
    createElement('span', { 'aria-hidden': 'true' }, ['⭐']),
    createElement('span', { class: 'score-value' }, [`${score} điểm`]),
  ]);
}
