"use client";
import React, { useEffect, useRef, useState } from 'react';
// import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch/cubism4';
import * as PIXI from 'pixi.js';
// import * as CUBISM4 from 'pixi-live2d-display-lipsyncpatch/cubism4';


export default function PixiLive2D() {
    const canvasRef = useRef(null);
    const [modelPath, setModelPath] = useState('/models/VT_RetroGirl/RetroGirl.model3.json');
    // const [modelPath, setModelPath] = useState('/models/or_01/ori_01.model3.json');
    const [model, setModel] = useState<any>(null);

    useEffect(() => {
        // 确保 canvas 已经渲染
        if (!canvasRef.current) return;

        if(!window.Live2DCubismCore) return;
        
        // if(!modelPath) return;
    
        const pageWidth = document.documentElement.clientWidth;
        const pageHeight = document.documentElement.clientHeight;
        // 创建并初始化 PIXI 应用
        const app = new PIXI.Application({
          view: canvasRef.current,
          autoStart: true,
          width: Math.ceil(pageWidth / 2),
          height: Math.ceil(pageHeight * 0.8),
          backgroundColor: 0x333333
        //   transparent: true,
        });
    

        
        loadModel(modelPath, app, canvasRef.current).then(model=>{
            setModel(model)
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
        const audio_link = "/sounds/demo.mp3" // 音频链接地址 [可选参数，可以为null或空] [相对或完整url路径] [mp3或wav文件]
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
    return (
        <>
            <canvas ref={canvasRef} />
            <div id="control"></div>
            <button id="playSound" onClick={handlePlaySound}>Play Sound</button>
        </>
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
    });
    app.stage.addChild(model);
    model.scale.set(0.25);
    // draggable(model);
    addFrame(model);

    // const handleMouseMove = (event: MouseEvent) => {
    //     // 将鼠标的屏幕坐标转换为 canvas 内的局部坐标
    //     const rect = canvasDom.getBoundingClientRect();
    //     const x = event.clientX - rect.left;
    //     const y = event.clientY - rect.top;

    //     // 调用高级方法，让模型看向这个点
    //     model.focus(x, y);
    // };

    // // 监听 mousemove 事件
    // window.addEventListener('mousemove', handleMouseMove);

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
    const audio_link = "/sounds/demo.mp3" // 音频链接地址 [可选参数，可以为null或空] [相对或完整url路径] [mp3或wav文件]
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
    const interpolate = (start, end, progress) => start + (end - start) * progress;
  
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
    const interpolate = (start, end, progress) => start + (end - start) * progress;
    
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
    const interpolate = (start, end, progress) => start + (end - start) * progress;
  
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