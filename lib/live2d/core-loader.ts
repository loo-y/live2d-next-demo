/**
 * Live2D Core加载器
 */

// 动态导入Live2D Core
export async function loadLive2DCore(): Promise<void> {
  try {
    // 在浏览器环境中动态加载Core
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = '/live2dcubismcore.min.js';
      script.async = true;
      
      return new Promise((resolve, reject) => {
        script.onload = () => {
          console.log('Live2D Core loaded successfully');
          resolve();
        };
        script.onerror = () => {
          reject(new Error('Failed to load Live2D Core'));
        };
        document.head.appendChild(script);
      });
    }
  } catch (error) {
    console.error('Failed to load Live2D Core:', error);
    throw error;
  }
}