/**
 * Component Bàn Ghép Hình (Puzzle Board) cho Trạm 03: Núi
 * Cơ chế: Tap-to-swap 2x2 grid mượt mà, thân thiện với trẻ em trên mobile
 * Không dùng thư viện ngoài, không canvas nặng, thuần DOM & CSS
 */
import { createElement } from '../utils/dom.js';
import { audioService } from '../services/audio.service.js';

export function createPuzzleBoard({ puzzle, disabled = false, onPuzzleSolved }) {
  const container = createElement('div', { class: 'puzzle-board-container', id: 'puzzle-board' });

  // Khởi tạo trạng thái mảnh ghép từ data
  const piecesData = puzzle.pieces || [];
  const initialPositions = puzzle.initialPositions || [2, 0, 3, 1];

  // currentSlots[slotIndex] = pieceId
  let currentSlots = [...initialPositions].map((idx) => piecesData[idx].id);
  let selectedSlotIndex = null;
  let isSolved = false;

  // Hướng dẫn thao tác
  const hintEl = createElement('div', { class: 'puzzle-hint', id: 'puzzle-hint' }, [
    '👉 Chạm vào một ô, rồi chạm ô khác để đổi chỗ hai mảnh hình cho nhau nhé!',
  ]);
  container.appendChild(hintEl);

  // Lưới 2x2
  const gridEl = createElement('div', {
    class: 'puzzle-grid',
    role: 'grid',
    'aria-label': 'Bàn ghép hình 4 mảnh địa hình Núi',
  });
  container.appendChild(gridEl);

  /**
   * Kiểm tra xem các mảnh đã về đúng vị trí chưa
   */
  function checkSolved() {
    for (let slot = 0; slot < currentSlots.length; slot++) {
      const pieceId = currentSlots[slot];
      const piece = piecesData.find((p) => p.id === pieceId);
      if (!piece || piece.correctPosition !== slot) {
        return false;
      }
    }
    return true;
  }

  /**
   * Render lại các ô mảnh ghép
   */
  function renderSlots() {
    gridEl.innerHTML = '';

    currentSlots.forEach((pieceId, slotIndex) => {
      const piece = piecesData.find((p) => p.id === pieceId);
      const isSelected = selectedSlotIndex === slotIndex;
      const isCorrectSlot = piece.correctPosition === slotIndex;

      const slotBtn = createElement(
        'button',
        {
          type: 'button',
          class: `puzzle-slot ${isSelected ? 'puzzle-slot--selected' : ''} ${
            isCorrectSlot ? 'puzzle-slot--matched' : ''
          }`,
          id: `puzzle-slot-${slotIndex}`,
          'aria-label': `Ô số ${slotIndex + 1}: ${piece.label}. ${
            isSelected ? 'Đang chọn.' : ''
          } ${isCorrectSlot ? 'Đã đúng vị trí.' : ''}`,
          'aria-pressed': isSelected ? 'true' : 'false',
          disabled: disabled || isSolved ? 'true' : undefined,
        },
        [
          createElement('div', { class: 'puzzle-slot__icon', 'aria-hidden': 'true' }, [piece.icon]),
          createElement('div', { class: 'puzzle-slot__label' }, [piece.label]),
          isCorrectSlot
            ? createElement('div', { class: 'puzzle-slot__check', 'aria-hidden': 'true' }, ['✓'])
            : null,
        ]
      );

      slotBtn.addEventListener('click', () => {
        handleSlotClick(slotIndex);
      });

      gridEl.appendChild(slotBtn);
    });
  }

  /**
   * Xử lý tap-to-swap
   */
  function handleSlotClick(slotIndex) {
    if (disabled || isSolved) return;

    // Lần chạm đầu tiên: Chọn ô A
    if (selectedSlotIndex === null) {
      selectedSlotIndex = slotIndex;
      audioService.playTone(440, 0.08); // Phản hồi âm thanh nhẹ
      hintEl.textContent = `✨ Đang chọn mảnh "${piecesData.find(p => p.id === currentSlots[slotIndex])?.label}". Hãy chạm tiếp ô bạn muốn đổi chỗ!`;
      renderSlots();
      return;
    }

    // Nếu chạm lại đúng ô đã chọn: Bỏ chọn
    if (selectedSlotIndex === slotIndex) {
      selectedSlotIndex = null;
      hintEl.textContent = '👉 Chạm vào một ô, rồi chạm ô khác để đổi chỗ hai mảnh hình cho nhau nhé!';
      renderSlots();
      return;
    }

    // Chạm ô thứ hai B: Tiến hành hoán đổi (Swap)
    const slotA = selectedSlotIndex;
    const slotB = slotIndex;

    const temp = currentSlots[slotA];
    currentSlots[slotA] = currentSlots[slotB];
    currentSlots[slotB] = temp;

    selectedSlotIndex = null;
    audioService.playTone(587.33, 0.12); // Âm thanh hoán đổi thành công

    // Kiểm tra đã giải xong chưa
    if (checkSolved()) {
      isSolved = true;
      hintEl.innerHTML = '🎉 <strong>TUYỆT VỜI! Bạn đã ghép đúng bức tranh Núi rồi!</strong>';
      hintEl.style.color = '#86efac';
      renderSlots();

      if (typeof onPuzzleSolved === 'function') {
        setTimeout(() => {
          onPuzzleSolved();
        }, 500);
      }
      return;
    }

    hintEl.textContent = '👉 Đã đổi chỗ! Hãy tiếp tục sắp xếp cho bức tranh hoàn chỉnh nhé.';
    renderSlots();
  }

  // Khởi động render
  renderSlots();

  return container;
}
