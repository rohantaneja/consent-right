(function () {

    'use strict';

    let Browser = chrome || browser,
        utils,
        selectElement;

    function loopEls(className, callback) {
        Array.prototype.forEach.call(document.getElementsByClassName(className), callback);
    }

    function initOptionPage() {
        utils = Browser.extension.getBackgroundPage().utils;
        selectElement = document.getElementById('pbWhiteList');

        toggleTab(document.getElementsByClassName('tablinks')[0], 0);
        loopEls('tablinks', addTabClickListener);

        loopEls('opt', (e) => {
            utils.getOption(e.id, function(value) {
                updateOption(e, value);
            });

            if (e.tagName === 'INPUT' && e.getAttribute('type') === 'checkbox') {
                e.addEventListener('click', toggleCheckBox);
            }
        });

        loopEls('btn', (e) => {
            if (e.id === 'pbWhiteListAdd') {
                e.addEventListener('click', addWhiteListDomain);
            }
            else if (e.id === 'pbWhiteListRemove') {
                e.addEventListener('click', removeWhiteListDomain);
            }
        });
    }

    function removeWhiteListDomain() {
        if(selectElement.selectedIndex !== -1) {
            utils.getOption('pbWhiteList', function(value) {
                value.splice(selectElement.selectedIndex, 1);
                utils.setOption('pbWhiteList', value, function() {
                    populateSelect(selectElement, value);
                    notifyBackground();
                });
            });
        }
    }

    function addWhiteListDomain() {
        let wdomainEl = document.getElementById('pbWhiteListDomain');
        let wdomainText = wdomainEl.value.trim();

        if (wdomainText.length) {
            utils.getOption('pbWhiteList', function(value) {

                if (value === null) {
                    value = [];
                }

                wdomainText = utils.getDomain(wdomainText);

                let isUrlwListed = utils.checkWhiteList(wdomainText, value);
                if (isUrlwListed) return;

                value.push(wdomainText);
                utils.setOption('pbWhiteList', value, function() {
                    wdomainEl.value = '';
                    populateSelect(selectElement, value);
                    notifyBackground();
                });

            });
        }
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
        loopEls('tab-cnt', function(e, i) {
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

        loopEls('tablinks', function(el, index) {
            if(index === elIndex) {
                return;
            }
            el.style.backgroundColor = '#eee';
            el.style.borderBottom = '1px solid #ccc';
            toggleContainers(elIndex);

        });
    }

    function notifyBackground() {
        Browser.runtime.sendMessage({action: 'optionUpdated'}, utils.noop);
    }

    initOptionPage();

}());