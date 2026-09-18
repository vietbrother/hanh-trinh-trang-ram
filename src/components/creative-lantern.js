/**
 * Component Thiết kế Đèn lồng số (Creative Lantern Builder) cho Trạm 05: Phố Đèn Lồng
 * Thuần HTML/CSS nhẹ, không AI tạo ảnh, an toàn tuyệt đối cho trẻ em
 */
import { createElement } from '../utils/dom.js';
import { createButton } from './button.js';
import { audioService } from '../services/audio.service.js';

export function createCreativeLantern({
  creativeData,
  playerNickname = 'Bé',
  initialDesign = null,
  disabled = false,
  onCompleted,
}) {
  const container = createElement('div', { class: 'creative-lantern-container', id: 'creative-lantern' });

  const colors = creativeData.colors || [
    { id: 'red', label: 'Đỏ', hex: '#ef4444', icon: '🔴', glow: 'rgba(239, 68, 68, 0.4)' },
    { id: 'gold', label: 'Vàng', hex: '#f59e0b', icon: '🟡', glow: 'rgba(245, 158, 11, 0.4)' },
    { id: 'blue', label: 'Xanh', hex: '#0284c7', icon: '🔵', glow: 'rgba(2, 132, 199, 0.4)' },
  ];

  const patterns = creativeData.patterns || [
    { id: 'star', label: 'Ngôi sao', icon: '⭐' },
    { id: 'moon', label: 'Mặt trăng', icon: '🌙' },
    { id: 'rabbit', label: 'Thỏ Ngọc', icon: '🐰' },
    { id: 'flower', label: 'Bông hoa', icon: '🌸' },
  ];

  let selectedColorId = initialDesign?.color || creativeData.defaultColor || 'gold';
  let selectedPatternId = initialDesign?.pattern || creativeData.defaultPattern || 'star';

  // 1. Khung Preview Đèn Lồng
  const previewWrapper = createElement('div', { class: 'lantern-preview-wrapper' });

  const lanternStage = createElement('div', {
    class: 'lantern-stage',
    id: 'lantern-stage',
    'aria-label': 'Bản xem trước chiếc đèn lồng',
  });

  const lanternHanger = createElement('div', { class: 'lantern-hanger' });
  const lanternBody = createElement('div', { class: 'lantern-body', id: 'lantern-body' });
  const lanternPattern = createElement('div', { class: 'lantern-pattern', id: 'lantern-pattern' });
  const lanternTassel = createElement('div', { class: 'lantern-tassel', id: 'lantern-tassel' });

  lanternBody.appendChild(lanternPattern);
  lanternStage.appendChild(lanternHanger);
  lanternStage.appendChild(lanternBody);
  lanternStage.appendChild(lanternTassel);

  // Nhãn tên an toàn (sử dụng createElement text node, không dùng innerHTML)
  const lanternOwnerLabel = createElement('div', { class: 'lantern-owner-tag' }, [
    '🏮 ĐÈN CỦA ',
    createElement('strong', { id: 'lantern-player-name' }, [playerNickname.toUpperCase()]),
  ]);

  previewWrapper.appendChild(lanternStage);
  previewWrapper.appendChild(lanternOwnerLabel);
  container.appendChild(previewWrapper);

  /**
   * Cập nhật visual đèn lồng theo lựa chọn
   */
  function updatePreview() {
    const activeColor = colors.find((c) => c.id === selectedColorId) || colors[0];
    const activePattern = patterns.find((p) => p.id === selectedPatternId) || patterns[0];

    lanternBody.style.setProperty('--lantern-color', activeColor.hex);
    lanternBody.style.setProperty('--lantern-glow', activeColor.glow);
    lanternTassel.style.setProperty('--lantern-color', activeColor.hex);

    lanternPattern.textContent = activePattern.icon;
  }

  if (!disabled) {
    // 2. Bộ chọn Màu sắc
    const colorSection = createElement('div', { class: 'creative-section' }, [
      createElement('h4', { class: 'creative-section__title' }, ['1. CHỌN MÀU ĐÈN LỒNG:']),
    ]);
    const colorPicker = createElement('div', { class: 'color-picker-group', role: 'radiogroup', 'aria-label': 'Chọn màu' });

    colors.forEach((color) => {
      const isSelected = color.id === selectedColorId;
      const colorBtn = createElement(
        'button',
        {
          type: 'button',
          class: `color-chip-btn ${isSelected ? 'is-selected' : ''}`,
          id: `color-chip-${color.id}`,
          'aria-label': `Màu ${color.label}`,
          'aria-checked': isSelected ? 'true' : 'false',
          role: 'radio',
        },
        [
          createElement('span', { class: 'color-chip-btn__swatch', style: `background-color: ${color.hex};` }),
          createElement('span', { class: 'color-chip-btn__label' }, [color.label]),
        ]
      );

      colorBtn.addEventListener('click', () => {
        selectedColorId = color.id;
        audioService.playTone(523.25, 0.08);
        document.querySelectorAll('.color-chip-btn').forEach((btn) => {
          btn.classList.remove('is-selected');
          btn.setAttribute('aria-checked', 'false');
        });
        colorBtn.classList.add('is-selected');
        colorBtn.setAttribute('aria-checked', 'true');
        updatePreview();
      });

      colorPicker.appendChild(colorBtn);
    });
    colorSection.appendChild(colorPicker);
    container.appendChild(colorSection);

    // 3. Bộ chọn Họa tiết
    const patternSection = createElement('div', { class: 'creative-section' }, [
      createElement('h4', { class: 'creative-section__title' }, ['2. CHỌN HỌA TIẾT ĐÊM TRĂNG:']),
    ]);
    const patternPicker = createElement('div', { class: 'pattern-picker-group', role: 'radiogroup', 'aria-label': 'Chọn họa tiết' });

    patterns.forEach((pattern) => {
      const isSelected = pattern.id === selectedPatternId;
      const patternBtn = createElement(
        'button',
        {
          type: 'button',
          class: `pattern-chip-btn ${isSelected ? 'is-selected' : ''}`,
          id: `pattern-chip-${pattern.id}`,
          'aria-label': `Họa tiết ${pattern.label}`,
          'aria-checked': isSelected ? 'true' : 'false',
          role: 'radio',
        },
        [
          createElement('span', { class: 'pattern-chip-btn__icon' }, [pattern.icon]),
          createElement('span', { class: 'pattern-chip-btn__label' }, [pattern.label]),
        ]
      );

      patternBtn.addEventListener('click', () => {
        selectedPatternId = pattern.id;
        audioService.playTone(659.25, 0.08);
        document.querySelectorAll('.pattern-chip-btn').forEach((btn) => {
          btn.classList.remove('is-selected');
          btn.setAttribute('aria-checked', 'false');
        });
        patternBtn.classList.add('is-selected');
        patternBtn.setAttribute('aria-checked', 'true');
        updatePreview();
      });

      patternPicker.appendChild(patternBtn);
    });
    patternSection.appendChild(patternPicker);
    container.appendChild(patternSection);

    // 4. Nút Hoàn thành thiết kế
    const submitWrapper = createElement('div', { style: 'margin-top: var(--spacing-5);' });
    const submitBtn = createButton({
      id: 'btn-complete-creative',
      text: 'THẮP SÁNG ĐÈN LỒNG ĐÊM TRĂNG',
      icon: '✨',
      variant: 'primary',
      onClick: () => {
        audioService.playSuccessSound();
        if (typeof onCompleted === 'function') {
          onCompleted({
            color: selectedColorId,
            pattern: selectedPatternId,
          });
        }
      },
    });
    submitWrapper.appendChild(submitBtn);
    container.appendChild(submitWrapper);
  }

  // Cập nhật preview ban đầu
  updatePreview();

  return container;
}
