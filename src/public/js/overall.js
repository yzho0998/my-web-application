
var record;

google.charts.load('current', {packages: ['corechart']});


var options1 = {'title':"Overall Yearly Revision Number Distribution",
    'width':1100,
    'height':600
};

var options2 = {'title':"Revision Number Distribution By User Type",
	    'width':1100,
	    'height':600
	};
$(document).ready(function(){
    $('#set').on('click', function(e){
        
    	var topNum = {number: $('#topNumber').val() };
    	$.get('/logining/getOverallTable', topNum,function(result) {
            $('#overallInformation').html(result);
        });
    });
});

function drawOverallPie(data){
   	graphData = new google.visualization.DataTable();
   	graphData.addColumn('string', 'Element');
   	graphData.addColumn('number', 'Percentage');
	$.each(data, function(key, val) {
		graphData.addRow(val);
	});
	//console.log(graphData);
	var chart = new google.visualization.PieChart($("#overallPie")[0]);
	chart.draw(graphData, options2);
}

function drawOverallBar(data){
    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'Element');
    graphData.addColumn('number', 'Regular');
    graphData.addColumn('number', 'Anon');
    graphData.addColumn('number', 'Administrator');
    graphData.addColumn('number', 'Bot');
      
    $.each(data, function(index,val) {
        graphData.addRow(val);
    })
    var chart = new google.visualization.ColumnChart($("#overallBarLine")[0]);

    chart.draw(graphData, options1);
}

function drawOverallLine(data){

    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'Element');
    graphData.addColumn('number', 'Regular');
    graphData.addColumn('number', 'Anon');
    graphData.addColumn('number', 'Administrator');
    graphData.addColumn('number', 'Bot');
    
    
    $.each(data, function(index,val) {
        graphData.addRow(val);
    })
    var chart = new google.visualization.LineChart($("#overallBarLine")[0]);

    chart.draw(graphData, options1);
}

$(document).ready(function(){    
	var startNum = {number: "2" };
	$.get('/logining/getOverallTable', startNum,function(result) {
        $('#overallInformation').html(result);
    });
	
	$.getJSON('/logining/overallBar', function(rdata) {
		record=rdata;
		
		event.preventDefault();

        drawOverallBar(rdata);

    });
	$.getJSON('/logining/overallPie', function(rdata) {		
		event.preventDefault();
        drawOverallPie(rdata);        
    });
});

$(document).ready(function(){
    
    $('#overallBar').on('click', function(e){      	
    	event.preventDefault();
	    drawOverallBar(record);
    });
    $('#overallLine').on('click', function(e){
    	event.preventDefault();
    	drawOverallLine(record);
    });   
});

