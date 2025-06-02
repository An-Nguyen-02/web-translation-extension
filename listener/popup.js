let socket;
let mediaRecorder;

document.getElementById('start').onclick(() => {
    socket = new WebSocket('some url')

    socket.onmessage = (event) => {
        const {transcribed, translated} = event
        document.getElementById('original').textContent = transcribed;
        document.getElementById('translated').textContent = translated;
    }

    socket.onopen = () => {console.log("websocket connected")};
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>{
        chrome.tabCapture.capture({audio: true, video: false}, (stream) => {
            if (stream){
                mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0 && socket.readyState == WebSocket.OPEN) {
                        socket.send(event.data);
                    }
                };

                mediaRecorder.start(1000)
            }
            return;
        })
    })
})

document.getElementById("stop").onclick = () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    console.log("Stopped mediaRecorder");
  }
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    console.log("WebSocket closed");
  }
};

// popup.js
export function setup() {
  const btn = document.getElementById("start");
  btn.textContent = "Recording...";
}