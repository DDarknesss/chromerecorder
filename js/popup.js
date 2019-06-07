$(document).ready(function () { 
    var port = chrome.extension.connect({
        name: "Sample Communication"
    });    
    var windowScrR = $('.windowsRecord');
    var screenR = $('.screenRecord');
    var greeting = $('.greeting');
    var tabR = $('.tabRecord');
    var rec = $('.rec');

    windowScrR.on('click', function(){
        port.postMessage("windowScrR");
    });
    
    screenR.on('click', function(){
        port.postMessage("screenR");
    });

    tabR.on('click', function(){
        port.postMessage("tab"); 
    });

    rec.on('click','.stop', function(){
        port.postMessage('stop'); 
    })

    function started(){
        greeting.html('Recording in progress.Shh!').addClass("message");
        rec.html('<button class="stop">STOP</button>');
    };
    
    port.onMessage.addListener(function(msg) {
        switch(msg){
            case 'change!':
                started();
                break;
        };
    });
});
