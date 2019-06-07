chrome.extension.onConnect.addListener(function(port) {
    
    function screenCapture(param){
        chrome.desktopCapture.chooseDesktopMedia([param], accessToRecord);
    };


    function startStream(stream){ 
        var mediaStreamObject = new MediaRecorder(stream);
        
        mediaStreamObject.ondataavailable = function(blob){
            var win  = window.open('index.html','_blank');
            win.somesrc = blob.data;
        };
        
        stream.oninactive = function(){
            if(mediaStreamObject.state === 'recording' ){
                mediaStreamObject.stop();
            };
            stream.getTracks().forEach(recording => recording.stop());
            chromeListens("popup.html", '');
        };
        
        chrome.browserAction.onClicked.addListener(function() {
            stopStream(stream);
        });

        mediaStreamObject.onstop = function (){
            stopStream(stream);
        }

        port.onMessage.addListener(function(msg) {
            if(msg === 'stop'){
                stopStream(stream);
            };
        });

        port.postMessage('change!');
        mediaStreamObject.start();
        chromeListens("", 'rec');
    };

    function stopStream(stream){
        stream.oninactive();
    }

    function failedStream(err){
        console.log(err);
    };

    function chromeListens(pop, text){
        chrome.browserAction.setPopup({popup: pop});
        chrome.browserAction.setBadgeText( { text: text});
    }

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