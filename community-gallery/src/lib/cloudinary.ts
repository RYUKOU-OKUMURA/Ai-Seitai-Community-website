// Cloudinary設定とアップロード機能

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

// クライアントサイドでの直接アップロード用の設定取得
export const getCloudinaryConfig = () => {
  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    uploadPreset: 'community_gallery_preset' // Cloudinaryで作成する必要あり
  };
};

// 画像アップロード関数
export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  const config = getCloudinaryConfig();
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset);
  formData.append('cloud_name', config.cloudName);
  
  // 画像の最適化設定
  formData.append('quality', 'auto');
  formData.append('fetch_format', 'auto');
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  
  if (!response.ok) {
    throw new Error('画像のアップロードに失敗しました');
  }
  
  const data = await response.json();
  return data;
};

// 複数ファイルの同時アップロード
export const uploadMultipleToCloudinary = async (files: File[]): Promise<CloudinaryUploadResult[]> => {
  if (files.length > 3) {
    throw new Error('一度にアップロードできるファイルは3個までです');
  }
  
  const uploadPromises = files.map(file => uploadToCloudinary(file));
  return Promise.all(uploadPromises);
};

// ファイルサイズ・形式チェック
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'JPEG、PNG、GIF、WebP形式の画像のみアップロード可能です' 
    };
  }
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: 'ファイルサイズは10MB以下にしてください' 
    };
  }
  
  return { valid: true };
};

// プログレス付きアップロード（将来的な拡張用）
export const uploadWithProgress = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  const config = getCloudinaryConfig();
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    formData.append('cloud_name', config.cloudName);
    formData.append('quality', 'auto');
    formData.append('fetch_format', 'auto');
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded * 100) / e.total);
        onProgress(progress);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(new Error('アップロードに失敗しました'));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('アップロードエラーが発生しました'));
    });
    
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`);
    xhr.send(formData);
  });
};