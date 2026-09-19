/**
 * Component Hộ Chiếu Nhà Thám Hiểm (Explorer Passport)
 * Hiển thị tiến trình 5 trạm, huy hiệu, điểm số và màn vinh danh Final Celebration
 */
import { createElement } from '../utils/dom.js';
import { createButton } from './button.js';
import { createCard } from './card.js';
import { stationService } from '../services/station.service.js';
import { playerService } from '../services/player.service.js';
import { navigateToStation } from '../utils/url.js';
import { openPlayerSettingsModal } from './player-modal.js';

export function createPassport({ player, onResetRequest, onRenameSuccess, onResetSuccess }) {
  const allStations = stationService.getAllStations();
  const completedStations = player.completedStations || [];
  const completedCount = completedStations.length;
  const totalStations = allStations.length;
  const isJourneyCompleted = completedCount >= totalStations;

  const passportCard = createCard({
    variant: 'gold',
    id: 'passport-card',
    children: [],
  });

  function handleOpenSettings() {
    if (typeof onResetRequest === 'function') {
      onResetRequest();
    } else {
      openPlayerSettingsModal({
        player,
        onRenameSuccess: (updated) => {
          if (typeof onRenameSuccess === 'function') {
            onRenameSuccess(updated);
          }
        },
        onResetSuccess: () => {
          if (typeof onResetSuccess === 'function') {
            onResetSuccess();
          }
        },
      });
    }
  }

  // 1. Header Hộ Chiếu
  const editNameBtn = createElement(
    'button',
    {
      type: 'button',
      class: 'btn-inline-edit',
      id: 'btn-inline-edit-name',
      'aria-label': 'Đổi tên người chơi',
      title: 'Đổi tên người chơi',
      onClick: () => {
        handleOpenSettings();
      },
    },
    ['✏️ Đổi tên']
  );

  const header = createElement('div', { class: 'passport-header', style: 'text-align: center; margin-bottom: var(--spacing-4);' }, [
    createElement('span', { style: 'font-size: 2.75rem; display: block; margin-bottom: 4px;', 'aria-hidden': 'true' }, ['🌕']),
    createElement('h2', { style: 'color: var(--color-accent-gold); font-size: var(--font-size-xl);' }, ['HỘ CHIẾU TRĂNG RẰM']),
    createElement('p', { style: 'font-size: var(--font-size-sm); color: var(--color-text-main); margin-top: 4px;' }, [
      'Nhà thám hiểm: ',
      createElement('strong', { id: 'passport-player-nickname', style: 'color: var(--color-accent-gold); font-size: 1.15em;' }, [player.nickname]),
      editNameBtn,
    ]),
  ]);
  passportCard.appendChild(header);

  // 2. Banner Vinh Danh Hoàn Thành Hành Trình (Nếu đã xong cả 5 trạm)
  if (isJourneyCompleted) {
    const celebrationBox = createElement('div', {
      class: 'final-celebration-banner',
      id: 'final-celebration-box',
    }, [
      createElement('div', { class: 'final-celebration-banner__icons', 'aria-hidden': 'true' }, [
        '🌕 ⭐ 🌊 🏔️ 🏮',
      ]),
      createElement('h3', { class: 'final-celebration-banner__title' }, [
        '🎉 CHÚC MỪNG CHIẾN THẮNG!',
      ]),
      createElement('p', { class: 'final-celebration-banner__subtitle' }, [
        'BẠN ĐÃ HOÀN THÀNH TOÀN BỘ HÀNH TRÌNH TRĂNG RẰM!',
      ]),
      createElement('div', { class: 'final-celebration-banner__rabbit' }, [
        '🐰 Thỏ Ngọc: "Cảm ơn bạn đã đồng hành cùng mình trong đêm hội Trung thu tuyệt vời này!"',
      ]),
    ]);
    passportCard.appendChild(celebrationBox);
  }

  // 3. Thanh Thống kê: Điểm số & Số trạm
  const statsRow = createElement('div', {
    style: 'display: flex; gap: var(--spacing-3); margin-bottom: var(--spacing-4);',
  }, [
    createElement('div', {
      style: 'flex: 1; text-align: center; padding: 12px; background: rgba(255,255,255,0.06); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);',
    }, [
      createElement('span', { style: 'font-size: 0.75rem; color: var(--color-text-muted); display: block;' }, ['TỔNG ĐIỂM']),
      createElement('strong', { style: 'font-size: 1.5rem; color: var(--color-accent-gold); display: block;' }, [
        `⭐ ${player.totalScore || 0} / 50`,
      ]),
    ]),
    createElement('div', {
      style: 'flex: 1; text-align: center; padding: 12px; background: rgba(255,255,255,0.06); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);',
    }, [
      createElement('span', { style: 'font-size: 0.75rem; color: var(--color-text-muted); display: block;' }, ['TRẠM HOÀN THÀNH']),
      createElement('strong', { style: 'font-size: 1.5rem; color: var(--color-primary-light); display: block;' }, [
        `${completedCount} / ${totalStations}`,
      ]),
    ]),
  ]);
  passportCard.appendChild(statsRow);

  // 4. Danh sách 5 Trạm Thám Hiểm (Checklist ✓ hoặc ○)
  const checklistSection = createElement('div', { class: 'passport-checklist', style: 'margin-bottom: var(--spacing-5);' });
  checklistSection.appendChild(
    createElement('h3', { style: 'font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: 8px;' }, [
      'TIẾN TRÌNH CÁC TRẠM KHÁM PHÁ:',
    ])
  );

  const stationsList = createElement('div', { class: 'passport-stations-list' });

  allStations.forEach((st) => {
    const isCompleted = completedStations.includes(st.id);
    const stationItem = createElement('div', {
      class: `passport-station-item ${isCompleted ? 'is-completed' : ''}`,
      id: `passport-station-item-${st.code}`,
    }, [
      createElement('div', { class: 'passport-station-item__main' }, [
        createElement('span', { class: 'passport-station-item__icon', 'aria-hidden': 'true' }, [st.icon]),
        createElement('div', {}, [
          createElement('span', { class: 'passport-station-item__name' }, [`Trạm ${st.code}: ${st.name}`]),
          createElement('span', { class: 'passport-station-item__status-text' }, [
            isCompleted ? 'Đã hoàn thành (+10 điểm)' : 'Chưa khám phá (Quét QR)',
          ]),
        ]),
      ]),
      createElement('div', { class: 'passport-station-item__badge' }, [
        isCompleted
          ? createElement('span', { class: 'status-mark status-mark--completed', title: 'Đã hoàn thành' }, ['✓'])
          : createElement('span', { class: 'status-mark status-mark--pending', title: 'Chưa khám phá' }, ['○']),
      ]),
    ]);

    // Cho phép chạm vào trạm để mở nhanh (rất tiện để test hoặc tiếp tục)
    stationItem.addEventListener('click', () => {
      navigateToStation(st.code);
    });

    stationsList.appendChild(stationItem);
  });

  checklistSection.appendChild(stationsList);
  passportCard.appendChild(checklistSection);

  // 5. Danh sách Huy hiệu đã nhận
  const badgesSection = createElement('div', { style: 'margin-bottom: var(--spacing-5);' });
  badgesSection.appendChild(
    createElement('h3', { style: 'font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: 8px;' }, [
      `HUY HIỆU ĐÃ NHẬN (${player.badges ? player.badges.length : 0}/5):`,
    ])
  );

  const badgesGrid = createElement('div', { class: 'passport-badges-grid' });
  if (player.badges && player.badges.length > 0) {
    player.badges.forEach((badgeId) => {
      const b = stationService.getBadgeById(badgeId);
      badgesGrid.appendChild(
        createElement('div', { class: 'passport-badge-chip', title: b?.description || '' }, [
          createElement('span', { class: 'passport-badge-chip__icon' }, [b ? b.icon : '🏅']),
          createElement('span', { class: 'passport-badge-chip__name' }, [b ? b.name : badgeId]),
        ])
      );
    });
  } else {
    badgesGrid.appendChild(
      createElement('div', { style: 'font-size: var(--font-size-xs); color: var(--color-text-muted); font-style: italic; padding: 6px 0;' }, [
        'Chưa có huy hiệu nào. Hãy bắt đầu quét mã QR trên mô hình để thu thập nhé!',
      ])
    );
  }
  badgesSection.appendChild(badgesGrid);
  passportCard.appendChild(badgesSection);

  // 6. Nút hành động chính
  const actionWrapper = createElement('div', { style: 'display: flex; flex-direction: column; gap: 10px;' });

  // Tìm trạm chưa hoàn thành tiếp theo (nếu có)
  const nextPendingStation = allStations.find((st) => !completedStations.includes(st.id));

  if (nextPendingStation) {
    const continueBtn = createButton({
      id: 'btn-continue-journey',
      text: `KHÁM PHÁ TIẾP: TRẠM ${nextPendingStation.code} (${nextPendingStation.name.toUpperCase()})`,
      icon: nextPendingStation.icon,
      variant: 'primary',
      onClick: () => {
        navigateToStation(nextPendingStation.code);
      },
    });
    actionWrapper.appendChild(continueBtn);
  } else {
    // Đã hoàn thành cả 5 trạm
    const celebrationBtn = createButton({
      id: 'btn-celebrate',
      text: 'XEM LẠI TRẠM 01 (CUNG TRĂNG)',
      icon: '🌕',
      variant: 'primary',
      onClick: () => {
        navigateToStation('01');
      },
    });
    actionWrapper.appendChild(celebrationBtn);
  }

  // Nút đổi tên / làm lại từ đầu
  const resetBtn = createButton({
    id: 'btn-reset-player',
    text: 'Đổi tên hoặc Chơi lại từ đầu',
    icon: '⚙️',
    variant: 'ghost',
    className: 'app-btn--secondary',
    onClick: () => {
      handleOpenSettings();
    },
  });
  actionWrapper.appendChild(resetBtn);

  passportCard.appendChild(actionWrapper);

  return passportCard;
}
