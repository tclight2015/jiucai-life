import { useQuery } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

interface PoolData {
  usdt: number;
  jiucai: number;
}

const fetchPoolData = async (): Promise<PoolData> => {
  if (!API_BASE) {
    return { usdt: 0, jiucai: 0 };
  }
  try {
    const res = await fetch(`${API_BASE}/api/pool`);
    if (!res.ok) throw new Error("pool fetch failed");
    const data = await res.json();
    return {
      usdt: parseFloat(data.usdt ?? "0"),
      jiucai: parseFloat(data.jiucai ?? "0"),
    };
  } catch {
    return { usdt: 0, jiucai: 0 };
  }
};

export const usePoolData = () => {
  const { data } = useQuery({
    queryKey: ["pool"],
    queryFn: fetchPoolData,
    refetchInterval: 30000,
  });

  return {
    usdt: data?.usdt ?? 0,
    jiucai: data?.jiucai ?? 0,
  };
};
