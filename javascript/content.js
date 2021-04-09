'use strict';

const ContentJS = function () {
    
    let Browser = chrome || browser;

    Browser.runtime.sendMessage({action: 'signal:extension-status', url: location.host}, (event) => {
        if (event.extensionStatus) {
            if (event.level == 0) {
                var script = document.createElement('script');
                script.src = Browser.extension.getURL('javascript/full.js');
                script.type='text/javascript';
                document.documentElement.insertBefore(script, document.documentElement.childNodes[0]);
            }
            else {
                var minimal = ["javascript/allow.js", "javascript/toggles.js", "javascript/li.js"];
                if (event.level == 1 || event.level == 3 || event.level == 5 || event.level == 7){
                    var script = document.createElement('script');
                    script.src = Browser.extension.getURL(minimal[0]);
                    script.type='text/javascript';
                    document.documentElement.insertBefore(script, document.documentElement.childNodes[0]);
                }
                if (event.level == 2 || event.level == 3 || event.level == 6 || event.level == 7){
                    var script = document.createElement('script');
                    script.src = Browser.extension.getURL(minimal[1]);
                    script.type='text/javascript';
                    document.documentElement.insertBefore(script, document.documentElement.childNodes[0]);
                }
                if (event.level == 4 || event.level == 5 || event.level == 6 || event.level == 7){
                    var script = document.createElement('script');
                    script.src = Browser.extension.getURL(minimal[2]);
                    script.type='text/javascript';
                    document.documentElement.insertBefore(script, document.documentElement.childNodes[0]);
                }
            }
        }
    });

    document.addEventListener('sendcmpinfo', (event) => {
        Browser.runtime.sendMessage({action: 'info:retrieve-counter', 
        provider : event.detail.provider,
        counter: event.detail.counter},() => {});
    }, false);
}();