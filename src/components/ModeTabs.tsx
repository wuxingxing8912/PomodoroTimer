import type { PomodoroMode } from '../hooks/usePomodoro'

interface ModeTabsProps {
  mode: PomodoroMode
  workMinutes: number
  breakMinutes: number
  onSelect: (mode: PomodoroMode) => void
}

/**
 * 模式切换标签：工作 / 休息。
 */
export default function ModeTabs({
  mode,
  workMinutes,
  breakMinutes,
  onSelect,
}: ModeTabsProps) {
  const tabs: { key: PomodoroMode; label: string; minutes: number }[] = [
    { key: 'work', label: '工作', minutes: workMinutes },
    { key: 'break', label: '休息', minutes: breakMinutes },
  ]

  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
      {tabs.map((tab) => {
        const active = tab.key === mode
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelect(tab.key)}
            className={[
              'rounded-full px-6 py-2 text-sm font-medium transition',
              active
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow'
                : 'text-white/60 hover:text-white',
            ].join(' ')}
          >
            {tab.label} {tab.minutes}min
          </button>
        )
      })}
    </div>
  )
}
