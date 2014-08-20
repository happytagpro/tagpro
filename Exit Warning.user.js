// ==UserScript==
// @name		  Exit Warning
// @namespace     http://www.reddit.com/user/happytagpro/
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://maptest.newcompte.fr:*
// @license       WTFPL
// @author        happy
// @version       0.1
// ==/UserScript==

setTimeout(function(){
    window.onbeforeunload = function (event) {
    	if (tagpro.state == 1) {
        	return 'Sure you want to leave?'
      	}
    }
},5000)
