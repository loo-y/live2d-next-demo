/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities

import { CubismMatrix44 } from '../math/cubismmatrix44';
import { CubismModel } from '../model/cubismmodel';
import { csmRect } from '../type/csmrectf';
import { ICubismClippingManager } from './cubismclippingmanager';

/**
 * モデル描画を処理するレンダラ
 *
 * サブクラスに環境依存の描画命令を記述する。
 */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
export abstract class CubismRenderer {
  /**
   * レンダラのインスタンスを生成して取得する
   *
   * @return レンダラのインスタンス
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public static create(): CubismRenderer {
    return null;
  }

  /**
   * レンダラのインスタンスを解放する
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public static delete(renderer: CubismRenderer): void {
    renderer = null;
  }

  /**
   * レンダラの初期化処理を実行する
   * 引数に渡したモデルからレンダラの初期化処理に必要な情報を取り出すことができる
   * @param model モデルのインスタンス
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public initialize(model: CubismModel): void {
    this._model = model;
  }

  /**
   * モデルを描画する
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public drawModel(): void {
    if (this.getModel() == null) return;

    this.saveProfile();

    this.doDrawModel();

    this.restoreProfile();
  }

  /**
   * Model-View-Projection 行列をセットする
   * 配列は複製されるので、元の配列は外で破棄して良い
   * @param matrix44 Model-View-Projection 行列
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public setMvpMatrix(matrix44: CubismMatrix44): void {
    this._mvpMatrix4x4.setMatrix(matrix44.getArray());
  }

  /**
   * Model-View-Projection 行列を取得する
   * @return Model-View-Projection 行列
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getMvpMatrix(): CubismMatrix44 {
    return this._mvpMatrix4x4;
  }

  /**
   * モデルの色をセットする
   * 各色0.0~1.0の間で指定する（1.0が標準の状態）
   * @param red 赤チャンネルの値
   * @param green 緑チャンネルの値
   * @param blue 青チャンネルの値
   * @param alpha αチャンネルの値
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public setModelColor(
    red: number,
    green: number,
    blue: number,
    alpha: number
  ): void {
    if (red < 0.0) {
      red = 0.0;
    } else if (red > 1.0) {
      red = 1.0;
    }

    if (green < 0.0) {
      green = 0.0;
    } else if (green > 1.0) {
      green = 1.0;
    }

    if (blue < 0.0) {
      blue = 0.0;
    } else if (blue > 1.0) {
      blue = 1.0;
    }

    if (alpha < 0.0) {
      alpha = 0.0;
    } else if (alpha > 1.0) {
      alpha = 1.0;
    }

    this._modelColor.r = red;
    this._modelColor.g = green;
    this._modelColor.b = blue;
    this._modelColor.a = alpha;
  }

  /**
   * モデルの色を取得する
   * 各色0.0~1.0の間で指定する(1.0が標準の状態)
   *
   * @return RGBAのカラー情報
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getModelColor(): CubismTextureColor {
    return JSON.parse(JSON.stringify(this._modelColor));
  }

  /**
   * 透明度を考慮したモデルの色を計算する。
   *
   * @param opacity 透明度
   *
   * @return RGBAのカラー情報
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  getModelColorWithOpacity(opacity: number): CubismTextureColor {
    const modelColorRGBA: CubismTextureColor = this.getModelColor();
    modelColorRGBA.a *= opacity;
    if (this.isPremultipliedAlpha()) {
      modelColorRGBA.r *= modelColorRGBA.a;
      modelColorRGBA.g *= modelColorRGBA.a;
      modelColorRGBA.b *= modelColorRGBA.a;
    }
    return modelColorRGBA;
  }

  /**
   * 乗算済みαの有効・無効をセットする
   * 有効にするならtrue、無効にするならfalseをセットする
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public setIsPremultipliedAlpha(enable: boolean): void {
    this._isPremultipliedAlpha = enable;
  }

  /**
   * 乗算済みαの有効・無効を取得する
   * @return true 乗算済みのα有効
   * @return false 乗算済みのα無効
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public isPremultipliedAlpha(): boolean {
    return this._isPremultipliedAlpha;
  }

  /**
   * カリング（片面描画）の有効・無効をセットする。
   * 有効にするならtrue、無効にするならfalseをセットする
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public setIsCulling(culling: boolean): void {
    this._isCulling = culling;
  }

  /**
   * カリング（片面描画）の有効・無効を取得する。
   * @return true カリング有効
   * @return false カリング無効
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public isCulling(): boolean {
    return this._isCulling;
  }

  /**
   * テクスチャの異方性フィルタリングのパラメータをセットする
   * パラメータ値の影響度はレンダラの実装に依存する
   * @param n パラメータの値
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public setAnisotropy(n: number): void {
    this._anisotropy = n;
  }

  /**
   * テクスチャの異方性フィルタリングのパラメータをセットする
   * @return 異方性フィルタリングのパラメータ
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getAnisotropy(): number {
    return this._anisotropy;
  }

  /**
   * レンダリングするモデルを取得する
   * @return レンダリングするモデル
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getModel(): CubismModel {
    return this._model;
  }

  /**
   * マスク描画の方式を変更する。
   * falseの場合、マスクを1枚のテクスチャに分割してレンダリングする（デフォルト）
   * 高速だが、マスク個数の上限が36に限定され、質も荒くなる
   * trueの場合、パーツ描画の前にその都度必要なマスクを描き直す
   * レンダリング品質は高いが描画処理負荷は増す
   * @param high 高精細マスクに切り替えるか？
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public useHighPrecisionMask(high: boolean): void {
    this._useHighPrecisionMask = high;
  }

  /**
   * マスクの描画方式を取得する
   * @return true 高精細方式
   * @return false デフォルト
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public isUsingHighPrecisionMask(): boolean {
    return this._useHighPrecisionMask;
  }

  /**
   * コンストラクタ
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected constructor() {
    this._isCulling = false;
    this._isPremultipliedAlpha = false;
    this._anisotropy = 0.0;
    this._model = null;
    this._modelColor = new CubismTextureColor();
    this._useHighPrecisionMask = false;

    // 単位行列に初期化
    this._mvpMatrix4x4 = new CubismMatrix44();
    this._mvpMatrix4x4.loadIdentity();
  }

  /**
   * モデル描画の実装
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public abstract doDrawModel(): void;

  /**
   * モデル描画直前のレンダラのステートを保持する
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected abstract saveProfile(): void;

  /**
   * モデル描画直前のレンダラのステートを復帰する
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected abstract restoreProfile(): void;

  /**
   * レンダラが保持する静的なリソースを開放する
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public static staticRelease: any;

  protected _mvpMatrix4x4: CubismMatrix44; // Model-View-Projection 行列
  protected _modelColor: CubismTextureColor; // モデル自体のカラー（RGBA）
  protected _isCulling: boolean; // カリングが有効ならtrue
  protected _isPremultipliedAlpha: boolean; // 乗算済みαならtrue
  protected _anisotropy: any; // テクスチャの異方性フィルタリングのパラメータ
  protected _model: CubismModel; // レンダリング対象のモデル
  protected _useHighPrecisionMask: boolean; // falseの場合、マスクを纏めて描画する trueの場合、マスクはパーツ描画ごとに書き直す
}

export enum CubismBlendMode {
  CubismBlendMode_Normal = 0, // 通常
  CubismBlendMode_Additive = 1, // 加算
  CubismBlendMode_Multiplicative = 2 // 乗算
}

/**
 * テクスチャの色をRGBAで扱うためのクラス
 */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
export class CubismTextureColor {
  /**
   * コンストラクタ
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  constructor(r = 1.0, g = 1.0, b = 1.0, a = 1.0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  r: number; // 赤チャンネル
  g: number; // 緑チャンネル
  b: number; // 青チャンネル
  a: number; // αチャンネル
}

/**
 * クリッピングマスクのコンテキスト
 */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
export abstract class CubismClippingContext {
  /**
   * 引数付きコンストラクタ
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public constructor(clippingDrawableIndices: Int32Array, clipCount: number) {
    // クリップしている（＝マスク用の）Drawableのインデックスリスト
    this._clippingIdList = clippingDrawableIndices;

    // マスクの数
    this._clippingIdCount = clipCount;

    this._allClippedDrawRect = new csmRect();
    this._layoutBounds = new csmRect();

    this._clippedDrawableIndexList = [];

    this._matrixForMask = new CubismMatrix44();
    this._matrixForDraw = new CubismMatrix44();

    this._bufferIndex = 0;
  }

  /**
   * このマスクを管理するマネージャのインスタンスを取得する
   * @return クリッピングマネージャのインスタンス
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public abstract getClippingManager(): ICubismClippingManager;

  /**
   * デストラクタ相当の処理
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public release(): void {
    if (this._layoutBounds != null) {
      this._layoutBounds = null;
    }

    if (this._allClippedDrawRect != null) {
      this._allClippedDrawRect = null;
    }

    if (this._clippedDrawableIndexList != null) {
      this._clippedDrawableIndexList = null;
    }
  }

  /**
   * このマスクにクリップされる描画オブジェクトを追加する
   *
   * @param drawableIndex クリッピング対象に追加する描画オブジェクトのインデックス
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public addClippedDrawable(drawableIndex: number) {
    this._clippedDrawableIndexList.push(drawableIndex);
  }

  public _isUsing: boolean; // 現在の描画状態でマスクの準備が必要ならtrue
  public readonly _clippingIdList: Int32Array; // クリッピングマスクのIDリスト
  public _clippingIdCount: number; // クリッピングマスクの数
  public _layoutChannelIndex: number; // RGBAのいずれのチャンネルにこのクリップを配置するか（0:R, 1:G, 2:B, 3:A）
  public _layoutBounds: csmRect; // マスク用チャンネルのどの領域にマスクを入れるか（View座標-1~1, UVは0~1に直す）
  public _allClippedDrawRect: csmRect; // このクリッピングで、クリッピングされるすべての描画オブジェクトの囲み矩形（毎回更新）
  public _matrixForMask: CubismMatrix44; // マスクの位置計算結果を保持する行列
  public _matrixForDraw: CubismMatrix44; // 描画オブジェクトの位置計算結果を保持する行列
  public _clippedDrawableIndexList: number[]; // このマスクにクリップされる描画オブジェクトのリスト
  public _bufferIndex: number; // このマスクが割り当てられるレンダーテクスチャ（フレームバッファ）やカラーバッファのインデックス
}

// Namespace definition for compatibility.
import * as $ from './cubismrenderer';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismBlendMode = $.CubismBlendMode;
  export type CubismBlendMode = $.CubismBlendMode;
  export const CubismRenderer = $.CubismRenderer;
  export type CubismRenderer = $.CubismRenderer;
  export const CubismTextureColor = $.CubismTextureColor;
  export type CubismTextureColor = $.CubismTextureColor;
}

