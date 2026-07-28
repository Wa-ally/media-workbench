/* ==================== 新媒体爆款工作台 - 文案引擎 ====================
 *  视频拆解 + 仿写引擎
 *  核心能力：
 *  1. 将视频文案拆解为6段爆款结构
 *  2. 分析爆款元素和节奏
 *  3. 基于拆解结果仿写新文案
 *  4. 去人机感（口语化、短句混搭、个人语气、平台黑话）
 *  5. 符合平台爆款逻辑
 * ================================================================ */

const CopyEngine = {

  /* ====== 拆解分段定义 ====== */
  SEGMENTS: [
    { id: 'hook',    label: '钩子开头', icon: '🎯', timing: '0-3秒',  desc: '3秒内必须抓住注意力，制造停留' },
    { id: 'setup',   label: '内容铺垫', icon: '📋', timing: '3-15秒', desc: '快速建立背景，为转折做准备' },
    { id: 'twist',   label: '情绪转折', icon: '⚡', timing: '15-25秒', desc: '制造意外或反差，拉升情绪' },
    { id: 'value',   label: '价值输出', icon: '💡', timing: '25-50秒', desc: '核心干货/信息量最密集段落' },
    { id: 'engage',  label: '互动引导', icon: '💬', timing: '50-58秒', desc: '引导评论/点赞/收藏的行为指令' },
    { id: 'cta',     label: '结尾CTA',  icon: '🚀', timing: '58-60秒', desc: '关注引导/系列预告/转化指令' }
  ],

  /* ====== 口语化替换词典 ====== */
  COLLOQUIAL: {
    '非常': ['巨', '贼', '超', '特别', '真的'],
    '特别': ['贼', '巨', '超'],
    '但是': ['但是吧', '可问题是', '结果你猜怎么着', '但是呢'],
    '所以': ['就是说', '所以呢', '结果就是'],
    '而且': ['还有就是', '关键吧', '更离谱的是'],
    '如果': ['要是', '假如说', '万一'],
    '因为': ['原因很简单', '说白了就是'],
    '然后': ['接着', '紧接着', '下一秒'],
    '虽然': ['话是这么说', '道理我都懂'],
    '可以': ['能整', '可以搞', '完全没问题'],
    '应该': ['八成得', '大概率要', '多半'],
    '已经': ['早就', '已经', '都'],
    '需要': ['得', '得先', '你必须'],
    '进行': ['干', '搞', '弄', '整'],
    '使用': ['用', '拿', '靠'],
    '开始': ['上手', '开整', '直接干'],
    '问题': ['坑', '事儿', '麻烦'],
    '方法': ['路子', '招', '办法'],
    '效果': ['结果', '出来的东西'],
    '非常重要': ['贼关键', '巨重要', '太核心了'],
    '很多人': ['10个有8个', '大部分人', '好多人'],
    '我认为': ['我觉得吧', '说真的', '我个人感觉'],
    '首先': ['第一件事', '先说第一个', '一开始'],
    '其次': ['然后呢', '接着', '第二个'],
    '最后': ['到头来', '最后吧', '说到底'],
    '总之': ['说白了', '一句话总结', '你品品'],
  },

  /* ====== 人感开头池 ====== */
  HUMAN_HOOKS: {
    douyin: [
      '说真的，', '别问我怎么知道的，', '先别划走！', '我问你个问题——', '讲个真事，',
      '你知道最离谱的是什么吗？', '前几天我差点被坑了，', '我以前也不知道，', '信我，',
      '说句掏心窝的，', '别不信，', '听我一句劝——', '有没有人跟我一样？', '这事儿我一直没敢说，',
      '讲道理，', '你有没有这种感觉——', '别急着划，给我30秒，'
    ],
    xhs: [
      '姐妹们！！', '集美们听我说！！', '谁懂啊家人们！！', '我真的会谢！！', '救命！！',
      '不是吧不是吧！！', '我破防了家人们，', '绝绝子姐妹们，', '我先说结论——', '先码后看！',
      '答应我一定要看到最后！', '不好意思标题党了，但内容是真的——',
    ],
    bilibili: [
      '各位观众老爷，', '先叠个甲——', '有一说一，', 'UP主亲测，', '各位，',
      '我知道你们不信，', '这次我是认真的，', '先给结论，', '别急，听我慢慢说——',
      '这期可能会颠覆你的认知，', '前情提要——',
    ],
    kuaishou: [
      '老铁们，', '家人们，', '说句实在话，', '不整那些没用的，', '直接说重点——',
      '我跟你们讲啊，', '真的家人们，', '别不信我说的，',
    ],
    wechat: [
      '朋友们，', '说句心里话，', '很多人问我，', '有件事我想了很久，', '今天说点真话——',
      '如果你也面临这个困惑，', '人到中年才发现——', '这个道理，我花了十年才想明白——',
    ],
    default: [
      '说真的，', '别问我怎么知道的，', '先别划走！', '讲个真事，', '信我，',
      '说句掏心窝的，', '你有没有这种感觉——',
    ]
  },

  /* ====== 情绪转折词池 ====== */
  TWIST_WORDS: [
    '但是！', '结果呢？', '你猜怎么着？', '最离谱的还在后面——',
    '但真相是——', '可偏偏——', '万万没想到，', '重点来了——',
    '直到我发现——', '转折来了——', '但后来我才知道，', '关键不是这个——',
    '好，到这儿你可能觉得——', '但是等等，', '然而——',
  ],

  /* ====== 互动引导词池 ====== */
  ENGAGE_PHRASES: [
    '评论区扣1', '评论区扣"想看"', '扣个666', '评论区告诉我你的答案',
    '你们说是不是？', '有同感的扣个1', '觉得有用的收藏一下', '点赞转发给需要的人',
    '评论区留下你的看法', '艾特你那个不努力的闺蜜', '收藏起来反复看',
    '觉得有道理的转给朋友', '扣"学到了"', '评论区等你——',
  ],

  /* ====== 结尾CTA池 ====== */
  CTA_PHRASES: {
    douyin: [
      '关注我，下条接着拆。', '点个关注，不迷路。', '关注，后面更炸。',
      '点关注，下条教你实操。', '关注看更多干货。', '一键三连，下条更硬核。',
    ],
    xhs: [
      '收藏+关注，持续分享~', '姐妹们点关注不迷路~', '码住码住！关注看更多~',
      '一键三连不迷路~', '关注我，持续输出干货~',
    ],
    bilibili: [
      '一键三连，下期更精彩。', '关注UP主，持续更新。', '投币收藏关注，三连一下。',
      '点关注，下期更硬核。', '弹幕扣1，下期安排。',
    ],
    default: [
      '关注我，持续分享。', '点关注，不迷路。', '收藏起来，持续更新。',
    ]
  },

  /* ====== 平台黑话库 ====== */
  PLATFORM_SLANG: {
    douyin: ['上头了', '破防了', '谁懂啊', '整不会了', '绝了', '离谱', '蚌埠住了', '栓Q', '好家伙'],
    xhs: ['种草', '避雷', '绝绝子', 'yyds', '栓Q', '集美们', '谁懂啊', '破防', '上头', '真香'],
    bilibili: ['真的会谢', '蚌埠住了', '属于是', '有一说一', '好家伙', '破防了', '这波是', '寄了'],
    kuaishou: ['老铁', '没毛病', '安排', '真实', '整挺好', '双击么么哒'],
    wechat: ['说得好', '深有同感', '确实如此', '人间清醒'],
  },

  /* ====== 爆款框架库 ====== */
  FRAMEWORKS: {
    pas: {
      name: 'PAS痛点框架',
      desc: 'Problem痛点 → Agitate放大痛点 → Solution解决方案',
      structure: ['hook', 'setup', 'twist', 'value', 'engage', 'cta'],
      template: {
        hook:    '{topic}这件事，{pain}。{slang}',
        setup:   '你每天{scenario}，{agitate}，累不累？',
        twist:   '{twist}真正的问题不是{wrongCause}，是{realCause}。',
        value:   '{steps}。就这几步，{result}。{data}',
        engage:  '{engage}',
        cta:     '{cta}'
      }
    },
    aida: {
      name: 'AIDA注意框架',
      desc: 'Attention注意 → Interest兴趣 → Desire渴望 → Action行动',
      structure: ['hook', 'setup', 'twist', 'value', 'engage', 'cta'],
      template: {
        hook:    '{hook}{topic}，{claim}。',
        setup:   '为什么这么说？因为{reason}。{detail}',
        twist:   '{twist}你以为是{assumption}，其实{reality}。',
        value:   '{steps}。{result}。{data}',
        engage:  '{engage}',
        cta:     '{cta}'
      }
    },
    contrast: {
      name: '反差对比框架',
      desc: '制造反差 → 揭示真相 → 给出方案 → 数据证明',
      structure: ['hook', 'setup', 'twist', 'value', 'engage', 'cta'],
      template: {
        hook:    '{hook}{before}，但{after}。',
        setup:   '别人还在{wrongWay}的时候，{rightWay}。',
        twist:   '{twist}区别就一个——{keyDiff}。',
        value:   '{steps}。{result}。{data}',
        engage:  '{engage}',
        cta:     '{cta}'
      }
    },
    story: {
      name: '故事代入框架',
      desc: '真实故事 → 遇到问题 → 发现方法 → 结果验证 → 普适推广',
      structure: ['hook', 'setup', 'twist', 'value', 'engage', 'cta'],
      template: {
        hook:    '{hook}{story}，{storyResult}。',
        setup:   '当时我{detail}，{feeling}。',
        twist:   '{twist}后来{discovery}。',
        value:   '{steps}。{result}。{data}',
        engage:  '{engage}',
        cta:     '{cta}'
      }
    }
  },

  /* ====== 主拆解函数 ====== */
  breakdown(script) {
    if (!script || script.trim().length < 10) {
      return { error: '文案太短，请输入至少50字的完整视频文案' };
    }

    // 清理文本
    const text = script.trim().replace(/\s+/g, ' ');
    
    // 按标点切句
    const sentences = text.split(/([。！？；…\n])/).reduce((acc, part, i) => {
      if (i % 2 === 0 && part.trim()) acc.push(part.trim());
      else if (i % 2 === 1 && acc.length) acc[acc.length - 1] += part;
      return acc;
    }, []).filter(s => s.length > 2);
    
    if (sentences.length < 3) {
      return { error: '文案句子太少，无法有效拆解。请输入完整的视频文案（至少3-4句）' };
    }

    const total = sentences.length;
    
    // 按比例分配6段
    const ratios = [0.08, 0.17, 0.15, 0.35, 0.12, 0.13]; // 8%, 17%, 15%, 35%, 12%, 13%
    const segmentBoundaries = [];
    let acc = 0;
    for (let i = 0; i < ratios.length; i++) {
      const start = i === 0 ? 0 : segmentBoundaries[i - 1].end;
      acc += ratios[i];
      const end = Math.min(total, Math.ceil(total * acc));
      segmentBoundaries.push({ start, end: Math.max(end, start + 1) });
    }
    // 确保最后一段包含所有剩余句子
    segmentBoundaries[segmentBoundaries.length - 1].end = total;

    // 组装段落
    const segments = this.SEGMENTS.map((seg, i) => {
      const { start, end } = segmentBoundaries[i];
      const content = sentences.slice(start, end).join('');
      const elements = this.detectElements(content);
      const wordCount = content.length;
      return {
        ...seg,
        content,
        sentences: sentences.slice(start, end),
        elements,
        wordCount,
        analysis: this.analyzeSegment(seg.id, content, elements)
      };
    });

    // 检测使用的框架
    const framework = this.detectFramework(segments);

    // 整体分析
    const allElements = segments.flatMap(s => s.elements.map(e => e.id));
    const elementCounts = {};
    allElements.forEach(id => { elementCounts[id] = (elementCounts[id] || 0) + 1; });
    const topElements = Object.entries(elementCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => ({ ...VIRAL_ELEMENTS.find(e => e.id === id), count }));

    // 节奏分析
    const rhythm = this.analyzeRhythm(sentences);

    return {
      segments,
      framework,
      topElements,
      rhythm,
      totalWords: text.length,
      sentenceCount: total,
      avgSentenceLength: Math.round(text.length / total),
      summary: this.generateSummary(segments, framework, topElements)
    };
  },

  /* ====== 爆款元素检测 ====== */
  detectElements(text) {
    const elements = [];
    const t = text.toLowerCase();

    // 痛点刺激
    if (/(累|烦|焦虑|压力大|痛苦|崩溃|受不|受够了|太累|加班|失眠|焦虑|迷茫|困惑|不会|不懂|不知道怎么|没办法|头疼|心累|难受|崩溃|emo|抑郁|穷|没钱|压力大|卷|内卷)/.test(t)) {
      elements.push(VIRAL_ELEMENTS[0]);
    }
    // 悬念设置
    if (/(秘密|知道吗|你猜|没想到|万万没想到|结果|但是|重点来了|转折|到底|究竟|为什么|凭什么|怎么回事|后面|最离谱的|真相)/.test(t)) {
      elements.push(VIRAL_ELEMENTS[1]);
    }
    // 数据冲击
    const numbers = text.match(/\d+/g);
    if (numbers && numbers.length >= 1 && /\d/.test(text)) {
      elements.push(VIRAL_ELEMENTS[2]);
    }
    // 情感共鸣
    if (/(心|泪|哭|笑|感动|温暖|难过|开心|幸福|想哭|破防|共鸣|谁懂|有同感|一样|和我|跟我|你也有|是不是你)/.test(t)) {
      elements.push(VIRAL_ELEMENTS[3]);
    }
    // 争议对立
    if (/(凭什么|为什么|别信|错了|不对|才是对的|反而是|偏偏|反着来|不一样|反共识|你以为|其实不然)/.test(t)) {
      elements.push(VIRAL_ELEMENTS[4]);
    }
    // 干货清单
    if (/(第一步|第二|第三|步骤|方法|流程|公式|套路|逻辑|策略|技巧|清单|要点|记住|收藏|核心|关键)/.test(t)) {
      elements.push(VIRAL_ELEMENTS[5]);
    }
    // 故事代入
    if (/(我|那天|前几天|上周|去年|当时|后来|有一次|说起|分享|讲个)/.test(t)) {
      elements.push(VIRAL_ELEMENTS[6]);
    }
    // 权威背书
    if (/(万|亿|百分|数据|调查|研究|报告|实验|验证|实测|亲测|测试|对比|样本|月入|粉丝|播放)/.test(t)) {
      elements.push(VIRAL_ELEMENTS[7]);
    }

    return elements.length > 0 ? elements : [VIRAL_ELEMENTS[5]];
  },

  /* ====== 段落分析 ====== */
  analyzeSegment(segId, content, elements) {
    const analyses = {
      hook: () => {
        if (elements.some(e => e.id === 'pain')) return '✅ 痛点开局：直接戳中用户核心痛点，停留率会很高';
        if (elements.some(e => e.id === 'suspense')) return '✅ 悬念开局：制造好奇心，激发探索欲';
        if (elements.some(e => e.id === 'conflict')) return '✅ 争议开局：反共识观点，制造冲突感';
        if (elements.some(e => e.id === 'data')) return '✅ 数据开局：用数字制造冲击，快速建立信任';
        if (elements.some(e => e.id === 'story')) return '✅ 故事开局：用真实经历拉近距离，增强代入感';
        return '⚠️ 开局较平淡，建议加入痛点/悬念/争议元素提升3秒停留率';
      },
      setup: () => '建立背景信息，为后续转折做铺垫',
      twist: () => {
        if (elements.some(e => e.id === 'conflict')) return '✅ 反转到位：制造认知冲突，情绪拉升';
        return '情绪转折不够强，建议加入"但是/结果/万万没想到"等转折词';
      },
      value: () => {
        if (elements.some(e => e.id === 'value')) return '✅ 干货输出：提供了明确的步骤/方法/逻辑，触发收藏';
        if (elements.some(e => e.id === 'data')) return '✅ 数据支撑：用具体数字增强说服力';
        return '价值输出较弱，建议加入可执行的方法或具体数据';
      },
      engage: () => {
        if (/(评论|扣|转发|收藏|点赞|关注|艾特|留下|告诉我)/.test(content)) return '✅ 互动引导明确：有清晰的行动指令';
        return '⚠️ 缺少互动引导，建议结尾加入"评论区扣X/收藏/转发"等指令';
      },
      cta: () => {
        if (/(关注|下条|下期|继续|持续|更新|点关注)/.test(content)) return '✅ CTA清晰：有明确的关注转化引导';
        return '⚠️ 缺少结尾CTA，建议加入"关注我，下条继续"';
      }
    };
    return analyses[segId] ? analyses[segId]() : '';
  },

  /* ====== 框架识别 ====== */
  detectFramework(segments) {
    const hookContent = segments[0]?.content || '';
    const twistContent = segments[2]?.content || '';
    const valueContent = segments[3]?.content || '';

    if (/(我|那天|前几天|当时|后来|有一次)/.test(hookContent)) {
      return this.FRAMEWORKS.story;
    }
    if (/(但|结果|其实|然而|偏偏|反而|可问题)/.test(twistContent)) {
      return this.FRAMEWORKS.contrast;
    }
    if (/(痛|累|烦|焦虑|压力|崩溃|难受|不会|不懂)/.test(hookContent)) {
      return this.FRAMEWORKS.pas;
    }
    return this.FRAMEWORKS.aida;
  },

  /* ====== 节奏分析 ====== */
  analyzeRhythm(sentences) {
    const lengths = sentences.map(s => s.length);
    const short = lengths.filter(l => l <= 10).length;
    const medium = lengths.filter(l => l > 10 && l <= 25).length;
    const long = lengths.filter(l => l > 25).length;
    const total = lengths.length;
    return {
      fast: Math.round(short / total * 100),
      medium: Math.round(medium / total * 100),
      slow: Math.round(long / total * 100),
      avgLength: Math.round(lengths.reduce((a, b) => a + b, 0) / total),
      verdict: short > total * 0.4 ? '快节奏，适合短视频平台' : long > total * 0.3 ? '慢节奏，信息密度高' : '中等节奏，比较均衡'
    };
  },

  /* ====== 拆解总结 ====== */
  generateSummary(segments, framework, topElements) {
    return `使用了【${framework.name}】，核心爆款元素：${topElements.slice(0, 3).map(e => e.name).join('、')}。` +
      `结构完整度：${segments.filter(s => s.elements.length > 0).length}/6段有爆款元素。` +
      `${segments[0].elements.length > 0 ? '开头有爆点' : '开头偏弱需优化'}，` +
      `${segments[4].elements.length > 0 ? '互动引导到位' : '互动引导缺失'}，` +
      `${segments[5].elements.length > 0 ? 'CTA完整' : 'CTA缺失'}。`;
  },

  /* ====== 仿写引擎 ====== */
  /**
   * @param {Object} breakdown - 拆解结果
   * @param {String} topic - 用户的主题/领域
   * @param {String} platform - 目标平台
   * @param {String} tone - 语气版本: aggressive(激进) / gentle(温和) / story(故事)
   * @param {Object} customVars - 用户自定义变量
   */
  imitate(breakdown, { topic, platform = 'douyin', tone = 'aggressive', customVars = {} }) {
    if (!breakdown || breakdown.error) {
      return { error: '请先完成视频拆解再进行仿写' };
    }
    if (!topic) {
      return { error: '请输入你的主题/领域/产品' };
    }

    const fw = breakdown.framework;
    const platformKey = PLATFORMS[platform] ? platform : 'douyin';
    const slang = this.PLATFORM_SLANG[platformKey] || this.PLATFORM_SLANG.douyin;
    
    // 语气版本配置
    const toneConfig = {
      aggressive: {
        name: '激进版',
        intensity: 'high',
        hookPrefix: ['', '！', '——'],
        sentenceEnd: ['。', '！', '？'],
        exclamationRate: 0.3
      },
      gentle: {
        name: '温和版',
        intensity: 'medium',
        hookPrefix: ['', '~'],
        sentenceEnd: ['。', '~', '。'],
        exclamationRate: 0.1
      },
      story: {
        name: '故事版',
        intensity: 'medium',
        hookPrefix: ['', '，'],
        sentenceEnd: ['。', '。', '……'],
        exclamationRate: 0.15
      }
    };
    const tc = toneConfig[tone] || toneConfig.aggressive;

    // 构建仿写数据池
    const pool = this.buildContentPool(topic, platform, tone, customVars, slang);
    
    // 基于框架模板生成各段
    const template = fw.template;
    const segments = fw.structure.map(segId => {
      const segDef = this.SEGMENTS.find(s => s.id === segId);
      let content = template[segId] || '';
      
      // 填充模板变量
      content = this.fillTemplate(content, pool, segId, platform, tc, slang);
      
      // 去人机感处理
      content = this.humanize(content, platform, tc);
      
      return {
        ...segDef,
        content,
        isImitated: true
      };
    });

    // 组装完整文案
    const fullScript = segments.map(s => s.content).join('\n\n');
    
    // 生成变体说明
    const variations = this.generateVariations(topic, platform);

    return {
      segments,
      fullScript,
      framework: fw,
      tone: tc.name,
      platform: PLATFORMS[platformKey],
      wordCount: fullScript.replace(/\s/g, '').length,
      variations,
      antiAICheck: this.checkAntiAI(fullScript)
    };
  },

  /* ====== 构建仿写内容池 ====== */
  buildContentPool(topic, platform, tone, customVars, slang) {
    const randomSlang = () => slang[Math.floor(Math.random() * slang.length)];
    
    return {
      topic,
      hook: this.HUMAN_HOOKS[platform] ? 
        this.HUMAN_HOOKS[platform][Math.floor(Math.random() * this.HUMAN_HOOKS[platform].length)] :
        this.HUMAN_HOOKS.default[Math.floor(Math.random() * this.HUMAN_HOOKS.default.length)],
      twist: this.TWIST_WORDS[Math.floor(Math.random() * this.TWIST_WORDS.length)],
      engage: this.ENGAGE_PHRASES[Math.floor(Math.random() * this.ENGAGE_PHRASES.length)],
      cta: (this.CTA_PHRASES[platform] || this.CTA_PHRASES.default)[Math.floor(Math.random() * (this.CTA_PHRASES[platform] || this.CTA_PHRASES.default).length)],
      slang: randomSlang(),
      pain: customVars.pain || `做${topic}这件事`,
      claim: customVars.claim || `是今年最大的机会`,
      reason: customVars.reason || `${topic}这个赛道还在红利期`,
      detail: customVars.detail || `门槛低、天花板高、竞争还没那么卷`,
      assumption: customVars.assumption || `只要努力就能做好`,
      reality: customVars.reality || `方向比努力重要100倍`,
      before: customVars.before || `以前做${topic}要花大量时间`,
      after: customVars.after || `现在用AI效率翻了10倍`,
      wrongWay: customVars.wrongWay || `还在用老方法`,
      rightWay: customVars.rightWay || `聪明人已经用上了新工具`,
      keyDiff: customVars.keyDiff || `认知差`,
      story: customVars.story || `我有个朋友做${topic}半年了`,
      storyResult: customVars.storyResult || `从月入3千到月入3万`,
      feeling: customVars.feeling || `整个人都焦虑得不行`,
      discovery: customVars.discovery || `他发现了一个方法`,
      scenario: customVars.scenario || `都在${topic}上花时间`,
      agitate: customVars.agitate || `结果什么都没做出来`,
      wrongCause: customVars.wrongCause || `不够努力`,
      realCause: customVars.realCause || `方法不对`,
      steps: customVars.steps || `第一步，找到对标账号，拆解他的爆款内容。第二步，用AI帮你分析结构和话术。第三步，自己改编后发布，每天3条。第四步，数据复盘，只复制跑得好的方向`,
      result: customVars.result || `一个月就能看到明显效果`,
      data: customVars.data || `他第一个月就涨了2万粉`,
      wrongAnswer: customVars.wrongAnswer || '',
      ...customVars
    };
  },

  /* ====== 模板填充 ====== */
  fillTemplate(template, pool, segId, platform, tc, slang) {
    let result = template;
    
    // 替换所有 {variable} 占位符
    result = result.replace(/\{(\w+)\}/g, (match, key) => {
      const val = pool[key];
      if (val === undefined || val === '') return '';
      // 对 slang 特殊处理
      if (key === 'slang') {
        return pool.slang;
      }
      return val;
    });
    
    // 如果没有占位符被替换（模板里没有变量），生成基础内容
    if (!template.includes('{')) {
      result = this.generateBaseContent(segId, pool, platform, tc);
    }
    
    return result;
  },

  /* ====== 基础内容生成（无模板时） ====== */
  generateBaseContent(segId, pool, platform, tc) {
    const generators = {
      hook: () => `${pool.hook}${pool.topic}这件事，${pool.claim}。`,
      setup: () => `你想想，${pool.reason}。${pool.detail}。`,
      twist: () => `${pool.twist}${pool.assumption}？${pool.reality}。`,
      value: () => `${pool.steps}。${pool.result}。`,
      engage: () => pool.engage + '。',
      cta: () => pool.cta
    };
    return generators[segId] ? generators[segId]() : '';
  },

  /* ====== 去人机感处理 ====== */
  humanize(text, platform, tc) {
    let result = text;
    
    // 1. 口语化替换
    for (const [formal, colloquial] of Object.entries(this.COLLOQUIAL)) {
      const replacement = colloquial[Math.floor(Math.random() * colloquial.length)];
      result = result.replace(new RegExp(formal, 'g'), replacement);
    }
    
    // 2. 短句拆分：长句（>30字）拆成短句
    result = result.replace(/([^。！？\n]{25,40}[，,])/g, '$1\n');
    
    // 3. 添加停顿和语气词（随机插入，模拟口语节奏）
    if (tc.exclamationRate > 0.2) {
      // 激进版：增加感叹号
      result = result.replace(/。{1}/g, () => Math.random() < tc.exclamationRate ? '！' : '。');
    }
    
    // 4. 随机插入语气停顿
    const pauses = ['……', '——', '，', '。'];
    // 在部分句子开头加停顿感
    const sentences = result.split(/([。！？\n])/).reduce((acc, part, i) => {
      if (i % 2 === 0 && part.trim()) acc.push(part.trim());
      else if (i % 2 === 1 && acc.length) acc[acc.length - 1] += part;
      return acc;
    }, []);
    const humanized = sentences.map((s, i) => {
      s = s.trim();
      if (s.length < 5) return s;
      // 随机在短句后面加点情绪
      if (Math.random() < 0.15 && s.length < 12 && !/[！？…]$/.test(s)) {
        s = s.replace(/[。]$/, '……');
      }
      return s;
    }).filter(s => s.length > 0).join('');
    
    // 5. 平台特殊处理
    if (platform === 'xhs') {
      // 小红书：加 emoji
      humanized.replace(/。{1}/g, '。✨');
    }
    
    return humanized;
  },

  /* ====== 生成变体建议 ====== */
  generateVariations(topic, platform) {
    const variations = [];
    
    // 不同开头钩子
    const hooks = this.HUMAN_HOOKS[platform] || this.HUMAN_HOOKS.default;
    hooks.slice(0, 4).forEach(h => {
      variations.push({ type: '开头变体', content: `${h}${topic}这件事，一定要趁早。` });
    });
    
    // 不同转折
    this.TWIST_WORDS.slice(0, 3).forEach(t => {
      variations.push({ type: '转折变体', content: t });
    });
    
    // 不同CTA
    const ctas = this.CTA_PHRASES[platform] || this.CTA_PHRASES.default;
    ctas.slice(0, 3).forEach(c => {
      variations.push({ type: 'CTA变体', content: c });
    });
    
    return variations;
  },

  /* ====== 去人机感检测 ====== */
  checkAntiAI(text) {
    const checks = [];
    
    // 检查短句比例
    const sentences = text.split(/[。！？\n]/).filter(s => s.trim().length > 0);
    const shortSentences = sentences.filter(s => s.trim().length <= 15).length;
    const shortRate = shortSentences / sentences.length;
    checks.push({
      item: '短句混搭',
      score: shortRate > 0.35 ? 'good' : 'warn',
      detail: `短句占比${Math.round(shortRate * 100)}%，${shortRate > 0.35 ? '✅ 口语节奏感好' : '⚠️ 建议增加短句'}`
    });
    
    // 检查口语化词汇
    const colloquialWords = ['巨', '贼', '说真的', '老实讲', '你想想', '说句', '别不信', '信我', '就是说', '说白了'];
    const colloquialCount = colloquialWords.filter(w => text.includes(w)).length;
    checks.push({
      item: '口语化表达',
      score: colloquialCount >= 2 ? 'good' : 'warn',
      detail: `检测到${colloquialCount}个口语化词汇，${colloquialCount >= 2 ? '✅ 人感充足' : '⚠️ 建议增加口语词'}`
    });
    
    // 检查是否有标点节奏变化
    const hasExclamation = /[！]/.test(text);
    const hasEllipsis = /[…]/.test(text);
    const hasQuestion = /[？]/.test(text);
    const punctuationVariety = [hasExclamation, hasEllipsis, hasQuestion].filter(Boolean).length;
    checks.push({
      item: '标点节奏',
      score: punctuationVariety >= 2 ? 'good' : 'warn',
      detail: `标点多样性${punctuationVariety}/3，${punctuationVariety >= 2 ? '✅ 节奏感好' : '⚠️ 建议加入！？…等标点'}`
    });
    
    // 检查句式多样性
    const hasRhetorical = /[？]/.test(text);
    checks.push({
      item: '反问句式',
      score: hasRhetorical ? 'good' : 'warn',
      detail: hasRhetorical ? '✅ 有反问句，增强互动感' : '⚠️ 建议加入反问句'
    });
    
    const goodCount = checks.filter(c => c.score === 'good').length;
    const totalScore = Math.round(goodCount / checks.length * 100);
    
    return {
      score: totalScore,
      checks,
      verdict: totalScore >= 75 ? '人感强，AI检测通过率低' : totalScore >= 50 ? '基本可以，建议优化标点节奏' : 'AI感较强，需要增加口语化表达'
    };
  },

  /* ====== 格式化文案输出 ====== */
  formatScript(result) {
    if (result.error) return result.error;
    
    let output = `【${result.tone} · ${result.platform.name}】\n`;
    output += `框架：${result.framework.name}\n`;
    output += `${'─'.repeat(40)}\n\n`;
    
    result.segments.forEach(seg => {
      output += `${seg.icon} ${seg.label}（${seg.timing}）\n`;
      output += `${seg.content}\n\n`;
    });
    
    output += `${'─'.repeat(40)}\n`;
    output += `字数：${result.wordCount}字\n`;
    output += `去人机感评分：${result.antiAICheck.score}/100 - ${result.antiAICheck.verdict}\n`;
    
    return output;
  }
};
