// Daily claim quota management
// Tracks submissions per day in localStorage; excess entries join a queue.

export const DAILY_LIMIT = 15; // configurable
const STORAGE_KEY = "jiucai-claims";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function getClaimsData(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function useDailyQuota() {
  const todayKey = getTodayKey();
  const data = getClaimsData();
  const todayCount = data[todayKey] ?? 0;

  // Over quota when today's count already reaches the limit
  const isOverQuota = todayCount >= DAILY_LIMIT;

  // How many days until this person's request gets processed.
  // Queue position among overflow: (count - limit + 1), processed DAILY_LIMIT per day.
  // +1 because today is already full → earliest is tomorrow.
  const queuePos = isOverQuota ? todayCount - DAILY_LIMIT + 1 : 0;
  const estimatedDays = isOverQuota ? Math.ceil(queuePos / DAILY_LIMIT) + 1 : 1;

  const recordClaim = () => {
    const fresh = getClaimsData();
    fresh[todayKey] = (fresh[todayKey] ?? 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  };

  return { isOverQuota, estimatedDays, recordClaim };
}
