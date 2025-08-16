/**
 * Live2D管理器
 * 管理多个Live2D模型实例
 */

import { CubismMatrix44 } from '@framework/math/cubismmatrix44';
import { CubismFramework, Option } from '@framework/live2dcubismframework';
import { Live2DModel } from './live2d-model';
import { WebGLManager } from './webgl-manager';
import { Platform } from './platform';
import { ModelName, MotionGroup } from './config';

export class Live2DManager {
  private _models: Live2DModel[] = [];
  private _webglManager: WebGLManager = new WebGLManager();
  private _viewMatrix: CubismMatrix44 = new CubismMatrix44();
  private _isInitialized: boolean = false;

  /**
   * 初始化Live2D Framework
   */
  public async initialize(canvas: HTMLCanvasElement): Promise<boolean> {
    try {
      // 初始化WebGL
      if (!this._webglManager.initialize(canvas)) {
        Platform.error('Failed to initialize WebGL');
        return false;
      }

      // 初始化Cubism Framework
      const option = new Option();
      option.logFunction = Platform.log;
      option.loggingLevel = 0; // LogLevel.LogLevel_Verbose

      CubismFramework.startUp(option);
      CubismFramework.initialize();

      this._isInitialized = true;
      Platform.log('Live2D Framework initialized');
      return true;
    } catch (error) {
      Platform.error(`Failed to initialize Live2D Framework: ${error}`);
      return false;
    }
  }

  /**
   * 加载模型
   */
  public async loadModel(modelName: ModelName): Promise<Live2DModel | null> {
    if (!this._isInitialized) {
      Platform.error('Live2D Framework not initialized');
      return null;
    }

    try {
      // 清理旧模型
      Platform.log(`Clearing ${this._models.length} old models before loading ${modelName}`);
      this.clearModels();

      const model = new Live2DModel();
      
      // 设置WebGL上下文给模型
      const gl = this._webglManager.getGL();
      if (gl) {
        model.setWebGLContext(gl);
      }

      // 加载模型
      await model.loadModelAssets(`/models/${modelName}/`, `${modelName}.model3.json`);
      
      this._models.push(model);
      Platform.log(`Model loaded: ${modelName}`);
      return model;
    } catch (error) {
      Platform.error(`Failed to load model ${modelName}: ${error}`);
      return null;
    }
  }

  /**
   * 获取当前模型
   */
  public getCurrentModel(): Live2DModel | null {
    return this._models.length > 0 ? this._models[0] : null;
  }

  /**
   * 清除所有模型
   */
  public clearModels(): void {
    this._models.forEach(model => {
      model.release();
    });
    this._models = [];
  }

  /**
   * 更新所有模型
   */
  public update(): void {
    Platform.updateTime();
    
    this._models.forEach(model => {
      if (model.isLoaded()) {
        model.update();
      }
    });
  }

  /**
   * 渲染所有模型
   */
  public draw(): void {
    if (!this._isInitialized) return;

    const gl = this._webglManager.getGL();
    const canvas = this._webglManager.getCanvas();
    
    if (!gl || !canvas) return;

    // 清除画布
    this._webglManager.clear();

    // 重新设置视口确保正确
    gl.viewport(0, 0, canvas.width, canvas.height);
    Platform.log(`Setting viewport to: ${canvas.width}x${canvas.height}`);

    // 检查是否有可渲染的模型
    const renderableModels = this._models.filter(model => model.isLoaded() && model.getModel());
    if (renderableModels.length === 0) {
      Platform.log(`No renderable models found. Total models: ${this._models.length}`);
      return;
    }

    Platform.log(`Rendering ${renderableModels.length} models`);

    // 设置投影矩阵
    const projection = new CubismMatrix44();
    
    if (canvas.width > canvas.height) {
      // 横屏
      projection.scale(canvas.height / canvas.width, 1.0);
    } else {
      // 竖屏
      projection.scale(1.0, canvas.width / canvas.height);
    }

    // 应用视图矩阵
    projection.multiplyByMatrix(this._viewMatrix);

    // 渲染所有准备好的模型
    renderableModels.forEach(model => {
      try {
        // 确保WebGL视口设置正确
        gl.viewport(0, 0, canvas.width, canvas.height);
        
        // 创建投影矩阵的副本，避免被修改
        const modelProjection = new CubismMatrix44();
        modelProjection.setMatrix(projection.getArray());
        model.draw(modelProjection);
      } catch (error) {
        Platform.error(`Error drawing model: ${error}`);
      }
    });
  }

  /**
   * 设置视图矩阵
   */
  public setViewMatrix(matrix: CubismMatrix44): void {
    this._viewMatrix = matrix;
  }

  /**
   * 播放动作
   */
  public playMotion(group: MotionGroup, index?: number): void {
    const model = this.getCurrentModel();
    if (model) {
      if (index !== undefined) {
        model.playMotion(group, index);
      } else {
        model.playRandomMotion(group);
      }
    }
  }

  /**
   * 设置表情
   */
  public setExpression(expressionName: string): void {
    const model = this.getCurrentModel();
    if (model) {
      model.setExpression(expressionName);
    }
  }

  /**
   * 设置随机表情
   */
  public setRandomExpression(): void {
    const model = this.getCurrentModel();
    if (model) {
      model.setRandomExpression();
    }
  }

  /**
   * 获取可用表情列表
   */
  public getAvailableExpressions(): string[] {
    const model = this.getCurrentModel();
    return model ? model.getAvailableExpressions() : [];
  }

  /**
   * 获取可用动作数量
   */
  public getAvailableMotions(): Record<string, number> {
    const model = this.getCurrentModel();
    return model ? model.getAvailableMotions() : {};
  }

  /**
   * 释放资源
   */
  public release(): void {
    this.clearModels();
    this._webglManager.release();
    
    if (this._isInitialized) {
      CubismFramework.dispose();
      this._isInitialized = false;
    }
  }
}