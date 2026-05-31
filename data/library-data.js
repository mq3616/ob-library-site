window.LIBRARY_DATA = {
  site: {
    title: "个人图书馆",
    subtitle: "按主题收藏，按章节精读",
    description: "这是一个数据驱动的个人图书馆网页。主页按书籍类型分类，进入书籍后使用统一精读框架加载章节译文、关键词、核心矛盾和笔记。"
  },
  categories: [
    { id: "political-thought", name: "政治思想", intro: "国家、制度、权力、治理与历史思想经典。" },
    { id: "ai-tools", name: "AI 与工具", intro: "AI 工具、Agent、知识管理与工程实践。" },
    { id: "investment-cognition", name: "投资认知", intro: "投资方法、错误清单、交易前判断和复盘。" },
    { id: "cognitive-judgment", name: "认知判断", intro: "判断、表达、沟通和个人成长。" }
  ],
  books: [
    {
      id: "shangjunshu",
      title: "商君书",
      subtitle: "战国法家与秦国变法逻辑",
      author: "题商鞅及其后学",
      categoryId: "political-thought",
      coverMark: "法",
      status: "精读中",
      priority: "高",
      source: "维基文库公版原文，本地白话译文与精读分析",
      description: "一部讨论国家如何通过法令、赏罚、农业、战争、军功和弱民策略实现强力动员的法家经典。",
      tags: ["法家", "制度", "秦国", "国家能力", "耕战"],
      routes: [
        {
          id: "reform",
          title: "变法与强国",
          chapters: ["更法第一", "開塞第七", "壹言第八", "錯法第九"],
          summary: "先读商鞅为什么要反传统：旧礼、旧贵族、旧议论都被视为国家变强的阻力。"
        },
        {
          id: "farming-war",
          title: "耕战国家",
          chapters: ["墾令第二", "農戰第三", "去彊第四", "算地第六", "徠民第十五"],
          summary: "把民众的时间、欲望和资源导入农业与战争。"
        },
        {
          id: "reward-punish",
          title: "赏罚与军功",
          chapters: ["說民第五", "戰法第十", "立本第十一", "兵守第十二", "賞刑第十七", "境內第十九"],
          summary: "用利益、恐惧、军功和严密奖惩塑造行为。"
        },
        {
          id: "weak-people",
          title: "弱民与去私",
          chapters: ["弱民第二十", "御盗第二十一", "外內第二十二", "君臣第二十三", "禁使第二十四", "靳令第十三"],
          summary: "强国家与弱社会之间最刺眼的张力。"
        },
        {
          id: "law-order",
          title: "法、权与定分",
          chapters: ["修權第十四", "畫策第十八", "慎法第二十五", "定分第二十六"],
          summary: "法令明确、权责固定、官民纳入同一秩序。"
        }
      ]
    }
  ]
};
