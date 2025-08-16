/**
 * 平台抽象层 - Next.js 简化版
 */

export class Platform {
  private static currentFrame = 0.0;
  private static lastFrame = 0.0;
  private static deltaTime = 0.0;

  /**
   * 获取时间差
   */
  public static getDeltaTime(): number {
    return this.deltaTime;
  }

  /**
   * 更新时间
   */
  public static updateTime(): void {
    this.currentFrame = Date.now();
    this.deltaTime = (this.currentFrame - this.lastFrame) / 1000;
    this.lastFrame = this.currentFrame;
  }

  /**
   * 加载文件为字节数据
   */
  public static async loadFileAsBytes(filePath: string): Promise<ArrayBuffer> {
    try {
      Platform.log(`Attempting to load file: ${filePath}`);
      const response = await fetch(filePath);
      
      if (!response.ok) {
        const errorMsg = `Failed to load file: ${filePath} (Status: ${response.status} ${response.statusText})`;
        Platform.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      const contentLength = response.headers.get('content-length');
      Platform.log(`Successfully loaded file: ${filePath} (${contentLength ? contentLength + ' bytes' : 'size unknown'})`);
      return await response.arrayBuffer();
    } catch (error) {
      const errorMsg = `File load error for ${filePath}: ${error}`;
      Platform.error(errorMsg);
      throw error;
    }
  }

  /**
   * 输出日志
   */
  public static log(message: string): void {
    console.log(`[Live2D] ${message}`);
  }

  /**
   * 输出错误日志
   */
  public static error(message: string): void {
    console.error(`[Live2D Error] ${message}`);
  }
}