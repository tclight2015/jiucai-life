import { useEffect, useState } from "react";
import coinPileImg from "@/assets/coin-pile.png";
import { Skeleton } from "@/components/ui/skeleton";

interface CoinPileProps {
  amountU: number;
  amountJiucai: number;
  isLoading?: boolean;
}

const CoinPile = ({ amountU, amountJiucai, isLoading }: CoinPileProps) => {
  const [displayU, setDisplayU] = useState(0);
  const [displayJiucai, setDisplayJiucai] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      setDisplayU(Math.floor(amountU * eased));
      setDisplayJiucai(Math.floor(amountJiucai * eased));
      if (step >= steps) {
        clearInterval(timer);
        setDisplayU(amountU);
        setDisplayJiucai(amountJiucai);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [amountU, amountJiucai]);

  const totalValue = amountU + amountJiucai;
  const scale = Math.min(1.3, 0.7 + (totalValue / 50000) * 0.6);

  return (
    <div className="relative flex flex-col items-center">
      <div
        className="relative"
        style={{ transform: `scale(${scale})`, transition: "transform 0.5s ease" }}
      >
        <img
          src={coinPileImg}
          alt="金幣堆"
          width={280}
          height={180}
          className="w-52 md:w-72 h-auto drop-shadow-2xl"
        />
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm md:text-base text-muted-foreground mb-1">目前累計獎金</p>
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <span className="coin-amount">
              <span className="coin-number">{displayU.toLocaleString()}</span>
              <span className="coin-unit">U</span>
            </span>
            <span className="text-muted-foreground font-light">·</span>
            <span className="coin-amount">
              <span className="coin-number">{displayJiucai.toLocaleString()}</span>
              <span className="coin-unit">JIUCAI</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinPile;
