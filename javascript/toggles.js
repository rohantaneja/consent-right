'use strict'

const CMPHandlerToggles = function() {
    //let Browser = chrome || browser;

	const Blocker = {
		list: [
			/* Consent Toggles */ 
			"(consent,OneTrust Consent,label.ot-switch)",
			"(consent,OneTrust Consent,div.ot-toggle)",
			"(consent,QuantCast CMP,.qc-cmp2-toggle-switch button[aria-label='Consent toggle'])",
			"(consent,QuantCast CMP,.qc-cmp2-consent-list)",
			"(consent,Stack Exchange Cookie,.s-toggle-switch)",
			"(consent,IEEE Cookie Banner,.cc-window)",
			"(consent,Google Consent,button[aria-label='Turn on Search customization'])",
			"(consent,Google Consent,button[aria-label='Turn on YouTube History'])",
			"(consent,Google Consent,button[aria-label='Turn on Ad personalization'])",
			"(consent,Google Consent,button[aria-label='Turn on Ad personalization on Google Search'])",
			"(consent,Google Consent,button[aria-label='Turn on Ad personalization on YouTube & across the web'])"
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

			//console.log(level);
			for (const item of this.list)	{
				let rule = item.match(this.ruleMatcher);
				//console.log(provider);
				if (rule  && rule[2] == provider) {
					content += this.content.remove(rule[3].trim());
				}
			}
			return content;
		},

		report : function(name,count) {
			let event = new CustomEvent('sendcmpinfo', {detail: {provider: name, counter: count}});
			console.log(event);
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