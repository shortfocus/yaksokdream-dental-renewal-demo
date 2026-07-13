import { ProposalItem, ReviewItem, Doctor } from './types';

export const PROPOSAL_ITEMS: ProposalItem[] = [
  {
    id: 'security',
    category: '보안 및 약관',
    title: 'SSL 보안 암호화 및 개인정보 보호',
    asIs: 'SSL 미지원(http://)으로 최신 브라우저에서 "안전하지 않음" 경고가 노출되며, 빠른 상담 시 수집되는 환자의 민감정보(이름, 연락처)가 평문으로 전송되어 법적 리스크가 큽니다.',
    toBe: 'https:// 보안 프로토콜을 전면 적용하여 브라우저 경고를 원천 제거하고, 수집된 데이터를 안전하게 암호화합니다. 또한 하단에 명확한 개인정보처리방침 약관 팝업 링크를 추가합니다.',
    effect: '민감한 환자 정보 유출 위협 차단, 개인정보 보호법 위반 리스크 해소, 안심 접속 환경 조성으로 브랜드 가치 제고.',
    impactColor: 'red',
  },
  {
    id: 'banner',
    category: '메인 비주얼 · SEO/GEO',
    title: '이미지 중심 → 구조화 텍스트 병행',
    asIs: '기존 홈페이지는 이미지·배너 중심으로 구성되어, 검색엔진·AI가 본문을 읽기 어렵습니다. 시각적으로는 풍부해 보여도 ‘안양 임플란트’ 등 키워드 검색·AI 추천에는 불리합니다.',
    toBe: '비주얼은 유지하되 시맨틱 헤딩·본문 카피·메타·구조화 데이터(Schema)를 함께 배치해, 이미지와 텍스트가 동시에 신뢰를 만들고 검색·GEO에도 잡히도록 재구성합니다.',
    effect: '검색 유입 확대, AI 인용 가능성 상승, 첫 인상과 발견성을 동시에 확보.',
    impactColor: 'teal',
  },
  {
    id: 'floating',
    category: '레이아웃 & 동선',
    title: '네이버 문의/예약 플로팅 배너 최적화',
    asIs: '우측에 고정된 거대한 사각형 플로팅 배너가 메인 본문 텍스트 영역을 침범하고 가려서, 본문 가독성을 크게 저해합니다.',
    toBe: '본문 텍스트 침범을 방지하는 반응형 여백 설계 및 백그라운드 블러 효과를 결합한 모던 원형 FAB(Floating Action Button)으로 리디자인하여 조화롭고 세련된 이동을 제공합니다.',
    effect: '본문 정보 가독성 100% 보장, 모바일 및 데스크톱에서 예약 전환을 유도하는 우아한 동선 유지.',
    impactColor: 'yellow',
  },
  {
    id: 'hours',
    category: '정보 가시성',
    title: '진료시간 및 오시는 길 인포그래픽 그리드',
    asIs: '환자 방문에 핵심적인 진료 시간, 주소, 주차 등의 필수 정보들이 단순 평문 텍스트로만 나열되어 있어 한눈에 읽기 어렵습니다.',
    toBe: '가독성을 극대화한 구조화된 그리드 디자인, 역동적인 시간대별 아이콘 가이드, 주차장 위치 및 지하철/버스 노선 정보 카드를 나누어 인포그래픽 레이아웃으로 직관성을 높입니다.',
    effect: '방문 전 정보 탐색 시간 감소, 환자의 내원 경로 확인 편의성 증대, 내원율 상승 유도.',
    impactColor: 'blue',
  },
  {
    id: 'form',
    category: '예약 전환',
    title: '하단 플로팅 퀵 상담 바 및 강력한 CTA',
    asIs: '기존 사이트 빠른상담 신청하기 버튼이 실제로 동작하지 않습니다. 환자가 성함·연락처·치료항목·상담시간을 입력하고 버튼을 눌러도 접수가 되지 않아 이탈과 신뢰 하락으로 이어집니다.',
    toBe: '기존과 동일한 상담 항목(치료항목·상담시간 등)을 유지하면서, 하단 플로팅 바에 시그니처 컬러 CTA를 적용하고 신청 버튼이 실제 접수까지 정상 동작하도록 개선합니다.',
    effect: '상담 신청 장벽 최소화, 버튼 미동작으로 인한 이탈 차단, CTA 전환율(Call to Action) 평균 20% 이상 향상 기대.',
    impactColor: 'teal',
  },
];

export const CLINIC_REVIEWS: ReviewItem[] = [
  {
    id: 'r1',
    author: '김*현 (50대, 만성 치주염 환자)',
    treatment: '전악 임플란트 및 뼈이식',
    rating: 5,
    content: '치아가 다 흔들려서 밥도 잘 못 먹었는데, 약속드림치과에서 임플란트 치료받고 새 삶을 살고 있어요. 원장님께서 치료 과정을 자세히 약속하고 설명해 주셔서 정말 안심하고 받았습니다.',
    date: '2026.06.12',
  },
  {
    id: 'r2',
    author: '박*우 (30대, 직장인)',
    treatment: '당일 식립 임플란트',
    rating: 5,
    content: '바쁜 직장인이라 진료 시간 맞추기가 까다로웠는데 수요일 야간 진료가 있어서 참 편해요. 치과가 아주 넓고 쾌적하며, 위생 상태도 철저해서 만족스럽습니다.',
    date: '2026.07.03',
  },
  {
    id: 'r3',
    author: '이*순 (70대, 주부)',
    treatment: '틀니 지지 임플란트',
    rating: 5,
    content: '나이가 많아서 뼈가 없다고 다른 곳에서는 고생할 거라고 했는데, 여기서 뼈이식도 잘해주시고 아주 튼튼하게 잘 박혔어요. 주차 안내도 잘 되어 있어서 갈 때마다 편했습니다.',
    date: '2026.07.10',
  },
];

export const IMAGES = {
  // Real high-quality dental & healthcare imagery from Unsplash
  hero: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80', // Dental office interior, modern teal
  implant: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80', // Dentist equipment, clean, premium
  clinicView: 'https://images.unsplash.com/photo-1513412893-c40d275d86d5?auto=format&fit=crop&w=800&q=80', // Happy patient teeth close up
  doctor: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=800&q=80', // Professional dentist smiling
};

export const TREATMENT_OPTIONS = ['임플란트', '치아교정', '부분교정', '기타'] as const;

export const CONSULT_TIME_OPTIONS = [
  '10시 ~ 11시',
  '11시 ~ 12시',
  '12시 ~ 12시 30분',
  '14시 ~ 15시',
  '15시 ~ 16시',
  '16시 ~ 17시',
  '17시 ~ 18시',
  '18시 ~ 19시',
  '상관없음',
] as const;

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    src: '/hero/main_01_01.png',
    alt: '환자중심 진료, 약속드림치과 — 4인 의료진 협진',
  },
  {
    id: 'slide-2',
    src: '/hero/main_04.png',
    alt: '임플란트 누적 35,000건 이상 — 약속드림치과',
  },
];

export const CLINIC_DOCTORS: Doctor[] = [
  {
    id: 'doc1',
    name: '장영은',
    title: '원장',
    image: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&w=500&h=500&q=80',
    subtitle: '경북대학교 치의학전문대학원 졸업',
    quote: '환자 한 분 한 분의 목소리에 귀 기울여, 가장 안심할 수 있는 정직한 진료를 약속합니다.',
    credentials: [
      '경북대학교 치의학전문대학원 졸업',
      '대한 구강악안면 임플란트학회 정회원',
      '대한치과 보철학회 정회원',
      '대한 심미치과학회 정회원',
      'ATC 심미보철 연수회 수료',
      'AIC Implant & Sinus Course 수료',
      'AIC Total Implant Management Course 수료'
    ],
    badges: ['경북대 치전원', '임플란트학회 정회원', '심미보철 전문가']
  },
  {
    id: 'doc2',
    name: '송준화',
    title: '원장',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&h=500&q=80',
    subtitle: '서울대학교 치과대학 졸업',
    quote: '치료의 정석을 따르는 원칙적 치료로, 평생 동안 흔들림 없는 튼튼함을 선물하겠습니다.',
    credentials: [
      '서울대학교 치과대학 졸업',
      '서울치대 65회 동창회장',
      '한국경제TV 자문의사',
      '아주대학교 치의학대학원 임플란트 보청과 석사 수료',
      '아주대학교 치의학대학원 수료',
      'AIC Implant & Sinus Course 수료',
      'AIC Total Implant Management Course 수료',
      'LIAO(보스톤 임플란트 연구회) 임플란트 코스 수료',
      'The 1st Annual Competition of Public Health Doctors in Esthetic Restorative Dentistry 코스 수료',
      'AGD(통합치과전문임상의)',
      'U-PENN ENDO Course 수료'
    ],
    badges: ['서울대 치대', '임플란트 보청 석사', '보스톤 임플란트 연수']
  },
  {
    id: 'doc3',
    name: '박정은',
    title: '원장',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&h=500&q=80',
    subtitle: '연세대학교 치과대학 치과교정학 박사과정',
    quote: '아름다운 미소와 완벽한 치열, 기능과 심미성 모두를 만족하는 맞춤형 치료를 약속합니다.',
    credentials: [
      '중앙대학교병원 치과교정과 레지던트 수료',
      '연세대학교 치과대학 치과교정학 박사과정',
      '통합치의학 전문의(보건복지부 인증) 과정',
      '대한치과교정학회 회원',
      '인비절라인(투명교정) 인증 의사',
      '대한심미치과학회 정회원',
      '대한양악수술학회 정회원',
      '대한턱관절협회 정회원'
    ],
    badges: ['중앙대 레지던트', '연세대 치과교정 박사', '인비절라인 인증']
  },
  {
    id: 'doc4',
    name: '김경주',
    title: '원장',
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=500&h=500&q=80',
    subtitle: '연세대학교 졸업 / 전 이루다치과 부원장',
    quote: '환자분의 통증과 두려움에 진심으로 공감하며, 가장 부드럽고 세심하게 치료하겠습니다.',
    credentials: [
      '연세대학교 졸업',
      '부산대학교 치의학전문대학원 졸업',
      'Doctor\'s endo course 신경치료 과정 수료',
      'Dentalbean tooth preparation 과정 수료',
      '오스템 AIC Master course 고급과정 수료',
      '이루다치과 부원장 역임',
      '기업 및 학교 검진의',
      '연세대학교 구조생물학교실 인턴'
    ],
    badges: ['연세대 졸업', '부산대 치전원', '신경치료 전문가']
  }
];
