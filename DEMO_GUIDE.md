# 🎭 Live2D Next.js Demo 使用指南

## 🚀 当前状态

✅ **已完成的功能**：
- Next.js + TypeScript 项目结构
- Zustand 状态管理
- 美观的UI界面（Tailwind CSS）
- 模拟的Live2D控制逻辑
- 响应式设计

⚠️ **模拟功能**：
- 当前版本使用模拟的Live2D模型
- 按钮点击会在控制台显示日志
- 实际的3D渲染需要集成真实的Live2D Framework

## 🎮 如何使用

### 1. 访问应用
打开浏览器访问：http://localhost:3000

### 2. 界面说明
- **左侧**：Live2D Canvas区域（当前显示占位符）
- **右侧**：控制面板，包含所有控制按钮

### 3. 功能测试

#### 选择模型
- 点击右侧面板中的模型名称按钮（Haru, Hiyori等）
- 观察加载状态变化
- 查看控制台日志

#### 控制表情
- 模型加载完成后，表情按钮会激活
- 点击具体表情按钮（happy, sad, angry等）
- 点击"Random"按钮随机切换表情
- 观察控制台输出

#### 控制动作
- **Idle动作**：待机动作，有3个可选
- **Action动作**：交互动作，有5个可选
- 点击具体动作按钮或"Random"按钮
- 观察控制台输出和状态显示

### 4. 调试信息
打开浏览器开发者工具（F12），查看Console标签：
- 模型加载日志
- 表情切换日志
- 动作播放日志
- 错误信息（如果有）

## 🔧 技术架构

### 状态管理（Zustand）
```typescript
// 获取状态
const { currentModel, currentExpression } = useLive2DStore();

// 更新状态
setCurrentModel('Haru');
setCurrentExpression('happy');
```

### 组件结构
```
App
├── Live2DCanvas (左侧画布)
└── ControlPanel (右侧控制面板)
    ├── 模型选择按钮
    ├── 表情控制按钮
    └── 动作控制按钮
```

### 模拟Live2D模型
```typescript
// 当前使用SimpleLive2DModel类
// 模拟了真实Live2D的API接口
model.setExpression('happy');
model.playMotion('Idle', 0);
```

## 🎯 下一步开发

要让这个Demo显示真实的Live2D模型，需要：

### 1. 集成Live2D Framework
```bash
# 复制Framework文件
cp -r ../../Framework ./lib/live2d/framework
```

### 2. 复制模型资源
```bash
# 复制模型文件
mkdir -p public/models
cp -r ../../Resources/* public/models/
```

### 3. 实现真实的Live2D渲染
- 替换SimpleLive2DModel中的模拟逻辑
- 集成WebGL渲染
- 实现真实的模型加载和动画播放

### 4. 添加更多功能
- 音频支持
- 拖拽交互
- 更多自定义选项
- 性能优化

## 🐛 常见问题

### Q: 为什么看不到Live2D模型？
A: 当前版本使用模拟数据，需要集成真实的Live2D Framework才能显示模型。

### Q: 按钮点击没有反应？
A: 检查浏览器控制台，应该能看到相应的日志输出。

### Q: 如何添加新的表情或动作？
A: 修改`SimpleLive2DModel`类中的模拟数据，或集成真实的model3.json文件。

## 📝 开发日志

- ✅ 项目初始化和依赖安装
- ✅ 基础UI界面和状态管理
- ✅ 模拟Live2D控制逻辑
- ⏳ Live2D Framework集成（待完成）
- ⏳ 真实模型渲染（待完成）

---

这个Demo为Live2D集成提供了一个很好的起点，具有清晰的架构和易于扩展的设计！