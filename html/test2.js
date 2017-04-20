var count = 0;
var accessToken = "c87528439d4f4a2aa097f1aec7d414e3";
var baseUrl = "https://api.api.ai/v1/";
$(document).ready(function() {
    $("#input").keypress(function(event) {
    	if (event.which == 13 && $("#input").val().replace(/\s/g, "") != "") {  // Ensuring input not blank
    	    event.preventDefault();
    	    send();
    	}
    });
    $("#rec").click(function(event) {
    	switchRecognition();
    });
    $("#input").focus();
});
var recognition;
function startRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.onstart = function(event) {
    	updateRec();
    };
    recognition.onresult = function(event) {
    	var text = "";
    	for (var i = event.resultIndex; i < event.results.length; ++i) {
    	    text += event.results[i][0].transcript;
    	}
    	setInput(text);
    	stopRecognition();
    };
    recognition.onend = function() {
    	stopRecognition();
    };
    recognition.lang = "en-US";
    recognition.start();
}

function stopRecognition() {
    if (recognition) {
    	recognition.stop();
    	recognition = null;
    }
    updateRec();
}
function switchRecognition() {
    if (recognition) {
    	stopRecognition();
    } else {
    	startRecognition();
    }
}
function setInput(text) {
    $("#input").val(text);
    send();
}
function updateRec() {
    $("#rec").text(recognition ? "Stop" : "Speak");
}
function send() {
    var text = $("#input").val();
    setResponse(text, true);  // User input
    $.ajax({
    	type: "POST",
    	url: baseUrl + "query?v=20150910",
    	contentType: "application/json; charset=utf-8",
    	dataType: "json",
    	headers: {
    	    "Authorization": "Bearer " + accessToken
    	},
    	data: JSON.stringify({ query: text, lang: "en", sessionId: Math.random().toString(36).substring(7) }),
    	success: function(data) {
    	    if(!(document.getElementById('DEVMODE').checked)) {
    		setResponse(JSON.stringify(data.result.fulfillment.speech, undefined, 2));
    	    }
    	    else {
    		setResponse(JSON.stringify(data, undefined, 2), false);
    	    }
    	},
    	error: function() {
    	    setResponse("Internal Server Error");
    	}
    });
    //setResponse("Loading...");
}

// val is text to be displayed, userInput is true if user input, false if Bot response
function setResponse(val, userInput) {
    $("#input").val("");  // Blank out user input box

    if (!userInput && val.split(/(?=https?)/).length == 2) {
	var arr = val.split(/(?=https?)/);
	$("#divCont").append("<div class=\"botDiv\"<p>" + arr[0] + "<br><a target=\"_blank\" href=" +
			     arr[1].substring(0,arr[1].length-1) + ">Link</a><div class=\"box\"><iframe src=" + arr[1].substring(0,arr[1].length-1) + " width = \"100%\" height = \"100%\"></iframe></div></p></div><br>");
    } else {	
	// userP and botP
	if (userInput) {
	    $("#divCont").append("<div class=\"userDiv\"><p>" + val +"</p></div><br>");
	} else {
	    $("#divCont").append("<div class=\"botDiv\"><p>" + val +"</p></div><br>");
	}
    }
    $("#divCont").scrollTop($("#divCont").prop("scrollHeight"));

    
}