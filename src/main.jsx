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
  "今日辛苦了。即使只是撐過今天，也已經很值得被肯定。",
  "慢慢來，不需要一下子變好。你願意說出來，已經是一種勇氣。",
  "有些日子會比較重，但你不用一個人扛著。",
  "請先照顧好呼吸。其他事情，可以一步一步來。",
  "你不是麻煩，你的感受值得被聽見。",
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
    text: "你好，我在這裡。你可以慢慢說，不需要整理得很清楚。今晚的你，最想被怎樣陪伴？",
    time: getTime(),
  },
];

function getTime() {
  return new Date().toLocaleTimeString("zh-HK", {
    hour: "2-digit",
    minute: "2-digit",
  });
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
  const text = input.toLowerCase();

  if (text.includes("死") || text.includes("自殺") || text.includes("唔想生存") || text.includes("不想活")) {
    return "聽到你這樣說，我真的很在意你的安全。你現在不需要一個人承受。可以先把身邊可能傷害自己的東西移開，然後立即聯絡一位可信任的人，或致電當地緊急服務。如果你在香港，可致電 999；亦可以找撒瑪利亞防止自殺會 2389 2222 或生命熱線 2382 0000。你可以先回我一句：你現在身邊安全嗎？";
  }

  if (text.includes("孤單") || text.includes("寂寞") || text.includes("lonely")) {
    return "孤單那種感覺，很多時不是『身邊沒有人』，而是覺得沒有人真正明白自己。謝謝你願意把這份感覺放在這裡。我會陪你一陣。你想先說說，這份孤單通常在甚麼時候最明顯嗎？";
  }

  if (text.includes("焦慮") || text.includes("擔心") || text.includes("panic") || text.includes("驚")) {
    return "焦慮來的時候，身體好像會先替我們拉警鐘。你可以先不用急著解決所有事。我們先一起做一個小步驟：吸氣 4 秒，停一停，呼氣 6 秒。然後告訴我，現在最困住你的是哪一件事？";
  }

  if (text.includes("失眠") || text.includes("瞓唔著") || text.includes("睡不著")) {
    return "睡不著真的很磨人，特別是夜深人靜時，腦袋會把很多事放大。今晚先不用逼自己一定要睡著，可以先把目標改成『讓身體休息』。你想我陪你做一段簡短呼吸，還是聽一句安靜的鼓勵？";
  }

  if (text.includes("攰") || text.includes("累") || text.includes("辛苦")) {
    return "你已經撐了很久吧。辛苦不是代表你不夠堅強，而是你真的承受了很多。今晚可以先不用表現得很好，只要讓自己有一點點喘息的位置。你今日最想放低的是甚麼？";
  }

  if (mood) {
    return `我收到你現在的心情是「${mood.emoji} ${mood.label}」。謝謝你願意讓我知道。你不用急著變好，我會先陪你停一停。可以告訴我，這個心情大概由甚麼時候開始出現嗎？`;
  }

  const replies = [
    "我聽見了。你願意講出來已經不容易。你可以慢慢說，我不會催你，也不會批判你。",
    "這件事聽起來對你來說真的有重量。你不是太敏感，而是這份感受對你很真實。",
    "我在。你不用把所有感受包裝好才說。就算只是零碎幾句，也可以。",
    "謝謝你把這些告訴我。或者我們先不用急著找答案，只是陪這份感覺坐一會。",
    "你現在最需要的，可能不是大道理，而是一個安全的位置。我會在這裡陪你整理。",
  ];

  return replies[Math.floor(Math.random() * replies.length)];
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

    setTimeout(() => {
      const aiMessage = {
        role: "ai",
        text: getCompanionReply(value, selectedMood),
        time: getTime(),
      };
      updateActiveConversation((conv) => ({
        ...conv,
        updatedAt: Date.now(),
        messages: [...conv.messages, aiMessage],
      }));
      setTyping(false);
      setSelectedMood(null);
    }, 900);
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
            <p>你好，我在這裡。今晚的你，想先被聽見哪一部分？</p>
            <p className="mt-1 text-right text-xs opacity-50">23:18</p>
          </div>
          <div className="flex justify-end">
            <div className="user-bubble message-bubble max-w-[82%]">
              <p>我有點孤單，但又不知道怎樣說。</p>
              <p className="mt-1 text-right text-xs opacity-60">23:19</p>
            </div>
          </div>
          <div className="ai-bubble message-bubble max-w-[90%]">
            <p>不用急著說清楚。能夠承認孤單，已經很勇敢。我會先陪你坐一會。</p>
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
