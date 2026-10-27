import { useEffect } from 'react'
import PomodoroTimer from './components/PomodoroTimer'
import { requestNotificationPermission } from './utils/notify'

export default function App() {
  // 页面加载时请求通知权限（仅一次）
  useEffect(() => {
    void requestNotificationPermission()
  }, [])

  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-10 px-4 py-12">
      <header className="text-center animate-fade-in">
        <h1 className="bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          番茄钟计时器
        </h1>
        <p className="mt-3 text-sm text-white/50">
          工作 25 分钟，休息 5 分钟，专注每一刻。
        </p>
      </header>

      <PomodoroTimer />

      <footer className="text-center text-xs text-white/30">
        使用 React · TypeScript · Tailwind CSS 构建
      </footer>
    </main>
  )
}
