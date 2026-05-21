import { useEffect, useRef, useState } from 'react'
import { Send, Moon, Sun, Cat, Trash2, Wind, Volume2, HeartHandshake } from 'lucide-react'
import { motion } from 'framer-motion'

function getTime() {
  return new Date().toLocaleTimeString('zh-HK', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getHumanDelay(userText, aiText) {
  const reading = Math.min(userText.length * 30, 1800)
  const typing = Math.min(aiText.length * 25, 3000)
  return reading + typing + Math.random() * 1200 + 1000
}

const starterMessage = {
  role: 'assistant',
  text: '嗯，我在。\\n\\n你可以慢慢講。\\n\\n今晚係咪有啲難捱？',
  time: getTime(),
}

const moods = [
  '😔 有點低落',
  '😟 有點焦慮',
  '🥺 想有人陪',
  '😶 說不出口',
  '🙂 想被鼓勵',
]

const backgrounds = [
  { name: '米白', className: 'bg-[#f5f5f1]' },
  { name: '夜空', className: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900' },
  { name: '雨天窗邊', className: 'bg-gradient-to-br from-slate-200 via-blue-100 to-slate-100' },
  { name: '淺綠', className: 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50' },
]

export default function App() {
  const [dark, setDark] = useState(false)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [background, setBackground] = useState(backgrounds[0])
  const [breathing, setBreathing] = useState(false)

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('heart-chat')
    if (saved) return JSON.parse(saved)
    return [starterMessage]
  })

  useEffect(() => {
    localStorage.setItem('heart-chat', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function clearChat() {
    const confirmClear = window.confirm('確定要清除所有聊天紀錄？')
    if (!confirmClear) return
    const fresh = [{ ...starterMessage, time: getTime() }]
    setMessages(fresh)
    localStorage.setItem('heart-chat', JSON.stringify(fresh))
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-HK'
    utterance.rate = 0.92
    window.speechSynthesis.speak(utterance)
  }

  async function sendMessage(customText) {
    const finalInput = (customText || input).trim()
    if (!finalInput || typing) return

    const userMessage = {
      role: 'user',
      text: finalInput,
      time: getTime(),
    }

    const updated = [...messages, userMessage]
    setMessages(updated)

    const currentInput = finalInput
    setInput('')
    setTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.slice(-12).map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.text,
          })),
        }),
      })

      const data = await response.json()
      const reply = data.reply || '嗯……我在。你可以再講多少少嗎？'
      const delay = getHumanDelay(currentInput, reply)

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: reply,
            time: getTime(),
          },
        ])
        setTyping(false)
      }, delay)
    } catch (error) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: '嗯……我好似有少少連線問題。\\n\\n但我仲喺度。你可以再講一次嗎？',
            time: getTime(),
          },
        ])
        setTyping(false)
      }, 1200)
    }
  }

  return (
    <div className={`flex h-screen ${background.className} dark:bg-slate-950`}>
      <aside className="hidden w-80 border-r border-white/30 bg-white/65 backdrop-blur-xl md:block dark:bg-slate-900/80">
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 dark:bg-emerald-900">
              <HeartHandshake className="text-emerald-700 dark:text-emerald-200" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white">
                心伴 Companion
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                總有人願意聆聽你。
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-200">
            今日小提醒：
            <br />
            今晚可以唔使咁堅強。
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-bold text-slate-500">心情快捷</p>
            <div className="space-y-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => sendMessage(`我而家嘅心情係：${mood}`)}
                  className="w-full rounded-2xl bg-white/70 px-4 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50 dark:bg-slate-800 dark:text-slate-200"
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/30 bg-white/75 px-4 py-3 backdrop-blur-xl dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 dark:bg-emerald-900">
              <Cat className="text-emerald-700 dark:text-emerald-200" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"></span>
            </div>

            <div>
              <h2 className="font-bold text-slate-800 dark:text-white">
                Virtual Companion
              </h2>
              <p className="text-xs text-emerald-600">
                正在陪伴你
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setBreathing(!breathing)}
              className="rounded-full p-3 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
              title="呼吸練習"
            >
              <Wind size={18} className="text-emerald-600" />
            </button>

            <button
              onClick={clearChat}
              className="rounded-full p-3 hover:bg-red-100 dark:hover:bg-red-900/40"
              title="清除聊天"
            >
              <Trash2 size={18} className="text-red-500" />
            </button>

            <button
              onClick={() => setDark(!dark)}
              className="rounded-full p-3 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="深色模式"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto border-b border-white/30 bg-white/50 px-4 py-2 backdrop-blur-xl dark:bg-slate-900/60">
          {backgrounds.map((bg) => (
            <button
              key={bg.name}
              onClick={() => setBackground(bg)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
                background.name === bg.name
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {bg.name}
            </button>
          ))}
        </div>

        <section className="scrollbar-soft flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto max-w-4xl space-y-4">
            {breathing && (
              <div className="rounded-3xl bg-emerald-50 p-4 text-slate-700 shadow-sm dark:bg-emerald-950 dark:text-emerald-50">
                <div className="mb-2 font-bold">慢慢呼吸</div>
                <p className="text-sm leading-6">
                  吸氣 4 秒，停一停，呼氣 6 秒。
                  <br />
                  先唔急住解決所有事。
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`group max-w-[82%] rounded-3xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-emerald-200 text-slate-900'
                      : 'bg-white text-slate-800 dark:bg-slate-800 dark:text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-7">
                    {message.text}
                  </p>

                  <div className="mt-1 flex items-center justify-end gap-2 text-xs opacity-60">
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => speak(message.text)}
                        className="opacity-0 transition group-hover:opacity-100"
                        title="朗讀"
                      >
                        <Volume2 size={13} />
                      </button>
                    )}
                    <span>{message.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {typing && (
              <div className="w-fit rounded-3xl bg-white px-4 py-3 shadow-sm dark:bg-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"></span>
                  </div>

                  <span className="text-sm text-slate-500">
                    AI 正在輸入中…
                  </span>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </section>

        <div className="border-t border-white/30 bg-white/75 p-4 backdrop-blur-xl dark:bg-slate-900/80">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="輸入你的心情…"
              rows={1}
              className="max-h-32 flex-1 resize-none rounded-3xl border border-slate-200 bg-white px-5 py-3 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />

            <button
              onClick={() => sendMessage()}
              className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
