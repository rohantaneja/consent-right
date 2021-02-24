'use strict'

const PopupHandler = function () {
    let Browser = chrome || browser,utils;

    function initPopupHandler() {
        utils = Browser.extension.getBackgroundPage().utils;

        initWhitelistStatus();

        document.querySelector("#dashboard").addEventListener("click", 
        () => {
                Browser.runtime.openOptionsPage();
            });

        document.querySelector('#toggle-on').addEventListener('click', 
        () => {
                chrome.runtime.sendMessage({ action: 'extOn' }, utils.noop);
                Browser.extension.getBackgroundPage().updateIcon(true);
                Browser.tabs.reload();
                window.close();
            });

        document.querySelector('#toggle-off').addEventListener('click', 
        () => {
                chrome.runtime.sendMessage({ action: 'extOff' }, utils.noop);
                Browser.extension.getBackgroundPage().updateIcon(false);
                Browser.tabs.reload();
                window.close();
            });
        /*
        document.querySelector('#default').addEventListener('click', 
        (e) => {
                chrome.runtime.sendMessage({ action: 'defaultMode' }, utils.noop);
                Browser.tabs.reload();
                window.close();
            });

        document.querySelector('#strict').addEventListener('click', 
        (e) => {
                chrome.runtime.sendMessage({ action: 'strictMode' }, utils.noop);
                Browser.tabs.reload();
                window.close();
            });
        */
        document.querySelector('#add-to-whitelist').addEventListener('click', 
        (e) => {
                Browser.tabs.query({ active: true, currentWindow: true },
                    function (tabs) {
                        if (!tabs) {
                            return;
                        }
                        let ctab = tabs[0];
                        if (utils.isSpecialTab(ctab)) {
                            return;
                        }
                        Browser.runtime.sendMessage({ action: 'addwList', tab: ctab }, utils.noop);
                        Browser.tabs.reload(ctab.tabId);
                        window.close();
                    });
            });

        document.querySelector('#remove-whitelist').addEventListener('click', 
        (e) => {
                Browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (!tabs) {
                        return;
                    }
                    let ctab = tabs[0];
                    Browser.runtime.sendMessage({ action: 'removewList', tab: ctab }, utils.noop);
                    Browser.tabs.reload(ctab.tabId);
                    window.close();
                });
            });
    }

    function initWhitelistStatus() {
        Browser.tabs.query({active: true, currentWindow: true}, 
            function(tabs) {
            
            if(!tabs) return;
            let ctab = tabs[0];
            let domain = utils.getDomain(ctab.url);
            let wlistStatus = utils.checkWhiteList(domain, Browser.extension.getBackgroundPage().pbSettings['pbWhiteList']);

            if (wlistStatus) {  toggleWhitelist(true);   }
            else {  toggleWhitelist(false);
                    initSuspendBtn(ctab.id);    }
        });
    }

    function initSuspendBtn(tabId) {
        utils.getOption('pbRunStatus', 
        function(value) {
            toggleExtension(value);
            Browser.extension.getBackgroundPage().updateIcon(value);
        });
    }

    function counterStats(tabId) {
        let pbTabstmp = Browser.extension.getBackgroundPage().pbTabs;

        if (tabId in pbTabstmp) {
            document.getElementById('blockedNum').innerText = pbTabstmp[tabId].length;
            let prop,
                trEl,
                tdEl,
                tableEl = document.getElementById('blockedDomains');

            for (prop in pbTabstmp[tabId]) {
                trEl = document.createElement('tr');
                tdEl = document.createElement('td');
                tdEl.innerText = pbTabstmp[tabId][prop];
                trEl.appendChild(tdEl);
                tableEl.appendChild(trEl);
            }
        } 
        else {
            document.getElementById('blockedNum').innerText = 0;
        }

    }

    function setMode(toggle) {
        document.getElementById('default').style.display = (toggle === true) ? 'checked' : '';
        document.getElementById('strict').style.display = (toggle === true) ? '' : 'checked';
    }

    function toggleWhitelist(status) {
        document.getElementById('add-to-whitelist').style.display = (status === true) ? 'none' : '';
        document.getElementById('remove-whitelist').style.display = (status === true) ? '' : 'none';
        document.querySelector('.rules').style.display = (status === true) ? '' : 'none';
    }

    function toggleExtension(status) {
        document.getElementById('toggle-off').style.display = (status === true) ? '' : 'none';
        document.getElementById('toggle-on').style.display = (status === true) ? 'none' : '';
        document.querySelector('.rules').style.display = (status === true) ? '' : 'none';
        document.querySelector('.actmon').style.display = (status === true) ? '' : 'none';
    }

    document.addEventListener('DOMContentLoaded', () => {
            initPopupHandler();
        });
}();