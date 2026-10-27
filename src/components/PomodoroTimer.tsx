import { useEffect } from 'react'
import { usePomodoro, type PomodoroMode } from '../hooks/usePomodoro'
import { useStats } from '../hooks/useStats'
import TimeDisplay from './TimeDisplay'
import ControlButtons from './ControlButtons'
import ModeTabs from './ModeTabs'
import { playChime } from '../utils/audio'
import { notify } from '../utils/notify'

// 默认时长：工作 25 分钟，休息 5 分钟
const WORK_MINUTES = 25
const BREAK_MINUTES = 5

export default function PomodoroTimer() {
  // 统计：今日 / 本周完成的番茄钟数量
  const { todayCount, weekCount, addCompletion } = useStats()

  // 倒计时结束：播放提示音 + 桌面通知 + 统计
  const handleComplete = (completedMode: PomodoroMode) => {
    playChime()
    if (completedMode === 'work') {
      addCompletion()
      // 标题默认“番茄钟”，正文按规范为“时间到了，该休息了！”
      void notify('时间到了，该休息了！')
    } else {
      void notify('时间到了，开始下一个番茄钟吧！')
    }
  }

  const {
    mode,
    isRunning,
    formatted,
    progress,
    workMinutes,
    breakMinutes,
    toggle,
    reset,
    setMode,
  } = usePomodoro({
    workMinutes: WORK_MINUTES,
    breakMinutes: BREAK_MINUTES,
    onComplete: handleComplete,
  })

  const modeLabel = mode === 'work' ? '专注工作' : '放松休息'

  // 同步浏览器标题，便于在后台也能看到剩余时间
  useEffect(() => {
    document.title = `${formatted} · ${modeLabel}`
  }, [formatted, modeLabel])

  return (
    <section className="flex w-full max-w-md flex-col items-center gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm">
      <ModeTabs
        mode={mode}
        workMinutes={workMinutes}
        breakMinutes={breakMinutes}
        onSelect={setMode}
      />

      <p
        className={[
          'text-sm font-medium tracking-wide',
          mode === 'work' ? 'text-rose-300' : 'text-emerald-300',
        ].join(' ')}
      >
        {modeLabel}
        {isRunning && <span className="ml-2 animate-pulse-soft">●</span>}
      </p>

      <TimeDisplay formatted={formatted} progress={progress} mode={mode} />

      <ControlButtons isRunning={isRunning} onToggle={toggle} onReset={reset} />

      {/* 统计：今日 / 本周完成数量 */}
      <div className="grid w-full grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-3xl font-bold text-white tabular-nums">
            {todayCount}
          </div>
          <div className="mt-1 text-xs text-white/50">今日完成</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-3xl font-bold text-white tabular-nums">
            {weekCount}
          </div>
          <div className="mt-1 text-xs text-white/50">本周完成</div>
        </div>
      </div>
    </section>
  )
}
