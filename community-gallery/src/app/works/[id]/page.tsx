"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function WorkDetailPage() {
  const params = useParams();
  const workId = params.id;
  
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(5);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "田中太郎",
      content: "素晴らしい作品ですね！色使いがとても綺麗です。",
      createdAt: "2024-06-09 14:30"
    },
    {
      id: 2,
      author: "佐藤花子",
      content: "どのような技法で作られたのでしょうか？",
      createdAt: "2024-06-09 15:15"
    }
  ]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: "あなた",
        content: comment,
        createdAt: new Date().toLocaleString('ja-JP')
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              コミュニティギャラリー
            </Link>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              ← 一覧に戻る
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-lg">画像プレビュー (ID: {workId})</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                サンプル作品タイトル
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">T</span>
                  </div>
                  <span className="text-gray-700 font-medium">投稿者名</span>
                </div>
                <span className="text-sm text-gray-500">2024-06-09</span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                この作品についての説明文がここに表示されます。制作過程や使用した技術、
                インスピレーションについて詳しく書かれています。
              </p>

              <div className="flex items-center space-x-4 pb-4 border-b">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    liked
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  <span>{liked ? "❤️" : "🤍"}</span>
                  <span>{likeCount}</span>
                </button>
                <span className="text-gray-500">💬 {comments.length}件のコメント</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                コメント
              </h2>

              <form onSubmit={handleCommentSubmit} className="mb-6">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="コメントを書く..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                  >
                    コメントする
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {comment.author[0]}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.createdAt}</span>
                    </div>
                    <p className="text-gray-700 text-sm ml-8">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}