
google.charts.load('current', {packages: ['corechart']});


var options5 = {'title':"Revision Number Distributed By Year Made By This User For This Article",
    'width':1100,
    'height':600
};


function drawBar(data){
    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'Element');
    graphData.addColumn('number', 'Revision Number');
    //console.log(data);
    $.each(data, function(key, val) {
        graphData.addRow([key, val]);
    })
    var chart = new google.visualization.ColumnChart($("#myChart1")[0]);

    chart.draw(graphData, options5);
}

$(document).click(function(e) {
	var v_id=$(e.target).attr("id");
	
	if($(e.target).attr("class")=='g3 list-group-item list-group-item-action') {
		var title = v_id.split(',')[1];
		var user = v_id.split(',')[0];
		var from = v_id.split(',')[2];
		var to = v_id.split(',')[3];
		var parameters = {title: title, user:user,from:from,to:to };
      
        $.getJSON('/logining/showGraph3',parameters, function(rdata) {
        	var data = rdata;
        	event.preventDefault();
            drawBar(data);
        });            
	}	
});