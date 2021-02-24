'use strict';

var Browser = chrome || browser,
    pauseIcon = 'ui/off.png',
    startIcon = 'ui/on.png',
    pbTabs = {},
    pbwTabs = [],
    urls = [],
    pbSettings;


function initBackground() {
    utils.getSettings(function(value) {
        pbSettings = value;

        /*
        HTTPGetText(Browser.runtime.getURL('assets/filters.txt'), function() {
            if (pbSettings['pbFilters']) {
                let data = this.responseText;
                data = data.split('\n');
                data = utils.cleanArray(data);
                urls = urls.concat(data);
            }
            urls = urls.concat(pbSettings['pbUserFilters']);
        }, function (err) {
            console.log('Error: ', err);
        });
        */
    });
}

/*
function HTTPGetText(url, handleReqListener, handleReqError) {
    var oReq = new XMLHttpRequest();
    oReq.onload = handleReqListener;
    oReq.onerror = handleReqError;
    oReq.open('get', url, true);
    oReq.send();
}
*/

function updateIcon(status, ctabId) {
    let icon = (status === true) ? startIcon : pauseIcon;
    if(ctabId === undefined) {
        Browser.browserAction.setIcon({path: icon});
    } else {
        Browser.browserAction.setIcon({path: icon, tabId: ctabId});
    }

}

function changePbStatus(status) {
    pbSettings['pbRunStatus'] = status;
    utils.setOption('pbRunStatus', status, utils.noop);
}

function addwList(url) {
    let isUrlwListed = utils.checkWhiteList(url, pbSettings['pbWhiteList']);

    if (isUrlwListed) {
        return;
    }

    if (pbSettings['pbWhiteList'] === null) {
        pbSettings['pbWhiteList'] = [];
    }

    pbSettings['pbWhiteList'].push(url);

    utils.setOption('pbWhiteList', pbSettings['pbWhiteList'], utils.noop);

}

function removewList(url) {
    let isUrlwListed = utils.checkWhiteList(url, pbSettings['pbWhiteList']);

    if (!isUrlwListed) {
        return;
    }

    let urlIndex = pbSettings['pbWhiteList'].indexOf(url);

    if (urlIndex > -1) {
        pbSettings['pbWhiteList'].splice(urlIndex, 1);
        utils.setOption('pbWhiteList', pbSettings['pbWhiteList'], utils.noop);
    }

}

function updateBadge(mcount, tabId) {
    Browser.browserAction.setBadgeBackgroundColor({
        color: (mcount == 0) ? [16, 201, 33, 100] : [200, 0, 0, 100],
        tabId: tabId
    });

    Browser.browserAction.setBadgeText({
        text: String(mcount),
        tabId: tabId
    });
}

function addpbTab(tabId, rootDomain) {
    if(tabId in pbTabs) {
        if(pbTabs[tabId].indexOf(rootDomain) === -1) {
            pbTabs[tabId].push(rootDomain);
        }

    } else {
        pbTabs[tabId] = [rootDomain];
    }
}

Browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action == 'extOff') {
        changePbStatus(false);

    }
    else if (message.action == 'extOn') {
        changePbStatus(true);
    }
    else if (message.action == 'addWlist') {
        let domain = utils.getDomain(message.tab.url);
        addwList(domain);

        if (message.tab.id in pbTabs) {
            delete pbTabs[message.tab.id];
        }

        let tabwIndex = pbwTabs.indexOf(message.tab.id);
        if(tabwIndex < 0) {
            pbwTabs.push(message.tab.id);
        }
    }
    else if (message.action == 'removeWlist') {
        let domain = utils.getDomain(message.tab.url);
        removewList(domain);

        let tabwIndex = pbwTabs.indexOf(message.tab.id);
        if(tabwIndex > -1) {
            pbwTabs.splice(tabwIndex, 1);
        }

    }
    else if (message.action == 'optionUpdated') {
        urls = [];
        pbwTabs = [];
        initBackground();

    }
    else if (message.action == 'privacyPopUpBlockedFromContent') {
        addpbTab(sender.tab.id, message.privacyPopUpUrl);

        if (pbSettings['pbShowCount']) {
            updateBadge(pbTabs[sender.tab.id].length, sender.tab.id);
        }

        sendResponse({action: 'ok'});
    }
    else if (message.action == 'getpKillStatus') {
        if (pbSettings['pbRunStatus'] === false) {
            sendResponse({pKillStatus: false});

        } else {
            let isUrlwListed = utils.checkWhiteList(utils.getDomain(message.url), pbSettings['pbWhiteList']);
            sendResponse({pKillStatus: !isUrlwListed});
        }
    }
});

initBackground();