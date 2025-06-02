class MockWebSocket {
    constructor(url){
        console.log("MockWebSocket connected to", url);
        this.readyState = 1;
        this.onMessage=null;

        this._interval = setInterval(() => {
            if (this.onMessage){
                const mockData = {
                    text: "Hello, how are you?",
                    translation: "Xin chào, bạn khỏe không?"
                }
                this.onMessage({data: JSON.stringify(mockData)})
            };
        }, 3000)
    }

    send(data) {
        console.log("Mock send:", data);
    }

    close() {
        clearInterval(this._interval);
        console.log("MockWebSocket closed.");
    }
}

class MockMediaRecorder {
    constructor(stream, config){
        this.state = "inactive";
        this.ondataavailable = null;
    }

    start(interval){
        this._timer = setInterval(() => {
            if (this.ondataavailable) {
                const fakeBlob = new Blob(["FAKE_AUDIO"], { type: "audio/webm" });
                this.ondataavailable({ data: fakeBlob });
            }
        }, interval);
    }

    
    stop() {
        this.state = "inactive";
        clearInterval(this._timer);
        console.log("MockMediaRecorder stopped");
    }
}