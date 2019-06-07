chrome.extension.onConnect.addListener(function(port) {
    function screenCapture(param){
        chrome.desktopCapture.chooseDesktopMedia( [param], accessToRecord);
    };

    function startStream(stream){ 
        var mediaStreamObject = new MediaRecorder(stream);
        
        mediaStreamObject.ondataavailable = function(blob){
            var win  = window.open('index.html','_blank');
            win.somesrc = blob.data;
        };

        port.onMessage.addListener(function(msg) {
            if(msg === 'stop'){
                stream.oninactive();
            };
        });

        stream.oninactive = function(){
            mediaStreamObject.stop();
            stream.getTracks().forEach( track => track.stop() );
        };
        
        port.postMessage('change!');
        mediaStreamObject.start();
    };

    function failedStream(err){
        console.log(err);
    };
 
    function tabscreen(){
        chrome.tabCapture.capture({
            audio: false,
            video: true,
        }, startStream )
    };

    function accessToRecord(id) {
        navigator.webkitGetUserMedia({
            video: {
                mandatory: {
                    chromeMediaSourceId: id,
                    chromeMediaSource: "desktop",
                }
            },
            audio: false
        }, startStream, failedStream )
    };


    port.onMessage.addListener(function(msg) {
        switch(msg){
            case 'windowScrR':
                screenCapture('window');
                break;
            
            case 'screenR':
                screenCapture('screen');
                break;

            case 'tab':
                tabscreen();
                break;

            default :
                port.postMessage("something wrong");
                break;
        };
    });

})