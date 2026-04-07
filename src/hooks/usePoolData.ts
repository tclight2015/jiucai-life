import { useQuery } from "@tanstack/react-query";

// TODO: 替換為實際後端 API 位址
const API_BASE = "";

interface PoolData {
  usdt: number;
  jiucai: number;
}

const fetchPoolData = async (): Promise<PoolData> => {
  if (!API_BASE) {
    // 後端尚未就緒，回傳預設假資料
    return { usdt: 10000, jiucai: 5000 };
  }

  const res = await fetch(`${API_BASE}/api/pool`);
  if (!res.ok) throw new Error("Failed to fetch pool data");
  return res.json();
};

export const usePoolData = () => {
  const { data } = useQuery({
    queryKey: ["pool"],
    queryFn: fetchPoolData,
    refetchInterval: 30000, // 每 30 秒自動刷新
  });

  return {
    usdt: data?.usdt ?? 10000,
    jiucai: data?.jiucai ?? 5000,
  };
};
