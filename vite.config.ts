import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 配置：启用 React 插件
export default defineConfig({
  plugins: [react()],
})
