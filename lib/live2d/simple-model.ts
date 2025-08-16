/**
 * 简化的Live2D模型管理器 - 临时版本
 * 暂时不依赖Framework，用于演示UI功能
 */

import { Platform } from './platform';
import { PRIORITY, MotionGroup } from './config';

// 临时类型定义，替代Framework类型
interface MockCubismMatrix44 {
  multiplyByMatrix(matrix: MockCubismMatrix44): void;
}

interface MockModel {
  loadParameters(): void;
  saveParameters(): void;
  update(): void;
}

enum LoadStep {
  LoadAssets,
  LoadModel,
  CompleteSetup
}

export class SimpleLive2DModel {
  private _modelHomeDir: string | null = null;
  private _userTimeSeconds: number = 0.0;
  private _state: LoadStep = LoadStep.LoadAssets;
  
  // 模拟的数据存储
  private _availableExpressions: string[] = [];
  private _availableMotions: Record<MotionGroup, number> = { Idle: 0, TapBody: 0 };
  private _currentExpression: string | null = null;
  private _currentMotion: { group: MotionGroup; index: number } | null = null;
  
  // 回调函数
  private _onModelLoaded?: () => void;
  private _onLoadError?: (error: string) => void;

  /**
   * 加载模型 - 模拟版本
   */
  public async loadModel(modelDir: string, modelFileName: string): Promise<void> {
    this._modelHomeDir = modelDir;
    this._state = LoadStep.LoadAssets;

    try {
      Platform.log(`Loading model: ${modelDir}${modelFileName}`);
      
      // 模拟加载延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟设置可用的表情和动作
      this._availableExpressions = ['happy', 'sad', 'angry', 'surprised', 'normal'];
      this._availableMotions = {
        Idle: 3,
        TapBody: 5
      };
      
      this._state = LoadStep.CompleteSetup;
      Platform.log('Model loaded successfully (simulated)');
      this._onModelLoaded?.();
    } catch (error) {
      Platform.error(`Failed to load model: ${error}`);
      this._onLoadError?.(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * 设置模型加载回调
   */
  public setCallbacks(onLoaded?: () => void, onError?: (error: string) => void): void {
    this._onModelLoaded = onLoaded;
    this._onLoadError = onError;
  }

  /**
   * 播放动作 - 模拟版本
   */
  public playMotion(group: MotionGroup, index: number = 0): void {
    if (this._state !== LoadStep.CompleteSetup) {
      Platform.error('Model not ready for motion playback');
      return;
    }

    const maxIndex = this._availableMotions[group];
    if (index >= maxIndex) {
      Platform.error(`Motion index out of range: ${group}[${index}] (max: ${maxIndex})`);
      return;
    }

    this._currentMotion = { group, index };
    Platform.log(`Playing motion: ${group}[${index}] (simulated)`);
  }

  /**
   * 播放随机动作
   */
  public playRandomMotion(group: MotionGroup): void {
    const count = this._availableMotions[group];
    if (count === 0) return;
    
    const index = Math.floor(Math.random() * count);
    this.playMotion(group, index);
  }

  /**
   * 设置表情 - 模拟版本
   */
  public setExpression(expressionName: string): void {
    if (this._state !== LoadStep.CompleteSetup) {
      Platform.error('Model not ready for expression change');
      return;
    }

    if (!this._availableExpressions.includes(expressionName)) {
      Platform.error(`Expression not found: ${expressionName}`);
      return;
    }

    this._currentExpression = expressionName;
    Platform.log(`Set expression: ${expressionName} (simulated)`);
  }

  /**
   * 设置随机表情
   */
  public setRandomExpression(): void {
    if (this._availableExpressions.length === 0) return;
    
    const index = Math.floor(Math.random() * this._availableExpressions.length);
    const expressionName = this._availableExpressions[index];
    this.setExpression(expressionName);
  }

  /**
   * 获取可用的表情列表
   */
  public getAvailableExpressions(): string[] {
    return [...this._availableExpressions];
  }

  /**
   * 获取可用的动作数量
   */
  public getAvailableMotions(): Record<MotionGroup, number> {
    return { ...this._availableMotions };
  }

  /**
   * 更新模型 - 模拟版本
   */
  public update(): void {
    if (this._state !== LoadStep.CompleteSetup) return;

    const deltaTimeSeconds = Platform.getDeltaTime();
    this._userTimeSeconds += deltaTimeSeconds;

    // 模拟更新逻辑
    // 在实际版本中，这里会更新Live2D模型的各种参数
  }

  /**
   * 渲染模型 - 模拟版本
   */
  public draw(matrix: MockCubismMatrix44): void {
    if (this._state !== LoadStep.CompleteSetup) return;

    // 模拟渲染逻辑
    // 在实际版本中，这里会调用Live2D的渲染方法
  }

  /**
   * 检查是否加载完成
   */
  public isLoaded(): boolean {
    return this._state === LoadStep.CompleteSetup;
  }

  /**
   * 获取当前表情
   */
  public getCurrentExpression(): string | null {
    return this._currentExpression;
  }

  /**
   * 获取当前动作
   */
  public getCurrentMotion(): { group: MotionGroup; index: number } | null {
    return this._currentMotion;
  }
}