'use client';

import { useEffect, useRef, useState } from 'react';
import { useLive2DStore } from '@/stores/live2d-store';
import { CANVAS_CONFIG, RESOURCES_PATH, ModelName } from '@/lib/live2d/config';
import { Platform } from '@/lib/live2d/platform';
import { SimpleLive2DModel } from '@/lib/live2d/simple-model';

interface Live2DCanvasProps {
  className?: string;
}

export default function Live2DCanvas({ className = '' }: Live2DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<SimpleLive2DModel | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { 
    currentModel, 
    isLoading, 
    setLoading, 
    setLoaded, 
    setError,
    setAvailableExpressions,
    setAvailableMotions,
    currentExpression,
    currentMotion
  } = useLive2DStore();

  // 初始化Live2D
  useEffect(() => {
    const initLive2D = async () => {
      if (!canvasRef.current || isInitialized) return;

      try {
        setLoading(true);
        
        Platform.log('Initializing Live2D Canvas...');
        
        // 创建模型实例
        modelRef.current = new SimpleLive2DModel();
        
        setIsInitialized(true);
        setLoading(false);
        Platform.log('Live2D Canvas initialized');
      } catch (error) {
        Platform.error(`Failed to initialize Live2D: ${error}`);
        setError(error instanceof Error ? error.message : 'Initialization failed');
        setLoading(false);
      }
    };

    initLive2D();
  }, [isInitialized, setLoading, setError]);

  // 加载模型
  useEffect(() => {
    if (!currentModel || !isInitialized || !modelRef.current) return;

    const loadModel = async () => {
      try {
        setLoading(true);
        Platform.log(`Loading model: ${currentModel}`);
        
        // 设置回调
        modelRef.current!.setCallbacks(
          () => {
            // 模型加载完成
            const expressions = modelRef.current!.getAvailableExpressions();
            const motions = modelRef.current!.getAvailableMotions();
            
            setAvailableExpressions(expressions);
            setAvailableMotions(motions);
            setLoaded(true);
            setLoading(false);
            Platform.log(`Model loaded: ${currentModel}`);
          },
          (error) => {
            // 加载错误
            Platform.error(`Failed to load model: ${error}`);
            setError(error);
            setLoading(false);
          }
        );
        
        // 开始加载模型
        await modelRef.current!.loadModel(
          `${RESOURCES_PATH}${currentModel}/`,
          `${currentModel}.model3.json`
        );
        
      } catch (error) {
        Platform.error(`Failed to load model: ${error}`);
        setError(error instanceof Error ? error.message : 'Model load failed');
        setLoading(false);
      }
    };

    loadModel();
  }, [currentModel, isInitialized, setLoading, setLoaded, setError, setAvailableExpressions, setAvailableMotions]);

  // 处理表情和动作变化
  useEffect(() => {
    if (!modelRef.current || !modelRef.current.isLoaded()) return;
    
    if (currentExpression) {
      modelRef.current.setExpression(currentExpression);
    }
  }, [currentExpression]);

  useEffect(() => {
    if (!modelRef.current || !modelRef.current.isLoaded()) return;
    
    if (currentMotion) {
      modelRef.current.playMotion(currentMotion.group, currentMotion.index);
    }
  }, [currentMotion]);

  // 渲染循环
  useEffect(() => {
    if (!isInitialized) return;

    let animationId: number;
    
    const render = () => {
      Platform.updateTime();
      
      // 更新模型
      if (modelRef.current && modelRef.current.isLoaded()) {
        modelRef.current.update();
        // 在实际版本中，这里会调用draw方法
      }
      
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isInitialized]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={CANVAS_CONFIG.WIDTH}
        height={CANVAS_CONFIG.HEIGHT}
        className="border border-gray-300 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100"
        style={{
          width: CANVAS_CONFIG.WIDTH,
          height: CANVAS_CONFIG.HEIGHT,
        }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="text-white text-lg">
            Loading Live2D Model...
          </div>
        </div>
      )}
      
      {!currentModel && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-gray-500 text-lg">
            Select a model to begin
          </div>
        </div>
      )}
    </div>
  );
}