$(document).ready(function () {
    if(window.somesrc){
        document.getElementById('final').src =  URL.createObjectURL(window.somesrc);
    } else {
        window.close()
    }
})