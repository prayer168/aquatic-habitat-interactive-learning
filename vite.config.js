import { resolve } from 'path'
import { defineConfig } from 'vite'

// GitHub Pages 子路徑：發布時的 repository 名稱
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        know: resolve(__dirname, 'know.html'),
        plants: resolve(__dirname, 'plants.html'),
        animals: resolve(__dirname, 'animals.html'),
        cherish: resolve(__dirname, 'cherish.html'),
        quiz: resolve(__dirname, 'quiz.html'),
        resources: resolve(__dirname, 'resources.html')
      }
    }
  }
})
