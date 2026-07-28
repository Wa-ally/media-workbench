/* ==================== 新媒体爆款工作台 - 数据层 ==================== */

/* 平台配置 */
const PLATFORMS = {
  douyin:    { name: '抖音',     color: '#000000', bg: '#1a1a1a', icon: '🎵' },
  kuaishou:  { name: '快手',     color: '#ff6b35', bg: '#2a1810', icon: '⚡' },
  xhs:       { name: '小红书',   color: '#ff2442', bg: '#2a0f15', icon: '📕' },
  bilibili:  { name: 'B站',      color: '#00a1d6', bg: '#0a1e2a', icon: '📺' },
  wechat:    { name: '视频号',   color: '#07c160', bg: '#0a2418', icon: '💬' },
  youtube:   { name: 'YouTube', color: '#ff0000', bg: '#2a0a0a', icon: '▶' },
  tiktok:    { name: 'TikTok',  color: '#010101', bg: '#1a1a1a', icon: '🎼' }
};

/* 默认分类 */
const DEFAULT_CATEGORIES = [
  { id: 'aigc',       name: 'AIGC培训',      color: '#7c6cff', icon: '🤖', desc: 'AI生成内容培训、AI工具教学、AI创业方向' },
  { id: 'ecommerce', name: '电商带货',       color: '#ff6b35', icon: '🛒', desc: '直播带货、短视频带货、选品策略' },
  { id: 'knowledge', name: '知识付费',       color: '#00c896', icon: '📚', desc: '课程推广、付费社群、训练营' },
  { id: 'brand',     name: '品牌营销',       color: '#ff2442', icon: '🎯', desc: '品牌种草、营销事件、IP打造' },
  { id: 'drama',     name: '剧情短剧',       color: '#ffa500', icon: '🎬', desc: '微短剧、连载剧情、情感故事' },
  { id: 'local',     name: '本地生活',       color: '#4facfe', icon: '📍', desc: '探店、本地团购、同城推广' },
  { id: 'personal',  name: '个人IP',         color: '#f5576c', icon: '⭐', desc: '个人品牌、人设打造、粉丝运营' },
  { id: 'tool',      name: '工具/软件',      color: '#2dca73', icon: '🔧', desc: '软件推荐、效率工具、AI工具' }
];

/* 爆款视频示例数据 */
const DEMO_VIDEOS = [
  {
    id: 'v001',
    title: '我用AI一天做了100张设计图，老板直接加薪了',
    platform: 'douyin',
    categoryId: 'aigc',
    author: 'AI设计老王',
    authorFollowers: 860000,
    views: 2840000,
    likes: 186000,
    comments: 8900,
    shares: 23000,
    duration: 58,
    date: '2026-07-26',
    tags: ['Midjourney', 'AI设计', '效率提升', '职场'],
    script: '说真的，我以前做一张设计图至少3小时。直到我发现了这个AI工作流。第一步，你先让AI帮你生成构图草稿，直接把你的想法告诉它，10秒出5版。第二步，你挑一个方向，让AI细化细节。第三步，你自己微调一下颜色和文字。三步走完，一张图20分钟搞定。我上周用这个方法，一天做了100张图，老板看完直接给我加了薪。你们说，这种效率提升，哪个公司不想要？收藏这条，我下条教你怎么用AI做整套品牌VI。',
    videoUrl: ''
  },
  {
    id: 'v002',
    title: 'ChatGPT+剪映=全自动视频流水线，小白也能做',
    platform: 'douyin',
    categoryId: 'aigc',
    author: 'AI实战派小林',
    authorFollowers: 520000,
    views: 1950000,
    likes: 142000,
    comments: 7600,
    shares: 18000,
    duration: 72,
    date: '2026-07-25',
    tags: ['ChatGPT', '剪映', '自动化', '视频制作'],
    script: '先别划走！今天教你一套AI全自动做视频的流程。第一步，ChatGPT写文案，你给它一个主题，让它按爆款结构写。第二步，文案丢给剪映的图文成片功能，自动配画面和配音。第三步，你只需要花5分钟调一下节奏和字幕。就这么简单，一条高质量视频30分钟搞定。我上个月用这个方法做了60条视频，涨了8万粉。关键是，不需要你会剪辑，不需要你有团队。评论区扣1，我整理了一份详细的操作文档。',
    videoUrl: ''
  },
  {
    id: 'v003',
    title: 'AI帮我月入3万的全过程，小白也能复制',
    platform: 'xhs',
    categoryId: 'aigc',
    author: 'AI搞钱日记',
    authorFollowers: 320000,
    views: 1580000,
    likes: 128000,
    comments: 12000,
    shares: 9500,
    duration: 65,
    date: '2026-07-24',
    tags: ['AI变现', '副业', '自由职业'],
    script: '姐妹们！AI真的能搞钱！今天掏心窝分享一下我用AI月入3万的全过程。第一步，用AI帮你写商业文案，接单平台上一单200-500。第二步，用AI做设计图，淘宝上接单一单50-200。第三步，用AI做知识付费内容，打包成课程卖。第四步，用AI做自媒体内容，涨粉变现。四种方式，我第三种和第四种加起来就3万了。重点是，不需要你有任何专业背景，AI帮你干活。收藏这条，我后面会详细拆每一种。',
    videoUrl: ''
  },
  {
    id: 'v004',
    title: '直播3小时卖了50万，我的选品逻辑全公开',
    platform: 'douyin',
    categoryId: 'ecommerce',
    author: '带货一姐小美',
    authorFollowers: 1200000,
    views: 3600000,
    likes: 285000,
    comments: 15000,
    shares: 42000,
    duration: 85,
    date: '2026-07-26',
    tags: ['直播带货', '选品', '转化率', '复盘'],
    script: '50万怎么卖的？就三个品。第一个品是引流款，9.9的纸巾，不赚钱，就为了把人留住。第二个品是利润款，198的精华液，利润率60%，这是主力。第三个品是爆款，39.9的洗面奶，走量，利润率30%。选品逻辑很简单：引流款留人，利润款赚钱，爆款走量。三个品搭配，3小时50万。很多人直播卖不动，就是因为只有一种品。你要么全是利润款没人来，要么全是引流款不赚钱。记住这个铁三角逻辑，下条我讲怎么排品顺序。',
    videoUrl: ''
  },
  {
    id: 'v005',
    title: '一个公式写出让10万人转发的文案',
    platform: 'bilibili',
    categoryId: 'knowledge',
    author: '文案老司机',
    authorFollowers: 680000,
    views: 2100000,
    likes: 165000,
    comments: 9200,
    shares: 31000,
    duration: 120,
    date: '2026-07-23',
    tags: ['文案', '爆款公式', '传播学'],
    script: '为什么有的文案10万转发，有的连点赞都没有？今天给你一个公式。痛点+反差+解决方案+情绪锚点=爆款。痛点，就是你开头第一句就要戳中他的痛。反差，就是你给一个意想不到的角度。解决方案，就是你给一个简单可操作的方法。情绪锚点，就是你最后留一个让人想转发的金句。举个例子，痛点：每天加班到11点。反差：但最累的不是身体，是看不到希望。解决方案：三个习惯帮你找回节奏。情绪锚点：打工人的体面，不是加班加出来的。你品品，这个结构是不是万能的？',
    videoUrl: ''
  },
  {
    id: 'v006',
    title: '一天涨粉2万的秘密，99%的人不知道',
    platform: 'douyin',
    categoryId: 'personal',
    author: '涨粉教练阿杰',
    authorFollowers: 950000,
    views: 4200000,
    likes: 310000,
    comments: 18000,
    shares: 56000,
    duration: 52,
    date: '2026-07-27',
    tags: ['涨粉', '起号', '流量池', '算法'],
    script: '一天2万粉，怎么做到的？就一招：蹭热点+反转人设。热点谁都会蹭，但99%的人蹭错了方向。错误做法：直接模仿热点内容。正确做法：用你自己的视角反着来。举个例子，最近所有人在聊AI替代工作。别人都在说"要失业了"，你偏要说"AI让我3天干了3个月的活"。反着来，流量直接拉满。因为算法推荐的就是有争议的内容。记住，热点本身自带流量，但能爆发的一定是反共识的。你跟大多数人一样，就是流量池底部的炮灰。',
    videoUrl: ''
  },
  {
    id: 'v007',
    title: '微短剧赛道还能不能做？30天数据告诉你',
    platform: 'kuaishou',
    categoryId: 'drama',
    author: '短剧操盘手',
    authorFollowers: 430000,
    views: 1850000,
    likes: 98000,
    comments: 6700,
    shares: 12000,
    duration: 95,
    date: '2026-07-25',
    tags: ['微短剧', '赛道分析', '快手'],
    script: '微短剧到底还能不能做？我花了30天做了一个测试。投了12部短剧，成本从5千到5万不等。结果是什么？12部里3部赚了钱，回本率25%。赚钱的3部有什么共同点？第一，题材都是逆袭打脸。第二，女主都是30+全职妈妈人设。第三，前3集免费，第4集开始收费。亏钱的9部呢？题材分散，人设不精准。结论是：微短剧还能做，但必须精准垂直。别什么都拍，找到你的目标人群，把一个人设吃透。',
    videoUrl: ''
  },
  {
    id: 'v008',
    title: '探店视频这么做，商家求着给你免单',
    platform: 'xhs',
    categoryId: 'local',
    author: '探店达人小鱼',
    authorFollowers: 410000,
    views: 1320000,
    likes: 89000,
    comments: 5400,
    shares: 8700,
    duration: 48,
    date: '2026-07-26',
    tags: ['探店', '本地生活', '合作'],
    script: '姐妹们，探店真的太香了！我上个月接了20家店，全是免单加推广费。怎么做？第一，你的前3秒必须拍出最诱人的那个画面。一道菜上桌，滋滋冒油的那个瞬间，拉满。第二，你要说人话。别说什么"口感丰富层次分明"，要说"一口下去满嘴都是芝士的感觉，巨满足"。第三，你一定要给一个明确的推荐理由。"人均80但吃出了200的感觉"，这话一出，评论区就炸。第四，结尾记得艾特商家，他们一转发，你的流量直接翻倍。这四步，20家店排队找我合作。',
    videoUrl: ''
  }
];

/* 爆款直播示例数据 */
const DEMO_STREAMS = [
  {
    id: 's001',
    title: 'AI工具专场：40+款工具一次讲透',
    platform: 'douyin',
    host: 'AI实战派小林',
    categoryId: 'aigc',
    peakViewers: 86000,
    avgViewers: 32000,
    duration: 186,
    sales: 128000,
    orders: 2400,
    gmv: 128000,
    date: '2026-07-26',
    highlights: ['开场5分钟在线破8万', 'AI课程链接转化率12%', '评论区互动率8.5%'],
    tags: ['AI培训', '课程带货', '知识付费']
  },
  {
    id: 's002',
    title: '夏季清仓大促：女装专场',
    platform: 'douyin',
    host: '带货一姐小美',
    categoryId: 'ecommerce',
    peakViewers: 156000,
    avgViewers: 78000,
    duration: 210,
    sales: 86000,
    orders: 18500,
    gmv: 580000,
    date: '2026-07-27',
    highlights: ['开场即爆，峰值15.6万', '利润款转化率9.2%', '返场3次均秒空'],
    tags: ['女装', '清仓', '大促']
  },
  {
    id: 's003',
    title: 'Midjourney零基础到精通直播课',
    platform: 'bilibili',
    host: '设计老王AI课',
    categoryId: 'aigc',
    peakViewers: 42000,
    avgViewers: 18000,
    duration: 165,
    sales: 3200,
    orders: 890,
    gmv: 96000,
    date: '2026-07-25',
    highlights: ['免费试听引流转化21%', '弹幕互动量2.4万', '课程续费率45%'],
    tags: ['Midjourney', '设计培训', 'B站直播']
  },
  {
    id: 's004',
    title: '新手做自媒体第1天：从0到1全流程',
    platform: 'wechat',
    host: '自媒体老张',
    categoryId: 'knowledge',
    peakViewers: 68000,
    avgViewers: 35000,
    duration: 140,
    sales: 5600,
    orders: 1200,
    gmv: 89000,
    date: '2026-07-24',
    highlights: ['视频号推荐流量占比62%', '中年用户群体精准', '付费转化路径极短'],
    tags: ['自媒体', '新手起号', '视频号']
  }
];

/* 爆款元素标签 */
const VIRAL_ELEMENTS = [
  { id: 'pain',      name: '痛点刺激',  icon: '😰', desc: '开头直击用户核心痛点，让人无法划走' },
  { id: 'suspense',  name: '悬念设置',  icon: '🤔', desc: '制造信息缺口，激发好奇心，制造期待' },
  { id: 'data',      name: '数据冲击',  icon: '📊', desc: '用具体数字制造冲击感，增强可信度' },
  { id: 'emotion',   name: '情感共鸣',  icon: '❤️', desc: '唤起用户情感认同，产生转发冲动' },
  { id: 'conflict',  name: '争议对立',  icon: '⚡', desc: '制造反共识观点，引发评论区讨论' },
  { id: 'value',     name: '干货清单',  icon: '📝', desc: '提供明确可执行的价值，触发收藏' },
  { id: 'story',     name: '故事代入',  icon: '📖', desc: '用真实故事拉近距离，增强代入感' },
  { id: 'authority', name: '权威背书',  icon: '🏆', desc: '借助数据/案例/身份建立信任' }
];

/* 平台爆款逻辑 */
const PLATFORM_LOGIC = {
  douyin: {
    name: '抖音爆款逻辑',
    rules: [
      '前3秒必须爆：要么痛点，要么反差，要么悬念',
      '完播率是第一指标：节奏快，信息密度高，不废话',
      '短句为主：每句不超过15字，制造紧凑感',
      '评论区引导：结尾留钩子，引导互动',
      '黄金时间轴：0-3s钩子 → 3-15s铺垫 → 15-30s转折 → 30-50s价值 → 50-60sCTA',
      '口语化：说人话，不说书面语，不用复杂句式'
    ]
  },
  xhs: {
    name: '小红书爆款逻辑',
    rules: [
      '种草感第一：不是卖货，是分享体验',
      'emoji丰富：每段至少1-2个emoji，视觉节奏感',
      '"姐妹们"开头：建立亲近感，降低防备心',
      '具体场景化：描述要具体到画面，不要笼统',
      '标题党但有料：标题吸引人，内容要有干货支撑',
      '标签矩阵：3-5个话题标签，覆盖搜索流量'
    ]
  },
  bilibili: {
    name: 'B站爆款逻辑',
    rules: [
      '信息密度极高：UP主要给干货，不能水',
      '逻辑递进：有起承转合，不是碎片信息堆砌',
      '弹幕梗：适当玩梗，制造弹幕互动点',
      '时长3-10分钟最佳：太短信息不够，太长完播低',
      '观众老爷心态：尊重观众智商，不教条',
      '分区适配：不同分区有不同的内容偏好'
    ]
  },
  kuaishou: {
    name: '快手爆款逻辑',
    rules: [
      '老铁文化：真实、接地气、有人情味',
      '信任经济：人设比内容更重要',
      '直接说事：不绕弯子，开头就说重点',
      '接地气场景：生活化场景，不要精致布景',
      '互动感强：经常喊话老铁，制造参与感'
    ]
  },
  wechat: {
    name: '视频号爆款逻辑',
    rules: [
      '中年受众为主：内容偏价值观、人生感悟',
      '金句感：每条要有1-2句能截图转发的金句',
      '社交推荐制：转发到朋友圈是核心传播路径',
      '信息增量：不能只是观点，要有新信息或新角度',
      '情绪正向：正能量、鸡汤类内容传播力更强'
    ]
  }
};
