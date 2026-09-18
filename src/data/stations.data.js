/**
 * Dữ liệu danh mục các trạm thám hiểm Trung Thu 4.0
 * Thiết kế hoàn toàn theo mô hình data-driven để dễ dàng thêm Trạm 02, 03, 04, 05
 */
export const STATIONS_DATA = [
  {
    id: 'station-01',
    code: '01',
    name: 'Cung Trăng',
    title: 'Trạm 01: Cung Trăng',
    icon: '🌕',
    badgeId: 'moon-explorer',
    story: {
      intro: 'Xin chào nhà thám hiểm tí hon!',
      mascotCallout: '🐰 Thỏ Ngọc đang chuẩn bị một chiếc đèn thật đẹp cho đêm hội Trăng Rằm. Nhưng có một điều bí mật...',
      guidance: 'Bạn hãy bỏ điện thoại xuống, quan sát thật kỹ mô hình 3D và giúp Thỏ Ngọc tìm đúng chiếc đèn ông sao nhé!',
    },
    audio: {
      label: 'Nghe Thỏ Ngọc dặn dò',
      textToSpeak: 'Xin chào bạn! Hãy quan sát mô hình 3D và tìm chiếc đèn ông sao giúp Thỏ Ngọc nhé!',
    },
    physicalClue: {
      icon: '👀',
      title: 'Quan Sát Mô Hình Vật Lý Thật',
      text: 'Tìm vị trí Cung Trăng trên mô hình và đếm xem chiếc đèn ông sao có mấy cánh vàng lấp lánh!',
    },
    mission: {
      title: 'NHIỆM VỤ CUNG TRĂNG',
      description: 'Hãy tìm chiếc đèn ông sao trên mô hình. Khi đã tìm thấy, hãy chọn đáp án bên dưới.',
    },
    question: {
      id: 'q-station-01',
      text: 'Chiếc đèn nào là chiếc Đèn Ông Sao của đêm rằm?',
      options: [
        {
          id: 'opt-star',
          icon: '⭐',
          label: 'Đèn Ông Sao',
          description: 'Ngôi sao 5 cánh tỏa sáng',
          isCorrect: true,
        },
        {
          id: 'opt-circle',
          icon: '🔵',
          label: 'Đèn Lồng Tròn',
          description: 'Quả bóng tròn xanh',
          isCorrect: false,
        },
        {
          id: 'opt-triangle',
          icon: '🔺',
          label: 'Đèn Chóp Tam Giác',
          description: 'Hình chóp nhọn',
          isCorrect: false,
        },
      ],
    },
    reward: {
      points: 10,
      badgeId: 'moon-explorer',
      badgeName: 'Huy hiệu Cung Trăng',
      badgeIcon: '🌕',
    },
  },
  // Kiến trúc sẵn sàng cho Trạm 02, 03, 04, 05:
  // {
  //   id: 'station-02',
  //   code: '02',
  //   name: 'Phố Đèn Lồng',
  //   ...
  // }
];
