import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs-core";
import Stats from "stats-js";

var fps = 24.0;


async function setupCam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const video = document.getElementById("video");
        const cam = await navigator.mediaDevices.getUserMedia({
            "audio": false,
            "video": {
                facingMode: "user",
                frameRate: fps,
            },
        })
        video.srcObject = cam;

        return new Promise(resolve => {
            video.onloadedmetadata = () => {
                resolve(video);
            };
        });
    }
    else {
        const errMessage = "ビデオデバイスが見つかりませんでした。お使いのブラウザは対応していないか、カメラへのアクセス許可がありません。"
        alert(errMessage);
        return Promise.reject(errMessage);
    }
}

async function loadCam() {
    const video = await setupCam();
    video.play();
    return video;
}

async function main() {
    // tf.setBackend("webgl");
    const model = await handpose.load();
    try {
        const video = await loadCam()
    } catch (err) {
        console.error(err);
        const errMessage = "ビデオデバイスが見つかりませんでした。\nお使いのブラウザは対応していないか、カメラへのアクセス許可がありません。"
        alert(errMessage);
        return;
    }

    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    let flame = 0;
    let count = 0;
    async function frameEstimateHands() {
        requestAnimationFrame(frameEstimateHands);
        
        //10fpsに制限
        flame++;
        if (flame % 6 != 0)
            return;
        
        stats.begin();
        const predictions = await model.estimateHands(video);
        if (predictions.length > 0) {
            for (let i = 0; i < predictions.length; i++) {
                count++;
                console.log(count);
            //     const keypoints = predictions[i].landmarks;

            //     for (let i = 0; i < keypoints.length; i++) {
            //         const [x, y, z] = keypoints[i];
            //         console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
            //     }
            }
        }
        stats.end();
    }
    frameEstimateHands()
}
main();