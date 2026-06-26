// VITAL v3.0
const FDB=[
  {id:'f0',n:'Phở Bò tái',p:'1 tô (500ml)',k:450,pr:28,fa:12,ca:55,pc:0},
  {id:'f1',n:'Phở Bò nạm/gầu',p:'1 tô',k:520,pr:30,fa:18,ca:55,pc:0},
  {id:'f2',n:'Phở Bò đặc biệt',p:'1 tô',k:600,pr:35,fa:22,ca:58,pc:1},
  {id:'f3',n:'Phở Gà',p:'1 tô',k:400,pr:26,fa:8,ca:55,pc:0},
  {id:'f4',n:'Bún bò Huế Chuẩn',p:'1 tô',k:550,pr:30,fa:18,ca:65,pc:0},
  {id:'f5',n:'Bún riêu Cua',p:'1 tô',k:480,pr:22,fa:15,ca:60,pc:0},
  {id:'f6',n:'Bún chả Hà Nội',p:'1 phần',k:600,pr:32,fa:20,ca:70,pc:1},
  {id:'f7',n:'Bún thịt nướng Chuẩn',p:'1 tô',k:550,pr:28,fa:18,ca:65,pc:1},
  {id:'f8',n:'Bún mắm Chuẩn',p:'1 tô',k:500,pr:25,fa:15,ca:65,pc:0},
  {id:'f9',n:'Bún cá Chuẩn',p:'1 tô',k:450,pr:28,fa:12,ca:55,pc:0},
  {id:'f10',n:'Hủ tiếu Nam Vang',p:'1 tô',k:480,pr:25,fa:14,ca:60,pc:0},
  {id:'f11',n:'Hủ tiếu Mỳ',p:'1 tô',k:500,pr:26,fa:16,ca:60,pc:0},
  {id:'f12',n:'Mì Quảng Chuẩn',p:'1 tô',k:550,pr:28,fa:20,ca:62,pc:0},
  {id:'f13',n:'Cao lầu Hội An',p:'1 tô',k:520,pr:25,fa:18,ca:65,pc:0},
  {id:'f14',n:'Cơm tấm Sườn',p:'1 dĩa',k:700,pr:35,fa:25,ca:80,pc:1},
  {id:'f15',n:'Cơm tấm Sườn bì chả',p:'1 dĩa',k:850,pr:40,fa:35,ca:85,pc:1},
  {id:'f16',n:'Cơm gà Hải Nam',p:'1 dĩa',k:650,pr:35,fa:20,ca:75,pc:1},
  {id:'f17',n:'Cơm gà Xối mỡ',p:'1 dĩa',k:750,pr:35,fa:28,ca:80,pc:1},
  {id:'f18',n:'Cơm chiên Dương Châu',p:'1 dĩa',k:600,pr:20,fa:22,ca:75,pc:1},
  {id:'f19',n:'Cơm chiên Hải sản',p:'1 dĩa',k:580,pr:25,fa:20,ca:70,pc:1},
  {id:'f20',n:'Cơm trắng',p:'1 chén',k:200,pr:4,fa:0.5,ca:45,pc:0},
  {id:'f21',n:'Cơm trắng',p:'1 tô lớn',k:400,pr:8,fa:1,ca:90,pc:0},
  {id:'f22',n:'Cháo lòng Chuẩn',p:'1 tô',k:400,pr:20,fa:15,ca:45,pc:1},
  {id:'f23',n:'Cháo gà Chuẩn',p:'1 tô',k:350,pr:22,fa:8,ca:45,pc:0},
  {id:'f24',n:'Cháo trắng',p:'1 tô',k:150,pr:3,fa:0.5,ca:32,pc:0},
  {id:'f25',n:'Bánh mì Thịt nguội',p:'1 ổ',k:450,pr:18,fa:18,ca:50,pc:1},
  {id:'f26',n:'Bánh mì Thịt nướng',p:'1 ổ',k:500,pr:22,fa:20,ca:55,pc:1},
  {id:'f27',n:'Bánh mì Chả cá',p:'1 ổ',k:420,pr:20,fa:15,ca:50,pc:0},
  {id:'f28',n:'Bánh mì Xíu mại',p:'1 ổ',k:480,pr:20,fa:20,ca:52,pc:1},
  {id:'f29',n:'Bánh mì Trứng',p:'1 ổ',k:400,pr:15,fa:18,ca:45,pc:0},
  {id:'f30',n:'Bánh xèo Tôm thịt',p:'1 cái lớn',k:450,pr:20,fa:22,ca:45,pc:1},
  {id:'f31',n:'Bánh khọt Chuẩn',p:'1 phần (10 cái)',k:400,pr:18,fa:18,ca:42,pc:0},
  {id:'f32',n:'Bánh cuốn Thịt',p:'1 phần',k:350,pr:15,fa:10,ca:50,pc:0},
  {id:'f33',n:'Bánh canh Cua',p:'1 tô',k:480,pr:25,fa:15,ca:60,pc:0},
  {id:'f34',n:'Bánh canh Giò heo',p:'1 tô',k:550,pr:28,fa:22,ca:60,pc:1},
  {id:'f35',n:'Lẩu Thái 1 người',p:'1 phần',k:600,pr:35,fa:20,ca:60,pc:0},
  {id:'f36',n:'Lẩu mắm 1 người',p:'1 phần',k:550,pr:30,fa:18,ca:55,pc:0},
  {id:'f37',n:'Lẩu gà lá é 1 người',p:'1 phần',k:500,pr:32,fa:18,ca:45,pc:0},
  {id:'f38',n:'Gỏi cuốn Tôm thịt',p:'1 cuốn',k:110,pr:5,fa:2,ca:18,pc:0},
  {id:'f39',n:'Chả giò Chiên',p:'1 cuốn',k:150,pr:5,fa:8,ca:12,pc:1},
  {id:'f40',n:'Nem nướng Nha Trang',p:'1 phần',k:450,pr:22,fa:20,ca:45,pc:1},
  {id:'f41',n:'Thịt kho Tàu (trứng)',p:'1 phần',k:350,pr:22,fa:25,ca:8,pc:1},
  {id:'f42',n:'Cá kho Tộ',p:'1 phần',k:280,pr:25,fa:18,ca:5,pc:0},
  {id:'f43',n:'Gà kho Gừng',p:'1 phần',k:320,pr:28,fa:18,ca:8,pc:0},
  {id:'f44',n:'Thịt luộc Heo',p:'100g',k:250,pr:20,fa:18,ca:0,pc:0},
  {id:'f45',n:'Rau xào Tỏi',p:'1 dĩa',k:120,pr:3,fa:8,ca:10,pc:0},
  {id:'f46',n:'Rau muống Xào tỏi',p:'1 dĩa',k:110,pr:3,fa:7,ca:10,pc:0},
  {id:'f47',n:'Canh chua Cá',p:'1 chén',k:100,pr:12,fa:3,ca:8,pc:0},
  {id:'f48',n:'Canh rau Thịt bằm',p:'1 chén',k:80,pr:8,fa:3,ca:6,pc:0},
  {id:'f49',n:'Trứng chiên Ốp la',p:'1 quả',k:90,pr:6,fa:7,ca:0.5,pc:0},
  {id:'f50',n:'Bún đậu Mắm tôm',p:'1 mẹt',k:850,pr:32,fa:40,ca:75,pc:1},
  {id:'f51',n:'Bún ốc Chuẩn',p:'1 tô',k:400,pr:18,fa:10,ca:55,pc:0},
  {id:'f52',n:'Bún mọc Chuẩn',p:'1 tô',k:450,pr:22,fa:12,ca:58,pc:0},
  {id:'f53',n:'Miến gà Chuẩn',p:'1 tô',k:380,pr:25,fa:8,ca:50,pc:0},
  {id:'f54',n:'Miến lươn Chuẩn',p:'1 tô',k:420,pr:25,fa:12,ca:55,pc:0},
  {id:'f55',n:'Phở cuốn Hà Nội',p:'1 cuốn',k:90,pr:6,fa:3,ca:10,pc:0},
  {id:'f56',n:'Phở xào Bò',p:'1 dĩa',k:620,pr:28,fa:22,ca:70,pc:1},
  {id:'f57',n:'Mì xào Giòn hải sản',p:'1 dĩa',k:680,pr:25,fa:28,ca:75,pc:1},
  {id:'f58',n:'Mì xào Mềm bò',p:'1 dĩa',k:620,pr:28,fa:22,ca:70,pc:1},
  {id:'f59',n:'Hoành thánh Mì',p:'1 tô',k:450,pr:22,fa:15,ca:55,pc:0},
  {id:'f60',n:'Bánh bao Thịt trứng',p:'1 cái',k:280,pr:12,fa:10,ca:35,pc:0},
  {id:'f61',n:'Bánh bao Chay',p:'1 cái',k:200,pr:6,fa:5,ca:32,pc:0},
  {id:'f62',n:'Bánh giò Chuẩn',p:'1 cái',k:320,pr:12,fa:12,ca:40,pc:1},
  {id:'f63',n:'Xôi mặn Đầy đủ',p:'1 phần',k:620,pr:18,fa:20,ca:85,pc:1},
  {id:'f64',n:'Xôi gà Chuẩn',p:'1 phần',k:550,pr:25,fa:15,ca:80,pc:0},
  {id:'f65',n:'Xôi xéo Chuẩn',p:'1 phần',k:500,pr:12,fa:14,ca:78,pc:1},
  {id:'f66',n:'Xôi chè Ngọt',p:'1 phần',k:420,pr:8,fa:5,ca:80,pc:1},
  {id:'f67',n:'Cơm cuộn Hàn (Việt hóa)',p:'1 cuộn',k:350,pr:12,fa:8,ca:55,pc:0},
  {id:'f68',n:'Bột chiên Trứng',p:'1 dĩa',k:500,pr:15,fa:22,ca:55,pc:1},
  {id:'f69',n:'Bánh tráng Trộn',p:'1 phần',k:350,pr:10,fa:12,ca:50,pc:1},
  {id:'f70',n:'Bánh tráng Nướng',p:'1 cái',k:220,pr:8,fa:8,ca:28,pc:1},
  {id:'f71',n:'Bánh tráng Cuốn',p:'1 cuốn',k:120,pr:5,fa:4,ca:18,pc:0},
  {id:'f72',n:'Há cảo Hấp',p:'1 cái',k:50,pr:3,fa:1.5,ca:6,pc:0},
  {id:'f73',n:'Bánh bột lọc Tôm thịt',p:'1 cái',k:60,pr:3,fa:1.5,ca:9,pc:0},
  {id:'f74',n:'Bánh nậm Chuẩn',p:'1 cái',k:70,pr:3,fa:2,ca:11,pc:0},
  {id:'f75',n:'Bánh ít Trần',p:'1 cái',k:120,pr:4,fa:3,ca:20,pc:0},
  {id:'f76',n:'Bánh đúc Nóng',p:'1 chén',k:250,pr:10,fa:8,ca:35,pc:0},
  {id:'f77',n:'Bánh bèo Huế (8 cái)',p:'1 phần',k:280,pr:10,fa:8,ca:40,pc:0},
  {id:'f78',n:'Chè đậu đen Nước cốt',p:'1 ly',k:250,pr:6,fa:5,ca:45,pc:1},
  {id:'f79',n:'Chè ba màu Chuẩn',p:'1 ly',k:300,pr:5,fa:8,ca:50,pc:1},
  {id:'f80',n:'Chè khúc bạch Chuẩn',p:'1 ly',k:280,pr:8,fa:12,ca:35,pc:1},
  {id:'f81',n:'Chè Thái Chuẩn',p:'1 ly',k:350,pr:6,fa:10,ca:55,pc:1},
  {id:'f82',n:'Chè trôi nước',p:'1 chén',k:250,pr:4,fa:6,ca:45,pc:1},
  {id:'f83',n:'Tàu hủ Nước đường',p:'1 chén',k:150,pr:8,fa:3,ca:22,pc:0},
  {id:'f84',n:'Sữa chua Nếp cẩm',p:'1 ly',k:220,pr:8,fa:5,ca:35,pc:0},
  {id:'f85',n:'Kem Tràng Tiền',p:'1 cây',k:180,pr:3,fa:8,ca:25,pc:1},
  {id:'f86',n:'Trà sữa Trân châu (size M)',p:'500ml',k:350,pr:5,fa:10,ca:60,pc:1},
  {id:'f87',n:'Trà sữa Trân châu (size L)',p:'700ml',k:500,pr:7,fa:14,ca:85,pc:1},
  {id:'f88',n:'Trà đào Cam sả',p:'500ml',k:180,pr:1,fa:0,ca:45,pc:1},
  {id:'f89',n:'Cà phê sữa đá Chuẩn',p:'1 ly',k:150,pr:3,fa:4,ca:25,pc:1},
  {id:'f90',n:'Cà phê đen Đá',p:'1 ly',k:5,pr:0,fa:0,ca:1,pc:0},
  {id:'f91',n:'Bạc xỉu Chuẩn',p:'1 ly',k:200,pr:4,fa:6,ca:30,pc:1},
  {id:'f92',n:'Nước mía Chuẩn',p:'1 ly (500ml)',k:180,pr:0,fa:0,ca:45,pc:1},
  {id:'f93',n:'Sinh tố bơ Chuẩn',p:'1 ly',k:350,pr:6,fa:18,ca:40,pc:0},
  {id:'f94',n:'Sinh tố xoài Chuẩn',p:'1 ly',k:250,pr:4,fa:4,ca:50,pc:1},
  {id:'f95',n:'Nước cam Vắt',p:'1 ly',k:120,pr:2,fa:0,ca:28,pc:0},
  {id:'f96',n:'Nem chua Rán',p:'1 cái',k:90,pr:5,fa:6,ca:5,pc:1},
  {id:'f97',n:'Chả cá Lã Vọng',p:'1 phần',k:450,pr:30,fa:22,ca:30,pc:0},
  {id:'f98',n:'Chả lụa',p:'100g',k:200,pr:12,fa:14,ca:5,pc:1},
  {id:'f99',n:'Tôm nướng Muối ớt',p:'100g',k:120,pr:22,fa:3,ca:1,pc:0},
  {id:'f100',n:'Mực nướng Muối ớt',p:'100g',k:140,pr:18,fa:5,ca:4,pc:0},
  {id:'f101',n:'Cá nướng Trui/lá chuối',p:'100g',k:180,pr:22,fa:10,ca:1,pc:0},
  {id:'f102',n:'Gà nướng Muối ớt (đùi)',p:'1 đùi',k:280,pr:28,fa:18,ca:0,pc:0},
  {id:'f103',n:'Gà nướng Mật ong',p:'1 đùi',k:320,pr:28,fa:18,ca:8,pc:1},
  {id:'f104',n:'Cánh gà Chiên nước mắm',p:'100g',k:320,pr:22,fa:22,ca:8,pc:1},
  {id:'f105',n:'Heo quay',p:'100g',k:350,pr:22,fa:28,ca:0,pc:1},
  {id:'f106',n:'Vịt quay',p:'100g',k:320,pr:19,fa:28,ca:0,pc:1},
  {id:'f107',n:'Bò né Bánh mì',p:'1 phần',k:650,pr:35,fa:35,ca:50,pc:1},
  {id:'f108',n:'Bò bít tết Chuẩn',p:'1 phần',k:550,pr:40,fa:30,ca:25,pc:0},
  {id:'f109',n:'Lòng lợn Luộc/nướng',p:'100g',k:230,pr:14,fa:18,ca:2,pc:1},
  {id:'f110',n:'Tiết canh',p:'1 chén',k:150,pr:18,fa:6,ca:2,pc:1},
  {id:'f111',n:'Ốc Luộc/xào',p:'1 phần (300g)',k:250,pr:25,fa:5,ca:25,pc:0},
  {id:'f112',n:'Khoai lang Nướng',p:'1 củ vừa',k:130,pr:2,fa:0,ca:30,pc:0},
  {id:'f113',n:'Khoai mì Hấp/nướng',p:'100g',k:160,pr:1,fa:0,ca:38,pc:0},
  {id:'f114',n:'Bắp Luộc',p:'1 trái',k:100,pr:3,fa:1,ca:22,pc:0},
  {id:'f115',n:'Bắp Xào bơ',p:'1 ly',k:250,pr:5,fa:12,ca:35,pc:1},
  {id:'f116',n:'Đậu hũ Chiên',p:'100g',k:200,pr:12,fa:14,ca:8,pc:0},
  {id:'f117',n:'Đậu hũ Sốt cà',p:'100g',k:180,pr:11,fa:10,ca:12,pc:0},
  {id:'f118',n:'Trứng vịt lộn',p:'1 quả',k:180,pr:14,fa:12,ca:2,pc:0},
  {id:'f119',n:'Trứng cút Lộn/luộc (5 quả)',p:'5 quả',k:100,pr:9,fa:7,ca:1,pc:0},
  {id:'f120',n:'Bánh chuối Nướng/chiên',p:'1 miếng',k:250,pr:4,fa:10,ca:38,pc:1},
  {id:'f121',n:'Chè đậu đen Nước cốt dừa',p:'1 ly',k:250,pr:6,fa:5,ca:45,pc:1},
  {id:'f122',n:'Chè đậu xanh Đánh/nước',p:'1 ly',k:220,pr:7,fa:3,ca:42,pc:0},
  {id:'f123',n:'Chè thái Chuẩn',p:'1 ly',k:350,pr:6,fa:10,ca:55,pc:1},
  {id:'f124',n:'Chè bưởi Chuẩn',p:'1 ly',k:280,pr:4,fa:6,ca:52,pc:1},
  {id:'f125',n:'Chè trôi nước Chuẩn',p:'1 chén',k:250,pr:4,fa:6,ca:45,pc:1},
  {id:'f126',n:'Chè hạt sen Long nhãn',p:'1 chén',k:180,pr:5,fa:2,ca:35,pc:0},
  {id:'f127',n:'Chè đậu đỏ Chuẩn',p:'1 ly',k:240,pr:7,fa:2,ca:48,pc:0},
  {id:'f128',n:'Chè khoai môn Nước cốt',p:'1 ly',k:260,pr:4,fa:6,ca:48,pc:1},
  {id:'f129',n:'Chè chuối Nước cốt dừa',p:'1 chén',k:280,pr:3,fa:10,ca:45,pc:1},
  {id:'f130',n:'Chè sương sa hạt lựu Chuẩn',p:'1 ly',k:220,pr:2,fa:4,ca:45,pc:1},
  {id:'f131',n:'Yaourt Đá',p:'1 ly',k:180,pr:6,fa:4,ca:30,pc:0},
  {id:'f132',n:'Rau câu Dừa/lá dứa',p:'1 miếng',k:90,pr:1,fa:2,ca:18,pc:0},
  {id:'f133',n:'Bánh flan Caramel',p:'1 cái',k:120,pr:4,fa:5,ca:15,pc:1},
  {id:'f134',n:'Kem Que/socola',p:'1 cây',k:220,pr:3,fa:12,ca:28,pc:1},
  {id:'f135',n:'Kem Ly',p:'1 ly nhỏ',k:250,pr:5,fa:14,ca:30,pc:1},
  {id:'f136',n:'Bánh su kem Vanilla',p:'1 cái',k:120,pr:2,fa:7,ca:14,pc:1},
  {id:'f137',n:'Bánh tiramisu Chuẩn',p:'1 miếng',k:320,pr:5,fa:20,ca:30,pc:1},
  {id:'f138',n:'Bánh mousse Chocolate',p:'1 miếng',k:350,pr:5,fa:22,ca:35,pc:1},
  {id:'f139',n:'Bánh cheesecake New York',p:'1 miếng',k:380,pr:7,fa:26,ca:30,pc:1},
  {id:'f140',n:'Panna cotta Dâu/xoài',p:'1 hũ',k:220,pr:4,fa:12,ca:24,pc:1},
  {id:'f141',n:'Trái cây Dưa hấu',p:'100g',k:30,pr:0.6,fa:0.2,ca:8,pc:0},
  {id:'f142',n:'Trái cây Xoài chín',p:'100g',k:65,pr:0.8,fa:0.4,ca:17,pc:0},
  {id:'f143',n:'Trái cây Xoài xanh',p:'100g',k:50,pr:0.5,fa:0.2,ca:13,pc:0},
  {id:'f144',n:'Trái cây Chuối',p:'1 quả vừa',k:105,pr:1.3,fa:0.4,ca:27,pc:0},
  {id:'f145',n:'Trái cây Táo',p:'1 quả vừa',k:95,pr:0.5,fa:0.3,ca:25,pc:0},
  {id:'f146',n:'Trái cây Cam',p:'1 quả vừa',k:65,pr:1.2,fa:0.2,ca:16,pc:0},
  {id:'f147',n:'Trái cây Quýt',p:'1 quả',k:45,pr:0.7,fa:0.2,ca:12,pc:0},
  {id:'f148',n:'Trái cây Ổi',p:'100g',k:68,pr:2.6,fa:1,ca:14,pc:0},
  {id:'f149',n:'Trái cây Thanh long',p:'100g',k:50,pr:1.1,fa:0.2,ca:12,pc:0},
  {id:'f150',n:'Trái cây Nho',p:'100g',k:70,pr:0.7,fa:0.2,ca:18,pc:0},
  {id:'f151',n:'Trái cây Dứa (thơm)',p:'100g',k:50,pr:0.5,fa:0.1,ca:13,pc:0},
  {id:'f152',n:'Trái cây Bưởi',p:'100g',k:42,pr:0.8,fa:0.1,ca:11,pc:0},
  {id:'f153',n:'Trái cây Mít',p:'100g',k:95,pr:1.7,fa:0.6,ca:24,pc:0},
  {id:'f154',n:'Trái cây Sầu riêng',p:'100g',k:150,pr:2,fa:5,ca:27,pc:0},
  {id:'f155',n:'Trái cây Bơ',p:'100g',k:160,pr:2,fa:15,ca:9,pc:0},
  {id:'f156',n:'Trái cây Vải',p:'100g',k:66,pr:0.8,fa:0.4,ca:17,pc:0},
  {id:'f157',n:'Trái cây Nhãn',p:'100g',k:60,pr:1,fa:0.1,ca:15,pc:0},
  {id:'f158',n:'Trái cây Măng cụt',p:'100g',k:73,pr:0.5,fa:0.6,ca:18,pc:0},
  {id:'f159',n:'Trái cây Chôm chôm',p:'100g',k:68,pr:0.9,fa:0.2,ca:17,pc:0},
  {id:'f160',n:'Trái cây Dâu tây',p:'100g',k:32,pr:0.7,fa:0.3,ca:8,pc:0},
  {id:'f161',n:'Nước uống Nước lọc',p:'500ml',k:0,pr:0,fa:0,ca:0,pc:0},
  {id:'f162',n:'Nước uống Nước dừa',p:'1 trái (~300ml)',k:60,pr:1,fa:0,ca:15,pc:0},
  {id:'f163',n:'Nước uống Nước cam vắt',p:'1 ly',k:120,pr:2,fa:0,ca:28,pc:0},
  {id:'f164',n:'Nước uống Nước ép thơm',p:'1 ly',k:110,pr:1,fa:0,ca:26,pc:0},
  {id:'f165',n:'Nước uống Sinh tố bơ',p:'1 ly',k:350,pr:6,fa:18,ca:40,pc:0},
  {id:'f166',n:'Nước uống Sinh tố xoài',p:'1 ly',k:250,pr:4,fa:4,ca:50,pc:1},
  {id:'f167',n:'Nước uống Sinh tố chuối',p:'1 ly',k:220,pr:5,fa:3,ca:45,pc:0},
  {id:'f168',n:'Nước uống Nước mía',p:'500ml',k:180,pr:0,fa:0,ca:45,pc:1},
  {id:'f169',n:'Nước uống Trà đào cam sả',p:'500ml',k:180,pr:1,fa:0,ca:45,pc:1},
  {id:'f170',n:'Nước uống Trà tắc',p:'500ml',k:140,pr:0,fa:0,ca:35,pc:1},
  {id:'f171',n:'Nước uống Trà chanh',p:'500ml',k:120,pr:0,fa:0,ca:30,pc:1},
  {id:'f172',n:'Nước uống Trà sữa trân châu',p:'Size M (500ml)',k:350,pr:5,fa:10,ca:60,pc:1},
  {id:'f173',n:'Nước uống Trà sữa trân châu',p:'Size L (700ml)',k:500,pr:7,fa:14,ca:85,pc:1},
  {id:'f174',n:'Nước uống Cà phê đen đá',p:'1 ly',k:5,pr:0,fa:0,ca:1,pc:0},
  {id:'f175',n:'Nước uống Cà phê sữa đá',p:'1 ly',k:150,pr:3,fa:4,ca:25,pc:1},
  {id:'f176',n:'Nước uống Bạc xỉu',p:'1 ly',k:200,pr:4,fa:6,ca:30,pc:1},
  {id:'f177',n:'Nước uống Sữa đậu nành',p:'300ml',k:140,pr:7,fa:4,ca:18,pc:0},
  {id:'f178',n:'Nước uống Sữa tươi không đường',p:'250ml',k:110,pr:8,fa:6,ca:6,pc:0},
  {id:'f179',n:'Nước uống Coca-Cola',p:'Lon 330ml',k:139,pr:0,fa:0,ca:35,pc:1},
  {id:'f180',n:'Nước uống Pepsi',p:'Lon 330ml',k:150,pr:0,fa:0,ca:38,pc:1},
  {id:'f181',n:'Nước uống Sting dâu',p:'Lon 330ml',k:160,pr:0,fa:0,ca:40,pc:1},
  {id:'f182',n:'Nước uống Red Bull',p:'Lon 250ml',k:110,pr:1,fa:0,ca:27,pc:1},
  {id:'f183',n:'Nước uống Monster Energy',p:'Lon 330ml',k:155,pr:0,fa:0,ca:39,pc:1},
  {id:'f184',n:'Sushi Cá hồi (1 miếng)',p:'1 miếng',k:50,pr:4,fa:1,ca:7,pc:0},
  {id:'f185',n:'Sushi Set 10 miếng',p:'10 miếng',k:500,pr:35,fa:10,ca:70,pc:0},
  {id:'f186',n:'Sashimi Cá hồi',p:'100g',k:200,pr:22,fa:12,ca:0,pc:0},
  {id:'f187',n:'Ramen Tonkotsu',p:'1 tô',k:700,pr:30,fa:30,ca:75,pc:1},
  {id:'f188',n:'Ramen Shoyu',p:'1 tô',k:550,pr:28,fa:18,ca:70,pc:0},
  {id:'f189',n:'Udon Bò',p:'1 tô',k:500,pr:22,fa:12,ca:75,pc:0},
  {id:'f190',n:'Cơm bento Gà teriyaki',p:'1 hộp',k:650,pr:32,fa:18,ca:85,pc:1},
  {id:'f191',n:'Cơm cà ri Nhật Chuẩn',p:'1 dĩa',k:700,pr:25,fa:22,ca:95,pc:1},
  {id:'f192',n:'Takoyaki 6 viên',p:'1 phần',k:350,pr:12,fa:18,ca:35,pc:1},
  {id:'f193',n:'Tonkatsu Heo',p:'1 phần',k:750,pr:35,fa:40,ca:60,pc:1},
  {id:'f194',n:'Kimbap Hàn',p:'1 cuộn',k:300,pr:10,fa:8,ca:50,pc:0},
  {id:'f195',n:'Bibimbap Bò',p:'1 tô',k:600,pr:25,fa:18,ca:80,pc:0},
  {id:'f196',n:'Mì cay Hàn (cấp 3)',p:'1 tô',k:650,pr:28,fa:25,ca:75,pc:1},
  {id:'f197',n:'Tokbokki Chuẩn',p:'1 phần',k:450,pr:8,fa:10,ca:80,pc:1},
  {id:'f198',n:'Gà rán Hàn Sốt cay',p:'5 miếng',k:600,pr:30,fa:30,ca:50,pc:1},
  {id:'f199',n:'BBQ Hàn Bò ba chỉ (200g)',p:'200g',k:720,pr:35,fa:55,ca:5,pc:1},
  {id:'f200',n:'Pad Thái Tôm',p:'1 dĩa',k:550,pr:22,fa:20,ca:65,pc:1},
  {id:'f201',n:'Tom Yum Tôm',p:'1 tô',k:250,pr:22,fa:8,ca:18,pc:0},
  {id:'f202',n:'Cơm xanh Thái Gà',p:'1 dĩa',k:650,pr:28,fa:22,ca:80,pc:1},
  {id:'f203',n:'Pizza Phô mai (slice)',p:'1 miếng',k:280,pr:12,fa:10,ca:35,pc:1},
  {id:'f204',n:'Pizza Hải sản (slice)',p:'1 miếng',k:300,pr:14,fa:12,ca:35,pc:1},
  {id:'f205',n:'Pizza Pepperoni (slice)',p:'1 miếng',k:320,pr:13,fa:14,ca:36,pc:1},
  {id:'f206',n:'Pizza Hawaiian (slice)',p:'1 miếng',k:290,pr:12,fa:10,ca:35,pc:1},
  {id:'f207',n:'Pasta Bolognese',p:'1 dĩa',k:650,pr:25,fa:25,ca:75,pc:1},
  {id:'f208',n:'Pasta Carbonara',p:'1 dĩa',k:750,pr:28,fa:35,ca:75,pc:1},
  {id:'f209',n:'Pasta Aglio e Olio',p:'1 dĩa',k:520,pr:12,fa:20,ca:70,pc:0},
  {id:'f210',n:'Pasta Hải sản',p:'1 dĩa',k:580,pr:28,fa:18,ca:72,pc:0},
  {id:'f211',n:'Burger Bò phô mai',p:'1 cái',k:550,pr:28,fa:28,ca:45,pc:1},
  {id:'f212',n:'Burger Gà',p:'1 cái',k:480,pr:25,fa:20,ca:50,pc:1},
  {id:'f213',n:'Burger Double beef',p:'1 cái',k:750,pr:40,fa:42,ca:50,pc:1},
  {id:'f214',n:'Hot dog Chuẩn',p:'1 cái',k:350,pr:12,fa:22,ca:25,pc:1},
  {id:'f215',n:'Khoai tây chiên Size M',p:'1 phần',k:350,pr:4,fa:18,ca:45,pc:1},
  {id:'f216',n:'Gà rán KFC (1 miếng)',p:'1 miếng',k:320,pr:20,fa:20,ca:12,pc:1},
  {id:'f217',n:'Gà rán McDonald’s (1 miếng)',p:'1 miếng',k:300,pr:19,fa:18,ca:12,pc:1},
  {id:'f218',n:'Salad Caesar',p:'1 dĩa',k:350,pr:12,fa:25,ca:15,pc:0},
  {id:'f219',n:'Salad Cá ngừ',p:'1 dĩa',k:280,pr:22,fa:12,ca:18,pc:0},
  {id:'f220',n:'Salad Ức gà',p:'1 dĩa',k:320,pr:28,fa:14,ca:18,pc:0},
  {id:'f221',n:'Bánh croissant Bơ',p:'1 cái',k:280,pr:6,fa:16,ca:30,pc:1},
  {id:'f222',n:'Donut Glazed',p:'1 cái',k:260,pr:3,fa:14,ca:30,pc:1},
  {id:'f223',n:'Taco Bò',p:'2 cái',k:380,pr:20,fa:18,ca:35,pc:0},
  {id:'f224',n:'Burrito Bò',p:'1 cuộn',k:650,pr:30,fa:22,ca:75,pc:1},
  {id:'f225',n:'Nachos Phô mai',p:'1 phần',k:450,pr:10,fa:25,ca:45,pc:1},
  {id:'f226',n:'Fish & Chips Kiểu Anh',p:'1 phần',k:700,pr:30,fa:35,ca:60,pc:1},
  {id:'f227',n:'Paella Hải sản',p:'1 phần',k:600,pr:28,fa:18,ca:75,pc:0},
  {id:'f228',n:'Dimsum Há cảo + xíu mại (6 viên)',p:'1 phần',k:320,pr:16,fa:10,ca:42,pc:0},
  {id:'f229',n:'Xiao Long Bao Tiểu long bao',p:'6 viên',k:360,pr:18,fa:12,ca:45,pc:0},
  {id:'f230',n:'Cơm trộn Gà Hàn',p:'1 tô',k:550,pr:28,fa:15,ca:75,pc:0},
  {id:'f231',n:'Mì Ý Sốt kem nấm',p:'1 dĩa',k:680,pr:20,fa:30,ca:78,pc:1},
  {id:'f232',n:'Gà popcorn Hàn/Đài',p:'1 phần',k:420,pr:22,fa:22,ca:30,pc:1},
  {id:'f233',n:'Trà sữa Matcha Nhật',p:'500ml',k:320,pr:6,fa:9,ca:55,pc:1},
  {id:'f234',n:'Mochi Kem',p:'1 cái',k:120,pr:2,fa:4,ca:20,pc:1},
  {id:'f235',n:'Bingsu Dâu/xoài',p:'1 tô nhỏ',k:350,pr:6,fa:8,ca:65,pc:1},
  {id:'f236',n:'Yogurt Greek Granola',p:'1 ly',k:250,pr:15,fa:8,ca:28,pc:0},
  {id:'f237',n:'Rau muống Luộc',p:'100g',k:25,pr:2.7,fa:0.2,ca:4,pc:0},
  {id:'f238',n:'Rau muống Xào tỏi',p:'100g',k:110,pr:3,fa:7,ca:10,pc:0},
  {id:'f239',n:'Cải thìa Luộc',p:'100g',k:15,pr:1.5,fa:0.2,ca:2,pc:0},
  {id:'f240',n:'Cải ngọt Luộc',p:'100g',k:20,pr:2,fa:0.2,ca:3,pc:0},
  {id:'f241',n:'Cải xanh Luộc',p:'100g',k:22,pr:2,fa:0.3,ca:4,pc:0},
  {id:'f242',n:'Rau dền Luộc',p:'100g',k:23,pr:2.5,fa:0.3,ca:4,pc:0},
  {id:'f243',n:'Mồng tơi Luộc',p:'100g',k:19,pr:2,fa:0.2,ca:3,pc:0},
  {id:'f244',n:'Bắp cải Luộc',p:'100g',k:25,pr:1.3,fa:0.1,ca:6,pc:0},
  {id:'f245',n:'Bắp cải Xào',p:'100g',k:70,pr:2,fa:4,ca:7,pc:0},
  {id:'f246',n:'Cải thảo Luộc',p:'100g',k:16,pr:1.2,fa:0.2,ca:3,pc:0},
  {id:'f247',n:'Xà lách Sống',p:'100g',k:15,pr:1.4,fa:0.2,ca:3,pc:0},
  {id:'f248',n:'Rau sống Mixed',p:'100g',k:20,pr:1.5,fa:0.3,ca:4,pc:0},
  {id:'f249',n:'Rau lang Luộc',p:'100g',k:30,pr:2,fa:0.2,ca:6,pc:0},
  {id:'f250',n:'Đậu bắp Luộc',p:'100g',k:33,pr:2,fa:0.2,ca:7,pc:0},
  {id:'f251',n:'Bí đỏ Luộc',p:'100g',k:34,pr:1,fa:0.1,ca:8,pc:0},
  {id:'f252',n:'Bí xanh Luộc',p:'100g',k:13,pr:0.6,fa:0.1,ca:3,pc:0},
  {id:'f253',n:'Su su Luộc',p:'100g',k:19,pr:0.8,fa:0.1,ca:4,pc:0},
  {id:'f254',n:'Cà rốt Luộc',p:'100g',k:41,pr:1,fa:0.2,ca:10,pc:0},
  {id:'f255',n:'Khoai tây Luộc',p:'100g',k:87,pr:2,fa:0.1,ca:20,pc:0},
  {id:'f256',n:'Khoai lang Luộc',p:'100g',k:86,pr:1.6,fa:0.1,ca:20,pc:0},
  {id:'f257',n:'Ngô (bắp) Luộc',p:'100g',k:96,pr:3.4,fa:1.5,ca:21,pc:0},
  {id:'f258',n:'Củ dền Luộc',p:'100g',k:43,pr:1.6,fa:0.2,ca:10,pc:0},
  {id:'f259',n:'Củ cải trắng Luộc',p:'100g',k:18,pr:0.6,fa:0.1,ca:4,pc:0},
  {id:'f260',n:'Bông cải xanh Luộc',p:'100g',k:35,pr:2.8,fa:0.4,ca:7,pc:0},
  {id:'f261',n:'Bông cải xanh Xào',p:'100g',k:80,pr:3,fa:4,ca:8,pc:0},
  {id:'f262',n:'Súp lơ trắng Luộc',p:'100g',k:25,pr:2,fa:0.3,ca:5,pc:0},
  {id:'f263',n:'Măng tây Luộc',p:'100g',k:22,pr:2.4,fa:0.2,ca:4,pc:0},
  {id:'f264',n:'Đậu que Luộc',p:'100g',k:31,pr:2,fa:0.2,ca:7,pc:0},
  {id:'f265',n:'Đậu Hà Lan Luộc',p:'100g',k:84,pr:5,fa:0.4,ca:15,pc:0},
  {id:'f266',n:'Nấm kim châm Luộc',p:'100g',k:37,pr:2.7,fa:0.3,ca:7,pc:0},
  {id:'f267',n:'Nấm đùi gà Áp chảo',p:'100g',k:55,pr:3,fa:2,ca:8,pc:0},
  {id:'f268',n:'Nấm mỡ Luộc',p:'100g',k:22,pr:3,fa:0.3,ca:3,pc:0},
  {id:'f269',n:'Dưa leo Sống',p:'100g',k:15,pr:0.7,fa:0.1,ca:4,pc:0},
  {id:'f270',n:'Cà chua Sống',p:'100g',k:18,pr:0.9,fa:0.2,ca:4,pc:0},
  {id:'f271',n:'Cà tím Nướng',p:'100g',k:35,pr:1,fa:0.2,ca:8,pc:0},
  {id:'f272',n:'Đậu hũ Trắng',p:'100g',k:76,pr:8,fa:4,ca:2,pc:0},
  {id:'f273',n:'Salad rau Không sốt',p:'1 tô',k:80,pr:3,fa:2,ca:12,pc:0},
  {id:'f274',n:'Salad rau Sốt mè rang',p:'1 tô',k:220,pr:4,fa:15,ca:15,pc:0},
  {id:'f275',n:'Trứng gà Luộc',p:'1 quả',k:78,pr:6,fa:5,ca:0.6,pc:0},
  {id:'f276',n:'Trứng gà Ốp la',p:'1 quả',k:90,pr:6,fa:7,ca:0.5,pc:0},
  {id:'f277',n:'Trứng vịt Luộc',p:'1 quả',k:130,pr:9,fa:10,ca:1,pc:0},
  {id:'f278',n:'Trứng cút Luộc',p:'1 quả',k:17,pr:1.3,fa:1.2,ca:0.1,pc:0},
  {id:'f279',n:'Trứng cút 5 quả',p:'5 quả',k:85,pr:7,fa:6,ca:0.5,pc:0},
  {id:'f280',n:'Chả lụa',p:'50g',k:100,pr:6,fa:7,ca:2,pc:1},
  {id:'f281',n:'Chả bò',p:'50g',k:110,pr:8,fa:7,ca:2,pc:0},
  {id:'f282',n:'Chả cá Chiên',p:'50g',k:90,pr:7,fa:5,ca:4,pc:1},
  {id:'f283',n:'Xúc xích Đức/CP',p:'1 cây (~50g)',k:140,pr:5,fa:12,ca:2,pc:1},
  {id:'f284',n:'Thịt bò thêm Phở/lẩu',p:'50g',k:95,pr:11,fa:5,ca:0,pc:0},
  {id:'f285',n:'Gầu bò thêm Phở/lẩu',p:'50g',k:150,pr:9,fa:12,ca:0,pc:0},
  {id:'f286',n:'Gân bò thêm Phở/lẩu',p:'50g',k:80,pr:13,fa:2,ca:0,pc:0},
  {id:'f287',n:'Bò viên Phở',p:'1 viên (~25g)',k:40,pr:3,fa:3,ca:1,pc:0},
  {id:'f288',n:'Tôm thêm Luộc/nướng',p:'50g',k:60,pr:11,fa:1,ca:0,pc:0},
  {id:'f289',n:'Mực thêm Luộc/nướng',p:'50g',k:70,pr:9,fa:2,ca:1,pc:0},
  {id:'f290',n:'Gà xé Phở/cháo',p:'50g',k:85,pr:14,fa:3,ca:0,pc:0},
  {id:'f291',n:'Da gà Luộc/chiên',p:'30g',k:135,pr:3,fa:13,ca:0,pc:1},
  {id:'f292',n:'Heo quay thêm 50g',p:'50g',k:175,pr:11,fa:14,ca:0,pc:1},
  {id:'f293',n:'Thịt heo luộc 50g',p:'50g',k:125,pr:10,fa:9,ca:0,pc:0},
  {id:'f294',n:'Xíu mại 1 viên',p:'1 viên (~30g)',k:60,pr:4,fa:4,ca:2,pc:0},
  {id:'f295',n:'Nem chua 1 cái',p:'1 cái',k:65,pr:4,fa:4,ca:2,pc:1},
  {id:'f296',n:'Chả giò 1 cuốn',p:'1 cuốn',k:150,pr:5,fa:8,ca:12,pc:1},
  {id:'f297',n:'Đậu hũ Trắng',p:'50g',k:38,pr:4,fa:2,ca:1,pc:0},
  {id:'f298',n:'Đậu hũ Chiên',p:'50g',k:100,pr:6,fa:7,ca:4,pc:0},
  {id:'f299',n:'Phô mai lát Cheddar',p:'1 lát (~20g)',k:70,pr:4,fa:6,ca:1,pc:1},
  {id:'f300',n:'Phô mai bào Mozzarella',p:'30g',k:90,pr:7,fa:7,ca:1,pc:0},
  {id:'f301',n:'Bơ Mayonnaise',p:'1 muỗng canh (15g)',k:100,pr:0,fa:11,ca:1,pc:1},
  {id:'f302',n:'Bơ thực vật Margarine',p:'1 muỗng (10g)',k:72,pr:0,fa:8,ca:0,pc:1},
  {id:'f303',n:'Hành phi',p:'1 muỗng canh (10g)',k:55,pr:1,fa:4,ca:4,pc:1},
  {id:'f304',n:'Tóp mỡ',p:'20g',k:120,pr:2,fa:12,ca:0,pc:1},
  {id:'f305',n:'Mỡ hành',p:'1 muỗng canh',k:45,pr:0,fa:5,ca:1,pc:1},
  {id:'f306',n:'Sa tế',p:'1 muỗng canh (15g)',k:70,pr:1,fa:7,ca:2,pc:1},
  {id:'f307',n:'Tương đen Phở',p:'1 muỗng canh',k:35,pr:1,fa:0,ca:8,pc:1},
  {id:'f308',n:'Tương ớt',p:'1 muỗng canh',k:20,pr:0,fa:0,ca:5,pc:1},
  {id:'f309',n:'Nước mắm đường Pha',p:'1 muỗng canh',k:25,pr:0,fa:0,ca:6,pc:1},
  {id:'f310',n:'Sốt mè rang Salad',p:'1 muỗng canh',k:80,pr:1,fa:7,ca:3,pc:1},
  {id:'f311',n:'Sốt Caesar Salad',p:'1 muỗng canh',k:90,pr:1,fa:9,ca:1,pc:1},
  {id:'f312',n:'Ketchup Tương cà',p:'1 muỗng canh',k:20,pr:0,fa:0,ca:5,pc:1},
  {id:'f313',n:'Sốt phô mai',p:'30g',k:110,pr:3,fa:9,ca:4,pc:1},
  {id:'f314',n:'Quẩy Phở/cháo',p:'1 cái',k:120,pr:2,fa:6,ca:14,pc:1},
  {id:'f315',n:'Bánh mì thêm 1/2 ổ',p:'1 phần',k:110,pr:4,fa:1,ca:22,pc:0},
  {id:'f316',n:'Bún thêm 100g',p:'100g',k:110,pr:2,fa:0.5,ca:25,pc:0},
  {id:'f317',n:'Mì thêm 100g',p:'100g',k:140,pr:4,fa:1,ca:28,pc:0},
  {id:'f318',n:'Nui thêm 100g',p:'100g',k:130,pr:4,fa:1,ca:26,pc:0},
  {id:'f319',n:'Cơm trắng thêm 1 chén nhỏ',p:'100g',k:130,pr:2.5,fa:0.3,ca:28,pc:0},
  {id:'f320',n:'Kimchi Hàn',p:'50g',k:15,pr:1,fa:0,ca:3,pc:0},
  {id:'f321',n:'Rong biển Khô',p:'1 gói nhỏ (5g)',k:25,pr:1,fa:2,ca:1,pc:0},
  {id:'f322',n:'Bắp Mỹ Hạt',p:'50g',k:48,pr:2,fa:1,ca:11,pc:0},
  {id:'f323',n:'Nấm thêm Lẩu/nướng',p:'50g',k:18,pr:2,fa:0,ca:3,pc:0},
  {id:'f324',n:'Rau sống thêm Mixed',p:'50g',k:10,pr:1,fa:0,ca:2,pc:0},
  {id:'f325',n:'Đậu phộng Rang',p:'20g',k:115,pr:5,fa:10,ca:4,pc:0},
  {id:'f326',n:'Mè rang',p:'10g',k:57,pr:2,fa:5,ca:2,pc:0},
  {id:'f327',n:'Hành lá',p:'10g',k:3,pr:0.2,fa:0,ca:0.7,pc:0},
  {id:'f328',n:'Tỏi phi',p:'10g',k:50,pr:1,fa:4,ca:4,pc:1},
  {id:'f329',n:'Bơ đậu phộng',p:'1 muỗng canh',k:95,pr:4,fa:8,ca:3,pc:0},
  {id:'f330',n:'Whipping cream',p:'30ml',k:100,pr:1,fa:10,ca:2,pc:1},
  {id:'f331',n:'Hủ tiếu gõ Thập cẩm',p:'1 tô',k:420,pr:20,fa:10,ca:60,pc:0},
  {id:'f332',n:'Bò kho Bánh mì',p:'1 phần',k:650,pr:32,fa:28,ca:60,pc:1},
  {id:'f333',n:'Bánh mì chảo Đầy đủ',p:'1 phần',k:700,pr:30,fa:40,ca:50,pc:1},
  {id:'f334',n:'Bánh ướt Lòng gà',p:'1 phần',k:450,pr:25,fa:15,ca:50,pc:0},
  {id:'f335',n:'Bánh hỏi Heo quay',p:'1 phần',k:620,pr:28,fa:28,ca:60,pc:1},
  {id:'f336',n:'Bánh căn Trứng/cút',p:'1 phần (8 cái)',k:380,pr:16,fa:12,ca:50,pc:0},
  {id:'f337',n:'Bún cá Châu Đốc',p:'1 tô',k:480,pr:28,fa:14,ca:58,pc:0},
  {id:'f338',n:'Bún cá rô đồng Chuẩn',p:'1 tô',k:450,pr:26,fa:10,ca:55,pc:0},
  {id:'f339',n:'Nui xào Bò',p:'1 dĩa',k:620,pr:28,fa:22,ca:75,pc:1},
  {id:'f340',n:'Mì hoành thánh Xá xíu',p:'1 tô',k:520,pr:25,fa:16,ca:65,pc:0},
  {id:'f341',n:'Mì vịt tiềm Chuẩn',p:'1 tô',k:650,pr:32,fa:25,ca:70,pc:1},
  {id:'f342',n:'Súp cua Trứng cút',p:'1 chén',k:180,pr:12,fa:5,ca:22,pc:0},
  {id:'f343',n:'Súp gà Bắp',p:'1 chén',k:160,pr:12,fa:4,ca:18,pc:0},
  {id:'f344',n:'Bánh đa cua Hải Phòng',p:'1 tô',k:550,pr:28,fa:18,ca:65,pc:0},
  {id:'f345',n:'Bánh đa cá Hải Phòng',p:'1 tô',k:500,pr:30,fa:14,ca:58,pc:0},
  {id:'f346',n:'Bún thang Hà Nội',p:'1 tô',k:430,pr:26,fa:10,ca:55,pc:0},
  {id:'f347',n:'Bún ngan Chuẩn',p:'1 tô',k:520,pr:28,fa:18,ca:55,pc:0},
  {id:'f348',n:'Miến ngan Chuẩn',p:'1 tô',k:480,pr:28,fa:15,ca:50,pc:0},
  {id:'f349',n:'Cháo vịt Chuẩn',p:'1 tô',k:420,pr:22,fa:14,ca:48,pc:0},
  {id:'f350',n:'Cháo sườn Quẩy',p:'1 tô',k:350,pr:12,fa:10,ca:50,pc:1},
  {id:'f351',n:'Cơm sườn Trứng',p:'1 dĩa',k:750,pr:38,fa:28,ca:82,pc:1},
  {id:'f352',n:'Cơm Thịt kho',p:'1 dĩa',k:680,pr:28,fa:24,ca:78,pc:1},
  {id:'f353',n:'Cơm Cá kho',p:'1 dĩa',k:550,pr:30,fa:15,ca:72,pc:0},
  {id:'f354',n:'Cơm Gà chiên mắm',p:'1 dĩa',k:780,pr:35,fa:35,ca:75,pc:1},
  {id:'f355',n:'Cơm Bò lúc lắc',p:'1 dĩa',k:720,pr:35,fa:28,ca:70,pc:1},
  {id:'f356',n:'Cơm Bò xào',p:'1 dĩa',k:650,pr:32,fa:20,ca:72,pc:0},
  {id:'f357',n:'Cơm chiên Cá mặn',p:'1 dĩa',k:650,pr:22,fa:24,ca:80,pc:1},
  {id:'f358',n:'Cơm Trứng chiên',p:'1 dĩa',k:450,pr:15,fa:12,ca:65,pc:0},
  {id:'f359',n:'Cơm Cá chiên',p:'1 dĩa',k:620,pr:30,fa:22,ca:70,pc:1},
  {id:'f360',n:'Cơm Đùi gà nướng',p:'1 dĩa',k:680,pr:35,fa:22,ca:75,pc:0},
  {id:'f361',n:'Cơm Vịt quay',p:'1 dĩa',k:760,pr:32,fa:35,ca:72,pc:1},
  {id:'f362',n:'Cơm Xá xíu',p:'1 dĩa',k:720,pr:32,fa:28,ca:75,pc:1},
  {id:'f363',n:'Cơm Heo quay',p:'1 dĩa',k:780,pr:32,fa:38,ca:70,pc:1},
  {id:'f364',n:'Cơm Chả cá',p:'1 dĩa',k:600,pr:28,fa:18,ca:72,pc:0},
  {id:'f365',n:'Cơm Gà sốt tiêu',p:'1 dĩa',k:680,pr:34,fa:22,ca:72,pc:0},
  {id:'f366',n:'Cá viên chiên Chiên',p:'5 viên',k:250,pr:10,fa:15,ca:18,pc:1},
  {id:'f367',n:'Bò viên chiên Chiên',p:'5 viên',k:280,pr:14,fa:18,ca:15,pc:1},
  {id:'f368',n:'Hồ lô nướng Xúc xích mini',p:'1 cây',k:180,pr:6,fa:14,ca:8,pc:1},
  {id:'f369',n:'Xiên que Thập cẩm',p:'1 xiên',k:120,pr:5,fa:8,ca:8,pc:1},
  {id:'f370',n:'Xúc xích Chiên',p:'1 cây',k:180,pr:6,fa:15,ca:5,pc:1},
  {id:'f371',n:'Khoai tây Lắc phô mai',p:'1 phần',k:420,pr:5,fa:22,ca:52,pc:1},
  {id:'f372',n:'Gà rán Lắc phô mai',p:'2 miếng',k:520,pr:28,fa:30,ca:30,pc:1},
  {id:'f373',n:'Phô mai que Chiên',p:'2 cây',k:260,pr:10,fa:18,ca:15,pc:1},
  {id:'f374',n:'Bánh gạo Chiên',p:'1 phần',k:350,pr:6,fa:12,ca:55,pc:1},
  {id:'f375',n:'Trứng nướng Mỡ hành',p:'1 chén',k:180,pr:8,fa:12,ca:8,pc:1},
  {id:'f376',n:'Bánh mì nướng Muối ớt',p:'1 ổ',k:320,pr:8,fa:14,ca:42,pc:1},
  {id:'f377',n:'Bánh tráng Sa tế',p:'1 phần',k:280,pr:8,fa:10,ca:42,pc:1},
  {id:'f378',n:'Bánh tráng Me',p:'1 phần',k:260,pr:6,fa:8,ca:45,pc:1},
  {id:'f379',n:'Ba chỉ heo Nướng',p:'100g',k:380,pr:16,fa:34,ca:2,pc:1},
  {id:'f380',n:'Sườn heo Nướng',p:'100g',k:320,pr:22,fa:24,ca:5,pc:1},
  {id:'f381',n:'Bạch tuộc Nướng sa tế',p:'100g',k:160,pr:25,fa:5,ca:3,pc:0},
  {id:'f382',n:'Hàu Nướng mỡ hành',p:'3 con',k:180,pr:12,fa:12,ca:6,pc:0},
  {id:'f383',n:'Hàu Phô mai',p:'3 con',k:260,pr:14,fa:20,ca:6,pc:1},
  {id:'f384',n:'Ếch Nướng',p:'100g',k:140,pr:20,fa:5,ca:2,pc:0},
  {id:'f385',n:'Lòng heo Nướng',p:'100g',k:260,pr:15,fa:20,ca:2,pc:1},
  {id:'f386',n:'Bê thui Cuốn bánh tráng',p:'1 phần',k:450,pr:35,fa:18,ca:28,pc:0},
  {id:'f387',n:'Dê Nướng',p:'100g',k:190,pr:25,fa:9,ca:2,pc:0},
  {id:'f388',n:'Bò lá lốt Nướng',p:'5 cuốn',k:320,pr:22,fa:22,ca:8,pc:0},
  {id:'f389',n:'Chân gà Nướng',p:'2 cái',k:280,pr:20,fa:18,ca:8,pc:1},
  {id:'f390',n:'Gân bò Nướng',p:'100g',k:170,pr:28,fa:5,ca:2,pc:0},
  {id:'f391',n:'Cóc Chua',p:'100g',k:44,pr:1,fa:0.3,ca:11,pc:0},
  {id:'f392',n:'Mận Hà Nội',p:'100g',k:46,pr:0.7,fa:0.2,ca:11,pc:0},
  {id:'f393',n:'Sapoche Chín',p:'100g',k:83,pr:0.4,fa:1,ca:20,pc:0},
  {id:'f394',n:'Na Mãng cầu ta',p:'100g',k:94,pr:2,fa:0.5,ca:23,pc:0},
  {id:'f395',n:'Mãng cầu xiêm Chín',p:'100g',k:66,pr:1,fa:0.3,ca:17,pc:0},
  {id:'f396',n:'Dừa non Cơm dừa',p:'100g',k:140,pr:1.5,fa:13,ca:6,pc:0},
  {id:'f397',n:'Kiwi Xanh',p:'100g',k:61,pr:1.1,fa:0.5,ca:15,pc:0},
  {id:'f398',n:'Việt quất Tươi',p:'100g',k:57,pr:0.7,fa:0.3,ca:14,pc:0},
  {id:'f399',n:'Cherry Tươi',p:'100g',k:63,pr:1,fa:0.2,ca:16,pc:0},
  {id:'f400',n:'Lê Châu Á',p:'100g',k:42,pr:0.5,fa:0.1,ca:11,pc:0},
  {id:'f401',n:'Coca-Cola Zero',p:'Lon 330ml',k:0,pr:0,fa:0,ca:0,pc:0},
  {id:'f402',n:'Pepsi Black',p:'Lon 330ml',k:0,pr:0,fa:0,ca:0,pc:0},
  {id:'f403',n:'Sprite Chuẩn',p:'Lon 330ml',k:140,pr:0,fa:0,ca:35,pc:1},
  {id:'f404',n:'Fanta Cam',p:'Lon 330ml',k:150,pr:0,fa:0,ca:38,pc:1},
  {id:'f405',n:'Mirinda Cam',p:'Lon 330ml',k:155,pr:0,fa:0,ca:39,pc:1},
  {id:'f406',n:'C2 Trà xanh',p:'Chai 360ml',k:90,pr:0,fa:0,ca:22,pc:1},
  {id:'f407',n:'Không Độ Trà xanh',p:'Chai 455ml',k:85,pr:0,fa:0,ca:21,pc:1},
  {id:'f408',n:'Oolong Tea+ Không đường',p:'Chai 455ml',k:0,pr:0,fa:0,ca:0,pc:0},
  {id:'f409',n:'Sting Gold',p:'Lon 330ml',k:170,pr:0,fa:0,ca:42,pc:1},
  {id:'f410',n:'Warrior Energy Drink',p:'Lon 330ml',k:160,pr:0,fa:0,ca:40,pc:1},
  {id:'f411',n:'Number 1 Energy Drink',p:'Chai 330ml',k:150,pr:0,fa:0,ca:37,pc:1},
  {id:'f412',n:'Milo Hộp',p:'180ml',k:140,pr:4,fa:4,ca:22,pc:0},
  {id:'f413',n:'Ensure Original',p:'220ml',k:230,pr:9,fa:6,ca:34,pc:0},
  {id:'f414',n:'Mì gói Hảo Hảo tôm chua cay',p:'1 gói',k:350,pr:7,fa:14,ca:49,pc:1},
  {id:'f415',n:'Mì gói Omachi bò hầm',p:'1 gói',k:380,pr:8,fa:16,ca:52,pc:1},
  {id:'f416',n:'Mì gói Indomie Mi Goreng',p:'1 gói',k:390,pr:8,fa:17,ca:52,pc:1},
  {id:'f417',n:'Bánh Oreo',p:'3 cái',k:160,pr:2,fa:7,ca:25,pc:1},
  {id:'f418',n:'Bánh Chocopie',p:'1 cái',k:170,pr:2,fa:6,ca:28,pc:1},
  {id:'f419',n:'Chocolate Snickers',p:'1 thanh',k:250,pr:4,fa:12,ca:33,pc:1},
  {id:'f420',n:'Bánh mì chả cá Đà Nẵng',p:'1 ổ',k:420,pr:20,fa:14,ca:48,pc:0},
  {id:'f421',n:'Bún nem nướng Nha Trang',p:'1 phần',k:580,pr:28,fa:18,ca:68,pc:1},
  {id:'f422',n:'Cơm gà xé Tam Kỳ',p:'1 dĩa',k:580,pr:32,fa:14,ca:75,pc:0},
  {id:'f423',n:'Bún cua Miền Tây',p:'1 tô',k:500,pr:24,fa:14,ca:62,pc:0},
  {id:'f424',n:'Mì quảng ếch Quảng Nam',p:'1 tô',k:620,pr:32,fa:22,ca:60,pc:1},
  {id:'f425',n:'Bún nước lèo Sóc Trăng',p:'1 tô',k:520,pr:26,fa:14,ca:68,pc:0},
  {id:'f426',n:'Bún sứa Nha Trang',p:'1 tô',k:430,pr:28,fa:8,ca:55,pc:0},
  {id:'f427',n:'Bún kèn Phú Quốc',p:'1 tô',k:500,pr:24,fa:16,ca:60,pc:0},
  {id:'f428',n:'Hủ tiếu sa tế Bò',p:'1 tô',k:620,pr:30,fa:22,ca:65,pc:1},
  {id:'f429',n:'Phá lấu Bánh mì',p:'1 phần',k:550,pr:22,fa:30,ca:40,pc:1},
  {id:'f430',n:'Bánh mì phá lấu Sài Gòn',p:'1 ổ',k:520,pr:20,fa:24,ca:52,pc:1},
  {id:'f431',n:'Bánh mì que Hải Phòng',p:'1 ổ',k:220,pr:8,fa:8,ca:30,pc:0},
  {id:'f432',n:'Cơm niêu Cá kho',p:'1 phần',k:650,pr:30,fa:18,ca:82,pc:0},
  {id:'f433',n:'Cơm cháy Kho quẹt',p:'1 phần',k:580,pr:14,fa:24,ca:72,pc:1},
  {id:'f434',n:'Lẩu bò Nhúng giấm',p:'1 phần',k:580,pr:38,fa:18,ca:40,pc:0},
  {id:'f435',n:'Lẩu dê Chuẩn',p:'1 phần',k:620,pr:40,fa:24,ca:38,pc:0},
  {id:'f436',n:'Bánh đập Quảng Nam',p:'1 phần',k:350,pr:10,fa:8,ca:58,pc:0},
  {id:'f437',n:'Bánh ướt Thịt nướng',p:'1 phần',k:520,pr:26,fa:16,ca:60,pc:0},
  {id:'f438',n:'Bún thái Hải sản',p:'1 tô',k:480,pr:26,fa:10,ca:62,pc:0},
  {id:'f439',n:'Mì cay Hải sản',p:'1 tô',k:600,pr:30,fa:20,ca:72,pc:1},
  {id:'f440',n:'Cơm âm phủ Huế',p:'1 dĩa',k:620,pr:28,fa:18,ca:78,pc:0},
  {id:'f441',n:'Bánh mì Gà xé',p:'1 ổ',k:430,pr:24,fa:12,ca:50,pc:0},
  {id:'f442',n:'Bún thịt nướng Chả giò',p:'1 tô',k:650,pr:30,fa:22,ca:70,pc:1},
  {id:'f443',n:'Gỏi gà Bắp cải',p:'1 phần',k:280,pr:28,fa:8,ca:12,pc:0},
  {id:'f444',n:'Gỏi ngó sen Tôm thịt',p:'1 phần',k:260,pr:18,fa:8,ca:18,pc:0}
];

function sFood(q){if(!q)return FDB.slice(0,16);const l=q.toLowerCase();return FDB.filter(f=>f.n.toLowerCase().includes(l)).slice(0,20);}
const ACTS=[{id:'walk',n:'Ði bộ nhanh',met:5.0,ic:'🚶'},{id:'jog',n:'Chạy bộ',met:8.0,ic:'🏃'},{id:'run',n:'Chạy nhanh',met:11.0,ic:'⚡'},{id:'cycle',n:'Ðạp xe',met:5.5,ic:'🚴'},{id:'swim',n:'Bơi lội',met:8.0,ic:'🏊'},{id:'gym',n:'Tập gym',met:5.5,ic:'🏋'},{id:'hiit',n:'HIIT',met:10.0,ic:'🔥'},{id:'yoga',n:'Yoga',met:4.0,ic:'🧘'},{id:'football',n:'Bóng ðá',met:8.0,ic:'⚽'},{id:'badminton',n:'Cầu lông',met:5.5,ic:'🏸'},{id:'jumprope',n:'Nhảy dây',met:11.0,ic:'🪢'},{id:'stairs',n:'Leo cầu thang',met:8.8,ic:'🪜'},{id:'cleaning',n:'Dọn nhà',met:3.8,ic:'🧹'},{id:'other',n:'Khác',met:5.0,ic:'✨'}];
const C={KG:7700,PRO_PER_KG:1.8,MIN_SLP:6,SURPLUS:300,ACT:{sedentary:{f:1.20},light:{f:1.375},moderate:{f:1.55},active:{f:1.725},very_active:{f:1.90}},GOAL:{lose_fat:{d:-500},lose_weight:{d:-600},gain_muscle:{d:300},recomp:{d:0},maintain:{d:0}}};
const DB={now(){return new Date().toISOString().slice(0,10);},_r(k){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}},_w(k,v){localStorage.setItem(k,JSON.stringify(v));},gProf(){return DB._r('vt_p');},sProf(p){if(!p.sd)p.sd=DB.now();DB._w('vt_p',p);return p;},gLogs(){return(DB._r('vt_l')||[]).sort((a,b)=>a.d.localeCompare(b.d));},gLog(dt){return DB.gLogs().find(l=>l.d===dt)||null;},gToday(){return DB.gLog(DB.now())||DB._blank(DB.now());},uLog(log){const ls=DB.gLogs();const i=ls.findIndex(l=>l.d===log.d);if(i>=0)ls[i]=log;else ls.push(log);DB._w('vt_l',ls);return log;},elapsed(){const p=DB.gProf();if(!p||!p.sd)return 0;return Math.max(0,Math.round((Date.now()-new Date(p.sd))/86400000));},_blank(d){return{d,wt:null,foods:[],acts:[],steps:0,slp:7,water:2.5};},clear(){['vt_p','vt_l'].forEach(k=>localStorage.removeItem(k));}};
const E1={bmr(w,h,a){return Math.round(10*w+6.25*h-5*a+5);},tdee(bmr,al){return Math.round(bmr*(C.ACT[al]||C.ACT.moderate).f);},aTDEE(logs){const v=logs.filter(l=>l.wt&&l.foods&&l.foods.length>0);if(v.length<7)return null;const r=v.slice(-14);const ai=r.reduce((s,l)=>s+l.foods.reduce((t,f)=>t+(f.k||0)*(f.q||1),0),0)/r.length;const wd=r[r.length-1].wt-r[0].wt;return Math.round(ai-(wd*C.KG/r.length));},calc(prof,logs){if(!prof)return null;const wls=logs.filter(l=>l.wt);const w=wls.length?wls[wls.length-1].wt:prof.ws;const bmr=E1.bmr(w,prof.h,prof.age);const tb=E1.tdee(bmr,prof.al);const at=E1.aTDEE(logs);const tdee=at||tb;const gd=C.GOAL[prof.gt]||C.GOAL.lose_fat;const tk=prof.ckal||Math.max(1200,tdee+gd.d);const tp=prof.cpro||Math.round(w*C.PRO_PER_KG);return{w,bmr,tdee,ia:!!at,tk,tp};}};
const E2={tot(log){return(log.foods||[]).reduce((a,f)=>{const q=f.q||1;a.k+=(f.k||0)*q;a.pr+=(f.pr||0)*q;a.fa+=(f.fa||0)*q;a.ca+=(f.ca||0)*q;if(f.pc)a.pk+=(f.k||0)*q;return a;},{k:0,pr:0,fa:0,ca:0,pk:0});},actBurn(log){return(log.acts||[]).reduce((s,a)=>s+(a.k||0),0);}};
const E3={ma(vs,win){win=win||7;return vs.map((_,i)=>{const sl=vs.slice(Math.max(0,i-win+1),i+1);return sl.reduce((s,v)=>s+v,0)/sl.length;});},slope(s){const n=s.length;if(n<2)return 0;const xs=s.map((_,i)=>i);const mx=xs.reduce((a,v)=>a+v,0)/n,my=s.reduce((a,v)=>a+v,0)/n;const nm=xs.reduce((a,x,i)=>a+(x-mx)*(s[i]-my),0);const dn=xs.reduce((a,x)=>a+(x-mx)**2,0);return dn?nm/dn:0;},calc(prof,logs){if(!prof)return{dd:0,tw:null,wt7:0,pp:0,ok:false,series:[]};const wv=logs.filter(l=>l.wt).map(l=>l.wt);const dd=wv.length;const cw=wv.length?wv[wv.length-1]:prof.ws;const tot=Math.abs(prof.ws-prof.wg);const done=Math.abs(prof.ws-cw);const pp=tot>0?Math.min(100,Math.max(0,Math.round(done/tot*100))):0;if(dd<2)return{dd,tw:cw,wt7:0,pp,ok:false,series:wv};const ma=E3.ma(wv);const sl=E3.slope(ma);return{dd,tw:Math.round(ma[ma.length-1]*100)/100,wt7:Math.round(sl*7*100)/100,pp,ok:dd>=7,series:wv};}};
const E4={calc(prof,logs,e1,e3){if(!prof||!e1)return null;const dr=e3.ok?(e3.wt7/7):-Math.abs((e1.tdee-e1.tk)/C.KG);const cw=e3.tw||e1.w;const rem=prof.wg-cw;const twd=Math.abs(dr)>0.0001&&((rem<0&&dr<0)||(rem>0&&dr>0));let dtg=0,gd='--';if(twd){dtg=Math.round(Math.abs(rem/dr));const dd=new Date();dd.setDate(dd.getDate()+dtg);gd=String(dd.getDate()).padStart(2,'0')+'/'+String(dd.getMonth()+1).padStart(2,'0')+'/'+dd.getFullYear();}const pred=d=>Math.round((cw+dr*d)*10)/10;const el=DB.elapsed();const pr=(prof.wg-prof.ws)/(prof.ddl||90);const en=prof.ws+pr*el;const dir=prof.wg<prof.ws?-1:1;const dab=Math.abs(pr)>0?Math.round((en-cw)*dir/Math.abs(pr)):0;return{dr,dtg,gd,pred30:pred(30),pred60:pred(60),pred90:pred(90),dab,el,twd};}};
const E5={_s(r){return 1/(1+Math.exp(-4*(r-0.7)));},prob(e4,prof,e3){if(!e4||!prof)return 0;const req=Math.abs(prof.wg-prof.ws)/(prof.ddl||90);const act=Math.abs(e3.wt7)/7;return Math.min(99,Math.max(1,Math.round(E5._s(req>0?act/req:0)*100)));},verdict(e4){if(!e4)return'Chua du du lieu';const d=e4.dab;if(Math.abs(d)<1)return'Ban dang <em>dung nhip</em> ke hoach';return d>0?'Dang <em>dan truoc</em> '+d+' ngay':'Dang <em>cham hon</em> '+Math.abs(d)+' ngay';}};
const E6={_stk(logs,fn){let s=0;for(let i=logs.length-1;i>=0;i--){if(fn(logs[i]))s++;else break;}return s;},calc(logs,e1){if(!logs||!e1)return[];const r=logs.slice(-14),rs=[];if(E6._stk(r,l=>E2.tot(l).pr/e1.tp<0.7)>=3)rs.push({ic:'!',t:'Protein thap lien tiep',s:'Nguy co mat co khi dang giam mo',c:'warn'});if(E6._stk(r,l=>(l.slp||0)<C.MIN_SLP)>=5)rs.push({ic:'z',t:'Tham hut giac ngu',s:'Cortisol tang, co the giu mo',c:'warn'});if(E6._stk(r,l=>E2.tot(l).k>e1.tdee+C.SURPLUS)>=7)rs.push({ic:'!',t:'Du calo lien tuc',s:'Muc tieu dang bi dao nguoc',c:'high'});return rs;}};
const E7={calc(risks,e1,e3,log){const rs=[],tot=E2.tot(log);if(risks.find(r=>r.c==='warn'&&r.t.includes('Protein'))){const n=Math.max(10,Math.round(e1.tp-tot.pr));rs.push({ic:'?',t:'Bo sung '+n+'g protein hom nay',w:'Ngan mat co khi dang tham hut calo'});}if(risks.find(r=>r.t.includes('ngu')))rs.push({ic:'z',t:'Ngu truoc 22:30',w:'Cortisol ve muc binh thuong'});if(rs.length<2&&e3.wt7>-0.1)rs.push({ic:'!',t:'Them 20 phut di bo sau bua toi',w:'~120 kcal tieu thu them'});if(rs.length<2&&(log.water||0)<2)rs.push({ic:'~',t:'Uong them '+(2.5-(log.water||0)).toFixed(1)+'L nuoc',w:'Trao doi chat va giam cam giac them an'});if(!rs.length)rs.push({ic:'ok',t:'Giu dung ke hoach hom nay',w:'Consistency la chia khoa'});return rs.slice(0,3);}};
const OB={run(){try{const p=DB.gProf();if(!p)return{err:'no_prof'};const ls=DB.gLogs();const tl=DB.gToday();const e1=E1.calc(p,ls);if(!e1)return{err:'no_e1'};const e3=E3.calc(p,ls);const e4=E4.calc(p,ls,e1,e3);const prob=E5.prob(e4,p,e3);const verd=E5.verdict(e4);const risks=E6.calc(ls,e1);const recos=E7.calc(risks,e1,e3,tl);const tot=E2.tot(tl);const burn=E2.actBurn(tl);const net=tot.k-burn;const calS=tot.k>=e1.tk*0.85&&tot.k<=e1.tk*1.15?'ok':tot.k>e1.tk*1.15?'over':'under';const proS=tot.pr>=e1.tp*0.9?'ok':'low';return{p,e1,e3,e4,prob,verd,risks,recos,tot,burn,net,calS,proS,tl,ls};}catch(err){console.error(err);return{err:err.message};}}};
(function(){
const Q=(s,c=document)=>c.querySelector(s);
const QA=(s,c=document)=>Array.from(c.querySelectorAll(s));
const QI=id=>document.getElementById(id);
function pct(v,mx){return Math.min(100,Math.max(0,mx?Math.round(v/mx*100):0));}
function cu(el,to,dur,sf){if(!el)return;const t0=performance.now();(function f(n){const k=Math.min(1,(n-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=Math.round(to*e)+(sf||'');if(k<1)requestAnimationFrame(f);})(t0);}
function fmtDay(){const d=new Date(),D=['CN','T2','T3','T4','T5','T6','T7'];return D[d.getDay()]+' '+String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0');}
function dayOff(d,n){const dt=new Date(d+'T00:00:00');dt.setDate(dt.getDate()+n);return dt.toISOString().slice(0,10);}
function fmtDate(d){const dt=new Date(d+'T00:00:00');return String(dt.getDate()).padStart(2,'0')+'/'+String(dt.getMonth()+1).padStart(2,'0');}

let _log=null,_ob=null,_tab=0,_built={0:false,1:false,2:false};
let _fDate=DB.now(),_aDate=DB.now();

function loadLog(){_log={...DB.gToday()};}
function persist(){DB.uLog(_log);}
function rebuild(){_ob=OB.run();}
function show(id){QA('.pane').forEach(p=>p.classList.remove('act'));QI(id).classList.add('act');}
function toTab(n){show('p-main');QA('.tp').forEach((p,i)=>p.classList.toggle('act',i===n));QA('.tb-btn').forEach((b,i)=>b.classList.toggle('on',i===n));_tab=n;rebuild();if(n===0){renderDash();_built[0]=true;}if(n===1){if(_fDate===DB.now()&&_built[1])refreshFood();else buildFood();}if(n===2){if(_aDate===DB.now()&&_built[2])refreshAct();else buildAct();}_built[n]=true;}
function boot(){show('p-spl');loadLog();setTimeout(()=>DB.gProf()?toTab(0):obInit(),1300);}

// ── ONBOARDING ──
let _os=1;
const _od={name:'Phuc',age:29,h:175,ws:null,wg:null,al:'sedentary',gt:'lose_fat',ddl:90};
function obInit(){show('p-ob');obGo(1);}
function obGo(n){_os=n;QA('.ob-s').forEach(s=>s.classList.toggle('act',parseInt(s.dataset.s)===n));const b=QI('ob-bar');if(b)b.style.setProperty('--p',(n===1?'0%':'100%'));}
function obNext(){
  if(_os===1){
    const ag=parseInt(QI('oa').value),ht=parseInt(QI('oh').value);
    const ws=parseFloat(QI('ows').value),wg=parseFloat(QI('owg').value);
    if(!ag||!ht)return alert('Nhap tuoi va chieu cao');
    if(!ws||!wg)return alert('Nhap can hien tai va can muc tieu');
    Object.assign(_od,{age:ag,h:ht,ws,wg});
    obCalc();obGo(2);return;
  }
}
function obPrev(){if(_os>1)obGo(_os-1);}
function obSelAct(el){_od.al=el.dataset.al;QA('[data-al]').forEach(e=>e.classList.toggle('sel',e.dataset.al===_od.al));}
function obSelGoal(el){_od.gt=el.dataset.gt;QA('[data-gt]').forEach(e=>e.classList.toggle('sel',e.dataset.gt===_od.gt));}
function obSelDl(el){_od.ddl=parseInt(el.dataset.dl);QA('[data-dl]').forEach(e=>e.classList.toggle('sel',e.dataset.dl===''+_od.ddl));}
function obDelta(){const ws=parseFloat(QI('ows').value)||0,wg=parseFloat(QI('owg').value)||0;const d=Math.abs(ws-wg),dir=ws>wg?'giam':'tang';QI('odelta').innerHTML=d>0?'Can '+dir+': <b>'+d.toFixed(1)+'kg</b>':'Nhap ca hai o';}
function obCalc(){const bmr=E1.bmr(_od.ws,_od.h,_od.age);const tdee=E1.tdee(bmr,_od.al);const gd=C.GOAL[_od.gt]||C.GOAL.lose_fat;const tk=Math.max(1200,tdee+gd.d);const tp=Math.round(_od.ws*C.PRO_PER_KG);const rday=Math.abs(gd.d)/C.KG;const dn=rday>0?Math.round(Math.abs(_od.wg-_od.ws)/rday):_od.ddl;const rd=new Date();rd.setDate(rd.getDate()+dn);QI('ob-sum').innerHTML='<div class="sr"><span>BMR</span><b>'+bmr+' kcal</b></div><div class="sr"><span>TDEE</span><b>'+tdee+' kcal</b></div><div class="sr"><span>Muc tieu calo</span><b class="cy">'+tk+' kcal/ngay</b></div><div class="sr"><span>Protein can</span><b class="cy">'+tp+'g/ngay</b></div><div class="sr"><span>Du kien dat</span><b class="ok">'+rd.toLocaleDateString('vi-VN')+'</b></div><div class="sr"><span>Khoang giam</span><b>'+Math.abs(_od.wg-_od.ws).toFixed(1)+'kg</b></div>';}
function obSave(){_od.sd=DB.now();DB.sProf({..._od});loadLog();toTab(0);}

// ── HEATMAP ──
function mkHeatmap(logs,e1){
  const now=new Date();const y=now.getFullYear(),m=now.getMonth();
  const days=new Date(y,m+1,0).getDate();
  const first=(new Date(y,m,1).getDay()+6)%7;
  const tod=DB.now();let cells='';
  for(let i=0;i<first;i++)cells+='<div class="hm-e"></div>';
  for(let d=1;d<=days;d++){
    const ds=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const log=logs.find(l=>l.d===ds);const isFut=ds>tod;
    let lv=0;
    if(log&&!isFut){const tot=E2.tot(log);const tk=e1?e1.tk:2000;
      if(log.wt)lv++;
      if(log.foods&&log.foods.length>0)lv++;
      if(tot.k>=tk*0.75&&tot.k<=tk*1.15)lv++;
      if(log.acts&&log.acts.length>0)lv++;}
    cells+='<div class="hm-c lv'+lv+(ds===tod?' hm-td':'')+(isFut?' hm-f':'')+'"></div>';
  }
  const wds='<div class="hm-wds"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span></div>';
  return '<div class="hm-hd"><span>Thang '+(m+1)+'/'+y+'</span><div class="hm-legend"><span class="lv-dot lv1"></span><span class="lv-dot lv2"></span><span class="lv-dot lv3"></span><span class="lv-dot lv4"></span></div></div>'+wds+'<div class="hm-grid">'+cells+'</div>';
}

// ── SPARKLINE ──
function mkSpark(series,goal){if(series.length<2)return'';const w=280,h=44,pad=5;const mn=Math.min(...series),mx=Math.max(...series);const rng=Math.max(mx-mn,0.5);const pts=series.map((v,i)=>Math.round(pad+i/(series.length-1)*(w-pad*2))+','+Math.round(pad+(1-(v-mn)/rng)*(h-pad*2))).join(' ');const last=pts.split(' ').pop().split(',');const goalY=goal>=mn&&goal<=mx?Math.round(pad+(1-(goal-mn)/rng)*(h-pad*2)):-1;return'<svg viewBox="0 0 '+w+' '+h+'" class="spark-svg" preserveAspectRatio="none">'+(goalY>0?'<line x1="'+pad+'" y1="'+goalY+'" x2="'+(w-pad)+'" y2="'+goalY+'" stroke="var(--ok)" stroke-width="1" stroke-dasharray="4,3" opacity=".45"/>':"")+'<polyline points="'+pts+'" fill="none" stroke="var(--cyan)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="'+last[0]+'" cy="'+last[1]+'" r="3" fill="var(--cyan)"/></svg>';}

// ── DASHBOARD ──
function mkGoals(p,e1,e3){const cw=e3&&e3.tw?e3.tw:p.ws;return'<div class="g-row"><div class="g-d"><div class="g-k">Calo / Protein</div><div class="g-v">'+e1.tk+' kcal'+(p.ckal?' <span class="g-tag">tuy chinh</span>':'')+' &middot; '+e1.tp+'g'+(p.cpro?' <span class="g-tag">tuy chinh</span>':'')+'</div></div></div><div class="g-row"><div class="g-d"><div class="g-k">Can muc tieu &middot; con lai</div><div class="g-v">'+p.wg+'kg &middot; <span class="dim">'+Math.abs(p.wg-cw).toFixed(1)+'kg</span></div></div></div><div class="g-row"><div class="g-d"><div class="g-k">Deadline &middot; TDEE</div><div class="g-v">'+p.ddl+' ngay &middot; <span class="dim">'+e1.tdee+' kcal</span></div></div></div>';}
function renderDash(){
  if(!_ob||_ob.err){QI('t-dash').innerHTML='<div style="padding:40px;text-align:center;color:#4E5872">Đang tải...</div>';return;}
  const{p,e1,e3,e4,prob,verd,risks,recos,tot,burn,net,calS,tl,ls}=_ob;
  const ahead=e4?.dab||0;const planPct=Math.min(100,Math.round((e4?.el||0)/(p.ddl||90)*100));
  const cw=e3.tw||e1.w;
  const vlbl=ahead>0?'ĐANG THẮNG':ahead<0?'CẦN ĐẨY':'ĐÚNG NHỊP';const vcls=ahead>=0?'ok':'warn';
  const spark=mkSpark(e3.series||[],p.wg);
  // Dual ring calcs
  const outerOff=Math.round(188*(1-pct(tot.k,e1.tk)/100));
  const innerCirc=132;const innerOff=Math.round(innerCirc*(1-pct(tot.pr,e1.tp)/100));
  const ringColor=calS==='ok'?'var(--ok)':calS==='over'?'var(--rose)':'var(--cyan)';
  // Fat & carb targets (from calorie split 27%F/45%C)
  const tfa=Math.round(e1.tk*0.27/9);const tca=Math.round(e1.tk*0.45/4);
  // Quality donut: % non-processed foods
  const foods=tl.foods||[];
  const qpct=foods.length?Math.round(foods.filter(f=>!f.pc).length/foods.length*100):0;
  const qOff=Math.round(125.6*(1-qpct/100));
  // Balance label
  const balD=Math.abs(Math.round(net-e1.tk));
  const balTxt=net>e1.tk+50?'<span class="rose-c">+'+balD+' dư</span>':net<e1.tk*0.7?'<span class="amber-c">'+balD+' thiếu</span>':'<span class="ok-c">Đúng nhịp</span>';
  let h='<div class="top"><div class="who"><div class="av">'+p.name.charAt(0).toUpperCase()+'</div><div><div class="hi">'+fmtDay()+'</div><div class="nm">'+p.name+'</div></div></div><div class="d-hd-r"><div class="verdict '+vcls+'"><span class="pulse"></span>'+vlbl+'</div><div class="flame"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 2 3 2 3-5z"/></svg>'+(e4?.el||0)+'</div></div></div>'
  +'<div class="scroll"><div class="stagger">'
  // ── DUAL RING BLOCK ──
  +'<div class="ring-block"><div class="ring-rel"><svg class="cal-ring" viewBox="0 0 68 68">'
  +'<circle cx="34" cy="34" r="30" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="6"/>'
  +'<circle cx="34" cy="34" r="30" fill="none" stroke="'+ringColor+'" stroke-width="6" stroke-linecap="round" stroke-dasharray="188" stroke-dashoffset="'+outerOff+'" transform="rotate(-90 34 34)" style="transition:stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)"/>'
  +'<circle cx="34" cy="34" r="21" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="5"/>'
  +'<circle cx="34" cy="34" r="21" fill="none" stroke="var(--indigo)" stroke-width="5" stroke-linecap="round" stroke-dasharray="'+innerCirc+'" stroke-dashoffset="'+innerOff+'" transform="rotate(-90 34 34)" style="transition:stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)"/>'
  +'</svg><div class="ring-mid"><div class="ring-big">'+Math.round(tot.k)+'</div><div class="ring-sm-lbl">kcal</div></div></div>'
  +'<div class="ring-stats"><div class="d-sr"><span>Mục tiêu</span><span>'+e1.tk+' · đốt −'+burn+'</span></div>'
  +'<div class="d-sr b"><span>Thực nạp</span><span class="'+(net>e1.tk+100?'rose-c':net<e1.tk*0.7?'amber-c':'ok-c')+'">'+Math.round(net)+' kcal</span></div>'
  +'<div class="d-sr"><span>Protein</span><span class="cy-c">'+Math.round(tot.pr)+'/'+e1.tp+'g</span></div>'
  +'<div class="d-pace"><div class="r you"><span class="k">Bạn</span><span class="bar"><i id="b-you"></i></span><span class="pc ok-c">'+e3.pp+'%</span></div><div class="r plan"><span class="k">KH</span><span class="bar"><i id="b-plan"></i></span><span class="pc dim">'+planPct+'%</span></div></div>'
  +'</div></div>'
  // ── MACRO 3-COL ──
  +'<div class="mac-row">'
  +'<div class="mac"><div class="mac-l">Protein</div><div class="mac-v" style="color:var(--cyan)">'+Math.round(tot.pr)+'<span class="mac-u">g</span></div><div class="mac-b"><div class="mac-bf" style="width:'+pct(tot.pr,e1.tp)+'%;background:var(--cyan)"></div></div><div class="mac-tgt">/ '+e1.tp+'g</div></div>'
  +'<div class="mac"><div class="mac-l">Chất béo</div><div class="mac-v" style="color:var(--amber)">'+Math.round(tot.fa)+'<span class="mac-u">g</span></div><div class="mac-b"><div class="mac-bf" style="width:'+pct(tot.fa,tfa)+'%;background:var(--amber)"></div></div><div class="mac-tgt">/ '+tfa+'g</div></div>'
  +'<div class="mac"><div class="mac-l">Carb</div><div class="mac-v" style="color:var(--ok)">'+Math.round(tot.ca)+'<span class="mac-u">g</span></div><div class="mac-b"><div class="mac-bf" style="width:'+pct(tot.ca,tca)+'%;background:var(--ok)"></div></div><div class="mac-tgt">/ '+tca+'g</div></div>'
  +'</div>'
  // ── MINI CHARTS ROW ──
  +'<div class="charts-row">'
  +'<div class="chart-box"><div class="chart-lbl">Nạp vs Đốt</div><div class="mini-bar-wrap">'
  +'<div class="mb-row"><span class="mb-key" style="color:var(--cyan)">Nạp</span><div class="mb-track"><div class="mb-fill" style="width:'+pct(tot.k,e1.tk)+'%;background:var(--cyan)"></div></div><span class="mb-val" style="color:var(--cyan)">'+Math.round(tot.k)+'</span></div>'
  +'<div class="mb-row"><span class="mb-key" style="color:var(--ok)">Đốt</span><div class="mb-track"><div class="mb-fill" style="width:'+pct(burn,e1.tdee||e1.tk)+'%;background:var(--ok)"></div></div><span class="mb-val" style="color:var(--ok)">'+burn+'</span></div>'
  +'<div class="mb-row"><span class="mb-key" style="color:var(--text3)">MĐ</span><div class="mb-track"><div class="mb-fill" style="width:100%;background:rgba(255,255,255,.06)"></div></div><span class="mb-val" style="color:var(--text3)">'+e1.tk+'</span></div>'
  +'</div><div class="chart-note">'+balTxt+'</div></div>'
  +'<div class="chart-box"><div class="chart-lbl">7 ngày cân</div>'+(spark?'<div class="spark-w-sm">'+spark+'</div>':'<div class="spark-ph">Nhập cân để xem</div>')+'<div class="chart-note">→ <span class="cy-c">'+p.wg+'kg</span> mục tiêu</div></div>'
  +'<div class="chart-box"><div class="chart-lbl">% Tốt</div><div class="donut-wrap"><svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="8"/><circle cx="26" cy="26" r="20" fill="none" stroke="var(--ok)" stroke-width="8" stroke-dasharray="125.6" stroke-dashoffset="'+qOff+'" stroke-linecap="round" transform="rotate(-90 26 26)"/></svg><div class="donut-label"><div class="dv" style="color:var(--ok)">'+qpct+'%</div><div class="du">tốt</div></div></div><div class="chart-note">'+foods.length+' món hôm nay</div></div>'
  +'</div>'
  // ── HEATMAP ──
  +'<div class="hm-card">'+mkHeatmap(ls,e1)+'</div>'
  // ── WEIGHT COMPACT ──
  +'<div class="d-wt-c"><div class="d-wt-nums"><span class="d-wt-cur">'+cw.toFixed(1)+'<s>kg</s></span><span class="d-wt-w '+(e3.wt7<0?'ok-c':'rose-c')+'">'+(e3.wt7>=0?'+':'')+e3.wt7.toFixed(2)+'/wk</span><span class="d-wt-goal cy-c">→ '+p.wg+'kg</span>'+(e4&&e4.gd?'<span class="dim"> · '+e4.gd+'</span>':'')+'</div></div>'
  // ── PREDICTIONS ──
  +'<div class="d-pred-row"><div class="d-p"><div class="d-p-t">30n</div><div class="d-p-v">'+(e4?.pred30!=null?e4.pred30:cw.toFixed(1))+'</div></div><div class="d-p"><div class="d-p-t">60n</div><div class="d-p-v">'+(e4?.pred60!=null?e4.pred60:cw.toFixed(1))+'</div></div><div class="d-p hi"><div class="d-p-t">90n</div><div class="d-p-v">'+(e4?.pred90!=null?e4.pred90:cw.toFixed(1))+'</div></div><div class="d-p-prob"><div class="d-prob-val" id="d-prob-n">0%</div><div class="d-prob-lbl">'+verd+'</div></div></div>'
  // ── GOALS ──
  +'<div class="lbl-sm">Mục tiêu <button class="edit-btn" id="d-edit-btn" onclick="A.editTargets()">Chỉnh</button></div><div class="goals-card" id="d-goals">'+mkGoals(p,e1,e3)+'</div>'
  +(risks.length?'<div class="lbl-sm">Cảnh báo</div>'+risks.map(r=>'<div class="warn-row '+r.c+'"><div><b>'+r.t+'</b><div class="ws">'+r.s+'</div></div></div>').join(''):'')
  +'</div></div>';
  QI('t-dash').innerHTML=h;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{const by=QI('b-you'),bp=QI('b-plan');if(by)by.style.width=e3.pp+'%';if(bp)bp.style.width=planPct+'%';}));
  setTimeout(()=>cu(QI('d-prob-n'),prob,1500,'%'),150);
}
function editTargets(){const p=DB.gProf();if(!p)return;const e1=E1.calc(p,DB.gLogs());QI('d-goals').innerHTML='<div class="g-edit"><div class="g-ef"><label>Calo muc tieu/ngay</label><div class="g-ef-row"><input id="ge-k" type="number" value="'+e1.tk+'" class="g-inp"><span class="g-u">kcal</span></div></div><div class="g-ef"><label>Protein muc tieu/ngay</label><div class="g-ef-row"><input id="ge-p" type="number" value="'+e1.tp+'" class="g-inp"><span class="g-u">g</span></div></div><div class="g-ef"><label>Can muc tieu</label><div class="g-ef-row"><input id="ge-wg" type="number" step="0.1" value="'+p.wg+'" class="g-inp"><span class="g-u">kg</span></div></div><div class="g-ef"><label>Deadline</label><div class="dl-chips" id="ge-dl">'+[30,60,90,180].map(d=>'<button class="dl-chip'+(p.ddl===d?' sel':'')+'" data-v="'+d+'" onclick="this.closest(\'#ge-dl\').querySelectorAll(\'.dl-chip\').forEach(b=>b.classList.remove(\'sel\'));this.classList.add(\'sel\')">'+d+'n</button>').join('')+'</div></div><div class="g-actions"><button class="btn-s" onclick="A.cancelEdit()">Huy</button><button class="btn-p" onclick="A.saveTargets()">Luu</button></div></div>';QI('d-edit-btn').style.display='none';}
function cancelEdit(){rebuild();renderDash();}
function saveTargets(){const p=DB.gProf();if(!p)return;p.ckal=parseInt(QI('ge-k').value)||null;p.cpro=parseInt(QI('ge-p').value)||null;p.wg=parseFloat(QI('ge-wg').value)||p.wg;const sel=Q('.dl-chip.sel',QI('ge-dl'));if(sel)p.ddl=parseInt(sel.dataset.v);DB.sProf(p);rebuild();renderDash();}

// ── DATE NAV ──
function mkDateBar(curDate,cbName){
  const today=DB.now();const isToday=curDate===today;
  const dt=new Date(curDate+'T00:00:00');
  const days=['CN','T2','T3','T4','T5','T6','T7'];
  const lbl=isToday?'Hôm nay':fmtDate(curDate)+' · '+days[dt.getDay()];
  const prevD=dayOff(curDate,-1);const nextD=dayOff(curDate,1);
  const canFwd=nextD<=today;
  return '<div class="dn-bar"><button class="dn-arr" onclick="A.'+cbName+'(\''+prevD+'\')">'
    +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>'
    +'</button><span class="dn-lbl'+(isToday?' sel':'')+'">'+lbl+'</span>'
    +'<button class="dn-arr"'+(canFwd?'':' disabled')+' onclick="A.'+cbName+'(\''+nextD+'\')">'
    +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>'
    +'</button></div>';
}

// ── FOOD PAGE ──
let _fdbt=null;
function buildFood(){
  const today=DB.now();const isToday=_fDate===today;
  const vLog=isToday?_log:(DB.gLog(_fDate)||DB._blank(_fDate));
  const p=DB.gProf();const e1=p?E1.calc(p,DB.gLogs()):null;
  const tot=E2.tot(vLog);const tk=e1?.tk||2000;const tp=e1?.tp||150;
  const calPct=pct(tot.k,tk);const proPct=pct(tot.pr,tp);
  const qStat=tot.k>tk*1.15?'<span id="f-qs" class="q-over">QUÁ</span>':tot.k>=tk*0.85?'<span id="f-qs" class="q-ok">ĐẠT</span>':tot.k>0?'<span id="f-qs" class="q-low">THIẾU</span>':'<span id="f-qs"></span>';
  QI('t-food').innerHTML=
    '<div class="pg-head"><div class="ph-l"><svg class="ph-ic" viewBox="0 0 24 24"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" y1="2" x2="7" y2="11"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg><div class="ph-t">Thực phẩm</div></div>'+(isToday?'<button class="ph-btn" id="f-edit-btn" onclick="A.fEditTarget()">Sửa mục tiêu</button>':'<span class="ph-badge">Xem lại</span>')+'</div>'
    +mkDateBar(_fDate,'fSetDate')
    +'<div class="f-tgt" id="f-tgt"><div class="ft-row"><div class="ft-item"><div class="ft-k">Calo hôm nay</div><div class="ft-nums"><span id="f-kn" class="ft-big">'+Math.round(tot.k)+'</span><span class="sep"> / </span><span id="f-kt" class="ft-tgt">'+tk+'</span><span class="ft-u"> kcal</span>'+qStat+'</div><div class="ft-bar-w"><div class="ft-bar'+(tot.k>tk*1.15?' over':tot.k>=tk*0.85?' ok':'')+'" id="f-kb" style="width:'+calPct+'%"></div></div></div><div class="ft-div"></div><div class="ft-item"><div class="ft-k">Protein</div><div class="ft-nums"><span id="f-pn" class="ft-big">'+Math.round(tot.pr)+'</span><span class="sep"> / </span><span id="f-pt" class="ft-tgt">'+tp+'</span><span class="ft-u"> g</span></div><div class="ft-bar-w"><div class="ft-bar pro'+(tot.pr>=tp*0.9?' ok':'')+'" id="f-pb" style="width:'+proPct+'%"></div></div></div></div></div>'
    +(isToday?'<div class="f-search"><svg viewBox="0 0 24 24" class="f-sic"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input id="f-q" class="f-qi" type="search" placeholder="Tim 445 mon an Viet Nam..." oninput="A.fSearch()" autocomplete="off"></div>':'')
    +'<div class="f-body">'+(isToday?'<div id="f-res" class="f-res"></div>':'')+'<div class="f-added-sec"><div class="f-added-hd">'+(isToday?'Da them hom nay':'Da an ngay '+fmtDate(_fDate))+' <span id="f-cnt" class="f-cnt-b">'+vLog.foods.length+'</span></div><div id="f-added"></div></div></div>';
  _built[1]=true;
  renderFAdded(vLog,isToday);
}
function renderFRes(foods){const el=QI('f-res');if(!el)return;el.innerHTML=foods.length?foods.map(f=>'<div class="fr-item" onclick="A.fAdd(\''+f.id+'\')"><div class="fr-l"><div class="fr-n">'+f.n+'</div><div class="fr-p">'+f.p+'</div><div class="mpills"><span class="mp p">P'+f.pr+'</span><span class="mp f">F'+(f.fa||0)+'</span><span class="mp c">C'+(f.ca||0)+'</span>'+(f.pc?'<span class="mp bad">CB</span>':'')+'</div></div><div class="fr-r"><div class="fr-k">'+f.k+'</div><div class="fr-ku">kcal</div></div></div>').join(''):'<div class="f-empty">Không tìm thấy</div>';}
function renderFAdded(vLog,editable){
  const el=QI('f-added');const cnt=QI('f-cnt');if(!el)return;
  const foods=(vLog||_log).foods||[];if(cnt)cnt.textContent=foods.length;
  if(!foods.length){el.innerHTML='<div class="fa-empty">'+(editable?'Tim va nhan mon an de them':'Khong co du lieu ngay nay')+'</div>';return;}
  el.innerHTML=foods.map((f,i)=>{
    const k=Math.round(f.k*(f.q||1)),pr=Math.round(f.pr*(f.q||1));
    const fa=Math.round((f.fa||0)*(f.q||1)),ca=Math.round((f.ca||0)*(f.q||1));
    const pills='<div class="mpills"><span class="mp p">P'+pr+'</span><span class="mp f">F'+fa+'</span><span class="mp c">C'+ca+'</span>'+(f.pc?'<span class="mp bad">CB</span>':'')+'</div>';
    if(editable)return'<div class="fa-item"><div class="fa-l"><div class="fa-n">'+f.n+'</div><div class="fa-m">'+k+' kcal · ×'+parseFloat(f.q.toFixed(1))+'</div>'+pills+'</div><div class="fa-r"><button class="fa-q" onclick="A.fQty('+i+',-1)">&#8722;</button><button class="fa-q" onclick="A.fQty('+i+',1)">+</button><button class="fa-rm" onclick="A.fRm('+i+')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div></div>';
    return'<div class="fa-item ro"><div class="fa-l"><div class="fa-n">'+f.n+'</div><div class="fa-m">'+k+' kcal · ×'+parseFloat(f.q.toFixed(1))+'</div>'+pills+'</div></div>';
  }).join('');
}
function refreshFood(){
  const isToday=_fDate===DB.now();const vLog=isToday?_log:(DB.gLog(_fDate)||DB._blank(_fDate));
  const p=DB.gProf();const e1=p?E1.calc(p,DB.gLogs()):null;
  const tot=E2.tot(vLog);const tk=e1?.tk||2000;const tp=e1?.tp||150;
  const set=(id,v)=>{const el=QI(id);if(el)el.textContent=v;};
  set('f-kn',Math.round(tot.k));set('f-kt',tk);set('f-pn',Math.round(tot.pr));set('f-pt',tp+'g');
  const kb=QI('f-kb');if(kb){kb.style.width=pct(tot.k,tk)+'%';kb.className='ft-bar'+(tot.k>tk*1.15?' over':tot.k>=tk*0.85?' ok':'');}
  const pb=QI('f-pb');if(pb){pb.style.width=pct(tot.pr,tp)+'%';pb.className='ft-bar pro'+(tot.pr>=tp*0.9?' ok':'');}
  const qs=QI('f-qs');if(qs){qs.className=tot.k>tk*1.15?'q-over':tot.k>=tk*0.85?'q-ok':tot.k>0?'q-low':'';qs.textContent=tot.k>tk*1.15?'QUÁ':tot.k>=tk*0.85?'ĐẠT':tot.k>0?'THIẾU':'';}
  renderFAdded(vLog,isToday);
}
function fSearch(){clearTimeout(_fdbt);_fdbt=setTimeout(()=>{const q=QI('f-q')?.value||'';const el=QI('f-res');if(!el)return;if(!q.trim()){el.innerHTML='';return;}renderFRes(sFood(q));},150);}
function fSetDate(d){_fDate=d;buildFood();}
function fAdd(id){const f=FDB.find(x=>x.id===id);if(!f)return;const ex=(_log.foods||[]).findIndex(x=>x.id===id);if(ex>=0){_log.foods[ex].q=(_log.foods[ex].q||1)+1;}else{if(!_log.foods)_log.foods=[];_log.foods.push({id:f.id,n:f.n,k:f.k,pr:f.pr,fa:f.fa,ca:f.ca,pc:f.pc,q:1});}persist();renderFAdded(_log,true);refreshFood();QA('.fr-item').forEach(el=>{if(el.textContent.includes(f.n)){el.classList.add('added');setTimeout(()=>el.classList.remove('added'),500);}});}
function fRm(i){_log.foods.splice(i,1);persist();refreshFood();}
function fQty(i,d){const f=_log.foods[i];if(!f)return;f.q=Math.max(0.5,parseFloat(((f.q||1)+d*0.5).toFixed(1)));persist();refreshFood();}
function fEditTarget(){const p=DB.gProf();if(!p)return;const e1=E1.calc(p,DB.gLogs());QI('f-tgt').innerHTML='<div class="f-edit-form"><div class="f-ef"><label>Calo muc tieu</label><div class="f-ef-r"><input id="fte-k" type="number" value="'+e1.tk+'" class="f-ei"><span>kcal/ngay</span></div></div><div class="f-ef"><label>Protein muc tieu</label><div class="f-ef-r"><input id="fte-p" type="number" value="'+e1.tp+'" class="f-ei"><span>g/ngay</span></div></div><div class="f-ef-btns"><button class="btn-s" onclick="A.fCancelEdit()">Huy</button><button class="btn-p" onclick="A.fSaveTarget()">Ap dung</button></div></div>';QI('f-edit-btn').style.display='none';}
function fCancelEdit(){buildFood();}
function fSaveTarget(){const p=DB.gProf();if(!p)return;p.ckal=parseInt(QI('fte-k').value)||null;p.cpro=parseInt(QI('fte-p').value)||null;DB.sProf(p);_built[1]=false;rebuild();buildFood();}

// ── ACTIVITY PAGE ──
let _selAct=null,_showPick=false;
function buildAct(){
  const today=DB.now();const isToday=_aDate===today;
  const vLog=isToday?_log:(DB.gLog(_aDate)||DB._blank(_aDate));
  const actK=(vLog.acts||[]).reduce((s,a)=>s+(a.k||0),0);
  const stK=Math.round((vLog.steps||0)*0.04);
  const totalK=actK+stK;const burnPct=pct(totalK,600);
  QI('t-act').innerHTML=
    '<div class="pg-head"><div class="ph-l"><svg class="ph-ic" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg><div class="ph-t">Đốt calo</div></div>'+(isToday?'<button class="ph-btn save-glow" onclick="A.actSave()">Lưu</button>':'<span class="ph-badge">Xem lại</span>')+'</div>'
    +mkDateBar(_aDate,'aSetDate')
    +'<div class="f-tgt" id="a-tgt"><div class="ft-row"><div class="ft-item"><div class="ft-k">Đốt hôm nay</div><div class="ft-nums"><span id="a-kcal" class="ft-big">'+totalK+'</span><span class="ft-u"> kcal</span></div><div class="ft-bar-w"><div class="ft-bar'+(totalK>=250?' ok':'')+'" id="a-kbar" style="width:'+burnPct+'%"></div></div></div><div class="ft-div"></div><div class="ft-item"><div class="ft-k">Cân sáng</div><div class="ft-nums"><input id="a-wt" type="number" step="0.1" placeholder="—" value="'+(vLog.wt||'')+'" class="a-wt-num"'+(isToday?' oninput="A.actWtChange()"':' readonly')+'><span class="ft-u"> kg</span></div></div></div></div>'
    +'<div class="f-body">'
    +(isToday?'<div class="a-add-trig" onclick="A.actToggle()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg><span>Thêm hoạt động...</span></div><div id="a-picker" style="display:none"><div class="a-grid">'+ACTS.map(a=>'<div class="a-card" data-aid="'+a.id+'" onclick="A.actSel(\''+a.id+'\')"><span class="a-ic">'+a.ic+'</span><span class="a-card-n">'+a.n+'</span></div>').join('')+'</div><div id="a-dur" class="a-dur-row" style="display:none"><div class="a-dur-l"><span id="a-sel-n">Chọn hoạt động</span><span id="a-est" class="a-est">~0 kcal</span></div><div class="a-dur-r"><input id="a-mins" type="number" class="a-mins" placeholder="30" min="1" max="300" oninput="A.actEstBurn()"><span>phút</span><button class="btn-p a-ok" onclick="A.actConfirm()">+ Thêm</button></div></div></div>':'')
    +'<div class="f-added-sec"><div class="f-added-hd">'+(isToday?'Đã thực hiện':'Đã thực hiện '+fmtDate(_aDate))+' <span id="a-cnt" class="f-cnt-b">'+((vLog.acts||[]).length)+'</span></div><div id="a-list">'+renderActListHTML(vLog,isToday)+'</div></div>'
    +'<div class="a-meta"><div class="a-meta-row"><span class="a-meta-lbl">Bước chân</span><div class="a-meta-inp"><input id="a-steps" type="number" placeholder="8000" value="'+(vLog.steps||'')+'" class="a-meta-field"'+(isToday?' oninput="A.actRefresh()"':' readonly')+'><span id="a-sk" class="a-meta-hint">'+(vLog.steps?'~'+stK+' kcal':'')+'</span></div></div>'
    +'<div class="a-meta-row"><span class="a-meta-lbl">Giấc ngủ</span><div class="slp-chips">'+[4,5,6,7,8].map(h=>'<button class="slp-chip'+((vLog.slp||7)===h?' sel':'')+'"'+(isToday?' onclick="A.setSleep('+h+')"':' disabled')+' data-h="'+h+'">'+h+'h</button>').join('')+'</div></div>'
    +'<div class="a-meta-row"><span class="a-meta-lbl">Nước <b id="a-wv">'+(vLog.water||2.5)+'L</b></span><input id="a-water" type="range" min="0" max="5" step="0.25" value="'+(vLog.water||2.5)+'" class="a-slider"'+(isToday?' oninput="A.setWater()"':' disabled')+'></div></div>'
    +'</div>';
  _built[2]=true;
}
function renderActListHTML(vLog,editable){
  const acts=(vLog||_log).acts||[];
  if(!acts.length)return'<div class="fa-empty">'+(editable?'Chua co hoat dong':'Khong co du lieu')+'</div>';
  return acts.map((a,i)=>'<div class="aa"><span class="aa-ic">'+a.ic+'</span><div class="aa-d"><b>'+a.n+'</b><span>'+a.mins+' phut &middot; '+a.k+' kcal</span></div>'+(editable?'<button class="aa-rm" onclick="A.actRm('+i+')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>':'')+'</div>').join('');
}
function actWtChange(){actRefresh();}
function actToggle(){_showPick=!_showPick;QI('a-picker').style.display=_showPick?'block':'none';if(!_showPick){_selAct=null;const d=QI('a-dur');if(d)d.style.display='none';}}
function actSel(id){_selAct=ACTS.find(a=>a.id===id);QA('.a-card').forEach(c=>c.classList.toggle('sel',c.dataset.aid===id));const sn=QI('a-sel-n');if(sn)sn.textContent=_selAct.ic+' '+_selAct.n;const dur=QI('a-dur');if(dur)dur.style.display='flex';const mi=QI('a-mins');if(mi){mi.value='';mi.focus();}actEstBurn();}
function actEstBurn(){if(!_selAct)return;const mins=parseInt(QI('a-mins').value)||0;const w=parseFloat(QI('a-wt').value)||(_ob?.e1?.w||70);const est=QI('a-est');if(est)est.textContent='~'+Math.round(_selAct.met*w*(mins/60))+' kcal';}
function actConfirm(){if(!_selAct)return;const mins=parseInt(QI('a-mins').value)||0;if(mins<=0)return;const w=parseFloat(QI('a-wt').value)||(_ob?.e1?.w||70);const k=Math.round(_selAct.met*w*(mins/60));if(!_log.acts)_log.acts=[];_log.acts.push({id:_selAct.id,n:_selAct.n,ic:_selAct.ic,mins,k});persist();_selAct=null;QA('.a-card').forEach(c=>c.classList.remove('sel'));const dur=QI('a-dur');if(dur)dur.style.display='none';const mi=QI('a-mins');if(mi)mi.value='';const al=QI('a-list');if(al)al.innerHTML=renderActListHTML(_log,true);actRefresh();}
function actRm(i){_log.acts.splice(i,1);persist();const al=QI('a-list');if(al)al.innerHTML=renderActListHTML(_log,true);actRefresh();}
function actRefresh(){
  const ak=(_log.acts||[]).reduce((s,a)=>s+a.k,0);
  const steps=parseInt(QI('a-steps')?.value)||0;const sk=Math.round(steps*0.04);
  const total=ak+sk;
  const kEl=QI('a-kcal');if(kEl)kEl.textContent=total;
  const kBar=QI('a-kbar');if(kBar){kBar.style.width=pct(total,600)+'%';kBar.className='ft-bar'+(total>=250?' ok':'');}
  const cntEl=QI('a-cnt');if(cntEl)cntEl.textContent=(_log.acts||[]).length;
  const el=QI('a-sk');if(el)el.textContent=steps?'~'+sk+' kcal':'';
}
function refreshAct(){actRefresh();}
function aSetDate(d){_aDate=d;buildAct();}
function setSleep(h){_log.slp=h;QA('.slp-chip').forEach(c=>c.classList.toggle('sel',parseInt(c.dataset.h)===h));}
function setWater(){const v=parseFloat(QI('a-water').value);_log.water=v;const el=QI('a-wv');if(el)el.textContent=v+'L';}
function actSave(){_log.wt=parseFloat(QI('a-wt')?.value)||null;_log.steps=parseInt(QI('a-steps')?.value)||0;_log.water=parseFloat(QI('a-water')?.value)||2.5;persist();rebuild();const btn=Q('.save-glow');if(btn){const t=btn.textContent;btn.textContent='Da luu';btn.style.color='var(--ok)';setTimeout(()=>{btn.textContent=t;btn.style.color='';},1800);}if(_built[0])renderDash();}
window.A={toTab,obNext,obPrev,obSelAct,obSelGoal,obSelDl,obDelta,obSave,
  editTargets,cancelEdit,saveTargets,
  fSearch,fAdd,fRm,fQty,fEditTarget,fCancelEdit,fSaveTarget,fSetDate,
  actToggle,actSel,actConfirm,actRm,actEstBurn,actWtChange,actRefresh,aSetDate,setSleep,setWater,actSave,
  reset(){if(confirm('Xoa toan bo du lieu?')){DB.clear();location.reload();}}
};
boot();
})();