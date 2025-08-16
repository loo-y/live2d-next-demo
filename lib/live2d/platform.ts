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
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load file: ${filePath}`);
      }
      return await response.arrayBuffer();
    } catch (error) {
      console.error('File load error:', error);
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