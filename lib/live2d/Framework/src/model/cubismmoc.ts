/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities

import { CSM_ASSERT, CubismLogError } from '../utils/cubismdebug';
import { CubismModel } from './cubismmodel';

/**
 * Mocデータの管理
 *
 * Mocデータの管理を行うクラス。
 */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
export class CubismMoc {
  /**
   * Mocデータの作成
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public static create(
    mocBytes: ArrayBuffer,
    shouldCheckMocConsistency: boolean
  ): CubismMoc {
    let cubismMoc: CubismMoc = null;

    if (shouldCheckMocConsistency) {
      // .moc3の整合性を確認
      const consistency = this.hasMocConsistency(mocBytes);

      if (!consistency) {
        // 整合性が確認できなければ処理しない
        CubismLogError(`Inconsistent MOC3.`);
        return cubismMoc;
      }
    }

    const moc: Live2DCubismCore.Moc =
      Live2DCubismCore.Moc.fromArrayBuffer(mocBytes);

    if (moc) {
      cubismMoc = new CubismMoc(moc);
      cubismMoc._mocVersion = Live2DCubismCore.Version.csmGetMocVersion(
        moc,
        mocBytes
      );
    }

    return cubismMoc;
  }

  /**
   * Mocデータを削除
   *
   * Mocデータを削除する
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public static delete(moc: CubismMoc): void {
    moc._moc._release();
    moc._moc = null;
    moc = null;
  }

  /**
   * モデルを作成する
   *
   * @return Mocデータから作成されたモデル
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  createModel(): CubismModel {
    let cubismModel: CubismModel = null;

    const model: Live2DCubismCore.Model = Live2DCubismCore.Model.fromMoc(
      this._moc
    );

    if (model) {
      cubismModel = new CubismModel(model);
      cubismModel.initialize();

      ++this._modelCount;
    }

    return cubismModel;
  }

  /**
   * モデルを削除する
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  deleteModel(model: CubismModel): void {
    if (model != null) {
      model.release();
      model = null;
      --this._modelCount;
    }
  }

  /**
   * コンストラクタ
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  private constructor(moc: Live2DCubismCore.Moc) {
    this._moc = moc;
    this._modelCount = 0;
    this._mocVersion = 0;
  }

  /**
   * デストラクタ相当の処理
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public release(): void {
    CSM_ASSERT(this._modelCount == 0);

    this._moc._release();
    this._moc = null;
  }

  /**
   * 最新の.moc3 Versionを取得
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getLatestMocVersion(): number {
    return Live2DCubismCore.Version.csmGetLatestMocVersion();
  }

  /**
   * 読み込んだモデルの.moc3 Versionを取得
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getMocVersion(): number {
    return this._mocVersion;
  }

  /**
   * .moc3 の整合性を検証する
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public static hasMocConsistency(mocBytes: ArrayBuffer): boolean {
    const isConsistent =
      Live2DCubismCore.Moc.prototype.hasMocConsistency(mocBytes);
    return isConsistent === 1 ? true : false;
  }

  _moc: Live2DCubismCore.Moc; // Mocデータ
  _modelCount: number; // Mocデータから作られたモデルの個数
  _mocVersion: number; // 読み込んだモデルの.moc3 Version
}

// Namespace definition for compatibility.
import * as $ from './cubismmoc';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismMoc = $.CubismMoc;
  export type CubismMoc = $.CubismMoc;
}

