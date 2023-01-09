import {
    Scene, 
    Engine, 
    Camera,
    Color4, 
    Color3,
    Vector3, 
    FreeCamera, 
    UniversalCamera,
    HemisphericLight, 
    ShadowLight,
    DirectionalLight,
    PointLight,
    SpotLight,
    MeshBuilder,
    PBRMaterial,
    DynamicTexture,
    Texture,
    SceneLoader,
    AbstractMesh,
    VideoTexture,
    GlowLayer,
    MeshAssetTask,
    ScreenSpaceReflectionPostProcess,
    WebXRHitTest,
    GizmoManager,
    LightGizmo,
    Light,
    ShadowGenerator,
    StandardMaterial,
    MirrorTexture,
    CubeTexture,
    Mesh,
    Plane,
    Material,
    WebVRFreeCamera,
    VRDeviceOrientationFreeCamera,
    KeyboardEventTypes,
    Animatable,
    TransformNode,
    TrajectoryClassifier,
    EasingFunction,
    QuarticEase,
    DefaultRenderingPipeline,
    Animation,
    ArcRotateCamera,
    TouchCamera,
    VirtualJoysticksCamera,
    DeviceOrientationCamera,
    PhysicsImpostor,
    CannonJSPlugin,
    ActionManager,
    SetValueAction,
    ExecuteCodeAction,
    Action,
    PerfCounter,
    StopSoundAction,
    Sound,
    HDRCubeTexture,
    VolumetricLightScatteringPostProcess,
    WebXRDefaultExperience,
    } from "@babylonjs/core";
  import "@babylonjs/loaders";
  import { CustomLoading } from "./customLoading";
  import { AdvancedDynamicTexture, Button, GUI3DManager, HolographicButton, Image, StackPanel } from "@babylonjs/gui";
  
  
  export class ForVR {
    scene: Scene;
    engine: Engine;  
    loadingScreen: CustomLoading;
    camera!: VirtualJoysticksCamera;
    camera1!: FreeCamera;
    lowRad: number;
    upperRad: number;
    fovAnim!: Animatable;
    VirtualJoysticksCamera: any;
    FreeCamera: any;
    logoImageUp!: Image;
  
  constructor(private canvas: HTMLCanvasElement, private loadContainer: HTMLElement, private loadBack: HTMLElement, private loadBar: HTMLElement,) {
      this.engine = new Engine(this.canvas, false, {
        antialias: false,
        preserveDrawingBuffer: false,
      });
    this.engine.setHardwareScalingLevel(0.5);
    
  
  
    this.loadingScreen = new CustomLoading(this.loadContainer, this.loadBar);
  
    this.engine.loadingScreen = this.loadingScreen;
    this.engine.displayLoadingUI();
  
    this.scene = this.CreateScene();
    this.lowRad = 0.3;
    this.upperRad = 2.5;
    this.CreateEnvironment();
  
  
    this.engine.runRenderLoop(()=>{
        this.scene.render();
    });
    this.canvas.addEventListener("resize", () => { 
      this.engine.resize(); 
    });
  
    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }
  
  CreateScene(): Scene {
    const scene = new Scene(this.engine); 
    const assumedFramesPerSecond = 60;
    const earthGravity = -9.8;
    scene.gravity = new Vector3(0, earthGravity / assumedFramesPerSecond, 0);
    scene.clearColor = new Color4(0, 0, 0, 1);
    scene.collisionsEnabled = true;
    scene.enablePhysics();  
    return scene;
  }
  async CreateEnvironment(): Promise<void>{
  
  
    const model = await SceneLoader.ImportMeshAsync(
      "",
      "./assets/models/",
      "inertia_v91.glb",        
      this.scene,
      (evt) => {
        const loadStatus = (evt.loaded * 100 / evt.total).toFixed();
        this.loadingScreen.updateLoadStatus(loadStatus);
      }
      );
  
    console.log(model.transformNodes, model.meshes);
    for(let i = 0; i < model.meshes.length; i++) {
      if(i != 1) model.meshes[i].checkCollisions = true;
    }
  
    const snapPoint = MeshBuilder.CreateBox('snapPoint', { height: 0.01, width: 1, depth: 1 });
    snapPoint.position.x = 4;
    snapPoint.position.z = 3;
    const xr = await this.scene.createDefaultXRExperienceAsync({
      floorMeshes: [model.meshes[35], model.meshes[20]],
      outputCanvasOptions: {canvasOptions: { framebufferScaleFactor: 10 }}
    });
  
    xr.teleportation.addSnapPoint(snapPoint.position);
  
    const dirLight = new DirectionalLight("dirLight", new Vector3(0,1,0), this.scene,)
    dirLight.diffuse = new Color3(1,1,1);
    dirLight.intensity = 1.5;
    const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,0), this.scene);
    hemiLight.intensity = 1.8;
    hemiLight.diffuse = new Color3(1,1,1);
  
    const displayMat1 = new PBRMaterial("displayMat1", this.scene);
    const displayTex1 = new VideoTexture(
      "displayTex1", 
      "./assets/models/Intertia Final5.mp4", 
      this.scene, 
      true,
      true, 
      VideoTexture.BILINEAR_SAMPLINGMODE, {
        autoUpdateTexture: true,
        autoPlay: true,
        loop: true
      });
    displayTex1.getAlphaFromRGB = true;
    displayMat1.alphaMode = Engine.ALPHA_ONEONE;
    displayMat1.opacityTexture = displayTex1;
    displayMat1.reflectanceTexture = displayTex1;
    displayMat1.reflectionColor = Color3.Black();
    displayMat1.backFaceCulling = false;
    displayMat1.metallic = 0;
    displayMat1.albedoColor = Color3.Black();
    displayMat1.emissiveColor = new Color3(1, 1, 1);
    displayMat1.emissiveIntensity = 10;
    displayMat1.emissiveTexture = displayTex1;    
    model.meshes[7].material = displayMat1;
  
  
  
    const displayMat2 = new PBRMaterial("displayMat1", this.scene);
    const displayTex2 = new VideoTexture(
      "displayTex1", 
      "./assets/models/Side Screens Intertia21.mp4", 
      this.scene, 
      true,
      true, 
      VideoTexture.BILINEAR_SAMPLINGMODE, {
        autoUpdateTexture: true,
        autoPlay: true,
        loop: true
      });
    displayTex2.getAlphaFromRGB = true;
    displayMat2.alphaMode = Engine.ALPHA_ONEONE;
    displayMat2.opacityTexture = displayTex2;
    displayMat2.reflectanceTexture = displayTex2;
    displayMat2.reflectionColor = Color3.Black();
    displayMat2.backFaceCulling = false;
    displayMat2.metallic = 0;
    displayMat2.albedoColor = Color3.Black();
    displayMat2.emissiveColor = new Color3(1, 1, 1);
    displayMat2.emissiveIntensity = 10;
    displayMat2.emissiveTexture = displayTex2;    
    model.meshes[13].material = displayMat2;
    model.meshes[14].material = displayMat2;
    
    const uvScale = 30;
    const texArray: Texture[] = [];
  
    const uvScalee = 7;
    const texArrayy: Texture[] = [];
  
    const uvScaleee = 60;
    const texArrayyy: Texture[] = [];
  
    const ground = new StandardMaterial("cubeMat1", this.scene);
    const diffuseTexGround = new Texture("./assets/textures/plat_floor.png",this.scene,false,false);
    diffuseTexGround.getAlphaFromRGB = false;
    ground.diffuseTexture = diffuseTexGround;
    ground.roughness = 1;
    ground.backFaceCulling = true;
    ground.specularColor = new Color3(50/255,50/255,50/255);
    ground.ambientTexture = diffuseTexGround;
    ground.reflectionTexture = diffuseTexGround;
    ground.useReflectionOverAlpha = true;
    // const aoTexGround = new Texture("./assets/textures/beige_wall_001_ao_4k4.png", this.scene);
    // ground.ambientTexture = aoTexGround;
    // texArrayy.push(aoTexGround);
    ground.reflectionTexture = new MirrorTexture("mirror", {ratio: 1}, this.scene, true);
    (ground.reflectionTexture as MirrorTexture).renderList = [model.meshes[7],model.meshes[13],model.meshes[14]];
    (ground.reflectionTexture as MirrorTexture).mirrorPlane = new Plane(0, -1, 0, 1.5);
    (ground.reflectionTexture as MirrorTexture).adaptiveBlurKernel = 128;
    (ground.reflectionTexture as MirrorTexture).level = 0.5;
    model.meshes[20].material = ground;
  
    const walls = new StandardMaterial("cubeMat11", this.scene);
    const diffuseTexwalls = new Texture("./assets/textures/grid_floor_16k_gray.png",this.scene,false,false);
    walls.diffuseTexture = diffuseTexwalls;
    walls.diffuseTexture.hasAlpha = true;
    walls.alpha = 1;
    model.meshes[3].material = walls;  
  
  
    const text = new StandardMaterial("cubeMat11", this.scene);
    const diffuseTextext = new Texture("./assets/textures/inscription.png",this.scene,false,false);
    text.diffuseTexture = diffuseTextext;
    text.diffuseTexture.hasAlpha = true;
    text.alpha = 1;
    model.meshes[16].material = text;  
  
    
    const spher = new StandardMaterial("cubeMat11111", this.scene);
    const diffuseTexspher = new Texture("./assets/textures/background.png",this.scene,false,false);
    spher.diffuseTexture = diffuseTexspher;  
    spher.specularColor = new Color3(0,0,0);
    model.meshes[2].material = spher;
    model.meshes[19].material = spher;
  
  
    texArray.forEach((tex) => {
      tex.uScale = uvScale;
      tex.vScale = uvScale;
    });
  
    texArrayy.forEach((tex) => {
      tex.uScale = uvScalee;
      tex.vScale = uvScalee;
    });
  
    texArrayyy.forEach((tex) => {
        tex.uScale = uvScaleee;
        tex.vScale = uvScaleee;
      });
    
    const glass = new PBRMaterial("cubeMat4", this.scene);
    glass.alpha = 0;
    glass.metallic = 0;
    glass.roughness = 10;
    model.meshes[35].material = glass;  
    model.meshes[33].material = glass;  
  
  
    const pipeline = new DefaultRenderingPipeline(
      "defaultPipeline", // The name of the pipeline
      true, // Do you want the pipeline to use HDR texture?
      this.scene // The scene instance
  );
    pipeline.samples = 1000;
  
    this.scene.executeWhenReady(() => this.engine.hideLoadingUI());    
  }
  }