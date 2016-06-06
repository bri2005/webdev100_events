$(document).ready(function() {

//populate ID field
//get the existing cookie and add 1 to it for an ID
var eventsJSON = Cookies.get("events");

if (eventsJSON != undefined) {

	console.log("Events cookie found:"); 
    console.log(eventsJSON);

    eventsJSON = eventsJSON.replace(/\n/g,"");
    eventsJSON = eventsJSON.replace(/\[\"/g,"[");
    eventsJSON = eventsJSON.replace(/\"\]/g,"]");
    eventsJSON = eventsJSON.replace(/\"\{/g,"{");

    console.log("Cookie after cleanup: "+eventsJSON);

    
     var events = JSON.parse(eventsJSON);  

	$("#id").attr("value", events.length + 1);
}
else $("#id").attr("value", 0);

//serializeObject override
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//on the form submit, change the result div to show the json

$('form').submit(function(e) {

		e.preventDefault();

		var formJson = JSON.stringify($('form').serializeObject());
		formJson = formJson.replace(/\n/g,"")

        //get the existing cookie and add 1 to it for an ID
        var eventsJSON = Cookies.get("events");

        if(eventsJSON != undefined) {

			eventsJSON = eventsJSON.replace(/\n/g,"");
    		eventsJSON = eventsJSON.replace(/\[\"/g,"[");
    		eventsJSON = eventsJSON.replace(/\"\]/g,"]");
    		eventsJSON = eventsJSON.replace(/\"\{/g,"{");

    		console.log("Cookie after cleanup: "+eventsJSON);        		

        	//put into an array
        	var events = JSON.parse(eventsJSON);

        	//add the form data to the end of it
        	events.push(formJson);

        	eventsUpdatedStr = JSON.stringify(events).replace(/\\/g,"");
        	console.log("Cookie set as "+ eventsUpdatedStr);

        	Cookies.set("events", eventsUpdatedStr);
        }
        else {
        	var events = [];
        	events.push(formJson);
        	Cookies.set("events", JSON.stringify(events).replace(/\\/g,""));
        }

        return false;
});

});
