'use strict'

const CMPHandlerLI = function() {
    //let Browser = chrome || browser;

	const Blocker = {
		list: [
			/* Legitimate Interests */	
			'(li,QuantCast CMP,.qc-cmp2-list-item-legitimate div[class="qc-cmp2-toggle-switch"])',
			//'(li,OneTrust Consent,.ot-leg-btn-container)'
		],

		ruleMatcher : /^!?\(([^|]+)\,([^\]]+)\,(.+)\)$/,
		encounterElements : [],
		encounterProvider : '',
		badgeCounter: 0,

		init : function () {
			let element = document.createElement('style'), provider;
			setTimeout(() => {
				provider = this.check();
				element.className="consent-right-li";
				element.textContent = this.hide(provider);
				document.head.appendChild(element);
			}, 2000);

		},

		check : function() {
			let encounterProvider = '';
			//console.log('encounterProvider');
			for (const item of this.list)	{
				let rule = item.match(this.ruleMatcher);
				if (rule && document.querySelector(rule[3].trim())) 
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
				if (rule) {
							content += this.content.remove(rule[3].trim());
							var qc_li = setInterval(function()	{
								if(document.querySelector(".qc-cmp2-list-item-legitimate")) {
									document.querySelector(".qc-cmp2-buttons-desktop button[mode='secondary']").click();
									clearInterval(qc_li);
								}
							},1000);
							var ot_li = setInterval(function()	{
								var toggle = document.querySelectorAll(".ot-obj-leg-btn-handler");
								for (var i = 0; i < toggle.length; i++)	{
									toggle[i].click();
								}
								clearInterval(ot_li);
							},1000);
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
		console.log('CMP-Handler for Legitimate Interests Activated.')
		Blocker.init();
	});
}();