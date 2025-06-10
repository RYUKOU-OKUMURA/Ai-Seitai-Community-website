-- コミュニティギャラリー データベーススキーマ
-- 作成日: 2024-06-10

-- ユーザーテーブル（Supabase Authと連携）
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 作品テーブル
CREATE TABLE works (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_urls TEXT[] NOT NULL, -- Cloudinary URL配列
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- いいねテーブル
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  work_id UUID REFERENCES works(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, work_id)
);

-- コメントテーブル
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  work_id UUID REFERENCES works(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 招待テーブル（Magic Link用）
CREATE TABLE invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  invited_by UUID REFERENCES profiles(id),
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_works_user_id ON works(user_id);
CREATE INDEX idx_works_created_at ON works(created_at DESC);
CREATE INDEX idx_likes_work_id ON likes(work_id);
CREATE INDEX idx_comments_work_id ON comments(work_id);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_email ON invitations(email);

-- RLS (Row Level Security) 設定

-- プロフィールのRLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "プロフィールは誰でも閲覧可能" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "ユーザーは自分のプロフィールのみ更新可能" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "ユーザーは自分のプロフィールのみ挿入可能" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 作品のRLS
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

CREATE POLICY "作品は誰でも閲覧可能" ON works
  FOR SELECT USING (true);

CREATE POLICY "ユーザーは自分の作品のみ挿入可能" ON works
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分の作品のみ更新可能" ON works
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分の作品のみ削除可能" ON works
  FOR DELETE USING (auth.uid() = user_id);

-- いいねのRLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "いいねは誰でも閲覧可能" ON likes
  FOR SELECT USING (true);

CREATE POLICY "ユーザーは自分のいいねのみ挿入可能" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分のいいねのみ削除可能" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- コメントのRLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "コメントは誰でも閲覧可能" ON comments
  FOR SELECT USING (true);

CREATE POLICY "ユーザーは自分のコメントのみ挿入可能" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分のコメントのみ更新可能" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分のコメントのみ削除可能" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- 招待のRLS（管理者のみ操作可能）
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "招待は管理者のみ操作可能" ON invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND email = 'admin@example.com'
    )
  );

-- トリガー関数：更新時刻の自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガー作成
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_works_updated_at 
  BEFORE UPDATE ON works 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
  BEFORE UPDATE ON comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- サンプルデータ挿入用の関数
CREATE OR REPLACE FUNCTION insert_sample_data()
RETURNS void AS $$
BEGIN
  -- サンプルプロフィール（実際のauth.usersレコードが必要）
  -- これは手動でユーザー登録後に実行する
  
  -- サンプル招待（開発用）
  INSERT INTO invitations (email, token, expires_at) VALUES
  ('test1@example.com', 'sample_token_1', NOW() + INTERVAL '7 days'),
  ('test2@example.com', 'sample_token_2', NOW() + INTERVAL '7 days');
  
END;
$$ LANGUAGE plpgsql;