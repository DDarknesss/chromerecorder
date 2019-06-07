$(document).ready(function () { 
    
    var windowScrR = $('.windowsRecord');
    var screenR = $('.screenRecord');
    var greeting = $('.greeting');
    var tabR = $('.tabRecord');


    function init(){

        windowScrR.on('click', function(){
            screenCapture('screen');
            stopButton(this);
        });

        screenR.on('click', function(){
            screenCapture('screen');
            stopButton(this);
        });

        tabR.on('click', function(){
            chrome.tabCapture.capture({
                audio: false,
                video: true,
            }, startStream )
            stopButton(this);
        });
    };

    
    function screenCapture(param){
        chrome.desktopCapture.chooseDesktopMedia( [param], accessToRecord);
    };

    function accessToRecord(id) {
        navigator.webkitGetUserMedia({
            video: {
                mandatory: {
                    chromeMediaSourceId: id,
                    chromeMediaSource: "desktop",
   
                }
            },
            audio: false,
        }, startStream, failedStream )
    };

    function startStream(stream){ 
        greeting.html('Recording in progress.Shh!').addClass("message");
        
        var originVideo = document.getElementById('screenMain');
        var mediaStreamObject = new MediaRecorder(stream);
        
        mediaStreamObject.start();

        originVideo.srcObject = stream;
       
        mediaStreamObject.ondataavailable = function(blob){
            var win  = window.open('index.html','_blank');
            win.somesrc = blob.data;
        };

        stream.oninactive = function(){
            mediaStreamObject.stop();
        };

        buttonsActivity(stream);
    };


    // BUTTONS IN POPOUP

    function buttonsActivity(stream){
        
        windowScrR.on('click',function(){
            stopStream(stream)
        });

        screenR.on('click', function(){
            stopStream(stream)
        });

        tabR.on('click', function(){
            stopStream(stream)
        });
    };
  
    function stopStream(stream){
        stream.oninactive();
    }

    function stopButton(element){
        $(element).html('Stop');
    };
    
    function failedStream(err){
        console.log(err);
    };

    init();
});
