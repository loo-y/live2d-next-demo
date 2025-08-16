/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities

import { CubismIdHandle } from '../id/cubismid';
import { CubismModel } from '../model/cubismmodel';
import { csmVector } from '../type/csmvector';

/**
 * 呼吸機能
 *
 * 呼吸機能を提供する。
 */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
export class CubismBreath {
  /**
   * インスタンスの作成
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public static create(): CubismBreath {
    return new CubismBreath();
  }

  /**
   * インスタンスの破棄
   * @param instance 対象のCubismBreath
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public static delete(instance: CubismBreath): void {
    if (instance != null) {
      instance = null;
    }
  }

  /**
   * 呼吸のパラメータの紐づけ
   * @param breathParameters 呼吸を紐づけたいパラメータのリスト
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public setParameters(breathParameters: csmVector<BreathParameterData>): void {
    this._breathParameters = breathParameters;
  }

  /**
   * 呼吸に紐づいているパラメータの取得
   * @return 呼吸に紐づいているパラメータのリスト
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getParameters(): csmVector<BreathParameterData> {
    return this._breathParameters;
  }

  /**
   * モデルのパラメータの更新
   * @param model 対象のモデル
   * @param deltaTimeSeconds デルタ時間[秒]
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public updateParameters(model: CubismModel, deltaTimeSeconds: number): void {
    this._currentTime += deltaTimeSeconds;

    const t: number = this._currentTime * 2.0 * Math.PI;

    for (let i = 0; i < this._breathParameters.getSize(); ++i) {
      const data: BreathParameterData = this._breathParameters.at(i);

      model.addParameterValueById(
        data.parameterId,
        data.offset + data.peak * Math.sin(t / data.cycle),
        data.weight
      );
    }
  }

  /**
   * コンストラクタ
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public constructor() {
    this._currentTime = 0.0;
  }

  _breathParameters: csmVector<BreathParameterData>; // 呼吸にひもづいているパラメータのリスト
  _currentTime: number; // 積算時間[秒]
}

/**
 * 呼吸のパラメータ情報
 */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
export class BreathParameterData {
  /**
   * コンストラクタ
   * @param parameterId   呼吸をひもづけるパラメータID
   * @param offset        呼吸を正弦波としたときの、波のオフセット
   * @param peak          呼吸を正弦波としたときの、波の高さ
   * @param cycle         呼吸を正弦波としたときの、波の周期
   * @param weight        パラメータへの重み
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  constructor(
    parameterId?: CubismIdHandle,
    offset?: number,
    peak?: number,
    cycle?: number,
    weight?: number
  ) {
    this.parameterId = parameterId == undefined ? null : parameterId;
    this.offset = offset == undefined ? 0.0 : offset;
    this.peak = peak == undefined ? 0.0 : peak;
    this.cycle = cycle == undefined ? 0.0 : cycle;
    this.weight = weight == undefined ? 0.0 : weight;
  }

  parameterId: CubismIdHandle; // 呼吸をひもづけるパラメータID\
  offset: number; // 呼吸を正弦波としたときの、波のオフセット
  peak: number; // 呼吸を正弦波としたときの、波の高さ
  cycle: number; // 呼吸を正弦波としたときの、波の周期
  weight: number; // パラメータへの重み
}

// Namespace definition for compatibility.
import * as $ from './cubismbreath';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const BreathParameterData = $.BreathParameterData;
  export type BreathParameterData = $.BreathParameterData;
  export const CubismBreath = $.CubismBreath;
  export type CubismBreath = $.CubismBreath;
}

