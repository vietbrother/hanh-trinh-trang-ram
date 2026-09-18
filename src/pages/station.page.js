/**
 * Trang Trạm Thám Hiểm (Station Page - Generic Data-Driven)
 * Hoạt động cho Trạm 01 và sẵn sàng cho Trạm 02, 03, 04, 05
 */
import { createElement } from '../utils/dom.js';
import { createButton } from '../components/button.js';
import { createCard } from '../components/card.js';
import { createStationHeader } from '../components/station-header.js';
import { createQuestionCard } from '../components/question-card.js';
import { createPuzzleBoard } from '../components/puzzle-board.js';
import { createCreativeLantern } from '../components/creative-lantern.js';
import { createBadgeCard } from '../components/badge-card.js';
import { createFeedbackMessage } from '../components/feedback-message.js';
import { stationService } from '../services/station.service.js';
import { playerService } from '../services/player.service.js';
import { audioService } from '../services/audio.service.js';
import { navigateToGateway } from '../utils/url.js';
import { MESSAGES_DATA } from '../data/messages.data.js';

export function renderStationPage(container, stationCode) {
  container.innerHTML = '';
  const page = createElement('main', { class: 'page-container', id: 'page-station' });

  // 1. KIỂM TRA NGƯỜI CHƠI (Nếu chưa có nickname -> Nhắc về Gateway)
  const player = playerService.getPlayer();
  if (!player) {
    const missingCard = createCard({
      variant: 'gold',
      id: 'missing-player-card',
      children: [
        createElement('div', { style: 'text-align: center; padding: var(--spacing-4) 0;' }, [
          createElement('div', { style: 'font-size: 3rem; margin-bottom: var(--spacing-3);', 'aria-hidden': 'true' }, [
            MESSAGES_DATA.errors.missingPlayer.icon,
          ]),
          createElement('h2', { style: 'color: var(--color-accent-gold); margin-bottom: var(--spacing-2);' }, [
            MESSAGES_DATA.errors.missingPlayer.title,
          ]),
          createElement('p', { style: 'margin-bottom: var(--spacing-6); color: var(--color-text-main);' }, [
            MESSAGES_DATA.errors.missingPlayer.desc,
          ]),
          createButton({
            id: 'btn-go-gateway-first',
            text: MESSAGES_DATA.errors.missingPlayer.cta,
            variant: 'primary',
            icon: '🐰',
            onClick: () => {
              navigateToGateway();
            },
          }),
        ]),
      ],
    });

    page.appendChild(missingCard);
    container.appendChild(page);
    return;
  }

  // 2. KIỂM TRA MÃ TRẠM HỢP LỆ (Nếu ?station=999 -> Báo lỗi thân thiện)
  const station = stationService.getStationByParam(stationCode);
  if (!station) {
    const errorCard = createCard({
      variant: 'default',
      id: 'invalid-station-card',
      children: [
        createElement('div', { style: 'text-align: center; padding: var(--spacing-4) 0;' }, [
          createElement('div', { style: 'font-size: 3rem; margin-bottom: var(--spacing-3);', 'aria-hidden': 'true' }, [
            MESSAGES_DATA.errors.stationNotFound.icon,
          ]),
          createElement('h2', { style: 'color: var(--color-accent-gold); margin-bottom: var(--spacing-2);' }, [
            MESSAGES_DATA.errors.stationNotFound.title,
          ]),
          createElement('p', { style: 'margin-bottom: var(--spacing-6);' }, [
            MESSAGES_DATA.errors.stationNotFound.desc,
          ]),
          createButton({
            id: 'btn-back-to-gateway',
            text: MESSAGES_DATA.errors.stationNotFound.cta,
            variant: 'secondary',
            icon: '🧭',
            onClick: () => {
              navigateToGateway();
            },
          }),
        ]),
      ],
    });

    page.appendChild(errorCard);
    container.appendChild(page);
    return;
  }

  // 3. TRẠM HỢP LỆ — RENDER GIAO DIỆN KHÁM PHÁ
  const isAlreadyCompleted = playerService.hasCompletedStation(station.id);
  const badge = stationService.getBadgeById(station.badgeId);

  // Thanh điều hướng nhanh về Hộ Chiếu / Bản đồ
  const topNav = createElement('div', { class: 'station-top-nav' }, [
    createButton({
      id: 'btn-nav-passport',
      text: 'HỘ CHIẾU THÁM HIỂM',
      icon: '🧭',
      variant: 'secondary',
      className: 'app-btn--compact',
      onClick: () => {
        navigateToGateway();
      },
    }),
  ]);
  page.appendChild(topNav);

  // Station Header
  page.appendChild(
    createStationHeader({
      title: station.title,
      icon: station.icon,
      badgeTag: `TRẠM ${station.code}`,
    })
  );

  // Storytelling & Audio
  const storyChildren = [
    createElement('div', { class: 'story-bubble' }, [
      createElement('p', { style: 'font-weight: 700; color: var(--color-accent-gold); margin-bottom: 4px;' }, [
        station.story.mascotCallout,
      ]),
      createElement('p', {}, [station.story.guidance]),
    ]),
  ];

  // Nút nghe nhiệm vụ giọng Thỏ Ngọc (nếu có audio)
  if (station.audio && station.audio.textToSpeak) {
    const audioBtn = createButton({
      id: 'btn-listen-mission',
      text: station.audio.label || 'Nghe Thỏ Ngọc dặn dò',
      icon: '🔊',
      variant: 'audio',
      onClick: () => {
        audioBtn.classList.add('is-speaking');
        audioService.speakText(station.audio.textToSpeak, () => {
          audioBtn.classList.remove('is-speaking');
        });
      },
    });
    storyChildren.push(audioBtn);
  }

  const storyCard = createCard({
    variant: 'story',
    id: 'story-card',
    children: storyChildren,
  });
  page.appendChild(storyCard);

  // Hành vi cốt lõi: BỎ ĐIỆN THOẠI XUỐNG & QUAN SÁT MÔ HÌNH VẬT LÝ THẬT
  if (station.physicalClue) {
    const physicalBox = createElement('div', { class: 'physical-clue-box', id: 'physical-clue-box' }, [
      createElement('div', { class: 'physical-clue-box__icon', 'aria-hidden': 'true' }, [station.physicalClue.icon]),
      createElement('div', { class: 'physical-clue-box__text' }, [
        createElement('h4', {}, [station.physicalClue.title]),
        createElement('p', {}, [station.physicalClue.text]),
      ]),
    ]);
    page.appendChild(physicalBox);
  }

  // Khu vực tương tác câu hỏi, puzzle hoặc creative builder
  const interactiveContainer = createElement('div', { id: 'station-interactive-zone' });

  if (isAlreadyCompleted) {
    // Nếu trạm đã hoàn thành từ trước (refresh hoặc quay lại quét lại QR)
    const completedBanner = createElement('div', {
      style: 'text-align: center; margin-bottom: var(--spacing-4);',
    }, [
      createElement('div', {
        style: 'display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: rgba(34, 197, 94, 0.2); border: 1px solid rgba(34, 197, 94, 0.4); border-radius: var(--radius-pill); color: #86efac; font-weight: 700; font-size: var(--font-size-xs); margin-bottom: var(--spacing-3);',
      }, ['✨ ĐÃ HOÀN THÀNH']),
      createElement('p', { style: 'font-size: var(--font-size-sm); color: var(--color-text-main); margin-bottom: var(--spacing-4);' }, [
        `Bạn đã nhận 10 điểm và ${badge?.name || 'huy hiệu'} của trạm này rồi. Hãy tiếp tục khám phá các trạm khác trên mô hình nhé!`,
      ]),
    ]);

    interactiveContainer.appendChild(completedBanner);

    // Nếu là Trạm 05 và bé đã có thiết kế đèn lồng, hiển thị lại tác phẩm của bé
    if (station.interaction?.type === 'creative' && player.creativeDesign) {
      const savedCreativeCard = createCreativeLantern({
        creativeData: station.creative,
        playerNickname: player.nickname,
        initialDesign: player.creativeDesign,
        disabled: true,
      });
      interactiveContainer.appendChild(savedCreativeCard);
    }

    if (badge) {
      interactiveContainer.appendChild(createBadgeCard({ badge }));
    }

    interactiveContainer.appendChild(
      createElement('div', { style: 'margin-top: var(--spacing-4);' }, [
        createButton({
          id: 'btn-view-passport',
          text: 'VỀ HỘ CHIẾU THÁM HIỂM',
          icon: '🧭',
          variant: 'primary',
          onClick: () => {
            navigateToGateway();
          },
        }),
      ])
    );
  } else {
    // Trạm chưa hoàn thành: Render interaction phù hợp
    renderInteractionZone(station, badge, interactiveContainer);
  }

  page.appendChild(interactiveContainer);
  container.appendChild(page);
}

/**
 * Điều phối render bộ tương tác (Single-choice, Puzzle, Creative)
 */
function renderInteractionZone(station, badge, interactiveContainer) {
  interactiveContainer.innerHTML = '';
  const interactionType = station.interaction?.type || 'single-choice';

  if (interactionType === 'puzzle') {
    // TRẠM 03: Mini Puzzle tap-to-swap
    const puzzleBoard = createPuzzleBoard({
      puzzle: station.puzzle,
      disabled: false,
      onPuzzleSolved: () => {
        handleSuccess(station, badge, interactiveContainer);
      },
    });
    interactiveContainer.appendChild(puzzleBoard);
  } else if (interactionType === 'creative') {
    // TRẠM 05: Creative Lantern Builder
    const player = playerService.getPlayer();
    const creativeComponent = createCreativeLantern({
      creativeData: station.creative,
      playerNickname: player?.nickname || 'Bé',
      initialDesign: player?.creativeDesign || null,
      disabled: false,
      onCompleted: (design) => {
        handleSuccess(station, badge, interactiveContainer, { creativeDesign: design });
      },
    });
    interactiveContainer.appendChild(creativeComponent);
  } else {
    // TRẠM 01, 02, 04: Single-choice question
    const questionCard = createQuestionCard({
      question: station.question,
      disabled: false,
      onAnswerSelected: (selectedOpt) => {
        if (!selectedOpt.isCorrect) {
          handleWrongAnswer(station, badge, interactiveContainer);
        } else {
          handleSuccess(station, badge, interactiveContainer);
        }
      },
    });
    interactiveContainer.appendChild(questionCard);
  }
}

/**
 * Xử lý khi trẻ chọn đáp án SAI (Không phạt, cho thử lại vui vẻ)
 */
function handleWrongAnswer(station, badge, interactiveContainer) {
  audioService.playWrongSound();

  interactiveContainer.innerHTML = '';
  const feedback = createFeedbackMessage({
    type: 'wrong',
    onRetry: () => {
      renderInteractionZone(station, badge, interactiveContainer);
    },
  });
  interactiveContainer.appendChild(feedback);
}

/**
 * Xử lý khi hoàn thành nhiệm vụ ĐÚNG (Trao điểm + Huy hiệu + Confetti)
 */
function handleSuccess(station, badge, interactiveContainer, extraData = {}) {
  audioService.playSuccessSound();

  // Gọi playerService an toàn (chống lặp điểm)
  playerService.completeStation(station.id, station.reward.points, station.badgeId, extraData);

  // Hiển thị giao diện vinh danh chiến thắng
  interactiveContainer.innerHTML = '';

  // Thêm hiệu ứng pháo hoa giấy vui nhộn nhẹ nhàng
  triggerConfetti();

  const correctFeedback = createFeedbackMessage({
    type: 'correct',
    customData: {
      title: station.reward.successTitle || MESSAGES_DATA.feedback.correct.title,
      desc: station.reward.successDesc || MESSAGES_DATA.feedback.correct.desc,
      pointsBadge: `⭐ +${station.reward.points} điểm`,
    },
    onContinue: () => {
      // Về cổng vào để ngắm hộ chiếu và tiếp tục hành trình
      navigateToGateway();
    },
  });

  interactiveContainer.appendChild(correctFeedback);

  // Hiển thị huy hiệu vừa đạt được
  if (badge) {
    const badgeElement = createBadgeCard({ badge });
    badgeElement.style.marginTop = 'var(--spacing-4)';
    interactiveContainer.appendChild(badgeElement);
  }
}

/**
 * Hiệu ứng hoa giấy rực rỡ nhẹ (CSS purely, không tốn CPU)
 */
function triggerConfetti() {
  const container = createElement('div', { class: 'confetti-container' });
  const colors = ['#f59e0b', '#fbbf24', '#f43f5e', '#38bdf8', '#4ade80', '#a855f7'];

  for (let i = 0; i < 24; i++) {
    const piece = createElement('div', { class: 'confetti-piece' });
    piece.style.left = `${Math.random() * 95}%`;
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    piece.style.animationDuration = `${1.6 + Math.random() * 0.8}s`;
    container.appendChild(piece);
  }

  document.body.appendChild(container);
  setTimeout(() => {
    container.remove();
  }, 2600);
}
