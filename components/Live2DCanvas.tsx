'use client';

import { useEffect, useRef, useState } from 'react';
import { useLive2DStore } from '@/stores/live2d-store';
import { CANVAS_CONFIG, RESOURCES_PATH, ModelName } from '@/lib/live2d/config';
import { Platform } from '@/lib/live2d/platform';
import { Live2DManager } from '@/lib/live2d/live2d-manager';
import { loadLive2DCore } from '@/lib/live2d/core-loader';

interface Live2DCanvasProps {
  className?: string;
}

export default function Live2DCanvas({ className = '' }: Live2DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<Live2DManager | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { 
    currentModel, 
    isLoading, 
    isLoaded,
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
        
        // 首先加载Live2D Core
        await loadLive2DCore();
        
        // 创建Live2D管理器
        managerRef.current = new Live2DManager();
        
        // 初始化Live2D Framework
        const success = await managerRef.current.initialize(canvasRef.current);
        
        if (success) {
          setIsInitialized(true);
          setLoading(false);
          Platform.log('Live2D Canvas initialized');
        } else {
          throw new Error('Failed to initialize Live2D Framework');
        }
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
    if (!currentModel || !isInitialized || !managerRef.current) return;

    const loadModel = async () => {
      try {
        setLoading(true);
        Platform.log(`Loading model: ${currentModel}`);
        
        // 清除之前的模型
        managerRef.current!.clearModels();
        
        // 加载新模型
        const model = await managerRef.current!.loadModel(currentModel);
        if (model) {
          // 等待模型完全加载
          let checkCount = 0;
          const maxChecks = 50; // 最多检查5秒
          
          const checkLoaded = () => {
            checkCount++;
            
            if (model.isLoaded()) {
              const expressions = managerRef.current!.getAvailableExpressions();
              const motions = managerRef.current!.getAvailableMotions();
              
              setAvailableExpressions(expressions);
              setAvailableMotions(motions);
              setLoaded(true);
              setLoading(false);
              Platform.log(`Model loaded: ${currentModel}`);
            } else if (checkCount < maxChecks) {
              // 继续检查
              setTimeout(checkLoaded, 100);
            } else {
              // 超时
              Platform.error('Model loading timeout');
              setError('Model loading timeout');
              setLoading(false);
            }
          };
          
          checkLoaded();
        } else {
          throw new Error('Failed to create model instance');
        }
        
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
    if (!managerRef.current) return;
    
    if (currentExpression) {
      managerRef.current.setExpression(currentExpression);
    }
  }, [currentExpression]);

  useEffect(() => {
    if (!managerRef.current) return;
    
    if (currentMotion) {
      managerRef.current.playMotion(currentMotion.group, currentMotion.index);
    }
  }, [currentMotion]);

  // 渲染循环
  useEffect(() => {
    if (!isInitialized || !managerRef.current) return;

    let animationId: number;
    
    const render = () => {
      try {
        // 只有在模型加载完成时才进行更新和渲染
        if (isLoaded && managerRef.current) {
          managerRef.current.update();
          managerRef.current.draw();
        }
      } catch (error) {
        console.error('[Live2D Render Error]:', error);
        setError(error instanceof Error ? error.message : 'Render error');
      }
      
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isInitialized, isLoaded]);

  // 清理资源
  useEffect(() => {
    return () => {
      if (managerRef.current) {
        managerRef.current.release();
      }
    };
  }, []);

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