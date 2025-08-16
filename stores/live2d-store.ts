import { create } from 'zustand';
import { ModelName, MotionGroup } from '@/lib/live2d/config';

interface Live2DState {
  // 当前模型
  currentModel: ModelName | null;
  
  // 模型加载状态
  isLoading: boolean;
  isLoaded: boolean;
  
  // 当前表情和动作
  currentExpression: string | null;
  currentMotion: { group: MotionGroup; index: number } | null;
  
  // 可用的表情和动作列表
  availableExpressions: string[];
  availableMotions: Record<MotionGroup, number>;
  
  // 错误状态
  error: string | null;
  
  // Actions
  setCurrentModel: (model: ModelName) => void;
  setLoading: (loading: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  setCurrentExpression: (expression: string) => void;
  setCurrentMotion: (group: MotionGroup, index: number) => void;
  setAvailableExpressions: (expressions: string[]) => void;
  setAvailableMotions: (motions: Record<MotionGroup, number>) => void;
  setError: (error: string | null) => void;
  
  // 重置状态
  reset: () => void;
}

export const useLive2DStore = create<Live2DState>((set) => ({
  // Initial state
  currentModel: null,
  isLoading: false,
  isLoaded: false,
  currentExpression: null,
  currentMotion: null,
  availableExpressions: [],
  availableMotions: {} as Record<MotionGroup, number>,
  error: null,
  
  // Actions
  setCurrentModel: (model) => set({ currentModel: model }),
  setLoading: (loading) => set({ isLoading: loading }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setCurrentExpression: (expression) => set({ currentExpression: expression }),
  setCurrentMotion: (group, index) => set({ currentMotion: { group, index } }),
  setAvailableExpressions: (expressions) => set({ availableExpressions: expressions }),
  setAvailableMotions: (motions) => set({ availableMotions: motions }),
  setError: (error) => set({ error }),
  
  reset: () => set({
    currentModel: null,
    isLoading: false,
    isLoaded: false,
    currentExpression: null,
    currentMotion: null,
    availableExpressions: [],
    availableMotions: {} as Record<MotionGroup, number>,
    error: null,
  }),
}));