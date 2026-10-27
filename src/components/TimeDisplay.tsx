import type { PomodoroMode } from '../hooks/usePomodoro'

interface TimeDisplayProps {
  /** MM:SS 字符串 */
  formatted: string
  /** 进度比例 0~1 */
  progress: number
  mode: PomodoroMode
}

const RADIUS = 140
const STROKE = 12
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * 时间与进度环形展示组件。
 * 圆环随进度填充，颜色随工作/休息模式切换。
 */
export default function TimeDisplay({
  formatted,
  progress,
  mode,
}: TimeDisplayProps) {
  const gradientId = mode === 'work' ? 'grad-work' : 'grad-break'
  // 进度越大，dashoffset 越小
  const offset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="relative flex items-center justify-center animate-fade-in">
      <svg width="320" height="320" viewBox="0 0 320 320" className="-rotate-90">
        <defs>
          {/* 工作模式：番茄红 → 橙 */}
          <linearGradient id="grad-work" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          {/* 休息模式：翡翠绿 → 青 */}
          <linearGradient id="grad-break" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* 底环 */}
        <circle
          cx="160"
          cy="160"
          r={RADIUS}
          stroke="#1f1f1f"
          strokeWidth={STROKE}
          fill="none"
        />
        {/* 进度环 */}
        <circle
          cx="160"
          cy="160"
          r={RADIUS}
          stroke={`url(#${gradientId})`}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-300 ease-linear"
        />
      </svg>

      {/* 中心时间文字 */}
      <div className="absolute flex flex-col items-center">
        <span className="text-6xl font-bold tabular-nums tracking-wider text-white sm:text-7xl">
          {formatted}
        </span>
      </div>
    </div>
  )
}
