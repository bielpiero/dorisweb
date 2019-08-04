
var svg_first_sector_load = false;  //global variable for controling doris draw position

var room_selected = '0';
    //globar variable which stores the room that we have selected for showing their properties
var obj_Map;
var html_element_click;

var selected_map = {
    idMap: "0",
    idSector: "0",
    nameMap:"",
    nameSector:"",
    x_dim: 0,
    y_dim: 0,
    landmarks: [],
    features: [],
    sites: [],
    map_sector_string : function() { 
      /*var string_returned;
      string_returned = */
      return this.idMap.concat(",",this.idSector);
    }
};

var doris_info = {
    mapId: 0,
    sectorId: 0,
    emotionsTimestamp: "",
    mappingSectorTimestamp: "",
    mappingLandmarksTimestamp: "",
    mappingFeaturesTimestamp: "",
    mappingSitesTimestamp: "",
    laserLandmarks: 0,
    visualLandmarks: 0
};

var scaleSVG = {   //global object for storing the scale to use in the SVG drawing
    x: 1,
    y: 1
};

var gElementSVG;    //points to g element of svg which is for position


var mapping_velocity = {           //global object for velocity

    linear_positive: '100,0',
    linear_negative: '-150,0',
    angular_positive: '0,100',
    angular_negative: '0,-100'
};

var room_properties = {
    id: ["hola1", "hola2"],
    name: ["hola1", "hola2"],
    width: ["hola1", "hola2"],
    height: ["hola1", "hola2"]


};

var map_points = {
    landmarks: {
        id: ["hola1", "hola2"],
        x: ["hola1", "hola2"],
        y: ["hola1", "hola2"]
    },
    features: {
        id: ["hola1", "hola2"],
        name: ["hola1", "hola2"],
        x: ["hola1", "hola2"],
        y: ["hola1", "hola2"]
    },
    sites: {
        id: ["hola1", "hola2"],
        name: ["hola1", "hola2"],
        x: ["hola1", "hola2"],
        y: ["hola1", "hola2"]

    }


};

function StringToArray(string) {
    var array1 = string.split(/[|,]/g);
    if (array1[array1.length - 1] === "") { //for eliminating last value of array, which sometimes its empty value
        array1.pop();
    }
    return array1;     //array1[0]=id0 array1[1]=coordX0 array1[3]=id1 ... 
}  

function StringTo_Object(string) {
    var array1 = string.split("|")
       , array2 = [];
    var object_recived_from_doris = []; //We Create an Array of Objects;
    var array1_length, array2_length;


    array2 = array1[0].split(",");
    array2_length = array2.length;
    array1_length = array1.length;

    for (var i = 0; i < array1_length; i++) {
        object_recived_from_doris.push(new Object());
        array2 = array1[i].split(",");
        for (var j = 0; j < array2_length; j++) {
            object_recived_from_doris[i][j] = array2[j];
        }
    }

    return object_recived_from_doris;
}



//Manejo de Doris//
      //Changing Velocity
  function mapping_changeVelocity() {
        //for changing the linear and the angular velocity
        var linear_velocity = document.getElementById("set-robot-speed-v-value").value;
        var angular_velocity = document.getElementById("set-robot-speed-w-value").value;
        if (linear_velocity != "") {
            mapping_velocity.linear_positive = linear_velocity + ',0';
            mapping_velocity.linear_negative = '-' + linear_velocity + ',0';
        }
        if (angular_velocity != "") {
            mapping_velocity.angular_positive = '0,' + angular_velocity;
            mapping_velocity.angular_negative = '0,-' + angular_velocity;
        }   
    }
     //End
 //Setting position
  function setPosition() {
      xPosition = document.getElementById("set-robot-position-x-value");
      yPosition = document.getElementById("set-robot-position-y-value");
      thPosition = document.getElementById("set-robot-position-th-value");
      addMessage(19, (parseFloat(xPosition.value) * 1000) + "," + (parseFloat(yPosition.value) * 1000) + "," + (parseFloat(thPosition.value) * 1000));
  }
//End setting position

//Show position on mapping.html
  function showPositionVel(message) {
      
      var xPosition = document.getElementById("robot-position-x-value");
      var yPosition = document.getElementById("robot-position-y-value");
      var thPosition = document.getElementById("robot-position-th-value");

      var vSpeed = document.getElementById("robot-speed-v-value");
      var wSpeed = document.getElementById("robot-speed-w-value");

      var values = message.split(",");
      if(xPosition !== null){
          xPosition.innerHTML = values[0];
          yPosition.innerHTML = values[1];
          thPosition.innerHTML = values[2];
          vSpeed.innerHTML = values[3];
          wSpeed.innerHTML = values[4];
      }
  }
//END Show position on mapping.html
/*var doris_info = {
    mapId: 0,
    sectorId: 0,
    emotionsTimestamp: "",
    mappingSectorTimestamp: "",
    mappingLandmarksTimestamp: "",
    mappingFeaturesTimestamp: "",
    mappingSitesTimestamp: "",
    laserLandmarks: 0,
    visualLandmarks: 0
};*/

function showDorisInfo(message){
    var mapIdVal = document.getElementById("robot-map-id-value");
    var sectorIdVal = document.getElementById("robot-sector-id-value");
    var rLandmarks = document.getElementById("robot-r-landmarks-value");
    var vLandmarks = document.getElementById("robot-v-landmarks-value");

    var values = message.split(",");
    doris_info.mapId = parseInt(values[0]);
    doris_info.sectorId = parseInt(values[1]);
    doris_info.emotionsTimestamp = values[2];
    if(doris_info.mappingSectorTimestamp !== values[3]){

        doris_info.mappingSectorTimestamp = values[3];    
    }
    
    doris_info.mappingLandmarksTimestamp = values[4];
    doris_info.mappingFeaturesTimestamp = values[5];
    doris_info.mappingSitesTimestamp = values[6];
    doris_info.laserLandmarks = parseInt(values[7]);
    doris_info.visualLandmarks = parseInt(values[8]);

    if(mapIdVal !== null){
        mapIdVal.innerHTML = values[0];
    }
    if(sectorIdVal !== null){
        sectorIdVal.innerHTML = values[1];
    }
    if(rLandmarks !== null){
        rLandmarks.innerHTML = values[7];
    }
    if(vLandmarks !== null){
        vLandmarks.innerHTML = values[8];
    }
}

//Go to position
  function gotoPosition() {
      xPosition = document.getElementById("goto-robot-position-x-value");
      yPosition = document.getElementById("goto-robot-position-y-value");
      thPosition = document.getElementById("goto-robot-position-th-value");

      addMessage(20, (parseFloat(xPosition.value) * 1000) + "," + (parseFloat(yPosition.value) * 1000) + "," + (parseFloat(thPosition.value) * 1000));
  }
//End Go to position

  $("#set-position-button").click(function () {    //for cleaning the x,y,th panel if we press button set position
     // $("#position-alert-success").collapse("hide");
     // $("#position-alert-failed").collapse("hide");

      xPosition = document.getElementById("set-robot-position-x-value");
      yPosition = document.getElementById("set-robot-position-y-value");
      thPosition = document.getElementById("set-robot-position-th-value");

      xPosition.value = ""
      yPosition.value = ""
      thPosition.value = ""
  });
  $("#goto-position-link").click(function () {   //for cleaning the x,y,th panel if we press goto position
     // $("#goto-position-alert-success").collapse("hide");
     // $("#goto-position-alert-failed").collapse("hide");

      xPosition = document.getElementById("goto-robot-position-x-value");
      yPosition = document.getElementById("goto-robot-position-y-value");
      thPosition = document.getElementById("goto-robot-position-th-value");

      xPosition.value = ""
      yPosition.value = ""
      thPosition.value = ""
  });






//Manejo de Doris END//

/////////////////////DRAWING/////////////////////////////////////////////////

    function DrawLoop(typePoints) {

        var svgNS = "http://www.w3.org/2000/svg";
        var colorPoint = "black";
        var objPoint = map_points.landmarks;
        var name = "landmark";
        var land_or_site, index_ls;
        var numberPoints, type_of_g,stroke_ls; 

        switch (typePoints) {
            case 0:
                objPoint = map_points.landmarks;
                colorPoint = "#ff5050";
                name = "landmark";
                land_or_site = selected_map.landmarks;
                index_ls = 1;
                stroke_ls = "#800000";

                if(selected_map.landmarks[0][1] === undefined){
                  numberPoints = 0;
                }else{numberPoints = selected_map.landmarks.length;}
                type_of_g ="g_container_landmarks";




                break;
            case 1:
                objPoint = map_points.features;
                colorPoint = "grey";
                name = "feature";
                if(selected_map.features[0][2] === undefined){
                  numberPoints = 0;
                }else{numberPoints = selected_map.features.length;}
                break;
            case 2:
                objPoint = map_points.sites;
                colorPoint = "#0066ff";
                name = "site";
                land_or_site = selected_map.sites;
                name="site";
                index_ls = 2;
                stroke_ls = "#003380";
                if(selected_map.sites[0][2] === undefined ){
                  numberPoints=0;
                }else{numberPoints = selected_map.sites.length;}
                type_of_g ="g_container_sites";




                break;

        }

        if (typePoints===0 || typePoints===2){
 
            for (i = 0; i < numberPoints; i++) {
                var myCircle = document.createElementNS(svgNS, "circle");
                var idPoint = name.concat(land_or_site[i][0]);
                myCircle.setAttributeNS(null, "id", idPoint);





                myCircle.setAttributeNS(null, "cx", scaleSVG.x * land_or_site[i][index_ls]);
                myCircle.setAttributeNS(null, "cy", scaleSVG.x * land_or_site[i][index_ls + 1]);
                myCircle.setAttributeNS(null, "r", 6);
                myCircle.setAttributeNS(null, "fill", colorPoint);
                myCircle.setAttributeNS(null, "stroke", stroke_ls);
              //  myCircle.setAttributeNS(null,"visibility",point_visibility);
                document.getElementById(type_of_g).appendChild(myCircle);


                //ZONA DE ANIMACION CIRCULO
                var myRound = document.createElementNS(svgNS, "circle");
                var idCircle = name.concat(land_or_site[i][0], "circle");
                myRound.setAttributeNS(null, "id", idCircle);
                myRound.setAttributeNS(null, "cx", scaleSVG.x * land_or_site[i][index_ls]);
                myRound.setAttributeNS(null, "cy", scaleSVG.x * land_or_site[i][index_ls + 1]);
                myRound.setAttributeNS(null, "r", 7);
                myRound.setAttributeNS(null, "fill", "none");
                myRound.setAttributeNS(null, "stroke", "red");
                myRound.setAttributeNS(null, "opacity", 0);
                myRound.setAttributeNS(null, "stroke-width", "0.4%");

                //animate object

                var animate0 = document.createElementNS(svgNS, "animate");
                var idanimate0 = name.concat(land_or_site[i][0], "animation0");
                animate0.setAttributeNS(null, "id", idanimate0);
                animate0.setAttributeNS(null, "attributeName", "opacity");
                animate0.setAttributeNS(null, "dur","0.01s");
                animate0.setAttributeNS(null, "begin", "indefinite");
                animate0.setAttributeNS(null, "from", 0);
                animate0.setAttributeNS(null, "to", 1);
                animate0.setAttributeNS(null, "repeatCount", 0);
                animate0.setAttributeNS(null, "fill", "freeze");
                //append animate with image
                myRound.appendChild(animate0);

                var animate1 = document.createElementNS(svgNS, "animate");
                var idanimate1 = name.concat(land_or_site[i][0], "animation1");
                var concatAnim1 = idanimate0.concat(".end");
                animate1.setAttributeNS(null, "id", idanimate1);
                animate1.setAttributeNS(null, "attributeName", "r");
                animate1.setAttributeNS(null, "begin", concatAnim1);
                animate1.setAttributeNS(null, "dur", "0.7s");
                animate1.setAttributeNS(null, "repeatCount", 3);
                animate1.setAttributeNS(null, "from", 9);
                animate1.setAttributeNS(null, "to", 20);
                //append animate with image
                myRound.appendChild(animate1);

                var animate2 = document.createElementNS(svgNS, "animate");
                var idanimate2 = name.concat(land_or_site[i][0], "animation2");
                var concatAnim2 = idanimate1.concat(".end");
                animate2.setAttributeNS(null, "id", idanimate1);
                animate2.setAttributeNS(null, "attributeName", "opacity");
                animate2.setAttributeNS(null, "dur", "0.01s");
                animate2.setAttributeNS(null, "begin",concatAnim2);
                animate2.setAttributeNS(null, "from", 1);
                animate2.setAttributeNS(null, "to", 0);
                animate2.setAttributeNS(null, "repeatCount", 0);
                animate2.setAttributeNS(null, "fill", "freeze");
                //append animate with image
                myRound.appendChild(animate2);



                document.getElementById(type_of_g).appendChild(myRound);




                
            }
        }
        else if (typePoints === 1) {
            for (i = 0; i < numberPoints; i++) {
                var myCircle = document.createElementNS(svgNS, "rect");
                var idPoint = name.concat(selected_map.features[i][0]);
                myCircle.setAttributeNS(null, "id", idPoint);
                myCircle.setAttributeNS(null, "x", (scaleSVG.x * selected_map.features[i][2]));
                myCircle.setAttributeNS(null, "y", (scaleSVG.y * selected_map.features[i][3]));
                myCircle.setAttributeNS(null, "width", scaleSVG.x * selected_map.features[i][4]);
                myCircle.setAttributeNS(null, "height", scaleSVG.y * selected_map.features[i][5]);
                myCircle.setAttributeNS(null, "fill", colorPoint);
                myCircle.setAttributeNS(null, "stroke", "#4d4d4d");
                document.getElementById("g_container_features").appendChild(myCircle);

                //ZONA DE ANIMACION RECTANGULO
                var myRound = document.createElementNS(svgNS, "rect");
                var idCircle = name.concat(selected_map.features[i][0], "circle");
                myRound.setAttributeNS(null, "id", idCircle);
                myRound.setAttributeNS(null, "x", (scaleSVG.x * selected_map.features[i][2]));
                myRound.setAttributeNS(null, "y", (scaleSVG.y * selected_map.features[i][3]));
                myRound.setAttributeNS(null, "r", 7);
                myRound.setAttributeNS(null, "width", scaleSVG.x * selected_map.features[i][4]);
                myRound.setAttributeNS(null, "height", scaleSVG.y * selected_map.features[i][5]);
                myRound.setAttributeNS(null, "fill", "none");
                myRound.setAttributeNS(null, "stroke", "red");
                myCircle.setAttributeNS(null, "stroke-width",1);
                myRound.setAttributeNS(null, "stroke-alignment", "outer");
                myRound.setAttributeNS(null, "opacity", 0);
                
                //animate object

                var animate0 = document.createElementNS(svgNS, "animate");
                var idanimate0 = name.concat(selected_map.features[i][0], "animation0");
                animate0.setAttributeNS(null, "id", idanimate0);
                animate0.setAttributeNS(null, "attributeName", "opacity");
                animate0.setAttributeNS(null, "dur", "0.01s");
                animate0.setAttributeNS(null, "begin", "indefinite");
                animate0.setAttributeNS(null, "from", 0);
                animate0.setAttributeNS(null, "to", 1);
                animate0.setAttributeNS(null, "repeatCount", 0);
                animate0.setAttributeNS(null, "fill", "freeze");
                //append animate with image
                myRound.appendChild(animate0);

                var animate1 = document.createElementNS(svgNS, "animate");
                var idanimate1 = name.concat(selected_map.features[i][0], "animation1");
                var concatAnim1 = idanimate0.concat(".end");
                animate1.setAttributeNS(null, "id", idanimate1);
                animate1.setAttributeNS(null, "attributeName", "stroke-width");
                animate1.setAttributeNS(null, "begin", concatAnim1);
                animate1.setAttributeNS(null, "dur", "0.5s");
                animate1.setAttributeNS(null, "repeatCount", 3);
                animate1.setAttributeNS(null, "from", 1.5);
                animate1.setAttributeNS(null, "to", 6);
                //append animate with image
                myRound.appendChild(animate1);   

                var animate2 = document.createElementNS(svgNS, "animate");
                var idanimate2 = name.concat(selected_map.features[i][0], "animation2");
                var concatAnim2 = idanimate1.concat(".end");
                animate2.setAttributeNS(null, "id", idanimate1);
                animate2.setAttributeNS(null, "attributeName", "opacity");
                animate2.setAttributeNS(null, "dur", "0.01s");
                animate2.setAttributeNS(null, "begin", concatAnim2);
                animate2.setAttributeNS(null, "from", 1);
                animate2.setAttributeNS(null, "to", 0);
                animate2.setAttributeNS(null, "repeatCount", 0);
                animate2.setAttributeNS(null, "fill", "freeze");
                //append animate with image
                myRound.appendChild(animate2);

                
                document.getElementById("g_container_features").appendChild(myRound);

            }
        }
    }

    function DrawPoints() {



        //We draw landmarks
        DrawLoop(0);
        //We draw features
        DrawLoop(1);
        //We draw sites
        DrawLoop(2);

        svg_first_sector_load = true;


    }
/////////////////////////DRAWING---END////////////////////////////////////////////////

///Start animation when click on menu///

    function startAnimation(idAnimate) {

      var ie_compatibility = idAnimate ;   //for internet explorer compatibility


      document.getElementById(ie_compatibility).beginElement();
    }
///Start animation when click on menu END///

/////////////////////////MAKING MENUS////////////////////////////////////////////

    function loadProgramsList(lista){
        var programsList = lista.split(",");
        var programsContainer = document.getElementById("programs_list");
        for (var i = 0; i < programsList.length; i++) {
            if(programsList[i] != ""){
                var alink = document.createElement('a');
                //alink.href = "#";
                alink.classList.add("list-group-item");
                alink.innerHTML = programsList[i];
                alink.onclick = function(){
                    var pc = document.getElementById("programs_list").children;
                    for(var j = 0; j < pc.length; j++){
                        if(pc[j].classList.contains("active")){
                            pc[j].classList.remove("active");
                        }
                    }
                    this.classList.add("active");
                    addMessage(3, this.innerHTML);
                }
                programsContainer.appendChild(alink);
            }
        }
    }
   

    function loadMenuMap(level) {
        var menu_length, menu_content,node,enlace,texto,lista,i;
        var animationID = ["landmark", "feature", "site"];
        var animationLauncher = ["landmark", "feature", "site"];

        switch (level) {
            case 0:
                obj_Map = StringTo_Object(message_websocket_recibed);
                menu_length = obj_Map.length;
                menu_content = document.getElementById("mapping_list");


                for (i = 0; i < menu_length; i++) {

                       enlace = document.createElement("a");
                       texto = document.createTextNode(obj_Map[i][1]);
                       lista = document.createElement("li");
                       lista.setAttribute("data-id",obj_Map[i][0]);
                       lista.setAttribute("data-map-name",obj_Map[i][1]);

                       enlace.appendChild(texto);
                       enlace.setAttribute("href","#/mapping");
                       enlace.setAttribute("onClick","startLoadSectors(this);");
                       enlace.setAttribute("data-click-load","00");
                       enlace.setAttribute("data-option","off");
                       lista.appendChild(enlace);
                       menu_content.appendChild(lista);  

                }
               $(".u-vmenu").vmenuModule({
                        Speed: 250,
                        autostart: false,
                        autohide: false,
                        first: false
                    }); 


                break;
            case 1:
                if ($(html_element_click).attr("data-click-load") == '00') {
                    $(html_element_click).attr("data-click-load", '01');
                    obj_Map = StringTo_Object(message_websocket_recibed);
                    menu_length = obj_Map.length;

                   node = document.createElement("ul");

                 node.style.display = "block";

                   html_element_click.parentNode.appendChild(node);

                    for (i = 0; i < menu_length; i++) {
                       enlace = document.createElement("a");
                       texto = document.createTextNode(obj_Map[i][1]);
                       lista = document.createElement("li");
                       lista.setAttribute("data-id",obj_Map[i][0]);
                       lista.setAttribute("data-sector-name",obj_Map[i][1]);
                       lista.setAttribute("data-x",obj_Map[i][2]);
                       lista.setAttribute("data-y",obj_Map[i][3]);

                       enlace.appendChild(texto);
                       enlace.setAttribute("href","#/mapping");
                       enlace.setAttribute("onClick","startLoad_Land_Feat_Sites(this);");
                       enlace.setAttribute("data-click-load","00");
                       enlace.setAttribute("data-option","off");
                       lista.appendChild(enlace);
                       html_element_click.parentNode.lastChild.appendChild(lista);}


         if ($(html_element_click).attr("data-option") == 'on') {
            html_element_click.setAttribute("data-option","off");
         }else{html_element_click.setAttribute("data-option","on");} 

                    
                $(".u-vmenu").vmenuModule({
                        Speed: 250,
                        autostart: false,
                        autohide: false,
                        first: false
                    });   
                }
                break;
            case 2:

            if ($(html_element_click).attr("data-click-load") == '00') {
                $(html_element_click).attr("data-click-load", '01');
             
               
                node = document.createElement("ul");
                node.setAttribute("style","display: block");
                html_element_click.parentNode.appendChild(node);

                enlace = document.createElement("a");
                texto = document.createTextNode("Landmarks");
                lista = document.createElement("li");

                enlace.appendChild(texto);
                enlace.setAttribute("href","#/mapping");
                enlace.setAttribute("data-option","off");
                lista.appendChild(enlace);
                html_element_click.parentNode.lastChild.appendChild(lista);

                node = document.createElement("ul");
                node.setAttribute("style","display: none");
                html_element_click.parentNode.lastChild.lastChild.appendChild(node);

                if(!(selected_map.landmarks[0][1] === undefined)){


                for (i=0;i<selected_map.landmarks.length;i++){
                    enlace = document.createElement("a");
                    texto = document.createTextNode("Landmark[" + selected_map.landmarks[i][0] +"]" + "{x" + selected_map.landmarks[i][1] + " y" + selected_map.landmarks[i][2] +"}");
                    lista = document.createElement("li");
                    enlace.appendChild(texto);
                    enlace.setAttribute("href","#/mapping");
                    //animacion
                    animationLauncher[0] = animationID[0].concat(selected_map.landmarks[i][0], "animation0");
                    enlace.setAttribute("onClick","startAnimation("+"'" + animationLauncher[0]+"'" + ");");

                    
                    lista.appendChild(enlace);
                    html_element_click.parentNode.lastChild.lastChild.lastChild.appendChild(lista);
                }
              }


                enlace = document.createElement("a");
                texto = document.createTextNode("Features");
                lista = document.createElement("li");

                enlace.appendChild(texto);
                enlace.setAttribute("href","#/mapping");
                enlace.setAttribute("data-option","off");
                lista.appendChild(enlace);
                html_element_click.parentNode.lastChild.appendChild(lista);

                node = document.createElement("ul");
                node.setAttribute("style","display: none");
                html_element_click.parentNode.lastChild.lastChild.appendChild(node);

                if(!(selected_map.features[0][1] === undefined)){

                for (i=0;i<selected_map.features.length;i++){
                    enlace = document.createElement("a");
                    texto = document.createTextNode(selected_map.features[i][1]);
                    lista = document.createElement("li");
                    enlace.appendChild(texto);
                    enlace.setAttribute("href","#/mapping");
                    //animacion
                    animationLauncher[1] = animationID[1].concat(selected_map.features[i][0], "animation0");
                    enlace.setAttribute("onClick","startAnimation("+"'" + animationLauncher[1]+"'" + ");");

                    
                    lista.appendChild(enlace);
                    lista.appendChild(enlace);
                    html_element_click.parentNode.lastChild.lastChild.lastChild.appendChild(lista);
                }
              }

                enlace = document.createElement("a");
                texto = document.createTextNode("Sites");
                lista = document.createElement("li");

                enlace.appendChild(texto);
                enlace.setAttribute("href","#/mapping");
                enlace.setAttribute("data-option","off");
                lista.appendChild(enlace);
                html_element_click.parentNode.lastChild.appendChild(lista);

                node = document.createElement("ul");
                node.setAttribute("style","display: none");
                html_element_click.parentNode.lastChild.lastChild.appendChild(node);

                if(!(selected_map.sites[0][1] === undefined)) {

                for (i=0;i<selected_map.sites.length;i++){
                    enlace = document.createElement("a");
                    texto = document.createTextNode(selected_map.sites[i][1]);
                    lista = document.createElement("li");
                    enlace.appendChild(texto);
                    enlace.setAttribute("href","#/mapping");
                    //animacion
                    animationLauncher[2] = animationID[2].concat(selected_map.sites[i][0], "animation0");
                    enlace.setAttribute("onClick","startAnimation("+"'" + animationLauncher[2]+"'" + ");");

                    lista.appendChild(enlace);
                    html_element_click.parentNode.lastChild.lastChild.lastChild.appendChild(lista);
                }
              }



                if ($(html_element_click).attr("data-option") == 'on') {
                     html_element_click.setAttribute("data-option","off");
                }else{html_element_click.setAttribute("data-option","on");
                }  
            

                $(".u-vmenu").vmenuModule({
                        Speed: 250,
                        autostart: false,
                        autohide: false,
                        first: false
                });
            }

            var content_mapping_node=document.createTextNode(selected_map.nameSector);
            var text_mapping_node = document.getElementById("name-sector-mapping-page");
            text_mapping_node.removeChild(text_mapping_node.lastChild);
            text_mapping_node.appendChild(content_mapping_node);

            startChainMapping();
            break;

        }
    }
            
           
    


   function startLoadSectors(html_element) {
    html_element_click = html_element;
        
        var idMap = $(html_element_click.parentNode).attr("data-id");

        if ($(html_element_click).attr("data-click-load") == '00') {
            addMessage(21,idMap);
        }else{
            $(html_element_click).attr("data-click-load", '01');

        }
    }
    function startLoad_Land_Feat_Sites(html_element) {
        html_element_click = html_element;

        if ($(html_element_click).attr("data-option") == 'off') {


        
        selected_map.idMap = $(html_element_click.parentNode.parentNode.parentNode).attr("data-id");
        selected_map.nameMap = $(html_element_click.parentNode.parentNode.parentNode).attr("data-map-name");
        selected_map.idSector = $(html_element_click.parentNode).attr("data-id");
        selected_map.nameSector = $(html_element_click.parentNode).attr("data-sector-name");
        selected_map.x_dim = parseFloat($(html_element_click.parentNode).attr("data-x"));
        selected_map.y_dim = parseFloat($(html_element_click.parentNode).attr("data-y"));

        addMessage(23,selected_map.idMap.concat(",", selected_map.idSector));
        }

    }







    function startChainMapping() {
      var r_dim = {
        hx : 0.3,
        hy : 0.24
      };
      var svg_dim = {
        x:0,
        y:0
      };
      var k_map = selected_map.y_dim/selected_map.x_dim;
      if(k_map >= parseFloat(document.getElementById("mySVG").getAttribute("data-svg-y"))/ parseFloat(document.getElementById("mySVG").getAttribute("data-svg-x"))){
        svg_dim.y=parseFloat(document.getElementById("mySVG").getAttribute("data-svg-y"));
        svg_dim.x=svg_dim.y/k_map;
      }else{
        svg_dim.x = parseFloat(document.getElementById("mySVG").getAttribute("data-svg-x"));
        svg_dim.y = k_map * svg_dim.x;
      }
        scaleSVG.x = svg_dim.x / selected_map.x_dim;
        scaleSVG.y = svg_dim.y / selected_map.y_dim;


        r_dim.hx=scaleSVG.x * r_dim.hx;
        r_dim.hy=scaleSVG.y * r_dim.hy;


        document.getElementById("mySVG").setAttribute("width",svg_dim.x);
        document.getElementById("mySVG").setAttribute("height",svg_dim.y);
        document.getElementById("g_container_landmarks").setAttribute("transform","translate(0," + svg_dim.y + ")" + " scale(1,-1)" );
        document.getElementById("g_container_features").setAttribute("transform","translate(0," + svg_dim.y + ")" + " scale(1,-1)" );
        document.getElementById("g_container_sites").setAttribute("transform","translate(0," + svg_dim.y + ")" + " scale(1,-1)" );
        document.getElementById("g_container_doris_position").setAttribute("transform","translate(0," + svg_dim.y + ")" + " scale(1,-1)" );


       var svgNS = "http://www.w3.org/2000/svg";  

        d3.selectAll("svg > g > *").remove(); //We remove all elements inside all the g elements
        d3.selectAll("svg > #containerShape").remove();


        var rect = document.createElementNS(svgNS, "rect");     //we create again the rectangle shape
        rect.setAttributeNS(null, "id", "containerShape");
        rect.setAttributeNS(null, "width",svg_dim.x);
        rect.setAttributeNS(null, "height",svg_dim.y);
        
        rect.setAttributeNS(null, "fill", "none");
        rect.setAttributeNS(null, "stroke", "black");
        rect.setAttributeNS(null, "stroke-width", "1");
        document.getElementById("mySVG").appendChild(rect);

        var doris_svg = document.createElementNS(svgNS, "path");
        doris_svg.setAttribute("id","g_container_doris_position_path");
        doris_svg.setAttribute("d",'M ' +  r_dim.hx + ',' + '0' + ' L ' + (-r_dim.hx) + ',' + (-r_dim.hy) + ' L ' + (-0.5*r_dim.hx) + ',0' + ' L ' + (-r_dim.hx) + ',' + r_dim.hy + ' Z');
        doris_svg.setAttribute("fill","#66ff33");
        doris_svg.setAttribute("stroke","#208000");
        document.getElementById("g_container_doris_position").appendChild(doris_svg);


      

        DrawPoints();
    }






////////////////MAKING MENUS END//////////////////////////////////////////////



function change_visibility_status_points(type_point){
    switch (type_point) {
        case 0:
            if(document.getElementById("landmarks_check").checked){
                document.getElementById("g_container_landmarks").style.visibility ="visible";
            }else{document.getElementById("g_container_landmarks").style.visibility ="hidden";}
        break;

        case 1:
            if(document.getElementById("features_check").checked){
                document.getElementById("g_container_features").style.visibility ="visible";
            }else{document.getElementById("g_container_features").style.visibility ="hidden";}
        break;

        case 2:
            if(document.getElementById("sites_check").checked){
                document.getElementById("g_container_sites").style.visibility ="visible";
            }else{document.getElementById("g_container_sites").style.visibility ="hidden";}
        break;
    }
}






function load_check_map_options(){
    document.getElementById("landmarks_check").addEventListener("click", function(){change_visibility_status_points(0);});
    document.getElementById("features_check").addEventListener("click",function(){change_visibility_status_points(1);});
    document.getElementById("sites_check").addEventListener("click",function(){change_visibility_status_points(2);});
}

function drawDorisPosition(doris_position){
  var values = doris_position.split(",");
  var doris_angular_degrees = values[2] * 180 / 3.14159;
  var doris_svg_point = document.getElementById("g_container_doris_position_path");
  doris_svg_point.setAttribute("transform",'translate(' + scaleSVG.x * values[0] + "," + scaleSVG.y * values[1] + ")" + 'rotate(' + doris_angular_degrees +')'  );

}




