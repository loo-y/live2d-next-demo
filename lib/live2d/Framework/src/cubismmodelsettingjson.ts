/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities

import { ICubismModelSetting } from './icubismmodelsetting';
import { CubismIdHandle } from './id/cubismid';
import { CubismFramework } from './live2dcubismframework';
import { csmMap, iterator } from './type/csmmap';
import { csmVector } from './type/csmvector';
import { CubismJson, Value } from './utils/cubismjson';

export enum FrequestNode {
  FrequestNode_Groups, // getRoot().getValueByString(Groups)
  FrequestNode_Moc, // getRoot().getValueByString(FileReferences).getValueByString(Moc)
  FrequestNode_Motions, // getRoot().getValueByString(FileReferences).getValueByString(Motions)
  FrequestNode_Expressions, // getRoot().getValueByString(FileReferences).getValueByString(Expressions)
  FrequestNode_Textures, // getRoot().getValueByString(FileReferences).getValueByString(Textures)
  FrequestNode_Physics, // getRoot().getValueByString(FileReferences).getValueByString(Physics)
  FrequestNode_Pose, // getRoot().getValueByString(FileReferences).getValueByString(Pose)
  FrequestNode_HitAreas // getRoot().getValueByString(HitAreas)
}

/**
 * Model3Jsonパーサー
 *
 * model3.jsonファイルをパースして値を取得する
 */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
export class CubismModelSettingJson extends ICubismModelSetting {
  /**
   * 引数付きコンストラクタ
   *
   * @param buffer    Model3Jsonをバイト配列として読み込んだデータバッファ
   * @param size      Model3Jsonのデータサイズ
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public constructor(buffer: ArrayBuffer, size: number) {
    super();
    this._json = CubismJson.create(buffer, size);

    if (this.getJson()) {
      this._jsonValue = new csmVector<Value>();

      // 順番はenum FrequestNodeと一致させる
      this._jsonValue.pushBack(
        this.getJson().getRoot().getValueByString(this.groups)
      );
      this._jsonValue.pushBack(
        this.getJson()
          .getRoot()
          .getValueByString(this.fileReferences)
          .getValueByString(this.moc)
      );
      this._jsonValue.pushBack(
        this.getJson()
          .getRoot()
          .getValueByString(this.fileReferences)
          .getValueByString(this.motions)
      );
      this._jsonValue.pushBack(
        this.getJson()
          .getRoot()
          .getValueByString(this.fileReferences)
          .getValueByString(this.expressions)
      );
      this._jsonValue.pushBack(
        this.getJson()
          .getRoot()
          .getValueByString(this.fileReferences)
          .getValueByString(this.textures)
      );
      this._jsonValue.pushBack(
        this.getJson()
          .getRoot()
          .getValueByString(this.fileReferences)
          .getValueByString(this.physics)
      );
      this._jsonValue.pushBack(
        this.getJson()
          .getRoot()
          .getValueByString(this.fileReferences)
          .getValueByString(this.pose)
      );
      this._jsonValue.pushBack(
        this.getJson().getRoot().getValueByString(this.hitAreas)
      );
    }
  }

  /**
   * デストラクタ相当の処理
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public release(): void {
    CubismJson.delete(this._json);

    this._jsonValue = null;
  }

  /**
   * CubismJsonオブジェクトを取得する
   *
   * @return CubismJson
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getJson(): CubismJson {
    return this._json;
  }

  /**
   * Mocファイルの名前を取得する
   * @return Mocファイルの名前
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getModelFileName(): string {
    if (!this.isExistModelFile()) {
      return '';
    }
    return this._jsonValue.at(FrequestNode.FrequestNode_Moc).getRawString();
  }

  /**
   * モデルが使用するテクスチャの数を取得する
   * テクスチャの数
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getTextureCount(): number {
    if (!this.isExistTextureFiles()) {
      return 0;
    }

    return this._jsonValue.at(FrequestNode.FrequestNode_Textures).getSize();
  }

  /**
   * テクスチャが配置されたディレクトリの名前を取得する
   * @return テクスチャが配置されたディレクトリの名前
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getTextureDirectory(): string {
    const texturePath = this._jsonValue
      .at(FrequestNode.FrequestNode_Textures)
      .getValueByIndex(0)
      .getRawString();

    const pathArray = texturePath.split('/');
    // 最後の要素はテクスチャ名なので不要
    const arrayLength = pathArray.length - 1;
    let textureDirectoryStr = '';

    // 分割したパスを結合
    for (let i = 0; i < arrayLength; i++) {
      textureDirectoryStr += pathArray[i];
      if (i < arrayLength - 1) {
        textureDirectoryStr += '/';
      }
    }

    return textureDirectoryStr;
  }

  /**
   * モデルが使用するテクスチャの名前を取得する
   * @param index 配列のインデックス値
   * @return テクスチャの名前
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getTextureFileName(index: number): string {
    return this._jsonValue
      .at(FrequestNode.FrequestNode_Textures)
      .getValueByIndex(index)
      .getRawString();
  }

  /**
   * モデルに設定された当たり判定の数を取得する
   * @return モデルに設定された当たり判定の数
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getHitAreasCount(): number {
    if (!this.isExistHitAreas()) {
      return 0;
    }

    return this._jsonValue.at(FrequestNode.FrequestNode_HitAreas).getSize();
  }

  /**
   * 当たり判定に設定されたIDを取得する
   *
   * @param index 配列のindex
   * @return 当たり判定に設定されたID
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getHitAreaId(index: number): CubismIdHandle {
    return CubismFramework.getIdManager().getId(
      this._jsonValue
        .at(FrequestNode.FrequestNode_HitAreas)
        .getValueByIndex(index)
        .getValueByString(this.id)
        .getRawString()
    );
  }

  /**
   * 当たり判定に設定された名前を取得する
   * @param index 配列のインデックス値
   * @return 当たり判定に設定された名前
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getHitAreaName(index: number): string {
    return this._jsonValue
      .at(FrequestNode.FrequestNode_HitAreas)
      .getValueByIndex(index)
      .getValueByString(this.name)
      .getRawString();
  }

  /**
   * 物理演算設定ファイルの名前を取得する
   * @return 物理演算設定ファイルの名前
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getPhysicsFileName(): string {
    if (!this.isExistPhysicsFile()) {
      return '';
    }

    return this._jsonValue.at(FrequestNode.FrequestNode_Physics).getRawString();
  }

  /**
   * パーツ切り替え設定ファイルの名前を取得する
   * @return パーツ切り替え設定ファイルの名前
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getPoseFileName(): string {
    if (!this.isExistPoseFile()) {
      return '';
    }

    return this._jsonValue.at(FrequestNode.FrequestNode_Pose).getRawString();
  }

  /**
   * 表情設定ファイルの数を取得する
   * @return 表情設定ファイルの数
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getExpressionCount(): number {
    if (!this.isExistExpressionFile()) {
      return 0;
    }

    return this._jsonValue.at(FrequestNode.FrequestNode_Expressions).getSize();
  }

  /**
   * 表情設定ファイルを識別する名前（別名）を取得する
   * @param index 配列のインデックス値
   * @return 表情の名前
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getExpressionName(index: number): string {
    return this._jsonValue
      .at(FrequestNode.FrequestNode_Expressions)
      .getValueByIndex(index)
      .getValueByString(this.name)
      .getRawString();
  }

  /**
   * 表情設定ファイルの名前を取得する
   * @param index 配列のインデックス値
   * @return 表情設定ファイルの名前
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getExpressionFileName(index: number): string {
    return this._jsonValue
      .at(FrequestNode.FrequestNode_Expressions)
      .getValueByIndex(index)
      .getValueByString(this.filePath)
      .getRawString();
  }

  /**
   * モーショングループの数を取得する
   * @return モーショングループの数
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getMotionGroupCount(): number {
    if (!this.isExistMotionGroups()) {
      return 0;
    }

    return this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getKeys()
      .getSize();
  }

  /**
   * モーショングループの名前を取得する
   * @param index 配列のインデックス値
   * @return モーショングループの名前
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getMotionGroupName(index: number): string {
    if (!this.isExistMotionGroups()) {
      return null;
    }

    return this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getKeys()
      .at(index);
  }

  /**
   * モーショングループに含まれるモーションの数を取得する
   * @param groupName モーショングループの名前
   * @return モーショングループの数
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getMotionCount(groupName: string): number {
    if (!this.isExistMotionGroupName(groupName)) {
      return 0;
    }

    return this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getSize();
  }

  /**
   * グループ名とインデックス値からモーションファイル名を取得する
   * @param groupName モーショングループの名前
   * @param index     配列のインデックス値
   * @return モーションファイルの名前
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getMotionFileName(groupName: string, index: number): string {
    if (!this.isExistMotionGroupName(groupName)) {
      return '';
    }

    return this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getValueByIndex(index)
      .getValueByString(this.filePath)
      .getRawString();
  }

  /**
   * モーションに対応するサウンドファイルの名前を取得する
   * @param groupName モーショングループの名前
   * @param index 配列のインデックス値
   * @return サウンドファイルの名前
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getMotionSoundFileName(groupName: string, index: number): string {
    if (!this.isExistMotionSoundFile(groupName, index)) {
      return '';
    }

    return this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getValueByIndex(index)
      .getValueByString(this.soundPath)
      .getRawString();
  }

  /**
   * モーション開始時のフェードイン処理時間を取得する
   * @param groupName モーショングループの名前
   * @param index 配列のインデックス値
   * @return フェードイン処理時間[秒]
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getMotionFadeInTimeValue(groupName: string, index: number): number {
    if (!this.isExistMotionFadeIn(groupName, index)) {
      return -1.0;
    }

    return this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getValueByIndex(index)
      .getValueByString(this.fadeInTime)
      .toFloat();
  }

  /**
   * モーション終了時のフェードアウト処理時間を取得する
   * @param groupName モーショングループの名前
   * @param index 配列のインデックス値
   * @return フェードアウト処理時間[秒]
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getMotionFadeOutTimeValue(groupName: string, index: number): number {
    if (!this.isExistMotionFadeOut(groupName, index)) {
      return -1.0;
    }

    return this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getValueByIndex(index)
      .getValueByString(this.fadeOutTime)
      .toFloat();
  }

  /**
   * ユーザーデータのファイル名を取得する
   * @return ユーザーデータのファイル名
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getUserDataFile(): string {
    if (!this.isExistUserDataFile()) {
      return '';
    }

    return this.getJson()
      .getRoot()
      .getValueByString(this.fileReferences)
      .getValueByString(this.userData)
      .getRawString();
  }

  /**
   * レイアウト情報を取得する
   * @param outLayoutMap csmMapクラスのインスタンス
   * @return true レイアウト情報が存在する
   * @return false レイアウト情報が存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getLayoutMap(outLayoutMap: csmMap<string, number>): boolean {
    // 存在しない要素にアクセスするとエラーになるためValueがnullの場合はnullを代入する
    const map: csmMap<string, Value> = this.getJson()
      .getRoot()
      .getValueByString(this.layout)
      .getMap();

    if (map == null) {
      return false;
    }

    let ret = false;

    for (
      const ite: iterator<string, Value> = map.begin();
      ite.notEqual(map.end());
      ite.preIncrement()
    ) {
      outLayoutMap.setValue(ite.ptr().first, ite.ptr().second.toFloat());
      ret = true;
    }

    return ret;
  }

  /**
   * 目パチに関連付けられたパラメータの数を取得する
   * @return 目パチに関連付けられたパラメータの数
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getEyeBlinkParameterCount(): number {
    if (!this.isExistEyeBlinkParameters()) {
      return 0;
    }

    let num = 0;
    for (
      let i = 0;
      i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize();
      i++
    ) {
      const refI: Value = this._jsonValue
        .at(FrequestNode.FrequestNode_Groups)
        .getValueByIndex(i);
      if (refI.isNull() || refI.isError()) {
        continue;
      }

      if (refI.getValueByString(this.name).getRawString() == this.eyeBlink) {
        num = refI.getValueByString(this.ids).getVector().getSize();
        break;
      }
    }

    return num;
  }

  /**
   * 目パチに関連付けられたパラメータのIDを取得する
   * @param index 配列のインデックス値
   * @return パラメータID
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getEyeBlinkParameterId(index: number): CubismIdHandle {
    if (!this.isExistEyeBlinkParameters()) {
      return null;
    }

    for (
      let i = 0;
      i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize();
      i++
    ) {
      const refI: Value = this._jsonValue
        .at(FrequestNode.FrequestNode_Groups)
        .getValueByIndex(i);
      if (refI.isNull() || refI.isError()) {
        continue;
      }

      if (refI.getValueByString(this.name).getRawString() == this.eyeBlink) {
        return CubismFramework.getIdManager().getId(
          refI.getValueByString(this.ids).getValueByIndex(index).getRawString()
        );
      }
    }
    return null;
  }

  /**
   * リップシンクに関連付けられたパラメータの数を取得する
   * @return リップシンクに関連付けられたパラメータの数
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getLipSyncParameterCount(): number {
    if (!this.isExistLipSyncParameters()) {
      return 0;
    }

    let num = 0;
    for (
      let i = 0;
      i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize();
      i++
    ) {
      const refI: Value = this._jsonValue
        .at(FrequestNode.FrequestNode_Groups)
        .getValueByIndex(i);
      if (refI.isNull() || refI.isError()) {
        continue;
      }

      if (refI.getValueByString(this.name).getRawString() == this.lipSync) {
        num = refI.getValueByString(this.ids).getVector().getSize();
        break;
      }
    }

    return num;
  }

  /**
   * リップシンクに関連付けられたパラメータの数を取得する
   * @param index 配列のインデックス値
   * @return パラメータID
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  public getLipSyncParameterId(index: number): CubismIdHandle {
    if (!this.isExistLipSyncParameters()) {
      return null;
    }

    for (
      let i = 0;
      i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize();
      i++
    ) {
      const refI: Value = this._jsonValue
        .at(FrequestNode.FrequestNode_Groups)
        .getValueByIndex(i);
      if (refI.isNull() || refI.isError()) {
        continue;
      }

      if (refI.getValueByString(this.name).getRawString() == this.lipSync) {
        return CubismFramework.getIdManager().getId(
          refI.getValueByString(this.ids).getValueByIndex(index).getRawString()
        );
      }
    }
    return null;
  }

  /**
   * モデルファイルのキーが存在するかどうかを確認する
   * @return true キーが存在する
   * @return false キーが存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected isExistModelFile(): boolean {
    const node: Value = this._jsonValue.at(FrequestNode.FrequestNode_Moc);
    return !node.isNull() && !node.isError();
  }

  /**
   * テクスチャファイルのキーが存在するかどうかを確認する
   * @return true キーが存在する
   * @return false キーが存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected isExistTextureFiles(): boolean {
    const node: Value = this._jsonValue.at(FrequestNode.FrequestNode_Textures);
    return !node.isNull() && !node.isError();
  }

  /**
   * 当たり判定のキーが存在するかどうかを確認する
   * @return true キーが存在する
   * @return false キーが存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected isExistHitAreas(): boolean {
    const node: Value = this._jsonValue.at(FrequestNode.FrequestNode_HitAreas);
    return !node.isNull() && !node.isError();
  }

  /**
   * 物理演算ファイルのキーが存在するかどうかを確認する
   * @return true キーが存在する
   * @return false キーが存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected isExistPhysicsFile(): boolean {
    const node: Value = this._jsonValue.at(FrequestNode.FrequestNode_Physics);
    return !node.isNull() && !node.isError();
  }

  /**
   * ポーズ設定ファイルのキーが存在するかどうかを確認する
   * @return true キーが存在する
   * @return false キーが存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected isExistPoseFile(): boolean {
    const node: Value = this._jsonValue.at(FrequestNode.FrequestNode_Pose);
    return !node.isNull() && !node.isError();
  }

  /**
   * 表情設定ファイルのキーが存在するかどうかを確認する
   * @return true キーが存在する
   * @return false キーが存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected isExistExpressionFile(): boolean {
    const node: Value = this._jsonValue.at(
      FrequestNode.FrequestNode_Expressions
    );
    return !node.isNull() && !node.isError();
  }

  /**
   * モーショングループのキーが存在するかどうかを確認する
   * @return true キーが存在する
   * @return false キーが存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected isExistMotionGroups(): boolean {
    const node: Value = this._jsonValue.at(FrequestNode.FrequestNode_Motions);
    return !node.isNull() && !node.isError();
  }

  /**
   * 引数で指定したモーショングループのキーが存在するかどうかを確認する
   * @param groupName  グループ名
   * @return true キーが存在する
   * @return false キーが存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected isExistMotionGroupName(groupName: string): boolean {
    const node: Value = this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName);
    return !node.isNull() && !node.isError();
  }

  /**
   * 引数で指定したモーションに対応するサウンドファイルのキーが存在するかどうかを確認する
   * @param groupName  グループ名
   * @param index 配列のインデックス値
   * @return true キーが存在する
   * @return false キーが存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected isExistMotionSoundFile(groupName: string, index: number): boolean {
    const node: Value = this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getValueByIndex(index)
      .getValueByString(this.soundPath);
    return !node.isNull() && !node.isError();
  }

  /**
   * 引数で指定したモーションに対応するフェードイン時間のキーが存在するかどうかを確認する
   * @param groupName  グループ名
   * @param index 配列のインデックス値
   * @return true キーが存在する
   * @return false キーが存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected isExistMotionFadeIn(groupName: string, index: number): boolean {
    const node: Value = this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getValueByIndex(index)
      .getValueByString(this.fadeInTime);
    return !node.isNull() && !node.isError();
  }

  /**
   * 引数で指定したモーションに対応するフェードアウト時間のキーが存在するかどうかを確認する
   * @param groupName  グループ名
   * @param index 配列のインデックス値
   * @return true キーが存在する
   * @return false キーが存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected isExistMotionFadeOut(groupName: string, index: number): boolean {
    const node: Value = this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getValueByIndex(index)
      .getValueByString(this.fadeOutTime);
    return !node.isNull() && !node.isError();
  }

  /**
   * UserDataのファイル名が存在するかどうかを確認する
   * @return true キーが存在する
   * @return false キーが存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected isExistUserDataFile(): boolean {
    const node: Value = this.getJson()
      .getRoot()
      .getValueByString(this.fileReferences)
      .getValueByString(this.userData);
    return !node.isNull() && !node.isError();
  }

  /**
   * 目ぱちに対応付けられたパラメータが存在するかどうかを確認する
   * @return true キーが存在する
   * @return false キーが存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected isExistEyeBlinkParameters(): boolean {
    if (
      this._jsonValue.at(FrequestNode.FrequestNode_Groups).isNull() ||
      this._jsonValue.at(FrequestNode.FrequestNode_Groups).isError()
    ) {
      return false;
    }

    for (
      let i = 0;
      i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize();
      ++i
    ) {
      if (
        this._jsonValue
          .at(FrequestNode.FrequestNode_Groups)
          .getValueByIndex(i)
          .getValueByString(this.name)
          .getRawString() == this.eyeBlink
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * リップシンクに対応付けられたパラメータが存在するかどうかを確認する
   * @return true キーが存在する
   * @return false キーが存在しない
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected isExistLipSyncParameters(): boolean {
    if (
      this._jsonValue.at(FrequestNode.FrequestNode_Groups).isNull() ||
      this._jsonValue.at(FrequestNode.FrequestNode_Groups).isError()
    ) {
      return false;
    }
    for (
      let i = 0;
      i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize();
      ++i
    ) {
      if (
        this._jsonValue
          .at(FrequestNode.FrequestNode_Groups)
          .getValueByIndex(i)
          .getValueByString(this.name)
          .getRawString() == this.lipSync
      ) {
        return true;
      }
    }
    return false;
  }

  protected _json: CubismJson;
  protected _jsonValue: csmVector<Value>;

  /**
   * Model3Jsonのキー文字列
   */

// @ts-nocheck
// Disable TypeScript checking for this Live2D framework file due to strict null check incompatibilities
  protected readonly version = 'Version';
  protected readonly fileReferences = 'FileReferences';

  protected readonly groups = 'Groups';
  protected readonly layout = 'Layout';
  protected readonly hitAreas = 'HitAreas';

  protected readonly moc = 'Moc';
  protected readonly textures = 'Textures';
  protected readonly physics = 'Physics';
  protected readonly pose = 'Pose';
  protected readonly expressions = 'Expressions';
  protected readonly motions = 'Motions';

  protected readonly userData = 'UserData';
  protected readonly name = 'Name';
  protected readonly filePath = 'File';
  protected readonly id = 'Id';
  protected readonly ids = 'Ids';
  protected readonly target = 'Target';

  // Motions
  protected readonly idle = 'Idle';
  protected readonly tapBody = 'TapBody';
  protected readonly pinchIn = 'PinchIn';
  protected readonly pinchOut = 'PinchOut';
  protected readonly shake = 'Shake';
  protected readonly flickHead = 'FlickHead';
  protected readonly parameter = 'Parameter';

  protected readonly soundPath = 'Sound';
  protected readonly fadeInTime = 'FadeInTime';
  protected readonly fadeOutTime = 'FadeOutTime';

  // Layout
  protected readonly centerX = 'CenterX';
  protected readonly centerY = 'CenterY';
  protected readonly x = 'X';
  protected readonly y = 'Y';
  protected readonly width = 'Width';
  protected readonly height = 'Height';

  protected readonly lipSync = 'LipSync';
  protected readonly eyeBlink = 'EyeBlink';

  protected readonly initParameter = 'init_param';
  protected readonly initPartsVisible = 'init_parts_visible';
  protected readonly val = 'val';
}

// Namespace definition for compatibility.
import * as $ from './cubismmodelsettingjson';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismModelSettingJson = $.CubismModelSettingJson;
  export type CubismModelSettingJson = $.CubismModelSettingJson;
  export const FrequestNode = $.FrequestNode;
  export type FrequestNode = $.FrequestNode;
}

