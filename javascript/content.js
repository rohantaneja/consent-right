'use strict';

const ContentJS = function () {
    
    let Browser = chrome || browser;

    Browser.runtime.sendMessage({action: 'getExtKillStatus', url: location.host}, (res) => {
        if (res.extKillStatus) {
            let script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', Browser.extension.getURL('javascript/cmp-handler.js'));
            document.head.appendChild(script);
        }
    });
    document.addEventListener('cmpBlocked', (event) => {
        Browser.runtime.sendMessage({action: 'cmpBlockedOnSite', 
        cmpName : event.detail.cmpName, 
        numBlocked: event.detail.numBlocked}, 
        () => {});}, false);

    // document.addEventListener('getLevel', (event) => {
    //     Browser.runtime.sendMessage({action: 'cmpBlockedOnSite', 
    //     cmpName : event.detail.cmpName, 
    //     numBlocked: event.detail.numBlocked}, 
    //     () => {});}, false);
}();