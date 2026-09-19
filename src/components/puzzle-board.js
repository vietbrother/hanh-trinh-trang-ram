/**
 * Component Bàn Ghép Hình (Puzzle Board) cho Trạm 03: Núi
 * Cơ chế: Tap-to-swap 2x2 grid mượt mà, thân thiện với trẻ em trên mobile
 * Không dùng thư viện ngoài, không canvas nặng, thuần DOM & CSS
 */
import { createElement } from '../utils/dom.js';
import { createButton } from './button.js';
import { audioService } from '../services/audio.service.js';

export function createPuzzleBoard({ puzzle, disabled = false, onPuzzleSolved }) {
  const container = createElement('div', { class: 'puzzle-board-container', id: 'puzzle-board' });

  // Khởi tạo trạng thái mảnh ghép từ data
  const piecesData = puzzle.pieces || [];
  const initialPositions = puzzle.initialPositions || [2, 0, 3, 1];

  // currentSlots[slotIndex] = pieceId
  let currentSlots = [...initialPositions].map((idx) => piecesData[idx]?.id || '');
  let selectedSlotIndex = null;
  let isSolved = false;
  let hasTriggeredCompletion = false;

  // Hướng dẫn thao tác
  const hintEl = createElement('div', { class: 'puzzle-hint', id: 'puzzle-hint' }, [
    '👉 Chạm vào một ô, rồi chạm ô khác để đổi chỗ hai mảnh hình cho nhau nhé!',
  ]);
  container.appendChild(hintEl);

  // Thanh hiển thị tiến độ số mảnh ghép đúng vị trí
  const progressEl = createElement('div', { class: 'puzzle-progress', id: 'puzzle-progress' });
  container.appendChild(progressEl);

  // Lưới 2x2
  const gridEl = createElement('div', {
    class: 'puzzle-grid',
    role: 'grid',
    'aria-label': 'Bàn ghép hình 4 mảnh địa hình Núi',
  });
  container.appendChild(gridEl);

  // Khối hành động hoàn thành (xuất hiện khi đủ 4 mảnh đúng vị trí)
  const actionEl = createElement('div', {
    class: 'puzzle-actions',
    id: 'puzzle-actions',
    style: 'margin-top: var(--spacing-4); min-height: 48px;',
  });
  container.appendChild(actionEl);

  /**
   * Đếm số mảnh đã ở đúng vị trí
   */
  function getMatchedCount() {
    let count = 0;
    for (let slot = 0; slot < currentSlots.length; slot++) {
      const pieceId = currentSlots[slot];
      const piece = piecesData.find((p) => p.id === pieceId);
      if (piece && piece.correctPosition === slot) {
        count++;
      }
    }
    return count;
  }

  /**
   * Cập nhật văn bản tiến độ
   */
  function updateProgress() {
    const matched = getMatchedCount();
    const total = currentSlots.length;
    if (matched === total) {
      progressEl.innerHTML = `<span class="puzzle-progress__badge puzzle-progress__badge--done">🎉 Hoàn thành: ${matched}/${total} mảnh đúng vị trí!</span>`;
    } else {
      progressEl.innerHTML = `<span class="puzzle-progress__badge">🧩 Tiến độ: <strong>${matched}/${total}</strong> mảnh đúng vị trí</span>`;
    }
  }

  /**
   * Kiểm tra xem toàn bộ các mảnh đã về đúng vị trí chưa
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
   * Kích hoạt hoàn thành thử thách (an toàn, chống gọi lặp)
   */
  function finishChallenge() {
    if (hasTriggeredCompletion) return;
    hasTriggeredCompletion = true;
    isSolved = true;

    try {
      audioService.playSuccessSound();
    } catch {
      // Bỏ qua lỗi audio
    }

    if (typeof onPuzzleSolved === 'function') {
      onPuzzleSolved();
    }
  }

  /**
   * Xử lý trạng thái khi người chơi xếp đúng toàn bộ mảnh ghép
   */
  function handleSolvedState() {
    isSolved = true;
    hintEl.innerHTML = '🎉 <strong>TUYỆT VỜI! Bạn đã ghép đúng bức tranh Núi rồi!</strong>';
    hintEl.style.color = '#86efac';

    updateProgress();
    renderSlots();

    // Hiển thị nút bấm vinh danh để trẻ có thể chạm ngay lập tức
    actionEl.innerHTML = '';
    const completeBtn = createButton({
      id: 'btn-complete-puzzle',
      text: 'NHẬN 10 ĐIỂM & HUY HIỆU NÚI',
      variant: 'primary',
      icon: '🏆',
      onClick: () => {
        finishChallenge();
      },
    });
    actionEl.appendChild(completeBtn);

    // Tự động chuyển tiếp sau 600ms giúp trải nghiệm mượt mà không bắt buộc phải bấm nút
    setTimeout(() => {
      finishChallenge();
    }, 600);
  }

  /**
   * Render lại các ô mảnh ghép
   */
  function renderSlots() {
    gridEl.innerHTML = '';

    currentSlots.forEach((pieceId, slotIndex) => {
      const piece = piecesData.find((p) => p.id === pieceId) || {
        id: pieceId,
        label: 'Mảnh ghép',
        icon: '🧩',
        correctPosition: -1,
      };
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
      try {
        audioService.playTone(440, 0.08); // Phản hồi âm thanh nhẹ
      } catch {
        // Bỏ qua lỗi audio
      }
      const pieceName = piecesData.find((p) => p.id === currentSlots[slotIndex])?.label || 'mảnh ghép';
      hintEl.textContent = `✨ Đang chọn mảnh "${pieceName}". Hãy chạm tiếp ô bạn muốn đổi chỗ!`;
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

    try {
      audioService.playTone(587.33, 0.12); // Âm thanh hoán đổi thành công
    } catch {
      // Bỏ qua lỗi audio
    }

    // Kiểm tra đã giải xong chưa
    if (checkSolved()) {
      handleSolvedState();
      return;
    }

    hintEl.textContent = '👉 Đã đổi chỗ! Hãy tiếp tục sắp xếp cho bức tranh hoàn chỉnh nhé.';
    updateProgress();
    renderSlots();
  }

  // Khởi động render ban đầu
  updateProgress();
  renderSlots();

  // Nếu ngay khi vào đã hoàn chỉnh, kích hoạt trạng thái chiến thắng ngay
  if (checkSolved()) {
    handleSolvedState();
  }

  return container;
}
