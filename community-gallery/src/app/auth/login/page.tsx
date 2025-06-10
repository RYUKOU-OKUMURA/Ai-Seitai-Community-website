"use client";

import { useState } from 'react';
import Link from 'next/link';
import { sendMagicLink } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('メールアドレスを入力してください');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await sendMagicLink(email);
      setIsSuccess(true);
      setMessage('ログインリンクをメールに送信しました。メールをご確認ください。');
    } catch (error: unknown) {
      setIsSuccess(false);
      console.error('Login error:', error);
      
      if (error instanceof Error && error.message.includes('Email not confirmed')) {
        setMessage('このメールアドレスは招待されていません。管理者にお問い合わせください。');
      } else {
        setMessage('エラーが発生しました。もう一度お試しください。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            コミュニティギャラリー
          </Link>
          <p className="text-gray-600 mt-2">
            Magic Linkでログイン
          </p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your-email@example.com"
                required
              />
            </div>

            {message && (
              <div className={`p-3 rounded-md text-sm ${
                isSuccess 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  送信中...
                </>
              ) : (
                'ログインリンクを送信'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="text-green-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              メールを送信しました
            </h3>
            <p className="text-gray-600 mb-6">
              {email} に送信されたリンクをクリックしてログインしてください。
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setMessage('');
                setEmail('');
              }}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              別のメールアドレスでログイン
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            招待制のサービスです。<br />
            アカウントをお持ちでない場合は管理者にお問い合わせください。
          </p>
          {process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy') && (
            <div className="mt-4 p-3 bg-blue-100 rounded-md">
              <p className="text-xs text-blue-800">
                🛠️ <strong>開発モード</strong><br />
                任意のメールアドレスでログインをテストできます
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}