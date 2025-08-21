"use client";
import React, { useEffect, useRef, useState } from 'react';
// import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch/cubism4';
import * as PIXI from 'pixi.js';
// import * as CUBISM4 from 'pixi-live2d-display-lipsyncpatch/cubism4';


export default function PixiLive2D() {
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);
    
    // 从URL参数中读取模型名称，如果没有则使用默认值
    const getModelPathFromUrl = () => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const modelParam = urlParams.get('model');
            if (modelParam) {
                // 支持多种模型名称映射
                const modelMapping: { [key: string]: string } = {
                    'or_01': '/models/or_01/ori_01.model3.json',
                    'vt_retrogirl': '/models/VT_RetroGirl/RetroGirl.model3.json',
                    'haru': '/models/haru/haru.model3.json',
                    'hiyori': '/models/Hiyori/Hiyori.model3.json',
                    'mark': '/models/Mark/Mark.model3.json',
                    'natori': '/models/Natori/Natori.model3.json',
                    'rice': '/models/Rice/Rice.model3.json',
                    'mao': '/models/Mao/Mao.model3.json',
                    'wanko': '/models/Wanko/Wanko.model3.json',
                    'koharu': '/models/koharu/koharu.model3.json',
                    'haruto': '/models/haruto/haruto.model3.json'
                };
                
                const normalizedModel = modelParam.toLowerCase().replace(/[^a-z0-9_]/g, '');
                const modelPath = modelMapping[normalizedModel];
                
                if (modelPath) {
                    console.log(`[URL] 从URL参数读取到模型: ${modelParam} -> ${modelPath}`);
                    return modelPath;
                } else {
                    console.warn(`[URL] 未知的模型名称: ${modelParam}，使用默认模型`);
                }
            }
        }
        
        // 默认模型
        const defaultModel = '/models/VT_RetroGirl/RetroGirl.model3.json';
        console.log(`[URL] 使用默认模型: ${defaultModel}`);
        return defaultModel;
    };
    
    const [modelPath, setModelPath] = useState(getModelPathFromUrl());
    const [model, setModel] = useState<any>(null);
    const [mouseFollowEnabled, setMouseFollowEnabled] = useState(true);

    useEffect(() => {
        // 确保 canvas 已经渲染
        if (!canvasRef.current) return;
        if(!canvasContainerRef.current) return;

        if(!window.Live2DCubismCore) return;
        
        // if(!modelPath) return;
    
        const pageWidth = document.documentElement.clientWidth;
        const canvasContainerWidth = (canvasContainerRef.current as any).clientWidth;
        const canvasContainerHeight = (canvasContainerRef.current as any).clientHeight;
        const pageHeight = document.documentElement.clientHeight;
        // 创建并初始化 PIXI 应用
        const app = new PIXI.Application({
          view: canvasRef.current,
          autoStart: true,
          width: canvasContainerWidth,
          height: pageHeight * 0.7,
          backgroundColor: 0x333333
        //   transparent: true,
        });
    

        
        loadModel(modelPath, app, canvasRef.current).then(model=>{
            setModel(model)
            if (model) {
                (model as any).__mouseFollowEnabled = true;
            }
        });
        // Live2DModel.from(modelPath).then(model => {
        //   app.stage.addChild(model);
        //   model.scale.set(0.25);
        //   // ... 其他交互设置
        // });
    
        // 清理函数
        // return () => {
        //   app.destroy(true, { children: true });
        // };
      }, [modelPath]);

    const handlePlaySound = async ()=>{
        const category_name = "Idle" // 模型动作名称
        const animation_index = 0 // 该运动类别下的动画索引 [null => random]
        const priority_number = 3 // 优先级编号 如果你想保持当前动画继续或强制移动到新动画 可以调整此值 [0: 无优先级, 1: 空闲, 2: 普通, 3: 强制]
        const audio_link = "/sounds/test.mp3" // 音频链接地址 [可选参数，可以为null或空] [相对或完整url路径] [mp3或wav文件]
        const volume = 1; // 声音大小 [可选参数，可以为null或空][0.0-1.0]
        const expression = 4; // 模型表情 [可选参数，可以为null或空] [index | expression表情名称]
        const resetExpression = true; // 是否在动画结束后将表情expression重置为默认值 [可选参数，可以为null或空] [true | false] [default: true]


        // 眨眼，1秒后睁开
        // setModelParam(model, 'ParamEyeLOpen', 0)
        // setTimeout(() => {
        //     setModelParam(model, 'ParamEyeLOpen', 1);
        // }, 1000);

        // 声音嘴型同步
        model.speak(audio_link, {
            volume: volume,
            // @ts-ignore
            expression: expression,
            resetExpression: resetExpression,
            crossOrigin: "anonymous"
        });

        // let frameId;
        // const startTime = Date.now();
        // const animateBreathing = () => {
        //     let elapsedTime = Date.now() - startTime;
        //     elapsedTime = 5;
        //     // 使用sin函数创建一个-0.5到0.5的平滑周期性数值
        //     const breathValue = Math.sin(elapsedTime / 1000) * 0.5;

        //     // 调用我们自制的便捷函数
        //     setModelParam(model, 'ParamBodyAngleY', elapsedTime);

        //     frameId = requestAnimationFrame(animateBreathing);
        // };
        // animateBreathing();

    
        // const paramId = 'ParamBodyAngleY';
        // const impactValue = 50; // 使用一个远超常规的大数值
        // console.log(`Testing ${paramId} with high impact value: ${impactValue}`);
    
        // // 1. 猛地向上倾斜
        // setModelParam(model, paramId, impactValue);
    
        // // 2. 延迟后猛地向下倾斜
        // setTimeout(() => {
        //     setModelParam(model, paramId, -impactValue);
        // }, 200);
    
        // // 3. 最后恢复
        // setTimeout(() => {
        //     setModelParam(model, paramId, 0);
        // }, 400);


        // const paramId = 'ParamBodyAngleX';
        // const impactValue = 30;
    
        // console.log(`Testing ${paramId} for dramatic effect!`);
    
        // setModelParam(model, paramId, impactValue);
        // setTimeout(() => setModelParam(model, paramId, -impactValue), 250);
        // setTimeout(() => setModelParam(model, paramId, 0), 500);


        // const paramId = 'ParamBodyAngleX';
        // let impactValue = 0;
    
        // console.log(`Testing ${paramId} for dramatic effect!`);
    
        // // 动作调试
        // while(impactValue < 100){
        //     setModelParam(model, paramId, impactValue);
        //     setModelParam(model, 'ParamBodyAngleY', impactValue);
        //     impactValue += 0.05;
        //     await new Promise(resolve => setTimeout(resolve, 1));
        // }

        // while(impactValue > 0){
        //     setModelParam(model, paramId, impactValue);
        //     setModelParam(model, 'ParamBodyAngleY', impactValue);
        //     impactValue -= 0.05;
        //     await new Promise(resolve => setTimeout(resolve, 1));
        // }




        // playJoyfulJump(model, 5000);
        // playHandsOnChest(model, 5000);
        playHairFlip(model, {
            duration: 5000,
        })

        // model.motion('', 3, priority_number);
        // model.motion('', animation_index, priority_number, {
        //     sound: audio_link,
        //     volume: volume,
        //     expression: null,
        //     resetExpression: resetExpression
        // });
        console.log(`play sound success`)
    }

    const handleRandomEmotion = async () => {
        if (!model) return;
        const intents = ['joyful','happy','cheer','angry','sad','shy','love','surprised','calm'];
        const intent = intents[Math.floor(Math.random() * intents.length)];
        const variability = Math.random() * 0.6 + 0.2; // 0.2~0.8
        const energy = Math.random() * 0.7 + 0.3;      // 0.3~1.0
        const tempo = Math.random() * 0.8 + 0.7;       // 0.7~1.5
        const duration = null; // Math.floor(1200 + Math.random() * 1200); // 1200~2400ms
        console.log('[Intent] 触发表情/动作:', intent, { variability, energy, tempo, duration });
        await performIntent(model, modelPath, intent as any, { variability, energy, tempo, duration, speech: '/sounds/aaa.mp3' });
    };

    const handleResetFace = () => {
        if (!model) return;
        neutralizeFace(model, { aggressive: true });
        console.log('[Control] 脸部已回正');
    };

    const toggleMouseFollow = () => {
        setMouseFollowEnabled(!mouseFollowEnabled);
        if (model) {
            // 在模型上设置标志，让 isInteractionLocked 能读取
            (model as any).__mouseFollowEnabled = !mouseFollowEnabled;
            // lockInteraction(model, !mouseFollowEnabled);
        }
        console.log('[Control] 鼠标跟随:', !mouseFollowEnabled ? '开启' : '关闭');
    };

    const handleModelChange = (newModelPath: string) => {
        setModelPath(newModelPath);
        
        // 更新URL参数
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            const modelName = newModelPath.split('/')[2]; // 从路径中提取模型名称
            url.searchParams.set('model', modelName);
            window.history.replaceState({}, '', url.toString());
            console.log(`[URL] 已更新URL参数: model=${modelName}`);
        }
    };

    return (
        <div className='relative w-full' ref={canvasContainerRef}>
            <canvas ref={canvasRef} />
            <div id="control"></div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* 模型选择器 */}
                <select 
                    value={modelPath} 
                    onChange={(e) => handleModelChange(e.target.value)}
                    style={{ 
                        padding: '8px 12px', 
                        borderRadius: '4px', 
                        border: '1px solid #ccc',
                        backgroundColor: 'white',
                        fontSize: '14px'
                    }}
                >
                    <option value="/models/VT_RetroGirl/RetroGirl.model3.json">VT_RetroGirl</option>
                    <option value="/models/or_01/ori_01.model3.json">or_01</option>
                    <option value="/models/haru/haru.model3.json">haru</option>
                    <option value="/models/Hiyori/Hiyori.model3.json">Hiyori</option>
                    <option value="/models/Mark/Mark.model3.json">Mark</option>
                    <option value="/models/Natori/Natori.model3.json">Natori</option>
                    <option value="/models/Rice/Rice.model3.json">Rice</option>
                    <option value="/models/Mao/Mao.model3.json">Mao</option>
                    <option value="/models/Wanko/Wanko.model3.json">Wanko</option>
                    <option value="/models/koharu/koharu.model3.json">koharu</option>
                    <option value="/models/haruto/haruto.model3.json">haruto</option>
                </select>
                
                <button id="playSound" onClick={handlePlaySound}>Play Sound</button>
                <button onClick={handleRandomEmotion}>Random Emotion</button>
                <button onClick={handleResetFace}>Reset Face</button>
                <button className='absolute right-0'
                    onClick={toggleMouseFollow}
                    style={{ 
                        backgroundColor: mouseFollowEnabled ? '#4CAF50' : '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px'
                    }}
                >
                    {mouseFollowEnabled ? '✓ 跟随鼠标' : '✗ 停止跟随'}
                </button>
            </div>
        </div>
    )
}


const loadModel = async (modelPath: string, app: PIXI.Application, canvasDom: HTMLCanvasElement) => {
    console.log(`loadModel`, modelPath)
    while(!window.Live2DCubismCore) {
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    if(!window.Live2DCubismCore) return;
    // @ts-ignore
    // window.PIXI = PIXI;
    const { Live2DModel } = await import('pixi-live2d-display-lipsyncpatch/cubism4');
    const model = await Live2DModel.from(modelPath, {
        ticker: PIXI.Ticker.shared,
        // 关闭库默认的自动交互，改为我们自行控制（以便在动作期间暂停跟随鼠标）
        autoInteract: false,
    });
    app.stage.addChild(model);
    
    // 自动计算合适的缩放系数，让模型适应画布
    const modelWidth = model.internalModel.width;
    const modelHeight = model.internalModel.height;
    const canvasWidth = app.screen.width;
    const canvasHeight = app.screen.height;
    
    // 计算缩放系数，让模型在画布中占据合适比例（比如画布高度的70%）
    const targetHeight = canvasHeight * 1;
    const targetWidth = canvasWidth * 0.7;
    
    const scaleX = targetWidth / modelWidth;
    const scaleY = targetHeight / modelHeight;
    const scale = Math.min(scaleX, scaleY); // 取较小的值，确保模型完全显示在画布内
    
    console.log(`[Model Load] 模型尺寸: ${modelWidth}x${modelHeight}, 画布尺寸: ${canvasWidth}x${canvasHeight}, 计算缩放: ${scale}`);
    
    model.scale.set(scale);
    
    // 将模型居中显示
    model.x = canvasWidth / 2;
    model.y = canvasHeight / 2;
    
    // 设置模型的锚点为中心点
    model.anchor.set(0.5, 0.5);
    
    console.log(`[Model Load] 模型已居中，位置: (${model.x}, ${model.y}), 缩放: ${scale}`);
    
    // draggable(model);
    addFrame(model);

    // 手动跟随鼠标：仅在未执行意图时启用
    const handleMouseMove = (event: MouseEvent) => {
        if (isInteractionLocked(model)) return;
        const rect = canvasDom.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        try { (model as any).focus(x, y); } catch (_) {}
    };
    window.addEventListener('mousemove', handleMouseMove);

    setModelParam(model, 'ParamEyeLOpen', 0)

    setTimeout(() => {
        setModelParam(model, 'ParamEyeLOpen', 1);
    }, 1000);

    model.on("hit", (hitAreas) => {
        if (hitAreas.includes("Body")) {
          model.motion("Tap");
        }
    
        if (hitAreas.includes("Head")) {
          model.expression();
        }
      });

    // addHitAreaFrames(model);
    // transforms
    // model.x = 100;
    // model.y = 100;
    // model.rotation = Math.PI;
    // model.skew.x = Math.PI;
    // model.scale.set(2, 2);
    // model.anchor.set(0.5, 0.5);

    const category_name = "Idle" // 模型动作名称
    const animation_index = 0 // 该运动类别下的动画索引 [null => random]
    const priority_number = 3 // 优先级编号 如果你想保持当前动画继续或强制移动到新动画 可以调整此值 [0: 无优先级, 1: 空闲, 2: 普通, 3: 强制]
    const audio_link = "/sounds/aaa.mp3" // 音频链接地址 [可选参数，可以为null或空] [相对或完整url路径] [mp3或wav文件]
    const volume = 1; // 声音大小 [可选参数，可以为null或空][0.0-1.0]
    const expression = null; // 模型表情 [可选参数，可以为null或空] [index | expression表情名称]
    const resetExpression = true; // 是否在动画结束后将表情expression重置为默认值 [可选参数，可以为null或空] [true | false] [default: true]

    // model.speak(audio_link, {
    //     volume: volume,
    //     // @ts-ignore
    //     expression: expression,
    //     resetExpression: resetExpression,
    //     crossOrigin: "anonymous"
    // });

    return model
}

const fetchModel = async (modelPath: string) => {

}


// function draggable(model: PIXI.DisplayObject) {
//     model.buttonMode = true;
//     model.on("pointerdown", (e) => {
//       model.dragging = true;
//       model._pointerX = e.data.global.x - model.x;
//       model._pointerY = e.data.global.y - model.y;
//     });
//     model.on("pointermove", (e) => {
//       if (model.dragging) {
//         model.position.x = e.data.global.x - model._pointerX;
//         model.position.y = e.data.global.y - model._pointerY;
//       }
//     });
//     model.on("pointerupoutside", () => (model.dragging = false));
//     model.on("pointerup", () => (model.dragging = false));
// }
  
  function addFrame(model: any) {
    const foreground = PIXI.Sprite.from(PIXI.Texture.WHITE);
    foreground.width = model.internalModel.width;
    foreground.height = model.internalModel.height;
    foreground.alpha = 0.1;
  
    model.addChild(foreground);
  
    checkbox("Model Frames", (checked) => (foreground.visible = checked));
  }
  
// function addHitAreaFrames(model: CUBISM4.Live2DModel) {
// const hitAreaFrames = new CUBISM4.Live2DModel.HitAreaFrames();

// model.addChild(hitAreaFrames);

// checkbox("Hit Area Frames", (checked) => (hitAreaFrames.visible = checked));
// }

function checkbox(name: string, onChange: (checked: boolean) => void) {
    const id = name.replace(/\W/g, "").toLowerCase();

    let checkbox = document.getElementById(id) as HTMLInputElement;

    if (!checkbox) {
        const p = document.createElement("p");
        p.innerHTML = `<input type="checkbox" id="${id}"> <label for="${id}">${name}</label>`;

        document.getElementById("control")?.appendChild(p);
        checkbox = p.firstChild as HTMLInputElement;
    }
    
    checkbox.addEventListener("change", () => {
        onChange(checkbox.checked);
    });

    onChange(checkbox.checked);
}


/**
 * 便捷地设置Live2D模型的参数值
 * @param {Live2DModel} model - pixi-live2d-display 的模型实例
 * @param {string} paramId - 要设置的参数ID
 * @param {number} value - 要设置的值
 * @param {number} [weight=1] - 权重，可选
 */
export function setModelParam(model: any, paramId: string, value: number, weight = 1) {
    if (model && model.internalModel && model.internalModel.coreModel) {
      model.internalModel.coreModel.setParameterValueById(paramId, value, weight);
    }
}

  
  // 新增：获取模型参数值的便捷函数
export function getModelParam(model: any, paramId: string) {
    if (model && model.internalModel && model.internalModel.coreModel) {
      return model.internalModel.coreModel.getParameterValueById(paramId);
    }
    return 0;
}

/**
 * 播放一个预设的“雀跃”动画
 * @param {Live2DModel} model - pixi-live2d-display 的模型实例
 * @param {number} [duration=1000] - 动画的总时长（毫秒）
 */
export function playJoyfulJump(model: any, duration = 1000) {
    if (!model) return;
  
    // 动画中需要控制的核心参数ID
    // 注意：'ParamEyeSmile' 和 'ParamMouthForm' 是标准ID，但可能需要根据你的模型调整
    const params = {
      bodyY: 'ParamBodyAngleY',
      bodyX: 'ParamBodyAngleX',
      headZ: 'ParamAngleZ',
      brows: 'ParamBrowLY',
      eyeSmile: 'ParamEyeSmile',
      mouthForm: 'ParamMouthForm',
    };
  
    // 1. 定义动画的关键帧 (时间点[0-1], 目标值)
    const keyframes = {
      [params.bodyY]: [
        { time: 0, value: getModelParam(model, params.bodyY) }, // 从当前位置开始
        { time: 0.15, value: -20 }, // 准备：快速下蹲
        { time: 0.5, value: 30 },  // 跳跃：到达最高点
        { time: 0.85, value: -15 }, // 落地：缓冲
        { time: 1, value: 0 },      // 恢复：站稳
      ],
      [params.headZ]: [
        { time: 0, value: getModelParam(model, params.headZ) },
        { time: 0.3, value: 15 },  // 跳起来时开心得歪头
        { time: 0.7, value: -10 },
        { time: 1, value: 0 },
      ],
      [params.brows]: [ // 眉毛上扬，显得更惊讶/开心
        { time: 0, value: getModelParam(model, params.brows) },
        { time: 0.3, value: 1 },
        { time: 1, value: 0 },
      ],
      [params.eyeSmile]: [ // 眼睛笑起来
        { time: 0, value: getModelParam(model, params.eyeSmile) },
        { time: 0.2, value: 1 },
        { time: 1, value: 0 },
      ],
      [params.mouthForm]: [ // 嘴巴变成微笑 (1 通常代表微笑)
        { time: 0, value: getModelParam(model, params.mouthForm) },
        { time: 0.2, value: 1 },
        { time: 1, value: 0 },
      ],
    };
  
    const startTime = Date.now();
    let frameId: number;
  
    // 线性插值函数，用于计算中间值
    const interpolate = (start: number, end: number, progress: number): number => start + (end - start) * progress;
  
    function animate() {
      const elapsedTime = Date.now() - startTime;
      let progress = elapsedTime / duration;
  
      if (progress >= 1) {
        progress = 1;
        // 确保最终状态是关键帧的最后一个值
        for (const paramId in keyframes) {
          const lastFrame = keyframes[paramId][keyframes[paramId].length - 1];
          setModelParam(model, paramId, lastFrame.value);
        }
        cancelAnimationFrame(frameId);
        return;
      }
  
      // 为每一个参数计算并设置当前帧的值
      for (const paramId in keyframes) {
        const frames = keyframes[paramId];
        
        // 找到当前时间点前后的两个关键帧
        let startFrame = frames[0];
        let endFrame = frames[frames.length - 1];
  
        for (let i = 0; i < frames.length - 1; i++) {
          if (progress >= frames[i].time && progress <= frames[i+1].time) {
            startFrame = frames[i];
            endFrame = frames[i+1];
            break;
          }
        }
  
        // 计算在这两个关键帧之间的小进度
        const frameProgress = (progress - startFrame.time) / (endFrame.time - startFrame.time);
        const currentValue = interpolate(startFrame.value, endFrame.value, frameProgress);
  
        setModelParam(model, paramId, currentValue);
      }
  
      frameId = requestAnimationFrame(animate);
    }
  
    animate();
}


/**
 * 播放一个预设的“双手放胸前”动画
 * @param {Live2DModel} model - pixi-live2d-display 的模型实例
 * @param {number} [duration=800] - 动画时长（毫秒）
 */
export function playHandsOnChest(model: any, duration = 800) {
    if (!model) return;
  
    // === 在这里填入您在编辑器中找到的参数ID ===
    const params = {
      // 示例：这些ID都是我编的，您需要换成真实的
      leftArmRaise: 'ParamArmLY',      // 控制左臂上下
      leftArmBend: 'ParamArmLElbow',   // 控制左臂弯曲
      rightArmRaise: 'ParamArmRY',     // 控制右臂上下
      rightArmBend: 'ParamArmRElbow',  // 控制右臂弯曲
      bodySway: 'ParamBodyAngleX',     // 配合一点身体晃动更自然
    };
    // ==========================================
  
    // 定义关键帧 (时间点[0-1], 目标值)
    // 您需要通过在编辑器里拖动滑块来确定这些目标值大概是多少
    const keyframes = {
      [params.leftArmRaise]: [
        { time: 0, value: getModelParam(model, params.leftArmRaise) }, // 从当前值开始
        { time: 1, value: 15 }, // 假设15是抬起到胸前的高度
      ],
      [params.leftArmBend]: [
        { time: 0, value: getModelParam(model, params.leftArmBend) },
        { time: 1, value: 0.8 }, // 假设0.8是弯曲到胸前的程度
      ],
      [params.rightArmRaise]: [
        { time: 0, value: getModelParam(model, params.rightArmRaise) },
        { time: 1, value: 15 },
      ],
      [params.rightArmBend]: [
        { time: 0, value: getModelParam(model, params.rightArmBend) },
        { time: 1, value: 0.8 },
      ],
      [params.bodySway]: [
        { time: 0, value: getModelParam(model, params.bodySway) },
        { time: 1, value: 5 }, // 配合一个轻微的身体晃动
      ],
    };
  
    // 后面的动画循环逻辑 (interpolate, animate函数) 和 playJoyfulJump 完全一样
    // ... (您可以直接复用那部分代码)
    const startTime = Date.now();
    let frameId: number;
    const interpolate = (start: number, end: number, progress: number): number => start + (end - start) * progress;
    
    function animate() {
      const elapsedTime = Date.now() - startTime;
      let progress = elapsedTime / duration;
      if (progress >= 1) {
        progress = 1;
        // ... (省略和之前一样的结束逻辑)
        cancelAnimationFrame(frameId);
        return;
      }
      // ... (省略和之前一样的插值计算和setModelParam调用)
      frameId = requestAnimationFrame(animate);
    }
    
    animate();
  }


  /**
 * 播放一个预设的“甩头秀发飞扬”动画
 * @param {Live2DModel} model - pixi-live2d-display 的模型实例
 * @param {object} options - 动画选项
 * @param {number} [options.duration=800] - 动画总时长（毫秒）
 * @param {'left' | 'right'} [options.direction='left'] - 甩头方向
 * @param {number} [options.impactValue=30] - 甩头的最大角度
 */
export function playHairFlip(model: any, { duration = 800, direction = 'left', impactValue = 30 } = {}) {
    if (!model) return;
  
    // 核心控制参数
    const params = {
      headX: 'ParamAngleX',
      headZ: 'ParamAngleZ', // 配合Z轴倾斜，动作更具动感
    };
  
    const targetX = direction === 'left' ? impactValue : -impactValue;
  
    // 1. 定义动画的关键帧
    // 这个关键帧设计包含了“预备-爆发-缓冲-恢复”的节奏
    const keyframes = {
      [params.headX]: [
        { time: 0, value: getModelParam(model, params.headX) },
        { time: 0.15, value: targetX * -0.8 }, // 1. 快速向反方向蓄力
        { time: 0.5, value: targetX },        // 2. 猛地甩到目标位置
        { time: 0.8, value: targetX * 0.8 },  // 3. 轻微回弹
        { time: 1, value: targetX * 0.9 },    // 4. 稳定在目标方向
      ],
      [params.headZ]: [
        { time: 0, value: getModelParam(model, params.headZ) },
        { time: 0.15, value: targetX * -0.5 }, // 蓄力时头也跟着歪
        { time: 0.5, value: targetX * 0.5 },  // 甩过去时向另一边歪
        { time: 1, value: 0 },              // 最后恢复水平
      ],
    };
  
    const startTime = Date.now();
    let frameId: number;
  
    // 复用之前的动画循环逻辑
    const interpolate = (start: number, end: number, progress: number): number => start + (end - start) * progress;
  
    function animate() {
      const elapsedTime = Date.now() - startTime;
      let progress = elapsedTime / duration;
  
      if (progress >= 1) {
        progress = 1;
        // 确保动画结束时参数停在最终位置
        for (const paramId in keyframes) {
          const lastFrame = keyframes[paramId][keyframes[paramId].length - 1];
          setModelParam(model, paramId, lastFrame.value);
        }
        cancelAnimationFrame(frameId);
        return;
      }
  
      for (const paramId in keyframes) {
        const frames = keyframes[paramId];
        let startFrame = frames[0];
        let endFrame = frames[frames.length - 1];
        for (let i = 0; i < frames.length - 1; i++) {
          if (progress >= frames[i].time && progress <= frames[i+1].time) {
            startFrame = frames[i];
            endFrame = frames[i+1];
            break;
          }
        }
        const frameProgress = (progress - startFrame.time) / (endFrame.time - startFrame.time);
        const currentValue = interpolate(startFrame.value, endFrame.value, frameProgress);
        setModelParam(model, paramId, currentValue);
      }
      frameId = requestAnimationFrame(animate);
    }
  
    animate();
}

// ============== 以下：通用“语义 -> 动作”实现（读取 physics/expressions，自适配不同模型） ==============

type IntentName =
    | 'joyful'
    | 'happy'
    | 'cheer'
    | 'angry'
    | 'sad'
    | 'shy'
    | 'love'
    | 'surprised'
    | 'calm';

type PerformOptions = {
    duration?: number | null;
    speech?: string | null;
    variability?: number; // 0..1 越大越随机
    energy?: number;      // 0..1 越大动作越大
    tempo?: number;       // 0.5..1.5 节奏快慢
    useExpression?: boolean; // 是否使用模型自带的 expression（默认 false，便于可控复原）
};

async function fetchJson<T = any>(url: string): Promise<T | null> {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return (await res.json()) as T;
    } catch (_) {
        return null;
    }
}

function dirnameOf(path: string): string {
    const idx = path.lastIndexOf('/');
    return idx >= 0 ? path.slice(0, idx) : '';
}

function joinPath(dir: string, relative: string): string {
    if (!dir) return relative;
    if (relative.startsWith('/')) return relative; // 已是绝对
    return `${dir}/${relative}`.replace(/\\/g, '/');
}

async function discoverModelResources(modelPath: string): Promise<{ physicsInputs: Set<string>; expressionNames: string[]; }>{
    const physicsInputs = new Set<string>();
    const expressionNames: string[] = [];

    const settings = await fetchJson<any>(modelPath);
    if (!settings) return { physicsInputs, expressionNames };

    // expressions（如果存在）
    const expressions = settings.FileReferences?.Expressions || settings.Expressions || [];
    if (Array.isArray(expressions)) {
        for (const exp of expressions) {
            if (typeof exp?.Name === 'string') expressionNames.push(exp.Name);
        }
    }

    // physics（如果存在）
    const physicsFileRel: string | undefined = settings.FileReferences?.Physics || settings.Physics;
    if (physicsFileRel && typeof physicsFileRel === 'string') {
        const base = dirnameOf(modelPath);
        const physicsUrl = joinPath(base, physicsFileRel);
        const physics = await fetchJson<any>(physicsUrl);
        const groups = physics?.PhysicsSettings;
        if (Array.isArray(groups)) {
            for (const group of groups) {
                const inputs = group?.Input;
                if (Array.isArray(inputs)) {
                    for (const inp of inputs) {
                        const pid = inp?.Source?.Id;
                        if (typeof pid === 'string') physicsInputs.add(pid);
                    }
                }
            }
        }
    }

    return { physicsInputs, expressionNames };
}

export async function performIntent(model: any, modelPath: string, intent: IntentName, options: PerformOptions = {}) {
    if (!model || !modelPath) return;
    lockInteraction(model, true);
    // 注意：回正在各意图内部以轻量方式进行，避免与动画写入产生冲突
    // 若有语音但未指定时长，则以音频时长为准
    if (options.speech && (options.duration == null)) {
        try {
            const ms = await getAudioDurationMs(options.speech);
            console.log('audio ms', ms)
            if (Number.isFinite(ms) && ms > 0) options.duration = ms;
        } catch (_) {
          console.log('audio ms error', _)
        }
    }
    const { physicsInputs, expressionNames } = await discoverModelResources(modelPath);
    switch (intent) {
        case 'joyful':
            await performJoyful(model, physicsInputs, expressionNames, options);
            break;
        case 'happy':
            await performJoyful(model, physicsInputs, expressionNames, { ...options, energy: options.energy ?? 0.5, variability: options.variability ?? 0.3 });
            break;
        case 'cheer':
            await performJoyful(model, physicsInputs, expressionNames, { ...options, energy: options.energy ?? 0.9, variability: options.variability ?? 0.5, tempo: options.tempo ?? 1.2 });
            break;
        case 'angry':
            await performBasicEmotion(model, expressionNames, {
                duration: options.duration ?? 1200,
                micro: { browY: -0.7, eyeOpen: 0.7, mouthForm: 0.0, mouthOpen: 0.4, cheek: 0.2 },
                head: { x: 20, z: 12 },
                body: { x: 18, y: 8, z: 6 },
                swayHz: 2.2,
                swayAmp: 0.25,
                motionType: 'sharp',
                speech: options.speech ?? null,
                suppressMouth: Boolean(options.speech),
            });
            break;
        case 'sad':
            await performBasicEmotion(model, expressionNames, {
                duration: options.duration ?? 1600,
                micro: { browY: 0.3, eyeOpen: 0.6, mouthForm: 0.1, mouthOpen: 0.2, cheek: 0.0 },
                head: { x: -18, z: -15 },
                body: { x: -16, y: -4, z: -8 },
                swayHz: 0.4,
                swayAmp: 0.06,
                motionType: 'heavy',
                speech: options.speech ?? null,
                suppressMouth: Boolean(options.speech),
            });
            break;
        case 'shy':
            await performBasicEmotion(model, expressionNames, {
                duration: options.duration ?? 1500,
                micro: { browY: 0.1, eyeOpen: 0.75, mouthForm: 0.6, mouthOpen: 0.25, cheek: 0.9 },
                head: { x: 8, z: 25 },
                body: { x: 6, y: 12, z: 10 },
                swayHz: 1.1,
                swayAmp: 0.15,
                motionType: 'gentle',
                speech: options.speech ?? null,
                suppressMouth: Boolean(options.speech),
            });
            break;
        case 'love':
            await performBasicEmotion(model, expressionNames, {
                duration: options.duration ?? 1800,
                micro: { browY: 0.2, eyeOpen: 0.8, eyeSmile: 1.0, mouthForm: 0.9, mouthOpen: 0.35, cheek: 1.0 },
                head: { x: 15, z: 28 },
                body: { x: 12, y: 10, z: 8 },
                swayHz: 0.7,
                swayAmp: 0.12,
                motionType: 'warm',
                speech: options.speech ?? null,
                suppressMouth: Boolean(options.speech),
            });
            break;
        case 'surprised':
            await performBasicEmotion(model, expressionNames, {
                duration: options.duration ?? 900,
                micro: { browY: 1.0, eyeOpen: 1.0, mouthForm: 0.2, mouthOpen: 1.0, cheek: 0.2 },
                head: { x: -25, z: 0 },
                body: { x: -20, y: 12, z: 0 },
                swayHz: 1.8,
                swayAmp: 0.08,
                motionType: 'bounce',
                speech: options.speech ?? null,
                suppressMouth: Boolean(options.speech),
            });
            break;
        case 'calm':
            await performBasicEmotion(model, expressionNames, {
                duration: options.duration ?? 1200,
                micro: { browY: 0, eyeOpen: 0.9, mouthForm: 0.2, mouthOpen: 0.1, cheek: 0.1 },
                head: { x: 0, z: 0 },
                body: { x: 0, y: 0, z: 0 },
                swayHz: 0.3,
                swayAmp: 0.03,
                motionType: 'smooth',
                speech: options.speech ?? null,
                suppressMouth: Boolean(options.speech),
            });
            break;
        default:
            break;
    }
    // 解锁交互在 smoothRestore 结束回调里进行
}

async function performJoyful(
    model: any,
    physicsInputs: Set<string>,
    expressionNames: string[],
    { duration = 1500, speech = null, variability = 0.4, energy = 0.6, tempo = 1.0, useExpression = false }: PerformOptions = {}
) {
    // 归一并钳制
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    variability = clamp01(variability);
    energy = clamp01(energy);
    tempo = Math.min(1.5, Math.max(0.5, tempo));

    // 随机助手
    const rnd = (min: number, max: number) => min + Math.random() * (max - min);
    const jitter = (base: number, amount: number) => base + rnd(-amount, amount);

    // 我们默认不切换 expression，便于可控地复原；如需可打开 useExpression
    const happyCandidates = expressionNames.filter(n => /happy|joy|smile|laugh|cheer|grin/i.test(n));
    const happyExp = happyCandidates.length ? happyCandidates[Math.floor(Math.random() * happyCandidates.length)] : undefined;

    // 需要复原的参数集合（只记录我们改动的）
    const toRestore = new Map<string, number>();
    const markBaseline = (id: string | null) => {
        if (!id) return;
        try { if (!toRestore.has(id)) toRestore.set(id, getModelParam(model, id)); } catch (_) {}
    };

    // 表情兜底：手动调常见微表情参数（若不存在会被忽略）
    const microParams = ['ParamEyeSmile', 'ParamMouthForm', 'ParamCheek'];
    for (const pid of microParams) markBaseline(pid);
    safeSet(model, 'ParamEyeSmile', jitter(0.9, 0.1 * variability));
    safeSet(model, 'ParamMouthForm', jitter(0.9, 0.1 * variability));
    safeSet(model, 'ParamCheek', jitter(0.6 + 0.3 * energy, 0.1 * variability));

    if (useExpression && happyExp && typeof model?.expression === 'function') {
        try { console.log('[Joyful] 使用 expression:', happyExp); model.expression(happyExp); } catch (_) {}
    }

    // 2) 头/身姿态输入：优先使用标准参数名（即使 physics 未订阅，也能看到身体动作）
    const headX: string | null = 'ParamAngleX';
    const headZ: string | null = 'ParamAngleZ';
    const headY: string | null = 'ParamAngleY';
    const bodyX: string | null = 'ParamBodyAngleX';
    const bodyY: string | null = 'ParamBodyAngleY';
    const bodyZ: string | null = 'ParamBodyAngleZ';
    const breath: string | null = 'ParamBreath';

    // 标记将要改动的输入参数，便于结束后复原
    [headX, headZ, headY, bodyX, bodyY, bodyZ, breath].forEach(markBaseline);

    // 将视线与头部快速回正（轻量，不做多帧强制），避免保持上一次鼠标焦点朝向
    neutralizeFace(model, { forIntent: true });

    // 随机方向与强度
    const dir = Math.random() < 0.5 ? -1 : 1;
    const headMax = 25 + 30 * energy;    // 25~55 左右转头幅度
    const headYawMax = 10 + 15 * energy; // 10~25 Y 轴转头
    const tiltMax = 10 + 18 * energy;    // 10~28 头部侧倾
    const bodyMax = 15 + 20 * energy;    // 15~35 身体前后摆
    const bodyTwistMax = 12 + 18 * energy;// 12~30 身体左右扭
    const bodyRollMax = 8 + 15 * energy; // 8~23 身体侧倾
    const breathAmp = 0.4 + 0.6 * energy; // 0.4~1.0

    // 随机时长（若为 null，说明上层用音频时长覆盖了，这里设一个兜底）
    if (duration == null || !Number.isFinite(duration)) {
        duration = 1800;
    } else {
        duration = jitter(duration / tempo, duration * 0.15 * variability);
    }

    // 预计算次级节奏频率与相位，避免逐帧随机引起抖动
    const freqHeadYaw = rnd(0.7, 1.0);
    const phaseHeadYaw = rnd(0, Math.PI * 2);
    const freqBodySwing2 = rnd(1.0, 1.4);
    const phaseBodySwing2 = rnd(0, Math.PI * 2);
    const freqBodyTwist = rnd(0.8, 1.1);
    const phaseBodyTwist = rnd(0, Math.PI * 2);
    const freqBreath = rnd(0.4, 0.6); // Hz

    const startTime = Date.now();
    let frameId: number;
    let lastTs = startTime;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function curveJoy(t: number) {
        // 简单“预备-爆发-缓冲-恢复”节奏曲线 [0,1]
        const a = jitter(0.12, 0.05 * variability);  // 预备截止
        const b = jitter(0.5, 0.07 * variability);   // 爆发截止
        const c = jitter(0.8, 0.05 * variability);   // 缓冲截止
        if (t < a) return -0.8 * (t / a);
        if (t < b) return lerp(-0.8, 1, (t - a) / (b - a));
        if (t < c) return lerp(1, 0.8, (t - b) / (c - b));
        return lerp(0.8, 0.9, (t - c) / (1 - c));
    }

    console.log('[Joyful] 开始动作', {
        duration,
        variability,
        energy,
        tempo,
        direction: dir,
        headMax,
        headYawMax,
        tiltMax,
        bodyMax,
        bodyTwistMax,
        bodyRollMax,
        breathAmp,
        inputs: { headX, headY, headZ, bodyX, bodyY, bodyZ, breath },
    });

    // 参数级低通滤波，缓解僵硬/抖动
    const smoothState = new Map<string, number>();
    function smoothSet(pid: string | null, target: number, alpha: number) {
        if (!pid) return;
        const prev = smoothState.has(pid) ? (smoothState.get(pid) as number) : getModelParam(model, pid);
        const val = prev + (target - prev) * alpha;
        smoothState.set(pid, val);
        setModelParam(model, pid, val);
    }

    function animate() {
        const now = Date.now();
        const elapsed = now - startTime;
        const dt = Math.max(16, now - lastTs);
        lastTs = now;
        let p = elapsed / (duration as number);
        if (p > 1) p = 1;
        const tSec = elapsed / 1000;
        // 低通滤波系数（时间常数），tempo 越大越快
        const tauMs = 110 / tempo;
        const alpha = 1 - Math.exp(-dt / tauMs);

        // 头部/身体：大幅与次级节奏叠加，带动物理
        const headSwing = curveJoy(p) * headMax * dir;
        const headYaw = curveJoy(p) * headYawMax * dir * 0.7 + Math.sin(tSec * 2 * Math.PI * freqHeadYaw + phaseHeadYaw) * (headYawMax * 0.18);
        const bodySwing = curveJoy(p) * bodyMax * dir + Math.sin(tSec * 2 * Math.PI * freqBodySwing2 + phaseBodySwing2) * (bodyMax * 0.2);
        const bodyTwist = curveJoy(p) * bodyTwistMax * dir * 0.7 + Math.sin(tSec * 2 * Math.PI * freqBodyTwist + phaseBodyTwist) * (bodyTwistMax * 0.18);
        const bodyRoll = curveJoy(p) * bodyRollMax * dir * 0.6;
        const tilt = curveJoy(p) * tiltMax * dir;

        smoothSet(headX, headSwing, alpha);
        smoothSet(headY, headYaw, alpha);
        smoothSet(headZ, tilt * 0.6, alpha);
        smoothSet(bodyX, bodySwing, alpha);
        smoothSet(bodyY, bodyTwist, alpha);
        smoothSet(bodyZ, bodyRoll, alpha);

        if (breath) {
            const breathValue = Math.sin(tSec * 2 * Math.PI * freqBreath) * breathAmp;
            smoothSet(breath, breathValue, alpha);
        }

        // 动作期间让眼球回正，避免保留点击前的视线方向
        smoothSet('ParamEyeBallX', 0, alpha);
        smoothSet('ParamEyeBallY', 0, alpha);

        if (p >= 1) {
            cancelAnimationFrame(frameId);
            // 平滑复原到动画前的值
            smoothRestore(model, toRestore, 500);
            console.log('[Joyful] 动作完成，已开始复原');
            return;
        }
        frameId = requestAnimationFrame(animate);
    }

    animate();

    // 3) 语音（可选）
    if (speech && typeof model?.speak === 'function') {
        try { model.speak(speech, { volume: 1, resetExpression: false, crossOrigin: 'anonymous' }); } catch (_) {}
    }
}

function safeSet(model: any, paramId: string, value: number) {
    try { 
        setModelParam(model, paramId, value);
    } catch (e) { 
        // 忽略写入异常，避免刷屏
    }
}

function neutralizeFace(model: any, opts?: { aggressive?: boolean; forIntent?: boolean }) {
    const aggressive = Boolean(opts?.aggressive);
    const forIntent = Boolean(opts?.forIntent);

    // 轻量回正：仅归零关键参数，不做多帧/轮询强制；用于意图动画开始前
    const applyZeroOnce = () => {
        safeSet(model, 'ParamEyeBallX', 0);
        safeSet(model, 'ParamEyeBallY', 0);
        safeSet(model, 'ParamAngleX', 0);
        safeSet(model, 'ParamAngleY', 0);
        safeSet(model, 'ParamAngleZ', 0);
        safeSet(model, 'ParamBodyAngleX', 0);
        safeSet(model, 'ParamBodyAngleY', 0);
        safeSet(model, 'ParamBodyAngleZ', 0);
    };

    if (forIntent) {
        applyZeroOnce();
        return;
    }

    // 强力回正：用于用户点击“回正”按钮，允许短暂多帧巩固，但不与后续动画抢写
    if (aggressive) {
        // 可选：将焦点置于当前模型中心附近，减少视线偏移（以画布中心为兜底）
        try {
            const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
            if (canvas && typeof (model as any).focus === 'function') {
                const rect = canvas.getBoundingClientRect();
                (model as any).focus(rect.width / 2, rect.height / 2);
            }
        } catch (_) {}

        // 两帧内巩固一次
        requestAnimationFrame(() => {
            applyZeroOnce();
            requestAnimationFrame(() => {
                applyZeroOnce();
                // 解锁交互
                lockInteraction(model, false);
            });
        });
        return;
    }

    // 默认回正：一次性归零
    applyZeroOnce();
}

async function getAudioDurationMs(src: string): Promise<number> {
    return new Promise((resolve, reject) => {
        try {
            const audio = new Audio();
            audio.preload = 'metadata';
            audio.src = src;
            audio.onloadedmetadata = () => {
                if (audio.duration && Number.isFinite(audio.duration)) {
                    resolve(audio.duration * 1000);
                } else {
                    resolve(0);
                }
            };
            audio.onerror = () => resolve(0);
        } catch (e) {
            resolve(0);
        }
    });
}

// 基础表情/动作：以表情微调 + 轻微姿态 + 轻摆组合，通用且可复原
async function performBasicEmotion(
    model: any,
    expressionNames: string[],
    cfg: {
        duration: number;
        micro: { browY?: number; eyeOpen?: number; eyeSmile?: number; mouthForm?: number; mouthOpen?: number; cheek?: number; };
        head: { x?: number; z?: number; };
        body: { x?: number; y?: number; z?: number; };
        swayHz: number;
        swayAmp: number;
        motionType: 'sharp' | 'heavy' | 'gentle' | 'warm' | 'bounce' | 'smooth';
        speech?: string | null;
        suppressMouth?: boolean;
    }
) {
    const toRestore = new Map<string, number>();
    const mark = (id: string) => { try { if (!toRestore.has(id)) toRestore.set(id, getModelParam(model, id)); } catch (_) {} };

    const set = (id: string, val: number | undefined) => {
        if (typeof val !== 'number') return;
        mark(id);
        safeSet(model, id, val);
    };

    // 表情微调（若参数不存在会被忽略）
    set('ParamBrowLY', cfg.micro.browY);
    set('ParamBrowRY', cfg.micro.browY);
    set('ParamEyeLOpen', cfg.micro.eyeOpen);
    set('ParamEyeROpen', cfg.micro.eyeOpen);
    set('ParamEyeSmile', cfg.micro.eyeSmile);
    set('ParamMouthForm', cfg.micro.mouthForm);
    if (!cfg.suppressMouth) set('ParamMouthOpenY', cfg.micro.mouthOpen);
    set('ParamCheek', cfg.micro.cheek);

    // 姿态目标（一次到位 + 轻微摆动）
    const start = Date.now();
    let frameId: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const begin: Record<string, number> = {};
    const target: Record<string, number> = {
        ParamAngleX: cfg.head.x ?? 0,
        ParamAngleZ: cfg.head.z ?? 0,
        ParamBodyAngleX: cfg.body.x ?? 0,
        ParamBodyAngleY: cfg.body.y ?? 0,
        ParamBodyAngleZ: cfg.body.z ?? 0,
    };
    Object.keys(target).forEach(id => { mark(id); begin[id] = getModelParam(model, id); });

    // 根据情绪类型设计不同的动作曲线
    function getMotionCurve(t: number, motionType: string): number {
        switch (motionType) {
            case 'sharp': // angry: 快速爆发，然后保持
                return t < 0.3 ? t / 0.3 : 1;
            case 'heavy': // sad: 缓慢下沉，然后轻微起伏
                return t < 0.6 ? t / 0.6 : 0.8 + 0.2 * Math.sin((t - 0.6) * Math.PI * 2);
            case 'gentle': // shy: 轻柔渐进，然后轻微摆动
                return t < 0.7 ? t / 0.7 : 0.9 + 0.1 * Math.sin((t - 0.7) * Math.PI * 1.5);
            case 'warm': // love: 温暖展开，然后柔和波动
                return t < 0.5 ? t / 0.5 : 0.95 + 0.05 * Math.sin((t - 0.5) * Math.PI * 1.2);
            case 'bounce': // surprised: 瞬间爆发，然后回弹
                return t < 0.2 ? t / 0.2 : t < 0.6 ? 1 : 1 - Math.pow((t - 0.6) / 0.4, 2);
            case 'smooth': // calm: 平滑过渡，然后极轻微摆动
                return t < 0.8 ? t / 0.8 : 0.98 + 0.02 * Math.sin((t - 0.8) * Math.PI * 0.8);
            default:
                return t;
        }
    }

    function anim() {
        const elapsed = Date.now() - start;
        let p = Math.min(1, elapsed / cfg.duration);
        const tSec = elapsed / 1000;
        
        // 使用情绪特定的动作曲线
        const motionCurve = getMotionCurve(p, cfg.motionType);
        
        // 根据情绪类型调整摆动
        let sway: number;
        switch (cfg.motionType) {
            case 'sharp':
                sway = Math.sin(tSec * 2 * Math.PI * cfg.swayHz) * cfg.swayAmp * (p < 0.3 ? 0.5 : 1);
                break;
            case 'heavy':
                sway = Math.sin(tSec * 2 * Math.PI * cfg.swayHz) * cfg.swayAmp * (p < 0.6 ? 0.3 : 1);
                break;
            case 'bounce':
                sway = Math.sin(tSec * 2 * Math.PI * cfg.swayHz * 3) * cfg.swayAmp * (p < 0.2 ? 0.2 : 1);
                break;
            default:
                sway = Math.sin(tSec * 2 * Math.PI * cfg.swayHz) * cfg.swayAmp;
        }
        
        for (const id of Object.keys(target)) {
            const to = target[id] + sway * (id === 'ParamAngleZ' ? 0.6 : 1);
            const v = lerp(begin[id], to, motionCurve);
            safeSet(model, id, v);
        }

        if (p >= 1) {
            // 结束后复原
            smoothRestore(model, toRestore, 400);
            return;
        }
        frameId = requestAnimationFrame(anim);
    }
    frameId = requestAnimationFrame(anim);

    // 同步语音（如果提供）
    if (cfg.speech && typeof model?.speak === 'function') {
        try { model.speak(cfg.speech, { volume: 1, resetExpression: false, crossOrigin: 'anonymous' }); } catch (_) {}
    }
}

function smoothRestore(model: any, baselines: Map<string, number>, restoreMs: number) {
    const start = Date.now();
    const beginValues = new Map<string, number>();
    for (const [id] of baselines) {
        try { beginValues.set(id, getModelParam(model, id)); } catch (_) {}
    }
    let frameId: number;
    const step = () => {
        const t = Math.min(1, (Date.now() - start) / restoreMs);
        for (const [id, endVal] of baselines) {
            const begin = beginValues.get(id);
            if (typeof begin !== 'number') continue;
            const val = begin + (endVal - begin) * t;
            safeSet(model, id, val);
        }
        if (t >= 1) {
            console.log('[Joyful] 复原完成');
            lockInteraction(model, false);
            return;
        }
        frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
}

// 简单的交互锁，阻止动作期间的鼠标跟随
const INTERACTION_LOCK_KEY = '__intentLocked';
function lockInteraction(model: any, locked: boolean) {
    try { (model as any)[INTERACTION_LOCK_KEY] = locked; } catch (_) {}
}
function isInteractionLocked(model: any): boolean {
    try { 
        // 检查是否被意图执行锁定，或者用户手动关闭了跟随
        const intentLocked = Boolean((model as any)[INTERACTION_LOCK_KEY]);
        const userDisabled = !(model as any).__mouseFollowEnabled;
        return intentLocked || userDisabled;
    } catch (_) { 
        return false; 
    }
}