import { SupportedLocale } from './seo';

export interface ShowcaseSlideI18n {
  id: number;
  slideNum: string;
  titleTop: string;
  titleBottom: string;
  leftTitle: string;
  leftText: string;
  rightTitle: string;
  rightText: string;
}

export interface I18nDictionary {
  nav: {
    home: string;
    work: string;
    contact: string;
  };
  hero: {
    tagline: string;
    mascotBadge: string;
    mascotSub: string;
    viewAllWorks: {
      row1: string;
      row2: string;
      row3: string;
      fullAria: string;
    };
  };
  showcase: {
    title: string;
    slides?: ShowcaseSlideI18n[];
  };
  about: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
  };
  work: {
    curatedPrefix: string;
    curatedAccent: string;
    subtitle: string;
    searchPlaceholder: string;
    all: string;
    noResults: string;
    noResultsQuery: (query: string) => string;
    noResultsTag: (tag: string) => string;
    reset: string;
    client: string;
    runtime: string;
    format: string;
    formatVertical: string;
    formatSquare: string;
    formatCinema: string;
    fps: string;
    colorGrade: string;
    viewInstagram: string;
    bookProduction: string;
    close: string;
    unmute: string;
    mute: string;
  };
  colorGrading?: {
    tag?: string;
    title?: string;
    subtitle?: string;
    beforeLabel?: string;
    afterLabel?: string;
    dragInstruction?: string;
    profileLabel?: string;
    pipelineLabel?: string;
    items?: Array<{
      id: string;
      title: string;
      category: string;
      profile: string;
      lut: string;
      description: string;
    }>;
  };
  contact: {
    getInTouch: string;
    rights: string;
  };
}

export const DICTIONARIES: Record<SupportedLocale, I18nDictionary> = {
  en: {
    nav: {
      home: 'HOME',
      work: 'WORK',
      contact: 'CONTACT',
    },
    hero: {
      tagline: 'Creative Video Editor & Visual Storyteller',
      mascotBadge: 'ZYLITCH • VIDEO EDITOR',
      mascotSub: 'Commercials • Reels • Color Grading',
      viewAllWorks: {
        row1: 'view',
        row2: 'all my',
        row3: 'works',
        fullAria: 'View all my works',
      },
    },
    showcase: {
      title: 'Showcase',
      slides: [
        {
          id: 0,
          slideNum: '01',
          titleTop: 'BRAND',
          titleBottom: 'PROMOS',
          leftTitle: 'CRAVE',
          leftText: 'Sizzling close-ups, warm tones, a mouthwatering edit. The burger promo turns product into pure appetite, cut for scroll-stopping impact.',
          rightTitle: 'Appetite',
          rightText: 'Graded color, tight pacing, and craving in every frame. A punchy blend of product shots and rhythm, built to convert.',
        },
        {
          id: 1,
          slideNum: '02',
          titleTop: 'TASTE',
          titleBottom: 'STORIES',
          leftTitle: 'SAVOR',
          leftText: 'Steam rising, sauce swirling, a reel built to taste. This pasta pomodoro edit turns a simple plate into a craving.',
          rightTitle: 'Aroma',
          rightText: 'Rich texture, warm color, and rhythm in every cut. A foodie-first edit designed to travel, share, and satisfy.',
        },
        {
          id: 2,
          slideNum: '03',
          titleTop: 'LOVE',
          titleBottom: 'FILMS',
          leftTitle: 'Ritual',
          leftText: 'Golden light, tender moments, a cinematic memory. This Indian wedding film captures the color and ceremony of the day.',
          rightTitle: 'Emotion',
          rightText: 'Warm grading, gentle pacing, and feeling in every frame. A heartfelt blend of tradition and story, naturally moving.',
        },
        {
          id: 3,
          slideNum: '04',
          titleTop: 'CRAFT',
          titleBottom: 'KITCHEN',
          leftTitle: 'Dough',
          leftText: 'Flour in the air, hands at work, a process worth watching. The pizza-making edit turns technique into satisfying visual rhythm.',
          rightTitle: 'Fire',
          rightText: 'Close texture, steady pacing, and craft in every step. A satisfying blend of process and product, naturally engaging.',
        },
        {
          id: 4,
          slideNum: '05',
          titleTop: 'SOCIAL',
          titleBottom: 'CAMPAIGNS',
          leftTitle: 'Vibe',
          leftText: 'Fast transitions, punchy beats, an edit that never drags. Designed to turn casual scrollers into loyal followers.',
          rightTitle: 'Impact',
          rightText: 'Snappy cuts, kinetic typography, and high-retention pacing. Built for maximum reach and visual excitement.',
        },
      ],
    },
    about: {
      title: 'Hi, I’m the editor behind Zylitch.',
      p1: 'Over the past four years, I’ve edited a massive variety of formats. From dynamic talking heads and celebrity features to highly stylized food and lifestyle content. I’ve brought a highly diverse mix of projects to life.',
      p2: 'I pride myself on quickly grasping new styles and pivoting to exactly what my clients need.',
      p3: 'Give me a brief, a mood board, or a totally fresh aesthetic, and I\'ll make it work seamlessly.',
    },
    work: {
      curatedPrefix: 'curated ',
      curatedAccent: 'works',
      subtitle: 'Selected visual edits across food cinematography, commercial brand spots, wedding films, and viral social reels.',
      searchPlaceholder: 'Search archive by title, client, or #tag...',
      all: 'All',
      noResults: 'No matching archive pieces found.',
      noResultsQuery: (query: string) => `No projects matched "${query}". Try a different keyword or clear search.`,
      noResultsTag: (tag: string) => `No projects found under #${tag}.`,
      reset: 'Reset Filters',
      client: 'Client',
      runtime: 'Runtime',
      format: 'Format',
      formatVertical: '9:16 Vertical',
      formatSquare: '1:1 Square',
      formatCinema: '16:9 Cinema',
      fps: 'FPS',
      colorGrade: 'Grade',
      viewInstagram: 'View on Instagram',
      bookProduction: 'Book Production',
      close: 'Close',
      unmute: 'unmute',
      mute: 'mute',
    },
    colorGrading: {
      tag: 'COLOR PIPELINE & 35MM EMULATION',
      title: 'The Anatomy of Color',
      subtitle: 'Watch flat, milky camera sensor LOG footage transform into rich, tactile 35mm film emulation with deep shadow roll-off, vibrant saturation, and commercial gloss.',
      beforeLabel: 'CAMERA RAW / LOG',
      afterLabel: 'ZYLITCH FILM GRADE',
      dragInstruction: 'Drag slider or hover to compare',
      profileLabel: 'Source Profile',
      pipelineLabel: 'Grade Pipeline',
      items: [
        {
          id: 'walters-sign',
          title: 'Walters Burger Co.',
          category: 'Commercial Brand Identity',
          profile: 'Flat Camera LOG (Milky / Low Contrast)',
          lut: 'Kodak 2383 Warm Emulation • Amber & High Contrast',
          description: 'Recovers shadow depth, removes milky haze, and accentuates warm architectural tones.',
        },
        {
          id: 'wamiqa-gala',
          title: 'Wamiqa Gabbi — Gala Portrait',
          category: 'Celebrity Fashion & Editorial',
          profile: 'Sony S-Log3 / SGamut3.Cine (Desaturated)',
          lut: 'Custom Velvet Film • Clean Skin Tone Separation',
          description: 'Protects natural skin luminance while deepening satin navy highlights and backdrop warmth.',
        },
        {
          id: 'siciliana-pizza',
          title: 'Siciliana Artisanal Pizza',
          category: 'Tabletop Food Cinematography',
          profile: 'Neutral Sensor Flat (Low Saturation)',
          lut: 'Tuscan Rich Print • Tomato Crimson & Amber Glow',
          description: 'Brings mouthwatering vibrancy to fire-baked crusts, vibrant aperitivos, and rustic wood grains.',
        },
        {
          id: 'walters-feast',
          title: 'Walters Feast — Duo & Sizzle',
          category: 'Fast-Food Commercial Campaign',
          profile: 'High-Key Neutral LOG (Flat Highlight Roll-Off)',
          lut: '35mm Commercial Punch • Saturated Neon & Golden Crisp',
          description: 'Transforms washed-out tabletop takes into hyper-appealing commercial sizzle with specular pop.',
        },
      ],
    },
    contact: {
      getInTouch: 'GET IN TOUCH',
      rights: '© 2026 ZYLITCH. ALL RIGHTS RESERVED.',
    },
  },
  ko: {
    nav: {
      home: '홈',
      work: '작업물',
      contact: '문의',
    },
    hero: {
      tagline: '크리에이티브 비디오 에디터 & 비주얼 스토리텔러',
      mascotBadge: '질리치 • 비디오 에디터',
      mascotSub: '광고 • 숏폼 릴스 • 컬러 그레이딩',
      viewAllWorks: {
        row1: '전체',
        row2: '작업물',
        row3: '보기',
        fullAria: '전체 작업물 보기',
      },
    },
    showcase: {
      title: '쇼케이스',
      slides: [
        {
          id: 0,
          slideNum: '01',
          titleTop: '브랜드',
          titleBottom: '프로모',
          leftTitle: '갈망',
          leftText: '지글거리는 클로즈업, 따뜻한 색감, 군침 도는 감각적인 컷. 버거 프로모션은 시선을 사로잡는 강력한 시각적 임팩트로 식욕을 자극합니다.',
          rightTitle: '식욕',
          rightText: '정밀한 컬러 그레이딩과 경쾌한 템포. 전환율을 극대화하도록 정교하게 설계된 리듬감 넘치는 영상입니다.',
        },
        {
          id: 1,
          slideNum: '02',
          titleTop: '미식',
          titleBottom: '스토리',
          leftTitle: '풍미',
          leftText: '피어오르는 김, 소스의 움직임, 맛이 느껴지는 감각적인 릴스. 단순한 파스타 한 접시를 잊지 못할 미식의 순간으로 만듭니다.',
          rightTitle: '향미',
          rightText: '풍부한 질감, 따뜻한 톤, 컷마다 살아 숨 쉬는 리듬. 바이럴 확산과 높은 몰입도를 이끌어내는 푸드 에디트입니다.',
        },
        {
          id: 2,
          slideNum: '03',
          titleTop: '웨딩',
          titleBottom: '필름',
          leftTitle: '의식',
          leftText: '황금빛 햇살, 따스한 시선, 영화 같은 추억. 찬란한 색채와 감동적인 예식의 순간을 담아냅니다.',
          rightTitle: '감정',
          rightText: '포근한 색감, 서정적인 호흡, 프레임마다 스며드는 진심. 전통과 감동이 어우러진 자연스러운 시네마틱 무비입니다.',
        },
        {
          id: 3,
          slideNum: '04',
          titleTop: '장인',
          titleBottom: '키친',
          leftTitle: '도우',
          leftText: '공중에 흩날리는 밀가루, 분주한 손길. 숙련된 피자 제조 과정을 매혹적인 시각적 리듬으로 완성했습니다.',
          rightTitle: '화력',
          rightText: '밀도 높은 텍스처, 일정한 호흡, 단계마다 깃든 정성. 과정과 완성품의 매력을 극대화한 몰입도 높은 컷입니다.',
        },
        {
          id: 4,
          slideNum: '05',
          titleTop: '소셜',
          titleBottom: '캠페인',
          leftTitle: '바이브',
          leftText: '빠른 트랜지션, 강렬한 비트, 단 한 순간도 지루하지 않은 속도감. 스크롤을 멈추고 팬이 되게 만듭니다.',
          rightTitle: '임팩트',
          rightText: '경쾌한 컷 편집, 키네틱 타이포그래피, 압도적인 시청 지속시간. 바이럴 도달과 화제성을 목표로 연출되었습니다.',
        },
      ],
    },
    about: {
      title: '안녕하세요, 질리치(Zylitch)의 편집자입니다.',
      p1: '지난 4년간 역동적인 토킹 헤드 영상과 셀러브리티 인터뷰부터 고도로 감각적인 푸드 및 라이프스타일 영상까지 다양한 포맷을 편집하며 다채로운 프로젝트를 성공적으로 완성해 왔습니다.',
      p2: '클라이언트가 원하는 스타일을 빠르게 파악하고 완벽하게 맞춰내는 유연함과 실행력을 자랑합니다.',
      p3: '기획안, 무드보드, 혹은 완전히 새로운 감각적인 비주얼을 맡겨주시면 완성도 높은 영상으로 보답하겠습니다.',
    },
    work: {
      curatedPrefix: '선별된 ',
      curatedAccent: '작업물',
      subtitle: '푸드 시네마토그래피, 상업 브랜드 광고, 웨딩 필름, 바이럴 소셜 릴스를 아우르는 감각적인 편집 포트폴리오입니다.',
      searchPlaceholder: '제목, 클라이언트 또는 #태그로 검색...',
      all: '전체',
      noResults: '일치하는 작업물이 없습니다.',
      noResultsQuery: (query: string) => `"${query}"에 해당하는 프로젝트를 찾을 수 없습니다. 다른 검색어를 입력해 보세요.`,
      noResultsTag: (tag: string) => `#${tag} 태그에 등록된 프로젝트가 없습니다.`,
      reset: '필터 초기화',
      client: '클라이언트',
      runtime: '러닝타임',
      format: '포맷',
      formatVertical: '9:16 세로형',
      formatSquare: '1:1 정방형',
      formatCinema: '16:9 가로형',
      fps: 'FPS',
      colorGrade: '그레이딩',
      viewInstagram: '인스타그램에서 보기',
      bookProduction: '프로젝트 의뢰하기',
      close: '닫기',
      unmute: '음소거 해제',
      mute: '음소거',
    },
    colorGrading: {
      tag: '컬러 파이프라인 & 35MM 필름 에뮬레이션',
      title: '색감의 연금술 — 컬러 그레이딩',
      subtitle: '밋밋하고 뿌연 카메라 센서 원본(LOG)이 깊은 암부 롤오프와 감각적인 채도, 상업 영상의 광택을 지닌 35mm 필름 에뮬레이션으로 변화하는 과정을 확인하세요.',
      beforeLabel: '카메라 원본 / LOG',
      afterLabel: '질리치 35MM 필름 그레이딩',
      dragInstruction: '슬라이더를 드래그하여 전후를 비교하세요',
      profileLabel: '원본 프로파일',
      pipelineLabel: '그레이딩 파이프라인',
      items: [
        {
          id: 'walters-sign',
          title: '월터스 버거 Co.',
          category: '상업 브랜드 아이덴티티',
          profile: '플랫 카메라 LOG (뿌연 저대비)',
          lut: '코닥 2383 웜톤 • 앰버 필름 프린트',
          description: '암부 대비를 복원하고 흐릿한 안개를 걷어내어 따뜻한 건축물 톤을 강조합니다.',
        },
        {
          id: 'wamiqa-gala',
          title: '와미카 가비 — 갈라 포트레이트',
          category: '셀러브리티 패션 & 에디토리얼',
          profile: '소니 S-Log3 / SGamut3.Cine (탈색조)',
          lut: '커스텀 벨벳 필름 • 깨끗한 피부톤 분리',
          description: '빛나는 피부톤을 완벽히 보호하면서 새틴 네이비의 광택과 배경의 온기를 극대화합니다.',
        },
        {
          id: 'siciliana-pizza',
          title: '시칠리아나 장인 피자',
          category: '테이블탑 푸드 시네마토그래피',
          profile: '뉴트럴 센서 플랫 (저채도)',
          lut: '토스카나 리치 프린트 • 토마토 크림슨 & 앰버 글로우',
          description: '화덕에 구운 크러스트와 아페리티보, 나무 식탁의 질감에 군침 도는 생동감을 불어넣습니다.',
        },
        {
          id: 'walters-feast',
          title: '월터스 피스트 — 듀오 & 시즐',
          category: '패스트푸드 상업 캠페인',
          profile: '하이키 뉴트럴 LOG (플랫 하이라이트)',
          lut: '35mm 커머셜 펀치 • 고채도 네온 & 골든 크리스프',
          description: '빛바랜 테이블탑 원본을 시선을 사로잡는 하이라이트 팝과 먹음직스러운 상업 시즐 영상으로 재탄생시킵니다.',
        },
      ],
    },
    contact: {
      getInTouch: '프로젝트 문의',
      rights: '© 2026 ZYLITCH. 판권 소유.',
    },
  },
  ja: {
    nav: {
      home: 'ホーム',
      work: '作品',
      contact: 'お問い合わせ',
    },
    hero: {
      tagline: 'クリエイティブ ビデオ エディター',
      mascotBadge: 'ジリッチ • ビデオエディター',
      mascotSub: 'CM映像 • リール • カラーグレーディング',
      viewAllWorks: {
        row1: 'すべての',
        row2: '作品を',
        row3: '見る',
        fullAria: 'すべての作品を見る',
      },
    },
    showcase: {
      title: 'ショーケース',
      slides: [
        {
          id: 0,
          slideNum: '01',
          titleTop: 'ブランド',
          titleBottom: 'プロモ',
          leftTitle: '食欲',
          leftText: '熱々のクローズアップ、温かいトーン、食欲をそそる映像。スクロールの手を止める強烈なビジュアルインパクトを与えます。',
          rightTitle: '味わい',
          rightText: '精密なカラーグレーディング、テンポの良いカット、購買意欲を高めるリズム。',
        },
        {
          id: 1,
          slideNum: '02',
          titleTop: '美食',
          titleBottom: '物語',
          leftTitle: '風味',
          leftText: '立ち上る湯気、濃厚なソース、味が伝わるシズル感。一皿のパスタを特別な体験に変えます。',
          rightTitle: '芳香',
          rightText: '豊かな質感、温かみのある色彩、シェアしたくなるフードリール。',
        },
        {
          id: 2,
          slideNum: '03',
          titleTop: 'ウェディング',
          titleBottom: 'フィルム',
          leftTitle: '儀式',
          leftText: '黄金色の光、心温まる瞬間、シネマティックな記憶。色鮮やかな伝統と祝宴を美しく記録します。',
          rightTitle: '感動',
          rightText: '柔らかな色彩、心地よいテンポ、心揺さぶるストーリー。',
        },
        {
          id: 3,
          slideNum: '04',
          titleTop: '職人',
          titleBottom: 'キッチン',
          leftTitle: '生地',
          leftText: '舞う小麦粉、丁寧な手仕事。職人の技を心地よい映像美に昇華させました。',
          rightTitle: '炎',
          rightText: 'ディテールへのこだわり、安定したカッティング、引き込まれるプロセス。',
        },
        {
          id: 4,
          slideNum: '05',
          titleTop: 'ソーシャル',
          titleBottom: 'キャンペーン',
          leftTitle: 'バイブス',
          leftText: 'スピーディーな展開、キレのあるビート、飽きさせない構成。フォロワー獲得に直結するエディット。',
          rightTitle: 'インパクト',
          rightText: 'テンポの良いカット、モーショングラフィックス、高い視聴完了率。',
        },
      ],
    },
    about: {
      title: 'はじめまして、Zylitch（ジリッチ）のエディターです。',
      p1: '過去4年間にわたり、躍動感のあるトーク動画や著名人インタビューから、洗練されたフード・ライフスタイルコンテンツまで、多種多様なフォーマットの映像編集を手掛けてきました。',
      p2: 'クライアントが求める世界観やスタイルを素早く理解し、柔軟かつ的確に具現化することを得意としています。',
      p3: 'ブリーフやムードボード、斬新なアイデアをご共有いただければ、期待以上のクオリティでお届けします。',
    },
    work: {
      curatedPrefix: '厳選された',
      curatedAccent: '作品集',
      subtitle: 'フードシネマ、商業ブランド広告、ウェディング映像、バイラルリールなど、洗練された映像編集実績。',
      searchPlaceholder: 'タイトル、クライアント、#タグで検索...',
      all: 'すべて',
      noResults: '該当する作品が見つかりませんでした。',
      noResultsQuery: (query: string) => `"${query}" に一致する作品はありません。別のキーワードをお試しください。`,
      noResultsTag: (tag: string) => `#${tag} の作品は見つかりませんでした。`,
      reset: 'フィルター解除',
      client: 'クライアント',
      runtime: '尺',
      format: 'フォーマット',
      formatVertical: '9:16 縦型',
      formatSquare: '1:1 スクエア',
      formatCinema: '16:9 シネマ',
      fps: 'FPS',
      colorGrade: 'グレード',
      viewInstagram: 'Instagramで見る',
      bookProduction: '制作のご相談',
      close: '閉じる',
      unmute: '音声オン',
      mute: '消音',
    },
    colorGrading: {
      tag: 'カラーパイプライン ＆ 35MMフィルムエミュレーション',
      title: '色彩の変革 — カラーグレーディング',
      subtitle: 'フラットで眠いカメラRAW（LOG）が、深いシャドウロールオフと鮮やかな発色、洗練された35mmフィルムルックへと昇華する瞬間をご覧ください。',
      beforeLabel: 'カメラRAW / LOG',
      afterLabel: 'ZYLITCH 35MMフィルムグレーディング',
      dragInstruction: 'スライダーをドラッグしてビフォー・アフターを比較',
      profileLabel: '収録プロファイル',
      pipelineLabel: 'グレーディング設計',
      items: [
        {
          id: 'walters-sign',
          title: 'ウォルターズ・バーガー Co.',
          category: '商業ブランドアイデンティティ',
          profile: 'フラットカメラLOG（眠い低コントラスト）',
          lut: 'Kodak 2383ウォーム • アンバーフィルムプリント',
          description: 'シャドウの深みを復元し、モヤを取り除いて建築の温かみあるトーンを強調。',
        },
        {
          id: 'wamiqa-gala',
          title: 'ワミカ・ガビ — ガラポートレート',
          category: 'セレブリティファッション＆エディトリアル',
          profile: 'Sony S-Log3 / SGamut3.Cine（低彩度）',
          lut: 'カスタムベルベットフィルム • 階調豊かなスキントーン分離',
          description: '美しい肌の輝きを損なうことなく、ネイビーサテンの上品な光沢と背景の温もりを際立たせます。',
        },
        {
          id: 'siciliana-pizza',
          title: 'シチリアーナ 職人ピッツァ',
          category: 'テーブルトップ・フードシネマ',
          profile: 'ニュートラルセンサーフラット（低彩度RAW）',
          lut: 'トスカーナリッチプリント • トマトクリムゾン＆アンバーグロー',
          description: '薪窯で焼き上げた香ばしいピザ生地とアペリティーボ、木の温もりに圧倒的なシズル感を吹き込みます。',
        },
        {
          id: 'walters-feast',
          title: 'ウォルターズ・フィースト — デュオ＆シズル',
          category: 'ファストフードコマーシャル',
          profile: 'ハイキーニュートラルLOG（フラットハイライト）',
          lut: '35mmコマーシャルパンチ • 高彩度ネオン＆ゴールドクリスプ',
          description: '平板なテーブルトップ素材を、ハイライトの光沢と食欲を刺激するジューシーな商用CM映像へ昇華。',
        },
      ],
    },
    contact: {
      getInTouch: 'お問い合わせ',
      rights: '© 2026 ZYLITCH. ALL RIGHTS RESERVED.',
    },
  },
  es: {
    nav: {
      home: 'INICIO',
      work: 'PROYECTOS',
      contact: 'CONTACTO',
    },
    hero: {
      tagline: 'Editor de Vídeo Creativo y Narrador Visual',
      mascotBadge: 'ZYLITCH • EDITOR DE VÍDEO',
      mascotSub: 'Comerciales • Reels • Color Grading',
      viewAllWorks: {
        row1: 'ver',
        row2: 'todos mis',
        row3: 'trabajos',
        fullAria: 'Ver todos mis trabajos',
      },
    },
    showcase: {
      title: 'Showcase',
      slides: [
        {
          id: 0,
          slideNum: '01',
          titleTop: 'PROMOS DE',
          titleBottom: 'MARCA',
          leftTitle: 'ANTOJO',
          leftText: 'Primeros planos chisporroteantes, tonos cálidos, una edición que abre el apetito al instante.',
          rightTitle: 'Apetito',
          rightText: 'Color calibrado, ritmo dinámico y deseo en cada fotograma. Creado para convertir.',
        },
        {
          id: 1,
          slideNum: '02',
          titleTop: 'HISTORIAS DE',
          titleBottom: 'SABOR',
          leftTitle: 'SABOR',
          leftText: 'Vapor ascendente, salsa brillante, un reel que se saborea. Diseñado para viajar y cautivar.',
          rightTitle: 'Aroma',
          rightText: 'Rica textura, calidez visual y un ritmo gastronómico irresistible.',
        },
        {
          id: 2,
          slideNum: '03',
          titleTop: 'PELÍCULAS DE',
          titleBottom: 'BODA',
          leftTitle: 'Ritual',
          leftText: 'Luz dorada, instantes íntimos, un recuerdo cinematográfico inolvidable.',
          rightTitle: 'Emoción',
          rightText: 'Color cálido, cadencia pausada y emoción natural en cada escena.',
        },
        {
          id: 3,
          slideNum: '04',
          titleTop: 'COCINA',
          titleBottom: 'ARTESANAL',
          leftTitle: 'Masa',
          leftText: 'Harina en el aire, manos expertas, un proceso visualmente hipnótico.',
          rightTitle: 'Fuego',
          rightText: 'Texturas cercanas, ritmo constante y maestría artesanal.',
        },
        {
          id: 4,
          slideNum: '05',
          titleTop: 'CAMPAÑAS',
          titleBottom: 'SOCIALES',
          leftTitle: 'Estilo',
          leftText: 'Transiciones rápidas, beats contundentes, una edición que no da tregua.',
          rightTitle: 'Impacto',
          rightText: 'Cortes precisos, tipografía cinética y alta retención de audiencia.',
        },
      ],
    },
    about: {
      title: 'Hola, soy el editor detrás de Zylitch.',
      p1: 'Durante los últimos cuatro años he editado una enorme variedad de formatos: desde spots dinámicos y entrevistas hasta contenido estilizado de gastronomía y lifestyle.',
      p2: 'Me enorgullezco de captar rápidamente nuevos estilos y adaptarme con precisión a las necesidades de cada cliente.',
      p3: 'Dame un brief, un moodboard o una estética completamente nueva, y haré que cobre vida a la perfección.',
    },
    work: {
      curatedPrefix: 'trabajos ',
      curatedAccent: 'curados',
      subtitle: 'Ediciones visuales seleccionadas en cinematografía gastronómica, comerciales de marca, películas de boda y reels virales.',
      searchPlaceholder: 'Buscar por título, cliente o #etiqueta...',
      all: 'Todos',
      noResults: 'No se encontraron proyectos coincidentes.',
      noResultsQuery: (query: string) => `No se encontraron proyectos para "${query}".`,
      noResultsTag: (tag: string) => `No hay proyectos bajo #${tag}.`,
      reset: 'Restablecer Filtros',
      client: 'Cliente',
      runtime: 'Duración',
      format: 'Formato',
      formatVertical: '9:16 Vertical',
      formatSquare: '1:1 Cuadrado',
      formatCinema: '16:9 Cine',
      fps: 'FPS',
      colorGrade: 'Color',
      viewInstagram: 'Ver en Instagram',
      bookProduction: 'Contratar Producción',
      close: 'Cerrar',
      unmute: 'activar sonido',
      mute: 'silenciar',
    },
    colorGrading: {
      tag: 'PIPELINE DE COLOR Y EMULACIÓN 35MM',
      title: 'La Anatomía del Color',
      subtitle: 'Descubre cómo el material plano y desaturado (LOG) del sensor de cámara se transforma en una rica emulación de película de 35mm con sombras profundas y saturación cinematográfica.',
      beforeLabel: 'CÁMARA RAW / LOG',
      afterLabel: 'ETALONAJE ZYLITCH 35MM',
      dragInstruction: 'Arrastra el deslizador para comparar el antes y después',
      profileLabel: 'Perfil de Origen',
      pipelineLabel: 'Etalonaje',
      items: [
        {
          id: 'walters-sign',
          title: 'Walters Burger Co.',
          category: 'Identidad Comercial de Marca',
          profile: 'LOG Plano de Cámara (Bajo Contraste)',
          lut: 'Emulación Cálida Kodak 2383 • Ámbar y Contraste',
          description: 'Recupera la profundidad en sombras, elimina la niebla lechosa y acentúa tonos cálidos.',
        },
        {
          id: 'wamiqa-gala',
          title: 'Wamiqa Gabbi — Retrato de Gala',
          category: 'Moda y Editorial de Celebridades',
          profile: 'Sony S-Log3 / SGamut3.Cine (Desaturado)',
          lut: 'Película Velvet Personalizada • Separación Limpia de Piel',
          description: 'Protege la luminosidad de la piel mientras profundiza los reflejos del satén azul y el fondo cálido.',
        },
        {
          id: 'siciliana-pizza',
          title: 'Pizza Artesanal Siciliana',
          category: 'Cinematografía Gastronómica de Mesa',
          profile: 'Sensor Neutro Plano (Baja Saturación)',
          lut: 'Impresión Rica Toscana • Carmesí de Tomate y Ámbar',
          description: 'Aporta una vibrante textura apetecible a la masa al horno de leña, aperitivos y vetas de madera.',
        },
        {
          id: 'walters-feast',
          title: 'Banquete Walters — Dúo y Sizzle',
          category: 'Campaña Comercial de Comida Rápida',
          profile: 'LOG Neutro High-Key (Roll-off Plano)',
          lut: 'Fuerza Comercial 35mm • Neón Saturado y Dorado Crujiente',
          description: 'Convierte tomas de mesa apagadas en tentadores planos comerciales con reflejos espectaculares.',
        },
      ],
    },
    contact: {
      getInTouch: 'HABLEMOS',
      rights: '© 2026 ZYLITCH. TODOS LOS DERECHOS RESERVADOS.',
    },
  },
  fr: {
    nav: {
      home: 'ACCUEIL',
      work: 'PROJETS',
      contact: 'CONTACT',
    },
    hero: {
      tagline: 'Monteur Vidéo Créatif & Storyteller Visuel',
      mascotBadge: 'ZYLITCH • MONTEUR VIDÉO',
      mascotSub: 'Publicités • Reels • Étalonnage Couleur',
      viewAllWorks: {
        row1: 'voir',
        row2: 'tous mes',
        row3: 'projets',
        fullAria: 'Voir tous mes projets',
      },
    },
    showcase: {
      title: 'Showcase',
      slides: [
        {
          id: 0,
          slideNum: '01',
          titleTop: 'FILMS',
          titleBottom: 'DE MARQUE',
          leftTitle: 'ENVIE',
          leftText: 'Gros plans saisissants, tons chaleureux, un montage qui éveille les papilles immédiatement.',
          rightTitle: 'Appétit',
          rightText: 'Étalonnage soigné, rythme percutant et gourmandise à chaque plan.',
        },
        {
          id: 1,
          slideNum: '02',
          titleTop: 'HISTOIRES',
          titleBottom: 'CULINAIRES',
          leftTitle: 'SAVEUR',
          leftText: 'Vapeur montante, sauce onctueuse, un format court conçu pour faire saliver.',
          rightTitle: 'Arôme',
          rightText: 'Textures riches, chaleur des teintes et tempo gourmand.',
        },
        {
          id: 2,
          slideNum: '03',
          titleTop: 'FILMS DE',
          titleBottom: 'MARIAGE',
          leftTitle: 'Rituel',
          leftText: 'Lumière dorée, gestes tendres, un souvenir cinématographique impérissable.',
          rightTitle: 'Émotion',
          rightText: 'Teintes chaleureuses, délicatesse du rythme et émotion pure.',
        },
        {
          id: 3,
          slideNum: '04',
          titleTop: 'CUISINE',
          titleBottom: 'ARTISANALE',
          leftTitle: 'Pâte',
          leftText: 'Farine en suspension, gestuelle précise, un spectacle visuel captivant.',
          rightTitle: 'Flamme',
          rightText: 'Détails macro, cadence fluide et savoir-faire culinaire.',
        },
        {
          id: 4,
          slideNum: '05',
          titleTop: 'CAMPAGNES',
          titleBottom: 'SOCIALES',
          leftTitle: 'Énergie',
          leftText: 'Transitions véloces, rythme entraînant, un montage percutant sans temps mort.',
          rightTitle: 'Impact',
          rightText: 'Cuts dynamiques, typographie animée et rétention maximale.',
        },
      ],
    },
    about: {
      title: 'Bonjour, je suis le monteur derrière Zylitch.',
      p1: 'Au cours des quatre dernières années, j’ai monté une grande variété de formats: des vidéos promotionnelles dynamiques aux contenus culinaires et lifestyle hautement stylisés.',
      p2: 'Je me fais un devoir de saisir rapidement de nouvelles esthétiques et de m’adapter exactement aux besoins de mes clients.',
      p3: 'Donnez-moi un brief, un moodboard ou une idée novatrice, et je la sublimerai avec fluidité.',
    },
    work: {
      curatedPrefix: 'œuvres ',
      curatedAccent: 'sélectionnées',
      subtitle: 'Montages visuels sélectionnés : cinématographie culinaire, spots publicitaires, films de mariage et reels viraux.',
      searchPlaceholder: 'Rechercher par titre, client ou #mot-clé...',
      all: 'Tous',
      noResults: 'Aucun projet trouvé.',
      noResultsQuery: (query: string) => `Aucun projet ne correspond à "${query}".`,
      noResultsTag: (tag: string) => `Aucun projet sous le tag #${tag}.`,
      reset: 'Réinitialiser les Filtres',
      client: 'Client',
      runtime: 'Durée',
      format: 'Format',
      formatVertical: '9:16 Vertical',
      formatSquare: '1:1 Carré',
      formatCinema: '16:9 Cinéma',
      fps: 'FPS',
      colorGrade: 'Étalonnage',
      viewInstagram: 'Voir sur Instagram',
      bookProduction: 'Réserver une Production',
      close: 'Fermer',
      unmute: 'activer le son',
      mute: 'couper le son',
    },
    colorGrading: {
      tag: 'PIPELINE COULEUR & ÉMULATION 35MM',
      title: "L'Anatomie de la Couleur",
      subtitle: 'Observez la métamorphose des rushes bruts et laiteux (LOG) en une émulation film 35mm somptueuse aux noirs profonds et aux contrastes éclatants.',
      beforeLabel: 'CAMÉRA RAW / LOG',
      afterLabel: 'ÉTALONNAGE ZYLITCH 35MM',
      dragInstruction: 'Faites glisser pour comparer avant et après',
      profileLabel: 'Profil Source',
      pipelineLabel: 'Étalonnage',
      items: [
        {
          id: 'walters-sign',
          title: 'Walters Burger Co.',
          category: 'Identité Commerciale de Marque',
          profile: 'LOG Plat Caméra (Faible Contraste)',
          lut: 'Émulation Chaude Kodak 2383 • Ambre & Contraste',
          description: "Restaure la profondeur des ombres, dissipe le voile laiteux et valorise les teintes architecturales chaudes.",
        },
        {
          id: 'wamiqa-gala',
          title: 'Wamiqa Gabbi — Portrait de Gala',
          category: 'Mode & Éditorial Célébrité',
          profile: 'Sony S-Log3 / SGamut3.Cine (Désaturé)',
          lut: 'Film Velours Personnalisé • Séparation Nette des Teintes de Peau',
          description: "Préserve la carnation naturelle tout en intensifiant les reflets bleu nuit du satin et la chaleur du décor.",
        },
        {
          id: 'siciliana-pizza',
          title: 'Pizza Artisanale Siciliana',
          category: 'Cinématographie Culinaire Tabletop',
          profile: 'Capteur Neutre Plat (Basse Saturation)',
          lut: 'Tirage Toscan Riche • Cramoisi Tomate & Reflets Ambrés',
          description: "Sublime la croûte cuite au feu de bois, les boissons pétillantes et la texture rustique des boiseries.",
        },
        {
          id: 'walters-feast',
          title: 'Festin Walters — Duo & Crépitement',
          category: 'Campagne Publicitaire Fast-Food',
          profile: 'LOG Neutre High-Key (Roll-off Plat)',
          lut: 'Punch Commercial 35mm • Néon Saturé & Doré Croustillant',
          description: "Transforme des prises ternes en vidéos publicitaires gourmandes et percutantes aux reflets savoureux.",
        },
      ],
    },
    contact: {
      getInTouch: 'CONTACTEZ-MOI',
      rights: '© 2026 ZYLITCH. TOUS DROITS RÉSERVÉS.',
    },
  },
  de: {
    nav: {
      home: 'START',
      work: 'PORTFOLIO',
      contact: 'KONTAKT',
    },
    hero: {
      tagline: 'Kreativer Video-Editor & Visueller Storyteller',
      mascotBadge: 'ZYLITCH • VIDEO-EDITOR',
      mascotSub: 'Werbespots • Reels • Color Grading',
      viewAllWorks: {
        row1: 'alle',
        row2: 'meine',
        row3: 'werke',
        fullAria: 'Alle meine Werke anzeigen',
      },
    },
    showcase: {
      title: 'Showcase',
      slides: [
        {
          id: 0,
          slideNum: '01',
          titleTop: 'MARKEN',
          titleBottom: 'SPOTS',
          leftTitle: 'GENUSS',
          leftText: 'Zischende Nahaufnahmen, warme Farbtöne, ein appetitanregender Schnitt mit maximaler Wirkung.',
          rightTitle: 'Appetit',
          rightText: 'Perfektes Color Grading, präzises Pacing und Verlangen in jedem Frame.',
        },
        {
          id: 1,
          slideNum: '02',
          titleTop: 'FOOD',
          titleBottom: 'STORIES',
          leftTitle: 'GESCHMACK',
          leftText: 'Aufsteigender Dampf, cremige Sauce, ein Reel voller visueller Aromen.',
          rightTitle: 'Aroma',
          rightText: 'Reiche Textur, warme Farben und ein packender Rhythmus.',
        },
        {
          id: 2,
          slideNum: '03',
          titleTop: 'HOCHZEITS',
          titleBottom: 'FILME',
          leftTitle: 'Ritual',
          leftText: 'Goldenes Licht, zärtliche Augenblicke, ein bleibendes filmisches Denkmal.',
          rightTitle: 'Emotion',
          rightText: 'Sanfte Übergänge, emotionale Tiefe und lebendige Tradition.',
        },
        {
          id: 3,
          slideNum: '04',
          titleTop: 'KRAFT DES',
          titleBottom: 'HANDWERKS',
          leftTitle: 'Teig',
          leftText: 'Mehlstaub in der Luft, präzise Handgriffe, faszinierende handwerkliche Kunst.',
          rightTitle: 'Feuer',
          rightText: 'Detaillierte Texturen, stetiger Rhythmus und pure Handwerkskunst.',
        },
        {
          id: 4,
          slideNum: '05',
          titleTop: 'SOCIAL',
          titleBottom: 'KAMPAGNEN',
          leftTitle: 'Vibe',
          leftText: 'Schnelle Schnitte, treibende Beats, ein fesselnder visueller Fluss.',
          rightTitle: 'Impact',
          rightText: 'Knackige Schnitte, kinetische Typografie und maximale Retention.',
        },
      ],
    },
    about: {
      title: 'Hallo, ich bin der Editor hinter Zylitch.',
      p1: 'In den letzten vier Jahren habe ich verschiedenste Formate geschnitten: von dynamischen Promos bis hin zu stilvollen Food- und Lifestyle-Content.',
      p2: 'Ich erfasse neue Ästhetiken blitzschnell und passe mich flexibel an die Anforderungen meiner Kunden an.',
      p3: 'Egal ob Briefing, Moodboard oder ein völlig neuer visueller Look – ich erwecke Ihre Vision nahtlos zum Leben.',
    },
    work: {
      curatedPrefix: 'kuratierte ',
      curatedAccent: 'werke',
      subtitle: 'Ausgewählte visuelle Schnitte für Food-Cinematographie, Werbespots, Hochzeitsfilme und virale Social-Media-Reels.',
      searchPlaceholder: 'Archiv nach Titel, Kunde oder #Tag durchsuchen...',
      all: 'Alle',
      noResults: 'Keine passenden Projekte gefunden.',
      noResultsQuery: (query: string) => `Keine Projekte für "${query}" gefunden.`,
      noResultsTag: (tag: string) => `Keine Projekte unter #${tag} gefunden.`,
      reset: 'Filter zurücksetzen',
      client: 'Kunde',
      runtime: 'Laufzeit',
      format: 'Format',
      formatVertical: '9:16 Hochformat',
      formatSquare: '1:1 Quadrat',
      formatCinema: '16:9 Breitbild',
      fps: 'FPS',
      colorGrade: 'Grading',
      viewInstagram: 'Auf Instagram ansehen',
      bookProduction: 'Produktion anfragen',
      close: 'Schließen',
      unmute: 'Ton an',
      mute: 'Stumm',
    },
    colorGrading: {
      tag: 'COLOR-PIPELINE & 35MM-FILMEMULATION',
      title: 'Die Anatomie der Farbe',
      subtitle: 'Erleben Sie, wie sich flaches, milchiges Kamera-LOG-Rohmaterial in opulente 35mm-Filmemulation mit samtigen Schatten und kinoreifer Brillanz verwandelt.',
      beforeLabel: 'KAMERA RAW / LOG',
      afterLabel: 'ZYLITCH 35MM-FILMGRADING',
      dragInstruction: 'Schieberegler bewegen, um Vorher/Nachher zu vergleichen',
      profileLabel: 'Quellprofil',
      pipelineLabel: 'Grading-Pipeline',
      items: [
        {
          id: 'walters-sign',
          title: 'Walters Burger Co.',
          category: 'Kommerzielle Markenidentität',
          profile: 'Flaches Kamera-LOG (Milchig / Flau)',
          lut: 'Kodak 2383 Warm Emulation • Bernstein & Kontrast',
          description: 'Stellt Schattentiefe wieder her, beseitigt Schleier und akzentuiert warme Architekturtöne.',
        },
        {
          id: 'wamiqa-gala',
          title: 'Wamiqa Gabbi — Gala-Porträt',
          category: 'Celebrity-Fashion & Editorial',
          profile: 'Sony S-Log3 / SGamut3.Cine (Entsättigt)',
          lut: 'Custom Samt-Film • Präzise Hautton-Separation',
          description: 'Schützt natürliche Hautleuchtkraft bei gleichzeitiger Intensivierung von Satinnachtblau und Hintergrundwärme.',
        },
        {
          id: 'siciliana-pizza',
          title: 'Siciliana Handwerkliche Pizza',
          category: 'Tabletop-Food-Cinematographie',
          profile: 'Neutral Sensor Flat (Geringe Sättigung)',
          lut: 'Toskana-Print • Tomatenkarmesin & Bernsteinglanz',
          description: 'Verleiht ofenfrischen Krusten, Drinks und rustikalen Holzmaserungen appetitanregende Lebendigkeit.',
        },
        {
          id: 'walters-feast',
          title: 'Walters Festmahl — Duo & Sizzle',
          category: 'Fast-Food-Werbekampagne',
          profile: 'High-Key Neutral LOG (Flache Lichter)',
          lut: '35mm Commercial Punch • Gesättigtes Neon & Goldglanz',
          description: 'Verwandelt blasse Tischaufnahmen in unwiderstehliche Werbeaufnahmen mit funkelnden Glanzlichtern.',
        },
      ],
    },
    contact: {
      getInTouch: 'KONTAKT AUFNEHMEN',
      rights: '© 2026 ZYLITCH. ALLE RECHTE VORBEHALTEN.',
    },
  },
  ru: {
    nav: {
      home: 'ГЛАВНАЯ',
      work: 'РАБОТЫ',
      contact: 'КОНТАКТЫ',
    },
    hero: {
      tagline: 'Креативный Видеомонтажер & Визуальный Сторителлер',
      mascotBadge: 'ZYLITCH • ВИДЕОМОНТАЖЕР',
      mascotSub: 'Реклама • Рилс • Цветокоррекция',
      viewAllWorks: {
        row1: 'все',
        row2: 'мои',
        row3: 'работы',
        fullAria: 'Смотреть все мои работы',
      },
    },
    showcase: {
      title: 'Шоукейс',
      slides: [
        {
          id: 0,
          slideNum: '01',
          titleTop: 'БРЕНД',
          titleBottom: 'ПРОМО',
          leftTitle: 'ЖАЖДА',
          leftText: 'Шкворчащие макропланы, теплые кинематографичные оттенки, аппетитный ритмичный монтаж.',
          rightTitle: 'Аппетит',
          rightText: 'Глубокий цвет, энергичный темп и желание попробовать в каждом кадре.',
        },
        {
          id: 1,
          slideNum: '02',
          titleTop: 'ИСТОРИИ',
          titleBottom: 'ВКУСА',
          leftTitle: 'ВКУС',
          leftText: 'Клубящийся пар, кружащийся соус, видеоролик с неповторимым эффектом присутствия.',
          rightTitle: 'Аромат',
          rightText: 'Богатая текстура, выразительный цвет и притягательный ритм.',
        },
        {
          id: 2,
          slideNum: '03',
          titleTop: 'СВАДЕБНЫЕ',
          titleBottom: 'ФИЛЬМЫ',
          leftTitle: 'Обряд',
          leftText: 'Золотой закатный свет, нежные мгновения, кинематографичная память на всю жизнь.',
          rightTitle: 'Эмоция',
          rightText: 'Тонкая цветокоррекция, трепетный темп и искреннее чувство.',
        },
        {
          id: 3,
          slideNum: '04',
          titleTop: 'МАСТЕРСТВО',
          titleBottom: 'КУХНИ',
          leftTitle: 'Тесто',
          leftText: 'Парящая мука, искусные руки, завораживающий процесс ремесленного творчества.',
          rightTitle: 'Огонь',
          rightText: 'Фактурные детали, размеренный ритм и магия кулинарного процесса.',
        },
        {
          id: 4,
          slideNum: '05',
          titleTop: 'СОЦИАЛЬНЫЕ',
          titleBottom: 'СЕТИ',
          leftTitle: 'Вайб',
          leftText: 'Стремительные переходы, плотный бит, динамика, не отпускающая ни на секунду.',
          rightTitle: 'Взрыв',
          rightText: 'Резкие склейки, кинетическая типографика и максимальное удержание внимания.',
        },
      ],
    },
    about: {
      title: 'Привет, я видеомонтажер проекта Zylitch.',
      p1: 'За последние четыре года я смонтировал огромное количество форматов: от динамичных рекламных видео до стильного фуд- и лайфстайл-контента.',
      p2: 'Я горжусь тем, что мгновенно улавливаю новую стилистику и точно воплощаю пожелания клиентов.',
      p3: 'Предоставьте бриф, мудборд или совершенно новую визуальную концепцию — и я безупречно воплощу её в жизнь.',
    },
    work: {
      curatedPrefix: 'избранные ',
      curatedAccent: 'работы',
      subtitle: 'Избранные видеоработы: фуд-кинематография, рекламные ролики брендов, свадебные фильмы и вирусные рилс.',
      searchPlaceholder: 'Поиск по названию, клиенту или #тегу...',
      all: 'Все',
      noResults: 'Ничего не найдено.',
      noResultsQuery: (query: string) => `По запросу "${query}" ничего не найдено.`,
      noResultsTag: (tag: string) => `Проектов с тегом #${tag} не найдено.`,
      reset: 'Сбросить фильтры',
      client: 'Клиент',
      runtime: 'Хронометраж',
      format: 'Формат',
      formatVertical: '9:16 Вертикальный',
      formatSquare: '1:1 Квадрат',
      formatCinema: '16:9 Кино',
      fps: 'FPS',
      colorGrade: 'Грейдинг',
      viewInstagram: 'Смотреть в Instagram',
      bookProduction: 'Заказать производство',
      close: 'Закрыть',
      unmute: 'включить звук',
      mute: 'без звука',
    },
    colorGrading: {
      tag: 'ЦВЕТОВОЙ ПАЙПЛАЙН И ЭМУЛЯЦИЯ 35MM',
      title: 'Анатомия Цвета',
      subtitle: 'Убедитесь, как блеклый и туманный LOG-исходник с матрицы камеры преображается в богатую 35-мм пленочную эмуляцию с бархатными тенями и рекламным блеском.',
      beforeLabel: 'КАМЕРА RAW / LOG',
      afterLabel: 'ПЛЕНОЧНЫЙ ГРЕЙДИНГ ZYLITCH',
      dragInstruction: 'Перемещайте ползунок для сравнения до и после',
      profileLabel: 'Исходный профиль',
      pipelineLabel: 'Пайплайн грейдинга',
      items: [
        {
          id: 'walters-sign',
          title: 'Walters Burger Co.',
          category: 'Коммерческий брендинг',
          profile: 'Плоский LOG камеры (Мутный / Низкий контраст)',
          lut: 'Теплая эмуляция Kodak 2383 • Янтарь и контраст',
          description: 'Восстанавливает глубину теней, рассеивает белесую дымку и подчеркивает теплые тона.',
        },
        {
          id: 'wamiqa-gala',
          title: 'Wamiqa Gabbi — Гала-портрет',
          category: 'Звездная мода и эдиториал',
          profile: 'Sony S-Log3 / SGamut3.Cine (Обесцвеченный)',
          lut: 'Кастомный бархатный фильм • Чистое разделение тонов кожи',
          description: 'Защищает естественное сияние кожи, углубляя сатиновые темно-синие переливы и уют фона.',
        },
        {
          id: 'siciliana-pizza',
          title: 'Пицца Siciliana Artisanal',
          category: 'Фуд-синематография Tabletop',
          profile: 'Нейтральный сенсор Flat (Низкая насыщенность)',
          lut: 'Тосканский принт • Томатный багрянец и янтарный блеск',
          description: 'Дарит запеченным корочкам, аперитиву и текстуре дерева неповторимую сочность.',
        },
        {
          id: 'walters-feast',
          title: 'Пир Walters — Дуэт и Сиззл',
          category: 'Рекламная кампания Fast-Food',
          profile: 'High-Key нейтральный LOG (Плоские света)',
          lut: '35мм коммерческий панч • Неоновая насыщенность и хруст',
          description: 'Превращает блеклые кадры в аппетитные коммерческие ролики с выразительными световыми акцентами.',
        },
      ],
    },
    contact: {
      getInTouch: 'СВЯЗАТЬСЯ',
      rights: '© 2026 ZYLITCH. ВСЕ ПРАВА ЗАЩИЩЕНЫ.',
    },
  },
};

export function getDictionary(locale: SupportedLocale): I18nDictionary {
  return DICTIONARIES[locale] || DICTIONARIES.en;
}
