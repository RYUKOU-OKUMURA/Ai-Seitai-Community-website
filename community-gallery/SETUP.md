# コミュニティギャラリー セットアップ手順

## 前提条件
- Node.js 18以上
- npm または yarn
- Supabaseアカウント
- Cloudinaryアカウント

## 1. 依存関係のインストール

```bash
npm install
```

## 2. Supabaseプロジェクトのセットアップ

### 2.1 Supabaseでプロジェクト作成
1. [Supabase](https://supabase.com)にログイン
2. 「New Project」をクリック
3. プロジェクト名：`community-gallery`
4. データベースパスワードを設定
5. リージョンを選択（日本の場合：Northeast Asia (Tokyo)）

### 2.2 データベーステーブル作成
1. Supabaseダッシュボードの「SQL Editor」に移動
2. `supabase-schema.sql`の内容をコピー&ペースト
3. 「Run」を実行してテーブルを作成

### 2.3 認証設定
1. 「Authentication」→「Settings」に移動
2. 「Site URL」を設定：
   - 開発環境：`http://localhost:3000`
   - 本番環境：実際のドメイン
3. 「Redirect URLs」に追加：
   - `http://localhost:3000/auth/callback`
   - `本番ドメイン/auth/callback`

## 3. Cloudinaryプロジェクトのセットアップ

### 3.1 Cloudinaryアカウント作成
1. [Cloudinary](https://cloudinary.com)でアカウント作成
2. ダッシュボードから「Cloud Name」を確認

### 3.2 Upload Preset作成
1. 「Settings」→「Upload」に移動
2. 「Add upload preset」をクリック
3. 設定：
   - Preset name: `community_gallery_preset`
   - Signing Mode: `Unsigned`
   - Folder: `community-gallery`
   - Allowed formats: `jpg,png,gif,webp`
   - Max file size: `10000000` (10MB)
   - Image and video transformations:
     - Quality: `auto`
     - Format: `auto`

## 4. 環境変数の設定

`.env.local`ファイルを編集：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 値の取得方法

**Supabase:**
1. プロジェクトダッシュボード
2. 「Settings」→「API」
3. 「Project URL」と「Project API keys」をコピー

**Cloudinary:**
1. ダッシュボード
2. 「Account Details」セクションから各値をコピー

## 5. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセス

## 6. 初期データの作成

### 6.1 管理者ユーザーの作成
1. `/auth/login`ページで管理者メールアドレスを入力
2. Magic Linkでログイン
3. 自動的にプロフィールが作成される

### 6.2 招待トークンの作成（開発用）
Supabaseダッシュボードの「Table Editor」で`invitations`テーブルに手動でレコード追加：

```sql
INSERT INTO invitations (email, token, expires_at) VALUES
('user1@example.com', 'invite_token_1', NOW() + INTERVAL '7 days'),
('user2@example.com', 'invite_token_2', NOW() + INTERVAL '7 days');
```

## 7. 動作確認

1. **ログイン機能**：`/auth/login`でMagic Link送信
2. **作品投稿**：`/upload`で画像アップロード
3. **作品一覧**：トップページで作品表示
4. **作品詳細**：作品クリックでいいね・コメント

## トラブルシューティング

### Supabase接続エラー
- 環境変数の値を再確認
- Supabaseプロジェクトが「Active」状態か確認

### Cloudinaryアップロードエラー
- Upload Presetが「Unsigned」に設定されているか確認
- CORSエラーの場合、Cloudinaryの設定を確認

### 認証エラー
- Redirect URLsの設定を確認
- メール送信設定（SMTP）を確認

## 次のステップ

1. **本番デプロイ**：Vercelへのデプロイ設定
2. **機能拡張**：タグフィルタ、通知機能の実装
3. **パフォーマンス最適化**：画像最適化、キャッシュ設定

## 参考資料

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)