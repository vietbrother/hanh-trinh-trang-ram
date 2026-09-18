/**
 * Dữ liệu danh mục các trạm thám hiểm Trung Thu 4.0
 * Thiết kế hoàn toàn theo mô hình data-driven với gameplay đa dạng cho cả 5 trạm:
 * - Trạm 01: Cung Trăng (Single-Choice, Quan sát đèn ông sao)
 * - Trạm 02: Sông Đà (Single-Choice, Đếm cá trên sông)
 * - Trạm 03: Núi (Puzzle, Mini tap-to-swap 2x2 grid)
 * - Trạm 04: Làng Trung Thu (Single-Choice, Tìm đồ vật thất lạc & giải mã ký hiệu)
 * - Trạm 05: Phố Đèn Lồng (Creative, Tự thiết kế đèn lồng số mang tên bé)
 */
export const STATIONS_DATA = [
  // TRẠM 01: CUNG TRĂNG
  {
    id: 'station-01',
    code: '01',
    name: 'Cung Trăng',
    title: 'Trạm 01: Cung Trăng',
    icon: '🌕',
    badgeId: 'moon-explorer',
    interaction: {
      type: 'single-choice',
    },
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
      successTitle: 'CHÍNH XÁC!',
      successDesc: 'Bạn đã tìm thấy chiếc đèn ông sao trên Cung Trăng!',
    },
  },

  // TRẠM 02: SÔNG ĐÀ
  {
    id: 'station-02',
    code: '02',
    name: 'Sông Đà',
    title: 'Trạm 02: Sông Đà',
    icon: '🌊',
    badgeId: 'river-explorer',
    interaction: {
      type: 'single-choice',
    },
    story: {
      intro: 'Dòng sông Đà xanh ngát uốn quanh...',
      mascotCallout: '🐰 Ba chú cá nhỏ đang trốn trên dòng sông Đà rồi! Nhà thám hiểm hãy tìm chúng giúp tôi nhé!',
      guidance: 'Bạn hãy quan sát thật kỹ mô hình dòng sông nhé!',
    },
    audio: {
      label: 'Nghe nhiệm vụ Sông Đà',
      textToSpeak: 'Ba chú cá nhỏ đang trốn trên dòng sông Đà. Bạn hãy tìm chúng trên mô hình giúp Thỏ Ngọc nhé!',
    },
    physicalClue: {
      icon: '👀',
      title: 'Tìm Cá Trên Mô Hình Vật Lý',
      text: 'Hãy bỏ điện thoại xuống, nhìn kỹ dòng sông Đà trên mô hình thật và đếm xem có bao nhiêu chú cá đang ẩn mình!',
    },
    mission: {
      title: 'NHIỆM VỤ SÔNG ĐÀ',
      description: 'Hãy tìm các chú cá đang ẩn trên dòng sông Đà. Sau khi tìm thấy, hãy trả lời câu hỏi bên dưới.',
    },
    question: {
      id: 'q-station-02',
      text: 'Có bao nhiêu chú cá đang ẩn trên dòng sông?',
      options: [
        {
          id: 'opt-fish-2',
          icon: '🐟',
          label: '2 chú cá',
          description: 'Hai chú cá bơi lội',
          isCorrect: false,
        },
        {
          id: 'opt-fish-3',
          icon: '🐟',
          label: '3 chú cá',
          description: 'Ba chú cá nhỏ đang trốn',
          isCorrect: true,
        },
        {
          id: 'opt-fish-4',
          icon: '🐟',
          label: '4 chú cá',
          description: 'Bốn chú cá tung tăng',
          isCorrect: false,
        },
        {
          id: 'opt-fish-5',
          icon: '🐟',
          label: '5 chú cá',
          description: 'Năm chú cá tụ tập',
          isCorrect: false,
        },
      ],
    },
    reward: {
      points: 10,
      badgeId: 'river-explorer',
      badgeName: 'Huy hiệu Sông Đà',
      badgeIcon: '🌊',
      successTitle: 'TUYỆT VỜI!',
      successDesc: 'Bạn đã tìm thấy 3 chú cá trên Sông Đà!',
    },
  },

  // TRẠM 03: NÚI
  {
    id: 'station-03',
    code: '03',
    name: 'Núi',
    title: 'Trạm 03: Núi',
    icon: '🏔️',
    badgeId: 'mountain-explorer',
    interaction: {
      type: 'puzzle',
    },
    story: {
      intro: 'Đỉnh núi cao hùng vĩ dưới trăng...',
      mascotCallout: '🐰 Bức tranh địa hình Núi Trung Thu đang bị xáo trộn vị trí. Nhà thám hiểm hãy ghép lại giúp Thỏ Ngọc nhé!',
      guidance: 'Quan sát các đỉnh núi trên mô hình vật lý và sắp xếp 4 mảnh ghép theo đúng vị trí!',
    },
    audio: {
      label: 'Nghe thử thách Núi',
      textToSpeak: 'Hãy quan sát mô hình Núi và chạm vào hai mảnh hình để đổi chỗ, ghép thành bức tranh hoàn chỉnh nhé!',
    },
    physicalClue: {
      icon: '👀',
      title: 'Quan Sát Địa Hình Núi Thật',
      text: 'Nhìn mô hình vật lý để ghi nhớ vị trí 4 biểu tượng: Núi cao ở góc trên bên trái, Trăng rằm ở góc trên bên phải, Rừng thông ở góc dưới bên trái, và Thỏ ngọc ở góc dưới bên phải!',
    },
    mission: {
      title: 'THỬ THÁCH NÚI',
      description: 'Hãy ghép 4 mảnh hình thành bức tranh hoàn chỉnh. Chạm vào một mảnh rồi chạm mảnh khác để đổi chỗ cho nhau.',
    },
    puzzle: {
      id: 'mountain-puzzle-01',
      gridSize: 2,
      pieces: [
        { id: 'piece-mountain', correctPosition: 0, icon: '🏔️', label: 'Núi Cao' },
        { id: 'piece-moon', correctPosition: 1, icon: '🌕', label: 'Trăng Rằm' },
        { id: 'piece-pine', correctPosition: 2, icon: '🌲', label: 'Rừng Thông' },
        { id: 'piece-rabbit', correctPosition: 3, icon: '🐇', label: 'Thỏ Ngọc' },
      ],
      // Trật tự xáo trộn ban đầu để trẻ ghép lại
      initialPositions: [2, 0, 3, 1],
    },
    reward: {
      points: 10,
      badgeId: 'mountain-explorer',
      badgeName: 'Huy hiệu Núi',
      badgeIcon: '🏔️',
      successTitle: 'HOÀN THÀNH!',
      successDesc: 'Bạn đã ghép đúng bức tranh Núi!',
    },
  },

  // TRẠM 04: LÀNG TRUNG THU
  {
    id: 'station-04',
    code: '04',
    name: 'Làng Trung Thu',
    title: 'Trạm 04: Làng Trung Thu',
    icon: '🏮',
    badgeId: 'village-artisan',
    interaction: {
      type: 'single-choice',
    },
    story: {
      intro: 'Ngôi làng ấm cúng với bao tiếng cười rộn rã...',
      mascotCallout: '🐰 Một chiếc đèn ông sao đã bị thất lạc trong ngôi làng rồi. Bạn có thể tìm giúp tôi không?',
      guidance: 'Hãy quan sát mô hình ngôi làng và nhớ ký hiệu bí mật trên chiếc đèn nhé!',
    },
    audio: {
      label: 'Nghe nhiệm vụ Làng Trung Thu',
      textToSpeak: 'Một chiếc đèn ông sao đã bị thất lạc trong ngôi làng. Bạn hãy tìm nó trên mô hình và nhớ ký hiệu trên đèn nhé!',
    },
    physicalClue: {
      icon: '👀',
      title: 'Tìm Đồ Vật Thất Lạc Trong Làng',
      text: 'Bỏ điện thoại xuống, quan sát các góc sân và mái nhà cổ trong mô hình làng. Tìm chiếc đèn ông sao thất lạc và xem trên thân đèn mang ký hiệu gì!',
    },
    mission: {
      title: 'NHIỆM VỤ LÀNG TRUNG THU',
      description: 'Hãy tìm chiếc đèn ông sao bị thất lạc trong mô hình làng. Khi tìm thấy, hãy nhớ ký hiệu trên chiếc đèn rồi trả lời bên dưới.',
    },
    question: {
      id: 'q-station-04',
      text: 'Ký hiệu trên chiếc đèn bị thất lạc là gì?',
      options: [
        {
          id: 'opt-star-symbol',
          icon: '⭐',
          label: 'Ngôi Sao Vàng',
          description: 'Ký hiệu ngôi sao tỏa sáng',
          isCorrect: true,
        },
        {
          id: 'opt-moon-symbol',
          icon: '🌙',
          label: 'Mặt Trăng Khuyết',
          description: 'Ký hiệu trăng khuyết mềm mại',
          isCorrect: false,
        },
        {
          id: 'opt-heart-symbol',
          icon: '❤️',
          label: 'Trái Tim Yêu Thương',
          description: 'Ký hiệu trái tim đỏ',
          isCorrect: false,
        },
        {
          id: 'opt-flower-symbol',
          icon: '🌸',
          label: 'Bông Hoa Đăng',
          description: 'Ký hiệu hoa đào nở',
          isCorrect: false,
        },
      ],
    },
    reward: {
      points: 10,
      badgeId: 'village-artisan',
      badgeName: 'Huy hiệu Làng Trung Thu',
      badgeIcon: '🏮',
      successTitle: 'BẠN ĐÃ TÌM THẤY!',
      successDesc: 'Chiếc đèn ông sao đã trở về với Làng Trung Thu rồi!',
    },
  },

  // TRẠM 05: PHỐ ĐÈN LỒNG
  {
    id: 'station-05',
    code: '05',
    name: 'Phố Đèn Lồng',
    title: 'Trạm 05: Phố Đèn Lồng',
    icon: '⭐',
    badgeId: 'creative-kid',
    interaction: {
      type: 'creative',
    },
    story: {
      intro: 'Con phố rực rỡ muôn ánh đèn lung linh...',
      mascotCallout: '🐰 Chào mừng bạn đến trạm cuối Phố Đèn Lồng! Đêm nay hãy tự tay thắp sáng chiếc đèn lồng số mang tên bạn nhé!',
      guidance: 'Hãy chọn màu sắc và họa tiết yêu thích để hoàn thành kiệt tác đèn lồng của riêng bạn!',
    },
    audio: {
      label: 'Nghe nhiệm vụ Phố Đèn',
      textToSpeak: 'Chào mừng bạn đến Phố Đèn Lồng! Hãy chọn màu sắc và họa tiết để tự thiết kế chiếc đèn lồng đêm trăng của riêng mình nhé!',
    },
    physicalClue: {
      icon: '👀',
      title: 'Hòa Mình Vào Phố Đèn',
      text: 'Quan sát hàng trăm chiếc đèn lồng trên mô hình phố cổ để lấy cảm hứng thiết kế chiếc đèn rực rỡ nhất đêm nay!',
    },
    mission: {
      title: 'THIẾT KẾ ĐÈN LỒNG SỐ',
      description: 'Chọn màu sắc và họa tiết bạn yêu thích nhất để tạo chiếc đèn lồng mang dấu ấn cá nhân của nhà thám hiểm!',
    },
    creative: {
      colors: [
        { id: 'red', label: 'Đỏ May Mắn', hex: '#ef4444', icon: '🔴', glow: 'rgba(239, 68, 68, 0.4)' },
        { id: 'gold', label: 'Vàng Rực Rỡ', hex: '#f59e0b', icon: '🟡', glow: 'rgba(245, 158, 11, 0.4)' },
        { id: 'blue', label: 'Xanh Lam', hex: '#0284c7', icon: '🔵', glow: 'rgba(2, 132, 199, 0.4)' },
      ],
      patterns: [
        { id: 'star', label: 'Ngôi Sao', icon: '⭐' },
        { id: 'moon', label: 'Mặt Trăng', icon: '🌙' },
        { id: 'rabbit', label: 'Thỏ Ngọc', icon: '🐰' },
        { id: 'flower', label: 'Hoa Đăng', icon: '🌸' },
      ],
      defaultColor: 'gold',
      defaultPattern: 'star',
    },
    reward: {
      points: 10,
      badgeId: 'creative-kid',
      badgeName: 'Huy hiệu Nhà sáng tạo nhí',
      badgeIcon: '⭐',
      successTitle: 'TUYỆT VỜI!',
      successDesc: 'Bạn đã hoàn thành TRẠM PHỐ ĐÈN LỒNG và thắp sáng chiếc đèn lồng của riêng mình!',
    },
  },
];
