"use client";
import React, { useEffect, useRef, useState } from 'react';
// import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch/cubism4';
import * as PIXI from 'pixi.js';
import * as CUBISM4 from 'pixi-live2d-display-lipsyncpatch/cubism4';


export default function PixiLive2D() {
    const canvasRef = useRef(null);
    const [modelPath, setModelPath] = useState('/models/haru/haru.model3.json');

    useEffect(() => {
        // 确保 canvas 已经渲染
        if (!canvasRef.current) return;

        if(!window.Live2DCubismCore) return;
        
        // if(!modelPath) return;
    
        // 创建并初始化 PIXI 应用
        const app = new PIXI.Application({
          view: canvasRef.current,
          autoStart: true,
          width: 500,
          height: 600,
          backgroundColor: 0x333333
        //   transparent: true,
        });
    

        
        loadModel(modelPath, app);
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

    return (
        <>
            <canvas ref={canvasRef} />
            <div id="control"></div>
        </>
    )
}


const loadModel = async (modelPath: string, app: PIXI.Application) => {
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
    model.scale.set(0.1);
    // draggable(model);
    addFrame(model);

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
