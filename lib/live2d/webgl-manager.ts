/**
 * WebGL管理器
 */

export class WebGLManager {
  private _gl: WebGLRenderingContext | null = null;
  private _canvas: HTMLCanvasElement | null = null;

  /**
   * 初始化WebGL
   */
  public initialize(canvas: HTMLCanvasElement): boolean {
    this._canvas = canvas;
    
    // 获取WebGL上下文
    this._gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    
    if (!this._gl) {
      console.error('Failed to get WebGL context');
      return false;
    }

    // 设置WebGL状态
    this._gl.enable(this._gl.BLEND);
    this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
    this._gl.enable(this._gl.DEPTH_TEST);
    this._gl.depthFunc(this._gl.LEQUAL);

    // 设置视口
    this._gl.viewport(0, 0, canvas.width, canvas.height);

    return true;
  }

  /**
   * 获取WebGL上下文
   */
  public getGL(): WebGLRenderingContext | null {
    return this._gl;
  }

  /**
   * 获取Canvas
   */
  public getCanvas(): HTMLCanvasElement | null {
    return this._canvas;
  }

  /**
   * 清除画布
   */
  public clear(): void {
    if (!this._gl) return;
    
    this._gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
  }

  /**
   * 释放资源
   */
  public release(): void {
    this._gl = null;
    this._canvas = null;
  }
}