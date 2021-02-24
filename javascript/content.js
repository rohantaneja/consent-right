(function () {
    'use strict';
    let Browser = chrome || browser;

    Browser.runtime.sendMessage({action: 'getpKillStatus', url: location.host}, (res) => {
        if (res.pKillStatus) {
            let script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', Browser.extension.getURL('javascript/cmp-handler.js'));
            document.head.appendChild(script);
        }
    });

    document.addEventListener('privacyPopUpBlocked', (e) => {
        Browser.runtime.sendMessage({action: 'privacyPopUpBlockedFromContent', privacyPopUpUrl: e.detail.privacyPopUpUrl}, () => {});
    }, false);
}());