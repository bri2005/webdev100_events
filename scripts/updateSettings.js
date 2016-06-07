$(document).ready(function() {

	$("#bgChooser").change(function() {
		
		var backgroundColorSel = $("#bgChooser option:selected").val();
		console.log(backgroundColorSel);
		
		switch (backgroundColorSel) {
			case "yellow":
				$('body').css({"background-color":"yellow"});
				break;
			case "green":
				$('body').css({"background-color":"green"});
				break;
			case "red":
				$('body').css({"background-color":"red"});
				break;
			default:
				$('body').css({"background-color":"white"});
				break;
		}

		//set cookie for the background color
		console.log("Setting backgroundColor cookie to "+backgroundColorSel);
		Cookies.set("backgroundColor",backgroundColorSel);

	});

});