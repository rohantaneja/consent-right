'use strict'

const CMPHandlerFull = function() {
    //let Browser = chrome || browser;

	const Blocker = {
		list: [
			/* Full Removal */
			"(full,OneTrust Consent, #onetrust-consent-sdk)",
			"(full,OneTrust Consent, #onetrust-banner-sdk)",
			"(full,Google Consent,div[role='dialog'])",
			"(full,QuantCast CMP, div[data-testid='cookie-wall-modal'])",
			"(full,QuantCast CMP, .qc-cmp2-container)",
			"(full,DSCH.ie Cookie Modal, #js-cookie-consent)",
			"(full,StackOverFlow Consent, .js-consent-banner)",
			"(full,Didomi, #didomi-popup)",
			"(full,Facebook Consent, div[data-testid='cookie-policy-dialog'])",
			"(full,TrustArc, div[class='truste_overlay'])",
			"(full,VK Consent, .cookies_policy_wrap)"
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
			let encounterProvider = 'None';
			for (const item of this.list)	{
				let rule = item.match(this.ruleMatcher);
				if (rule  
					&& document.querySelector(rule[3].trim())) {
					this.encounterElements.push(rule[3].trim());
					this.badgeCounter += document.querySelectorAll(rule[3].trim()).length;
					encounterProvider = rule[2].trim();
					this.report(encounterProvider,this.badgeCounter);
				}
			}
			return encounterProvider;
		},

		hide : function(provider) {
			let content = '\n';
			for (const item of this.list)	{
				let rule = item.match(this.ruleMatcher);
				if (rule) {
							content += this.content.remove(rule[3].trim());
				}
			}
			content += this.content.scroll('body'); // restore scroll
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
				return element + ' {overflow: auto!important;}';
			}
		}
	};

    document.addEventListener('DOMContentLoaded', () => {
		console.log('CMP-Handler for Consent Dialogues Activated.')
		Blocker.init();
	});
}();