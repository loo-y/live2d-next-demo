/**
 * Live2D 配置文件 - Next.js 简化版
 */

// 模型资源路径
export const RESOURCES_PATH = '/models/';

// 可用的模型列表
export const MODELS = [
  'haru',
  'Hiyori', 
  'Mark',
  'Natori',
  'Rice',
  'Mao',
  'Wanko',
  'Koharu',
  'haruto'
] as const;

// 动作分组
export const MOTION_GROUPS = {
  IDLE: 'Idle',
  TAP_BODY: 'TapBody'
} as const;

// 动作优先级
export const PRIORITY = {
  NONE: 0,
  IDLE: 1,
  NORMAL: 2,
  FORCE: 3
} as const;

// Canvas 设置
export const CANVAS_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  VIEW_SCALE: 1.0,
  VIEW_MAX_SCALE: 2.0,
  VIEW_MIN_SCALE: 0.8
} as const;

// 调试设置
export const DEBUG = {
  LOG_ENABLE: true,
  TOUCH_LOG_ENABLE: false
} as const;

export type ModelName = typeof MODELS[number];
export type MotionGroup = typeof MOTION_GROUPS[keyof typeof MOTION_GROUPS];