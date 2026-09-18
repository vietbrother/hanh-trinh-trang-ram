/**
 * Bản tin và văn bản hệ thống hiển thị trong hành trình
 */
export const MESSAGES_DATA = {
  welcome: {
    title: 'HÀNH TRÌNH TRĂNG RẰM',
    subtitle: 'BẢN ĐỒ KHÁM PHÁ TRUNG THU 3D',
    mascotCallout: '🐰 Thỏ Ngọc đang chờ bạn!',
    nicknamePrompt: 'Nhà thám hiểm gọi là gì?',
    ctaStart: 'BẮT ĐẦU PHIÊU LƯU',
  },
  errors: {
    stationNotFound: {
      icon: '🌙',
      title: 'Ồ! Hình như bạn đã đi lạc mất rồi.',
      desc: 'Trạm này chưa được mở hoặc mã QR không tồn tại.',
      cta: 'VỀ CỔNG KHÁM PHÁ',
    },
    missingPlayer: {
      icon: '🐰',
      title: 'Chào bạn mới đến!',
      desc: 'Trước khi bắt đầu khám phá, hãy cho Thỏ Ngọc biết tên của bạn nhé!',
      cta: 'BẮT ĐẦU HÀNH TRÌNH',
    },
    invalidNickname: 'Tên nhà thám hiểm cần từ 2 đến 20 ký tự bạn nhé!',
  },
  feedback: {
    wrong: {
      icon: '🌙',
      title: 'Chưa đúng rồi!',
      desc: 'Hãy quan sát mô hình thật kỹ một lần nữa nhé.',
      retryBtn: 'THỬ LẠI',
    },
    correct: {
      icon: '🎉',
      title: 'CHÍNH XÁC!',
      desc: 'Bạn đã tìm thấy chiếc đèn ông sao!',
      pointsBadge: '+10 điểm',
      continueBtn: 'TIẾP TỤC HÀNH TRÌNH',
    },
    alreadyCompleted: {
      icon: '✨',
      badge: 'ĐÃ HOÀN THÀNH',
      desc: 'Bạn đã nhận 10 điểm và Huy hiệu Cung Trăng rồi. Hãy tiếp tục khám phá các trạm khác trên mô hình nhé!',
    },
  },
};
