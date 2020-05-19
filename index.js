const handpose = require('@tensorflow-models/handpose');

async function setupCam(){
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        const video = document.getElementById("video");
        const cam = await navigator.mediaDevices.getUserMedia({
            "audio": false,
            "video": {
                facingMode: "user"
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

async function loadCam(){
    const video = await setupCam();
    video.play();
    return video;
}

async function main() {
    const model = await handpose.load();
    const video = await loadCam()

    async function frameEstimateHands (){
        const predictions = await model.estimateHands(video);
        if (predictions.length > 0) {
            for (let i = 0; i < predictions.length; i++) {
                const keypoints = predictions[i].landmarks;
    
                for (let i = 0; i < keypoints.length; i++) {
                    const [x, y, z] = keypoints[i];
                    console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
                }
            }
        }
        requestAnimationFrame(frameEstimateHands);
    }

    frameEstimateHands()
}
main();