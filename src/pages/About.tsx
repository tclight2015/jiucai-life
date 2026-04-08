import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";
import charSide from "@/assets/char-side.png";

const About = () => {
  const { t } = useTranslation();
  return (
    <PageLayout>
      <div className="flex flex-col items-center mb-8">
        <img src={charSide} alt="founder" className="w-32 h-32 object-contain mb-4" />
        <h2 className="text-xl font-bold text-foreground">{t("about.hero")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("about.heroSub")}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <h3 className="text-sm font-bold text-foreground mb-3">{t("about.storyTitle")}</h3>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>2021 年，我把積蓄投進了一個「潛力幣」，那個幣的合約方消失了。我損失了好幾萬。</p>
          <p>我沒有哭，但我很久沒睡好覺。我一直在想：如果有人能讓我感覺到「有人在乎」，會不會就沒那麼難受。</p>
          <p>所以我做了這個項目。我沒有辦法把你的錢還回來，但我可以把自己賺到的一部分，分給那些還在這裡撐著的人。</p>
          <p>這裡不是騙局，不是跑路的前兆。我的持幣全部鎖倉，賣出的每一分稅金都會進獎金池。你可以看到，可以驗證，可以罵我。</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <h3 className="text-sm font-bold text-foreground mb-3">{t("about.missionTitle")}</h3>
        <div className="space-y-3">
          {[
            { icon: "🫀", title: "真實的共鳴", desc: "這裡不賣夢想，只說實話。被割過的感受，我懂。" },
            { icon: "🔒", title: "透明可驗證", desc: "合約公開，創辦人持幣鎖倉，獎池資金來源清晰。" },
            { icon: "💸", title: "持幣就有機會", desc: "每週抽獎，持幣愈久愈多，回血機率愈高。" },
            { icon: "🤝", title: "社群優先", desc: "所有功能以幫助韭菜回血為核心出發，不是為了炒作。" },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-primary/40 bg-primary/5 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-primary mb-3">{t("about.pledgeTitle")}</h3>
        <div className="space-y-2 text-sm text-foreground/80 leading-relaxed">
          <p>✦ 創辦人持有的 JIUCAI 全數鎖倉，不提前解鎖</p>
          <p>✦ 合約稅收的 100% 進入社群獎金池</p>
          <p>✦ 每週開獎，結果公開，不黑箱</p>
          <p>✦ 如果我跑路，合約可查，鏈上為憑</p>
        </div>
        <div className="mt-4 border-t border-primary/20 pt-4">
          <p className="text-xs text-muted-foreground italic">{t("about.quote")}</p>
          <p className="text-xs text-primary font-semibold mt-1">{t("about.founder")}</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
