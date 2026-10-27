/**
 * 页面加载时调用：请求通知权限（仅一次）。
 * 若用户此前已授权或已拒绝，则直接返回当前状态，不会重复弹窗。
 */
export async function requestNotificationPermission(): Promise<
  NotificationPermission | null
> {
  if (typeof Notification === 'undefined') return null
  // 已做出选择（granted / denied）则不再打扰
  if (Notification.permission !== 'default') return Notification.permission
  try {
    return await Notification.requestPermission()
  } catch {
    return Notification.permission
  }
}

/**
 * 发送桌面通知。
 * @param body 通知正文
 * @param title 通知标题，默认“番茄钟”
 */
export async function notify(
  body: string,
  title = '番茄钟',
): Promise<void> {
  if (typeof Notification === 'undefined') return
  try {
    // 仅当已授权时发送；页面加载阶段已申请过权限
    if (Notification.permission === 'granted') {
      new Notification(title, { body })
    }
  } catch {
    // 通知不可用或被拦截时忽略
  }
}
