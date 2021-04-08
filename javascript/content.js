'use strict';

const ContentJS = function () {
    
    let Browser = chrome || browser;

    Browser.runtime.sendMessage({action: 'signal:extension-status', url: location.host}, (event) => {
        if (event.extensionStatus) {
            var script = document.createElement('script');
            script.src = Browser.extension.getURL('javascript/cmp-handler.js');
            document.documentElement.insertBefore(script, document.documentElement.childNodes[0]);
        }
    });

    window.addEventListener('sendcmpinfo', (event) => {
        Browser.runtime.sendMessage({action: 'info:retrieve-counter', 
        provider : event.detail.provider,
        counter: event.detail.counter},() => {});
    }, false);
}();