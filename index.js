import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs-core";
import Stats from "stats-js";

var fps = 24.0;
let videoWidth, videoHeight;

async function setupCam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const video = document.getElementById("video");
        const cam = await navigator.mediaDevices.getUserMedia({
            "audio": false,
            "video": {
                facingMode: "user",
                frameRate: fps,
                width: 640,
                height: 480,
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
    tf.setBackend("webgl");
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
    
    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;
    const canvas = document.getElementById('bone-canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const ctx = canvas.getContext('2d');
    video.width = videoWidth;
    video.height = videoHeight;

    ctx.clearRect(0, 0, videoWidth, videoHeight);
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    async function frameEstimateHands() {
        requestAnimationFrame(frameEstimateHands);
        //20fpsに制限
        flame++;
        if (flame % 3 != 0)
            return;
        stats.begin();

        ctx.drawImage(video, 0, 0, videoWidth, videoHeight, 0, 0, canvas.width, canvas.height);

        const predictions = await model.estimateHands(video);
        if (predictions.length > 0) {
            for (let i = 0; i < predictions.length; i++) {
                drawKeypoints(ctx, predictions[i].landmarks);
                count++;
                console.log(count);
                const keypoints = predictions[i].landmarks;

                for (let i = 0; i < keypoints.length; i++) {
                    const [x, y, z] = keypoints[i];
                    console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
                }
            }
        }
        stats.end();
    }
    frameEstimateHands()
}

function drawKeypoints(ctx, points) {
    const keypoints = points;
  
    for (let i = 0; i < keypoints.length; i++) {
        const y = keypoints[i][0];
        const x = keypoints[i][1];
      
        ctx.beginPath();
        ctx.arc(y, x, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
}
main();