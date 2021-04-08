'use strict'

const CMPHandler = function() {
    //let Browser = chrome || browser;

	const Blocker = {
		list: [
			/* Allow Buttons */
			"(allow,OneTrust Consent,button#onetrust-accept-btn-handler)",
			"(allow,OneTrust Consent,button#accept-recommended-btn-handler)",
			"(allow,Cookie Wall, button[data-testid='cookie-wall-accept'])",
			"(allow,Europa Data Protection,button.edp-cookies-accept)",
			"(allow,GDPR.eu Proton Technologies,a#cn-accept-cookie)",
			"(allow,Europe Commission,div#ecsi-body-button-participate-now-wrapper)",
			"(allow,Europe Commission,a.wt-cck-btn-add)",
			"(allow,QuantCast CMP,.qc-cmp2-summary-buttons button[mode='primary'])",
			"(allow,QuantCast CMP,.qc-cmp2-buttons-desktop button[mode='primary'])",
			"(allow,Stack Exchange Cookie,.js-accept-cookies)",
			"(allow,IEEE Cookie Banner,.cc-compliance)",
			"(allow,w3Schools Consent,#accept-choices)",
			"(allow,Google Consent,div[class='jyfHyd'])",

			/* Consent Toggles */ 
			"(consent,OneTrust Consent,label.ot-switch)",
			"(consent,OneTrust Consent,div.ot-toggle)",
			"(consent,QuantCast CMP,.qc-cmp2-toggle-switch button[aria-label='Consent toggle'])",
			//"(consent,QuantCast CMP,.qc-cmp2-consent-list)",
			"(consent,Stack Exchange Cookie,.s-toggle-switch)",
			"(consent,IEEE Cookie Banner,.cc-window)",
			// "(consent,Google Consent,button[aria-label='Turn on Search customization'])",
			// "(consent,Google Consent,button[aria-label='Turn on YouTube History'])",
			// "(consent,Google Consent,button[aria-label='Turn on Ad personalization'])",
			// "(consent,Google Consent,button[aria-label='Turn on Ad personalization on Google Search'])",
			// "(consent,Google Consent,button[aria-label='Turn on Ad personalization on YouTube & across the web'])",
			
			/* Legitimate Interests */	
			'(li,QuantCast CMP,.qc-cmp2-list-item-legitimate div[class="qc-cmp2-toggle-switch"])',

			// Full Removal 
			"(full,QuantCast CMP, div[data-testid='cookie-wall-modal'])",
			"(full,Google Consent,div[role='dialog'])",
			"(full,QuantCast CMP, .qc-cmp2-container)",
			"(full,OneTrust Consent, #onetrust-consent-sdk)"
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
			let content = '', level;
			// document.addEventListener(function (response, sendResponse) {
			// 	console.log(response);
	 		//  });
			// document.addEventListener(function(message, sender, sendResponse) {
			// 	if(message.action == 'message:set-Level')
			// 	console.log(message.level);
	  		// });

			console.log(level);
			for (const item of this.list)	{
				let rule = item.match(this.ruleMatcher);
				//console.log(provider);
				if (rule  && rule[2] == provider) {
					switch(rule[1])	{
						case 'full':	{
							//if (level == 0) {
							content += this.content.remove(rule[3].trim());
							content += this.content.scroll('body');
							//}
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
			let event = new CustomEvent('sendcmpinfo', {detail: {provider: name, counter: count}});
			//console.log(event);
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