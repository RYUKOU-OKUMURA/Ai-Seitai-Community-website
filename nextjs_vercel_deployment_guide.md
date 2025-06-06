# Next.js + GitHub Actions + Vercel 自動デプロイ詳細手順書

## 概要
この手順書では、Next.jsプロジェクトをGitHub Actionsを使ってVercelに自動デプロイする環境を構築します。

## 前提条件
- Node.js (v18以上推奨)
- Git
- GitHubアカウント
- Vercelアカウント

## 手順1: Next.jsプロジェクトの作成

### 1-1. プロジェクトの初期化
```bash
npx create-next-app --example with-turbopack
```

### 1-2. プロジェクト名の入力
プロンプトが表示されたら、プロジェクト名を入力します（例：`my-nextjs-app`）

### 1-3. プロジェクトディレクトリに移動
```bash
cd my-nextjs-app
```

### 1-4. 開発サーバーの起動確認
```bash
npm run dev
```
ブラウザで `http://localhost:3000` にアクセスし、「Hello, Next.js!」が表示されることを確認

### 1-5. 環境変数ファイルの作成
プロジェクトルートに `.env.local` ファイルを作成：
```bash
SAMPLE_SECRET_KEY=SAMPLE_SECRET_VALUE
```

### 1-6. ページファイルの更新
`app/page.tsx` を以下のように更新：
```tsx
export default function Page() {
  const key = process.env.SAMPLE_SECRET_KEY;
  return (
    <div>
      <h1>Hello, Next.js!</h1>
      <p>環境変数の値: {key}</p>
    </div>
  );
}
```

## 手順2: GitHubリポジトリの作成とプッシュ

### 2-1. GitHubで新しいリポジトリを作成
1. GitHub（https://github.com）にログイン
2. 「New repository」をクリック
3. リポジトリ名を入力（例：`next-sample-app`）
4. 「Create repository」をクリック

### 2-2. ローカルリポジトリの初期化
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2-3. リモートリポジトリの追加
```bash
git remote add origin https://github.com/[ユーザー名]/[リポジトリ名].git
git branch -M main
git push -u origin main
```

## 手順3: Vercelでの手動デプロイ

### 3-1. Vercel CLIのインストール
```bash
npm install -g vercel
```

### 3-2. Vercelにログイン
```bash
vercel login
```
ブラウザが開くので、GitHubアカウントでログインします。

### 3-3. プロジェクトのデプロイ
```bash
vercel --prod
```

デプロイ時の質問に対する回答例：
- **Set up and deploy**? → `y`
- **Which scope do you want to deploy to?** → 自分のアカウントを選択
- **What's your project's name?** → デフォルト値またはカスタム名
- **In which directory is your code located?** → `./`
- **Want to modify these settings?** → `n`

### 3-4. デプロイメントの確認
デプロイが完了すると、Production URLが表示されます。ブラウザでアクセスして動作を確認します。

## 手順4: Vercelの環境変数設定

### 4-1. Vercelダッシュボードにアクセス
https://vercel.com/dashboard にアクセス

### 4-2. プロジェクト設定画面を開く
1. デプロイしたプロジェクトをクリック
2. 「Settings」タブをクリック
3. 左側メニューから「Environment Variables」を選択

### 4-3. 環境変数の追加
1. 「Add New」ボタンをクリック
2. 以下の情報を入力：
   - **Name**: `SAMPLE_SECRET_KEY`
   - **Value**: `SAMPLE_SECRET_VALUE`
   - **Environment**: `Production`, `Preview`, `Development` すべてにチェック
3. 「Save」をクリック

## 手順5: GitHub Actionsの設定

### 5-1. ワークフローディレクトリの作成
```bash
mkdir -p .github/workflows
```

### 5-2. ワークフローファイルの作成
`.github/workflows/deploy.yml` ファイルを作成し、以下の内容を記述：

```yaml
name: GitHub Auto Deploy

on:
  push:
    branches:
      - main

env:
  VERCEL_ORG_ID: ${{ secrets.ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 手順6: GitHub Secretsの設定

### 6-1. VERCEL_TOKENの取得
1. Vercelダッシュボード（https://vercel.com/dashboard）にアクセス
2. 右上のアイコンをクリック → 「Account Settings」を選択
3. 左側メニューから「Tokens」を選択
4. 「Create Token」をクリック
5. トークン名を入力（例：`VERCEL_TOKEN`）
6. スコープで「Full Account」を選択
7. 有効期限を設定（例：30日）
8. 「Create」をクリック
9. 表示されたトークンをコピー（一度しか表示されません）

### 6-2. ORG_IDとPROJECT_IDの取得
1. Vercelプロジェクトのルートディレクトリで以下のコマンドを実行：
```bash
vercel --prod
```
2. `.vercel/project.json` ファイルが作成されます
3. ファイルの内容から `orgId` と `projectId` の値をコピー

### 6-3. GitHub Secretsの登録
1. GitHubリポジトリページにアクセス
2. 「Settings」タブをクリック
3. 左側メニューから「Secrets and variables」→「Actions」を選択
4. 「New repository secret」をクリックし、以下の3つのシークレットを追加：

**VERCEL_TOKEN**
- Name: `VERCEL_TOKEN`
- Secret: 手順6-1で取得したトークン

**ORG_ID**
- Name: `ORG_ID`
- Secret: `.vercel/project.json` の `orgId` の値

**PROJECT_ID**
- Name: `PROJECT_ID`
- Secret: `.vercel/project.json` の `projectId` の値

## 手順7: 自動デプロイのテスト

### 7-1. コードの変更
`app/page.tsx` の内容を一部変更します：
```tsx
export default function Page() {
  const key = process.env.SAMPLE_SECRET_KEY;
  return (
    <div>
      <h1>Hello, Next.js!</h1>
      <p>GitHub Actionsで自動デプロイしました。</p>
      <p>環境変数の値: {key}</p>
    </div>
  );
}
```

### 7-2. 変更をコミット・プッシュ
```bash
git add .
git commit -m "GitHub Actionsのテスト"
git push origin main
```

### 7-3. GitHub Actionsの動作確認
1. GitHubリポジトリページの「Actions」タブをクリック
2. ワークフローの実行状況を確認
3. 全てのステップが成功することを確認

### 7-4. デプロイ結果の確認
1. VercelダッシュボードでデプロイメントのURLを確認
2. ブラウザでアクセスし、変更が反映されていることを確認

## トラブルシューティング

### よくあるエラーと対処法

**1. `vercel --prod` コマンドでエラーが発生する場合**
- Vercelにログインしているか確認: `vercel whoami`
- 再ログイン: `vercel logout` → `vercel login`

**2. GitHub Actionsでビルドエラーが発生する場合**
- 環境変数が正しく設定されているか確認
- `.env.local` をGitにコミットしていないか確認（このファイルは秘密情報を含むためコミットしない）

**3. 環境変数が反映されない場合**
- Vercelダッシュボードで環境変数が正しく設定されているか確認
- GitHub Secretsが正しく設定されているか確認

**4. プレビューデプロイが期待通りに動作しない場合**
- ワークフローファイルの `--prod` フラグなしで実行する
- Vercelの環境変数でPreview環境が有効になっているか確認

## まとめ

この手順により、Next.jsプロジェクトのGitHub Actionsを使った自動デプロイ環境が構築できました。今後は `main` ブランチにプッシュするたびに、自動的にVercelにデプロイされます。

### 完成した構成
- **開発**: ローカル環境での開発
- **バージョン管理**: GitHub
- **CI/CD**: GitHub Actions
- **ホスティング**: Vercel
- **環境変数管理**: VercelダッシュボードとGitHub Secrets