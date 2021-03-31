'use strict'

const CMPHandler = function() {
    // let Browser = chrome || browser,utils;
	// utils = Browser.extension.getBackgroundPage().utils;

	const Blocker = {
		list: [
			/* Allow Buttons */
			"(allow,OneTrust Consent,button#onetrust-accept-btn-handler)",
			"(allow,OneTrust Consent,button#accept-recommended-btn-handler)",
			"(allow,Cookie Wall, button[data-testid='cookie-wall-accept'])",
			"(allow,Europa Data Protection,button.edp-cookies-accept)",
			"(allow,GDPR.eu Proton Technologies,a#cn-accept-cookie)",
			//"(allow,Europe Commission,div#ecsi-body-button-participate-now-wrapper)",
			"(allow,Europe Commission,a.wt-cck-btn-add)",
			"(allow,QuantCast CMP,.qc-cmp2-summary-buttons button[mode='primary'])",
			"(allow,QuantCast CMP,.qc-cmp2-buttons-desktop button[mode='primary'])",
			"(allow,Stack Exchange Cookie,.js-accept-cookies)",

			/* Consent Toggles */ 
			"(consent,OneTrust Consent,label.ot-switch)",
			"(consent,QuantCast CMP,.qc-cmp2-toggle-switch button[aria-label='Consent toggle'])",
			"(consent,QuantCast CMP,.qc-cmp2-consent-list)",
			"(consent,Stack Exchange Cookie,.s-toggle-switch)",
			
			/* Legitmate Interests */	
			// '(li,QuantCast CMP,.qc-cmp2-list-item-legitimate div[class="qc-cmp2-toggle-switch"])',

			// Full Removal 
			// "(full,QuantCast CMP, div[data-testid='cookie-wall-modal'])",
			// "(full,QuantCast CMP, .qc-cmp2-container)",
			// "(full,OneTrust Consent, #onetrust-consent-sdk)"
		],

		ruleMatcher : /^!?\(([^|]+)\,([^\]]+)\,(.+)\)$/,
		encounterElements : [],
		encounterProvider : '',
		badgeCounter: 0,

		init : function () {
			let element = document.createElement('style'), provider;
			setTimeout(() => {provider = this.check();}, 2000);
			element.className="consent-right";
			setTimeout(() => {element.textContent = this.hide(provider);}, 2000);
			document.getElementsByTagName('head')[0].appendChild(element);
		},

		check : function() {
			let encounterProvider = '';
			//console.log('encounterProvider');
			for (const item of this.list)	{
				let rule = item.match(this.ruleMatcher);
				if (rule  
					&& 
					document.querySelector(rule[3].trim())) 
					{
					this.encounterElements.push(rule[3].trim());
					this.badgeCounter += document.querySelectorAll(rule[3].trim()).length;
					encounterProvider = rule[2].trim();
					//console.log(encounterProvider);
					this.report(encounterProvider,this.badgeCounter);
				}
			}
			return encounterProvider;
		},

		hide : function(provider) {
			let content = '';
			for (const item of this.list)	{
				let rule = item.match(this.ruleMatcher);
				//console.log(provider);
				if (rule  && rule[2] == provider) {
					switch(rule[1])	{
						case 'full':	{
							//if (level == 1 || level == 3 || level == 5 || level == 7)
							content += this.content.remove(rule[3].trim());
							content += this.content.scroll('body');
						}
						break;
						case 'allow': {
							//if (level == 1 || level == 3 || level == 5 || level == 7)
								content += this.content.remove(rule[3].trim());
						}
						break;
						case 'consent': {
							//if (level == 2 || level == 3 || level == 6 || level == 7)
							content += this.content.remove(rule[3].trim());
						}
						break;
						case 'li': {
							//if (level == 4 || level == 5 || level == 6 || level == 7) {
							content += this.content.remove(rule[3].trim());
							//let objectAll = document.querySelector(rule[3]).textContent;
							//objectAll.innerHTML = "OBJECT ALL";
							//console.log(rule[3].trim());
							//console.log(document.querySelector(rule[3]));
							//console.log(document.evaluate("//button[contains(text(),'OBJECT ALL')]", document.body, null, XPathResult.ANY_TYPE, null));
							//document.evaluate("//button[contains(text(),'OBJECT ALL')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).click();
							//}
						}
						break;
					}
				}
			}
			return content;
		},

		report : function(name,count) {
			let event = new CustomEvent('cmpBlocked', 
			{detail: {cmpName: name, numBlocked: count}});
			document.dispatchEvent(event);
		},

		content : {
			remove : function(element) {
				return element + ' {display: none!important;}' + '\n';
			},
			scroll : function(element) {
				return element + ' {overflow: auto!important;}' + '\n';
			}
		}
	};

    document.addEventListener('DOMContentLoaded', () => {
		console.log('CMP-Handler Activated.')
		Blocker.init();
	});
}();