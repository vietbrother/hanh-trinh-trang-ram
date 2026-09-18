/**
 * Trang Trạm Thám Hiểm (Station Page - Generic Data-Driven)
 * Hoạt động cho Trạm 01 và sẵn sàng cho Trạm 02, 03, 04, 05
 */
import { createElement } from '../utils/dom.js';
import { createButton } from '../components/button.js';
import { createCard } from '../components/card.js';
import { createStationHeader } from '../components/station-header.js';
import { createQuestionCard } from '../components/question-card.js';
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

  // Nút nghe nhiệm vụ giọng Thỏ Ngọc
  const audioBtn = createButton({
    id: 'btn-listen-mission',
    text: station.audio.label,
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

  const storyCard = createCard({
    variant: 'story',
    id: 'story-card',
    children: storyChildren,
  });
  page.appendChild(storyCard);

  // Hành vi cốt lõi: BỎ ĐIỆN THOẠI XUỐNG & QUAN SÁT MÔ HÌNH VẬT LÝ THẬT
  const physicalBox = createElement('div', { class: 'physical-clue-box', id: 'physical-clue-box' }, [
    createElement('div', { class: 'physical-clue-box__icon', 'aria-hidden': 'true' }, [station.physicalClue.icon]),
    createElement('div', { class: 'physical-clue-box__text' }, [
      createElement('h4', {}, [station.physicalClue.title]),
      createElement('p', {}, [station.physicalClue.text]),
    ]),
  ]);
  page.appendChild(physicalBox);

  // Khu vực tương tác câu hỏi & phản hồi
  const interactiveContainer = createElement('div', { id: 'station-interactive-zone' });

  if (isAlreadyCompleted) {
    // Nếu trạm đã hoàn thành từ trước (refresh hoặc quay lại quét lại QR01)
    const completedBanner = createElement('div', {
      style: 'text-align: center; margin-bottom: var(--spacing-4);',
    }, [
      createElement('div', {
        style: 'display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: rgba(34, 197, 94, 0.2); border: 1px solid rgba(34, 197, 94, 0.4); border-radius: var(--radius-pill); color: #86efac; font-weight: 700; font-size: var(--font-size-xs); margin-bottom: var(--spacing-3);',
      }, ['✨ ĐÃ HOÀN THÀNH']),
      createElement('p', { style: 'font-size: var(--font-size-sm); color: var(--color-text-main); margin-bottom: var(--spacing-4);' }, [
        MESSAGES_DATA.feedback.alreadyCompleted.desc,
      ]),
    ]);

    interactiveContainer.appendChild(completedBanner);
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
    // Trạm chưa hoàn thành: Hiển thị câu hỏi để bé giải đố
    const questionCard = createQuestionCard({
      question: station.question,
      disabled: false,
      onAnswerSelected: (selectedOpt) => {
        handleAnswerSubmission(selectedOpt, station, badge, interactiveContainer);
      },
    });
    interactiveContainer.appendChild(questionCard);
  }

  page.appendChild(interactiveContainer);
  container.appendChild(page);
}

/**
 * Xử lý khi trẻ chọn một đáp án
 */
function handleAnswerSubmission(selectedOption, station, badge, interactiveContainer) {
  // Nếu đáp án SAI
  if (!selectedOption.isCorrect) {
    audioService.playWrongSound();

    interactiveContainer.innerHTML = '';
    const feedback = createFeedbackMessage({
      type: 'wrong',
      onRetry: () => {
        // Cho phép thử lại ngay mà không bị phạt hay khóa game
        interactiveContainer.innerHTML = '';
        const questionCard = createQuestionCard({
          question: station.question,
          disabled: false,
          onAnswerSelected: (opt) => handleAnswerSubmission(opt, station, badge, interactiveContainer),
        });
        interactiveContainer.appendChild(questionCard);
      },
    });
    interactiveContainer.appendChild(feedback);
    return;
  }

  // Nếu đáp án ĐÚNG
  audioService.playSuccessSound();

  // Gọi playerService để cập nhật điểm và huy hiệu (+10 điểm và lưu trạm hoàn thành)
  const result = playerService.completeStation(station.id, station.reward.points, station.badgeId);

  // Hiển thị giao diện vinh danh chiến thắng
  interactiveContainer.innerHTML = '';

  // Thêm hiệu ứng pháo hoa giấy vui nhộn nhẹ nhàng
  triggerConfetti();

  const correctFeedback = createFeedbackMessage({
    type: 'correct',
    customData: {
      pointsBadge: `⭐ +${station.reward.points} điểm`,
    },
    onContinue: () => {
      // Về cổng vào để ngắm hộ chiếu hoặc chuyển tiếp
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
