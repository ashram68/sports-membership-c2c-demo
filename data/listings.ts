export type ListingStatus = '판매중' | '예약중' | '판매완료';

export interface Listing {
  id: string;
  title: string;
  category: string;
  price: number;
  centerName: string;
  dong: string;
  distance: string;
  timeAgo: string;
  likes: number;
  comments: number;
  status: ListingStatus;
  seller: string;
  views?: number;
  description?: string;
  address?: string;
  images?: string[];
}

export const LISTINGS: Listing[] = [
  {
    id: '1',
    title: '강남 퍼펙트짐 PT 30회 양도합니다 (6개월 남음)',
    category: '헬스',
    price: 850000,
    centerName: '강남 퍼펙트짐',
    dong: '역삼동',
    distance: '1.2km',
    timeAgo: '3시간 전',
    likes: 24,
    comments: 3,
    status: '판매중',
    seller: '헬스매니아77',
    views: 142,
    description:
      '강남역 4번 출구 도보 3분 거리에 있는 퍼펙트짐 강남본점 PT 양도합니다.\n\n• 총 30회 중 30회 그대로 남아있습니다. (개인 사정으로 아예 시작을 못함)\n• 등록일로부터 6개월 기한 남아있습니다.\n• 양도비 5만원은 제가 부담합니다.\n• 훌륭한 강사진과 최고급 머신(해머스트렝스, 라이프피트니스) 풀세팅 되어있습니다.\n\n쿨거래 하시면 네고 조금 가능합니다. 편하게 챗 주세요!',
    address: '서울 강남구 테헤란로 123',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600',
    ],
  },
  {
    id: '2',
    title: '스크린골프 GDR 12개월 회원권',
    category: '골프',
    price: 1200000,
    centerName: 'GDR 강남점',
    dong: '삼성동',
    distance: '2.1km',
    timeAgo: '5시간 전',
    likes: 18,
    comments: 2,
    status: '판매중',
    seller: '골퍼준영',
    views: 98,
    description: 'GDR 강남점 12개월 정회원권 양도합니다. 잔여 기간 약 8개월 남았습니다. 시설 최고급, 강남 접근성 좋습니다.',
    address: '서울 강남구 삼성동 테헤란로 456',
    images: [
      'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=600',
      'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600',
    ],
  },
  {
    id: '3',
    title: '필라테스 리포머 20회권',
    category: '필라테스',
    price: 380000,
    centerName: '코어필라테스',
    dong: '논현동',
    distance: '0.8km',
    timeAgo: '6시간 전',
    likes: 31,
    comments: 5,
    status: '판매중',
    seller: 'pilates_kim',
    views: 67,
    description: '코어필라테스 논현점 리포머 20회권 양도합니다. 유효기간 내 자유롭게 사용 가능합니다.',
    address: '서울 강남구 논현동 강남대로 789',
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600',
    ],
  },
  {
    id: '4',
    title: '수영장 6개월 자유이용권 (반값)',
    category: '수영',
    price: 220000,
    centerName: '센트럴스포츠센터',
    dong: '선릉역',
    distance: '1.5km',
    timeAgo: '8시간 전',
    likes: 9,
    comments: 1,
    status: '예약중',
    seller: 'swim_daddy',
    views: 54,
    description: '센트럴스포츠센터 수영장 6개월 자유이용권 양도합니다. 개인 사정으로 반값에 급처합니다.',
    address: '서울 강남구 선릉로 101',
    images: [
      'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600',
    ],
  },
  {
    id: '5',
    title: '요가원 3개월권 양도해요',
    category: '요가',
    price: 150000,
    centerName: '웰빙요가',
    dong: '역삼동',
    distance: '0.5km',
    timeAgo: '1일 전',
    likes: 6,
    comments: 0,
    status: '판매중',
    seller: 'yoga_lover',
    views: 33,
    description: '웰빙요가 역삼점 3개월 자유이용권 양도합니다. 쾌적한 시설 자랑합니다.',
    address: '서울 강남구 역삼동 역삼로 22',
    images: [
      'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600',
    ],
  },
  {
    id: '6',
    title: '크로스핏 박스 1년 회원권 (절반 할인)',
    category: '크로스핏',
    price: 980000,
    centerName: '크로스핏 강남박스',
    dong: '신사동',
    distance: '1.8km',
    timeAgo: '2일 전',
    likes: 42,
    comments: 8,
    status: '판매중',
    seller: 'cf_master',
    views: 210,
    description: '크로스핏 강남박스 1년 회원권 절반 가격에 양도합니다. 7개월 잔여.',
    address: '서울 강남구 신사동 압구정로 55',
    images: [
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600',
    ],
  },
  {
    id: '7',
    title: '테니스장 주말반 6개월 양도',
    category: '테니스',
    price: 540000,
    centerName: '로얄테니스클럽',
    dong: '압구정동',
    distance: '2.5km',
    timeAgo: '3일 전',
    likes: 15,
    comments: 2,
    status: '판매완료',
    seller: 'tennis_pro77',
    views: 88,
    description: '로얄테니스클럽 주말반 6개월권 양도합니다.',
    address: '서울 강남구 압구정동 압구정로 200',
    images: [
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600',
    ],
  },
];

export const RELATED_LISTINGS = [
  {
    id: 'r1',
    title: '퍼펙트짐 3개월권',
    price: 150000,
    category: '회원권',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300',
  },
  {
    id: 'r2',
    title: 'PT 10회 (급처)',
    price: 300000,
    category: 'PT',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300',
  },
  {
    id: 'r3',
    title: '헬스장 1개월권',
    price: 50000,
    category: '회원권',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=300',
  },
];
