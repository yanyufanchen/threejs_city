import * as THREE from 'three'
export class ViewHelper extends THREE.Object3D {
    constructor(editorCamera, container) {
        super()
        this.container = container
        // this.editorCamera = editorCamera
        // this.point = new THREE.Vector3()
        this.dim = 1280
        // this.raycaster = new THREE.Raycaster()
        // this.mouse = new THREE.Vector2()
        this.sceneOrtho = new THREE.Scene(); //视角场景
        this.rendererOrtho = new THREE.WebGLRenderer({
            antialias: true,
            // alpha: true
        });
        this.rendererOrtho.setSize(1280, 1280);

        // // panel用于让点击不会点到canvas场景中
        const panel = document.createElement('div')
        panel.id = 'viewHelper'
        panel.style.position = 'absolute'
        panel.style.right = '0px'
        panel.style.bottom = '0px'
        panel.style.height = '1280px'
        panel.style.width = '1280px'
        panel.addEventListener('mouseup', event => {
            event.stopPropagation()
            event.preventDefault()
            this.handleClick(event)
        })
        panel.addEventListener('mousedown', (event) => {
            event.stopPropagation()
        })
        panel.appendChild(this.rendererOrtho.domElement);
        container.appendChild(panel)

        // this.panel = panel
        // const Box = new THREE.Object3D()
        // Box.name = 'view_helper'
        // const color1 = new THREE.Color('#ff3653')
        // const color2 = new THREE.Color('#8adb00')
        // const color3 = new THREE.Color('#2c8fff')

        // const interactiveObjects = []
        const width = 1024
        const height = 1024
        // const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -4, 400)
        // const camera = new THREE.OrthographicCamera(70, width / 2, height / 2, -height / 2, -4, 4000)
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 20000)
        // camera.position.set(0, 0, 0)
        // camera.lookAt(0, 0, 0);
        this.camera = camera
        // const geometry = new THREE.BoxGeometry(0.8, 0.05, 0.05).translate(0.4, 0, 0)

        // const xAxis = new THREE.Mesh(geometry, getAxisMaterial(color1))
        // const yAxis = new THREE.Mesh(geometry, getAxisMaterial(color2))
        // const zAxis = new THREE.Mesh(geometry, getAxisMaterial(color3))

        // yAxis.rotation.z = Math.PI / 2
        // zAxis.rotation.y = -Math.PI / 2
        // Box.add(xAxis)
        // Box.add(zAxis)
        // Box.add(yAxis)

        // const posXAxisHelper = new THREE.Sprite(getSpriteMaterial(color1, 'X'))
        // posXAxisHelper.userData.type = 'posX'
        // const posYAxisHelper = new THREE.Sprite(getSpriteMaterial(color2, 'Y'))
        // posYAxisHelper.userData.type = 'posY'
        // const posZAxisHelper = new THREE.Sprite(getSpriteMaterial(color3, 'Z'))
        // posZAxisHelper.userData.type = 'posZ'
        // const negXAxisHelper = new THREE.Sprite(getSpriteMaterial(color1))
        // negXAxisHelper.userData.type = 'negX'
        // const negYAxisHelper = new THREE.Sprite(getSpriteMaterial(color2))
        // negYAxisHelper.userData.type = 'negY'
        // const negZAxisHelper = new THREE.Sprite(getSpriteMaterial(color3))
        // negZAxisHelper.userData.type = 'negZ'

        // posXAxisHelper.position.x = 1
        // posYAxisHelper.position.y = 1
        // posZAxisHelper.position.z = 1
        // negXAxisHelper.position.x = -1
        // negXAxisHelper.scale.setScalar(0.8)
        // negYAxisHelper.position.y = -1
        // negYAxisHelper.scale.setScalar(0.8)
        // negZAxisHelper.position.z = -1
        // negZAxisHelper.scale.setScalar(0.8)

        // Box.add(posXAxisHelper)
        // Box.add(posYAxisHelper)
        // Box.add(posZAxisHelper)
        // Box.add(negXAxisHelper)
        // Box.add(negYAxisHelper)
        // Box.add(negZAxisHelper)

        // interactiveObjects.push(posXAxisHelper)
        // interactiveObjects.push(posYAxisHelper)
        // interactiveObjects.push(posZAxisHelper)
        // interactiveObjects.push(negXAxisHelper)
        // interactiveObjects.push(negYAxisHelper)
        // interactiveObjects.push(negZAxisHelper)

        // this.posXAxisHelper = posXAxisHelper
        // this.posYAxisHelper = posYAxisHelper
        // this.posZAxisHelper = posZAxisHelper
        // this.negXAxisHelper = negXAxisHelper
        // this.negYAxisHelper = negYAxisHelper
        // this.negZAxisHelper = negZAxisHelper
        // this.interactiveObjects = interactiveObjects
        // // 汇总

        // // this.sceneOrtho.add(Box)
        const size = 100;
        const divisions = 100;

        const gridHelper = new THREE.GridHelper(size, divisions);
        this.sceneOrtho.add(gridHelper);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.sceneOrtho.add(directionalLight);
        // console.log(this.sceneOrtho, 'sceneOrtho')
    }

    render(renderer, scene, camera) {
        // this.quaternion.copy(this.editorCamera.quaternion).invert()
        this.updateMatrixWorld()

        // const point = this.point
        // point.set(0, 0, 1)
        // point.applyQuaternion(this.editorCamera.quaternion)

        // if (point.x >= 0) {
        //     this.posXAxisHelper.material.opacity = 1
        //     this.negXAxisHelper.material.opacity = 0.5
        // } else {
        //     this.posXAxisHelper.material.opacity = 0.5
        //     this.negXAxisHelper.material.opacity = 1
        // }

        // if (point.y >= 0) {
        //     this.posYAxisHelper.material.opacity = 1
        //     this.negYAxisHelper.material.opacity = 0.5
        // } else {
        //     this.posYAxisHelper.material.opacity = 0.5
        //     this.negYAxisHelper.material.opacity = 1
        // }

        // if (point.z >= 0) {
        //     this.posZAxisHelper.material.opacity = 1
        //     this.negZAxisHelper.material.opacity = 0.5
        // } else {
        //     this.posZAxisHelper.material.opacity = 0.5
        //     this.negZAxisHelper.material.opacity = 1
        // }

        // this.camera.position.set[0, 0, 0];
        // this.camera.quaternion.copy(camera.quaternion);
        this.rendererOrtho.render(this.sceneOrtho, this.camera)
    }

    handleClick(event) {
        this.mouse.x = (event.offsetX / this.dim) * 2 - 1
        this.mouse.y = -(event.offsetY / this.dim) * 2 + 1

        this.raycaster.setFromCamera(this.mouse, this.camera)

        const intersects = this.raycaster.intersectObjects(this.interactiveObjects)

        if (intersects.length === 0) {
            return
        }

        switch (intersects[0].object.userData.type) {
            case 'posX':
                console.log('posX')
                break

            case 'posY':
                break

            case 'posZ':
                break

            case 'negX':
                break

            case 'negY':
                break

            case 'negZ':
                break

            default:
                console.error('ViewHelper: Invalid axis.')
        }
    }
}

function getAxisMaterial(color) {
    return new THREE.MeshBasicMaterial({
        color: color,
        toneMapped: false
    })
}

function getSpriteMaterial(color, text) {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64

    const context = canvas.getContext('2d')
    context.beginPath()
    context.arc(32, 32, 16, 0, 2 * Math.PI)
    context.closePath()
    context.fillStyle = color.getStyle()
    context.fill()

    if (text) {
        context.font = '24px Arial'
        context.textAlign = 'center'
        context.fillStyle = '#000000'
        context.fillText(text, 32, 41)
    }

    const texture = new THREE.CanvasTexture(canvas)

    return new THREE.SpriteMaterial({
        map: texture,
        toneMapped: false
    })
}