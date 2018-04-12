'use strict';

var  tabList=[],urlList=[],currentPage=0;
function  initWebSocket(value){
    var websocket = new WebSocket("ws://******:5932/websocket"); 
    console.log(" #正在建立连接... ");
    websocket.onopen = function(evt) { 
        console.log(" #建立连接成功... ");
        websocket.send(JSON.stringify({"screen_num": parseInt(value)}));
    };

    websocket.onclose = function(evt) { 
        console.log(" #关闭连接完毕... ");
    }; 
    websocket.onmessage = function(mesg) { 
        var data = JSON.parse(mesg.data)
        if(data.screen_num ==  value){
            if(data.url_list){
                 urlList = data.url_list;
                 currentPage=0;
                 openPage();
                
            }else{
                 changePage(data);
            }
        }   
    }; 
    websocket.onerror = function(evt) { 
         console.log(" #连接建立出错... ");
    };
}
function openPage(){
     for(let i=0,l=urlList.length;i<l;i++){
            var selectTag = false;
            if(i == 0){
                selectTag = true;
            }
            chrome.tabs.create({ url: urlList[i] ,selected: selectTag},function(tab){
                tabList.push({"url":urlList[i],"tabId":tab.id});
            });
        }
      
}
function changePage(data){

       if(data.action == 0){
          currentPage == 0 ? currentPage : (--currentPage);
       }else{
          currentPage == urlList.length-1 ? currentPage : (++currentPage);
       }
       var url = urlList[currentPage];
       var tabId = "";
       for(var i in tabList){
            if(tabList[i].url == url){
                tabId = tabList[i].tabId;
            }
       }
       
       var updateProperties = {"active": true};
       chrome.tabs.update(tabId, updateProperties, function(tab){ });
}

chrome.extension.onConnect.addListener(function(port) {
      console.log("Connected .....");
      port.onMessage.addListener(function(msg) {
           initWebSocket(msg);
           console.log("message recieved" + msg);
           
      });
 })