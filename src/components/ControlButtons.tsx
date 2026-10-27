interface ControlButtonsProps {
  isRunning: boolean
  onToggle: () => void
  onReset: () => void
}

/**
 * 控制按钮组：开始/暂停（主按钮）+ 重置（次按钮）。
 */
export default function ControlButtons({
  isRunning,
  onToggle,
  onReset,
}: ControlButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={onToggle}
        className="rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-10 py-3 text-lg font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:scale-105 hover:shadow-rose-500/40 active:scale-95"
      >
        {isRunning ? '暂停' : '开始'}
      </button>

      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-lg font-medium text-white/80 transition hover:bg-white/10 hover:text-white active:scale-95"
      >
        重置
      </button>
    </div>
  )
}
