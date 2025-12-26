'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Quote, Github, Info, Share2, History as HistoryIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const minerals = [
  { name: "帝王拓帕石 (Imperial Topaz)", theme: "#fb923c", image: "/minerals/01-imperial-topaz.webp", messages: ["展現您的自信，今天適合開啟新的寫作章節。", "溫暖的光芒正包圍著你，試著寫一段療癒人心的文字。", "看到這道橘光了嗎？那是代表『大橘已定』，晚餐就去吃大餐吧！"] },
  { name: "紫水晶 (Amethyst)", theme: "#a855f7", image: "/minerals/02-amethyst.webp", messages: ["內心平靜是創意的泉源，試著在安靜中尋找靈感。", "夢境是潛意識的訊息，今天就把昨晚的夢寫下來吧。", "紫水晶代表智慧，所以關於感情問題，我一率建議分手。"] },
  { name: "拉長石 (Labradorite)", theme: "#475569", image: "/minerals/03-labradorite.webp", messages: ["視角轉換會帶來驚喜，試著從反派的角度思考故事。", "平凡的外表下隱藏著閃光，今天去發現身邊被忽略的美。", "別被我的漂亮外表騙了，我內心戲比你的小說草稿還多。"] },
  { name: "粉晶 (Rose Quartz)", theme: "#f472b6", image: "/minerals/04-rose-quartz.webp", messages: ["創作不需要追求完美的無瑕，誠實面對自己的脆弱。", "多愛自己一點，您的文字溫度來自於您對生活的愛。", "雖然我是招桃花的粉晶，但建議你還是先去招財比較實際。"] },
  { name: "黑曜石 (Obsidian)", theme: "#18181b", image: "/minerals/05-obsidian.webp", messages: ["直視內心的恐懼，最深刻的故事往往隱藏在黑暗中。", "防護與接地，今天適合處理一些繁瑣但必要的基礎工作。", "我是黑曜石，這代表你的人生...目前也是一片漆黑呢（燦笑）。"] },
  { name: "海藍寶 (Aquamarine)", theme: "#7dd3fc", image: "/minerals/06-aquamarine.webp", messages: ["清澈的文字能洗滌心靈，嘗試用最簡潔的句子表達。", "像流水一樣順應時勢，有時候放棄抵抗反而會有出口。", "進度像大海一樣深不見底，這就是你現在的稿量嗎？"] },
  { name: "琥珀 (Amber)", theme: "#f59e0b", image: "/minerals/07-amber.webp", messages: ["將當下的情感封存，這將成為未來創作最珍貴的標本。", "歲月沉澱出的美麗，值得你花時間細細品味。", "這顆琥珀裡面封印的是...你上次說要改但一直沒改的 bug。"] },
  { name: "紅寶石 (Ruby)", theme: "#dc2626", image: "/minerals/08-ruby.webp", messages: ["燃燒您的熱情！今天適合寫一段讓讀者屏息的熱血情節。", "展現生命力，讓全世界看到你最耀眼的一面。", "紅寶石很貴，所以建議你：今天沒錢就乖乖待在家碼字。"] },
  { name: "翡翠 (Jade)", theme: "#16a34a", image: "/minerals/09-jade.webp", messages: ["穩定與平衡是長久創作的關鍵，別忘了適度休息。", "德行如玉，保持您的初衷，不要被外界的數字迷惑。", "翡翠代表長壽，這是在暗示你這本書要寫到兩百萬字嗎？"] },
  { name: "鑽石 (Diamond)", theme: "#ecfeff", image: "/minerals/10-diamond.webp", messages: ["壓力能產生最純淨的作品，堅持下去，光芒即將顯現。", "無堅不摧的意志，是完成長篇小說唯一的道路。", "鑽石恆久遠，你拖稿的理由也一樣恆久遠。"] },
  { name: "月光石 (Moonstone)", theme: "#e0e7ff", image: "/minerals/11-moonstone.webp", messages: ["跟隨直覺，有些情節不需要邏輯，只需要感覺。", "溫柔地對待周遭的人，你的柔和會化解衝突。", "月亮代表我的心，但你的薪水可能只有月亮的一半。"] },
  { name: "孔雀石 (Malachite)", theme: "#047857", image: "/minerals/12-malachite.webp", messages: ["勇敢刪除不再適合的舊草稿，舊的不去新的不來。", "面對改變，不要害怕轉行或嘗試新領域。", "我上面的條紋，跟我現在看你程式碼產生的皺眉紋一樣多。"] },
  { name: "螢石 (Fluorite)", theme: "#2dd4bf", image: "/minerals/13-fluorite.webp", messages: ["混亂中需要邏輯，今天適合整理您的靈感筆記。", "專注於當下，讓學習成為一種快樂。", "這不是螢石，這是你未來熬夜趕稿時發出的肝火。"] },
  { name: "黃水晶 (Citrine)", theme: "#facc15", image: "/minerals/14-citrine.webp", messages: ["喜悅能吸引好運，帶著笑容寫下的文字會有魔法。", "自信是成功的基石，相信你值得擁有財富。", "財運來了！快去買張樂透，雖然中獎機率比你準時交稿還低。"] },
  { name: "石榴石 (Garnet)", theme: "#7f1d1d", image: "/minerals/15-garnet.webp", messages: ["深沈的能量正在蓄積，好故事需要時間醞釀。", "保持忠誠與真實，對待工作與感情皆然。", "石榴石代表氣血，多喝熱水，少看前任的動態。"] },
  { name: "瑪瑙 (Agate)", theme: "#c2410c", image: "/minerals/16-agate.webp", messages: ["注意環境的小細節，細膩的描寫能讓世界更真實。", "緩慢而穩定地前進，不要跟別人的進度比較。", "人生就像瑪瑙，沒切開之前你都不知道自己多能撐。"] },
  { name: "紅紋石 (Rhodochrosite)", theme: "#f43f5e", image: "/minerals/17-rhodochrosite.webp", messages: ["誠實面對脆弱，真實的情感最能打動讀者。", "擁抱過去的傷口，它們是滋養創意的養分。", "別再問為什麼沒人愛你了，紅紋石建議你先去洗臉。"] },
  { name: "舒俱徠石 (Sugilite)", theme: "#6b21a8", image: "/minerals/18-sugilite.webp", messages: ["獨特的視角是您的天賦，不要為了迎合而改變。", "靈性成長需要時間，不要急於看到結果。", "這顏色很貴氣，可惜你的戶頭目前不太貴氣。"] },
  { name: "天河石 (Amazonite)", theme: "#5eead4", image: "/minerals/19-amazonite.webp", messages: ["勇敢跨越溝通障礙，試著寫一段精彩的對話吧。", "幸運來自於行動，不要只是坐在那裡空想。", "既然天河石都說要溝通了，那你就回一下訊息吧。"] },
  { name: "鈦晶 (Rutilated Quartz)", theme: "#fef08a", image: "/minerals/20-rutilated-quartz.webp", messages: ["看似無關的靈感即將串聯，保持思緒的開放。", "強大的能量正在運轉，今天適合處理大件任務。", "這就像你的頭髮，雖然亂，但裡面都是財富（？）"] },
  { name: "虎眼石 (Tiger's Eye)", theme: "#b45309", image: "/minerals/21-tigers-eye.webp", messages: ["拿出勇氣去冒險，給您的主角一個挑戰極限的機會。", "保持觀察力，洞察身邊每一個潛在的機會。", "眼睛放亮點！別再把渣男/渣女當成寶了。"] },
  { name: "黑瑪瑙 (Onyx)", theme: "#1c1917", image: "/minerals/22-onyx.webp", messages: ["自律是創作的基石，今天強迫自己寫下五百字吧。", "保持沈穩，外界的批評無法動搖你的根基。", "我是黑色的，因為我已經看透了你不想努力的心。"] },
  { name: "蛋白石 (Opal)", theme: "#e2e8f0", image: "/minerals/23-opal.webp", messages: ["捕捉那一瞬間閃過的色彩，靈感是變幻莫測的。", "展現多樣的面貌，不要被單一標籤給定義。", "我的火彩很美，你的未來...只要不懶也會很美。"] },
  { name: "橄欖石 (Peridot)", theme: "#84cc16", image: "/minerals/24-peridot.webp", messages: ["新生與希望正在發芽，適合為故事加入新角色。", "擺脫負面情緒，讓新的氣息進入你的生活。", "這顏色像極了你被老闆/甲方盯上的臉。"] },
  { name: "坦桑石 (Tanzanite)", theme: "#4f46e5", image: "/minerals/25-tanzanite.webp", messages: ["平衡感性與理性，能讓您的作品更有深度。", "探索未知的領域，在那裡你會找到真正的自己。", "罕見的礦石，送給罕見的、至今還在努力的你。"] },
  { name: "藍晶石 (Kyanite)", theme: "#60a5fa", image: "/minerals/26-kyanite.webp", messages: ["清理雜念，現在的您最適合專注於核心主題。", "喉輪的能量，試著把心裡的話大聲說出來。", "這像是一把藍色的劍，砍斷你那無意義的社交。"] },
  { name: "紅石英 (Red Jasper)", theme: "#b91c1c", image: "/minerals/27-red-jasper.webp", messages: ["腳踏實地，從最基礎的人物背景開始建構。", "體力是基礎，今天去運動一下換取創作能量。", "生活雖然辛苦，但紅石英建議你不要輕易認輸。"] },
  { name: "方解石 (Calcite)", theme: "#fed7aa", image: "/minerals/28-calcite.webp", messages: ["轉換角度看世界，死胡同裡也會有新的出口。", "學習新的技能，這會成為你未來的寫作素材。", "放輕鬆，就算這頁寫爛了也沒什麼大不了。"] },
  { name: "天青石 (Celestite)", theme: "#dbeafe", image: "/minerals/29-celestite.webp", messages: ["讓想像力飛向天際，今天適合構思科幻題材。", "平和的心境能招來好夢，今晚早點睡吧。", "天青色等煙雨，而我在等你的下一章更新。"] },
  { name: "黃鐵礦 (Pyrite)", theme: "#ca8a04", image: "/minerals/30-pyrite.webp", messages: ["看似平凡的事物也含有黃金，提煉日常的詩意。", "意志如鋼鐵般堅硬，不要被小挫折打敗。", "雖然我看起來像黃金，但我知道你不是在想黃金就是在想放假。"] },
  { name: "太陽石 (Sunstone)", theme: "#fdba74", messages: ["陽光是最好的動力，去戶外走走，靈感在空氣中。", "展現領導力，今天你就是自己生命的主角。", "充滿正能量的你，看起來就像個沒被工作摧殘過的新人。"] },
  { name: "綠松石 (Turquoise)", theme: "#06b6d4", messages: ["古老的智慧在呼喚，在故事中加入神話元素。", "旅途平安，今天適合安排一場說走就走的旅行。", "你是我的好朋友，但我還是建議你先去把碗洗了。"] },
  { name: "紫龍晶 (Charoite)", theme: "#581c87", messages: ["接受改變的恐懼，轉化它為作品中的衝突張力。", "深刻的洞察，讓你看到事情不為人知的一面。", "這顏色很魔幻，就像你至今還沒實現的暴富夢。"] },
  { name: "白水晶 (Clear Quartz)", theme: "#ffffff", messages: ["清空一切想法，最純粹的動機將會浮現。", "放大你的意念，專注於你真正想要達成的目標。", "你現在腦袋裡跟這顆水晶一樣，一片空白。"] },
  { name: "血石 (Bloodstone)", theme: "#064e3b", messages: ["意志力是您的盔甲，不要被一時的批評擊倒。", "找回身體的活力，你需要熱血沸騰的戰鬥感。", "流汗總比流淚好，所以快去運動或是寫稿！"] },
  { name: "珍珠 (Pearl)", theme: "#fff7ed", messages: ["痛苦的磨練終會成珠，珍惜那些流淚的經驗。", "內斂的光芒，不需要張揚也能被看見。", "珍珠代表優雅，請優雅地處理你那堆爛事。"] },
  { name: "葡萄石 (Prehnite)", theme: "#bbf7d0", messages: ["做足準備迎接未來，努力正在無聲無息積累。", "放下不需要的負擔，空間才能讓新東西進來。", "你以為這是葡萄？不，這是你這輩子吃不到的甜頭。"] },
  { name: "蘇打石 (Sodalite)", theme: "#1e3a8a", messages: ["邏輯推理的時刻，檢查故事邏輯是否有破綻。", "理性的溝通，勝過感性的咆哮。", "大腦是個好東西，蘇打石希望你有帶出門。"] },
  { name: "鋰雲母 (Lepidolite)", theme: "#d8b4fe", messages: ["緩解焦慮，今天不強求進度，只求寫得舒心。", "過渡時期的平靜，接受現狀也是一種前進。", "焦慮也沒用，反正明天事情還是做不完。"] },
  { name: "透輝石 (Diopside)", theme: "#065f46", messages: ["連結大自然，描述一場與森林或土地的對話。", "心靈的治癒，從放過自己開始。", "綠色的光芒，提醒你：該綠的是草地，不是你的頭。"] },
  { name: "鋯石 (Zircon)", theme: "#0e7490", messages: ["提升作品質感，今天適合進行細微的修辭打磨。", "光芒四射，不要隱藏你的才華。", "我是鋯石，不是鑽石，就像你的草稿還不是成品。"] },
  { name: "黝簾石 (Anyolite)", theme: "#22c55e", messages: ["生命力與熱情結合，創造一個充滿活力的新場景。", "面對衝突，用熱情去化解冷漠。", "紅配綠，這美感我真的看不懂。"] },
  { name: "尖晶石 (Spinel)", theme: "#ef4444", messages: ["重生與更新，賦予舊角色一個意想不到的身分。", "在壓力下展現韌性，你比想像中更強大。", "別再尖叫了，尖晶石建議你先閉嘴寫稿。"] },
  { name: "青金石 (Azurite)", theme: "#1d4ed8", messages: ["洞察力覺醒，看穿事情本質，寫出更有洞見的對白。", "深度冥想，讓思緒進入更深層的空間。", "你的眼界決定了你的世界，還有你的存款金額。"] },
  { name: "捷克隕石 (Moldavite)", theme: "#064e3b", messages: ["打破常規，寫一段完全不像您的文字！", "快速的轉變，抓住那股來自天外的推動力。", "來自外星的叮嚀：地球很危險，快回火星吧。"] },
  { name: "孔賽石 (Kunzite)", theme: "#fce7f3", messages: ["無條件的愛，對待筆下的角色多一點同理心。", "情緒的流動，讓悲傷也能化為美麗的詩篇。", "愛可以發電，但不能幫你付房租。"] },
  { name: "海紋石 (Larimar)", theme: "#bfdbfe", messages: ["感受海洋的寬廣，不要在小細節上鑽牛角尖。", "和平與寧靜，今天適合放慢腳步生活。", "這顏色像極了你想要去度假，但現實不允許的心情。"] },
  { name: "赤鐵礦 (Hematite)", theme: "#52525b", messages: ["專注當下，把發散的思緒全部收回來。", "勇氣的守護，不要怕別人的閒言閒語。", "我是鐵，你是廢鐵，我們合起來就是鐵定廢。"] },
  { name: "藍玉髓 (Blue Chalcedony)", theme: "#93c5fd", messages: ["柔和的溝通，讓讀者感受到文字中的善意。", "傾聽內心的聲音，那是你創作最真實的來源。", "別說了，藍玉髓覺得你現在說什麼都是廢話。"] },
  { name: "黑星石 (Black Star)", theme: "#000000", messages: ["在黑暗中定位，您的核心價值會指引故事走向。", "沈穩的領導力，今天你說了算。", "星星在黑夜才閃亮，所以你現在慘一點也是正常的。"] }
];

export default function Home() {
  const [selectedMineral, setSelectedMineral] = useState(minerals[0]);
  const [selectedMessage, setSelectedMessage] = useState(minerals[0].messages[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [history, setHistory] = useState<typeof minerals>([]);

  const drawFortune = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const randomMineral = minerals[Math.floor(Math.random() * minerals.length)];
      const randomMsgIndex = Math.floor(Math.random() * 3);
      setSelectedMineral(randomMineral);
      setSelectedMessage(randomMineral.messages[randomMsgIndex]);
      setHistory(prev => [randomMineral, ...prev].slice(0, 8));
      setIsSpinning(false);
    }, 1000);
  };

  const copyToClipboard = () => {
    const text = `【${selectedMineral.name} 指引】\n"${selectedMessage}"`;
    navigator.clipboard.writeText(text);
    // 這裡可以加入簡單的提示
  };

  return (
    <div className="relative h-[100dvh] flex flex-col overflow-hidden bg-[#09090b] text-white">
      {/* 動態背景 */}
      <div
        className="absolute inset-0 transition-colors duration-1000 -z-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${selectedMineral.theme}15 0%, #09090b 80%)`
        }}
      />

      <header className="px-6 py-4 flex justify-between items-center z-50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <span className="font-black tracking-tight text-sm">LITHOS</span>
        </div>
        <div className="flex items-center gap-3">
          <Github className="w-4 h-4 text-zinc-600" />
          <Info className="w-4 h-4 text-zinc-600" />
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 gap-8 md:gap-16 min-h-0">

        {/* 礦石球 */}
        <div className="relative shrink-0 flex items-center justify-center">
          <motion.div
            key={selectedMineral.name}
            animate={{
              rotate: isSpinning ? 360 : 0,
              scale: isSpinning ? 0.8 : 1
            }}
            transition={{ type: "spring", stiffness: 100 }}
            className="z-10 text-white"
          >
            <div
              className="w-48 h-48 md:w-80 md:h-80 rounded-3xl glass-panel flex items-center justify-center animate-float relative overflow-hidden"
              style={{
                boxShadow: `0 0 60px ${selectedMineral.theme}33`,
                background: `linear-gradient(135deg, ${selectedMineral.theme}44 0%, transparent 100%)`
              }}
            >
              <div className="w-full h-full absolute inset-0 blur-2xl opacity-20" style={{ backgroundColor: selectedMineral.theme }} />
              {/* Image if available, otherwise Sparkles fallback */}
              {selectedMineral.image ? (
                <div className="relative w-3/4 h-3/4">
                  <Image
                    src={selectedMineral.image}
                    alt={selectedMineral.name}
                    fill
                    className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] filter contrast-125 saturate-110"
                    priority
                  />
                </div>
              ) : (
                <Sparkles className="w-16 h-16 md:w-32 md:h-32 opacity-10 filter blur-[2px]" />
              )}
            </div>
          </motion.div>

          {/* Orbit Rings (Squared to match) */}
          <div className="absolute inset-[-20%] border border-white/5 rounded-[3rem] -z-10 animate-[spin_15s_linear_infinite]" />
          <div className="absolute inset-[-40%] border border-white/5 rounded-[4rem] -z-10 animate-[spin_25s_linear_infinite_reverse] opacity-50" />
        </div>

        {/* 結果卡片 */}
        <div className="flex flex-col gap-6 w-full max-w-lg shrink min-h-0">
          <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4 relative overflow-hidden flex flex-col">
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">Current Gem</span>
              <h2 className="text-xl md:text-3xl font-bold font-serif italic text-white truncate">
                {selectedMineral.name}
              </h2>
            </div>

            <div className="flex-1 min-h-[100px] flex items-center">
              <AnimatePresence mode="wait">
                {!isSpinning ? (
                  <motion.p
                    key={selectedMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg md:text-2xl font-medium leading-relaxed text-zinc-200"
                  >
                    "{selectedMessage}"
                  </motion.p>
                ) : (
                  <div className="w-full space-y-2">
                    <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-start">
              <button
                onClick={copyToClipboard}
                className="text-[10px] font-bold text-zinc-600 flex items-center gap-1 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                <Share2 size={12} /> COPY TEXT
              </button>
            </div>
          </div>

          <button
            onClick={drawFortune}
            disabled={isSpinning}
            className="
              relative group py-4 px-8 bg-white text-black rounded-xl font-black text-base
              hover:scale-[1.02] active:scale-95 transition-all w-full
              disabled:opacity-50 flex items-center justify-center gap-2 overflow-hidden
            "
          >
            {isSpinning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{isSpinning ? "感知中..." : "獲取今日指引"}</span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
        </div >
      </main >

      <footer className="px-6 py-4 flex flex-col gap-3 shrink-0 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <HistoryIcon size={12} className="text-zinc-600" />
          <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">Recent Archetypes</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {history.length > 0 ? history.map((h, i) => (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={`${h.name}-${i}`}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 shrink-0"
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: h.theme }} />
              <span className="text-[10px] font-bold text-zinc-400 whitespace-nowrap uppercase">{h.name.split(' ')[0]}</span>
            </motion.div>
          )) : (
            <span className="text-[10px] text-zinc-800 font-bold uppercase tracking-widest italic text-zinc-700">Waiting for your first draw...</span>
          )}
        </div>
      </footer>
    </div >
  );
}