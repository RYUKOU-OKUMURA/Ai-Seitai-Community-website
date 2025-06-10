// Supabaseデータベース型定義

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Work {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_urls: string[];
  tags: string[];
  view_count: number;
  created_at: string;
  updated_at: string;
  // リレーション
  profiles?: Profile;
  likes?: Like[];
  comments?: Comment[];
}

export interface Like {
  id: string;
  user_id: string;
  work_id: string;
  created_at: string;
  // リレーション
  profiles?: Profile;
}

export interface Comment {
  id: string;
  user_id: string;
  work_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  // リレーション
  profiles?: Profile;
}

export interface Invitation {
  id: string;
  email: string;
  token: string;
  invited_by: string | null;
  used_at: string | null;
  expires_at: string;
  created_at: string;
}

// API レスポンス型
export interface WorkWithDetails extends Work {
  profiles: Profile;
  likes: Like[];
  comments: (Comment & { profiles: Profile })[];
  like_count: number;
  comment_count: number;
  is_liked_by_user: boolean;
}

// フォーム用の型
export interface WorkCreateInput {
  title: string;
  description?: string;
  image_urls: string[];
  tags?: string[];
}

export interface CommentCreateInput {
  work_id: string;
  content: string;
}

export interface ProfileUpdateInput {
  display_name?: string;
  avatar_url?: string;
  bio?: string;
}

// Database型定義（Supabase CLI生成用の参考）
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      works: {
        Row: Work;
        Insert: Omit<Work, 'id' | 'created_at' | 'updated_at' | 'view_count'>;
        Update: Partial<Omit<Work, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;
      };
      likes: {
        Row: Like;
        Insert: Omit<Like, 'id' | 'created_at'>;
        Update: never;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'work_id'>>;
      };
      invitations: {
        Row: Invitation;
        Insert: Omit<Invitation, 'id' | 'created_at'>;
        Update: Partial<Omit<Invitation, 'id' | 'created_at'>>;
      };
    };
  };
}