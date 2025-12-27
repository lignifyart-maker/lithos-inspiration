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
  // 1-10
  { name: "帝王拓帕石 (Imperial Topaz)", theme: "#fb923c", image: "/minerals/01-imperial-topaz-v3.webp", messages: ["展現您的自信，今天適合開啟新的寫作章節。", "溫暖的光芒正包圍著你，試著寫一段療癒人心的文字。", "看到這道橘光了嗎？那是代表『大橘已定』，晚餐就去吃大餐吧！"] },
  { name: "紫水晶 (Amethyst)", theme: "#a855f7", image: "/minerals/02-amethyst.webp", messages: ["內心平靜是創意的泉源，試著在安靜中尋找靈感。", "夢境是潛意識的訊息，今天就把昨晚的夢寫下來吧。", "紫水晶代表智慧，所以關於感情問題，我一率建議分手。"] },
  { name: "拉長石 (Labradorite)", theme: "#475569", image: "/minerals/03-labradorite.webp", messages: ["視角轉換會帶來驚喜，試著從反派的角度思考故事。", "平凡的外表下隱藏著閃光，今天去發現身邊被忽略的美。", "別被我的漂亮外表騙了，我內心戲比你的小說草稿還多。"] },
  { name: "粉晶 (Rose Quartz)", theme: "#f472b6", image: "/minerals/04-rose-quartz.webp", messages: ["創作不需要追求完美的無瑕，誠實面對自己的脆弱。", "多愛自己一點，您的文字溫度來自於您對生活的愛。", "雖然我是招桃花的粉晶，但建議你還是先去招財比較實際。"] },
  { name: "黑曜石 (Obsidian)", theme: "#18181b", image: "/minerals/05-obsidian.webp", messages: ["直視內心的恐懼，最深刻的故事往往隱藏在黑暗中。", "防護與接地，今天適合處理一些繁瑣但必要的基礎工作。", "我是黑曜石，這代表你的人生...目前也是一片漆黑呢（燦笑）。"] },
  { name: "海藍寶 (Aquamarine)", theme: "#7dd3fc", image: "/minerals/06-aquamarine.webp", messages: ["清澈的文字能洗滌心靈，嘗試用最簡潔的句子表達。", "像流水一樣順應時勢，有時候放棄抵抗反而會有出口。", "進度像大海一樣深不見底，這就是你現在的稿量嗎？"] },
  { name: "琥珀 (Amber)", theme: "#f59e0b", image: "/minerals/07-amber.webp", messages: ["將當下的情感封存，這將成為未來創作最珍貴的標本。", "歲月沉澱出的美麗，值得你花時間細細品味。", "這顆琥珀裡面封印的是...你上次說要改但一直沒改的 bug。"] },
  { name: "紅寶石 (Ruby)", theme: "#dc2626", image: "/minerals/08-ruby.webp", messages: ["燃燒您的熱情！今天適合寫一段讓讀者屏息的熱血情節。", "展現生命力，讓全世界看到你最耀眼的一面。", "紅寶石很貴，所以建議你：今天沒錢就乖乖待在家碼字。"] },
  { name: "翡翠 (Jade)", theme: "#16a34a", image: "/minerals/09-jade.webp", messages: ["穩定與平衡是長久創作的關鍵，別忘了適度休息。", "德行如玉，保持您的初衷，不要被外界的數字迷惑。", "翡翠代表長壽，這是在暗示你這本書要寫到兩百萬字嗎？"] },
  { name: "鑽石 (Diamond)", theme: "#ecfeff", image: "/minerals/10-diamond.webp", messages: ["壓力能產生最純淨的作品，堅持下去，光芒即將顯現。", "無堅不摧的意志，是完成長篇小說唯一的道路。", "鑽石恆久遠，你拖稿的理由也一樣恆久遠。"] },
  // 11-20
  { name: "月光石 (Moonstone)", theme: "#e0e7ff", image: "/minerals/11-moonstone.webp", messages: ["跟隨直覺，有些情節不需要邏輯，只需要感覺。", "溫柔地對待周遭的人，你的柔和會化解衝突。", "月亮代表我的心，但你的薪水可能只有月亮的一半。"] },
  { name: "孔雀石 (Malachite)", theme: "#047857", image: "/minerals/12-malachite.webp", messages: ["勇敢刪除不再適合的舊草稿，舊的不去新的不來。", "面對改變，不要害怕轉行或嘗試新領域。", "我上面的條紋，跟我現在看你程式碼產生的皺眉紋一樣多。"] },
  { name: "螢石 (Fluorite)", theme: "#2dd4bf", image: "/minerals/13-fluorite.webp", messages: ["混亂中需要邏輯，今天適合整理您的靈感筆記。", "專注於當下，讓學習成為一種快樂。", "這不是螢石，這是你未來熬夜趕稿時發出的肝火。"] },
  { name: "黃水晶 (Citrine)", theme: "#facc15", image: "/minerals/14-citrine-v3.webp", messages: ["喜悅能吸引好運，帶著笑容寫下的文字會有魔法。", "自信是成功的基石，相信你值得擁有財富。", "財運來了！快去買張樂透，雖然中獎機率比你準時交稿還低。"] },
  { name: "石榴石 (Garnet)", theme: "#7f1d1d", image: "/minerals/15-garnet.webp", messages: ["深沈的能量正在蓄積，好故事需要時間醞釀。", "保持忠誠與真實，對待工作與感情皆然。", "石榴石代表氣血，多喝熱水，少看前任的動態。"] },
  { name: "瑪瑙 (Agate)", theme: "#c2410c", image: "/minerals/16-agate.webp", messages: ["注意環境的小細節，細膩的描寫能讓世界更真實。", "緩慢而穩定地前進，不要跟別人的進度比較。", "人生就像瑪瑙，沒切開之前你都不知道自己多能撐。"] },
  { name: "紅紋石 (Rhodochrosite)", theme: "#f43f5e", image: "/minerals/17-rhodochrosite.webp", messages: ["誠實面對脆弱，真實的情感最能打動讀者。", "擁抱過去的傷口，它們是滋養創意的養分。", "別再問為什麼沒人愛你了，紅紋石建議你先去洗臉。"] },
  { name: "舒俱徠石 (Sugilite)", theme: "#6b21a8", image: "/minerals/18-sugilite.webp", messages: ["獨特的視角是您的天賦，不要為了迎合而改變。", "靈性成長需要時間，不要急於看到結果。", "這顏色很貴氣，可惜你的戶頭目前不太貴氣。"] },
  { name: "天河石 (Amazonite)", theme: "#5eead4", image: "/minerals/19-amazonite.webp", messages: ["勇敢跨越溝通障礙，試著寫一段精彩的對話吧。", "幸運來自於行動，不要只是坐在那裡空想。", "既然天河石都說要溝通了，那你就回一下訊息吧。"] },
  { name: "鈦晶 (Rutilated Quartz)", theme: "#fef08a", image: "/minerals/20-rutilated-quartz.webp", messages: ["看似無關的靈感即將串聯，保持思緒的開放。", "強大的能量正在運轉，今天適合處理大件任務。", "這就像你的頭髮，雖然亂，但裡面都是財富（？）"] },
  // 21-30
  { name: "虎眼石 (Tiger's Eye)", theme: "#b45309", image: "/minerals/21-tigers-eye.webp", messages: ["拿出勇氣去冒險，給您的主角一個挑戰極限的機會。", "保持觀察力，洞察身邊每一個潛在的機會。", "眼睛放亮點！別再把渣男/渣女當成寶了。"] },
  { name: "黑瑪瑙 (Onyx)", theme: "#1c1917", image: "/minerals/22-onyx.webp", messages: ["自律是創作的基石，今天強迫自己寫下五百字吧。", "保持沈穩，外界的批評無法動搖你的根基。", "我是黑色的，因為我已經看透了你不想努力的心。"] },
  { name: "蛋白石 (Opal)", theme: "#e2e8f0", image: "/minerals/23-opal.webp", messages: ["捕捉那一瞬間閃過的色彩，靈感是變幻莫測的。", "展現多樣的面貌，不要被單一標籤給定義。", "我的火彩很美，你的未來...只要不懶也會很美。"] },
  { name: "橄欖石 (Peridot)", theme: "#84cc16", image: "/minerals/24-peridot.webp", messages: ["新生與希望正在發芽，適合為故事加入新角色。", "擺脫負面情緒，讓新的氣息進入你的生活。", "這顏色像極了你被老闆/甲方盯上的臉。"] },
  { name: "坦桑石 (Tanzanite)", theme: "#4f46e5", image: "/minerals/25-tanzanite.webp", messages: ["平衡感性與理性，能讓您的作品更有深度。", "探索未知的領域，在那裡你會找到真正的自己。", "罕見的礦石，送給罕見的、至今還在努力的你。"] },
  { name: "藍晶石 (Kyanite)", theme: "#60a5fa", image: "/minerals/26-kyanite.webp", messages: ["清理雜念，現在的您最適合專注於核心主題。", "喉輪的能量，試著把心裡的話大聲說出來。", "這像是一把藍色的劍，砍斷你那無意義的社交。"] },
  { name: "紅碧玉 (Red Jasper)", theme: "#b91c1c", image: "/minerals/27-red-jasper.webp", messages: ["腳踏實地，從最基礎的人物背景開始建構。", "體力是基礎，今天去運動一下換取創作能量。", "生活雖然辛苦，但紅碧玉建議你不要輕易認輸。"] },
  { name: "方解石 (Calcite)", theme: "#fed7aa", image: "/minerals/28-calcite.webp", messages: ["轉換角度看世界，死胡同裡也會有新的出口。", "學習新的技能，這會成為你未來的寫作素材。", "放輕鬆，就算這頁寫爛了也沒什麼大不了。"] },
  { name: "天青石 (Celestite)", theme: "#dbeafe", image: "/minerals/29-celestite.webp", messages: ["讓想像力飛向天際，今天適合構思科幻題材。", "平和的心境能招來好夢，今晚早點睡吧。", "天青色等煙雨，而我在等你的下一章更新。"] },
  { name: "黃鐵礦 (Pyrite)", theme: "#ca8a04", image: "/minerals/30-pyrite.webp", messages: ["看似平凡的事物也含有黃金，提煉日常的詩意。", "意志如鋼鐵般堅硬，不要被小挫折打敗。", "雖然我看起來像黃金，但我知道你不是在想黃金就是在想放假。"] },
  // 31-40
  { name: "太陽石 (Sunstone)", theme: "#fdba74", image: "/minerals/31-sunstone.webp", messages: ["陽光是最好的動力，去戶外走走，靈感在空氣中。", "展現領導力，今天你就是自己生命的主角。", "充滿正能量的你，看起來就像個沒被工作摧殘過的新人。"] },
  { name: "綠松石 (Turquoise)", theme: "#06b6d4", image: "/minerals/32-turquoise.webp", messages: ["古老的智慧在呼喚，在故事中加入神話元素。", "旅途平安，今天適合安排一場說走就走的旅行。", "你是我的好朋友，但我還是建議你先去把碗洗了。"] },
  { name: "紫龍晶 (Charoite)", theme: "#581c87", image: "/minerals/33-charoite.webp", messages: ["接受改變的恐懼，轉化它為作品中的衝突張力。", "深刻的洞察，讓你看到事情不為人知的一面。", "這顏色很魔幻，就像你至今還沒實現的暴富夢。"] },
  { name: "白水晶 (Clear Quartz)", theme: "#ffffff", image: "/minerals/34-clear-quartz.webp", messages: ["清空一切想法，最純粹的動機將會浮現。", "放大你的意念，專注於你真正想要達成的目標。", "你現在腦袋裡跟這顆水晶一樣，一片空白。"] },
  { name: "血石 (Bloodstone)", theme: "#064e3b", image: "/minerals/35-bloodstone.webp", messages: ["意志力是您的盔甲，不要被一時的批評擊倒。", "找回身體的活力，你需要熱血沸騰的戰鬥感。", "流汗總比流淚好，所以快去運動或是寫稿！"] },
  { name: "珍珠 (Pearl)", theme: "#fff7ed", image: "/minerals/36-pearl.webp", messages: ["痛苦的磨練終會成珠，珍惜那些流淚的經驗。", "內斂的光芒，不需要張揚也能被看見。", "珍珠代表優雅，請優雅地處理你那堆爛事。"] },
  { name: "葡萄石 (Prehnite)", theme: "#bbf7d0", image: "/minerals/37-prehnite.webp", messages: ["做足準備迎接未來，努力正在無聲無息積累。", "放下不需要的負擔，空間才能讓新東西進來。", "你以為這是葡萄？不，這是你這輩子吃不到的甜頭。"] },
  { name: "蘇打石 (Sodalite)", theme: "#1e3a8a", image: "/minerals/38-sodalite.webp", messages: ["邏輯推理的時刻，檢查故事邏輯是否有破綻。", "理性的溝通，勝過感性的咆哮。", "大腦是個好東西，蘇打石希望你有帶出門。"] },
  { name: "鋰雲母 (Lepidolite)", theme: "#d8b4fe", image: "/minerals/39-lepidolite.webp", messages: ["緩解焦慮，今天不強求進度，只求寫得舒心。", "過渡時期的平靜，接受現狀也是一種前進。", "焦慮也沒用，反正明天事情還是做不完。"] },
  { name: "透輝石 (Diopside)", theme: "#065f46", image: "/minerals/40-diopside.webp", messages: ["連結大自然，描述一場與森林或土地的對話。", "心靈的治癒，從放過自己開始。", "綠色的光芒，提醒你：該綠的是草地，不是你的頭。"] },
  // 41-50
  { name: "鋯石 (Zircon)", theme: "#0e7490", image: "/minerals/41-zircon.webp", messages: ["提升作品質感，今天適合進行細微的修辭打磨。", "光芒四射，不要隱藏你的才華。", "我是鋯石，不是鑽石，就像你的草稿還不是成品。"] },
  { name: "紅寶黝簾石 (Anyolite)", theme: "#22c55e", image: "/minerals/42-anyolite.webp", messages: ["生命力與熱情結合，創造一個充滿活力的新場景。", "面對衝突，用熱情去化解冷漠。", "紅配綠，這美感我真的看不懂。"] },
  { name: "尖晶石 (Spinel)", theme: "#ef4444", image: "/minerals/43-spinel.webp", messages: ["重生與更新，賦予舊角色一個意想不到的身分。", "在壓力下展現韌性，你比想像中更強大。", "別再尖叫了，尖晶石建議你先閉嘴寫稿。"] },
  { name: "藍銅礦 (Azurite)", theme: "#1e3a8a", image: "/minerals/44-azurite.webp", messages: ["開啟直覺力，相信你對故事走向的第一直覺。", "深層的智慧，答案其實早就藏在你心裡。", "藍到發黑，就像你熬夜寫稿的眼圈。"] },
  { name: "捷克隕石 (Moldavite)", theme: "#14532d", image: "/minerals/45-moldavite.webp", messages: ["來自宇宙的靈感，嘗試科幻或超現實的題材。", "劇烈的轉變，讓主角經歷一場震撼的事件。", "我是隕石，我從天上下來是為了砸醒你。"] },
  { name: "紫鋰輝石 (Kunzite)", theme: "#f0abfc", image: "/minerals/46-kunzite.webp", messages: ["無條件的愛，寫一段感人至深的情感戲。", "打開心扉，讓讀者感受到角色的脆弱與真誠。", "粉粉嫩嫩的，適合寫點戀愛腦的劇情。"] },
  { name: "拉利瑪 (Larimar)", theme: "#7dd3fc", image: "/minerals/47-larimar.webp", messages: ["海洋的平靜，讓文字如流水般自然流淌。", "療癒溝通，解決角色之間的誤會。", "看著這片藍，是不是想去海邊？想得美，快寫稿。"] },
  { name: "赤鐵礦 (Hematite)", theme: "#4b5563", image: "/minerals/48-hematite.webp", messages: ["接地氣，讓故事背景更紮實、更有生活感。", "反彈負能量，不要理會酸民的評論。", "我很重，就像你拖延已久的截稿壓力。"] },
  { name: "藍玉髓 (Blue Chalcedony)", theme: "#a5b4fc", image: "/minerals/49-blue-chalcedony.webp", messages: ["溫柔的表達，用細膩的筆觸描繪情感。", "內心的安寧，在寫作中找到避風港。", "溫溫柔柔的，適合寫點睡前讀物。"] },
  { name: "黑星石 (Black Star)", theme: "#000000", image: "/minerals/50-black-star.webp", messages: ["黑暗中的指引，讓主角在絕望中看見希望。", "挖掘潛能，你還有很多沒用上的才華。", "你看不到星星？因為星星在你心裡，噁心吧？"] },
  // 51-60
  { name: "亞歷山大變石 (Alexandrite)", theme: "#2d8659", image: "/minerals/51-alexandrite.webp", messages: ["環境改變時，展現不同面貌也是一種智慧。", "日夜皆美，你的多面性是獨特的禮物。", "變色龍看了都說讚，你這變臉速度比我還快。"] },
  { name: "閃鋅礦 (Sphalerite)", theme: "#d4a017", image: "/minerals/52-sphalerite.webp", messages: ["內在的火花正等待被發掘，別忽略隱藏的才能。", "光芒需要正確的角度才能展現，找到你的舞台。", "比我還會閃的只有...你已讀不回的速度。"] },
  { name: "矽孔雀石 (Chrysocolla)", theme: "#1e90aa", image: "/minerals/53-chrysocolla.webp", messages: ["溫柔的溝通能化解最堅硬的衝突。", "讓思緒如流水般自然流動，答案會浮現。", "藍藍綠綠的，像極了你的錢包——空虛但好看。"] },
  { name: "薔薇輝石 (Rhodonite)", theme: "#db7093", image: "/minerals/54-rhodonite.webp", messages: ["傷疤是故事的一部分，不需要隱藏。", "在混亂中找到美麗，這是創作者的天賦。", "黑線是我的特色，不是 bug 是 feature。"] },
  { name: "砂金石英 (Aventurine)", theme: "#3cb371", image: "/minerals/55-aventurine.webp", messages: ["機會之門正在開啟，保持樂觀往前走。", "好運需要行動配合，不要只是等待。", "我叫砂金石英不是沙金石，別打錯字謝謝。"] },
  { name: "堇青石 (Iolite)", theme: "#4b0082", image: "/minerals/56-iolite.webp", messages: ["維京人用我導航，你也能找到方向。", "從不同角度看問題，會有意想不到的發現。", "我會變色不是因為心情，是因為你角度太刁鑽。"] },
  { name: "蛇紋石 (Serpentine)", theme: "#556b2f", image: "/minerals/57-serpentine.webp", messages: ["蛻變需要時間，像蛇蛻皮一樣自然。", "釋放舊有的限制，迎接全新的自己。", "我叫蛇紋石，不是蛇皮，請尊重我的身分。"] },
  { name: "賽黃晶 (Danburite)", theme: "#ffe4e1", image: "/minerals/58-danburite.webp", messages: ["純淨的心能看見最真實的答案。", "放下執著，輕盈地面對每一天。", "我透明度很高，跟你的藉口完全相反。"] },
  { name: "白紋石 (Howlite)", theme: "#f5f5f5", image: "/minerals/59-howlite.webp", messages: ["耐心是最被低估的超能力。", "在喧囂中保持內心的平靜。", "我是白紋石，不是廉價的綠松石替代品（生氣）。"] },
  { name: "紅玉髓 (Carnelian)", theme: "#e25822", image: "/minerals/60-carnelian.webp", messages: ["點燃內心的火焰，勇敢追求目標。", "行動力是改變現狀的第一步。", "我這麼熱情，你卻這麼冷漠對待 deadline。"] },
  // 61-70
  { name: "苔紋瑪瑙 (Moss Agate)", theme: "#8fbc8f", image: "/minerals/61-moss-agate.webp", messages: ["成長是緩慢的，但每天都在發生。", "與大自然連結，找回最原始的創作力。", "我體內有小森林，你體內只有外送炸雞。"] },
  { name: "藍紋瑪瑙 (Blue Lace Agate)", theme: "#b0c4de", image: "/minerals/62-blue-lace-agate.webp", messages: ["溫柔的力量往往比強硬更有效。", "用平和的語氣說出真心話。", "這麼優雅的藍，你怎麼配天天穿黑色？"] },
  { name: "火蛋白石 (Fire Opal)", theme: "#ff6347", image: "/minerals/63-fire-opal.webp", messages: ["讓創意之火自由燃燒。", "熱情是感染他人的最佳方式。", "我內心有火，你內心只有...想下班。"] },
  { name: "透石膏 (Selenite)", theme: "#f0ffff", image: "/minerals/64-selenite.webp", messages: ["月亮的光輝提醒你，黑暗之後總有光明。", "淨化思緒，為新的靈感騰出空間。", "我這麼仙氣飄飄，你卻還在熬夜看迷因。"] },
  { name: "阿帕契之淚 (Apache Tear)", theme: "#3d3d3d", image: "/minerals/65-apache-tear.webp", messages: ["眼淚也是力量的展現，不要害怕脆弱。", "悲傷過後，會有更清晰的視野。", "比你哭得還透澈，但至少我很美。"] },
  { name: "次石墨 (Shungite)", theme: "#1a1a1a", image: "/minerals/66-shungite.webp", messages: ["古老的智慧正在守護著你。", "淨化環境，為創作營造純淨空間。", "我是二十億年的古董，你的拖延症也差不多這麼老。"] },
  { name: "祖母綠 (Emerald)", theme: "#50c878", image: "/minerals/67-emerald.webp", messages: ["真正的價值不需要完美無瑕。", "用心去愛，愛會回饋你豐盛的靈感。", "我是四大寶石之一，你是四大拖延之王。"] },
  { name: "水光水晶 (Aqua Aura)", theme: "#00ced1", image: "/minerals/68-aqua-aura.webp", messages: ["結合科技與自然，創造全新的可能。", "讓溝通更順暢，表達更清晰。", "我是水晶界的賽博龐克，你是 deadline 界的末日戰士。"] },
  { name: "煙水晶 (Smoky Quartz)", theme: "#756f6a", image: "/minerals/69-smoky-quartz.webp", messages: ["接地氣，讓飄忽的想法落實成行動。", "釋放負面能量，輕裝上陣。", "我看起來很 chill，但其實一直在吸收你的負能量。"] },
  { name: "鉍 (Bismuth)", theme: "#ff69b4", image: "/minerals/70-bismuth.webp", messages: ["打破常規，創造屬於自己的美學。", "彩虹階梯提醒你，成功是一步一步來的。", "我的造型比你的人生規劃還有結構性。"] },
  // 71-80
  { name: "藍寶石 (Sapphire)", theme: "#0f52ba", image: "/minerals/71-sapphire.webp", messages: ["智慧與忠誠，是創作路上的最佳伴侶。", "保持專注，藍色的深邃會帶來清明。", "我這麼尊貴，你居然用來問「今天吃什麼」？"] },
  { name: "綠玉髓 (Chrysoprase)", theme: "#7fff00", image: "/minerals/72-chrysoprase.webp", messages: ["樂觀是可以練習的，從小事開始。", "讓心靈充滿希望的綠意。", "這麼清新的綠，你配嗎？（開玩笑的啦）"] },
  { name: "黑碧璽 (Black Tourmaline)", theme: "#0d0d0d", image: "/minerals/73-black-tourmaline.webp", messages: ["建立邊界，保護你的創作能量。", "負面評價無法穿透你的防護罩。", "我是電氣石，專門吸收酸民的惡意評論。"] },
  { name: "磷灰石 (Apatite)", theme: "#20b2aa", image: "/minerals/74-apatite.webp", messages: ["清晰的目標是成功的一半。", "學習新知識，為創作注入新養分。", "我的名字聽起來像『食慾』，但你現在需要的是寫作慾。"] },
  { name: "彩虹月光石 (Rainbow Moonstone)", theme: "#e6e6fa", image: "/minerals/75-rainbow-moonstone.webp", messages: ["內在的光芒會在適當的時機展現。", "相信直覺，它是你最可靠的指引。", "我比普通月光石還會發光，就像你比昨天更會拖稿。"] },
  { name: "海洋碧玉 (Ocean Jasper)", theme: "#66cdaa", image: "/minerals/76-ocean-jasper.webp", messages: ["生命中的每個圓點都有它的意義。", "接受不完美，那正是獨特之處。", "我身上的圈圈，是你人生繞的彎路數量。"] },
  { name: "幽靈水晶 (Phantom Quartz)", theme: "#9370db", image: "/minerals/77-phantom-quartz.webp", messages: ["過去的經歷成就了現在的你。", "層層疊疊的成長，都值得被紀念。", "我體內有幽靈，你體內有未完成的稿債。"] },
  { name: "魚眼石 (Apophyllite)", theme: "#e0ffff", image: "/minerals/78-apophyllite.webp", messages: ["清澈的心靈能看見更遠的未來。", "放下執念，讓光芒自然流入。", "這麼透明的我，看穿了你想偷懶的心。"] },
  { name: "霰石 (Aragonite)", theme: "#daa520", image: "/minerals/79-aragonite.webp", messages: ["穩定你的根基，才能向上生長。", "在壓力中保持平衡是一門藝術。", "我長得像海星，但你的進度還在海底。"] },
  { name: "彼得石 (Pietersite)", theme: "#4682b4", image: "/minerals/80-pietersite.webp", messages: ["風暴過後總有平靜，堅持就對了。", "混亂中也能找到美麗的秩序。", "暴風雨來臨前的寧靜，就是你截稿前的假象。"] },
  // 81-90
  { name: "翠銅礦 (Dioptase)", theme: "#00fa9a", image: "/minerals/81-dioptase.webp", messages: ["心靈的療癒從原諒自己開始。", "綠色的希望正在萌芽。", "這麼鮮豔的綠，是你眼紅別人進度的顏色。"] },
  { name: "鈷方解石 (Cobaltoan Calcite)", theme: "#ff1493", image: "/minerals/82-cobaltoan-calcite.webp", messages: ["愛自己是一切創作的起點。", "粉紅色的能量正在療癒你。", "這麼粉嫩的我，看著你的黑眼圈真的很心疼。"] },
  { name: "黃銅礦 (Chalcopyrite)", theme: "#b8860b", image: "/minerals/83-chalcopyrite.webp", messages: ["在平凡中發現非凡的光芒。", "保持好奇心，世界充滿驚喜。", "我會變色，就像你的心情隨著進度起伏。"] },
  { name: "鉬鉛礦 (Wulfenite)", theme: "#ff8c00", image: "/minerals/84-wulfenite.webp", messages: ["脆弱不是缺點，是獨特的美。", "在限制中找到創意的空間。", "我這麼薄透，就像你對 deadline 的重視程度。"] },
  { name: "輝沸石 (Stilbite)", theme: "#ffc0cb", image: "/minerals/85-stilbite.webp", messages: ["溫柔地對待自己的夢想。", "安靜中自有力量。", "我長得像蝴蝶結，你的人生卻還沒打結。"] },
  { name: "異極礦 (Hemimorphite)", theme: "#87ceeb", image: "/minerals/86-hemimorphite.webp", messages: ["表達真實的自己需要勇氣。", "天空藍的平靜，正是你需要的。", "我兩端長得不一樣，就像你說的和做的。"] },
  { name: "綠簾石 (Epidote)", theme: "#6b8e23", image: "/minerals/87-epidote.webp", messages: ["放大生命中美好的部分。", "成長有時需要一點壓力。", "我叫綠簾石，不是你逃避現實的藉口。"] },
  { name: "天使石 (Angelite)", theme: "#b0e0e6", image: "/minerals/88-angelite.webp", messages: ["溫柔的力量能化解一切衝突。", "與內在的平靜連結。", "我這麼天使，你卻這麼惡魔般地拖稿。"] },
  { name: "樹紋瑪瑙 (Tree Agate)", theme: "#228b22", image: "/minerals/89-tree-agate.webp", messages: ["在城市中也能找到自然的寧靜。", "慢慢扎根，才能穩穩成長。", "我體內有樹，你體內有無數未完成的構想。"] },
  { name: "粉紅蛋白石 (Pink Opal)", theme: "#ffb6c1", image: "/minerals/90-pink-opal.webp", messages: ["溫柔是一種強大的力量。", "粉色的夢想值得被實現。", "這麼少女心的粉色，配你這麼老的拖延症。"] },
  // 91-100
  { name: "西瓜碧璽 (Watermelon Tourmaline)", theme: "#ff6b6b", image: "/minerals/91-watermelon-tourmaline.webp", messages: ["表裡如一，做真實的自己。", "生命中的甜蜜值得品嚐。", "我長得像西瓜，你的進度卻還在播種。"] },
  { name: "黃色方解石 (Yellow Calcite)", theme: "#ffd700", image: "/minerals/92-yellow-calcite.webp", messages: ["自信的光芒從內心散發。", "積極的態度能改變一切。", "這麼陽光的黃，照不亮你拖延的黑暗面。"] },
  { name: "水錳礦 (Manganite)", theme: "#2f4f4f", image: "/minerals/93-manganite.webp", messages: ["在黑暗中也能發現光芒。", "深沉的力量正在積累。", "我這麼低調的黑，比你高調的拖延還有質感。"] },
  { name: "金綠寶石 (Chrysoberyl)", theme: "#9acd32", image: "/minerals/94-chrysoberyl.webp", messages: ["堅持讓你與眾不同。", "閃耀的未來正在等著你。", "我是貓眼石的本尊，你是拖延症的代言人。"] },
  { name: "水矽釩鈣石 (Cavansite)", theme: "#4169e1", image: "/minerals/95-cavansite.webp", messages: ["稀有的才華值得被珍惜。", "讓思緒像藍天一樣開闘。", "我這麼稀有，你的準時交稿更稀有。"] },
  { name: "鉻鉛礦 (Crocoite)", theme: "#ff4500", image: "/minerals/96-crocoite.webp", messages: ["熱情是創作最好的燃料。", "鮮豔的色彩代表豐富的生命力。", "我這麼橘紅，就像你被催稿時的臉色。"] },
  { name: "銀星石 (Astrophyllite)", theme: "#cd7f32", image: "/minerals/97-astrophyllite.webp", messages: ["像星星一樣放射光芒，你的才華終將被看見。", "金色的葉片提醒你，成長是向外擴展的。", "我長得像星爆，你的進度卻像黑洞一樣停滯。"] },
  { name: "星光粉晶 (Star Rose Quartz)", theme: "#ffb7c5", image: "/minerals/98-star-rose-quartz.webp", messages: ["愛的光芒從心中放射。", "你值得擁有閃耀的幸福。", "我有六芒星，你有六百個未完成的想法。"] },
  { name: "辰砂 (Cinnabar)", theme: "#e34234", image: "/minerals/99-cinnabar.webp", messages: ["變革需要勇氣和決心。", "紅色的能量帶來轉化的力量。", "我是硃砂，古人用我寫符咒，你用我求準時交稿。"] },
  { name: "彩虹螢石 (Rainbow Fluorite)", theme: "#9932cc", image: "/minerals/100-rainbow-fluorite.webp", messages: ["生命中的每種色彩都有意義。", "整合所有的經歷，創造完整的你。", "一百種礦石你都看完了，稿子呢？"] },
];

import { useMagicalSounds } from "@/hooks/use-magical-sounds";
import { Play, ChevronUp, ChevronDown } from "lucide-react";

export default function Home() {
  const [selectedMineral, setSelectedMineral] = useState(minerals[41]);
  const [selectedMessage, setSelectedMessage] = useState(minerals[41].messages[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [history, setHistory] = useState<{ mineral: typeof minerals[0], message: string, soundIndex: number }[]>([]);

  const { playNote, playSequence } = useMagicalSounds();

  const drawFortune = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const randomMineral = minerals[Math.floor(Math.random() * minerals.length)];
      const randomMsgIndex = Math.floor(Math.random() * 3);
      const message = randomMineral.messages[randomMsgIndex];

      setSelectedMineral(randomMineral);
      setSelectedMessage(message);

      const seedIndex = playNote();
      setHistory(prev => [{ mineral: randomMineral, message, soundIndex: seedIndex }, ...prev]);

      setIsSpinning(false);
    }, 1000);
  };

  const restoreHistory = (item: { mineral: typeof minerals[0], message: string }) => {
    if (isSpinning) return;
    setSelectedMineral(item.mineral);
    setSelectedMessage(item.message);
  };

  return (
    <div className="relative h-[100dvh] flex flex-col overflow-hidden bg-[#09090b] text-white">
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
          <h1 className="font-black tracking-tight text-sm">LITHOS</h1>
        </div>
        <div className="flex items-center gap-3">
          <Github className="w-4 h-4 text-zinc-600" />
          <Info className="w-4 h-4 text-zinc-600" />
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 gap-8 md:gap-16 min-h-0">
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
              {selectedMineral.image ? (
                <div className="relative w-full h-full p-2">
                  <Image
                    src={selectedMineral.image}
                    alt={selectedMineral.name}
                    fill
                    className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] filter contrast-125 saturate-110"
                    priority
                    sizes="(max-width: 768px) 192px, 320px"
                  />
                </div>
              ) : (
                <Sparkles className="w-16 h-16 md:w-32 md:h-32 opacity-10 filter blur-[2px]" />
              )}
            </div>
          </motion.div>

          <div className="absolute inset-[-20%] border border-white/5 rounded-[3rem] -z-10 animate-[spin_15s_linear_infinite]" />
          <div className="absolute inset-[-40%] border border-white/5 rounded-[4rem] -z-10 animate-[spin_25s_linear_infinite_reverse] opacity-50" />
        </div>

        <div className="flex flex-col gap-6 w-full max-w-lg shrink min-h-0">
          <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4 relative overflow-hidden flex flex-col">
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">Current Gem</span>
              <h2 className="text-xl md:text-3xl font-bold font-serif text-white truncate flex items-center justify-center sm:justify-start">
                {(() => {
                  const parts = selectedMineral.name.split(' (');
                  if (parts.length === 2) {
                    return (
                      <>
                        <span>{parts[0]}</span>
                        <span className="text-base md:text-lg ml-6 font-sans font-normal opacity-70 tracking-wide">
                          {parts[1].replace(')', '')}
                        </span>
                      </>
                    );
                  }
                  return <span>{selectedMineral.name}</span>;
                })()}
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

          <div className="flex justify-center h-8">
            <AnimatePresence>
              {history.length > 1 && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={() => {
                    const indices = history.map(h => h.soundIndex).reverse();
                    playSequence(indices, 30);
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all text-[10px] font-bold tracking-wider uppercase text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  <Play size={10} className="fill-current" />
                  <span>Play Journey (30s)</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="px-6 py-2 flex flex-col gap-2 shrink-0 bg-black/60 backdrop-blur-md border-t border-white/5 transition-all duration-300 ease-in-out">
        <button
          onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
          className="flex items-center justify-between w-full p-2 hover:bg-white/5 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-2">
            <HistoryIcon size={12} className="text-zinc-500 group-hover:text-zinc-300" />
            <span className="text-[10px] font-black tracking-widest text-zinc-500 group-hover:text-zinc-300 uppercase">Collection ({history.length})</span>
          </div>
          {isHistoryExpanded ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronUp size={14} className="text-zinc-500" />}
        </button>

        <AnimatePresence>
          {isHistoryExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap content-start gap-2 pb-4 max-h-[30vh] overflow-y-auto custom-scrollbar">
                <div className="flex flex-wrap content-start gap-2 pb-2">
                  {history.length > 0 ? history.map((item, i) => (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={`${item.mineral.name}-${i}`}
                      onClick={() => restoreHistory(item)}
                      layout
                      className="pl-1.5 pr-3 py-1.5 rounded-full bg-white/5 border border-white/5 flex items-center gap-2 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group"
                    >
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-black/40 ring-1 ring-white/10 group-hover:ring-white/30 transition-all">
                        {item.mineral.image && (
                          <Image
                            src={item.mineral.image}
                            alt={item.mineral.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-200 whitespace-nowrap uppercase leading-none transition-colors">
                          {item.mineral.name.split(' ')[0]}
                        </span>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="w-full flex justify-center py-4">
                      <span className="text-[10px] text-zinc-800 font-bold uppercase tracking-widest italic">Waiting for your first draw...</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
}