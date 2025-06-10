import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                コミュニティギャラリー
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin"
                className="text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors"
              >
                🛠️ 管理
              </Link>
              <Link 
                href="/upload"
                className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-slate-500/25"
              >
                ✨ 作品を投稿
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/30 to-blue-50/30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-60 h-60 bg-slate-300/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200/12 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-slate-200/10 rounded-full blur-2xl"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-100/8 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-700 via-slate-600 to-blue-600 bg-clip-text text-transparent">
              創作の
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-slate-600 to-slate-700 bg-clip-text text-transparent">
              スパイラル
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
            コミュニティメンバーの素敵な作品が、<br />
            新しいインスピレーションを生み出していく
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white/70 backdrop-blur-md hover:bg-white/90 text-slate-700 px-8 py-3 rounded-full font-medium transition-all duration-300 border border-slate-200 hover:border-slate-300 shadow-sm">
              作品を探索
            </button>
            <Link 
              href="/auth/login"
              className="text-slate-600 hover:text-slate-800 font-medium transition-colors duration-300"
            >
              ログイン →
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">
                最新の作品
              </h3>
              <p className="text-slate-600">
                みんなの創造力あふれる作品をチェックしよう
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <button className="px-4 py-2 bg-white/60 backdrop-blur-md rounded-full text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-all duration-300 border border-slate-200 shadow-sm">
                すべて
              </button>
              <button className="px-4 py-2 bg-white/60 backdrop-blur-md rounded-full text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-all duration-300 border border-slate-200 shadow-sm">
                アート
              </button>
              <button className="px-4 py-2 bg-white/60 backdrop-blur-md rounded-full text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-all duration-300 border border-slate-200 shadow-sm">
                写真
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[
            { id: 1, title: "夕暮れの風景", author: "山田太郎", likes: 24, comments: 8, color: "from-orange-400 to-pink-500" },
            { id: 2, title: "抽象アート", author: "佐藤花子", likes: 18, comments: 5, color: "from-purple-400 to-blue-500" },
            { id: 3, title: "街角スナップ", author: "田中次郎", likes: 31, comments: 12, color: "from-green-400 to-blue-500" },
            { id: 4, title: "デジタルアート", author: "鈴木美咲", likes: 42, comments: 15, color: "from-pink-400 to-purple-500" },
            { id: 5, title: "自然写真", author: "高橋健一", likes: 27, comments: 9, color: "from-blue-400 to-green-500" },
            { id: 6, title: "イラスト作品", author: "中村あい", likes: 35, comments: 18, color: "from-yellow-400 to-orange-500" }
          ].map((work) => (
            <Link key={work.id} href={`/works/${work.id}`}>
              <div className="group relative bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-white/95 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-500/20 border border-slate-200 hover:border-slate-300 cursor-pointer shadow-sm">
                {/* 画像エリア */}
                <div className="relative aspect-square overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${work.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/80 text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🎨</span>
                      </div>
                      <span className="text-sm font-medium">{work.title}</span>
                    </div>
                  </div>
                  
                  {/* ホバー時のオーバーレイ */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="text-lg font-semibold mb-2">👁 詳細を見る</div>
                      <div className="text-sm opacity-80">クリックして作品をチェック</div>
                    </div>
                  </div>
                </div>
                
                {/* カード情報 */}
                <div className="p-6">
                  <h3 className="font-bold text-slate-800 mb-2 text-lg group-hover:text-slate-900 transition-colors duration-300">
                    {work.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    素晴らしい作品の説明がここに表示されます。創作過程や込められた想いについて...
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{work.author[0]}</span>
                      </div>
                      <span className="text-slate-700 text-sm font-medium">{work.author}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-red-500">
                        <span className="text-sm">❤️</span>
                        <span className="text-sm font-medium">{work.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-blue-600">
                        <span className="text-sm">💬</span>
                        <span className="text-sm font-medium">{work.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 下部の装飾的なボーダー */}
                <div className={`h-1 bg-gradient-to-r ${work.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <button className="bg-gradient-to-r from-white/70 to-slate-50/70 backdrop-blur-md hover:from-white/90 hover:to-slate-50/90 text-slate-700 px-8 py-3 rounded-full font-medium transition-all duration-300 border border-slate-200 hover:border-slate-300 hover:scale-105 shadow-sm">
            ✨ もっと見る
          </button>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="text-slate-800 font-bold text-xl">コミュニティギャラリー</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                創作者同士がつながり、インスピレーションを共有する場所。
                あなたの作品が新しい創作のスパイラルを生み出します。
              </p>
            </div>
            
            <div>
              <h4 className="text-slate-800 font-semibold mb-4">コミュニティ</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-slate-800 transition-colors">作品ガイドライン</a></li>
                <li><a href="#" className="hover:text-slate-800 transition-colors">よくある質問</a></li>
                <li><a href="#" className="hover:text-slate-800 transition-colors">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-slate-800 transition-colors">プライバシーポリシー</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-slate-800 font-semibold mb-4">つながり</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-slate-800 transition-colors">Discord コミュニティ</a></li>
                <li><a href="#" className="hover:text-slate-800 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-slate-800 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-slate-800 transition-colors">ニュースレター</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 mt-8 pt-8 text-center">
            <p className="text-slate-500 text-sm">
              © 2024 コミュニティギャラリー. Made with ❤️ for creators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
