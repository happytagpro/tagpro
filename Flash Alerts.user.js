// ==UserScript==
// @name Flash Alerts
// @namespace     http://www.reddit.com/user/happytagpro/
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://maptest.newcompte.fr:*
// @license       WTFPL
// @author        happy
// @version       0.3
// ==/UserScript==

//add sound names to lists on line 32 and 34 to get flashes for additional sounds besides scoring
var	FlashDuration = 250; //in milliseconds

//add overlay to page and set CSS
$("body").find("#sound").after('<div class="overlay"></div>');
var overlayCSS = {
    height:"100%",
    width:"100%",
    position:"fixed",
    background:"rgba(0,0,0,0)"
}
$(".overlay").css(overlayCSS)

//when a sound is played, a message is sent as the arguement of function(message) 
tagpro.socket.on("sound", function(message) {
    
    //the screen will flash a certain color, depending on what sound is played.
    //list of sound names: burst, alert, cheering, drop, sigh, powerup, pop, click, explosion, countdown, friendlydrop, friendlyalert, go, degreeup, teleport
    //you can add these sound names into the if/ else if statments if you want flashes to occur when they play. 
    sound = message.s   
    if (["cheering","placeholder"].indexOf(sound)>-1) {
        flashColor(tagpro.players[tagpro.playerId].team == 1 ? "red" : "blue") //flash your team color
    } else if (["sigh","placeholder"].indexOf(sound)>-1) {
        flashColor(tagpro.players[tagpro.playerId].team == 1 ? "blue" : "red") //flash opponent team color
    }
});

// change overlay to either blue or red depending on who scored, then revert overlay to transparent
// you could potentially add on to the if/else if statment to flash additional colors 
function flashColor(c) { 
    if (c == "red") {
        $(".overlay").css("background","rgba(200,0,0,0.5)")
    } else if (c == "blue") {
        $(".overlay").css("background","rgba(0,0,200,0.5)")
    }
    setTimeout(function(){$('.overlay').css("background","rgba(0,0,0,0)")}, FlashDuration);
}
