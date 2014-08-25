// ==UserScript==
// @name Immersion Mode + Minimalist Tools
// @namespace     http://www.reddit.com/user/happytagpro/
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://maptest.newcompte.fr:*
// @author        happy
// @version       0.1
// ==/UserScript==

/////////////////////////////////////////////////////////////////////////////////////
//fullscreen

//add button
$('#sound').css('width','32px')
$('#sound').css('height','96px')
var button = '<div id="full" onclick="tagpro.goFullscreen(); return false"></div>'
$('#soundEffects').before(button)
$('#full').css('background', 'transparent url(http://i.imgur.com/oJew5H6.png) no-repeat top left')
$('#full').css('width','32px')
$('#full').css('height','32px')
$('#full').css('cursor','pointer')
$('#full').css('width','32px')
$('#full').css('display','inline-block')

//go into immersion mode
tagpro.goFullscreen = function goFullscreen() {
    
    //make page fullscreen
    var element = document.getElementsByTagName("html")[0];
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
        
    //hide page elements
    $('#full').css('display','none')
    $('#exit').css('display', 'none')
    $('#recordButton').css('display', 'none')
    $('#soundEffects').css('display', 'none')
    $('#soundMusic').css('display', 'none')
    $('#donate').css('display', 'none')
    $('#viewPort').css('border', 'none') 
    $('html').css('background','black')  
}


//add  keyboard shortcut for options access in fullscreen. exit immersion mode when esc is pressed
window.addEventListener('keydown', function (e) {
    
    if (e.keyCode == 192) {
        tagpro.showOptions()
    } else if (e.keyCode == 27) {
        tagpro.showOptions()        
        $('#full').css('display','')
        $('#exit').css('display', '')
        $('#recordButton').css('display', '')
        $('#soundEffects').css('display', '')
        $('#soundMusic').css('display', '')
        $('#donate').css('display', '')
        $('#viewPort').css('border', '10px solid white') 
        $('html').css('background','black url("/images/background.jpg")')
        
        
    } else if (e.keyCode == 16) {
        if (!document.webkitIsFullScreen) {
        	tagpro.goFullscreen()
        }
    } else if (e.keyCode == 32) {
        if (!tagpro.disableControls) {
            $('#recordButton').click()
        }
    }
}, false);


////////////////////////////////////////////////////////////////////////////////////////
//Minimalist Tools

hideFlair = true
hideSplats = true
hideFlagState = true
hideClock = false
hideScore = false
royalBallTexturePack = true
hideRedditLink = true
hideStatsPageAtEndOfGame = true


if (hideFlair) {document.getElementById("flair").src = "http://i.imgur.com/rLZaA6R.png"}
if (hideSplats) {document.getElementById("splats").src = "http://i.imgur.com/rLZaA6R.png"}
if (hideClock) {setTimeout(function(){tagpro.ui.timer = function (e,t,n,r){}},1000)}
if (hideFlagState) {setTimeout(function(){tagpro.ui.flags = function (e,t,n){}},1000)}
if (hideScore) {setTimeout(function(){tagpro.ui.scores = function (e,t,n){}},1000)}
if (hideRedditLink) {$(".redditLink").css("display","none")}

if (royalBallTexturePack) {
    document.getElementById("tiles").src = "http://i.imgur.com/b4eBtuX.png";
    document.getElementById("speedpadred").src = "http://i.imgur.com/lWXSKoo.png";
    document.getElementById("speedpadblue").src = "http://i.imgur.com/5876wwX.png"; 
    document.getElementById("speedpad").src = "http://i.imgur.com/m7G49AS.png";
    document.getElementById("portal").src = "http://i.imgur.com/V8EwICD.png";
    //tagpro.tiles.image.src = "http://i.imgur.com/b4eBtuX.png";

    
}

tagpro.socket.on("settings", function(message) {    
    tagpro.settings.ui.allChat = true
    tagpro.settings.ui.systemChat = true
    tagpro.settings.ui.teamChat = true
    tagpro.settings.ui.groupChat = true
    tagpro.settings.ui.degrees = false
    tagpro.settings.ui.names = false
    tagpro.settings.ui.performanceInfo = false //ping and fps
    tagpro.settings.ui.spectatorInfo = false
    tagpro.settings.ui.matchState = true //time, score, AND flag state
});
/*
if (!tagpro.settings.ui.allChat & !tagpro.settings.ui.teamChat) {
}

setTimeout(function(){
    tagpro.players[tagpro.playerId].name = "chatOFssdsdf"
    tagpro.showOptions()
    tagpro.showOptions()
    rename = $("#name")
    rename.select()
    rename.change()
},3000)

setTimeout(function(){
    window.onbeforeunload = function (event) {
        tagpro.players[tagpro.playerId].name = "happy"
        tagpro.showOptions()
        tagpro.showOptions()
        rename = $("#name")
        rename.select()
        rename.change()
    }
},5000) */


tagpro.ui.performanceInfo = function (e,t,n,r){console.log(r); tagpro.prettyText((tagpro.fps<50?" FPS: "+tagpro.fps:"")+(tagpro.ping.avg>100?" Ping: "+tagpro.ping.avg:"")+(r?" Loss: "+r+"%":""),10,10)}




tagpro.socket.on("end",function(m){
    if (hideStatsPageAtEndOfGame) {
        document.getElementById("options").style.display = "none"
    }
})

/*
tagpro.ui.timer = function (e,t,n,r){
    s = parseInt(r.substr(-2))
    alpha =(s/90)*(s/90)+.55
    e.save(),e.textAlign="center",e.fillStyle="rgba(255, 255, 255, 1)",e.strokeStyle="#000000",e.lineWidth=4,e.font="bold 30pt Arial",e.strokeText(r,t.x,n.height-25),e.fillText(r,t.x,n.height-25),e.globalCompositeOperation="destination-out",e.globalAlpha=alpha,e.fillRect(0,0,n.width,n.height),e.restore()} 
*/
