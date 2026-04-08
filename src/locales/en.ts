const en = {
  // ─── App ──────────────────────────────────────────────
  app: {
    title: "Diary of an Underdog's Rise",
    subtitle: "For everyone who's been burned before.",
  },

  // ─── 共用 ─────────────────────────────────────────────
  common: {
    back: "Back",
    copy: "Copy",
    copied: "Copied",
    submit: "Submit",
    send: "Send",
    query: "Search",
    loading: "Loading…",
    noData: "No data",
    official: "Official",
    days: "d",
    times: "x",
    people: "people",
  },

  // ─── 底部導航 ──────────────────────────────────────────
  nav: {
    home: "Home",
    pool: "Pool",
    recovery: "Recovery",
    chat: "Chat",
    profile: "Me",
  },

  // ─── 首頁模組卡片 ──────────────────────────────────────
  modules: {
    lottery: "Lottery List",
    recovery: "I Swear, Recovering",
    chat: "Vent Here",
    leaderboard: "Evil Leaderboard",
    trade: "Trade JIUCAI",
    claim: "Claim Tokens",
    calendar: "Latest Draws",
    profile: "My Profile",
    rules: "Draw Rules",
    token: "Token Info",
    invite: "Invite Friends",
    about: "Our Manifesto",
  },

  // ─── 獎池頁 ───────────────────────────────────────────
  pool: {
    title: "Current Prize Pool",
    countdown: "Next Draw Countdown",
    history: "Draw History",
    winners: "winners",
    units: { d: "d", h: "h", m: "m", s: "s" },
  },

  // ─── 個人資訊 ──────────────────────────────────────────
  profile: {
    wallet: "Connected Wallet",
    holdings: "Holdings",
    balance: "Balance",
    locked: "Locked",
    unlockLeft: "{{days}}d until unlock",
    rank: "Holder Rank",
    holdDays: "Hold Days",
    timeWeight: "Time Weight",
    prizeRecord: "Prize History",
    totalUsdt: "Total USDT Won",
    totalJiucai: "Total JIUCAI Won",
    successInvite: "Successful Referrals",
    totalInvite: "{{count}} invited total",
    cards: "Cards",
    cardsHint: "Active cards apply to the next draw",
  },

  // ─── 行事曆 ───────────────────────────────────────────
  calendar: {
    upcoming: "Upcoming Draws",
    history: "Draw History",
    winnerCount: "{{count}} winners",
    walletQuery: "Check Wallet Win History",
    walletPlaceholder: "Enter wallet address 0x…",
    noRecord: "No win records for this address",
    qualify: "Eligibility",
  },

  // ─── 規則 ─────────────────────────────────────────────
  rules: {
    formula: "Weight Formula",
    formulaDesc: "Each holder's lottery tickets are calculated by:",
    formulaExpr: "Tickets = Base × Rank Weight × Time Weight × Card Weight",
    formulaNote: "Base tickets = 100. More tickets = higher win probability.",
    rankTable: "Holder Rank Weight (12 Tiers)",
    timeTable: "Hold Time Weight",
    cards: "Card Bonuses",
    cardsDesc: "Special cards amplify your tickets. Activate before the next draw.",
    examples: "Calculation Examples",
    modules: "5 Core Features",
  },

  // ─── 索幣 ─────────────────────────────────────────────
  claim: {
    tiers: "Claim Tiers",
    form: "Submit Application",
    dropzone: "Drop screenshot here, or click to select",
    dropzoneHint: "JPG / PNG supported",
    walletLabel: "Receiving Wallet Address",
    walletPlaceholder: "0x…",
    submitBtn: "Submit Application",
    refBanner: "🎉 You arrived via a friend's invite link. Your referral will be recorded upon successful claim.",
    steps: {
      uploading: "Uploading…",
      reviewing: "Under Review…",
      sending: "Sending Tokens…",
      done: "Done! JIUCAI has been sent.",
    },
  },

  // ─── 回血牆 ───────────────────────────────────────────
  recovery: {
    helped: "People Helped",
    totalReturned: "Total USDT Returned",
  },

  // ─── 吐槽區 ───────────────────────────────────────────
  chat: {
    placeholder: "Say what's on your mind…",
  },

  // ─── 排行榜 ───────────────────────────────────────────
  leaderboard: {
    subtitle: "Ranked by total winnings — pure luck edition",
    winCount: "{{count}} wins",
  },

  // ─── 代幣 ─────────────────────────────────────────────
  token: {
    contract: "Contract Address",
    info: "Token Info",
    allocation: "Token Allocation",
    links: "Links",
    fields: {
      name: "Name",
      symbol: "Symbol",
      supply: "Total Supply",
      buyTax: "Buy Tax",
      sellTax: "Sell Tax",
      lpLock: "LP Lock",
    },
    security: {
      title: "Contract Security",
      basescan: "Basescan Source Verified",
      basescanDesc: "Contract source code is publicly verified on Basescan — anyone can inspect it",
      tokensniffer: "Tokensniffer Score",
      tokensnifferDesc: "Automated third-party security scan with full risk assessment report",
      viewReport: "View Report",
      verified: "Verified",
    },
    lpLockSection: {
      title: "Liquidity Lock",
      provider: "Uncx Network",
      duration: "Locked for 1 Year",
      desc: "LP tokens are locked via Uncx. The founder cannot withdraw liquidity during the lock period. Verifiable on-chain by anyone.",
      viewLock: "View Lock Record",
    },
  },

  // ─── 邀請 ─────────────────────────────────────────────
  invite: {
    successCount: "Successful Referrals",
    totalCount: "Total Invited",
    linkTitle: "Your Invite Link",
    linkDesc: "A friend who successfully claims via your link counts as a referral",
    copyBtn: "Copy Invite Link",
    copiedBtn: "Copied!",
    rulesTitle: "How It Works",
    rules: [
      "A friend must click your link and successfully complete a claim",
      "Your referral count is shown on your profile",
      "Referral count will be used for competitions and eligibility",
      "Each friend is counted once, regardless of repeat claims",
    ],
    recordTitle: "Referral History",
    noRecord: "No referrals yet — share your link!",
    statusSuccess: "Success",
    statusPending: "Pending",
  },

  // ─── 韭菜宣言 ─────────────────────────────────────────
  about: {
    hero: "Our Manifesto",
    heroSub: "Written by someone who got cut, for everyone who got cut",
    storyTitle: "My Story",
    missionTitle: "Our Mission",
    pledgeTitle: "Founder's Pledge",
    quote: '"I can\'t promise the price will go up. But I promise this project won\'t disappear."',
    founder: "— Jiucai Life Founder",
  },

  // ─── CoinPile ─────────────────────────────────────────
  coinPile: {
    label: "Current Prize Pool",
  },

  // ─── Telegram Notifications ───────────────────────────
  telegram: {
    alerts: {
      ethLow: "🔴 [URGENT] ETH Balance Low\nWallet: {wallet}\nBalance: {balance} ETH\nPlease top up to 0.1 ETH+",
      usdtInsufficient: "🔴 [URGENT] Prize Pool USDT Insufficient\nRequired: {required} USDT\nAvailable: {available} USDT\nPlease refill immediately",
      txFailed: "🔴 [URGENT] Transfer Failed\nTx: {txHash}\nRecipient: {recipient}\nReason: {reason}",
      contractError: "🔴 [URGENT] Contract Error\nMethod: {method}\nError: {error}",
      claimRetry: "🟡 [WARNING] Claim Transfer Retry Failed\nWallet: {wallet}\nAttempts: {attempts}",
      vrfTimeout: "🟡 [WARNING] Chainlink VRF Callback Timeout\nRequest ID: {requestId}\nWaited: {minutes} minutes",
      poolThreshold: "🔵 [INFO] Prize Pool Reached $10,000\nCurrent Total: ${total} USDT\n⚠️ Consider upgrading to Chainlink VRF",
      noWinScan: "🔵 [Daily Scan] 14-Day No-Win Holder List\n{count} holders need attention:\n{list}\nPlease decide on prize or card compensation.",
    },
    notifications: {
      drawReminder: "🎰 [Draw Announcement]\nJiucai Life — Round {round}\n📅 Draw Time: {date} {time} (UTC+8)\n💰 Pool: ${usdt} USDT · {jiucai} JIUCAI\n\nAll eligible holders are automatically entered. Hold longer = better odds!",
      drawResult: "🏆 [Draw Result] Round {round}\n{winners} lucky winners!\n💰 Total Prize: ${usdt} USDT · {jiucai} JIUCAI\n\nWinning wallets:\n{list}\n\nDidn't win? Keep holding — next round is yours! 💪",
      winNotice: "🎉 Congratulations! You won!\n\nYou are a winner in Round {round}!\nPrize: {prize}\nExpected delivery: within {eta}\n\nKeep holding — every round is a chance! 🌱",
      claimSuccess: "✅ Claim Approved\nWallet: {wallet}\nYou will receive: {amount} JIUCAI\nExpected delivery: within {eta}",
      claimRejected: "❌ Claim Rejected\nReason: {reason}\nFor questions, leave a message in the Vent section",
      inviteSuccess: "🎊 Referral Success!\nYour friend has completed their claim\nTotal successful referrals: {count}\n\nMore referrals = more advantages in future competitions!",
    },
    footer: "Time: {time}",
  },

  // ─── Landing / Home ───────────────────────────────────
  landing: {
    connect: "Connect Wallet",
    desc: "Enter your wallet address to continue",
    placeholder: "Enter wallet address 0x…",
    disconnect: "Logout",
  },
  home: {
    detail: "View Details",
  },
} as const;

export default en;
