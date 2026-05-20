import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Send,
  Plus,
  Moon,
  Sun,
  Sparkles,
  Cat,
  Mic2,
  Volume2,
  SmilePlus,
  Wind,
  Coffee,
  CloudRain,
  TreePine,
  Stars,
  Search,
  MoreVertical,
  HeartHandshake,
  MessageCircleHeart,
  Home,
  Trash2,
  Pause,
  Play,
} from "lucide-react";
import "./style.css";

const STORAGE_KEY = "heart-companion-v1";

const encouragements = [
  "今日辛苦了。真係。",
  "唔需要一下子變好，今晚先慢慢來。",
  "有啲日子，撐住本身已經好叻。",
  "你唔係麻煩，你只係攰咗。",
  "今晚可以唔使咁堅強。",
  "我在。你可以慢慢講。",
  "就算只係講少少，都可以。",
];

const backgroundOptions = [
  { id: "stars", label: "夜空", icon: Stars, className: "bg-stars" },
  { id: "forest", label: "森林", icon: TreePine, className: "bg-forest" },
  { id: "catroom", label: "貓咪房間", icon: Cat, className: "bg-catroom" },
  { id: "rain", label: "雨天窗邊", icon: CloudRain, className: "bg-rain" },
  { id: "cafe", label: "溫暖咖啡店", icon: Coffee, className: "bg-cafe" },
];

const moodOptions = [
  { emoji: "😔", label: "有點低落" },
  { emoji: "😟", label: "有點焦慮" },
  { emoji: "😶", label: "說不出口" },
  { emoji: "🥺", label: "想有人陪" },
  { emoji: "🙂", label: "想被鼓勵" },
];

const openingMessages = [
  {
    role: "ai",
    text: "嗯，我在。\n\n你可以慢慢講，唔使急住整理好。\n\n今晚……係咪有啲難捱？",
    time: getTime(),
  },
];

function getTime() {
  return new Date().toLocaleTimeString("zh-HK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getHumanReplyDelay(userText, aiText = "") {
  const baseThinking = 900;
  const readingTime = Math.min(userText.length * 35, 1800);
  const typingTime = Math.min(aiText.length * 28, 2600);
  const randomPause = Math.floor(Math.random() * 1200);

  // 令回覆速度更似真人：短句不會即刻彈出，長句會等耐少少
  return Math.min(baseThinking + readingTime + typingTime + randomPause, 5600);
}

function createConversation(title = "新的陪伴對話") {
  return {
    id: crypto.randomUUID(),
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: openingMessages,
  };
}

function getCompanionReply(input, mood) {
  const text = input.toLowerCase().trim();

  const gentlePick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const smallHumanReplies = [
    "嗯。",
    "我在。",
    "慢慢講。",
    "聽到。",
    "辛苦你了。",
    "今晚可以唔使咁堅強。",
    "唔緊要，講到邊就邊。",
    "我陪你一陣。",
    "嗯……你可以繼續講。",
  ];

  // 偶爾短回覆，令對話更似真人，不會每次都長篇大論
  if (text.length < 8 && Math.random() < 0.45) {
    return gentlePick(smallHumanReplies);
  }

  if (
    text.includes("死") ||
    text.includes("自殺") ||
    text.includes("唔想生存") ||
    text.includes("不想活") ||
    text.includes("想消失") ||
    text.includes("唔想再") ||
    text.includes("傷害自己")
  ) {
    return gentlePick([
      "我聽到你講到呢度，真係有啲擔心你。\n\n而家最重要唔係講道理，係先確保你安全。\n\n你可唔可以先離開會傷害到自己嘅物件，然後即刻搵一個信得過嘅人陪住你？\n\n如果你喺香港，請即刻打 999，或者聯絡生命熱線 2382 0000 / 撒瑪利亞防止自殺會 2389 2222。\n\n你可以先覆我一句：你而家係咪安全？",
      "我唔想你一個人頂住呢一刻。\n\n先唔需要解釋太多。你可唔可以而家搵身邊一個人，或者即刻打當地緊急服務？\n\n如果喺香港，可以打 999。亦可以打生命熱線 2382 0000 或撒瑪利亞防止自殺會 2389 2222。\n\n你而家身邊有人嗎？",
    ]);
  }

  if (text.includes("孤單") || text.includes("寂寞") || text.includes("lonely") || text.includes("無人")) {
    return gentlePick([
      "嗯……孤單真係會好靜。\n\n尤其係夜晚，會特別明顯。\n\n我陪你一陣，好嗎？",
      "聽落你好似一個人頂咗好耐。\n\n唔使即刻講得好完整。\n\n你可以由一句開始。",
      "有時最辛苦唔係身邊無人，係覺得無人真正明。\n\n我聽緊。",
      "嗯，我明。\n\n嗰種空空地嘅感覺，真係唔容易受。\n\n今晚我喺度。",
    ]);
  }

  if (text.includes("焦慮") || text.includes("擔心") || text.includes("panic") || text.includes("驚") || text.includes("緊張")) {
    return gentlePick([
      "嗯……先慢啲。\n\n你而家可能唔需要即刻解決件事。\n\n先同我一齊呼一口氣。",
      "聽落你個腦好似停唔到。\n\n唔緊要，我哋逐少逐少嚟。\n\n而家最困住你嘅係邊一件事？",
      "焦慮上嚟嗰下真係好辛苦。\n\n你唔係誇張，身體真係會好似響警鐘咁。\n\n我陪你慢慢降返落嚟。",
      "先唔好逼自己冷靜。\n\n你可以只係同我講：你而家最驚咩？",
    ]);
  }

  if (text.includes("失眠") || text.includes("瞓唔著") || text.includes("睡不著") || text.includes("訓唔著")) {
    return gentlePick([
      "夜晚瞓唔著真係會令人好無助。\n\n越想瞓，個腦反而越嘈。\n\n今晚先唔好逼自己一定要瞓著，好嗎？",
      "嗯……又係一個好長嘅夜晚。\n\n你可以唔使講太多，我陪你靜一陣都得。",
      "瞓唔著嗰種感覺好磨人。\n\n不如我哋先將目標改細啲：唔係一定要瞓著，而係先俾身體休息。",
      "我在。\n\n你可以慢慢打字，或者乜都唔講。\n\n今晚先陪你安靜一陣。",
    ]);
  }

  if (text.includes("攰") || text.includes("累") || text.includes("辛苦") || text.includes("好煩") || text.includes("頂唔順")) {
    return gentlePick([
      "聽落你好攰。\n\n唔係普通攰，係嗰種心都攰埋。",
      "辛苦你了。\n\n今日係咪好多嘢壓住你？",
      "嗯……你真係撐咗好耐。\n\n今晚可以唔使再扮無事。",
      "有時人真係會突然頂唔順。\n\n唔代表你弱，只係你已經好攰。",
      "先停一停都得。\n\n你唔需要而家即刻振作。",
    ]);
  }

  if (text.includes("喊") || text.includes("哭") || text.includes("眼淚")) {
    return gentlePick([
      "想喊就喊啦。\n\n唔使忍住。\n\n眼淚有時只係身體幫你放低少少重量。",
      "嗯……一定係好辛苦，先會去到想喊。\n\n我陪住你。",
      "喊唔係失控。\n\n可能係你終於唔想再硬撐。",
      "你可以喊住講，或者唔講都得。\n\n我在。",
    ]);
  }

  if (text.includes("冇人明") || text.includes("沒人懂") || text.includes("無人明") || text.includes("不被理解")) {
    return gentlePick([
      "嗰種『講咗都好似無人明』嘅感覺，真係會好孤單。",
      "嗯……你可能唔係想要人即刻俾答案，只係想有人真係聽到。",
      "我唔會急住反駁你。\n\n你可以慢慢講，我聽。",
      "被人唔理解，久而久之真係會好攰。\n\n你今日想講邊一部分？",
    ]);
  }

  if (text.includes("唔開心") || text.includes("不開心") || text.includes("難過") || text.includes("sad")) {
    return gentlePick([
      "嗯……唔開心就唔開心。\n\n唔需要即刻解釋點解。",
      "今日好難捱？",
      "你可以唔使扮自己無事。\n\n喺呢度可以。",
      "我聽到你而家好難受。\n\n想唔想講多少少？",
      "有啲難過，真係唔係一句『諗開啲』就得。",
    ]);
  }

  if (text.includes("多謝") || text.includes("謝謝") || text.includes("thanks")) {
    return gentlePick([
      "唔使多謝。\n\n我喺度。",
      "嗯，陪你一陣係可以嘅。",
      "你願意講出嚟，已經好唔容易。",
      "慢慢來。今晚唔需要一個人頂晒。",
    ]);
  }

  if (mood) {
    return gentlePick([
      `嗯，我見到你而家係「${mood.emoji} ${mood.label}」。\n\n唔使急住變好。\n\n你可以慢慢講。`,
      `「${mood.label}」……聽落都唔容易受。\n\n我陪你一陣。`,
      `收到。\n\n而家先唔分析啦。\n\n我只係想陪你停一停。`,
    ]);
  }

  const replies = [
    "嗯，我在。",
    "慢慢講。",
    "我聽緊。",
    "今日係咪好難捱？",
    "聽落你好攰。",
    "我明。",
    "有時真係會突然頂唔順。",
    "唔需要急住整理好自己。",
    "今晚可以唔使咁堅強。",
    "我陪你講陣。",
    "其實你已經撐咗好耐。",
    "嗯……然後呢？",
    "仲想講多啲嗎？",
    "有啲嘢卡住咗你好耐？",
    "你可以講慢啲，唔使一次過講晒。",
    "我唔會催你。",
    "聽到呢度，我覺得你真係承受咗唔少。",
    "嗯，呢件事對你嚟講應該幾重。",
    "你唔係麻煩。",
    "你講嘅嘢，我有認真聽。",
  ];

  // 長訊息會回得多少少；短訊息就保持 WhatsApp 感
  if (text.length > 35) {
    return gentlePick([
      "我慢慢睇完你講嘅嘢。\n\n聽落你唔係單純唔開心，而係已經忍咗一段時間。\n\n你唔需要即刻搵答案。今晚可以先俾自己承認：呢件事真係好辛苦。",
      "嗯……你講嘅唔係小事。\n\n如果係我喺你身邊，我可能會先同你坐低，唔急住講道理。\n\n你而家最想有人明白邊一部分？",
      "聽到你咁講，我覺得你其實一路都好努力撐住。\n\n但人真係唔可能永遠都咁硬淨。\n\n你可以喺度放低少少。",
      "我聽到你有好多嘢壓住。\n\n我唔會叫你即刻正面啲。\n\n因為有啲時候，最需要嘅其實只係有人願意聽你講完。",
    ]);
  }

  return gentlePick(replies);
}
function App() {
  const [started, setStarted] = useState(false);
  const [dark, setDark] = useState(false);
  const [background, setBackground] = useState("catroom");
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return [createConversation("今晚想有人聽我說")];
  });
  const [activeId, setActiveId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved)[0]?.id;
    return null;
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [breathing, setBreathing] = useState(false);
  const [mode, setMode] = useState("companion");

  const activeConversation = useMemo(() => {
    return conversations.find((item) => item.id === activeId) || conversations[0];
  }, [conversations, activeId]);

  useEffect(() => {
    if (!activeId && conversations[0]) setActiveId(conversations[0].id);
  }, [activeId, conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const bgClass = backgroundOptions.find((item) => item.id === background)?.className || "bg-catroom";

  function updateActiveConversation(updater) {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === activeConversation.id ? updater(conv) : conv))
    );
  }

  function addConversation() {
    const conv = createConversation("新的陪伴對話");
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    setStarted(true);
  }

  function deleteConversation(id) {
    setConversations((prev) => {
      const next = prev.filter((conv) => conv.id !== id);
      return next.length ? next : [createConversation("新的陪伴對話")];
    });
  }

  function sendMessage(customText) {
    const value = (customText || input).trim();
    if (!value || typing) return;

    const userMessage = { role: "user", text: value, time: getTime() };
    updateActiveConversation((conv) => ({
      ...conv,
      title: conv.messages.length <= 1 ? value.slice(0, 18) : conv.title,
      updatedAt: Date.now(),
      messages: [...conv.messages, userMessage],
    }));

    setInput("");
    setStarted(true);
    setTyping(true);

    const replyText = getCompanionReply(value, selectedMood);
    const replyDelay = getHumanReplyDelay(value, replyText);

    setTimeout(() => {
      const aiMessage = {
        role: "ai",
        text: replyText,
        time: getTime(),
      };
      updateActiveConversation((conv) => ({
        ...conv,
        updatedAt: Date.now(),
        messages: [...conv.messages, aiMessage],
      }));
      setTyping(false);
      setSelectedMood(null);
    }, replyDelay);
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-HK";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }

  if (!started) {
    return (
      <div className={`min-h-screen ${bgClass} text-slate-900 dark:text-white transition-colors`}>
        <div className="min-h-screen bg-white/55 dark:bg-slate-950/65 backdrop-blur-[2px]">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 shadow-soft dark:bg-emerald-900">
                <HeartHandshake className="text-emerald-700 dark:text-emerald-200" />
              </div>
              <div>
                <p className="font-bold">心伴 Companion</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">總有人願意聆聽你。</p>
              </div>
            </div>
            <button onClick={() => setDark(!dark)} className="rounded-full bg-white/75 p-3 shadow-soft dark:bg-slate-800">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>

          <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:grid-cols-[1.1fr_.9fr] md:py-20">
            <section className="flex flex-col justify-center">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm text-emerald-800 shadow-soft dark:bg-slate-800 dark:text-emerald-200">
                <Sparkles size={16} />
                像深夜有人陪你聊天
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="mt-7 text-4xl font-black leading-tight tracking-tight md:text-6xl">
                你不需要
                <span className="block text-emerald-700 dark:text-emerald-300">一個人面對。</span>
              </motion.h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700 dark:text-slate-200">
                這裡有一位願意靜靜陪伴你的人。你可以慢慢說，不用整理、不用逞強，也不用假裝自己很好。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => setStarted(true)} className="rounded-full bg-emerald-600 px-7 py-4 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-emerald-700">
                  開始聊天
                </button>
                <button onClick={() => setBreathing(!breathing)} className="rounded-full bg-white/75 px-7 py-4 font-semibold text-slate-700 shadow-soft dark:bg-slate-800 dark:text-white">
                  先呼吸一下
                </button>
              </div>
              <p className="mt-5 text-sm text-slate-500 dark:text-slate-300">
                提醒：本網站只作情緒陪伴與一般支援，不能取代專業醫療、心理治療或緊急服務。
              </p>
            </section>

            <section className="relative">
              <CompanionCard breathing={breathing} />
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen overflow-hidden ${bgClass} text-slate-900 dark:text-white`}>
      <div className="flex h-full bg-white/55 backdrop-blur-sm dark:bg-slate-950/70">
        <aside className="hidden w-80 shrink-0 border-r border-white/50 bg-white/75 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80 md:flex md:flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-700">
            <div>
              <h2 className="font-black">心伴 Companion</h2>
              <p className="text-xs text-slate-500 dark:text-slate-300">聊天紀錄已儲存在本機</p>
            </div>
            <button onClick={addConversation} className="rounded-full bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
              <Plus size={18} />
            </button>
          </div>

          <div className="p-3">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-slate-500 dark:bg-slate-800">
              <Search size={16} />
              <span className="text-sm">搜尋對話</span>
            </div>
          </div>

          <div className="scrollbar-soft flex-1 overflow-y-auto px-2 pb-4">
            {conversations.map((conv) => {
              const last = conv.messages[conv.messages.length - 1];
              return (
                <button key={conv.id} onClick={() => setActiveId(conv.id)} className={`group mb-2 flex w-full items-center gap-3 rounded-3xl p-3 text-left transition ${activeConversation.id === conv.id ? "bg-emerald-50 dark:bg-emerald-950/70" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                  <Avatar small />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <p className="truncate font-semibold">{conv.title}</p>
                      <span className="text-xs text-slate-400">{last?.time}</span>
                    </div>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-300">{last?.text}</p>
                  </div>
                  <span onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }} className="hidden rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 group-hover:block">
                    <Trash2 size={15} />
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <ChatHeader
            dark={dark}
            setDark={setDark}
            addConversation={addConversation}
            setStarted={setStarted}
          />

          <div className="border-b border-white/50 bg-white/55 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/50">
            <div className="scrollbar-soft flex gap-2 overflow-x-auto">
              {backgroundOptions.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => setBackground(item.id)} className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm transition ${background === item.id ? "bg-emerald-600 text-white" : "bg-white/75 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>
                    <Icon size={15} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <ChatMessages
            messages={activeConversation.messages}
            typing={typing}
            speak={speak}
          />

          <div className="border-t border-white/60 bg-white/75 p-3 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80">
            <div className="mb-3 flex flex-wrap gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood)}
                  className={`rounded-full px-3 py-2 text-sm transition ${selectedMood?.label === mood.label ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
                >
                  {mood.emoji} {mood.label}
                </button>
              ))}
              <button onClick={() => setBreathing(!breathing)} className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Wind size={15} className="mr-1 inline" /> 呼吸
              </button>
              <button onClick={() => setMode(mode === "sleep" ? "companion" : "sleep")} className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {mode === "sleep" ? <Play size={15} className="mr-1 inline" /> : <Pause size={15} className="mr-1 inline" />}
                {mode === "sleep" ? "普通模式" : "睡眠模式"}
              </button>
            </div>

            {breathing && <BreathingMini />}

            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "sleep" ? "今晚睡不著嗎？可以慢慢說…" : "輸入你的心情…"}
                rows={1}
                className="scrollbar-soft max-h-32 flex-1 resize-none rounded-3xl border border-slate-200 bg-white px-5 py-3 outline-none focus:border-emerald-300 dark:border-slate-700 dark:bg-slate-800"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button onClick={() => sendMessage()} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-600 text-white shadow-soft transition hover:bg-emerald-700">
                <Send size={20} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Avatar({ small = false }) {
  return (
    <div className={`relative grid ${small ? "h-11 w-11" : "h-12 w-12"} shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-100 shadow-soft dark:from-emerald-900 dark:to-slate-700`}>
      <Cat className="text-emerald-700 dark:text-emerald-200" size={small ? 21 : 24} />
      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
    </div>
  );
}

function ChatHeader({ dark, setDark, addConversation, setStarted }) {
  return (
    <header className="flex items-center justify-between border-b border-white/60 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/85">
      <div className="flex items-center gap-3">
        <button onClick={() => setStarted(false)} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden">
          <Home size={19} />
        </button>
        <Avatar />
        <div>
          <h1 className="font-black">Virtual Companion</h1>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            正在陪伴你
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={addConversation} className="rounded-full p-3 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Plus size={19} />
        </button>
        <button onClick={() => setDark(!dark)} className="rounded-full p-3 hover:bg-slate-100 dark:hover:bg-slate-800">
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button className="rounded-full p-3 hover:bg-slate-100 dark:hover:bg-slate-800">
          <MoreVertical size={19} />
        </button>
      </div>
    </header>
  );
}

function ChatMessages({ messages, typing, speak }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <section className="scrollbar-soft flex-1 overflow-y-auto px-3 py-5 md:px-8">
      <div className="mx-auto max-w-4xl space-y-3">
        <div className="mx-auto mb-4 max-w-md rounded-3xl bg-white/70 p-4 text-center text-sm text-slate-600 shadow-soft dark:bg-slate-800/80 dark:text-slate-200">
          <MessageCircleHeart className="mx-auto mb-2 text-emerald-600" />
          這裡是安全的聊天空間。你可以慢慢說，AI 會以陪伴方式回應你。
        </div>

        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: .98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`message-bubble group ${message.role === "user" ? "user-bubble" : "ai-bubble"}`}>
                <p className="whitespace-pre-wrap break-words leading-7">{message.text}</p>
                <div className="mt-1 flex items-center justify-end gap-2 text-[11px] opacity-60">
                  {message.role === "ai" && (
                    <button onClick={() => speak(message.text)} className="opacity-0 transition group-hover:opacity-100">
                      <Volume2 size={13} />
                    </button>
                  )}
                  <span>{message.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="ai-bubble message-bubble">
              <div className="typing">
                <span></span><span></span><span></span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">AI 正在輸入中…</p>
            </div>
          </motion.div>
        )}

        <div ref={endRef} />
      </div>
    </section>
  );
}

function BreathingMini() {
  return (
    <div className="mb-3 flex items-center gap-4 rounded-3xl bg-emerald-50 p-4 dark:bg-emerald-950/60">
      <div className="breath-circle grid h-16 w-16 shrink-0 place-items-center rounded-full bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100">
        <Wind size={22} />
      </div>
      <div>
        <p className="font-semibold">慢慢呼吸</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">吸氣 4 秒，停一停，呼氣 6 秒。先讓身體知道：現在是安全的。</p>
      </div>
    </div>
  );
}

function CompanionCard({ breathing }) {
  const quote = encouragements[new Date().getDate() % encouragements.length];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }} className="relative overflow-hidden rounded-[2rem] bg-white/75 p-5 shadow-soft backdrop-blur-xl dark:bg-slate-900/80">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-200/60 blur-3xl" />

      <div className="relative">
        <div className="mb-5 flex items-center gap-3">
          <Avatar />
          <div>
            <p className="font-black">Virtual Companion</p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">正在陪伴你</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="ai-bubble message-bubble max-w-[88%]">
            <p>嗯，我在。今晚……係咪有啲難捱？</p>
            <p className="mt-1 text-right text-xs opacity-50">23:18</p>
          </div>
          <div className="flex justify-end">
            <div className="user-bubble message-bubble max-w-[82%]">
              <p>我有啲孤單，但又唔知點講。</p>
              <p className="mt-1 text-right text-xs opacity-60">23:19</p>
            </div>
          </div>
          <div className="ai-bubble message-bubble max-w-[90%]">
            <p>唔使講得好清楚。你慢慢嚟，我陪你一陣。</p>
            <p className="mt-1 text-right text-xs opacity-50">23:20</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-emerald-50 p-4 dark:bg-emerald-950/60">
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <SmilePlus size={18} />
            每日一句鼓勵
          </div>
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{quote}</p>
        </div>

        {breathing && <div className="mt-4"><BreathingMini /></div>}
      </div>
    </motion.div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
