/**
 * Reusable Card Component
 */
import { createElement } from '../utils/dom.js';

/**
 * Tạo một khối Card tái sử dụng
 * @param {Object} props
 * @param {Array<HTMLElement|string>} props.children
 * @param {'default'|'gold'|'story'} [props.variant='default']
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @returns {HTMLElement}
 */
export function createCard({
  children = [],
  variant = 'default',
  className = '',
  id = '',
}) {
  const variantClass = variant !== 'default' ? `app-card--${variant}` : '';
  return createElement(
    'div',
    {
      id: id || undefined,
      class: `app-card ${variantClass} ${className}`.trim(),
    },
    children
  );
}
