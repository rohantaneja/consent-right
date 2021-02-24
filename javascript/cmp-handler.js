'use strict'

const CMPHandler = function() {

	const blocker = {
		list: [
			'[hide|QuantCast CMP] body > div.qc-cmp2-container',
			'[hide|OneTrust Consent] body > div#onetrust-consent-sdk',
		],

		load : function () {
			// Create CSS
			let style = document.createElement('style');
			style.type = 'text/css';
			style.textContent = this.craft();
			document.getElementsByTagName('head')[0].appendChild(style);

			// Detect Blocks
			this.checkLimit = 10;
			this.checkInterval = setInterval(() => {this.check();}, 1000);
			this.check();
		},

		craft : function() {
			let style = '';
			//style += this.style.overflowY('body');

			for (let i = 0; i < this.list.length; i++) {
				let rule = this.list[i].match(/^!?\[([^|]+)\|([^\]]+)\](.+)$/);
				if (rule && this.style.hasOwnProperty(rule[1])) {
					style += this.style[rule[1]](rule[3].trim());
				}
			}

			return style;
		},

		checkLimit : 10,
		checkInterval : null,
		checkBodyOverflow : false,
		checkCache : [],
		check : function() {
			this.checkLimit--;
			for (let i = 0; i < this.list.length; i++) {
				let rule = this.list[i].match(/^\[([^|]+)\|([^\]]+)\](.+)$/);
				if (rule && this.checkCache.indexOf(rule[2].trim()) < 0 && document.querySelector(rule[3].trim())) {
					console.log(`[CMP] Blocked "${rule[2].trim()}"`);
					this.checkCache.push(rule[2].trim());
					this.reportBack(rule[2].trim());
				}
			}
			if (!this.checkBodyOverflow && this.checkCache.length > 0 && document.body.style.overflow.match(/hidden/)) {
				this.checkBodyOverflow = true;
				let style = document.createElement('style');
				style.type = 'text/css';
				style.textContent = this.style.overflowY('body');
				document.getElementsByTagName('head')[0].appendChild(style);
				console.log(`[CMP] Restored page scrolling`);
			}

			if (this.checkLimit <= 0) {
				clearInterval(this.checkInterval);
			}
		},

		reportBack : function(name) {
			let event = new CustomEvent('cmcmplocked', {
				detail: {
					privacyPopUpUrl: name
				}
			});
			document.dispatchEvent(event);
		},

		style : {
			hide : function(identifier) {
				return identifier + ' {display: none!important;}' + '\n';
			},

			overflowY : function(identifier) {
				return identifier + ' {overflow-y: auto!important;}' + '\n';
			},

			normalDisplay : function(identifier) {
				return identifier + ' {' +
					'margin: unset !important;' +
					'overflow: auto!important;' +
					'left: unset !important;' +
					'right: unset !important;' +
					'top: unset !important;' +
					'bottom: unset !important;' +
					'position: unset !important;' +
				'}' + '\n';
			},
		}
	};

	// Load Handler
	let loaded = false;
	let load = () => {
		if (loaded) return;
		loaded = true;
		blocker.load();
	};
	if (document.readyState == 'interactive' || document.readyState == 'complete') {
		load();
	} else {
		window.addEventListener('DOMContentLoaded', load, true);
		window.addEventListener('load', load, true);
	}
}();