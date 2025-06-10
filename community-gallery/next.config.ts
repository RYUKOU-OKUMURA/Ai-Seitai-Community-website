import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 開発サーバーの安定性向上のための設定
  experimental: {
    // メモリ使用量を削減
    serverMinification: false,
  },
  
  // ファイル監視の設定
  webpack: (config, { dev }) => {
    if (dev) {
      // 開発時のファイル監視設定
      config.watchOptions = {
        poll: 1000, // ポーリング間隔（ミリ秒）
        aggregateTimeout: 300, // 変更を集約する時間
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      };
    }
    return config;
  },
  
  // 画像最適化の設定（Cloudinaryを使用する場合）
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
