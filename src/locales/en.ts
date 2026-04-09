const en = {
  // ─── App ──────────────────────────────────────────────
  app: {
    title: "THE DEGEN'S REVENGE DIARY",
    subtitle: "EVERYONE WHO GOT RUGGED IS HERE.",
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
    countdown: "Next Draw Countdown (UTC+8)",
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
    intro: "Plan ahead and stack your cards. You have until 12:00 PM (Noon) on draw days to boost your position.",
    upcoming: "Current Round Info (UTC+8)",
    flowTitle: "The Draw Roadmap",
    boostTitle: "Boost Your Odds",
    boostDesc: "The more you hold, the higher your rank, the bigger your Weighting Multiplier. Any buys made before the 12:00 PM Snapshot on draw days are valid. DO NOT SELL. Selling your bags results in immediate disqualification.",
    history: "Historical Records",
    winnerCount: "{{count}} winners",
    walletQuery: "Wallet Checker",
    walletPlaceholder: "Enter wallet address 0x…",
    noRecord: "No win records for this address",
    qualify: "Eligibility",
  },

  // ─── 規則 ─────────────────────────────────────────────
  rules: {
    noRegister: "No Registration Required. Hold to Enter.",
    formula: "The Final Weight Formula",
    formulaDesc: "Each holder's lottery tickets are calculated by:",
    formulaExpr: "FinalWeight = BaseTickets × TierMultiplier × LoyaltyMultiplier × CardBoost",
    formulaNote: "Base tickets = 1. More tickets = higher win probability.",
    rankTable: "Holding Tier Multipliers",
    timeTable: "Loyalty (Holding Time) Multiplier",
    cards: "Inventory Card Boosts",
    cardsDesc: "Cards can be activated on your Profile page. They are consumed automatically after each raffle. Stay tuned for new card types. Multiple cards stack multiplicatively — e.g. two ×2 cards = 4x card weight.",
    examples: "Calculation Examples",
    activityModules: "Raffle Modules",
    randomness: "Verifiable Randomness",
    randomnessDesc: "We use Block Hashes as our random seed. The specific block number is announced before the draw. Anyone can verify the results on-chain. Don't Trust, Verify.",
    doNotSell: "DO NOT SELL.",
    doNotSellDesc: "Consider this a friendly warning; your future self will thank you. The bags you dump today could have been next week's jackpot.",
  },

  // ─── 索幣 ─────────────────────────────────────────────
  claim: {
    headline: "Been Rugged or Dumped On? Claim Your JIUCAI Airdrop Now.",
    headlineDesc: "Upload your loss screenshots — the bigger the REKKT, the bigger the bag. This is our way of making it right. This is your ticket to the revolution.",
    tiers: "Claim Tiers",
    stepsTitle: "How to Claim",
    termsTitle: "Key Terms",
    faqTitle: "FAQ",
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
    queued: "Daily limit reached — your request has been queued",
    queuedDays: "Estimated delivery: {{days}} day(s) from now (UTC+8)",
  },

  // ─── 回血牆 ───────────────────────────────────────────
  recovery: {
    title: "I SWEAR, I'M RECOVERING.",
    desc: "Every screenshot is proof. Every payout is real. What others rugged, we return. Draining the prize pool back to you isn't just a goal — it's the core mission of The Degen's Revenge Diary.",
    helped: "People Helped",
    totalReturned: "Total USDT Returned",
    howTitle: "HOW TO SUBMIT",
    importantTitle: "IMPORTANT NOTES",
    wallTitle: "THE WALL OF RECOVERY",
    verifyBtn: "Verify Original",
  },

  // ─── 吐槽區 ───────────────────────────────────────────
  chat: {
    title: "Speak Up. No Censorship Here.",
    subtitle: "Complaining about small prize pools? Say it. Want to roast the centralized exchanges? Say it. Whatever is on your mind, this is your safe haven.",
    rulesTitle: "Rules of Engagement",
    officialTag: "🌿 OFFICIAL",
    placeholder: "Say what's on your mind…",
  },

  // ─── 排行榜 ───────────────────────────────────────────
  leaderboard: {
    title: "Who Has the God-Tier Luck?",
    subtitle: "Ranking the legends who have claimed the most rewards. No TA needed. No insider connections. Just pure luck and the iron will to HODL.",
    winCount: "{{count}} wins",
    yourRank: "YOUR RANKING",
    yourRankDesc: "Connect your wallet to see your position",
    reminder: "Hold to stay eligible. If you dump, you're out of the game.",
  },

  // ─── 代幣 ─────────────────────────────────────────────
  token: {
    contract: "Contract Address",
    info: "General Information",
    taxTitle: "Transaction Tax",
    taxDesc: "Tax Allocation: 2% to Prize Pool · 2% to Liquidity Pool (LP) · 2% to Operational Fund",
    allocation: "Token Allocation",
    vesting: "Vesting & Lock-up",
    links: "Trading & Links",
    declaration: "Special Declaration",
    declarationDesc: "$JIUCAI will NEVER list on a CEX.\nCentralized Exchanges are nothing but slaughterhouses — we refuse to feed you to the wolves.",
    fields: {
      name: "Token Name",
      symbol: "Symbol",
      chain: "Network",
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
      duration: "Locked until: (to be filled after deployment)",
      desc: "The Liquidity Pool (LP) is locked, meaning the founder cannot pull the liquidity. This is the ultimate Rug-Proof guarantee. Anyone can verify this on-chain.",
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
    tagline: "Reclaiming What Was Rugged. We're Paying You Back.",
    noRegister: "No Whitelist. No Bullshit. Just Hold to Earn.",
    pledgeTitle: "Our Manifesto",
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
    footer: "Time: {time} (UTC+8)",
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
