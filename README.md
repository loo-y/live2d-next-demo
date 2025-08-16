# Live2D Next.js Demo

一个基于 Next.js 的简化 Live2D 集成示例，使用 Zustand 进行状态管理。

## 🎯 项目特点

- ✨ **简化架构** - 移除了原始Demo的复杂交互逻辑
- 🎮 **按钮控制** - 通过UI按钮控制表情和动作，无需Canvas点击
- 🔄 **状态管理** - 使用Zustand管理Live2D状态
- 🎨 **现代UI** - 使用Tailwind CSS构建美观的控制界面
- 📱 **响应式设计** - 适配不同屏幕尺寸

## 🏗️ 项目结构

```
live2d-next-demo/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主页面
│   └── layout.tsx         # 布局组件
├── components/            # React组件
│   ├── Live2DCanvas.tsx   # Live2D画布组件
│   └── ControlPanel.tsx   # 控制面板组件
├── lib/                   # 工具库
│   └── live2d/           # Live2D相关
│       ├── config.ts      # 配置文件
│       ├── platform.ts    # 平台抽象层
│       └── simple-model.ts # 简化的模型管理器
├── stores/               # 状态管理
│   └── live2d-store.ts   # Live2D状态store
└── public/               # 静态资源
    └── models/           # Live2D模型文件 (需要复制)
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 复制Live2D资源

将Live2D模型文件复制到 `public/models/` 目录：

```bash
# 从原始Demo复制模型资源
cp -r ../Resources/* public/models/
```

### 3. 复制Framework文件

由于需要访问Live2D Framework，需要设置正确的引用路径。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🎮 功能说明

### 模型选择
- 点击模型名称按钮切换不同的Live2D角色
- 支持的模型：Haru, Hiyori, Mark, Natori, Rice, Mao, Wanko, koharu, haruto

### 表情控制
- 点击表情按钮切换角色表情
- "Random" 按钮随机切换表情
- 实时显示当前表情状态

### 动作控制
- **Idle动作** - 待机动作，角色空闲时自动播放
- **Action动作** - 交互动作，点击时播放
- 每个分组都有"Random"按钮用于随机播放
- 支持播放指定索引的动作

## 🔧 技术栈

- **Next.js 15** - React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Zustand** - 状态管理
- **Live2D Cubism SDK** - Live2D渲染引擎

## 📝 开发说明

### 状态管理

使用Zustand管理Live2D相关状态：

```typescript
const { 
  currentModel, 
  setCurrentModel,
  currentExpression,
  setCurrentExpression 
} = useLive2DStore();
```

### 添加新功能

1. **添加新的控制按钮** - 在 `ControlPanel.tsx` 中添加
2. **扩展状态** - 在 `live2d-store.ts` 中添加新的状态字段
3. **自定义配置** - 修改 `lib/live2d/config.ts`

### 简化的架构

相比原始Demo，这个版本：
- 移除了复杂的Canvas点击检测
- 简化了渲染管道
- 使用React状态管理替代原生事件系统
- 提供了更直观的UI控制界面

## 🚧 待完成功能

- [ ] 完整的Live2D Framework集成
- [ ] 实际的模型加载和渲染
- [ ] 音频支持
- [ ] 拖拽交互
- [ ] 更多自定义选项

## 📄 许可证

本项目基于Live2D Open Software License。请查看原始SDK的许可证文件。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！