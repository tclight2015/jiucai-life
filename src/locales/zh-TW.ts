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
    upcoming: "即將開獎（UTC+8）",
    history: "歷史開獎",
    winnerCount: "中獎 {{count}} 人",
    walletQuery: "查詢錢包中獎記錄",
    walletPlaceholder: "輸入錢包地址 0x…",
    noRecord: "此地址無中獎記錄",
    qualify: "參與資格",
  },

  // ─── 規則 ─────────────────────────────────────────────
  rules: {
    formula: "權重公式",
    formulaDesc: "每位持幣者的抽獎票數由以下公式決定：",
    formulaExpr: "票數 = 基礎票數 × 排名加權 × 時間加權 × 卡牌加權",
    formulaNote: "基礎票數固定為 100 票。最終票數愈多，抽中機率愈高。",
    rankTable: "持幣排名加權（共 12 級）",
    timeTable: "持倉時間加權",
    cards: "卡牌加權",
    cardsDesc: "持有特殊卡牌可進一步放大票數，開啟後下次抽獎自動生效。",
    examples: "計算範例",
    modules: "五大功能模組",
  },

  // ─── 索幣 ─────────────────────────────────────────────
  claim: {
    tiers: "索幣分級",
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
    helped: "已幫助人數",
    totalReturned: "累計還回 USDT",
  },

  // ─── 吐槽區 ───────────────────────────────────────────
  chat: {
    placeholder: "說出你的心聲…",
  },

  // ─── 排行榜 ───────────────────────────────────────────
  leaderboard: {
    subtitle: "累計中獎金額排行，狗屎運比拚",
    winCount: "中獎 {{count}} 次",
  },

  // ─── 代幣 ─────────────────────────────────────────────
  token: {
    contract: "合約地址",
    info: "代幣資訊",
    allocation: "代幣分配",
    links: "相關連結",
    fields: {
      name: "名稱",
      symbol: "符號",
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
      duration: "鎖定 1 年",
      desc: "LP Token 已透過 Uncx 鎖定，創辦人在鎖定期間無法提前撤走流動池，任何人可自行鏈上驗證。",
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
    heroSub: "一個被割過的人，寫給每一個被割過的人",
    storyTitle: "我的故事",
    missionTitle: "項目理念",
    pledgeTitle: "創辦人承諾",
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
