(function (window) {

    'use strict';

    let Browser = chrome || browser
    let utils = {

        noop: function() {},

        getDefaultSettings: function() {
            let dfSettings = {};
            dfSettings['pbShowCount'] = true;
            dfSettings['pbShowAlert'] = false;
            dfSettings['pbRunStatus'] = true;
            dfSettings['pbFilters'] = true;
            dfSettings['pbWhiteList'] = [];
            dfSettings['pbUserFilters'] = [];

            return dfSettings;
        },

        getSettings: function(callback) {
            //Browser.storage.local.set({'pbSettings' : {}}, ()=>{});
            //return;
            let self = this;
            Browser.storage.local.get('pbSettings', function(res) {
                if((Object.keys(res).length) === 0) {
                    res = self.getDefaultSettings();
                    self.setSettings(res);
                    callback(res);
                } else {
                    callback(res.pbSettings);
                }
            });

        },

        setSettings: function(settings, callback) {
            callback = (callback === undefined) ? this.noop : callback;
            Browser.storage.local.set({'pbSettings' : settings}, callback);
        },

        clearSettings: function(callback) {
            callback = (callback === undefined) ? this.noop : callback;
            Browser.storage.local.clear(callback);
        },

        setOption: function(option, value, callback) {
            let self = this;
            this.getSettings(function(res) {
                res[option] = value;
                self.setSettings(res, callback);
            });
        },

        getOption: function(option, callback) {
            let self = this;
            this.getSettings(function(res) {
                if(typeof(res[option]) === 'undefined') {
                    let dfSettings = self.getDefaultSettings();
                    res[option] = dfSettings[option];
                    self.setOption(option, dfSettings[option], function() {
                        callback(dfSettings[option]);
                    });
                } else {
                    callback(res[option]);
                }
            });
        },

        cleanArray: function(arr) {
            return arr.map(function(e){
                return e.trim();
            }).filter(function(str) {
                return /^[^#]\S/.test(str);
            });
        },

        isValidFilter: function(filter) {
            return /^.*:\/\/.*\/.*?\*$/.test(filter);
        },

        getDomain: function(url) {
            return (url.split('/')[2] || url.split('/')[0]).split(':')[0];
        },

        getRootDomain: function(url) {
            let domain = this.getDomain(url);

            if (/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(domain) === true) {
                return domain;
            }

            let pieces = domain.split('.');
            return pieces.slice((pieces.length > 2) ? 1 : 0).join('.');
        },

        checkWhiteList: function(url, array) {
            if (array === null) {
                return false;
            } else {
                return (array.indexOf(url) > -1);
            }
        },

        isSpecialTab(tab) {
            return /^((chrome:)|(chrome\-extension:)|(moz\-extension:)|(about:)|(file:)|(blob:)|(data:))/.test(tab.url);
        },

    };

    window.utils = utils;

}(window));