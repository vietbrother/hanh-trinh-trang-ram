/**
 * Component hiển thị huy hiệu (Badge Card)
 */
import { createElement } from '../utils/dom.js';

/**
 * Tạo thẻ vinh danh huy hiệu đạt được
 * @param {Object} props
 * @param {Object} props.badge
 * @returns {HTMLElement}
 */
export function createBadgeCard({ badge }) {
  return createElement('div', { class: 'badge-card', id: `badge-card-${badge.id}` }, [
    createElement('div', { class: 'badge-card__icon', 'aria-hidden': 'true' }, [badge.icon || '🏅']),
    createElement('h3', { class: 'badge-card__title' }, [badge.title || badge.name]),
    createElement('p', { class: 'badge-card__desc' }, [badge.description]),
  ]);
}
