$(document).ready(function() {

	$(":checkbox").change(function() {
		console.log("Checkbox clicked!");
		var checkboxesClicked = $( "input:checked" );
		//hide everything first, then show what's there
		for (var i=0; i<googleMapMarkers.length; i++) {
				googleMapMarkers[i].setMap(null);
		}

		for (var i=0; i<checkboxesClicked.length; i++) {
			console.log(checkboxesClicked[i].name + "is checked");
			show(checkboxesClicked[i].name);
		}
	});


	function show(eventType) {
			console.log("Show "+eventType+" called")

			//find the markers on the Google map
			for (var i=0; i<googleMapMarkers.length; i++) {
				console.log("Checking "+eventType+" == "+googleMapMarkers[i].eventType);
				if (googleMapMarkers[i].eventType == eventType) {
					console.log("Marker for "+eventType+" found, showing marker");
					googleMapMarkers[i].setMap(map);
				}
			}
	}

});