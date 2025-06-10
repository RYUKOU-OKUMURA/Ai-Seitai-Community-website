import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// 認証用のヘルパー関数
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// プロフィール取得
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// 作品一覧取得（ページネーション付き）
export const getWorks = async (page = 0, limit = 20) => {
  const offset = page * limit
  
  const { data, error } = await supabase
    .from('works')
    .select(`
      *,
      profiles(display_name, avatar_url),
      likes(count),
      comments(count)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) throw error
  return data
}

// 作品詳細取得
export const getWorkById = async (workId: string, userId?: string) => {
  const { data, error } = await supabase
    .from('works')
    .select(`
      *,
      profiles(display_name, avatar_url),
      likes(*),
      comments(*, profiles(display_name, avatar_url))
    `)
    .eq('id', workId)
    .single()
  
  if (error) throw error
  
  // いいね済みかチェック
  let isLikedByUser = false
  if (userId) {
    const { data: likeData } = await supabase
      .from('likes')
      .select('id')
      .eq('work_id', workId)
      .eq('user_id', userId)
      .single()
    
    isLikedByUser = !!likeData
  }
  
  return {
    ...data,
    like_count: data.likes?.length || 0,
    comment_count: data.comments?.length || 0,
    is_liked_by_user: isLikedByUser
  }
}