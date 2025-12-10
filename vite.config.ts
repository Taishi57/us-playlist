import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  base: '/us-playlist/', // 👈 この行を追加 (前後のスラッシュ / を忘れずに)
})
