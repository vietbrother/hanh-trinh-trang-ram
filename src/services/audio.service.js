/**
 * Dịch vụ âm thanh & hiệu ứng thính giác (Audio Service)
 * Tích hợp Web Audio API siêu nhẹ, không tốn tài nguyên tải file audio lớn,
 * hỗ trợ phát âm giọng nói (SpeechSynthesis) khi trẻ nhấn "Nghe nhiệm vụ".
 */
import { storageService } from './storage.service.js';

class AudioService {
  constructor() {
    this._ctx = null;
    this._isMuted = storageService.isAudioMuted();
    this._isSpeaking = false;
  }

  /**
   * Khởi tạo Web Audio Context an toàn theo user interaction
   * @private
   */
  _getAudioContext() {
    if (this._isMuted) return null;
    try {
      if (!this._ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this._ctx = new AudioCtx();
      }
      if (this._ctx && this._ctx.state === 'suspended') {
        this._ctx.resume();
      }
      return this._ctx;
    } catch {
      return null;
    }
  }

  /**
   * Kiểm tra trạng thái tắt tiếng
   */
  isMuted() {
    return this._isMuted;
  }

  /**
   * Bật/Tắt âm thanh
   */
  toggleMute() {
    this._isMuted = !this._isMuted;
    storageService.setAudioMuted(this._isMuted);
    if (this._isMuted) {
      this.stopAll();
    }
    window.dispatchEvent(new CustomEvent('audio:muted_changed', { detail: { isMuted: this._isMuted } }));
    return this._isMuted;
  }

  /**
   * Âm thanh chuông mừng chiến thắng khi trả lời đúng (Melody pentatonic tươi vui)
   */
  playSuccessSound() {
    if (this._isMuted) return;
    const ctx = this._getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.001, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.4);
    });
  }

  /**
   * Âm thanh nhẹ nhàng khi chọn chưa đúng (Tone ấm, không gây cảm giác phạt)
   */
  playWrongSound() {
    if (this._isMuted) return;
    const ctx = this._getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, now); // E4
    osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.25); // C4

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  /**
   * Âm thanh click nút nhẹ
   */
  playTapSound() {
    if (this._isMuted) return;
    const ctx = this._getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  /**
   * Đọc lời dẫn nhiệm vụ của Thỏ Ngọc bằng SpeechSynthesis (nếu trình duyệt hỗ trợ)
   * @param {string} text 
   * @param {Function} onFinishCallback 
   */
  speakText(text, onFinishCallback) {
    if (this._isMuted) {
      if (onFinishCallback) onFinishCallback();
      return;
    }

    if (!('speechSynthesis' in window)) {
      if (onFinishCallback) onFinishCallback();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95; // Giọng đọc chậm rãi, dễ nghe cho trẻ em
    utterance.pitch = 1.2; // Giọng hơi cao một chút thân thiện như Thỏ Ngọc

    utterance.onend = () => {
      this._isSpeaking = false;
      if (onFinishCallback) onFinishCallback();
    };

    utterance.onerror = () => {
      this._isSpeaking = false;
      if (onFinishCallback) onFinishCallback();
    };

    this._isSpeaking = true;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Dừng toàn bộ âm thanh và giọng đọc
   */
  stopAll() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this._isSpeaking = false;
  }
}

export const audioService = new AudioService();
