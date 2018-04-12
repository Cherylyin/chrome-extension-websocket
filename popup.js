document.getElementById("create-link-btn").addEventListener("click",function(){
    var value = document.getElementById("num").value;
    if(!value || parseInt(value) <=0){
        alert("Input Error");
        return;
    }
    var port = chrome.extension.connect({name: "Communication"});
    port.postMessage(value);
    port.onMessage.addListener(function(msg) {
        console.log("message recieved"+ msg);
    });
})

