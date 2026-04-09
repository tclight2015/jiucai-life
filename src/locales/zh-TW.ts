const zhTW = {
  // ─── App ──────────────────────────────────────────────
  app: {
    title: "韭菜翻身日記",
    subtitle: "被割過的人，都在這裡",
  },

  // ─── 共用 ─────────────────────────────────────────────
  common: {
    back: "返回",
    copy: "複製",
    copied: "已複製",
    submit: "提交",
    send: "發送",
    query: "查詢",
    loading: "載入中…",
    noData: "暫無資料",
    official: "官方",
    days: "天",
    times: "次",
    people: "人",
  },

  // ─── 底部導航 ──────────────────────────────────────────
  nav: {
    home: "首頁",
    pool: "獎池",
    recovery: "回血",
    chat: "吐槽",
    profile: "我的",
  },

  // ─── 首頁模組卡片 ──────────────────────────────────────
  modules: {
    lottery: "抽獎名單",
    recovery: "我發誓，回血中",
    chat: "我要吐槽",
    leaderboard: "邪惡排行榜",
    trade: "買賣韭菜幣",
    claim: "我要索幣",
    calendar: "最新抽獎活動",
    profile: "個人資訊",
    rules: "抽獎規則",
    token: "代幣資訊",
    invite: "邀請朋友",
    about: "韭菜宣言",
  },

  // ─── 獎池頁 ───────────────────────────────────────────
  pool: {
    title: "當前獎池",
    countdown: "下次開獎倒數（UTC+8）",
    history: "歷史開獎記錄",
    winners: "位中獎",
    units: { d: "天", h: "時", m: "分", s: "秒" },
  },

  // ─── 個人資訊 ──────────────────────────────────────────
  profile: {
    wallet: "已連結錢包",
    holdings: "持倉狀況",
    balance: "持幣總量",
    locked: "鎖倉中",
    unlockLeft: "解鎖剩 {{days}} 天",
    rank: "持幣排名",
    holdDays: "持倉天數",
    timeWeight: "時間加權",
    prizeRecord: "中獎紀錄",
    totalUsdt: "累計獲得 USDT",
    totalJiucai: "累計獲得 JIUCAI",
    successInvite: "成功邀請",
    totalInvite: "共邀請 {{count}} 人",
    cards: "持有卡牌",
    cardsHint: "開啟後下次抽獎自動生效",
  },

  // ─── 行事曆 ───────────────────────────────────────────
  calendar: {
    intro: "提前看好，準備好你的卡牌。中午12點前加碼都還來得及。",
    upcoming: "本期開獎資訊（UTC+8）",
    flowTitle: "開獎流程說明",
    boostTitle: "加碼提醒",
    boostDesc: "持幣越多，排名越前，權重越高。開獎當天中午12點掃描前加碼都有效。不要賣幣，賣了就失去資格。",
    history: "歷史開獎紀錄",
    winnerCount: "中獎 {{count}} 人",
    walletQuery: "錢包查詢",
    walletPlaceholder: "輸入錢包地址 0x…",
    noRecord: "此地址無中獎記錄",
    qualify: "參與資格",
  },

  // ─── 規則 ─────────────────────────────────────────────
  rules: {
    noRegister: "無需報名，持幣即能參加",
    formula: "最終權重公式",
    formulaDesc: "每位持幣者的抽獎票數由以下公式決定：",
    formulaExpr: "最終權重 = 基礎票數 × 持幣排名加權 × 時間加權 × 權重翻倍卡加權",
    formulaNote: "基礎票數固定為 1。最終票數愈多，抽中機率愈高。",
    rankTable: "持幣排名加權",
    timeTable: "持倉時間加權",
    cards: "卡牌加權",
    cardsDesc: "持有特殊卡牌可進一步放大票數，開啟後下次抽獎自動生效。多張卡牌效果相乘計算，例如同時開啟兩張 ×2 卡 = 卡牌加權 4x。",
    examples: "計算範例",
    activityModules: "抽獎活動模組",
    randomness: "隨機性說明",
    randomnessDesc: "使用指定區塊 hash 作為隨機種子。開獎前公告區塊號，任何人可自行到鏈上驗證結果。",
    doNotSell: "千萬不要賣幣",
    doNotSellDesc: "這是衷心建議，以後你會感謝自己。你現在賣掉的，可能是下週的獎金。",
  },

  // ─── 索幣 ─────────────────────────────────────────────
  claim: {
    headline: "被割過？來領你的第一批韭菜幣",
    headlineDesc: "上傳你的虧損截圖，賠越多給越多。這是我們的誠意，也是你加入的門票。",
    tiers: "索幣分級",
    stepsTitle: "索幣流程",
    termsTitle: "注意事項",
    faqTitle: "常見問題",
    form: "提交申請",
    dropzone: "拖放截圖至此，或點擊選擇",
    dropzoneHint: "支援 JPG / PNG",
    walletLabel: "收幣錢包地址",
    walletPlaceholder: "0x…",
    submitBtn: "提交申請",
    refBanner: "🎉 你透過朋友邀請連結來到這裡，索幣成功後將自動記錄邀請關係",
    steps: {
      uploading: "上傳中…",
      reviewing: "審核中…",
      sending: "打幣中…",
      done: "完成！JIUCAI 已到帳",
    },
    queued: "超出每日限額，您的申請已排隊",
    queuedDays: "預計將於 {{days}} 天後發送至錢包（以 UTC+8 日期計算）",
  },

  // ─── 回血牆 ───────────────────────────────────────────
  recovery: {
    title: "我發誓，我正回血中",
    desc: "每一張截圖，都是我們打出去的真實證明。被別人割的，我們還給你。定期清空獎金池，是韭菜翻身日記的承諾。",
    helped: "已幫助人數",
    totalReturned: "累計還回 USDT",
    howTitle: "如何上傳",
    importantTitle: "重要說明",
    wallTitle: "截圖牆",
    verifyBtn: "查看原圖",
  },

  // ─── 吐槽區 ───────────────────────────────────────────
  chat: {
    title: "說吧，這裡不審查",
    subtitle: "獎金太少也可以說。罵交易所也可以說。反正這裡就是讓你說的地方。",
    rulesTitle: "發言規則",
    officialTag: "🌿官方",
    placeholder: "說出你的心聲…",
  },

  // ─── 排行榜 ───────────────────────────────────────────
  leaderboard: {
    title: "誰的狗屎運最旺？",
    subtitle: "累積領取獎金最多的人排行。不靠技術，不靠背景，純粹靠運氣和堅持持倉。",
    winCount: "中獎 {{count}} 次",
    yourRank: "你的排名",
    yourRankDesc: "連結錢包後顯示個人排名",
    reminder: "持幣才有資格。賣了就出局。",
  },

  // ─── 代幣 ─────────────────────────────────────────────
  token: {
    contract: "合約地址",
    info: "基本資訊",
    taxTitle: "交易稅",
    taxDesc: "稅收用途：2% 進獎池 · 2% 進流動池 · 2% 項目運營基金",
    allocation: "發行分配",
    vesting: "鎖倉規則",
    links: "交易",
    declaration: "特別聲明",
    declarationDesc: "韭菜翻身日記永不上 CEX\n因為 CEX 就是割你的地方",
    fields: {
      name: "幣名",
      symbol: "代號",
      chain: "發行鏈",
      supply: "總發行量",
      buyTax: "買入稅",
      sellTax: "賣出稅",
      lpLock: "流動池鎖定",
    },
    security: {
      title: "合約安全",
      basescan: "Basescan 開源驗證",
      basescanDesc: "合約程式碼已在 Basescan 公開驗證，任何人可自行比對原始碼",
      tokensniffer: "Tokensniffer 安全評分",
      tokensnifferDesc: "第三方自動化安全掃描，可查看詳細風險評估報告",
      viewReport: "查看報告",
      verified: "已驗證",
    },
    lpLockSection: {
      title: "流動池鎖定",
      provider: "Uncx Network",
      duration: "鎖定至（部署後填入）",
      desc: "LP Token 已透過 Uncx 鎖定，創辦人在鎖定期間無法提前撤走流動池，這是防止 Rug Pull 的最直接證明，任何人可自行鏈上驗證。",
      viewLock: "查看鎖倉紀錄",
    },
  },

  // ─── 邀請 ─────────────────────────────────────────────
  invite: {
    successCount: "成功邀請人數",
    totalCount: "邀請總人數",
    linkTitle: "你的邀請連結",
    linkDesc: "朋友透過此連結成功索幣，即視為邀請成功",
    copyBtn: "複製邀請連結",
    copiedBtn: "已複製！",
    rulesTitle: "邀請說明",
    rules: [
      "朋友點擊你的連結並成功完成索幣，即算邀請成功",
      "邀請成功數量記錄在你的個人資料",
      "未來邀請數量將作為競賽排名或抽獎資格條件",
      "同一朋友只計算一次，重複索幣不累計",
    ],
    recordTitle: "邀請記錄",
    noRecord: "還沒有邀請記錄，快分享連結吧！",
    statusSuccess: "成功",
    statusPending: "待索幣",
  },

  // ─── 韭菜宣言 ─────────────────────────────────────────
  about: {
    hero: "韭菜宣言",
    tagline: "被別人割的，我們還給你",
    noRegister: "無需報名，持幣即能參加",
    pledgeTitle: "我們的承諾",
    quote: "「我不保證這個幣會漲，但我保證這個項目不會消失。」",
    founder: "— 韭菜翻身日記 創辦人",
  },

  // ─── CoinPile ─────────────────────────────────────────
  coinPile: {
    label: "目前累計獎金",
  },
  // ─── Telegram 通知 ────────────────────────────────────
  telegram: {
    // 系統警報（管理員）
    alerts: {
      ethLow: "🔴 [緊急] ETH 餘額不足\n錢包: {wallet}\n餘額: {balance} ETH\n建議充值至 0.1 ETH 以上",
      usdtInsufficient: "🔴 [緊急] 獎金池 USDT 不足\n本次需支付: {required} USDT\n合約餘額: {available} USDT\n請立即補充獎金池",
      txFailed: "🔴 [緊急] 打款失敗\nTx: {txHash}\n收款人: {recipient}\n原因: {reason}",
      contractError: "🔴 [緊急] 合約異常\n呼叫方法: {method}\n錯誤: {error}",
      claimRetry: "🟡 [警告] 索幣打幣連續失敗\n錢包: {wallet}\n已重試: {attempts} 次",
      vrfTimeout: "🟡 [警告] Chainlink VRF 回調逾時\nRequest ID: {requestId}\n已等待: {minutes} 分鐘",
      poolThreshold: "🔵 [資訊] 獎金池達門檻 $10,000\n當前累計: ${total} USDT\n⚠️ 請考慮升級抽獎機制為 Chainlink VRF",
      noWinScan: "🔵 [每日掃描] 持幣 14 天未中獎名單\n共 {count} 人需處理：\n{list}\n請決定補發獎金或卡牌。",
    },
    // 用戶通知（廣播）
    notifications: {
      drawReminder: "🎰 【抽獎預告】\n韭菜翻身日記 第 {round} 期抽獎\n📅 開獎時間：{date} {time} (UTC+8)\n💰 獎池：${usdt} USDT · {jiucai} JIUCAI\n\n持幣者自動參與，持幣愈久機率愈高！",
      drawResult: "🏆 【開獎結果】第 {round} 期\n共 {winners} 位幸運兒中獎！\n💰 總獎金：${usdt} USDT · {jiucai} JIUCAI\n\n恭喜以下錢包：\n{list}\n\n沒中？繼續持幣，下次再來！💪",
      winNotice: "🎉 恭喜你！韭菜翻身成功！\n\n你在第 {round} 期抽獎中獎了！\n獎金：{prize}\n預計 {eta} 內到帳\n\n持幣就有機會，繼續加油！🌱",
      claimSuccess: "✅ 索幣申請已核准\n錢包：{wallet}\n將獲得：{amount} JIUCAI\n預計 {eta} 內打入",
      claimRejected: "❌ 索幣申請未通過\n原因：{reason}\n如有疑問請在吐槽區留言",
      inviteSuccess: "🎊 邀請成功！\n你邀請的朋友已完成索幣\n累計成功邀請：{count} 人\n\n邀請愈多，未來競賽優勢愈大！",
    },
    footer: "時間：{time}（UTC+8）",
  },

  // ─── Landing / Home ───────────────────────────────────
  landing: {
    connect: "連結錢包",
    desc: "輸入錢包地址以繼續",
    placeholder: "輸入錢包地址 0x…",
    disconnect: "登出",
  },
  home: {
    detail: "查看詳情",
  },
} as const;

export default zhTW;
export type TranslationKeys = typeof zhTW;
