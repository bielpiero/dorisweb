


var controlStatus = 0;            //global variable for controlling if user has the control of DOris or not


var message_websocket_recibed ;           //global variable which stores messages recibed from Doris

var filesadded = ""; //list of files already added for controlling no to add a script two times
var rtPackages;  //var for storing second websocket


// websockets.....................................................................................................................................

if (window.WebSocket === undefined) {

    alert("sockets not supported");

    state.className = "fail";
}
else {
    if (typeof String.prototype.startsWith != "function") {
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) == 0;
        };
    }

    window.addEventListener("load", onLoad, false);
}

function onLoad() {

    log = document.getElementById("log");
    state = document.getElementById("status");

    var wsUri = "ws://192.168.1.101:14004";
    websocket = new WebSocket(wsUri);
    websocket.onopen = function (evt) { onOpen(evt) };
    websocket.onclose = function (evt) { onClose(evt) };
    websocket.onmessage = function (evt) { onMessage(evt) };
    websocket.onerror = function (evt) { onError(evt) };

}

function onOpen(evt) {
    state.className = "success";
    addMessage(127, '');
    //  state.innerHTML = "Connected to server";
}

function onClose(evt) {
    state.className = "fail";
    // state.innerHTML = "Not connected";
    //connected.innerHTML = "0";
}

function onMessage(evt) {

    var cad = evt.data;
    var obj;



    var opcode = cad.charCodeAt(0);
    var message = cad.slice(1);
    message_websocket_recibed = message;

    log.innerHTML = '<li class="message">' + cad + "</li>" + log.innerHTML;


    switch (opcode) {
        case 0:
            expressions_ListExpressions();
            
            break;
        case 1: 
            loadProgramsList(message);
            break;
        case 12:
            arm_expressions_ListExpressions();
            break;
        case 19:
        obj = JSON.parse(message);
        if (obj.robot.error === "Permission denied.") 
                alert("Tiene que tener el control.");
            break;
        case 20:
        obj = JSON.parse(message);
        if (obj.robot.error === "Permission denied.") 
                alert("Tiene que tener el control.");
            break;

        case 21:
            loadMenuMap(1);
            break;
        case 22:
        obj = JSON.parse(message);
            

             

            if (obj.robot.error === "Permission denied.") {
                alert("Tiene que tener el control.");
                var room_number = parseInt(room_selected, 10);  //Cogemos la escala aqui tambien aunque no tengamos el control, para asi dibujar donde se encuentra DOris
                scaleSVG.x = document.getElementById("mySVG").getBBox().width / parseInt(room_properties.width[room_number], 10);
                scaleSVG.y = document.getElementById("mySVG").getBBox().height / parseInt(room_properties.height[room_number], 10);

            }
            else if (obj.robot.error === "None.") {
                alert(selected_map.nameSector.concat(" cargado con éxito."));
            }
            ///    Cargar o no cargar todos las caracteristicas del mapa dependiendo de si tenemos el control ///



            ///Si es positivo llamamos a features///
            

            break;
        case 23: //We load landmarks
            selected_map.landmarks = StringTo_Object(message_websocket_recibed);
            addMessage(24, selected_map.idMap.concat(",", selected_map.idSector));
            //we call features
    
            break;
        case 24:
            selected_map.features = StringTo_Object(message_websocket_recibed);
            addMessage(25, selected_map.idMap.concat(",", selected_map.idSector));




            break;
        case 25: //we load sites
            selected_map.sites = StringTo_Object(message_websocket_recibed);
            loadMenuMap(2);



          // getFeaturesAndSites(map_points.sites);
          //  makeMenuProperties(); //We make the menu 
          //   DrawPoints();
            break;
       /*case 27:
            siteAdded(message);
            break;*/
        case 34:
            // MakeMenuRooms();
            loadMenuMap(0);
            break;

        case 124:
            notifyMe(message);
            break;
        case 125:
            changeControlStatus(message);
            //log.innerHTML = '<li class="message"> case 125: ' + message + "</li>" + log.innerHTML; 
            break;
        case 126:
            releaseControlStatus(message);
            break;
        case 127:
            processRTP(message);
            break;

    
        default:

            break;
    }








    connected = document.getElementById("connected");
    // log = document.getElementById("log");

    //state = document.getElementById("status");



}

function onError(evt) {
    state.className = "fail";
    //   state.innerHTML = "Communication error";
}

function addMessage(command, complement) {
    var message = String.fromCharCode(command);
    message = message + complement;

    //chat.value = "";

    websocket.send(message);
}


function processRTP(message) {
    var obj = JSON.parse(message);

    var errorStatus = parseInt(obj.streaming.error);
    if (errorStatus === 0) {
        var port = obj.streaming.port;
        var rtpURL = 'ws://192.168.1.101:' + port;
        rtPackages = new WebSocket(rtpURL);
        rtPackages.onmessage = function (evt) { onRTPMessage(evt) };
        rtPackages.onopen = function (evt) {onRTPOpen(evt)};
        rtPackages.onclose = function (evt) {onRTPClose(evt)};
        rtPackages.onerror = function (evt) {onRTPError(evt)};
    }
}

function onRTPMessage(evt) {
    var cad = evt.data;
    var message = cad.slice(1, cad.length);
     messageSplitted = message.split("|");
    if (messageSplitted[0] === "$POSE_VEL") {
        showPositionVel(messageSplitted[1]);
        if(svg_first_sector_load){
            drawDorisPosition(messageSplitted[1]);  
        }
    } else if (messageSplitted[0] === "$DORIS"){
        showDorisInfo(messageSplitted[1]);
    }
}
function onRTPOpen(evt){
    console.log("2 websocket creado con exito");
}
function onRTPClose(evt){
    console.log("2 websocket se ha cerrado");
}
function onRTPError(evt){
    console.log("2 websocket ha tenido un error");
}



/*   
function siteAdded(message){
    var obj = JSON.parse(message);
    alert("Added at index: " + obj.robot.index);
}
*/



function requestReleaseControl() {
    if (controlStatus === 0) {
        addMessage(124, '');

    } else if (controlStatus === 1) {
        addMessage(126, '');

    }

}



function notifyMe(message) {
    var obj = JSON.parse(message);


    var notificationUser = noty({
        text: "Hey there! The user from " + obj.control.requester + " is requesting control.",
        type: "information",
        dismissQueue: true,
        layout: "bottomRight",
        theme: 'defaultTheme',
        buttons: [
            {
                addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                    $.noty.closeAll();
                    addMessage(125, '1');

                    // noty({ dismissQueue: true, force: true, layout: layout, theme: 'defaultTheme', text: 'You clicked "Ok" button', type: 'success' });
                }
            },
            {
                addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                    $.noty.closeAll();
                    addMessage(125, '0');

                    // noty({ dismissQueue: true, force: true, layout: layout, theme: 'defaultTheme', text: 'You clicked "Cancel" button', type: 'error' });
                }
            }
        ]
    });
}


function changeControlStatus(message) {
    var obj = JSON.parse(message);

    var errorStatus = parseInt(obj.control.error);
    if (errorStatus === 0) {
        var grantedStatus = parseInt(obj.control.granted);
        var controlDiv = document.getElementById("control");
        var controlLink = document.getElementById("control-link");

        if (grantedStatus === 0) {
            controlDiv.className = "hi-icon-effect-1 hi-icon-effect-1a has-no-control"
            controlLink.className = "has-no-control hi-icon hi-icon-locked";
            controlStatus = 0;

        } else if (grantedStatus === 1) {
            controlDiv.className = "hi-icon-effect-1 hi-icon-effect-1a has-control"
            controlLink.className = "hi-icon hi-icon-locked";
            controlStatus = 1;
        }
    }
}

function releaseControlStatus(message) {
    var obj = JSON.parse(message);

    var errorStatus = parseInt(obj.control.error);
    if (errorStatus === 0) {
        var releasedStatus = parseInt(obj.control.released);
        var controlDiv = document.getElementById("control");
        var controlLink = document.getElementById("control-link");

        if (releasedStatus === 1) {
            controlDiv.className = "hi-icon-effect-1 hi-icon-effect-1a has-no-control"
            controlLink.className = "has-no-control hi-icon hi-icon-locked";
            controlStatus = 0;
        }
    }
}

////////////////for not duplicating SCRIPTS........ http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml  http://www.javascriptkit.com/javatutors/loadjavascriptcss2.shtml
  

function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

//function for deleting and adding the same script
function reloadJs(src) {
    alert(src);
    src = $('script[src$="' + src + '"]').attr("src");
    $('script[src$="' + src + '"]').remove();
    $('<script/>').attr('src', src).appendTo('body');
}


//function for cheking if a script or file has been added or not; If yes, script will be removed and generated again
function checkloadjscssfile(filename, filetype) {
    alert(filename + ", " + filetype);
    if (filesadded.indexOf("[" + filename + "]") == -1) {
        loadjscssfile(filename, filetype)
        filesadded += "[" + filename + "]" //List of files added in the form "[filename1],[filename2],etc"
    }
    else


        replacejscssfile("scripts/menumapping.js", "scripts/menumapping.js", "js");
      

       // alert("file already added!")
}             

      // checkin
function createjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    return fileref
}

function replacejscssfile(oldfilename, newfilename, filetype) {
    var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist using
    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
    var allsuspects = document.getElementsByTagName(targetelement)
    for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(oldfilename) != -1) {
            var newelement = createjscssfile(newfilename, filetype)
            allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i])
        }
    }
}
////////////////for not duplicating SCRIPTS...............................................................................