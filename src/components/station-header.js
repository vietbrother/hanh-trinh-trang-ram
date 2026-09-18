/**
 * Component tiêu đề trạm thám hiểm (Station Header)
 */
import { createElement } from '../utils/dom.js';

/**
 * Tạo Header cho trạm
 * @param {Object} props
 * @param {string} props.title - Ví dụ: "Trạm 01: Cung Trăng"
 * @param {string} props.icon - Ví dụ: "🌕"
 * @param {string} [props.badgeTag] - Ví dụ: "TRẠM 01"
 * @returns {HTMLElement}
 */
export function createStationHeader({ title, icon, badgeTag = '' }) {
  return createElement('div', { class: 'station-header' }, [
    createElement('div', { class: 'station-header__icon', 'aria-hidden': 'true' }, [icon]),
    createElement('div', { class: 'station-header__info' }, [
      badgeTag ? createElement('span', { class: 'station-header__badge-tag' }, [badgeTag]) : null,
      createElement('h2', {}, [title]),
    ]),
  ]);
}
