import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    MeshPhongMaterial,
    MeshNormalMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer,
    GridHelper,
    AxesHelper,
    AmbientLight,
    DirectionalLight,
    DirectionalLightHelper,
    HemisphereLight,
    SpotLight,
    SpotLightHelper,
    Color,
    Raycaster,
    Vector2,
    Vector3,
    PlaneGeometry,
    CanvasTexture,
    ClampToEdgeWrapping,
    ConeGeometry,
    Group,
    Object3D,
    FogExp2,
    DynamicDrawUsage,
    RepeatWrapping,
    TextureLoader,
    Clock,
    ArrowHelper,
    Layers,
    ReinhardToneMapping,
    ShaderMaterial,
    LineSegments,
    LineBasicMaterial,
    EdgesGeometry,
    CubeTextureLoader,
    sRGBEncoding
} from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import {
    TransformControls
} from 'three/examples/jsm/controls/TransformControls';
import {
    ImprovedNoise
} from 'three/examples/jsm/math/ImprovedNoise.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import {
    ViewHelper
} from './js/ViewHelper.js';
import {
    FBXLoaderApi
} from './js/tool'
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader'
import {
    FlyControls
} from 'three/examples/jsm/controls/FlyControls'
import {
    TWEEN
} from './js/tween.module.min.js'

let container, stats;

let camera, controls, scene, renderer, flyControls, viewHelper, transformControls;
let tweenfloor;
let scenegroup;
let floor; // 飞机
let city; // 城市
let runFlag = false; // 移动开关
const worldWidth = 256,
    worldDepth = 256,
    worldHalfWidth = worldWidth / 2,
    worldHalfDepth = worldDepth / 2;

let helper;
const raycaster = new Raycaster();
const pointer = new Vector2();
// 特效
import {
    Radar,
    Wall,
    Fly
} from './js/effect/index'
let isStart = false // 是否启动特效
let time = {
    value: 0
}
let StartTime = {
    value: 0
};
let effectGroup = new Group();
effectGroup.name = 'effectGroup'
const radarData = [{
    position: {
        x: 666,
        y: 22,
        z: 0
    },
    radius: 150,
    color: '#ff0062',
    opacity: 0.5,
    speed: 2
}, {
    position: {
        x: -666,
        y: 25,
        z: 202
    },
    radius: 320,
    color: '#efad35',
    opacity: 0.6,
    speed: 1
}];
const wallData = [{
    position: {
        x: -150,
        y: 15,
        z: 100
    },
    speed: 0.5,
    color: '#efad35',
    opacity: 0.6,
    radius: 420,
    height: 120,
    renderOrder: 5
}, ]
const flyData = [{
    source: {
        x: -150,
        y: 15,
        z: 100
    },
    target: {
        x: -666,
        y: 25,
        z: 202
    },
    range: 120,
    height: 100,
    color: '#efad35',
    speed: 1,
    size: 30
}, {
    source: {
        x: -150,
        y: 15,
        z: 100
    },
    target: {
        x: 666,
        y: 22,
        z: 0
    },
    height: 300,
    range: 150,
    color: '#ff0000',
    speed: 1,
    size: 40
}]
// effectGroup.position.set(100, 1000, 100)
// 东方明珠特效
// BloomPass   该通道会使得明亮区域参入较暗的区域。模拟相机照到过多亮光的情形
// DotScreenPass   将一层黑点贴到代表原始图片的屏幕上
// FilmPass    通过扫描线和失真模拟电视屏幕
// MaskPass    在当前图片上贴一层掩膜，后续通道只会影响被贴的区域
// RenderPass  该通道在指定的场景和相机的基础上渲染出一个新的场景
// SavePass    执行该通道时，它会将当前渲染步骤的结果复制一份，方便后面使用。这个通道实际应用中作用不大；
// ShaderPass  使用该通道你可以传入一个自定义的着色器，用来生成高级的、自定义的后期处理通道
// TexturePass 该通道可以将效果组合器的当前状态保存为一个纹理，然后可以在其他EffectCoposer对象中将该纹理作为输入参数
import {
    EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {
    RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
    ShaderPass
} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {
    UnrealBloomPass
} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
let clock = new Clock();
const ENTIRE_SCENE = 0,
    BLOOM_SCENE = 10;

const bloomLayer = new Layers();
bloomLayer.set(BLOOM_SCENE);

const params = {
    exposure: 1,
    bloomStrength: 5,
    bloomThreshold: 0,
    bloomRadius: 0,
    scene: 'Scene with Glow'
};
const materials = {};
let darkMaterial;
let bloomComposer;
let finalComposer;


async function init() {
    // 场景
    scene = new Scene()
    // #雾气
    let cubeTextureLoader = new CubeTextureLoader();
    let cubeTexture = cubeTextureLoader.load('/bgc01.jpg');
    //需要把色彩空间编码改一下，原因我上一篇说过的
    cubeTexture.encoding = sRGBEncoding;
    console.log(cubeTexture, 'cubeTexture')
    scene.background = cubeTexture;
    // scene.background = new Color('#5b5c66');
    // scene.background = new Color('#0f1318');
    // scene.fog = new FogExp2('#5b5c66', 0.00009);
    // scene.fog = new FogExp2('#0f1318', 0.000009);

    // 相机
    camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 25000)
    camera.position.set(5, 5, 10)
    camera.lookAt(scene.position)

    // 渲染器
    renderer = new WebGLRenderer({
        alpha: true // 透明
    })
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // 相机控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1000;
    controls.maxDistance = 15000;
    controls.maxPolarAngle = Math.PI / 2;
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 0.5;
    controls.enablePan = false; // 禁止相机平移
    // // 控制相机
    const data = generateHeight(worldWidth, worldDepth);
    controls.target.y = data[worldHalfWidth + worldHalfDepth * worldWidth] + 500 + 1000;
    camera.position.y = controls.target.y + 2000 + 1000;
    camera.position.x = 2000 + 1000;
    controls.update();

    // 添加城市
    city = await FBXLoaderApi('./shanghai-new.FBX')

    let newCity = setCity(city)
    // 创建场景容器
    scenegroup = new Group()
    scenegroup.name = 'scenegroup'
    scenegroup.position.set(0, 100, 0)
    scenegroup.add(newCity)
    scenegroup.scale.set(4, 4, 4)
    effectGroup.scale.set(8, 5, 8)
    effectGroup.position.set(0, 200, 0)
    scene.add(scenegroup);
    scene.add(effectGroup);
    setDfmz()
    // 创建直升飞机
    floor = await FBXLoaderApi('./floor.FBX')
    floor.scale.set(0.07, 0.07, 0.07)
    floor.rotation.y = -Math.PI / 2
    floor.position.set(0, 1800, 0);
    scene.add(floor)
    createWater()
    createLight()
    createEffect()

    // 鼠标移动标
    const geometryHelper = new ConeGeometry(20, 100, 3);
    geometryHelper.translate(0, 50, 0);
    geometryHelper.rotateX(Math.PI / 2);
    helper = new Mesh(geometryHelper, new MeshNormalMaterial());
    scene.add(helper);
    const dir = new Vector3(1, 2, 0);
    //normalize the direction vector (convert to vector of length 1)
    dir.normalize();
    // 检测
    document.body.addEventListener('pointermove', onPointerMove);

    // 坐标提示
    const axesHelper = new AxesHelper(500);
    scene.add(axesHelper);
    axesHelper.position.set(0, 1000, 0)
    scene.add(axesHelper);

    // 评率显示
    stats = new Stats();
    document.body.appendChild(stats.dom);

    // 自适应
    window.addEventListener('resize', onWindowResize);
    addEventListener('dblclick', onMouseDblclick, false);


}



function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    // controls.update()
    // 播放特效
    const dt = clock.getDelta();
    effectAnimation(dt)
    if (floor) {
        floor.children[0].children[0].rotation.z += .08
    }
    // 后期处理
    if (bloomComposer) {
        renderBloom(true);
        finalComposer.render();
    }
    TWEEN.update()
}

function effectAnimation(dt) {
    if (dt > 1) return false;
    time.value += dt;

    // 启动
    if (isStart) {
        StartTime.value += dt * 0.5;
        if (StartTime.value >= 1) {
            StartTime.value = 1;
            isStart = false;
        }
    }

}
init()
animate()

// 窗口自适应
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 获取高度
function generateHeight(width, height) {
    const size = width * height,
        data = new Uint8Array(size),
        perlin = new ImprovedNoise(),
        z = Math.random() * 100;
    let quality = 1;
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < size; i++) {
            const x = i % width,
                y = ~~(i / width);
            data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
        }
        quality *= 5;
    }
    return data;
}

// 鼠标移动标
function onPointerMove(event) {
    if (runFlag) {
        console.log('动画正在进行,移动标尺无效')
        return
    }
    pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    pointer.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    // See if the ray from the camera into the world hits one of our meshes
    const intersects = raycaster.intersectObject(scenegroup);
    let newintersects = []
    if (intersects.length > 0) {
        newintersects = intersects.filter(item => item.object.name !== 'cityline')
    }
    if (newintersects.length > 0) {
        helper.position.set(0, 0, 0);
        helper.lookAt(newintersects[0].face.normal);
        helper.position.copy(newintersects[0].point);
    }
}

function tweenRun() {
    runFlag = true
    tweenfloor = new TWEEN.Tween(floor.position).to({
        x: helper.position.x,
        y: floor.position.y, // 高度不变
        z: helper.position.z
    }, 5000);
    // console.log(controls,'controls')
    tweenfloor.onUpdate(function (object) {
        
        controls.target.x = helper.position.x;
        controls.target.y = helper.position.y;
        controls.target.z = helper.position.z;
        // controls.update();

        controls.object.position.x = object.x + 1000;
        controls.object.position.y = object.y + 1000;
        controls.object.position.z = object.z + 1000;
        // controls.object.lookAt(controls.target.x,controls.target.y,controls.target.z)



        if (floor.position.x == helper.position.x) {
            console.log('到达终点')
            runFlag = false
        }
    })
    tweenfloor.start();
}
//鼠标双击触发的方法
function onMouseDblclick(event) {
    console.log(helper.position, '鼠标捕获坐标')
    if (runFlag) {
        console.log('动画正在进行')
        return
    }
    tweenRun()
}
// 创建海洋
function createWater() {
    const worldWidth2 = 128;
    const worldDepth2 = 128;
    let geometry = new PlaneGeometry(50000, 50000, worldWidth2 - 1, worldDepth2 - 1);
    geometry.rotateX(-Math.PI / 2);

    const position = geometry.attributes.position;
    position.usage = DynamicDrawUsage;

    for (let i = 0; i < position.count; i++) {

        const y = 35 * Math.sin(i / 2);
        position.setY(i, y);

    }

    const texture = new TextureLoader().load('./textures/water.jpg');
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(5, 5);

    let material = new MeshBasicMaterial({
        color: 0x0044ff,
        map: texture
    });

    let mesh = new Mesh(geometry, material);
    mesh.position.set(0, 100, 0)
    scene.add(mesh);

}
// 创建灯光
function createLight() {
    const Alight = new AmbientLight(0x404040); // soft white light
    scene.add(Alight);
    const directionalLight = new DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(0, 5000, 0);
    scene.add(directionalLight);
    const Hlight = new HemisphereLight(0xffffbb, 0x080820, 1.5);
    scene.add(Hlight);
    // 东方明珠灯光
    let dfmzPostion = [-15117, 3820, 1820]
    const dfmzspotLight = new SpotLight('#770da8');
    dfmzspotLight.position.set(dfmzPostion[0] + 100, dfmzPostion[1] + 1000, dfmzPostion[2] + 100);
    dfmzspotLight.castShadow = true;
    dfmzspotLight.intensity = 10;
    dfmzspotLight.angle = Math.PI / 4
    dfmzspotLight.penumbra = 0.14;
    dfmzspotLight.shadow.mapSize.width = 1024;
    dfmzspotLight.shadow.mapSize.height = 1024;
    dfmzspotLight.shadow.camera.near = 500;
    dfmzspotLight.shadow.camera.far = 3000;
    dfmzspotLight.shadow.camera.fov = 30;
    const targetObject = new Object3D();
    scene.add(targetObject);
    const dfmzhelper = new SpotLightHelper(dfmzspotLight, 500);
    scene.add(dfmzhelper);
    targetObject.position.set(dfmzPostion[0], 0, dfmzPostion[2])
    dfmzspotLight.target = targetObject;
    dfmzhelper.visible = false; // 隐藏
    // 延时修改坐标
    setTimeout(() => {
        dfmzhelper.update()
        scene.add(dfmzspotLight);
    }, 50)

    // 中心灯光
    let zxPostion = [0, 2820, 0]
    const zxspotLight = new SpotLight('#e6b05f');
    zxspotLight.position.set(zxPostion[0] + 0, zxPostion[1] + 0, zxPostion[2] + 0);
    zxspotLight.castShadow = true;
    zxspotLight.intensity = 4;
    zxspotLight.angle = Math.PI / 4
    zxspotLight.penumbra = 0.24;
    zxspotLight.shadow.mapSize.width = 1024;
    zxspotLight.shadow.mapSize.height = 1024;
    zxspotLight.shadow.camera.near = 500;
    zxspotLight.shadow.camera.far = 3000;
    zxspotLight.shadow.camera.fov = 30;
    // const zxhelper = new SpotLightHelper(zxspotLight, 500);
    // scene.add(zxhelper);
    scene.add(zxspotLight);

}
// 设置城市
function setCity() {
    city.castShadow = true; // 开启阴影
    city.receiveShadow = true; // 接受阴影
    city.children.forEach((item, index) => {
        item.castShadow = true; // 开启阴影
        item.receiveShadow = true; // 接受阴影
        // item.scale.set(4, 4, 4)
        if (item.name === 'ROADS') { // 道路
            // item.material.color.setStyle("#d9534f");
            item.material = new MeshBasicMaterial({
                color: '#d9534f'
            })
            item.material.transparent = true; // 开启半透明
            item.material.depthWrite = false; // 不遮挡后面模型
            item.material.opacity = 0.4;
            item.layers.enable(BLOOM_SCENE)
        }
        if (item.name === 'LANDMASS') { // 大陆板块
            item.material.color.setStyle("#040912");

        }
        if (item.name === 'chair') { // 

        }
        if (item.name === 'CITY_UNTRIANGULATED') { // 城市建筑
            item.material.color.setStyle("#2a5d9e");
            item.material.transparent = true;
            item.material.opacity = 0.7;
            // 东方明珠
            item.children[1].material = new MeshBasicMaterial({
                color: '#7f129b'
            })
            item.children[1].layers.enable(BLOOM_SCENE)
            // 添加包围线条效
            // 立方体几何体box作为EdgesGeometry参数创建一个新的几何体
            var edges = new EdgesGeometry(item.geometry);
            // 立方体线框，不显示中间的斜线
            var edgesMaterial = new LineBasicMaterial({
                color: '#00adb5'
            })
            var line = new LineSegments(edges, edgesMaterial);
            line.name = 'cityline'
            line.material.transparent = true;
            line.material.opacity = 0.3;
            line.layers.enable(BLOOM_SCENE)
            item.children[0].add(line)
        }
        if (item.name === 'drive') { // 
        }
    })
    return city
}

function createEffect() {
    setTimeout(() => {
        isStart = true;
        // 加载扫描效果
        radarData.forEach((data) => {
            const mesh = Radar(data);
            mesh.material.uniforms.time = time;
            effectGroup.add(mesh);
        });
        // 光墙
        wallData.forEach((data) => {
            const mesh = Wall(data);
            mesh.material.uniforms.time = time;
            effectGroup.add(mesh);
        });
        // 飞线
        flyData.forEach((data) => {
            const mesh = Fly(data);
            mesh.material.uniforms.time = time;
            mesh.renderOrder = 10;
            effectGroup.add(mesh);
        });
        effectGroup.rotation.y = Math.PI / 2
    }, 1000)
}
// 设置东方明珠自发光
function setDfmz() {
    scene.traverse(disposeMaterial);
    const bloomLayer = new Layers();
    bloomLayer.set(BLOOM_SCENE);

    darkMaterial = new MeshBasicMaterial({
        color: 'black'
    });

    renderer.toneMapping = ReinhardToneMapping; // 曝光值
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);


    const vertexShader = /* glsl */ `
            varying vec2 vUv;

        			void main() {
                    
        				vUv = uv;
                    
        				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                    
        			}
        `
    const fragmentShader = /* glsl */ `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;

        varying vec2 vUv;

        void main() {
        
            gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
        
        }
        `
    const finalPass = new ShaderPass(
        new ShaderMaterial({
            uniforms: {
                baseTexture: {
                    value: null
                },
                bloomTexture: {
                    value: bloomComposer.renderTarget2.texture
                }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            defines: {}
        }), 'baseTexture'
    );
    finalPass.needsSwap = true;
    finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderScene);
    finalComposer.addPass(finalPass);


}

function renderBloom(mask) {
    if (mask === true) {
        scene.traverse(darkenNonBloomed);
        bloomComposer.render();
        scene.traverse(restoreMaterial);
    } else {
        camera.layers.set(BLOOM_SCENE);
        bloomComposer.render();
        camera.layers.set(ENTIRE_SCENE);
    }
}

function disposeMaterial(obj) {
    if (obj.material) {
        obj.material.dispose();
    }
}

function darkenNonBloomed(obj) {
    if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;
    }
}

function restoreMaterial(obj) {
    if (materials[obj.uuid]) {
        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];
    }
}



console.log(scene, 'hello world')