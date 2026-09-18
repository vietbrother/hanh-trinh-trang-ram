/**
 * Tiện ích xác thực dữ liệu đầu vào
 */
import { GAME_CONFIG } from '../config/game.config.js';

/**
 * Kiểm tra tính hợp lệ của nickname
 * @param {string} nickname 
 * @returns {{ isValid: boolean, error?: string, sanitizedValue: string }}
 */
export function validateNickname(nickname) {
  if (typeof nickname !== 'string') {
    return { isValid: false, error: 'Tên không hợp lệ', sanitizedValue: '' };
  }

  const trimmed = nickname.trim();
  const { minLength, maxLength } = GAME_CONFIG.nickname;

  if (!trimmed) {
    return { isValid: false, error: 'Hãy nhập tên của bạn nhé!', sanitizedValue: '' };
  }

  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `Tên cần ít nhất ${minLength} ký tự bạn nhé!`,
      sanitizedValue: trimmed,
    };
  }

  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `Tên không quá ${maxLength} ký tự bạn nhé!`,
      sanitizedValue: trimmed.slice(0, maxLength),
    };
  }

  return {
    isValid: true,
    sanitizedValue: trimmed,
  };
}
