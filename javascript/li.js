'use strict'

const CMPHandlerLI = function() {
    //let Browser = chrome || browser;

	const Blocker = {
		list: [
			/* Legitimate Interests */	
			'(li,QuantCast CMP,.qc-cmp2-list-item-legitimate div[class="qc-cmp2-toggle-switch"])'
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
							content += this.content.remove(rule[3].trim());
							//let objectAll = document.querySelector(rule[3]).textContent;
							//objectAll.innerHTML = "OBJECT ALL";
							//console.log(rule[3].trim());
							//console.log(document.querySelector(rule[3]));
							//console.log(document.evaluate("//button[contains(text(),'OBJECT ALL')]", document.body, null, XPathResult.ANY_TYPE, null));
							//document.evaluate("//button[contains(text(),'OBJECT ALL')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).click();
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