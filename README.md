# 心伴 Companion

一個 WhatsApp 風格的 AI 情緒陪伴聊天網站。

## 功能

- WhatsApp 風格聊天介面
- 首頁 Landing Page
- 左側聊天列表
- 新增對話
- localStorage 儲存聊天紀錄
- 深色模式
- 聊天背景切換
- 心情選擇器
- AI 正在輸入動畫
- 自動捲動到底部
- AI 語音播放
- 每日一句鼓勵
- 呼吸動畫
- 睡眠模式 / 冥想模式
- 手機優先響應式設計

## 本機運行

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
```

## 部署到 Vercel

1. 將整個資料夾上載到 GitHub
2. 到 Vercel 匯入 GitHub Repository
3. Framework 選 Vite
4. Build command: `npm run build`
5. Output directory: `dist`

## 部署到 GitHub Pages

1. 先執行：
```bash
npm install
npm run build
```

2. 將 `dist` 資料夾內容部署到 GitHub Pages。

注意：如果你的 GitHub Pages 網址是 `username.github.io/repo-name/`，可能需要在 `vite.config.js` 加入：

```js
export default defineConfig({
  plugins: [react()],
  base: "/repo-name/"
})
```

## AI API 說明

目前版本使用前端模擬 AI 回覆，適合靜態部署到 GitHub Pages。
如要接入 OpenAI API，建議使用 Vercel Serverless Function，避免 API Key 暴露在前端。


## Vercel Final Fix

This version pins exact dependency versions:

- Vite 5.4.11
- React 18.3.1
- Tailwind CSS 3.4.17
- PostCSS 8.4.49
- Autoprefixer 10.4.20

This avoids Vercel installing Tailwind CSS v4 or Vite v8 unexpectedly.

Important:
After uploading these files to GitHub, make sure the new commit appears in Vercel.
If Vercel still shows the old commit hash, your GitHub repository has not been updated successfully.
