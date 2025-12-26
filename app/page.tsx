'use client';

import { useState, useEffect } from "react";

// 定義 50 種礦石及其三種不同類型的小語
const minerals = [
  { name: "帝王拓帕石 (Imperial Topaz)", color: "bg-orange-400", messages: ["展現您的自信，今天適合開啟新的寫作章節。", "溫暖的光芒正包圍著你，試著寫一段療癒人心的文字。", "看到這道橘光了嗎？那是代表『大橘已定』，晚餐就去吃大餐吧！"] },
  { name: "紫水晶 (Amethyst)", color: "bg-purple-500", messages: ["內心平靜是創意的泉源，試著在安靜中尋找靈感。", "夢境是潛意識的訊息，今天就把昨晚的夢寫下來吧。", "紫水晶代表智慧，所以關於感情問題，我一率建議分手。"] },
  { name: "拉長石 (Labradorite)", color: "bg-slate-600", messages: ["視角轉換會帶來驚喜，試著從反派的角度思考故事。", "平凡的外表下隱藏著閃光，今天去發現身邊被忽略的美。", "別被我的漂亮外表騙了，我內心戲比你的小說草稿還多。"] },
  { name: "粉晶 (Rose Quartz)", color: "bg-pink-300", messages: ["創作不需要追求完美的無瑕，誠實面對自己的脆弱。", "多愛自己一點，您的文字溫度來自於您對生活的愛。", "雖然我是招桃花的粉晶，但建議你還是先去招財比較實際。"] },
  { name: "黑曜石 (Obsidian)", color: "bg-zinc-900", messages: ["直視內心的恐懼，最深刻的故事往往隱藏在黑暗中。", "防護與接地，今天適合處理一些繁瑣但必要的基礎工作。", "我是黑曜石，這代表你的人生...目前也是一片漆黑呢（燦笑）。"] },
  { name: "海藍寶 (Aquamarine)", color: "bg-sky-300", messages: ["清澈的文字能洗滌心靈，嘗試用最簡潔的句子表達。", "像流水一樣順應時勢，有時候放棄抵抗反而會有出口。", "進度像大海一樣深不見底，這就是你現在的稿量嗎？"] },
  { name: "琥珀 (Amber)", color: "bg-amber-500", messages: ["將當下的情感封存，這將成為未來創作最珍貴的標本。", "歲月沉澱出的美麗，值得你花時間細細品味。", "這顆琥珀裡面封印的是...你上次說要改但一直沒改的 bug。"] },
  { name: "紅寶石 (Ruby)", color: "bg-red-600", messages: ["燃燒您的熱情！今天適合寫一段讓讀者屏息的熱血情節。", "展現生命力，讓全世界看到你最耀眼的一面。", "紅寶石很貴，所以建議你：今天沒錢就乖乖待在家碼字。"] },
  { name: "翡翠 (Jade)", color: "bg-green-600", messages: ["穩定與平衡是長久創作的關鍵，別忘了適度休息。", "德行如玉，保持您的初衷，不要被外界的數字迷惑。", "翡翠代表長壽，這是在暗示你這本書要寫到兩百萬字嗎？"] },
  { name: "鑽石 (Diamond)", color: "bg-cyan-50", messages: ["壓力能產生最純淨的作品，堅持下去，光芒即將顯現。", "無堅不摧的意志，是完成長篇小說唯一的道路。", "鑽石恆久遠，你拖稿的理由也一樣恆久遠。"] },
  { name: "月光石 (Moonstone)", color: "bg-indigo-100", messages: ["跟隨直覺，有些情節不需要邏輯，只需要感覺。", "溫柔地對待周遭的人，你的柔和會化解衝突。", "月亮代表我的心，但你的薪水可能只有月亮的一半。"] },
  { name: "孔雀石 (Malachite)", color: "bg-emerald-700", messages: ["勇敢刪除不再適合的舊草稿，舊的不去新的不來。", "面對改變，不要害怕轉行或嘗試新領域。", "我上面的條紋，跟我現在看你程式碼產生的皺眉紋一樣多。"] },
  { name: "螢石 (Fluorite)", color: "bg-teal-400", messages: ["混亂中需要邏輯，今天適合整理您的靈感筆記。", "專注於當下，讓學習成為一種快樂。", "這不是螢石，這是你未來熬夜趕稿時發出的肝火。"] },
  { name: "黃水晶 (Citrine)", color: "bg-yellow-400", messages: ["喜悅能吸引好運，帶著笑容寫下的文字會有魔法。", "自信是成功的基石，相信你值得擁有財富。", "財運來了！快去買張樂透，雖然中獎機率比你準時交稿還低。"] },
  { name: "石榴石 (Garnet)", color: "bg-red-900", messages: ["深沈的能量正在蓄積，好故事需要時間醞釀。", "保持忠誠與真實，對待工作與感情皆然。", "石榴石代表氣血，多喝熱水，少看前任的動態。"] },
  { name: "瑪瑙 (Agate)", color: "bg-orange-700", messages: ["注意環境的小細節，細膩的描寫能讓世界更真實。", "緩慢而穩定地前進，不要跟別人的進度比較。", "人生就像瑪瑙，沒切開之前你都不知道自己多能撐。"] },
  { name: "紅紋石 (Rhodochrosite)", color: "bg-rose-400", messages: ["誠實面對脆弱，真實的情感最能打動讀者。", "擁抱過去的傷口，它們是滋養創意的養分。", "別再問為什麼沒人愛你了，紅紋石建議你先去洗臉。"] },
  { name: "舒俱徠石 (Sugilite)", color: "bg-purple-800", messages: ["獨特的視角是您的天賦，不要為了迎合而改變。", "靈性成長需要時間，不要急於看到結果。", "這顏色很貴氣，可惜你的戶頭目前不太貴氣。"] },
  { name: "天河石 (Amazonite)", color: "bg-teal-300", messages: ["勇敢跨越溝通障礙，試著寫一段精彩的對話吧。", "幸運來自於行動，不要只是坐在那裡空想。", "既然天河石都說要溝通了，那你就回一下訊息吧。"] },
  { name: "鈦晶 (Rutilated Quartz)", color: "bg-yellow-200", messages: ["看似無關的靈感即將串聯，保持思緒的開放。", "強大的能量正在運轉，今天適合處理大件任務。", "這就像你的頭髮，雖然亂，但裡面都是財富（？）"] },
  { name: "虎眼石 (Tiger's Eye)", color: "bg-amber-700", messages: ["拿出勇氣去冒險，給您的主角一個挑戰極限的機會。", "保持觀察力，洞察身邊每一個潛在的機會。", "眼睛放亮點！別再把渣男/渣女當成寶了。"] },
  { name: "黑瑪瑙 (Onyx)", color: "bg-stone-900", messages: ["自律是創作的基石，今天強迫自己寫下五百字吧。", "保持沈穩，外界的批評無法動搖你的根基。", "我是黑色的，因為我已經看透了你不想努力的心。"] },
  { name: "蛋白石 (Opal)", color: "bg-slate-200", messages: ["捕捉那一瞬間閃過的色彩，靈感是變幻莫測的。", "展現多樣的面貌，不要被單一標籤給定義。", "我的火彩很美，你的未來...只要不懶也會很美。"] },
  { name: "橄欖石 (Peridot)", color: "bg-lime-500", messages: ["新生與希望正在發芽，適合為故事加入新角色。", "擺脫負面情緒，讓新的氣息進入你的生活。", "這顏色像極了你被老闆/甲方盯上的臉。"] },
  { name: "坦桑石 (Tanzanite)", color: "bg-indigo-600", messages: ["平衡感性與理性，能讓您的作品更有深度。", "探索未知的領域，在那裡你會找到真正的自己。", "罕見的礦石，送給罕見的、至今還在努力的你。"] },
  { name: "藍晶石 (Kyanite)", color: "bg-blue-400", messages: ["清理雜念，現在的您最適合專注於核心主題。", "喉輪的能量，試著把心裡的話大聲說出來。", "這像是一把藍色的劍，砍斷你那無意義的社交。"] },
  { name: "紅石英 (Red Jasper)", color: "bg-red-700", messages: ["腳踏實地，從最基礎的人物背景開始建構。", "體力是基礎，今天去運動一下換取創作能量。", "生活雖然辛苦，但紅石英建議你不要輕易認輸。"] },
  { name: "方解石 (Calcite)", color: "bg-orange-200", messages: ["轉換角度看世界，死胡同裡也會有新的出口。", "學習新的技能，這會成為你未來的寫作素材。", "放輕鬆，就算這頁寫爛了也沒什麼大不了。"] },
  { name: "天青石 (Celestite)", color: "bg-blue-100", messages: ["讓想像力飛向天際，今天適合構思科幻題材。", "平和的心境能招來好夢，今晚早點睡吧。", "天青色等煙雨，而我在等你的下一章更新。"] },
  { name: "黃鐵礦 (Pyrite)", color: "bg-yellow-600", messages: ["看似平凡的事物也含有黃金，提煉日常的詩意。", "意志如鋼鐵般堅硬，不要被小挫折打敗。", "雖然我看起來像黃金，但我知道你不是在想黃金就是在想放假。"] },
  { name: "太陽石 (Sunstone)", color: "bg-orange-300", messages: ["陽光是最好的動力，去戶外走走，靈感在空氣中。", "展現領導力，今天你就是自己生命的主角。", "充滿正能量的你，看起來就像個沒被工作摧殘過的新人。"] },
  { name: "綠松石 (Turquoise)", color: "bg-cyan-500", messages: ["古老的智慧在呼喚，在故事中加入神話元素。", "旅途平安，今天適合安排一場說走就走的旅行。", "你是我的好朋友，但我還是建議你先去把碗洗了。"] },
  { name: "紫龍晶 (Charoite)", color: "bg-purple-900", messages: ["接受改變的恐懼，轉化它為作品中的衝突張力。", "深刻的洞察，讓你看到事情不為人知的一面。", "這顏色很魔幻，就像你至今還沒實現的暴富夢。"] },
  { name: "白水晶 (Clear Quartz)", color: "bg-white", messages: ["清空一切想法，最純粹的動機將會浮現。", "放大你的意念，專注於你真正想要達成的目標。", "你現在腦袋裡跟這顆水晶一樣，一片空白。"] },
  { name: "血石 (Bloodstone)", color: "bg-green-900", messages: ["意志力是您的盔甲，不要被一時的批評擊倒。", "找回身體的活力，你需要熱血沸騰的戰鬥感。", "流汗總比流淚好，所以快去運動或是寫稿！"] },
  { name: "珍珠 (Pearl)", color: "bg-orange-50", messages: ["痛苦的磨練終會成珠，珍惜那些流淚的經驗。", "內斂的光芒，不需要張揚也能被看見。", "珍珠代表優雅，請優雅地處理你那堆爛事。"] },
  { name: "葡萄石 (Prehnite)", color: "bg-green-200", messages: ["做足準備迎接未來，努力正在無聲無息積累。", "放下不需要的負擔，空間才能讓新東西進來。", "你以為這是葡萄？不，這是你這輩子吃不到的甜頭。"] },
  { name: "蘇打石 (Sodalite)", color: "bg-blue-900", messages: ["邏輯推理的時刻，檢查故事邏輯是否有破綻。", "理性的溝通，勝過感性的咆哮。", "大腦是個好東西，蘇打石希望你有帶出門。"] },
  { name: "鋰雲母 (Lepidolite)", color: "bg-purple-300", messages: ["緩解焦慮，今天不強求進度，只求寫得舒心。", "過渡時期的平靜，接受現狀也是一種前進。", "焦慮也沒用，反正明天事情還是做不完。"] },
  { name: "透輝石 (Diopside)", color: "bg-green-800", messages: ["連結大自然，描述一場與森林或土地的對話。", "心靈的治癒，從放過自己開始。", "綠色的光芒，提醒你：該綠的是草地，不是你的頭。"] },
  { name: "鋯石 (Zircon)", color: "bg-cyan-700", messages: ["提升作品質感，今天適合進行細微的修辭打磨。", "光芒四射，不要隱藏你的才華。", "我是鋯石，不是鑽石，就像你的草稿還不是成品。"] },
  { name: "黝簾石 (Anyolite)", color: "bg-green-500", messages: ["生命力與熱情結合，創造一個充滿活力的新場景。", "面對衝突，用熱情去化解冷漠。", "紅配綠，這美感我真的看不懂。"] },
  { name: "尖晶石 (Spinel)", color: "bg-red-500", messages: ["重生與更新，賦予舊角色一個意想不到的身分。", "在壓力下展現韌性，你比想像中更強大。", "別再尖叫了，尖晶石建議你先閉嘴寫稿。"] },
  { name: "青金石 (Azurite)", color: "bg-blue-700", messages: ["洞察力覺醒，看穿事情本質，寫出更有洞見的對白。", "深度冥想，讓思緒進入更深層的空間。", "你的眼界決定了你的世界，還有你的存款金額。"] },
  { name: "捷克隕石 (Moldavite)", color: "bg-emerald-900", messages: ["打破常規，寫一段完全不像您的文字！", "快速的轉變，抓住那股來自天外的推動力。", "來自外星的叮嚀：地球很危險，快回火星吧。"] },
  { name: "孔賽石 (Kunzite)", color: "bg-pink-100", messages: ["無條件的愛，對待筆下的角色多一點同理心。", "情緒的流動，讓悲傷也能化為美麗的詩篇。", "愛可以發電，但不能幫你付房租。"] },
  { name: "海紋石 (Larimar)", color: "bg-blue-200", messages: ["感受海洋的寬廣，不要在小細節上鑽牛角尖。", "和平與寧靜，今天適合放慢腳步生活。", "這顏色像極了你想要去度假，但現實不允許的心情。"] },
  { name: "赤鐵礦 (Hematite)", color: "bg-zinc-600", messages: ["專注當下，把發散的思緒全部收回來。", "勇氣的守護，不要怕別人的閒言閒語。", "我是鐵，你是廢鐵，我們合起來就是鐵定廢。"] },
  { name: "藍玉髓 (Blue Chalcedony)", color: "bg-blue-300", messages: ["柔和的溝通，讓讀者感受到文字中的善意。", "傾聽內心的聲音，那是你創作最真實的來源。", "別說了，藍玉髓覺得你現在說什麼都是廢話。"] },
  { name: "黑星石 (Black Star)", color: "bg-black", messages: ["在黑暗中定位，您的核心價值會指引故事走向。", "沈穩的領導力，今天你說了算。", "星星在黑夜才閃亮，所以你現在慘一點也是正常的。"] },
];

export default function Home() {
  const [selectedMineral, setSelectedMineral] = useState(minerals[0]);
  const [selectedMessage, setSelectedMessage] = useState(minerals[0].messages[0]);
  const [isSpinning, setIsSpinning] = useState(false);

  // 點擊抽取邏輯
  const drawFortune = () => {
    setIsSpinning(true);
    
    setTimeout(() => {
      const randomMineral = minerals[Math.floor(Math.random() * minerals.length)];
      // 隨機選取 3 種小語中的一種
      const randomMsgIndex = Math.floor(Math.random() * 3);
      
      setSelectedMineral(randomMineral);
      setSelectedMessage(randomMineral.messages[randomMsgIndex]);
      setIsSpinning(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 font-sans dark:bg-zinc-950 transition-colors duration-700">
      <main className="flex flex-col items-center gap-12 text-center max-w-2xl w-full">
        
        {/* 標題區 */}
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
            礦石 x 創作 x 迷因
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium tracking-widest uppercase text-xs">
            50 Minerals / 150 Possible Inspirations
          </p>
        </div>

        {/* 礦石球體動畫 */}
        <div className="relative group">
          <div className={`
            w-64 h-64 rounded-full shadow-[0_0_60px_rgba(0,0,0,0.1)] 
            flex items-center justify-center transition-all duration-1000 ease-out transform
            ${isSpinning ? 'rotate-[1080deg] scale-50 blur-md' : 'rotate-0 scale-100'} 
            ${selectedMineral.color}
          `}>
             <div className="w-56 h-56 bg-white/25 rounded-full blur-2xl animate-pulse" />
          </div>
          {/* 裝飾背景 */}
          <div className="absolute -inset-4 bg-zinc-200/50 dark:bg-zinc-800/30 rounded-full -z-10 blur-2xl" />
        </div>

        {/* 結果展示區 */}
        <div className="flex flex-col gap-6 min-h-[160px] justify-center">
          <h2 className={`text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 transition-all duration-500 ${isSpinning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {selectedMineral.name}
          </h2>
          <div className={`relative px-6 py-4 transition-all duration-500 delay-200 ${isSpinning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <span className="absolute top-0 left-0 text-6xl text-zinc-200 dark:text-zinc-800 -z-10 select-none">“</span>
            <p className="text-zinc-600 dark:text-zinc-400 text-2xl font-semibold leading-relaxed italic">
              {selectedMessage}
            </p>
            <span className="absolute bottom-0 right-0 text-6xl text-zinc-200 dark:text-zinc-800 -z-10 select-none">”</span>
          </div>
        </div>

        {/* 互動按鈕 */}
        <button
          onClick={drawFortune}
          disabled={isSpinning}
          className="
            group relative px-12 py-5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 
            rounded-2xl font-black text-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] 
            transition-all active:scale-95 disabled:opacity-50 overflow-hidden
          "
        >
          <span className="relative z-10">{isSpinning ? "感應中..." : "獲取今日指引"}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
        </button>

      </main>

      {/* 頁尾 */}
      <footer className="mt-20 text-[10px] tracking-[0.3em] text-zinc-400 uppercase font-bold">
        Built with Next.js & Tailwind / Powered by Your Creativity
      </footer>
    </div>
  );
}