import React, { useEffect, useRef } from "react";

import {
    FaceDetector,
    FilesetResolver,
    Detection
} from "@mediapipe/tasks-vision"

function Video() {

    const webcamRef: any = useRef()
    let lastVideoTime = -1; 
    let faceDetector: any = undefined
    let isEnableWebcam = false

    const runVisionTask = async () => {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2-rc2/wasm"
        );

        faceDetector = await FaceDetector.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
            delegate: "GPU"
            },
            runningMode: "VIDEO"
        });

        await enableWebcam()


    }


    const enableWebcam = async () => {
        const constraints = {
            video: true
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        console.log("stream", stream)
        webcamRef.current.srcObject = stream;
        isEnableWebcam = true

        await faceDetector.setOptions({ runningMode: "VIDEO" });

        let { width, height } = stream.getTracks()[0].getSettings();
        console.log(width, height)


        webcamRef.current.addEventListener("loadeddata", predictWebcam);

    }

    const predictWebcam = () => {
        let startTimeMs = performance.now();

        if (webcamRef.current.currentTime !== lastVideoTime) {
            lastVideoTime = webcamRef.current.currentTime;
            const detections = faceDetector.detectForVideo(webcamRef.current, startTimeMs).detections;
            
            try {
                dispatchWebcamEvent(detections[0].boundingBox)

            } catch (error) {}
        }
      
        window.requestAnimationFrame(predictWebcam);
    }


    const dispatchWebcamEvent = (boundingBox: any) => {
        const webcamEvent = new CustomEvent('webcamEvent', {
            detail: {
                boundingBox: boundingBox
            }
        });

        window.dispatchEvent(webcamEvent);

    }

    useEffect(() => {
        runVisionTask()
    }, [])

    return (
        <div>
            <video id="webcam" ref={webcamRef} autoPlay playsInline></video>
        </div>
    )
}

export { Video }