# トラブルシューティング記録

## サーバーアクセス問題の解決記録

### 発生した問題
- Next.js開発サーバーが頻繁に停止する
- ブラウザでアクセスできない（localhost:3000に接続できない）
- プライベートモードでもアクセスできない

### 調査・診断プロセス

#### 1. 初期調査
```bash
# プロセス確認
ps aux | grep -E "(next|node)" | grep -v grep

# ポート使用状況確認
lsof -i :3000
lsof -i :3001

# サーバー応答テスト
curl -I http://localhost:3000
```

#### 2. 発見された根本原因

1. **環境変数の未設定**
   - `.env.local`が正しい場所に配置されていない
   - Supabase環境変数が未設定でクライアント初期化に失敗
   - エラー: `supabaseUrl is required`

2. **ESLintエラー**
   - TypeScript型エラー（`any`型の使用）
   - 未使用変数の警告
   - ビルドプロセスの中断

3. **ポートの競合**
   - ポート3000が他のプロセスで使用されている可能性
   - macOSのAirPlayレシーバーによる占有

4. **Turbopackの不安定性**
   - 頻繁なクラッシュ
   - メモリリーク
   - ファイル監視の問題

### 実施した解決策

#### Step 1: ESLintエラーの修正
```bash
# 修正箇所
src/app/auth/callback/page.tsx: 未使用変数の削除
src/app/auth/login/page.tsx: any型をunknown型に変更
src/lib/auth.ts: any型をunknown型に変更

# 確認
npx next lint --fix
npx tsc --noEmit
```

#### Step 2: 環境変数の設定
```bash
# 正しい場所に移動
mv /Users/.../コミュニティサイト制作/.env.local /Users/.../community-gallery/.env.local

# ダミー値での設定
NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy_anon_key_for_development_only
```

#### Step 3: 代替ポートでの起動
```bash
# ポート3001での起動
PORT=3001 npm run dev

# アクセス確認
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001
```

#### Step 4: Turbopackの無効化
```json
// package.json修正前
"scripts": {
  "dev": "next dev --turbopack"
}

// package.json修正後
"scripts": {
  "dev": "next dev",
  "dev:turbo": "next dev --turbopack"
}
```

#### Step 5: Next.js設定の最適化
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: './empty-module.js',
      },
    },
  },
  // ファイル監視の最適化
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      }
    }
    return config
  },
}
```

### 最終的な解決方法

1. **環境変数ファイルを正しい場所に配置**
2. **TypeScript/ESLintエラーを修正**
3. **Turbopackを無効化して安定性向上**
4. **ポート3000で正常起動を確認**

### 予防策・ベストプラクティス

#### 1. 環境変数チェックリスト
- [ ] `.env.local`がプロジェクトルートに存在する
- [ ] 必要な環境変数がすべて設定されている
- [ ] ダミー値でも構文が正しい

#### 2. 開発サーバー安定化
```bash
# 定期的な再起動（2-3時間ごと）
npm run dev

# メモリ使用量確認
ps aux | grep node | awk '{print $4, $11}'

# キャッシュクリア
rm -rf .next && npm run dev
```

#### 3. トラブル時の対処手順
```bash
# 1. プロセス確認
lsof -i :3000

# 2. 強制終了
pkill -f "next dev"

# 3. 再起動
npm run dev

# 4. 応答確認
curl -I http://localhost:3000
```

#### 4. 監視スクリプトの活用
```bash
# サーバー起動
./dev-server-monitor.sh start

# 状態確認
./dev-server-monitor.sh status

# ログ確認
./dev-server-monitor.sh logs

# 再起動
./dev-server-monitor.sh restart
```

### エラーパターンと対処法

| エラー | 原因 | 対処法 |
|--------|------|--------|
| `supabaseUrl is required` | 環境変数未設定 | `.env.local`をプロジェクトルートに配置 |
| `Failed to connect to localhost` | サーバー停止 | `npm run dev`で再起動 |
| `EADDRINUSE: address already in use` | ポート占有 | 別ポート使用またはプロセス終了 |
| ESLint errors | 型エラー | `npx next lint --fix`で修正 |
| 頻繁なクラッシュ | Turbopack不安定 | `--turbopack`オプション削除 |

### 成功時のチェックリスト

- [ ] `npm run dev`でエラーなく起動
- [ ] `http://localhost:3000`でアクセス可能
- [ ] コンソールエラーがない
- [ ] ページが正常に表示される
- [ ] ホットリロードが動作する

### メンテナンス推奨事項

#### 毎日
- サーバーの動作確認
- コンソールエラーのチェック

#### 週1回
- `.next`フォルダのクリア
- `npm run build`でビルド確認
- 依存関係の更新確認

#### 月1回
- Node.jsバージョンの確認
- Next.jsバージョンの確認
- 不要なファイルの削除

---

**最終更新日**: 2024-06-10  
**最終確認**: http://localhost:3000 でアクセス可能  
**推奨環境**: Node.js 18+, npm 9+