const video = document.getElementById('video');
const audio = document.getElementById('audio');

document.addEventListener('DOMContentLoaded', async () => {
  // Load face-api.js models
  await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('./models');
  await faceapi.nets.faceExpressionNet.loadFromUri('./models');


 

  navigator.mediaDevices.getUserMedia({ video: {} })
    .then((stream) => {
      video.srcObject = stream;
    });

  video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video,
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors().withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    //   faceapi.draw.drawDetections(canvas, resizedDetections);
    //   faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    //   faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      if (detections.length > 0) {
        const smilingProbability = detections[0].expressions.happy;
        console.log('Smiling Probability:', smilingProbability);

        if (smilingProbability > 0.5) {

          console.log('The person is smiling!');
          audio.play();
          document.body.style.backgroundColor = "#54fffb";
        } else {
          console.log('The person is not smiling.');
          document.body.style.backgroundColor = "gray";
          audio.pause();
        }
      }
    }, 100);
  });
});

   // loading screen disappear 
   document.addEventListener("DOMContentLoaded", function () {
    let loadingwrap = document.getElementById("loading-wrap");
    setTimeout(function () {
        loadingwrap.style.display = "none";
    }, 1500);
});
