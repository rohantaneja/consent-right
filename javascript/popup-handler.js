'use strict'
let Browser = chrome || browser, utils;

const PopupHandler = function () {

    function initPopupHandler() {
        utils = Browser.extension.getBackgroundPage().utils;
        initWhitelistStatus();

        document.getElementById("dashboard").onclick = () => {Browser.runtime.openOptionsPage();};
        document.getElementById('toggle-on').onclick = () => {
                Browser.runtime.sendMessage({ action: 'extOn' });
                Browser.extension.getBackgroundPage().updateIcon(true);
                Browser.tabs.reload();
                window.close();
            };

        document.getElementById('toggle-off').onclick = () => {
                Browser.runtime.sendMessage({ action: 'extOff' }, utils.noop);
                Browser.extension.getBackgroundPage().updateIcon(false);
                Browser.tabs.reload();
                window.close();
            };
        
        document.getElementById('add-wlist').onclick = () => {
            Browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if(!tabs) {return;}
                let ctab = tabs[0];
                if(utils.isSpecialTab(ctab)) {return;}
                Browser.runtime.sendMessage({action: 'addWlist', tab : ctab}, utils.noop);
                Browser.tabs.reload(ctab.tabId);
                window.close();
            });
        };

        document.getElementById('rm-wlist').onclick = () => {
            Browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if(!tabs) {return;}
                let ctab = tabs[0];
                Browser.runtime.sendMessage({action: 'removeWlist', tab : ctab}, utils.noop);
                Browser.tabs.reload(ctab.tabId);
                window.close();
            });
        };

        document.getElementById('full').onclick = () => {
            switchModeToFull();
            Browser.tabs.reload();
            window.close();
        };

        document.getElementById('minimal').onclick = () => {
            Browser.runtime.sendMessage({action: 'cmpMode', level : 1}, utils.noop);
            Browser.extension.getBackgroundPage().changeMode(1);
            toggleMode();
            Browser.tabs.reload();
            window.close();
        };

        document.getElementById('rm-allow').onclick = () => {
            if (document.getElementById('rm-allow').checked) {
                toggleMode();
            }    
            else {
                if 
                (document.getElementById('rm-consent').checked ||
                document.getElementById('rm-li').checked ||
                document.getElementById('rm-allow').checked) {
                    toggleMode();
                }
                else {
                    switchModeToFull();
                    Browser.tabs.reload();
                    window.close();
                }
            }
            Browser.tabs.reload();
        };

        document.getElementById('rm-consent').onclick = () => {
            if (document.getElementById('rm-consent').checked) {
                toggleMode();
            }    
            else {
                if 
                (document.getElementById('rm-consent').checked ||
                document.getElementById('rm-li').checked ||
                document.getElementById('rm-allow').checked) {
                    toggleMode();
                }
                else {
                    switchModeToFull();
                    Browser.tabs.reload();
                    window.close();
                }
            }
            Browser.tabs.reload();
        };

        document.getElementById('rm-li').onclick = () => {
            if (document.getElementById('rm-li').checked) {
                toggleMode();
            }    
            else {
                if 
                (document.getElementById('rm-consent').checked ||
                document.getElementById('rm-li').checked ||
                document.getElementById('rm-allow').checked) {
                    toggleMode();
                }
                else {
                    switchModeToFull();
                    Browser.tabs.reload();
                    window.close();
                }
            }
            Browser.tabs.reload();
        };
    }
    
    function initWhitelistStatus() {
        Browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if(!tabs) return;
            let ctab = tabs[0];
            if (utils.isSpecialTab(ctab)) {
                document.querySelector('.active-url').innerText = 'Special Tab';
                document.getElementById('toggle-off').style.display = 'none';
                document.getElementById('toggle-on').style.display = 'none';
                document.querySelector('.rules').style.display = 'none';
                document.querySelector('.status').style.display = '';
                document.querySelector('.ext-control').style.display ='none';
                document.querySelector('#add-wlist').style.display ='none';
                document.querySelector('#rm-wlist').style.display ='none';
                document.querySelector('.blocked-cmp').style.display ='none';
                document.querySelector('.alt-heading').style.display ='none';
                return;
            }

            let domain = utils.getDomain(ctab.url);
            document.querySelector('.active-url').innerText = domain;
            
            let wlistStatus = utils.checkWhiteList(domain, Browser.extension.getBackgroundPage().crSettings['crWList']);

            if (wlistStatus) {
                toggleWhitelist(true);
            }
            else {  
                toggleWhitelist(false);
                initSuspendBtn(ctab.id);    
            }
        });
    }

    function initSuspendBtn(tabId) {
        utils.getOption('crEnabled', function(value) {
            toggleExtension(value);
            Browser.extension.getBackgroundPage().updateIcon(value);
            counterStats(tabId);
        });
    }

    function counterStats(tabId) {
        let crTabstmp = Browser.extension.getBackgroundPage().crTabs;
        //console.log('crTabstmp[tabId][0]');
        if (tabId in crTabstmp) {
            // document.querySelector('.blocked-nos').innerText = crTabstmp[tabId].length;
            //console.log(crTabstmp[tabId][0]);
            document.querySelector('.blocked-cmp').innerText = crTabstmp[tabId][0];
        } 
        // else {
        //     document.querySelector('.blocked-nos').innerText = 'None';
        // }
    }

    function switchModeToFull() {
        Browser.runtime.sendMessage({action: 'cmpMode', level : 0}, utils.noop);
        Browser.extension.getBackgroundPage().changeMode(0);
    }
    function toggleWhitelist(status) {
        document.querySelector('#add-wlist').style.display = (status === true) ? 'none' : '';
        document.getElementById('toggle-off').style.display = (status === true) ? 'none' : '';
        document.getElementById('toggle-on').style.display = (status === true) ? 'none' : '';
        document.querySelector('#rm-wlist').style.display = (status === true) ? '' : 'none';
        document.querySelector('.blocked-cmp').innerText = (status === true) ? 'Site Whitelisted':'No Rule Found' ;
        document.querySelector('.rules').style.display = (status === true) ? 'none' : '';
        document.querySelector('.ext-control').style.display = (status === true) ? 'none' : '';
    }

    function toggleExtension(status) {
        document.getElementById('toggle-off').style.display = (status === true) ? '' : 'none';
        document.getElementById('toggle-on').style.display = (status === true) ? 'none' : '';
        document.querySelector('.rules').style.display = (status === true) ? '' : 'none';
        document.querySelector('.status').style.display = (status === true) ? 'none' : '';
        document.querySelector('.act-mon').style.display = (status === true) ? '' : 'none';
                
        //console.log('test')
        utils.getOption('cmpMode', function(level) {
        document.querySelector('.ext-control').style.display = (status === true && level > 0) ? '' : 'none';
        document.getElementById('full').checked = (level === 0) ? true : false;
        document.getElementById('minimal').checked = (level > 0) ? true : false;
        toggleMode();
        document.getElementById('rm-allow').checked = (level == 1 || level == 3 || level == 5 || level == 7) ? true : false;
        document.getElementById('rm-li').checked = (level == 4 || level == 5 || level == 6 || level == 7) ? true : false;
        document.getElementById('rm-consent').checked = (level == 2 || level == 3 || level == 6 || level == 7) ? true : false;
        });
    }

    function toggleMode() {
        utils.getOption('cmpMode', function(level) {
        //console.log(level)
            if (document.getElementById('rm-allow').checked && document.getElementById('rm-consent').checked && document.getElementById('rm-li').checked)   {
                Browser.runtime.sendMessage({action: 'cmpMode', level : 7}, utils.noop);
                Browser.extension.getBackgroundPage().changeMode(7);
                return;
            }
            if (document.getElementById('rm-consent').checked && document.getElementById('rm-li').checked)   {
                Browser.runtime.sendMessage({action: 'cmpMode', level : 6}, utils.noop);
                Browser.extension.getBackgroundPage().changeMode(6);
                return;
            }
            if (document.getElementById('rm-allow').checked && document.getElementById('rm-li').checked)   {
                Browser.runtime.sendMessage({action: 'cmpMode', level : 5}, utils.noop);
                Browser.extension.getBackgroundPage().changeMode(5);
                return;
            }
            if (document.getElementById('rm-li').checked)   {
                Browser.runtime.sendMessage({action: 'cmpMode', level : 4}, utils.noop);
                Browser.extension.getBackgroundPage().changeMode(4);
                return;
            }
            if (document.getElementById('rm-allow').checked && document.getElementById('rm-consent').checked)   {
                Browser.runtime.sendMessage({action: 'cmpMode', level : 3}, utils.noop);
                Browser.extension.getBackgroundPage().changeMode(3);
                return;
            }
            if (document.getElementById('rm-consent').checked)   {
                Browser.runtime.sendMessage({action: 'cmpMode', level : 2}, utils.noop);
                Browser.extension.getBackgroundPage().changeMode(2);
                return;
            }
            if (document.getElementById('rm-allow').checked)    {
                Browser.runtime.sendMessage({action: 'cmpMode', level : 1}, utils.noop);
                Browser.extension.getBackgroundPage().changeMode(1);
                return;
            }
        });
    }
    document.addEventListener('DOMContentLoaded', () => {initPopupHandler();});
}();