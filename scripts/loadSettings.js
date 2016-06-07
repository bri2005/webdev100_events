$(document).ready(function() {

	//set cookie for the background color	
	var bgColor = Cookies.get("backgroundColor");
	console.log("loaded bgColor as: "+bgColor);

	if (bgColor == undefined) {
		Cookies.set("backgroundColor", "white");
	}	
	else $('body').css({"background-color":bgColor});

});