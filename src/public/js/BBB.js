
$(document).click(function(e) {
	var v_id=$(e.target).attr("id");
	//console.log(v_id);
	if($(e.target).attr("class")=='authors') {
		var title = v_id.split(',')[0];
		var user = v_id.split(',')[1];
		var parameters = {title: title, user:user };
        $.get('/logining/getTimestamps', parameters, function(result) {
            $('#showTimestamps').html(result);
        }); 
	}       	
});