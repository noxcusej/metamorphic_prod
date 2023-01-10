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
  } from "@babylonjs/core";
import "@babylonjs/loaders";
import { CustomLoading } from "./customLoading";
import { AdvancedDynamicTexture, Button, GUI3DManager, HolographicButton, Image, StackPanel } from "@babylonjs/gui";


export class MetaRoom4 {
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
  this.ChooseCamera();
  this.CreatePlayButton();
  this.PointCloud();

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
CreatePlayButton(): void {
const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
advancedTexture.idealWidth = 5000;
advancedTexture.idealHeight = 5000;

this.logoImageUp = new Image("playImage", "./assets/textures/fullscreen.png");

this.logoImageUp.fixedRatio = 1;
this.logoImageUp.height = "160px";
this.logoImageUp.verticalAlignment = 1;
this.logoImageUp.horizontalAlignment = 0;
this.logoImageUp.top = "-90%";
this.logoImageUp.left = "95%";
this.logoImageUp.alpha = 0.5;

advancedTexture.addControl(this.logoImageUp);

this.logoImageUp.onPointerClickObservable.add(() =>{
 this.engine.switchFullscreen(true);    
  }
  )
}
async ChooseCamera(): Promise<void> {

    const deviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};

if (deviceType() === "desktop") {
  this.CreateCamera1();
}
if(deviceType() === "tablet" || deviceType() === "mobile"){
  this.CreateCamera();
}
}
async CreateCamera1(): Promise<void> {
  this.camera1 = new FreeCamera("freecamera", new Vector3(0, 2, 32.5), this.scene);
  this.camera1.attachControl(this.canvas, true);
  this.camera1.minZ = 0.25;
  this.camera1.speed = 0.3;
  this.camera1.applyGravity = true;
  this.camera1.ellipsoid = new Vector3(0.8, 1, 0.8);
  this.camera1.checkCollisions = true;
  this.camera1.onCollide;
  this.camera1.rotation = new Vector3(0, Math.PI, 0);
  this.camera1.keysUp.push(87); // "w"
  this.camera1.keysDown.push(83); // "s"
  this.camera1.keysLeft.push(65); // "a"
  this.camera1.keysRight.push(68); // "d"  
}
async CreateCamera(): Promise<void> {
  this.camera = new VirtualJoysticksCamera("vrcamera", new Vector3(0, 2, 32.5), this.scene);
  this.camera.rotation = new Vector3(0, Math.PI, 0);
  this.camera.attachControl(this.canvas, true);
  this.camera.minZ = 0.25;
  this.camera.speed = 0.1;
  this.camera.applyGravity = true;
  this.camera.ellipsoid = new Vector3(0.8, 1, 0.8);
  this.camera.checkCollisions = true;
  // this.camera1.onCollide;
  // this.camera1.rotation = new Vector3(0, Math.PI, 0);
}
async CreateEnvironment(): Promise<void>{

  const model = await SceneLoader.ImportMeshAsync(
    "",
    "./assets/models/",
    "inertia_v89.glb",        
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

  const dirLight = new DirectionalLight("dirLight", new Vector3(0,1,0), this.scene,)
  dirLight.diffuse = new Color3(1,1,1);
  dirLight.intensity = 1.5;
  const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,0), this.scene);
  hemiLight.intensity = 1.8;
  hemiLight.diffuse = new Color3(1,1,1);

  const  glowLayer = new GlowLayer("glow", this.scene);
  glowLayer.intensity = 0.3;


  const music = new Sound("music", "./assets/models/Inertia_Textural.mp3", this.scene, function() {
    // music.isPlaying = true;
    music.autoplay = true;
    music.play();
    music.loop;
  }
  );

  const monik = new PBRMaterial("cubeMat11111", this.scene);
  monik.alpha = 0;
  monik.metallic = 0;
  monik.roughness = 10;
  model.meshes[7].material = monik;
  model.meshes[13].material = monik;
  model.meshes[14].material = monik;

  const spher = new StandardMaterial("cubeMat11111", this.scene);
  const diffuseTexspher = new Texture("./assets/textures/background.png",this.scene,false,false);
  spher.diffuseTexture = diffuseTexspher;  
  spher.specularColor = new Color3(0,0,0);
  model.meshes[2].material = spher;
  model.meshes[19].material = spher;
  




  let cnt = 0;
  const collider = MeshBuilder.CreateBox("collider", {size: 3}, this.scene);

  const deviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};

if (deviceType() === "desktop") {
  collider.parent = this.camera1;
}
if(deviceType() === "tablet" || deviceType() === "mobile"){
  collider.parent = this.camera;
}

  collider.actionManager = new ActionManager(this.scene);
  const action = new ExecuteCodeAction(
      {
          trigger: ActionManager.OnIntersectionEnterTrigger, 
          parameter: { 
              mesh:  model.meshes[34]
          }
      },
      () => {
        cnt+=1;
        if(cnt==1){
  
  music.stop();

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
        }

      }
  );
  collider.actionManager.registerAction(action);

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
  const aoTexGround = new Texture("./assets/textures/beige_wall_001_ao_4k4.png", this.scene);
  ground.ambientTexture = aoTexGround;
  texArrayy.push(aoTexGround);
  ground.reflectionTexture = new MirrorTexture("mirror", {ratio: 1}, this.scene, true);
  (ground.reflectionTexture as MirrorTexture).renderList = [model.meshes[7],model.meshes[13],model.meshes[14]];
  (ground.reflectionTexture as MirrorTexture).mirrorPlane = new Plane(0, -1, 0, 1.5);
  (ground.reflectionTexture as MirrorTexture).adaptiveBlurKernel = 128;
  (ground.reflectionTexture as MirrorTexture).level = 0.5;
  model.meshes[20].material = ground;


  // let samplesNum = 10;
  // const defaultMesh = VolumetricLightScatteringPostProcess.CreateDefaultMesh("meshName", this.scene);
  // const vls = new VolumetricLightScatteringPostProcess("vls", 1.0, this.camera, defaultMesh,100, Texture.BILINEAR_SAMPLINGMODE, this.engine, false);
  


  const aqua_glass = new PBRMaterial("cubeMat11", this.scene);
  const diffuseTexaqua_glass  = new Texture("./assets/textures/background.png",this.scene,false,false);
  diffuseTexaqua_glass.getAlphaFromRGB = true;
  diffuseTexaqua_glass.uScale = -1;
  aqua_glass.reflectionColor = Color3.White();
  aqua_glass.backFaceCulling = false;
  aqua_glass.opacityTexture = diffuseTexaqua_glass;
  aqua_glass.metallic = 0.1;
  aqua_glass.albedoColor = new Color3(0, 0, 0);
  // aqua_glass.emissiveColor = new Color3(10/255, 10/255, 10/255);
  aqua_glass.alpha = 0;
  aqua_glass.alphaMode = Engine.ALPHA_ONEONE;
  aqua_glass.reflectionTexture = new MirrorTexture("mirror",  {ratio: 1}, this.scene, true);
  (aqua_glass.reflectionTexture as MirrorTexture).mirrorPlane =  new Plane(0, 0, 1, -37.5);
  (aqua_glass.reflectionTexture as MirrorTexture).renderList = [model.meshes[7],model.meshes[13],model.meshes[14],model.meshes[4],model.meshes[5],model.meshes[6],model.meshes[9],model.meshes[15],model.meshes[8],model.meshes[33]];
  (aqua_glass.reflectionTexture as MirrorTexture).adaptiveBlurKernel = 32;
  model.meshes[21].material = aqua_glass;

  const art1_glass = new PBRMaterial("cubeMat11", this.scene);
  const diffuseTexart1_glass  = new Texture("./assets/textures/background.png",this.scene,false,false);
  diffuseTexart1_glass.getAlphaFromRGB = true;
  diffuseTexart1_glass.uScale = -1;
  art1_glass.reflectionColor = Color3.White();
  art1_glass.backFaceCulling = false;
  art1_glass.opacityTexture = diffuseTexart1_glass;
  art1_glass.metallic = 0.1;
  art1_glass.albedoColor = Color3.Black();
  // aqua_glass.emissiveColor = new Color3(0.98, 0.4, 1);
  art1_glass.alpha = 0.5;
  art1_glass.alphaMode = Engine.ALPHA_ONEONE;
  art1_glass.reflectionTexture = new MirrorTexture("mirror",  {ratio: 1}, this.scene, true);
  (art1_glass.reflectionTexture as MirrorTexture).mirrorPlane =  new Plane(-1, 0, 0, -9);
  (art1_glass.reflectionTexture as MirrorTexture).renderList = [model.meshes[7],model.meshes[14],model.meshes[13],model.meshes[4],model.meshes[5],model.meshes[6],model.meshes[10],model.meshes[15],model.meshes[8],model.meshes[33]];
  // (mirrorMaterial.reflectionTexture as MirrorTexture).adaptiveBlurKernel = 128;
  model.meshes[23].material = art1_glass;

  const art2_glass = new PBRMaterial("cubeMat11", this.scene);
  const diffuseTexart2_glass  = new Texture("./assets/textures/background.png",this.scene,false,false);
  diffuseTexart2_glass.getAlphaFromRGB = true;
  diffuseTexart2_glass.uScale = -1;
  art2_glass.reflectionColor = Color3.White();
  art2_glass.backFaceCulling = false;
  art2_glass.opacityTexture = diffuseTexart2_glass;
  art2_glass.metallic = 0.1;
  art2_glass.albedoColor = Color3.Black();
  // aqua_glass.emissiveColor = new Color3(0.98, 0.4, 1);
  art2_glass.alpha = 0.5;
  art2_glass.alphaMode = Engine.ALPHA_ONEONE;
  art2_glass.reflectionTexture = new MirrorTexture("mirror",  {ratio: 1}, this.scene, true);
  (art2_glass.reflectionTexture as MirrorTexture).mirrorPlane =  new Plane(1, 0, 0, -9);
  (art2_glass.reflectionTexture as MirrorTexture).renderList = [model.meshes[7],model.meshes[14],model.meshes[13],model.meshes[4],model.meshes[5],model.meshes[6],model.meshes[10],model.meshes[15],model.meshes[8],model.meshes[33]];
  // (mirrorMaterial.reflectionTexture as MirrorTexture).adaptiveBlurKernel = 128;
  model.meshes[25].material = art2_glass;

  const art3_glass = new PBRMaterial("cubeMat11", this.scene);
  const diffuseTexart3_glass  = new Texture("./assets/textures/background.png",this.scene,false,false);
  diffuseTexart3_glass.getAlphaFromRGB = true;
  diffuseTexart3_glass.uScale = -1;
  art3_glass.reflectionColor = Color3.White();
  art3_glass.backFaceCulling = false;
  art3_glass.opacityTexture = diffuseTexart3_glass;
  art3_glass.metallic = 0.1;
  art3_glass.albedoColor = Color3.Black();
  // aqua_glass.emissiveColor = new Color3(0.98, 0.4, 1);
  art3_glass.alpha = 0.5;
  art3_glass.alphaMode = Engine.ALPHA_ONEONE;
  art3_glass.reflectionTexture = new MirrorTexture("mirror",  {ratio: 1}, this.scene, true);
  (art3_glass.reflectionTexture as MirrorTexture).mirrorPlane =  new Plane(1, 0, 0, -70);
  (art3_glass.reflectionTexture as MirrorTexture).renderList = [model.meshes[7],model.meshes[14],model.meshes[13],model.meshes[4],model.meshes[5],model.meshes[6],model.meshes[10],model.meshes[15],model.meshes[8],model.meshes[33]];
  // (mirrorMaterial.reflectionTexture as MirrorTexture).adaptiveBlurKernel = 128;
  model.meshes[26].material = art3_glass;

  const frame_art1_glass = new PBRMaterial("cubeMat11", this.scene);
  const diffuseTexframe_art1_glass  = new Texture("./assets/textures/background.png",this.scene,false,false);
  diffuseTexframe_art1_glass.getAlphaFromRGB = true;
  diffuseTexframe_art1_glass.uScale = -1;
  frame_art1_glass.reflectionColor = Color3.White();
  frame_art1_glass.backFaceCulling = false;
  frame_art1_glass.opacityTexture = diffuseTexframe_art1_glass;
  frame_art1_glass.metallic = 0.1;
  frame_art1_glass.albedoColor = Color3.Black();
  // aqua_glass.emissiveColor = new Color3(0.98, 0.4, 1);
  frame_art1_glass.alpha = 0.5;
  frame_art1_glass.alphaMode = Engine.ALPHA_ONEONE;
  frame_art1_glass.reflectionTexture = new MirrorTexture("mirror",  {ratio: 1}, this.scene, true);
  (frame_art1_glass.reflectionTexture as MirrorTexture).mirrorPlane =  new Plane(1, 0, 0, -9);
  (frame_art1_glass.reflectionTexture as MirrorTexture).renderList = [model.meshes[7],model.meshes[14],model.meshes[13],model.meshes[4],model.meshes[5],model.meshes[6],model.meshes[10],model.meshes[15],model.meshes[8],model.meshes[33]];
  (frame_art1_glass.reflectionTexture as MirrorTexture).adaptiveBlurKernel = 64;
  model.meshes[28].material = frame_art1_glass;

  const frame_art2_glass = new PBRMaterial("cubeMat11", this.scene);
  const diffuseTexframe_art2_glass  = new Texture("./assets/textures/background.png",this.scene,false,false);
  diffuseTexframe_art2_glass.getAlphaFromRGB = true;
  diffuseTexframe_art2_glass.uScale = -1;
  frame_art2_glass.reflectionColor = Color3.White();
  frame_art2_glass.backFaceCulling = false;
  frame_art2_glass.opacityTexture = diffuseTexframe_art2_glass;
  frame_art2_glass.metallic = 0.1;
  frame_art2_glass.albedoColor = Color3.Black();
  // aqua_glass.emissiveColor = new Color3(0.98, 0.4, 1);
  frame_art2_glass.alpha = 0.5;
  frame_art2_glass.alphaMode = Engine.ALPHA_ONEONE;
  frame_art2_glass.reflectionTexture = new MirrorTexture("mirror",  {ratio: 1}, this.scene, true);
  (frame_art2_glass.reflectionTexture as MirrorTexture).mirrorPlane =  new Plane(-1, 0, 0, -9);
  (frame_art2_glass.reflectionTexture as MirrorTexture).renderList = [model.meshes[7],model.meshes[14],model.meshes[13],model.meshes[4],model.meshes[5],model.meshes[6],model.meshes[10],model.meshes[15],model.meshes[8],model.meshes[33]];
  (frame_art2_glass.reflectionTexture as MirrorTexture).adaptiveBlurKernel = 64;
  model.meshes[29].material = frame_art2_glass;

  const frame_art3_glass = new PBRMaterial("cubeMat11", this.scene);
  const diffuseTexframe_art3_glass  = new Texture("./assets/textures/background.png",this.scene,false,false);
  diffuseTexframe_art3_glass.getAlphaFromRGB = true;
  diffuseTexframe_art3_glass.uScale = -1;
  frame_art3_glass.reflectionColor = Color3.White();
  frame_art3_glass.backFaceCulling = false;
  frame_art3_glass.opacityTexture = diffuseTexframe_art3_glass;
  frame_art3_glass.metallic = 0.1;
  frame_art3_glass.albedoColor = Color3.Black();
  // aqua_glass.emissiveColor = new Color3(0.98, 0.4, 1);
  frame_art3_glass.alpha = 0.5;
  frame_art3_glass.alphaMode = Engine.ALPHA_ONEONE;
  frame_art3_glass.reflectionTexture = new MirrorTexture("mirror",  {ratio: 1}, this.scene, true);
  (frame_art3_glass.reflectionTexture as MirrorTexture).mirrorPlane =  new Plane(1, 0, 0, -70);
  (frame_art3_glass.reflectionTexture as MirrorTexture).renderList = [model.meshes[7],model.meshes[14],model.meshes[13],model.meshes[4],model.meshes[5],model.meshes[6],model.meshes[10],model.meshes[15],model.meshes[8],model.meshes[33]];
  (frame_art3_glass.reflectionTexture as MirrorTexture).adaptiveBlurKernel = 64;
  model.meshes[30].material = frame_art3_glass;

  const groundd = new StandardMaterial("cubeMat1", this.scene);
  const diffuseTexGroundd = new Texture("./assets/textures/room_floor.png",this.scene,false,false);
  diffuseTexGroundd.getAlphaFromRGB = false;
  groundd.diffuseTexture = diffuseTexGroundd;
  groundd.roughness = 1;
  groundd.backFaceCulling = true;
  groundd.specularColor = new Color3(50/255,50/255,50/255);
  const aoTexGroundd = new Texture("./assets/textures/beige_wall_001_ao_4k1.png", this.scene);
  groundd.ambientTexture = aoTexGroundd;
  texArrayy.push(aoTexGroundd);
  model.meshes[8].material = groundd;

  const grounds = new StandardMaterial("cubeMat1", this.scene);
  const diffuseTexGrounds = new Texture("./assets/textures/platform_side.png",this.scene,false,false);
  diffuseTexGrounds.getAlphaFromRGB = false;
  grounds.diffuseTexture = diffuseTexGrounds;
  grounds.roughness = 1;
  grounds.backFaceCulling = true;
  grounds.specularColor = new Color3(50/255,50/255,50/255);
  const aoTexGrounds = new Texture("./assets/textures/beige_wall_001_ao_4k4.png", this.scene);
  grounds.ambientTexture = aoTexGrounds;
  texArrayy.push(aoTexGrounds);
  model.meshes[1].material = grounds;

  const grounAR = new StandardMaterial("cubeMat1", this.scene);
  const diffuseTexGrounAR = new Texture("./assets/textures/arch.png",this.scene,false,false);
  diffuseTexGrounAR.getAlphaFromRGB = false;
  grounAR.diffuseTexture = diffuseTexGrounAR;
  grounAR.roughness = 1;
  grounAR.backFaceCulling = true;
  grounAR.specularColor = new Color3(50/255,50/255,50/255);
  const aoTexGrounAR = new Texture("./assets/textures/beige_wall_001_ao_4k2.png", this.scene);
  grounAR.ambientTexture = aoTexGrounAR;
  texArrayy.push(aoTexGrounAR);
  model.meshes[17].material = grounAR;

  const wall = new StandardMaterial("cubeMat11", this.scene);
  const diffuseTexwall = new Texture("./assets/textures/room_inner11.png",this.scene,false,false);
  wall.diffuseTexture = diffuseTexwall;
  diffuseTexwall.getAlphaFromRGB = false;
  wall.specularColor = new Color3(0,0,0);
  const aoTexwall = new Texture("./assets/textures/beige_wall_001_ao_4k.png", this.scene);
  wall.ambientTexture = aoTexwall;
  texArray.push(aoTexwall);
  model.meshes[6].material = wall;  

  const wall2 = new StandardMaterial("cubeMat11", this.scene);
  const diffuseTexwall2 = new Texture("./assets/textures/aqua.png",this.scene,false,false);
  wall2.diffuseTexture = diffuseTexwall2;
  diffuseTexwall2.getAlphaFromRGB = false;
  wall2.specularColor = new Color3(0,0,0);
  const aoTexwall2 = new Texture("./assets/textures/beige_wall_001_ao_4k.png", this.scene);
  wall2.ambientTexture = aoTexwall2;
  texArray.push(aoTexwall2);
  model.meshes[31].material = wall2; 

  const wallOUT = new StandardMaterial("cubeMat11", this.scene);
  const diffuseTexwallOUT = new Texture("./assets/textures/room_outter.png",this.scene,false,false);
  wallOUT.diffuseTexture = diffuseTexwallOUT;
  diffuseTexwallOUT.getAlphaFromRGB = false;
  wallOUT.specularColor = new Color3(0,0,0);
  const aoTexwallOUT = new Texture("./assets/textures/beige_wall_001_ao_4k.png", this.scene);
  wallOUT.ambientTexture = aoTexwallOUT;
  texArray.push(aoTexwallOUT);
  model.meshes[9].material = wallOUT;  

  const wallOUT1 = new StandardMaterial("cubeMat11", this.scene);
  const diffuseTexwallOUT1 = new Texture("./assets/textures/cubel.png",this.scene,false,false);
  wallOUT1.diffuseTexture = diffuseTexwallOUT1;
  wallOUT1.specularColor = new Color3(0,0,0);
  const aoTexwallOUT1 = new Texture("./assets/textures/beige_wall_001_ao_4k.png", this.scene);
  wallOUT1.ambientTexture = aoTexwallOUT1;
  texArray.push(aoTexwallOUT1);
  model.meshes[11].material = wallOUT1; 


  const wallOUT2 = new StandardMaterial("cubeMat11", this.scene);
  const diffuseTexwallOUT2 = new Texture("./assets/textures/cuber.png",this.scene,false,false);
  wallOUT2.diffuseTexture = diffuseTexwallOUT2;
  wallOUT2.specularColor = new Color3(0,0,0);
  const aoTexwallOUT2 = new Texture("./assets/textures/beige_wall_001_ao_4k.png", this.scene);
  wallOUT2.ambientTexture = aoTexwallOUT2;
  texArray.push(aoTexwallOUT2);
  model.meshes[10].material = wallOUT2; 


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
  model.meshes[33].material = glass;  

  this.scene.executeWhenReady(() => this.engine.hideLoadingUI());    
}

async PointCloud(): Promise<void>{
  const modelll = await SceneLoader.ImportMeshAsync(
    "",
    "./assets/models/",
    "build3.glb",        
    this.scene,
    );

    // const wallOUT2 = new StandardMaterial("cubeMat11", this.scene);
    // const diffuseTexwallOUT2 = new Texture("./assets/textures/background.png",this.scene,false,false);
    // wallOUT2.diffuseTexture = diffuseTexwallOUT2;
    // wallOUT2.specularColor = new Color3(1,1,1);
    // modelll.meshes[1].material = wallOUT2; 
}
}