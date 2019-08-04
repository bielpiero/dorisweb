// JavaScript source code for arm gestures_en.html

var arm_expression_properties = {  // Global object for storing expressions properties

    arm_gestures_id: ["hola1", "hola2"],
    arm_gestures_name: ["hola1,hola2"]
}

var slider = new Slider('#slider1');

function send_bulk_arm_angles(){
    var slider1= document.getElementById("slider1");
    var slider2= document.getElementById("slider2");
    var slider3= document.getElementById("slider3");
    var slider4= document.getElementById("slider4");
    var slider5= document.getElementById("slider5");
    var slider6= document.getElementById("slider6");
    var sliderP= document.getElementById("sliderP");
    var sliderI= document.getElementById("sliderI");
    var sliderC= document.getElementById("sliderC");

    var text = slider1.value + "," + slider2.value + "," + slider3.value + "," + slider4.value + "," + slider5.value + "," + slider6.value + "," + sliderP.value + "," + sliderI.value + "," + sliderC.value;
    addMessage(66,text);

}

function arm_expressions_ListExpressions(){       //for listing all the expressions recibed from Doris

    var list_arm_expressions = StringToArray(message_websocket_recibed);    //we call this function made in mapping.js for changing the string recibed from Doris to an Array
                                                  //and we pass to the funcion the global variable message_websocket_recibed (declared on mapping.js) which stores the message recibed from websocket
    //alert("Recuerda colocar primero el brazo en su posición inicial");
    //var list_arm_expressions = {"Saludar", "Te Jodan", "Señalar"};


    var array_length = list_arm_expressions.length;
    
    var m = 0;
    var n = 0;

    for (i = 0; i < array_length; i = i + 2) {
        arm_expression_properties.arm_gestures_id[m] = list_arm_expressions[i];
        m = m + 1;
    }

    for (j = 1; j <= array_length - 1; j = j + 2) {
        arm_expression_properties.arm_gestures_name[n] = list_arm_expressions[j];
        //expressionsProperties.expressionsName[n] = list_expressions[j];
        n = n + 1;
    }

    var list_content = document.getElementById("arm_expressions_list");

    var loop_whrite = array_length / 2 - 1;


    for (k = loop_whrite  ; k >= 0; k= k - 1) {    

        list_content.innerHTML = '<li class="message"> <a href="#/arm" onclick="addMessage(64,' + arm_expression_properties.arm_gestures_id[k] +');">' + arm_expression_properties.arm_gestures_name[k] + "</a> </li>" + list_content.innerHTML;
        //list_content.innerHTML = '<li class="message"> <a href="#/arm" onclick="addMessage(7,' + arm_expression_properties.arm_gestures_id[k] +');">' + arm_expression_properties.arm_gestures_name[k] + "</a> </li>" + list_content.innerHTML;

    }
}

/*
function activarCasilla(){
    if(check_moving_options.checked==true){
        document.MoverMotoresDeGolpe.disabled=false;
    }
    else{
        document.MoverMotoresDeGolpe.disabled=true;
    }
}
*/