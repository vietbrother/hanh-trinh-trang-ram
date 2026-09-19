/**
 * Dịch vụ âm thanh & hiệu ứng thính giác (Audio Service)
 * Hỗ trợ tối ưu cho Safari / iOS WebKit và mọi trình duyệt hiện đại:
 * - Tự động Unlock AudioContext trên cử chỉ tương tác đầu tiên (Safari audio autoplay policy)
 * - Sử dụng linear ramps an toàn, tránh lỗi WebKit timing / exponentialRampToValueAtTime
 * - Tích hợp cơ chế phát HTML5 Audio (Data URI WAV siêu nhẹ tạo động) dự phòng tức thì khi AudioContext bị treo/suspended
 * - Hỗ trợ phát âm giọng nói (SpeechSynthesis) khi trẻ nhấn "Nghe nhiệm vụ".
 */
import { storageService } from './storage.service.js';

/**
 * Trợ thủ tạo chuỗi nhị phân WAV Data URI chuẩn PCM 16-bit Mono trong bộ nhớ
 */
function createWavDataUri(duration, sampleRate, generatorFn) {
  const numSamples = Math.floor(duration * sampleRate);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // ByteRate (sampleRate * 1 * 2)
  view.setUint16(32, 2, true); // BlockAlign (1 * 2)
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, generatorFn(t, duration)));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    view.setInt16(44 + i * 2, intSample, true);
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
}

class AudioService {
  constructor() {
    this._ctx = null;
    this._isMuted = storageService.isAudioMuted();
    this._isSpeaking = false;
    this._preloadedSounds = {};
    this._isUnlocked = false;

    // Tự động lắng nghe cử chỉ tương tác đầu tiên để unlock Safari Audio
    this._initSafariUnlock();
  }

  /**
   * Mở khóa AudioContext cho Safari trên cử chỉ chạm/click đầu tiên
   * @private
   */
  _initSafariUnlock() {
    if (typeof window === 'undefined') return;

    const unlockHandler = () => {
      this.unlockAudio();
      ['touchstart', 'touchend', 'pointerdown', 'click', 'keydown'].forEach((evt) => {
        window.removeEventListener(evt, unlockHandler, { capture: true });
      });
    };

    ['touchstart', 'touchend', 'pointerdown', 'click', 'keydown'].forEach((evt) => {
      window.addEventListener(evt, unlockHandler, { capture: true, passive: true });
    });
  }

  /**
   * Mở khóa AudioContext theo chuẩn Apple WebKit
   */
  unlockAudio() {
    if (this._isMuted) return;
    try {
      if (!this._ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this._ctx = new AudioCtx();
      }
      if (this._ctx) {
        if (this._ctx.state === 'suspended') {
          this._ctx.resume().catch(() => {});
        }
        if (!this._isUnlocked) {
          // Phát 1 buffer im lặng để mở khóa pipeline âm thanh của Safari WebKit
          const silentBuffer = this._ctx.createBuffer(1, 1, 22050);
          const source = this._ctx.createBufferSource();
          source.buffer = silentBuffer;
          source.connect(this._ctx.destination);
          source.start(0);
          this._isUnlocked = true;
        }
      }
    } catch {
      // Safe ignore
    }
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
        this._ctx.resume().catch(() => {});
      }
      return this._ctx;
    } catch {
      return null;
    }
  }

  /**
   * Tạo chuỗi WAV Data URI dự phòng cho các âm thanh chính
   * @private
   */
  _getSoundUri(type) {
    if (this._preloadedSounds[type]) {
      return this._preloadedSounds[type];
    }

    if (type === 'tap') {
      this._preloadedSounds.tap = createWavDataUri(0.05, 22050, (t, dur) => {
        const freq = 520 - (t / dur) * 80;
        const env = Math.pow(1 - t / dur, 2);
        return Math.sin(2 * Math.PI * freq * t) * env * 0.35;
      });
    } else if (type === 'success') {
      this._preloadedSounds.success = createWavDataUri(0.45, 22050, (t) => {
        const notes = [
          { f: 523.25, start: 0.0, end: 0.35 },
          { f: 659.25, start: 0.09, end: 0.38 },
          { f: 783.99, start: 0.18, end: 0.42 },
          { f: 1046.50, start: 0.27, end: 0.45 },
        ];
        let val = 0;
        for (const note of notes) {
          if (t >= note.start && t < note.end) {
            const noteT = t - note.start;
            const env = Math.exp(-noteT * 7);
            val += Math.sin(2 * Math.PI * note.f * noteT) * env * 0.25;
          }
        }
        return val;
      });
    } else if (type === 'wrong') {
      this._preloadedSounds.wrong = createWavDataUri(0.32, 22050, (t, dur) => {
        const freq = 330 - (t / dur) * 70;
        const env = Math.pow(1 - t / dur, 1.5);
        return Math.sin(2 * Math.PI * freq * t) * env * 0.35;
      });
    }

    return this._preloadedSounds[type];
  }

  /**
   * Phát âm thanh qua thẻ HTML5 Audio (dự phòng tối đa cho Safari khi Web Audio bị treo)
   * @private
   */
  _playHtml5(type) {
    if (this._isMuted) return;
    try {
      const uri = this._getSoundUri(type);
      if (!uri) return;
      const audio = new Audio(uri);
      audio.volume = 0.6;
      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    } catch {
      // Safe ignore
    }
  }

  /**
   * Phát một âm tần số đơn qua HTML5 Audio
   * @private
   */
  _playHtml5Tone(freq, duration) {
    if (this._isMuted) return;
    try {
      const uri = createWavDataUri(duration, 22050, (t, dur) => {
        const env = t < 0.005 ? t / 0.005 : (dur - t) / dur;
        return Math.sin(2 * Math.PI * freq * t) * env * 0.35;
      });
      const audio = new Audio(uri);
      audio.volume = 0.5;
      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    } catch {
      // Safe ignore
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
    this.unlockAudio();

    const ctx = this._getAudioContext();
    if (ctx && ctx.state === 'running') {
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const now = ctx.currentTime + 0.005;

        notes.forEach((freq, idx) => {
          const startTime = now + idx * 0.09;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
          gain.gain.linearRampToValueAtTime(0.0001, startTime + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.35);
        });
        return;
      } catch {
        // Dự phòng bằng HTML5 nếu WebKit gặp lỗi
      }
    }

    // Phát bằng HTML5 Audio dự phòng
    this._playHtml5('success');
  }

  /**
   * Phát một âm tần số đơn (dùng cho phản hồi xúc giác nhẹ khi chạm / đổi chỗ mảnh ghép)
   * @param {number} [freq=440]
   * @param {number} [duration=0.12]
   */
  playTone(freq = 440, duration = 0.12) {
    if (this._isMuted) return;
    this.unlockAudio();

    const ctx = this._getAudioContext();
    if (ctx && ctx.state === 'running') {
      try {
        const startTime = ctx.currentTime + 0.005;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.09, startTime);
        gain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
        return;
      } catch {
        // Fallback
      }
    }

    // Dự phòng phát tone bằng HTML5 Audio
    this._playHtml5Tone(freq, duration);
  }

  /**
   * Âm thanh nhẹ nhàng khi chọn chưa đúng (Tone ấm, không gây cảm giác phạt)
   */
  playWrongSound() {
    if (this._isMuted) return;
    this.unlockAudio();

    const ctx = this._getAudioContext();
    if (ctx && ctx.state === 'running') {
      try {
        const startTime = ctx.currentTime + 0.005;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(329.63, startTime); // E4
        osc.frequency.linearRampToValueAtTime(261.63, startTime + 0.25); // C4

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.linearRampToValueAtTime(0.0001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
        return;
      } catch {
        // Fallback
      }
    }

    this._playHtml5('wrong');
  }

  /**
   * Âm thanh click nút nhẹ
   */
  playTapSound() {
    if (this._isMuted) return;
    this.unlockAudio();

    const ctx = this._getAudioContext();
    if (ctx && ctx.state === 'running') {
      try {
        const startTime = ctx.currentTime + 0.005;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, startTime);
        osc.frequency.linearRampToValueAtTime(440, startTime + 0.04);

        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.linearRampToValueAtTime(0.0001, startTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.06);
        return;
      } catch {
        // Fallback
      }
    }

    this._playHtml5('tap');
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

