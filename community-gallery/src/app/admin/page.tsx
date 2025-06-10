"use client";

import { useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_sign_in: string | null;
  status: 'active' | 'inactive';
  works_count: number;
}

interface Invitation {
  id: string;
  email: string;
  token: string;
  invited_by: string | null;
  used_at: string | null;
  expires_at: string;
  created_at: string;
  status: 'pending' | 'used' | 'expired';
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'invitations'>('users');
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // サンプルデータ（実際はSupabaseから取得）
  const [users] = useState<User[]>([
    {
      id: '1',
      email: 'user1@example.com',
      display_name: '山田太郎',
      created_at: '2024-06-01T10:00:00Z',
      last_sign_in: '2024-06-10T08:30:00Z',
      status: 'active',
      works_count: 5
    },
    {
      id: '2',
      email: 'user2@example.com',
      display_name: '佐藤花子',
      created_at: '2024-06-05T14:20:00Z',
      last_sign_in: '2024-06-09T16:45:00Z',
      status: 'active',
      works_count: 3
    },
    {
      id: '3',
      email: 'user3@example.com',
      display_name: null,
      created_at: '2024-06-08T09:15:00Z',
      last_sign_in: null,
      status: 'inactive',
      works_count: 0
    }
  ]);

  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: '1',
      email: 'pending@example.com',
      token: 'abc123',
      invited_by: 'admin@example.com',
      used_at: null,
      expires_at: '2024-06-17T10:00:00Z',
      created_at: '2024-06-10T10:00:00Z',
      status: 'pending'
    },
    {
      id: '2',
      email: 'used@example.com',
      token: 'def456',
      invited_by: 'admin@example.com',
      used_at: '2024-06-09T15:30:00Z',
      expires_at: '2024-06-16T10:00:00Z',
      created_at: '2024-06-09T10:00:00Z',
      status: 'used'
    }
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGenerateInvite = async () => {
    if (!newInviteEmail.trim()) return;

    setIsGenerating(true);
    
    // 開発環境チェック
    const isDummyConfig = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy');
    
    if (isDummyConfig) {
      // 開発用シミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newInvitation: Invitation = {
        id: Date.now().toString(),
        email: newInviteEmail,
        token: Math.random().toString(36).substring(2, 15),
        invited_by: 'admin@example.com',
        used_at: null,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        status: 'pending'
      };
      
      setInvitations([newInvitation, ...invitations]);
      setNewInviteEmail('');
      console.log(`[開発モード] 招待を生成しました: ${newInviteEmail}`);
    }
    
    setIsGenerating(false);
  };

  const copyInviteLink = (token: string) => {
    const inviteLink = `${window.location.origin}/auth/signup?token=${token}`;
    navigator.clipboard.writeText(inviteLink);
    alert('招待リンクをクリップボードにコピーしました！');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* ヘッダー */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="text-white font-bold text-xl">管理画面</span>
              </Link>
            </div>
            <Link 
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              ← サイトに戻る
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* タブ */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg backdrop-blur-md">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              👥 ユーザー管理
            </button>
            <button
              onClick={() => setActiveTab('invitations')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'invitations'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              ✉️ 招待管理
            </button>
          </div>
        </div>

        {/* ユーザー管理タブ */}
        {activeTab === 'users' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">登録ユーザー一覧</h2>
              <div className="text-sm text-gray-300">
                総ユーザー数: {users.length}名（アクティブ: {users.filter(u => u.status === 'active').length}名）
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-4 font-medium text-gray-300">ユーザー</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">メールアドレス</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">登録日</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">最終ログイン</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">作品数</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700/50 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user.display_name?.[0] || user.email[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {user.display_name || '名前未設定'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{user.email}</td>
                      <td className="py-4 px-4 text-gray-300">{formatDate(user.created_at)}</td>
                      <td className="py-4 px-4 text-gray-300">
                        {user.last_sign_in ? formatDate(user.last_sign_in) : '未ログイン'}
                      </td>
                      <td className="py-4 px-4 text-gray-300">{user.works_count}件</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        }`}>
                          {user.status === 'active' ? 'アクティブ' : '非アクティブ'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 招待管理タブ */}
        {activeTab === 'invitations' && (
          <div className="space-y-6">
            {/* 新規招待生成 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">新規招待を生成</h2>
              <div className="flex gap-4">
                <input
                  type="email"
                  value={newInviteEmail}
                  onChange={(e) => setNewInviteEmail(e.target.value)}
                  placeholder="招待するメールアドレス"
                  className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleGenerateInvite}
                  disabled={!newInviteEmail.trim() || isGenerating}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                  {isGenerating ? '生成中...' : '招待を生成'}
                </button>
              </div>
            </div>

            {/* 招待一覧 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">招待一覧</h2>
                <div className="text-sm text-gray-300">
                  総招待数: {invitations.length}件（未使用: {invitations.filter(i => i.status === 'pending').length}件）
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 px-4 font-medium text-gray-300">メールアドレス</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">作成日</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">有効期限</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">ステータス</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((invitation) => (
                      <tr key={invitation.id} className="border-b border-gray-700/50 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 text-white font-medium">{invitation.email}</td>
                        <td className="py-4 px-4 text-gray-300">{formatDate(invitation.created_at)}</td>
                        <td className="py-4 px-4 text-gray-300">{formatDate(invitation.expires_at)}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            invitation.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : invitation.status === 'used'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {invitation.status === 'pending' ? '未使用' : 
                             invitation.status === 'used' ? '使用済み' : '期限切れ'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {invitation.status === 'pending' && (
                            <button
                              onClick={() => copyInviteLink(invitation.token)}
                              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                            >
                              🔗 リンクをコピー
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}