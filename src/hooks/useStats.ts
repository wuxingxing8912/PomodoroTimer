import { useCallback, useEffect, useMemo, useState } from 'react'

// 本地存储键：保存每次完成（工作阶段结束）的时间戳数组
const STORAGE_KEY = 'pomodoro_records'

/** 读取已保存的完成时间戳 */
function loadRecords(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr.filter((n) => typeof n === 'number') : []
  } catch {
    return []
  }
}

/** 当天 00:00 的时间戳 */
function startOfToday(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** 本周一 00:00 的时间戳（以周一为一周开始） */
function startOfWeek(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0=周日, 1=周一 ... 6=周六
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.getTime()
}

/**
 * 番茄钟统计 Hook。
 * 以时间戳数组形式持久化每次完成的时刻，
 * 由此派生出「今日完成」与「本周完成」数量。
 */
export function useStats() {
  const [records, setRecords] = useState<number[]>(loadRecords)

  // 持久化到 LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }, [records])

  // 记录一次完成（工作阶段结束）
  const addCompletion = useCallback(() => {
    const now = Date.now()
    // 仅保留近 14 天数据，避免无限增长
    const pruneBefore = now - 14 * 24 * 60 * 60 * 1000
    setRecords((prev) => [...prev.filter((t) => t >= pruneBefore), now])
  }, [])

  const todayCount = useMemo(
    () => records.filter((t) => t >= startOfToday()).length,
    [records],
  )

  const weekCount = useMemo(
    () => records.filter((t) => t >= startOfWeek()).length,
    [records],
  )

  return { todayCount, weekCount, addCompletion }
}
