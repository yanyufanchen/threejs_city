import {
    FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader'
export function FBXLoaderApi(url) {
    return new Promise((resolve) => {
        const loaderFBX = new FBXLoader()
        loaderFBX.load(url, (obj) => {
            resolve(obj)
        })
    })
}