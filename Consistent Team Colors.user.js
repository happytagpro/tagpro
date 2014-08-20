// ==UserScript==
// @name Consistent Team Colors
// @namespace     http://www.reddit.com/user/happytagpro/
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://maptest.newcompte.fr:*
// @license       WTFPL
// @author        happy
// @version       0.2.3
// ==/UserScript==

//Set your team color and other preferences here:
teamColor = 'blue'
translateWords = false //when colors tiles are switched, swap the words 'red' and 'blue' in chat, system messages are always swapped
useBackgroundWarnings = true
useFlashAlertsForScoring = true


opponentColor = teamColor == 'blue' ? 'red' : 'blue'; 
tagpro.switchedColors = false
colorId = {red:1, blue:2}
teamId = 0



function checkTeam() {
    
    //wait until you'be been assigned to a team and the tiles have been loaded. 
    if (!tagpro.players[tagpro.playerId] | !tagpro.tiles) {
        return setTimeout(checkTeam,10)
    }
    
    //if the team color you've been assigned to is different from your preference, switch team colored tiles
    teamId = tagpro.players[tagpro.playerId]['team']
    if (teamId  != colorId[teamColor]) {
        tagpro.switchedColors = true
        switchTiles()
    }    
}
checkTeam()






//switch tiles back if you switch teams
tagpro.socket.on('chat',function(m){
    if (m.message.indexOf("has switched to the")>-1) {        
        setTimeout(function() {
            if (teamId != tagpro.players[tagpro.playerId]['team']) {
                teamId = tagpro.players[tagpro.playerId]['team']
                switchTiles()
                tagpro.switchedColors = !tagpro.switchedColors 
            }
        },200)
    }
})

function switchTiles() {
    //store red tiles temporarily
    rFlag = tagpro.tiles[3]
    rEmptyFlag = tagpro.tiles[3.1]
    rSpeedPad = tagpro.tiles[14]
    rEmptySpeedPad = tagpro.tiles[14.1]
    rGate = tagpro.tiles[9.2]
    rZone = tagpro.tiles[17]
    rTeam = tagpro.tiles[11]
    rBall = tagpro.tiles['redball']
    rFlag2 = tagpro.tiles['redflag']
    
    //set red tiles equal to blue tiles
    tagpro.tiles[3] = tagpro.tiles[4]
    tagpro.tiles[3.1] = tagpro.tiles[4.1]
    tagpro.tiles[14] = tagpro.tiles[15]
    tagpro.tiles[14.1] = tagpro.tiles[15.1]
    tagpro.tiles[9.2] = tagpro.tiles[9.3]
    tagpro.tiles[17] = tagpro.tiles[18]
    tagpro.tiles[11] = tagpro.tiles[12]
    tagpro.tiles['redball'] = tagpro.tiles['blueball']
    tagpro.tiles['redflag'] = tagpro.tiles['blueflag']
    
    //set blue tiles equal to red tiles that were stored earlier
    tagpro.tiles[4] = rFlag
    tagpro.tiles[4.1] = rEmptyFlag
    tagpro.tiles[15] = rSpeedPad
    tagpro.tiles[15.1]= rEmptySpeedPad
    tagpro.tiles[9.3] = rGate
    tagpro.tiles[18] = rZone
    tagpro.tiles[12] = rTeam
    tagpro.tiles['blueball'] = rBall
    tagpro.tiles['blueflag'] = rFlag2
    
    tagpro.api.redrawBackground()
}


//switch score colors and position
tagpro.ui.scores = function (e,t,n){
    if (tagpro.switchedColors) {
        color1 = "rgba(0, 0, 255, .5)"
        color2 = "rgba(255, 0, 0, .5)"
        X = -1
    } else {
        color2 = "rgba(0, 0, 255, .5)"
        color1 = "rgba(255, 0, 0, .5)"
        X=1
    }
    e.save(),e.textAlign="center",e.fillStyle=color1,e.font="bold 40pt Arial",e.fillText(tagpro.score.r,t.x-120*X,n.height-50),e.fillStyle=color2,e.fillText(tagpro.score.b,t.x+120*X,n.height-50),e.restore()} 

//switch flag state positions
tagpro.ui.flags = function (e,t,n){
    if (tagpro.switchedColors) {
    	yellowLeft = 120
        yellowRight = -160
        red = -120
        blue = 80
    } else {
    	yellowLeft = -160
        yellowRight = 120
        red = 80
        blue = -120
    }
    tagpro.ui.redFlagTaken&&(e.globalAlpha=.75,tagpro.tiles.draw(e,"redflag",{x:t.x+red,y:n.height-50},30,30)),tagpro.ui.blueFlagTaken&&(e.globalAlpha=.75,tagpro.tiles.draw(e,"blueflag",{x:t.x+blue,y:n.height-50},30,30)),tagpro.ui.yellowFlagTakenByRed&&(e.globalAlpha=.75,tagpro.tiles.draw(e,"yellowflag",{x:t.x+yellowLeft,y:n.height-50},30,30)),tagpro.ui.yellowFlagTakenByBlue&&(e.globalAlpha=.75,tagpro.tiles.draw(e,"yellowflag",{x:t.x+yellowRight,y:n.height-50},30,30)),e.globalAlpha=1} 


//switch winning alert color/message
tagpro.socket.on("end", function(){
    originalAlert = tagpro.ui.largeAlert
    tagpro.ui.largeAlert = function (e,t,n,r,i){
        if (tagpro.switchedColors) {
            switch(r) {
                case "Blue Team Wins!":
                    r = "Red Team Wins!"
                    i = "#ff0000"
                    break;
                case "Red Team Wins!":
                    r = "Blue Team Wins!"
                    i = "#0000ff"    
                    break;
            }
        }
        return originalAlert(e,t,n,r,i)
    }
})

//swap colors and words in chat, taken from NewCompte script
prettyTextOriginal = tagpro.prettyText
tagpro.prettyText= function(e,t,n,r,s,o,u) {
    
    if (tagpro.switchedColors) {
        //swap the words 'red' and 'blue' in chat. used placeholders so that a message with both words will still be switched properly
        //always swap words for system messages.
        if (e.indexOf("team")>-1 & (e.indexOf("has switched to the")>-1 | e.indexOf("has joined the")>-1 | e.indexOf("left the")>-1)) {
        	e=e.replace(/blue/gi, "placeHolderForBlue");
            e=e.replace(/red/gi, "placeHolderForRed");
            e=e.replace("placeHolderForBlue", "red");
            e=e.replace("placeHolderForRed", "blue");
        } else if (translateWords) {
        	e=e.replace(/blue/gi, "placeHolderForBlue");
            e=e.replace(/red/gi, "placeHolderForRed");
            e=e.replace("placeHolderForBlue", "red");
            e=e.replace("placeHolderForRed", "blue");
        }
         
        //swap colors
        switch(r) {
            case "#FFB5BD":
                r = "#CFCFFF";
                break;
            case "#CFCFFF":
                r = "#FFB5BD";
                break;
        }
    }
    return prettyTextOriginal(e,t,n,r,s,o,u)
}


//swap colors in stats
// @name          Tagpro Color Switcher
// @namespace     http://www.reddit.com/user/NewCompte
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://maptest.newcompte.fr:*
// @license       WTFPL
// @author        NewCompte, slightly modified by happy
// @version       0.28

function myColorBlindScript () {
    var dummyred = document.createElement("div");
    dummyred.id = "dummyred";
    dummyred.style.display = "none";
    document.body.appendChild(dummyred);
    $('#dummyred').css("color", "#FFB5BD");
    var redstyle = $('#dummyred').css("color");
    var dummyblue = document.createElement("div");
    dummyblue.id = "dummyblue";
    dummyblue.style.display = "none";
    document.body.appendChild(dummyblue);
    $('#dummyblue').css("color", "#CFCFFF");
    var bluestyle = $('#dummyblue').css("color");
    var drawOptions = false;
    tagpro.showOptions = function () {
        if (drawOptions) {
            drawOptions = false;
            $("div#options").hide(), $("#name").blur();
        } else {
            drawOptions = true;
            var e = $("div#options");
            e.find("#name").val(tagpro.players[tagpro.playerId].name),e.css({left:$(document.body).width()/2-e.width()/2,top:$(document.body).height()/2-e.height()/2});
            var t = function () {
                //console.log("in the function that updates stats, drawOptions="+drawOptions);
                var r=e.find("tbody.stats"),
                    i=r.find("tr.template"),
                    s=[];
                r.find("tr").not(".template").remove();
                for (var o in tagpro.players) s.push(tagpro.players[o]);
                s.sort(function(e,t){return t.score-e.score}),
                    s.forEach(function(e) {
                        var t=i.clone().removeClass("template").appendTo(r).find("td");
                        if (tagpro.switchedColors) {
                            color = e.team==1?"#CFCFFF":"#FFB5BD"
                        } else {
                            color = e.team==2?"#CFCFFF":"#FFB5BD"
                        }
                        
                        t.eq(0).find(".scoreName").text(e.name).css("color",color).end().find(".scoreAuth").html(e.auth?"&#x2713;":"").end(),t.eq(1).text(e.score),t.eq(2).text(e["s-tags"]),t.eq(3).text(e["s-pops"]),t.eq(4).text(e["s-grabs"]),t.eq(5).text(e["s-drops"]),t.eq(6).text(tagpro.helpers.timeFromSeconds(e["s-hold"],!0)),t.eq(7).text(e["s-captures"]),t.eq(8).text(tagpro.helpers.timeFromSeconds(e["s-prevent"],!0)),t.eq(9).text(e["s-returns"]),t.eq(10).text(e["s-support"]),t.eq(11).text(e["points"]==null?"-":e.points),
                            t.find("a.kick").attr("href",e.id)
                    }),
                        drawOptions&&setTimeout(t,1e3)
            };
            drawOptions&&t();
            e.show();
        }
    };        
}

var source = "(" + myColorBlindScript + ")()";
var thescript = document.createElement('script');
thescript.setAttribute("type", "application/javascript");
thescript.textContent = source;
document.body.appendChild(thescript);







////////////////////////////////////////////////////////////////////////////////////////////
//OPTIONAL ADD-ONS


////////////////////////////////////////////////////////////////////////////////////////////
//background warning

if (useBackgroundWarnings) {
    var previousFlagStateHash = 4;
    var colorIntensity = 127;
    tagpro.socket.on("p", function(m) { 
        
        if (tagpro.switchedColors) {
            blueTeamHasFlag = tagpro.ui.blueFlagTaken | tagpro.ui.yellowFlagTakenByRed
            redTeamHasFlag = tagpro.ui.redFlagTaken | tagpro.ui.yellowFlagTakenByBlue
            
        } else {
            redTeamHasFlag = tagpro.ui.blueFlagTaken | tagpro.ui.yellowFlagTakenByRed
            blueTeamHasFlag = tagpro.ui.redFlagTaken | tagpro.ui.yellowFlagTakenByBlue
        }
        
        currentHash = redTeamHasFlag + blueTeamHasFlag*2
        if (previousFlagStateHash != currentHash) {
            previousFlagState = currentHash
            color = 'rgb('+colorIntensity*redTeamHasFlag.toString()+',0,'+colorIntensity*blueTeamHasFlag.toString()+')'
            $("html").css('background', color)
        } 
    });
}


////////////////////////////////////////////////////////////////////////////////////////////
//flash alerts for scoring or other sounds.

if (useFlashAlertsForScoring) {
    
    var	FlashDuration = 300; //in milliseconds
    
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
        //you can add these sount names to into the if/ else if statments if you want flashes to occur when they play. 
        sound = message.s   
        if (["cheering"].indexOf(sound)>-1) {
            flashColor(teamColor)
        } else if (["sigh"].indexOf(sound)>-1) {
            flashColor(opponentColor)
        }
    });
    
    // change overlay to either blue or red depending on who scored, then revert overlay to transparent
    // you could potentially add on to the if else statment to flash additional colors 
    function flashColor(c) { 
        if (c == "red") {
            $(".overlay").css("background","rgba(200,0,0,0.5)")
        } else if (c == "blue") {
            $(".overlay" ).css("background","rgba(0,0,200,.5)")
        }
        setTimeout(function(){$('.overlay').css("background","rgba(0,0,0,0)")}, FlashDuration);
    }

}
