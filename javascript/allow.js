'use strict'

const CMPHandlerAllow = function() {

	const Blocker = {
		list: [
			/* Allow Buttons */
			"(allow,OneTrust Consent,button#onetrust-accept-btn-handler)",
			"(allow,OneTrust Consent,#accept-recommended-btn-handler)",
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
			"(allow,DSCH.ie Cookie Modal,button[data-tracking='cc-accept'])"
		],

		ruleMatcher : /^!?\(([^|]+)\,([^\]]+)\,(.+)\)$/,
		encounterElements : [],
		encounterProvider : '',
		badgeCounter: 0,

		init : function () {
			let element = document.createElement('style'), provider;
			setTimeout(() => {
				provider = this.check();
				element.className="consent-right-allow";
				element.textContent = this.hide(provider);
				document.head.appendChild(element);
			}, 2000);
		},

		check : function() {
			let encounterProvider = '';
			for (const item of this.list)	{
				let rule = item.match(this.ruleMatcher);
				if (rule  
					&& 
					document.querySelector(rule[3].trim())) 
					{
					this.encounterElements.push(rule[3].trim());
					this.badgeCounter += document.querySelectorAll(rule[3].trim()).length;
					encounterProvider = rule[2].trim();
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
				if (rule) {
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