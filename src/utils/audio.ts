/**
 * 播放提示音。
 * 优先播放 public/pomodoro_done.wav；若该文件不可用（缺失/被拦截），则回退到 Web Audio 合成音。
 */
let audioEl: HTMLAudioElement | null = null

export function playChime(): void {
  try {
    if (!audioEl) {
      audioEl = new Audio('/pomodoro_done.wav')
      audioEl.preload = 'auto'
    }
    // 每次从头播放，支持连续多次触发
    audioEl.currentTime = 0
    const played = audioEl.play()
    if (played && typeof played.catch === 'function') {
      played.catch(() => playFallback())
    }
  } catch {
    // 播放失败时使用合成提示音兜底
    playFallback()
  }
}

// ---- 合成提示音（文件不可用时的回退方案）----
let audioCtx: AudioContext | null = null

function playFallback(): void {
  try {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!Ctor) return
    if (!audioCtx) audioCtx = new Ctor()
    if (audioCtx.state === 'suspended') void audioCtx.resume()

    const ctx = audioCtx
    const now = ctx.currentTime
    // A5、C#6、E6 三音叠加，听感更明亮
    const notes = [880, 1108.73, 1318.51]

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq

      const t = now + i * 0.18
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45)

      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.5)
    })
  } catch {
    // 忽略音频不可用的情况（如浏览器不支持）
  }
}
