'use strict';

var Browser = chrome || browser, crSettings, utils, crTabs = {}, crwListTabs = [], urls = [];

function initBackground() { utils.getSettings(function(value) {crSettings = value;});}

function updateIcon(status, ctabId) {
    let icon = (status === true) ? 'ui/on.png' : 'ui/off.png';
    if(ctabId === undefined) {Browser.browserAction.setIcon({path: icon});} 
    else {Browser.browserAction.setIcon({path: icon, tabId: ctabId});}
}
function changeMode(level) {
    //console.log(level)
    crSettings['crLevel'] = level;
    utils.setOption('crLevel', level, utils.noop);
}
function changeStatus(status) {
    crSettings['crEnabled'] = status;
    utils.setOption('crEnabled', status, utils.noop);
}

function addwList(url) {
    let isUrlwListed = utils.checkWhiteList(url, crSettings['crWList']);
    if (isUrlwListed) {return;}
    if (crSettings['crWList'] === null) {crSettings['crWList'] = [];}
    crSettings['crWList'].push(url);
    utils.setOption('crWList', crSettings['crWList'], utils.noop);
}

function removewList(url) {
    let isUrlwListed = utils.checkWhiteList(url, crSettings['crWList']);
    if (!isUrlwListed) {return;}
    let urlIndex = crSettings['crWList'].indexOf(url);
    if (urlIndex > -1) {crSettings['crWList'].splice(urlIndex, 1); utils.setOption('crWList', crSettings['crWList'], utils.noop);}
}

function updateBadge(mcount, tabId) {
    Browser.browserAction.setBadgeBackgroundColor({color: "green",tabId: tabId});
    Browser.browserAction.setBadgeText({text: String(mcount),tabId: tabId});
    setTimeout(() => {
        if(tabId in crTabs) {
        crTabs[tabId].push(mcount);
    }}, 2000);
}

function crAddTab(tabId, rootDomain) {
    // console.log(crTabs);
    if(tabId in crTabs) {
        if(crTabs[tabId].indexOf(rootDomain) === -1){crTabs[tabId].push(rootDomain);}
    } 
    else {
        crTabs[tabId] = [rootDomain];
    }
}

Browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    switch (message.action) {
        case 'toggle:disable-extension':    changeStatus(false);    break;
        case 'toggle:enable-extension':     changeStatus(true);     break;
        case 'toggle:change-level':       changeMode(message.level);  break;
        case 'whitelist:add-domain':    {        
                            let domain = utils.getDomain(message.tab.url);
                            addwList(domain);
                            if  (message.tab.id in crTabs) {delete crTabs[message.tab.id];}
                            let tabwIndex = crwListTabs.indexOf(message.tab.id);
                            if  (tabwIndex < 0) {crwListTabs.push(message.tab.id);}
                            }
                            break;
        case 'whitelist:remove-domain': {
                            let domain = utils.getDomain(message.tab.url);
                            removewList(domain);
                            let tabwIndex = crwListTabs.indexOf(message.tab.id);
                            if(tabwIndex > -1) {crwListTabs.splice(tabwIndex, 1);}
                            }
                            break;
        case 'status:retrieve-settings': 
                            {
                            urls = []; crwListTabs = [];
                            initBackground();
                            }
                            break;
        case 'info:retrieve-counter': 
                            {
                            setTimeout(() => {crAddTab(sender.tab.id, message.provider);},2000);
                            //console.log(message.numBlocked);
                            
                            var msgcrLevel = new CustomEvent('msgcrLevel', {detail: {
                                level: crSettings['crLevel']
                              }
                            });
                            //console.log(msgcrLevel);
                            document.dispatchEvent(msgcrLevel);
                            
                            if (crSettings['crCounter']) {updateBadge(message.counter, sender.tab.id);}
                            sendResponse({action: 'ok'});
                            }
                            break;
        case 'signal:extension-status':
                            {
                            if (crSettings['crEnabled'] === false) {sendResponse({extensionStatus: false});}
                            else {let isUrlwListed = utils.checkWhiteList(utils.getDomain(message.url), crSettings['crWList']); sendResponse({extensionStatus: !isUrlwListed});}
                            }
                            break;
    }
});

initBackground();