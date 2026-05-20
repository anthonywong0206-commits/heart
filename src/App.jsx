
import { useEffect, useRef, useState } from 'react'
import { Send, Moon, Sun, Cat } from 'lucide-react'
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

export default function App() {
  const [dark, setDark] = useState(false)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('heart-chat')

    if (saved) return JSON.parse(saved)

    return [
      {
        role: 'assistant',
        text: '嗯，我在。\n\n今晚係咪有啲難捱？',
        time: getTime(),
      },
    ]
  })

  useEffect(() => {
    localStorage.setItem('heart-chat', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, typing])

  async function sendMessage() {
    if (!input.trim() || typing) return

    const userMessage = {
      role: 'user',
      text: input,
      time: getTime(),
    }

    const updated = [...messages, userMessage]

    setMessages(updated)

    const currentInput = input

    setInput('')
    setTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updated.map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.text,
          })),
        }),
      })

      const data = await response.json()

      const delay = getHumanDelay(currentInput, data.reply)

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.reply,
            time: getTime(),
          },
        ])

        setTyping(false)
      }, delay)
    } catch (error) {
      setTyping(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#f5f5f1] dark:bg-slate-950">
      <aside className="hidden w-80 border-r border-white/30 bg-white/60 backdrop-blur-xl md:block dark:bg-slate-900/80">
        <div className="p-5">
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">
            心伴 Companion
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            總有人願意聆聽你。
          </p>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/30 bg-white/70 px-4 py-3 backdrop-blur-xl dark:bg-slate-900/80">
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

          <button
            onClick={() => setDark(!dark)}
            className="rounded-full p-3 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        <section className="scrollbar-soft flex-1 overflow-y-auto bg-[linear-gradient(to_bottom,#f8fafc,#f1f5f9)] px-4 py-6 dark:bg-[linear-gradient(to_bottom,#020617,#0f172a)]">
          <div className="mx-auto max-w-4xl space-y-4">
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
                  className={`max-w-[82%] rounded-3xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-emerald-200 text-slate-900'
                      : 'bg-white text-slate-800 dark:bg-slate-800 dark:text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-7">
                    {message.text}
                  </p>

                  <div className="mt-1 text-right text-xs opacity-60">
                    {message.time}
                  </div>
                </div>
              </motion.div>
            ))}

            {typing && (
              <div className="rounded-3xl bg-white px-4 py-3 shadow-sm dark:bg-slate-800 w-fit">
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

        <div className="border-t border-white/30 bg-white/70 p-4 backdrop-blur-xl dark:bg-slate-900/80">
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
              onClick={sendMessage}
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
