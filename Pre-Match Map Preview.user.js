// ==UserScript==
// @name Pre-Match Map Preview
// @namespace     http://www.reddit.com/user/happytagpro/
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://maptest.newcompte.fr:*
// @author        happy
// @version       2.2
// ==/UserScript==


//SET PREFERENCES HERE:
extraTime = 1 //increase this if you want more time between when the view zooms in and when the game starts. measured in seconds
showMapName = true  //map name replaces "Games Starting Soon..."
displayTilesUniformly = true 


zoomedOut = false
tagpro.socket.on('time',function(message){
	
	time = message.time/1000

    if (message.state == 3) {
        
        delay = time-extraTime
        if (delay<0) {return}
        
        
       	zoomedOut = true        
        setTimeout(killEnemies,400)

        //store power up tiles
        jukeJuice = tagpro.tiles[6.1]
    	rollingBomb = tagpro.tiles[6.2]
    	tagPro = tagpro.tiles[6.3]
        
		//replace power up tiles with generic ones, I used the fourth, unused power-up tile as my 'generic' tile
        var generic = tagpro.tiles[6.4]
        tagpro.tiles[6.1] = generic
        tagpro.tiles[6.2] = generic
        tagpro.tiles[6.3] = generic
        tagpro.api.redrawBackground()
        
        //previewMap
        setTimeout(previewMap,500)
        
        //when zoomed in, put back power ups and players

        setTimeout(function(){  
            tagpro.viewPort.followPlayer = true
            tagpro.zoom = 1
            zoomedOut = false
            tagpro.spectator = false
            
            tagpro.tiles[6.1] = jukeJuice
            tagpro.tiles[6.2] = rollingBomb
            tagpro.tiles[6.3] = tagPro
            for (id in tagpro.players) {
            	tagpro.players[id].dead = false
            }
            tagpro.api.redrawBackground()   
        },delay*1000)
    }
})

//kill oppoent players when they join (so that you can't see their positions when zoomed out)
tagpro.socket.on('p',function(m){
    if (zoomedOut) {
        if (!!m[0]) {
            if (!!tagpro.playerId) {
				killEnemies()
            }
        }
    }
})
function killEnemies() {
    for (id in tagpro.players) {
        if (tagpro.players[id].team != tagpro.players[tagpro.playerId].team) {
            tagpro.players[id].dead = true
        }
    }
}

//calculate map attributes
tagpro.socket.on("map",function(message){
	mapName=message.info.name
    map = message.tiles
    
    //some maps have a 'padding' of black tiles or wall tiles around them that don't need to be showed when zoomed out, so im finding where the outermost non-wall non-black tiles are.
    earliestRow=1000
	latestRow=-1
    earliestCol=1000
    latestCol=-1
    for (colId in map) {
        for (rowId in map[colId]) {
            if (!(map[colId][rowId] == 0 | map[colId][rowId] == 1 | map[colId][rowId].toString().substr(0,2) == "1.")) {
                earliestRow = Math.min(earliestRow,rowId)
                latestRow = Math.max(latestRow,rowId)
                earliestCol = Math.min(earliestCol,colId)
                latestCol = Math.max(latestCol,colId)       
            }
        }	
    }
    
    //if exact measurements are used, some of the map still gets cut off, so I add a buffer
    buffer = 60
    mapWidth = (latestCol-earliestCol)*40+buffer
    mapHeight = (latestRow-earliestRow)*40+buffer
    centerX = mapWidth/2+earliestCol*40-buffer/2
    centerY = mapHeight/2+earliestRow*40-buffer/2
})

function previewMap() {    

    //viewport dimensions
    viewPortWidth = $('#viewPort').width()
    viewPortHeight = $('#viewPort').height()
    
    //center map
    tagpro.settings.ui.spectatorInfo = false
    tagpro.spectator = true
	tagpro.viewPort.followPlayer = false
    tagpro.viewPort.source = {}
    tagpro.viewPort.source.x = centerX
    tagpro.viewPort.source.y = centerY
    
    //set zoom. 
    perfectFitZoom = Math.max(mapWidth/viewPortWidth,mapHeight/viewPortHeight,1)
    if (displayTilesUniformly) {
        //only certain zoom levels display the tiles uniformly. roundup to the next zoom level
        zoomLevels = [1, 4/3, 5/3, 2, 5/2, 10/3, 4, 5]
        for (id in zoomLevels) {
            if (zoomLevels[id]>perfectFitZoom) {
                tagpro.zoom = zoomLevels[id]
                break
            }
            tagpro.zoom = 5
        }
    } else {
    	tagpro.zoom = perfectFitZoom
    }
}

window.onresize = function (event) {
    if (zoomedOut) {
        setTimeout(previewMap,1000)
    }
} 

//hide 'game starting soon...' alert and or replace with name of map
setTimeout(function(){
    original = tagpro.ui.largeAlert
    tagpro.ui.largeAlert = function (e,t,n,r,i){
        if (r == "Match Begins Soon...") {
            if (showMapName) {
				r=mapName
            } else {
            	r=""
            }
        }
        return original(e,t,n,r,i)
    }
},600)
