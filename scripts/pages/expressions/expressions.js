// JavaScript source code for expresions_en.html
var r_speechR;
var recognition = null;

function createVoiceRecocnitionObject(){
    r_speechR = document.getElementById("result-speech-recognition");

    if('SpeechRecognition' in window){
        recognition = new webkitSpeechRecognition();
        //recognition.grammars = speechRecognitionList;
        recognition.lang = 'es-ES';
        recognition.continous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 5;

        var finalTranscripts = '';

        recognition.onresult = function(event) {
            var interimTranscripts = '';
            for (var i = event.resultIndex; i < event.results.length; i++) {
                var transcript = event.results[i][0].transcript;
                transcript.replace("\n", "<br>");
                if(event.results[i].isFinal){
                    finalTranscripts += transcript;
                } else {
                    interimTranscripts += transcript;
                }
            }
            r_speechR.innerHTML = finalTranscripts + '<span style="color: #999">' + interimTranscripts + '</span>';
            console.log('You said: ', event.results[0][0].transcript);
        };

        recognition.onerror = function(event) {
            
        };

        recognition.onspeechend = function() {
          recognition.stop();
        }
    } else {
        r_speechR.innerHTML = "Your web does not support Speech Recognition";
    }
};

function startConverting() {
    if(recognition != null){
        recognition.start();
    }
}


var expressionsProperties = {  // Global object for storing expressions properties

    expressionsID: ["hola1", "hola2"],
    expressionsName: ["hola1,hola2"]
}







function expressions_ListExpressions(){       //for listing all the expressions recibed from Doris

    var list_expressions = StringToArray(message_websocket_recibed);    //we call this function made in mapping.js for changing the string recibed from Doris to an Array
                                                  //and we pass to the funcion the global variable message_websocket_recibed (declared on mapping.js) which stores the message recibed from websocket



    var array_length = list_expressions.length;
    
    var m = 0;
    var n = 0;

    for (i = 0; i < array_length; i = i + 2) {
        expressionsProperties.expressionsID[m] = list_expressions[i];
        m = m + 1;
    }

    for (j = 1; j <= array_length - 1; j = j + 2) {
        expressionsProperties.expressionsName[n] = list_expressions[j];
        n = n + 1;
    }

    var list_content = document.getElementById("expressions_list");

    var loop_whrite = array_length / 2 - 1;


    for (k = loop_whrite  ; k >= 0; k= k - 1) {    

        
        list_content.innerHTML = '<li class="message"> <a href="#/expressions" onclick="addMessage(7,' + expressionsProperties.expressionsID[k] +');">' + expressionsProperties.expressionsName[k] + "</a> </li>" + list_content.innerHTML;

    }
}

function speak(){
    
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    alert('ta qui');
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognition.start();

    voiceMessage = document.getElementById("send-voice-message-value");

    recognition.onresult = function(event) {
        voiceMessage.value = event.results[0][0].transcript;
    };
}

function sendVoiceMessage(){
    voiceMessage = document.getElementById("send-voice-message-value");


    addMessage(11, voiceMessage.value);
}



    


