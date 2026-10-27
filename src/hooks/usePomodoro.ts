import { useCallback, useEffect, useRef, useState } from 'react'

// 番茄钟模式：工作 / 休息
export type PomodoroMode = 'work' | 'break'

export interface UsePomodoroOptions {
  workMinutes: number
  breakMinutes: number
  /** 倒计时结束时的回调，参数为刚刚结束的阶段 */
  onComplete?: (completedMode: PomodoroMode) => void
}

export interface UsePomodoroReturn {
  mode: PomodoroMode
  isRunning: boolean
  /** 剩余秒数 */
  remaining: number
  /** 格式化的 MM:SS 字符串 */
  formatted: string
  /** 进度比例 0~1 */
  progress: number
  workMinutes: number
  breakMinutes: number
  start: () => void
  pause: () => void
  /** 开始/暂停切换 */
  toggle: () => void
  /** 重置为当前模式的初始时长 */
  reset: () => void
  /** 手动切换模式（会暂停） */
  setMode: (mode: PomodoroMode) => void
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/**
 * 番茄钟核心逻辑 Hook。
 * 使用基于时间戳的计时方式，避免 setInterval 累积误差。
 */
export function usePomodoro({
  workMinutes,
  breakMinutes,
  onComplete,
}: UsePomodoroOptions): UsePomodoroReturn {
  // 根据模式计算总秒数
  const totalFor = useCallback(
    (m: PomodoroMode) => (m === 'work' ? workMinutes : breakMinutes) * 60,
    [workMinutes, breakMinutes],
  )

  const [mode, setModeState] = useState<PomodoroMode>('work')
  const [isRunning, setIsRunning] = useState(false)
  const [remaining, setRemaining] = useState(() => totalFor('work'))

  // 目标结束时间（时间戳），用于精确计算剩余
  const endRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)

  // 用 ref 持有最新回调，避免将其加入 effect 依赖
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // 仅在开始/暂停状态变化时重建计时器
  useEffect(() => {
    if (!isRunning) {
      clearTimer()
      return
    }

    // 以当前剩余秒数推算目标结束时间
    endRef.current = Date.now() + remaining * 1000

    intervalRef.current = window.setInterval(() => {
      const msLeft = (endRef.current as number) - Date.now()
      if (msLeft <= 0) {
        clearTimer()
        setIsRunning(false)
        const completed = mode
        const next: PomodoroMode = completed === 'work' ? 'break' : 'work'
        setModeState(next)
        setRemaining(totalFor(next))
        onCompleteRef.current?.(completed)
      } else {
        setRemaining(Math.ceil(msLeft / 1000))
      }
    }, 200)

    return clearTimer
    // 注意：刻意仅依赖 isRunning，remaining/mode 在启动瞬间已捕获
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, clearTimer])

  // 格式化 MM:SS
  const formatted = `${pad(Math.floor(remaining / 60))}:${pad(remaining % 60)}`
  const total = totalFor(mode)
  const progress = total > 0 ? (total - remaining) / total : 0

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const toggle = useCallback(() => setIsRunning((r) => !r), [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setRemaining(totalFor(mode))
  }, [mode, totalFor])

  const setMode = useCallback(
    (next: PomodoroMode) => {
      setIsRunning(false)
      setModeState(next)
      setRemaining(totalFor(next))
    },
    [totalFor],
  )

  // 卸载时清理定时器
  useEffect(() => clearTimer, [clearTimer])

  return {
    mode,
    isRunning,
    remaining,
    formatted,
    progress,
    workMinutes,
    breakMinutes,
    start,
    pause,
    toggle,
    reset,
    setMode,
  }
}
