import { supabase } from './supabase'

// Magic Link送信（開発用バイパス付き）
export const sendMagicLink = async (email: string) => {
  // 開発環境でダミー値の場合はバイパス
  const isDummyConfig = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')
  
  if (isDummyConfig) {
    // 開発用バイパス：短い待機時間でシミュレーション
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`[開発モード] Magic Linkを ${email} に送信しました（シミュレーション）`)
    return { success: true }
  }
  
  // 実際のSupabase処理
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })
  
  if (error) throw error
  return { success: true }
}

// ログアウト
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// 認証状態の監視
export const onAuthStateChange = (callback: (user: unknown) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}

// プロフィール作成（初回ログイン時）
export const createProfile = async (userId: string, email: string, displayName?: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email,
      display_name: displayName || email.split('@')[0]
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// 招待トークンの検証
export const validateInvitation = async (token: string) => {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()
  
  if (error) throw error
  return data
}

// 招待トークンの使用済みマーク
export const markInvitationAsUsed = async (token: string) => {
  const { error } = await supabase
    .from('invitations')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token)
  
  if (error) throw error
}