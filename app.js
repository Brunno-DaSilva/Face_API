const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    
    
    // console.log(detections[0].expressions.neutral)  

    const neutral = detections[0].expressions.neutral > 0.90; 
    const angry = detections[0].expressions.angry > 0.90; 
    const sad = detections[0].expressions.sad > 0.90; 
    const happy = detections[0].expressions.happy > 0.90;
    const surprised = detections[0].expressions.surprised > 0.90;
    const disgusted = detections[0].expressions.disgusted > 0.90;

    const faceExpression = document.getElementById('faceExpression')

    if(neutral){
        faceExpression.innerText = `😐`
    }else if(angry){
        faceExpression.innerText = `😡`
    }else if(sad){
        faceExpression.innerText = `😔`
    }else if(happy){
        faceExpression.innerText = `😊`
    }else if(surprised){
        faceExpression.innerText = `😱`
    }else{
        faceExpression.innerText = `😐`
    }




  }, 100)
})
