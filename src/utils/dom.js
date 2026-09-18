/**
 * Tiện ích DOM an toàn - Chống XSS, tối ưu DOM manipulation
 */

/**
 * Thoát ký tự HTML để đảm bảo an toàn tuyệt đối khi hiển thị văn bản người dùng
 * @param {string} str 
 * @returns {string}
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Tạo một HTMLElement với thuộc tính và con
 * @param {string} tag 
 * @param {Object} attrs 
 * @param {Array<HTMLElement|string>} children 
 * @returns {HTMLElement}
 */
export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);

  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'className' || key === 'class') {
      el.className = val;
    } else if (key === 'dataset' && typeof val === 'object') {
      for (const [dKey, dVal] of Object.entries(val)) {
        el.dataset[dKey] = dVal;
      }
    } else if (key.startsWith('on') && typeof val === 'function') {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, val);
    } else if (key === 'innerHTML') {
      el.innerHTML = val;
    } else if (val !== undefined && val !== null) {
      el.setAttribute(key, String(val));
    }
  }

  const childList = Array.isArray(children) ? children : [children];
  for (const child of childList) {
    if (child === null || child === undefined) continue;
    if (child instanceof HTMLElement || child instanceof SVGElement) {
      el.appendChild(child);
    } else {
      el.appendChild(document.createTextNode(String(child)));
    }
  }

  return el;
}
