'use strict';

const Dashboard = function () {

    function loopEls(className, callback) {
        Array.prototype.forEach.call(document.getElementsByClassName(className), callback);
    }
    
    let Browser = chrome || browser, utils = Browser.extension.getBackgroundPage().utils, selectElement = document.getElementById('crWList');

    function initOptionPage() {
        
        toggleTab(document.getElementsByClassName('nav-item')[0], 0);
        loopEls('nav-item', addTabClickListener);

        loopEls('opt', (e) => {
            utils.getOption(e.id, function(value) {
                updateOption(e, value);
            });

            if (e.tagName === 'INPUT' && e.getAttribute('type') === 'checkbox') {
                e.addEventListener('click', toggleCheckBox);
            }
        });

        loopEls('btn', function(e) {
            if(e.id === 'crSaveUserFilters') {
                e.addEventListener('click', saveUserFilters);

            } else if(e.id === 'crWhiteListAdd') {
                e.addEventListener('click', addWhiteListDomain);

            } else if(e.id === 'crWhiteListRemove') {
                e.addEventListener('click', removeWhiteListDomain);
            }
        });
    }

    function removeWhiteListDomain() {
        if(selectElement.selectedIndex !== -1) {
            utils.getOption('crWList', function(value) {
                value.splice(selectElement.selectedIndex, 1);
                utils.setOption('crWList', value, function() {
                    populateSelect(selectElement, value);
                    notifyBackground();
                });
            });
        }
    }

    function addWhiteListDomain() {
        let wdomainEl = document.getElementById('crWhiteListDomain');
        let wdomainText = wdomainEl.value.trim();

        if (wdomainText.length) {
            utils.getOption('crWList', function(value) {
                if (value === null) {
                    value = [];
                }

                wdomainText = utils.getDomain(wdomainText);

                let isUrlwListed = utils.checkWhiteList(wdomainText, value);
                if (isUrlwListed) return;

                value.push(wdomainText);
                utils.setOption('crWList', value, function() {
                    wdomainEl.value = '';
                    populateSelect(selectElement, value);
                    notifyBackground();
                });

            });
        }
    }

    function saveUserFilters() {
        let flistElement = document.getElementById('crUserFilters'),
            dlist;

        flistElement.addEventListener('click', function() {
            flistElement.style.borderColor = '#ccc';
        });

        if(flistElement.value.length) {
            dlist = utils.cleanArray(flistElement.value.split('\n'));
            let prop;
            for(prop in dlist) {
                if(!utils.isValidFilter(dlist[prop])) {
                    flistElement.style.borderColor = '#d86161';
                    return;
                }
            }

        } else {
            let dfs = utils.getDefaultSettings();
            dlist = dfs['crUserFilters'];
        }
        utils.setOption('crUserFilters', dlist, function() {
            flistElement.style.borderColor = '#98af63';
            notifyBackground();
        });
    }

    function toggleCheckBox(e) {
        let targetElement = e.target;
        utils.setOption(targetElement.id, targetElement.checked, function() {
            notifyBackground();
        });
    }

    function populateSelect(e, value) {
        e.innerHTML = '';
        let prop;
        for(prop in value) {
            let optTag = document.createElement("option");
            optTag.value = prop;
            optTag.appendChild(document.createTextNode(value[prop]));
            e.appendChild(optTag);
        }
    }

    function updateOption(e, value) {
        if(e.tagName === 'INPUT' && e.getAttribute('type') === 'checkbox') {
            e.checked = value;

        } else if(e.tagName === 'TEXTAREA') {
            if(value !== null) {
                e.value = value.join('\n');
            }

        } else if (e.tagName === 'SELECT') {
            populateSelect(e, value);

        }
    }

    function addTabClickListener(el ,index) {
        el.addEventListener('click', function () {
            toggleTab(el, index);
        });
    }

    function toggleContainers(activeIndex) {
        loopEls('content-containers', function(e, i) {
            if(i === activeIndex) {
                e.style.display = 'block';
            } else {
                e.style.display = 'none';
            }
        });
    }

    function toggleTab(elm, elIndex) {
        elm.style.backgroundColor = '#fff';
        elm.style.borderBottom = '1px solid #fff';

        loopEls('nav-item', function(el, index) {
            if(index === elIndex) {
                return;
            }
            el.style.backgroundColor = '#18191A';
            el.style.borderBottom = '1px solid #18191A';
            toggleContainers(elIndex);

        });
    }

    function notifyBackground() {
        Browser.runtime.sendMessage({action: 'status:retrieve-settings'}, utils.noop);
    }

    initOptionPage();

}();