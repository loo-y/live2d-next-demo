/**
 * 真正的Live2D模型管理器
 * 基于Live2D Framework实现
 */

import { CubismUserModel } from '@framework/model/cubismusermodel';
import { CubismModelSettingJson } from '@framework/cubismmodelsettingjson';
import { ICubismModelSetting } from '@framework/icubismmodelsetting';
import { CubismMotionManager } from '@framework/motion/cubismmotionmanager';
import { CubismExpressionMotionManager } from '@framework/motion/cubismexpressionmotionmanager';
import { CubismEyeBlink } from '@framework/effect/cubismeyeblink';
import { CubismBreath, BreathParameterData } from '@framework/effect/cubismbreath';
import { CubismDefaultParameterId } from '@framework/cubismdefaultparameterid';
import { CubismFramework } from '@framework/live2dcubismframework';
import { CubismMatrix44 } from '@framework/math/cubismmatrix44';
import { ACubismMotion } from '@framework/motion/acubismmotion';
import { CubismMotion } from '@framework/motion/cubismmotion';
import { csmVector } from '@framework/type/csmvector';
import { csmMap } from '@framework/type/csmmap';
import { CubismIdHandle } from '@framework/id/cubismid';
import { CubismMotionQueueEntryHandle, InvalidMotionQueueEntryHandleValue } from '@framework/motion/cubismmotionqueuemanager';

import { Platform } from './platform';
import { PRIORITY, MotionGroup } from './config';

enum LoadStep {
    LoadAssets,
    LoadModel,
    WaitLoadModel,
    LoadExpression,
    WaitLoadExpression,
    LoadPhysics,
    WaitLoadPhysics,
    LoadPose,
    WaitLoadPose,
    SetupEyeBlink,
    SetupBreath,
    LoadUserData,
    WaitLoadUserData,
    SetupEyeBlinkIds,
    SetupLipSyncIds,
    SetupLayout,
    LoadMotion,
    WaitLoadMotion,
    LoadTexture,
    WaitLoadTexture,
    CompleteSetup
}

export class Live2DModel extends CubismUserModel {
    private _modelSetting: ICubismModelSetting | null = null;
    private _modelHomeDir: string | null = null;
    private _userTimeSeconds: number = 0.0;
    private _state: LoadStep = LoadStep.LoadAssets;

    // 动作和表情管理
    protected _motionManager: CubismMotionManager = new CubismMotionManager();
    protected _expressionManager: CubismExpressionMotionManager = new CubismExpressionMotionManager();
    private _motions: csmMap<string, ACubismMotion> = new csmMap<string, ACubismMotion>();
    private _expressions: csmMap<string, ACubismMotion> = new csmMap<string, ACubismMotion>();

    // 自动效果
    protected _eyeBlink: CubismEyeBlink = CubismEyeBlink.create();
    protected _breath: CubismBreath = new CubismBreath();

    // 参数ID
    private _eyeBlinkIds: csmVector<CubismIdHandle> = new csmVector<CubismIdHandle>();
    private _lipSyncIds: csmVector<CubismIdHandle> = new csmVector<CubismIdHandle>();

    // 参数ID句柄
    private _idParamAngleX: CubismIdHandle;
    private _idParamAngleY: CubismIdHandle;
    private _idParamAngleZ: CubismIdHandle;
    private _idParamEyeBallX: CubismIdHandle;
    private _idParamEyeBallY: CubismIdHandle;
    private _idParamBodyAngleX: CubismIdHandle;

    // 加载计数
    private _expressionCount: number = 0;
    private _textureCount: number = 0;
    private _motionCount: number = 0;
    private _allMotionCount: number = 0;

    // 回调函数
    private _onModelLoaded?: () => void;
    private _onLoadError?: (error: string) => void;

    // WebGL上下文
    private _gl: WebGLRenderingContext | null = null;

    constructor() {
        super();

        // 初始化参数ID
        this._idParamAngleX = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleX);
        this._idParamAngleY = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleY);
        this._idParamAngleZ = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleZ);
        this._idParamEyeBallX = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamEyeBallX);
        this._idParamEyeBallY = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamEyeBallY);
        this._idParamBodyAngleX = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBodyAngleX);
    }

    /**
     * 加载模型资源
     */
    public async loadModelAssets(modelDir: string, modelFileName: string): Promise<void> {
        this._modelHomeDir = modelDir;
        this._state = LoadStep.LoadAssets;

        try {
            Platform.log(`Starting to load model: ${modelDir}${modelFileName}`);
            Platform.log(`Model home directory set to: ${this._modelHomeDir}`);

            // 加载model3.json
            Platform.log(`Loading model configuration file...`);
            const settingBuffer = await Platform.loadFileAsBytes(`${modelDir}${modelFileName}`);
            Platform.log(`Model configuration loaded successfully, parsing...`);
            
            const setting = new CubismModelSettingJson(settingBuffer, settingBuffer.byteLength);
            Platform.log(`Model configuration parsed successfully`);

            this._modelSetting = setting;
            this._state = LoadStep.LoadModel;

            Platform.log(`Setting up model assets...`);
            await this.setupModel(setting);
            Platform.log(`Model setup completed successfully`);
        } catch (error) {
            const errorMsg = `Failed to load model ${modelDir}${modelFileName}: ${error}`;
            Platform.error(errorMsg);
            this._onLoadError?.(error instanceof Error ? error.message : 'Unknown error');
        }
    }

    /**
     * 设置模型加载回调
     */
    public setCallbacks(onLoaded?: () => void, onError?: (error: string) => void): void {
        this._onModelLoaded = onLoaded;
        this._onLoadError = onError;
    }

    /**
     * 设置WebGL上下文
     */
    public setWebGLContext(gl: WebGLRenderingContext): void {
        this._gl = gl;
    }

    /**
     * 播放动作
     */
    public playMotion(group: MotionGroup, index: number = 0): CubismMotionQueueEntryHandle {
        if (!this._modelSetting || this._state !== LoadStep.CompleteSetup) {
            Platform.error('Model not ready for motion playback');
            return InvalidMotionQueueEntryHandleValue;
        }

        if (PRIORITY.FORCE == PRIORITY.FORCE) {
            this._motionManager.setReservePriority(PRIORITY.FORCE);
        } else if (!this._motionManager.reserveMotion(PRIORITY.NORMAL)) {
            Platform.error("Can't start motion.");
            return InvalidMotionQueueEntryHandleValue;
        }

        const motionFileName = this._modelSetting.getMotionFileName(group, index);
        if (!motionFileName) {
            Platform.error(`Motion not found: ${group}[${index}]`);
            return InvalidMotionQueueEntryHandleValue;
        }

        const name = `${group}_${index}`;
        let motion = this._motions.getValue(name) as CubismMotion;
        let autoDelete = false;

        if (motion == null) {
            // 动作未加载，需要先加载
            Platform.error(`Motion not loaded: ${name}`);
            return InvalidMotionQueueEntryHandleValue;
        } else {
            Platform.log(`Playing motion: ${name}`);
            return this._motionManager.startMotionPriority(motion, autoDelete, PRIORITY.NORMAL);
        }
    }

    /**
     * 播放随机动作
     */
    public playRandomMotion(group: MotionGroup): CubismMotionQueueEntryHandle {
        if (!this._modelSetting) {
            return InvalidMotionQueueEntryHandleValue;
        }

        const count = this._modelSetting.getMotionCount(group);
        if (count === 0) {
            return InvalidMotionQueueEntryHandleValue;
        }

        const index = Math.floor(Math.random() * count);
        return this.playMotion(group, index);
    }

    /**
     * 设置表情
     */
    public setExpression(expressionName: string): void {
        if (!this._expressions) {
            Platform.error('Expressions not loaded');
            return;
        }

        const motion = this._expressions.getValue(expressionName);
        if (motion) {
            this._expressionManager.startMotion(motion, false);
            Platform.log(`Set expression: ${expressionName}`);
        } else {
            Platform.error(`Expression not found: ${expressionName}`);
        }
    }

    /**
     * 设置随机表情
     */
    public setRandomExpression(): void {
        if (this._expressions.getSize() === 0) return;

        const index = Math.floor(Math.random() * this._expressions.getSize());
        const expressionName = this._expressions._keyValues[index].first;
        this.setExpression(expressionName);
    }

    /**
     * 获取可用的表情列表
     */
    public getAvailableExpressions(): string[] {
        const expressions: string[] = [];
        for (let i = 0; i < this._expressions.getSize(); i++) {
            expressions.push(this._expressions._keyValues[i].first);
        }
        return expressions;
    }

    /**
     * 获取可用的动作数量
     */
    public getAvailableMotions(): Record<string, number> {
        if (!this._modelSetting) return {};

        const motions: Record<string, number> = {};
        
        // 动态获取所有动作分组
        const motionGroupCount = this._modelSetting.getMotionGroupCount();
        for (let i = 0; i < motionGroupCount; i++) {
            const groupName = this._modelSetting.getMotionGroupName(i);
            if (groupName && groupName !== '') {
                const count = this._modelSetting.getMotionCount(groupName);
                if (count > 0) {
                    motions[groupName] = count;
                }
            }
        }
        
        return motions;
    }

    /**
     * 更新模型
     */
    public update(): void {
        if (this._state !== LoadStep.CompleteSetup || 
            !this._model || 
            !this._initialized || 
            this._updating) {
            return;
        }

        try {
            const deltaTimeSeconds = Platform.getDeltaTime();
            this._userTimeSeconds += deltaTimeSeconds;

            // 更新动作
            this._model.loadParameters();

            // 安全地更新动作管理器
            if (this._motionManager) {
                if (this._motionManager.isFinished()) {
                    // 只在有可用动作时播放待机动作
                    if (this._modelSetting && this._modelSetting.getMotionCount('Idle') > 0) {
                        this.playRandomMotion('Idle');
                    }
                } else {
                    this._motionManager.updateMotion(this._model, deltaTimeSeconds);
                }
            }

            this._model.saveParameters();

            // 安全地更新表情
            if (this._expressionManager && this._expressions.getSize() > 0) {
                this._expressionManager.updateMotion(this._model, deltaTimeSeconds);
            }

            // 安全地更新眨眼
            this._eyeBlink.updateParameters(this._model, deltaTimeSeconds);

            // 安全地更新呼吸
            this._breath.updateParameters(this._model, deltaTimeSeconds);

            // 安全地更新物理
            if (this._physics) {
                this._physics.evaluate(this._model, deltaTimeSeconds);
            }

            this._model.update();
        } catch (error) {
            // 静默处理更新错误，避免日志刷屏
        }
    }

    /**
     * 渲染模型
     */
    public draw(matrix: CubismMatrix44): void {
        // 更严格的检查
        if (this._state !== LoadStep.CompleteSetup || 
            !this._model || 
            !this._initialized || 
            this._updating) {
            Platform.log(`Draw skipped - state: ${this._state}, model: ${!!this._model}, initialized: ${this._initialized}, updating: ${this._updating}`);
            return;
        }

        try {
            // 确保渲染器存在并已初始化
            const renderer = this.getRenderer();
            if (!renderer) {
                Platform.error('No renderer available for drawing');
                return;
            }

            // 确保模型矩阵存在
            if (!this._modelMatrix) {
                Platform.error('No model matrix available for drawing');
                return;
            }

            // 创建矩阵副本以避免修改原始矩阵
            const drawMatrix = new CubismMatrix44();
            drawMatrix.setMatrix(matrix.getArray());
            drawMatrix.multiplyByMatrix(this._modelMatrix);
            
            Platform.log(`Drawing model with matrix - width: ${this._modelMatrix.getArray()[0]}, height: ${this._modelMatrix.getArray()[5]}`);
            
            // 检查纹理状态
            Platform.log(`Texture count: ${this._textureCount}`);
            const renderer_cast = renderer as any;
            if (renderer_cast._textures) {
                Platform.log(`Renderer texture array length: ${renderer_cast._textures.length}`);
            }
            
            renderer.setMvpMatrix(drawMatrix);
            
            // 获取 WebGL 上下文来检查状态
            const gl = this._gl;
            if (gl) {
                Platform.log(`WebGL viewport: ${gl.getParameter(gl.VIEWPORT)}`);
                Platform.log(`WebGL scissor test: ${gl.getParameter(gl.SCISSOR_TEST)}`);
                Platform.log(`WebGL depth test: ${gl.getParameter(gl.DEPTH_TEST)}`);
                Platform.log(`WebGL blend: ${gl.getParameter(gl.BLEND)}`);
            }
            
            renderer.drawModel();
            Platform.log('Model draw command completed');
        } catch (error) {
            // 临时启用错误日志来调试
            Platform.error(`Draw error: ${error}`);
            console.error('Draw error details:', error);
        }
    }

    /**
     * 检查是否加载完成
     */
    public isLoaded(): boolean {
        return this._state === LoadStep.CompleteSetup;
    }

    // 私有方法：设置模型
    private async setupModel(setting: ICubismModelSetting): Promise<void> {
        this._updating = true;
        this._initialized = false;

        // 加载模型文件
        if (setting.getModelFileName() != '') {
            const modelFileName = setting.getModelFileName();
            Platform.log(`Loading model file: ${modelFileName}`);

            try {
                const modelBuffer = await Platform.loadFileAsBytes(`${this._modelHomeDir}${modelFileName}`);
                Platform.log(`Model file loaded, size: ${modelBuffer.byteLength} bytes`);

                super.loadModel(modelBuffer, false);
                Platform.log('CubismUserModel.loadModel() completed');

                this._state = LoadStep.LoadExpression;

                await this.loadExpressions();
            } catch (error) {
                Platform.error(`Failed to load model file: ${error}`);
                this._onLoadError?.(error instanceof Error ? error.message : 'Model file load failed');
                return;
            }
        } else {
            Platform.error('Model data does not exist.');
            this._onLoadError?.('Model data does not exist.');
            return;
        }
    }

    // 加载表情
    private async loadExpressions(): Promise<void> {
        if (this._modelSetting!.getExpressionCount() > 0) {
            const count = this._modelSetting!.getExpressionCount();
            Platform.log(`Loading ${count} expressions...`);

            for (let i = 0; i < count; i++) {
                const expressionName = this._modelSetting!.getExpressionName(i);
                const expressionFileName = this._modelSetting!.getExpressionFileName(i);

                try {
                    const fullPath = `${this._modelHomeDir}${expressionFileName}`;
                    Platform.log(`Loading expression: ${expressionName} from ${fullPath}`);
                    const expressionBuffer = await Platform.loadFileAsBytes(fullPath);
                    const motion = this.loadExpression(expressionBuffer, expressionBuffer.byteLength, expressionName);

                    if (motion) {
                        // 如果已存在同名表情，先删除旧的
                        if (this._expressions.getValue(expressionName) != null) {
                            ACubismMotion.delete(this._expressions.getValue(expressionName));
                        }

                        this._expressions.setValue(expressionName, motion);
                        this._expressionCount++;
                        Platform.log(`Successfully loaded expression: ${expressionName}`);
                    } else {
                        Platform.error(`Failed to create expression motion: ${expressionName}`);
                    }
                } catch (error) {
                    Platform.error(`Failed to load expression: ${expressionFileName}, error: ${error}`);
                }
            }
            Platform.log(`Loaded ${this._expressionCount} expressions successfully`);
        } else {
            Platform.log('No expressions defined in model settings');
        }

        await this.loadPhysics();
    }

    // 加载物理
    public async loadPhysics(): Promise<void> {
        if (this._modelSetting!.getPhysicsFileName() != '') {
            const physicsFileName = this._modelSetting!.getPhysicsFileName();

            try {
                const physicsBuffer = await Platform.loadFileAsBytes(`${this._modelHomeDir}${physicsFileName}`);
                super.loadPhysics(physicsBuffer, physicsBuffer.byteLength);
            } catch (error) {
                Platform.error(`Failed to load physics: ${physicsFileName}`);
            }
        }

        await this.setupEyeBlink();
    }

    // 设置眨眼
    private async setupEyeBlink(): Promise<void> {
        if (this._modelSetting!.getEyeBlinkParameterCount() > 0) {
            // 重新初始化眨眼效果
            CubismEyeBlink.delete(this._eyeBlink);
            this._eyeBlink = CubismEyeBlink.create(this._modelSetting!);
        }

        this.setupBreath();
    }

    // 设置呼吸
    private setupBreath(): void {
        this._breath = CubismBreath.create();

        const breathParameters = new csmVector<BreathParameterData>();
        breathParameters.pushBack(new BreathParameterData(this._idParamAngleX, 0.0, 15.0, 6.5345, 0.5));
        breathParameters.pushBack(new BreathParameterData(this._idParamAngleY, 0.0, 8.0, 3.5345, 0.5));
        breathParameters.pushBack(new BreathParameterData(this._idParamAngleZ, 0.0, 10.0, 5.5345, 0.5));
        breathParameters.pushBack(new BreathParameterData(this._idParamBodyAngleX, 0.0, 4.0, 15.5345, 0.5));
        breathParameters.pushBack(new BreathParameterData(
            CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBreath),
            0.5, 0.5, 3.2345, 1
        ));

        this._breath.setParameters(breathParameters);

        this.setupEyeBlinkIds();
    }

    // 设置眨眼ID
    private setupEyeBlinkIds(): void {
        const eyeBlinkIdCount = this._modelSetting!.getEyeBlinkParameterCount();

        for (let i = 0; i < eyeBlinkIdCount; ++i) {
            this._eyeBlinkIds.pushBack(this._modelSetting!.getEyeBlinkParameterId(i));
        }

        this.setupLipSyncIds();
    }

    // 设置口型同步ID
    private setupLipSyncIds(): void {
        const lipSyncIdCount = this._modelSetting!.getLipSyncParameterCount();

        for (let i = 0; i < lipSyncIdCount; ++i) {
            this._lipSyncIds.pushBack(this._modelSetting!.getLipSyncParameterId(i));
        }

        this.setupLayout();
    }

    // 设置布局
    private setupLayout(): void {
        const layout = new csmMap<string, number>();
        this._modelSetting!.getLayoutMap(layout);
        this._modelMatrix.setupFromLayout(layout);

        this.loadUserDataFile();
    }

    // 加载用户数据
    private async loadUserDataFile(): Promise<void> {
        if (this._modelSetting!.getUserDataFile() != '') {
            const userDataFile = this._modelSetting!.getUserDataFile();
            Platform.log(`Loading user data: ${userDataFile}`);
            
            try {
                const userDataBuffer = await Platform.loadFileAsBytes(`${this._modelHomeDir}${userDataFile}`);
                super.loadUserData(userDataBuffer, userDataBuffer.byteLength);
                Platform.log('User data loaded successfully');
            } catch (error) {
                Platform.error(`Failed to load user data: ${error}`);
            }
        } else {
            Platform.log('No user data file specified');
        }

        this.loadPoseData();
    }

    // 加载姿势数据
    private async loadPoseData(): Promise<void> {
        if (this._modelSetting!.getPoseFileName() != '') {
            const poseFile = this._modelSetting!.getPoseFileName();
            Platform.log(`Loading pose: ${poseFile}`);
            
            try {
                const poseBuffer = await Platform.loadFileAsBytes(`${this._modelHomeDir}${poseFile}`);
                super.loadPose(poseBuffer, poseBuffer.byteLength);
                Platform.log('Pose loaded successfully');
            } catch (error) {
                Platform.error(`Failed to load pose: ${error}`);
            }
        } else {
            Platform.log('No pose file specified');
        }

        this.loadMotions();
    }

    // 加载动作
    private async loadMotions(): Promise<void> {
        this._allMotionCount = 0;
        this._motionCount = 0;

        const motionGroupCount = this._modelSetting!.getMotionGroupCount();

        // 计算总动作数
        for (let i = 0; i < motionGroupCount; i++) {
            const group = this._modelSetting!.getMotionGroupName(i);
            this._allMotionCount += this._modelSetting!.getMotionCount(group);
        }

        // 加载所有动作
        for (let i = 0; i < motionGroupCount; i++) {
            const group = this._modelSetting!.getMotionGroupName(i);
            await this.preLoadMotionGroup(group);
        }

        // 如果没有动作，加载纹理
        if (motionGroupCount == 0) {
            this.loadTextures();
        }
    }

    // 预加载动作组
    private async preLoadMotionGroup(group: string): Promise<void> {
        const count = this._modelSetting!.getMotionCount(group);

        for (let i = 0; i < count; i++) {
            const motionFileName = this._modelSetting!.getMotionFileName(group, i);
            const name = `${group}_${i}`;

            try {
                const motionBuffer = await Platform.loadFileAsBytes(`${this._modelHomeDir}${motionFileName}`);
                const tmpMotion = this.loadMotion(motionBuffer, motionBuffer.byteLength, name);

                if (tmpMotion != null) {
                    tmpMotion.setEffectIds(this._eyeBlinkIds, this._lipSyncIds);

                    if (this._motions.getValue(name) != null) {
                        ACubismMotion.delete(this._motions.getValue(name));
                    }

                    this._motions.setValue(name, tmpMotion);
                    this._motionCount++;
                }
            } catch (error) {
                Platform.error(`Failed to load motion: ${motionFileName}`);
                this._allMotionCount--; // 减少总数
            }

            // 检查是否所有动作都加载完成
            Platform.log(`Motion loading progress: ${this._motionCount}/${this._allMotionCount}`);
            if (this._motionCount >= this._allMotionCount) {
                Platform.log('All motions loaded, starting texture loading...');
                this.loadTextures();
            }
        }
    }

    // 加载纹理
    private async loadTextures(): Promise<void> {
        if (!this._modelSetting) {
            this.completeSetup();
            return;
        }

        const textureCount = this._modelSetting.getTextureCount();
        this._textureCount = 0;

        Platform.log(`Loading ${textureCount} textures...`);

        if (textureCount === 0) {
            Platform.log('No textures to load');
            this.completeSetup();
            return;
        }

        // 创建渲染器（在加载纹理之前）
        this.createRenderer();

        for (let modelTextureNumber = 0; modelTextureNumber < textureCount; modelTextureNumber++) {
            // 跳过空纹理名
            if (this._modelSetting.getTextureFileName(modelTextureNumber) === '') {
                this._textureCount++;
                if (this._textureCount >= textureCount) {
                    this.completeSetup();
                }
                continue;
            }

            // 加载纹理
            const texturePath = `${this._modelHomeDir}${this._modelSetting.getTextureFileName(modelTextureNumber)}`;
            Platform.log(`Loading texture ${modelTextureNumber + 1}/${textureCount}: ${texturePath}`);

            try {
                const texture = await this.loadTexture(texturePath);
                this.getRenderer().bindTexture(modelTextureNumber, texture);
                Platform.log(`Successfully loaded texture ${modelTextureNumber + 1}: ${texturePath}`);

                this._textureCount++;
                if (this._textureCount >= textureCount) {
                    Platform.log('All textures loaded successfully, completing setup');
                    this.completeSetup();
                }
            } catch (error) {
                Platform.error(`Failed to load texture ${modelTextureNumber + 1}: ${texturePath} - ${error}`);
                this._textureCount++;
                if (this._textureCount >= textureCount) {
                    this.completeSetup();
                }
            }
        }
    }

    // 加载单个纹理
    private async loadTexture(url: string): Promise<WebGLTexture> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                if (!this._gl) {
                    reject(new Error('No WebGL context'));
                    return;
                }

                const texture = this._gl.createTexture();
                if (!texture) {
                    reject(new Error('Failed to create texture'));
                    return;
                }

                this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
                this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, img);
                this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR_MIPMAP_LINEAR);
                this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
                this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
                this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
                this._gl.generateMipmap(this._gl.TEXTURE_2D);
                this._gl.bindTexture(this._gl.TEXTURE_2D, null);

                resolve(texture);
            };

            img.onerror = () => {
                reject(new Error(`Failed to load image: ${url}`));
            };

            img.src = url;
        });
    }

    // 完成设置
    private completeSetup(): void {
        this._state = LoadStep.CompleteSetup;
        this._updating = false;
        this._initialized = true;

        // 启动渲染器（如果有WebGL上下文）
        if (this._gl && this._model) {
            try {
                this.getRenderer().startUp(this._gl);
                
                // 设置渲染器属性
                this.getRenderer().setIsPremultipliedAlpha(true);
                
                Platform.log('Renderer started up successfully');
                Platform.log('Model setup completed');
                this._onModelLoaded?.();
            } catch (error) {
                Platform.error(`Failed to start up renderer: ${error}`);
                this._onLoadError?.(error instanceof Error ? error.message : 'Renderer startup failed');
                return;
            }
        } else {
            Platform.error('No WebGL context or model available for renderer startup');
            this._onLoadError?.('No WebGL context or model available');
            return;
        }
    }
}