const script = document.createElement("script");
script.type = "text/javascript";
script.src = chrome.runtime.getURL('/inject/jingsourcing-whatsapp.js');
document.body.appendChild(script);
console.log('注入js完成');


