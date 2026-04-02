# Patisserie Dashboard — Nuxt.js Demo

> **English** | [日本語](#日本語)

A data visualization dashboard demo built with **Nuxt 3**, showcasing SSR, reactive state management, Chart.js integration, and responsive design — all with zero external APIs or databases.

**Live Demo:** https://nuxtjs-demo-sandy.vercel.app/overview

---

## Features

- **4 dashboard pages** — Overview, Sales, Products, Users
- **Interactive charts** — Line, Bar, and Doughnut charts via Chart.js + vue-chartjs
- **Filter & search** — Period selector, category filter, keyword search, sort controls
- **Dark mode** — System preference detection + manual toggle
- **Responsive layout** — Mobile drawer sidebar, adaptive grid layouts
- **SSR + CSR hybrid** — Data fetched server-side via Nitro API routes; charts rendered client-side to avoid hydration issues
- **Type-safe** — Full TypeScript coverage across pages, stores, and API responses

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 3 (Vue 3 + Vite) |
| Language | TypeScript |
| Styling | Tailwind CSS + @nuxtjs/color-mode |
| State | Pinia 3 |
| Charts | Chart.js 4 + vue-chartjs |
| Server | Nitro (mock API routes, no DB) |
| Deploy | Vercel |

## Project Structure

```
pages/
  overview.vue   # KPI cards + monthly revenue chart
  sales.vue      # Period filter + bar/doughnut charts + category table
  products.vue   # Product grid with search, filter, sort
  users.vue      # User table with status/role filters
server/api/      # Nitro mock API routes (overview, sales, products, users)
components/
  AppSidebar.vue
  AppHeader.vue
  charts/        # .client.vue chart components (CSR only)
stores/          # Pinia store for shared filter state
composables/     # useSidebar (mobile drawer state)
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

Node.js 20+ recommended.

## License

[MIT](./LICENSE) © k-mawa

---

<a name="日本語"></a>

# Patisserie Dashboard — Nuxt.js デモ

> [English](#top) | **日本語**

**Nuxt 3** で構築したデータ可視化ダッシュボードのデモアプリです。SSR・リアクティブな状態管理・Chart.js によるグラフ描画・レスポンシブデザインを外部 API・DB なしで実装しています。

**ライブデモ:** https://nuxtjs-demo-sandy.vercel.app/overview

---

## 機能一覧

- **4ページ構成** — Overview・Sales・Products・Users
- **インタラクティブなグラフ** — 折れ線・棒・ドーナツチャート（Chart.js + vue-chartjs）
- **フィルター・検索** — 期間セレクター・カテゴリフィルター・キーワード検索・ソート
- **ダークモード** — システム設定の自動検出＋手動切り替え
- **レスポンシブ対応** — モバイルはドロワーサイドバー、グリッドレイアウトはブレークポイントで自動調整
- **SSR + CSR ハイブリッド** — データは Nitro API ルートでサーバーサイドフェッチ。グラフはハイドレーション問題を避けるため CSR レンダリング（`.client.vue`）
- **型安全** — ページ・ストア・API レスポンスを TypeScript でフルカバー

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | Nuxt 3（Vue 3 + Vite） |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS + @nuxtjs/color-mode |
| 状態管理 | Pinia 3 |
| グラフ | Chart.js 4 + vue-chartjs |
| サーバー | Nitro（モック API ルート、DB なし） |
| デプロイ | Vercel |

## ディレクトリ構成

```
pages/
  overview.vue   # KPI カード + 月次売上グラフ
  sales.vue      # 期間フィルター + 棒/ドーナツチャート + カテゴリ内訳
  products.vue   # 商品グリッド（検索・フィルター・ソート）
  users.vue      # ユーザーテーブル（ステータス・ロール別フィルター）
server/api/      # Nitro モック API ルート
components/
  AppSidebar.vue
  AppHeader.vue
  charts/        # .client.vue チャートコンポーネント（CSR のみ）
stores/          # 共有フィルター状態（Pinia ストア）
composables/     # useSidebar（モバイルドロワー状態管理）
```

## セットアップ

```bash
# 依存パッケージインストール
pnpm install

# 開発サーバー起動
pnpm dev

# プロダクションビルド
pnpm build
```

Node.js 20 以上推奨。

## ライセンス

[MIT](./LICENSE) © k-mawa
