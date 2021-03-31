<div align="center"><img alt="Logo" src="https://raw.githubusercontent.com/rohantaneja/ConsentRight/main/ui/128.png" width="100" /></div>
<p align="center">Consent<b>Right</b> is a Cross-Browser Web Extension to gain control over consent choices.</p>
<p align="center">
  <a href="" target="_blank">
    <img src="https://raw.githubusercontent.com/rohantaneja/ConsentRight/main/ui/preview.png" alt="Preview" />
  </a>
</p>

### Problem Statement
The consent dialogues are a persistent annoyance to the web. The manipulative practices in terms of complexity in language, blocking access to the webpage or pre-selected choices used by several CMP providers often lead deceiving a user to disregard and agree to data collection. 

Despite the regulations, several web services continue to mislead and register positive consent even when a user has opted out or made a choice for not sharing their data.
The end-user has to make an explicit and informed choice to allow sharing their data to participating third-party tracking services on the website.

### Solution
To target the problematic part in the consent dialogues that violates the compliance with the GDPR. I have developed a browser extension to remove select elements which are responsible for storing positive consent to all user data and provide its users' granular control over their consent choices.

### Installation
##### Chrome / Chromium
1. Download the ZIP file of Consent Right on your computer.
2. Unzip the ZIP file you just downloaded on your computer.
3. Open Chrome and enter the following URL in your tab bar: chrome://extensions/
4. Enable Developer mode in the top right.
5. Click "Load unpacked"
6. Choose the `ConsentRight-main` folder on your computer.
7. Visit websites with provisional rules and test it out.

##### Firefox
On Firefox, out-of-store addons can only be loaded for the duration of the session (you will have to redo these steps if you close your browser).
1. Download the ZIP file of Consent Right on your computer.
2. Unzip the ZIP file you just downloaded on your computer.
3. Open Firefox and enter the following URL in your tab bar: about:debugging#/runtime/this-firefox
4. Click "Load temporary addon"
5. Choose the `manifest.json` file in the `ConsentRight-main` folder on your computer.
6. Visit websites with provisional rules and test it out.

#### Notes
You can find functionality updates [here](https://github.com/rohantaneja/ConsentRight/projects). 

The project itself includes the list of contributors and references. I currently am working on documentation and improving few features which aren't working as expected.

#### You Made It To The End.
