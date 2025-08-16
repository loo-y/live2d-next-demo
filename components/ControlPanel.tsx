'use client';

import { useLive2DStore } from '@/stores/live2d-store';
import { MODELS, MOTION_GROUPS, ModelName, MotionGroup } from '@/lib/live2d/config';

export default function ControlPanel() {
  const {
    currentModel,
    isLoading,
    isLoaded,
    currentExpression,
    currentMotion,
    availableExpressions,
    availableMotions,
    error,
    setCurrentModel,
    setCurrentExpression,
    setCurrentMotion,
  } = useLive2DStore();

  const handleModelChange = (model: ModelName) => {
    setCurrentModel(model);
  };

  const handleExpressionChange = (expression: string) => {
    setCurrentExpression(expression);
    // 这里需要调用实际的Live2D模型方法
    console.log(`Setting expression: ${expression}`);
  };

  const handleMotionPlay = (group: MotionGroup, index: number = 0) => {
    setCurrentMotion(group, index);
    // 这里需要调用实际的Live2D模型方法
    console.log(`Playing motion: ${group}[${index}]`);
  };

  const handleRandomMotion = (group: MotionGroup) => {
    const maxIndex = availableMotions[group] || 0;
    if (maxIndex > 0) {
      const randomIndex = Math.floor(Math.random() * maxIndex);
      handleMotionPlay(group, randomIndex);
    }
  };

  const handleRandomExpression = () => {
    if (availableExpressions.length > 0) {
      const randomExpression = availableExpressions[Math.floor(Math.random() * availableExpressions.length)];
      handleExpressionChange(randomExpression);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Live2D Control Panel</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* 模型选择 */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Select Model</h3>
        <div className="grid grid-cols-3 gap-2">
          {MODELS.map((model) => (
            <button
              key={model}
              onClick={() => handleModelChange(model)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentModel === model
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {model}
            </button>
          ))}
        </div>
      </div>

      {/* 表情控制 */}
      {isLoaded && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Expressions</h3>
            <button
              onClick={handleRandomExpression}
              className="px-3 py-1 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600 transition-colors"
            >
              Random
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {availableExpressions.map((expression) => (
              <button
                key={expression}
                onClick={() => handleExpressionChange(expression)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentExpression === expression
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {expression}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 动作控制 */}
      {isLoaded && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Motions</h3>
          
          {/* Idle 动作 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-600">Idle Motions ({availableMotions.Idle || 0})</h4>
              <button
                onClick={() => handleRandomMotion('Idle')}
                className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors"
              >
                Random Idle
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: availableMotions.Idle || 0 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleMotionPlay('Idle', i)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    currentMotion?.group === 'Idle' && currentMotion?.index === i
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Idle {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* TapBody 动作 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-600">Action Motions ({availableMotions.TapBody || 0})</h4>
              <button
                onClick={() => handleRandomMotion('TapBody')}
                className="px-3 py-1 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
              >
                Random Action
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: availableMotions.TapBody || 0 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleMotionPlay('TapBody', i)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    currentMotion?.group === 'TapBody' && currentMotion?.index === i
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Action {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 状态信息 */}
      <div className="text-sm text-gray-500 space-y-1">
        <div>Status: {isLoading ? 'Loading...' : isLoaded ? 'Ready' : 'Not loaded'}</div>
        {currentModel && <div>Current Model: {currentModel}</div>}
        {currentExpression && <div>Current Expression: {currentExpression}</div>}
        {currentMotion && <div>Current Motion: {currentMotion.group}[{currentMotion.index}]</div>}
      </div>
    </div>
  );
}