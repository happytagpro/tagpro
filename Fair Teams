// ==UserScript==
// @name		  Fair Teams
// @namespace     http://www.reddit.com/user/happytagpro/
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://maptest.newcompte.fr:*
// @license       WTFPL
// @author        happy
// @version       0.1
// ==/UserScript==


//issues to fix:
//limit frequency of switch team request
//switch teams after game is over


useUnfairTeamsWarning = true //tint the screen slightly when the other team has fewer players then your's does, but the team switching conditions are not met.
automaticallySwitchTeams = false //whenever the conditions are satisfied AND all flags are in base, switch teams
requestSwitch = false //if conditions are met, request that someone on the other team to switch to yours

//ensure that this runs at least once when joining a game
setTimeout(checkConditions,400)

//hide switch team button because you don't need it any more
if (requestSwitch) {$("#switchButton").css("display","none")}

//clear everything when game ends
tagpro.socket.on("end", function(){
    
    checkConditions=function(){}
    $(".unevenTeamsOverlay").remove()
    $(".switchingTeamOverlay").remove()
})

//check team switching requirements if someone leaves/joins the game.
tagpro.socket.on('chat',function(m){
    if (m.message.indexOf(" has joined the ")>-1 | m.message.indexOf("' left the ")>-1 ) {        
        setTimeout(checkConditions,100)
    } 
})

//check team switching requirements if someone scores or drops the flag.
tagpro.socket.on("sound", function(message) {  
    if (["sigh","cheering","drop","friendlydrop"].indexOf(message.s )>-1) {
        setTimeout(checkConditions,100)
    }
});

function checkConditions() {
    //count number of players on each team
    rCount = 0
    bCount = 0
    for (id in tagpro.players) {
        rCount += (tagpro.players[id].team == 1)
        bCount += (tagpro.players[id].team == 2)     
    }
    playerCount = {r:rCount,b:bCount}
    
    //get team colors
    myTeam = tagpro.players[tagpro.playerId].team == 1 ? 'r' : 'b';
    opponentTeam = myTeam == 'r'? 'b' : 'r';
    
    //check conditions for switching teams, tinting, switchteam request
    if (((playerCount[myTeam]-playerCount[opponentTeam]>1) | (playerCount[myTeam]>playerCount[opponentTeam] & tagpro.score[myTeam]>tagpro.score[opponentTeam])) & automaticallySwitchTeams) {
        //only switch if both flags are in base
        if (!(tagpro.ui.blueFlagTaken | tagpro.ui.yellowFlagTakenByRed | tagpro.ui.redFlagTaken | tagpro.ui.yellowFlagTakenByBlue)) {
            tagpro.socket.emit("switch")
            switchingTeamWarning()
        }
    } else if (playerCount[myTeam]>playerCount[opponentTeam]) {
        if (useUnfairTeamsWarning) {
            unevenTeamsWarning("ON")
        }
    } else if ((playerCount[opponentTeam]-playerCount[myTeam]>1) | (playerCount[opponentTeam]>playerCount[myTeam] & tagpro.score[opponentTeam]>tagpro.score[myTeam])) {
        if (requestSwitch) {
            tagpro.socket.emit("chat",{message:"can someone switch teams?",toAll:true})
        }
    } else if (playerCount[myTeam]<=playerCount[opponentTeam]) {
        unevenTeamsWarning("OFF")
    } 
        }

//tint the screen
var unevenTeamsOverlayCSS = {
    height:"100%",
    width:"100%",
    position:"fixed",
    left:0,
    top:0,
    background:"rgba(200,200,200,.4)",
    display:"none"
}
var unevenTeamsOverlay = '<div class="unevenTeamsOverlay"></div>'
$('body').find('#sound').after(unevenTeamsOverlay);    
$(".unevenTeamsOverlay").css(unevenTeamsOverlayCSS)

function unevenTeamsWarning(m) { 
    if (m == "ON") {
        $(".unevenTeamsOverlay").css("display","")	
    } else {
        $(".unevenTeamsOverlay").css("display","none")
    }
}

//message/overlay when switching teams
var switchingTeamOverlayCSS = {
    height:"100%",
    width:"100%",
    position:"fixed",
    left:0,
    top:0,
    background:"rgba(10,10,10,.7)",
    display:"none",
    "text-align":"center",
    "line-height": "300px",
    "font-size":"x-large"
}
var switchingTeamOverlay = '<div class="switchingTeamOverlay"><h3>Switching Teams...</h3></div>'
$('body').find('#sound').after(switchingTeamOverlay);    
$(".switchingTeamOverlay").css(switchingTeamOverlayCSS)

function switchingTeamWarning() {
    $(".switchingTeamOverlay").css("display","")
    setTimeout(function(){$(".switchingTeamOverlay").css("display","none")} , 2000);
}




//tagpro.socket.on("score",function(m){checkConditions()}) 
//list of sound names: burst, alert, cheering, drop, sigh, powerup, pop, click, explosion, countdown, friendlydrop, friendlyalert, go, degreeup, teleport
