$(document).ready(function() {

	$("input[type=checkbox]").on("click", function() {
		console.log(this.id + "is checked");
	});

});