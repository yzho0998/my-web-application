
var parameters={title:"",number:"",history:"no",from:"1900",to:"2021"};
var aaa="";
var change=[0,0,0];

var data1,data2,data3;
var cache;

$(document).ready(function(){
	var result1;
	var my= new Array();
	var value= $('#articles').find("option:selected").val().split(",");
	
	parameters.title = value[0];
	parameters.number = value[1];
	parameters.history = "no";
	$('#articles').change(function(e){
		change[0] = 0;
		change[1] = 0;
		value= $('#articles').find("option:selected").val().split(",");
		
		parameters.title=value[0];
		parameters.number=value[1];
				
		$.getJSON('/logining/checkHistory', parameters,function(hisResult) {
            
			parameters.history=hisResult;
					
		var a= function(){
			var def = $.Deferred();
			if(hisResult!="no") {
				parameters.number=parseInt(parameters.number)+hisResult;
				$('#articles').find("option:selected").val(parameters.title+","+parameters.number.toString());
				$('#articles').find("option:selected").text(parameters.title+"("+parameters.number.toString()+")");
				
			}
			$.get('/logining/information', parameters,function(result) {
				
	            result1=result;
	        	def.resolve("a");
	        });
			return def;
		}
		
		var b= function(data){
			var def = $.Deferred();
			$.get('https://www.reddit.com/r/news/search.json?q='+parameters.title+'&type=link&sort=top&limit=3',  function(result) {
	            
	        	my[0] = result.data.children[0].data.title;
	        	my[1] = result.data.children[1].data.title;
	        	my[2] = result.data.children[2].data.title;
	        	def.resolve(data+"b");
	        });
			return def;
		}
		
		var c= function(data){
			var def = $.Deferred();

			var bbb= '<div class=\'container\'><div class=\"row\"><div class=\"col-md-12\"><table class=\"table table-bordered table-hover table-sm\"><tr><th rowspan=4>Top 3 news</th></tr>'+
    		'<tr><td>'+my[0]+'</td></tr>'+
    		'<tr><td>'+my[1]+'</td></tr>'+
    		'<tr><td>'+my[2]+'</td></tr></table></div></div></div>';

			aaa=result1+bbb;
			
			$('#information').html(aaa);
			def.resolve(data+"c");
			return def;
		}
		
		a()
		  .then(function (data) {
		    return b(data)
		  })
		  .then(function (data) {
		    return c(data)
		  })       
		});
        
	});
});

$(document).ready(function(){
    $('#filter').on('click', function(e){
        
        parameters.from=$('#yearFrom').val();
        parameters.to=$('#yearTo').val();
        change[0]=0;
        change[1]=0;
        var result1;
		var my= new Array();
		
		var a= function(){
			var def = $.Deferred();
			$.get('/logining/information', parameters,function(result) {
	            result1=result;
	        	def.resolve("a");
	        });
			return def;
		}
		
		var b= function(data){
			var def = $.Deferred();
			$.get('https://www.reddit.com/r/news/search.json?q='+parameters.title+'&type=link&sort=top&limit=3',  function(result) {
	            
	        	my[0] = result.data.children[0].data.title;
	        	my[1] = result.data.children[1].data.title;
	        	my[2] = result.data.children[2].data.title;
	        	def.resolve(data+"b");
	        });
			return def;
		}
		
		var c= function(data){
			var def = $.Deferred();
			var bbb= '<div class=\'container\'><div class=\"row\"><div class=\"col-md-12\"><table class=\"table table-bordered table-hover table-sm\"><tr><th rowspan=4>Top 3 news</th></tr>'+
    		'<tr><td>'+my[0]+'</td></tr>'+
    		'<tr><td>'+my[1]+'</td></tr>'+
    		'<tr><td>'+my[2]+'</td></tr></table></div></div></div>';

			aaa=result1+bbb;
			$('#information').html(aaa);
			def.resolve(data+"c");
			return def;
		}
		
		a()
		  .then(function (data) {
		    return b(data)
		  })
		  .then(function (data) {
		    return c(data)
		  })               
    });
});

$(document).ready(function(){
	$("#inforTable").click(function(event){
		if(aaa==""){
			var result1;
			var my= new Array();
			
			var a= function(){
				var def = $.Deferred();
				$.get('/logining/information', parameters,function(result) {
		            result1=result;
		        	def.resolve("a");
		        });
				return def;
			}
			
			var b= function(data){
				var def = $.Deferred();
				$.get('https://www.reddit.com/r/news/search.json?q='+parameters.title+'&type=link&sort=top&limit=3',  function(result) {
		            
		        	my[0] = result.data.children[0].data.title;
		        	my[1] = result.data.children[1].data.title;
		        	my[2] = result.data.children[2].data.title;
		        	def.resolve(data+"b");
		        });
				return def;
			}
			
			var c= function(data){
				var def = $.Deferred();
				var bbb= '<div class=\'container\'><div class=\"row\"><div class=\"col-md-12\"><table class=\"table table-bordered table-hover table-sm\"><tr><th rowspan=4>Top 3 news</th></tr>'+
	    		'<tr><td>'+my[0]+'</td></tr>'+
	    		'<tr><td>'+my[1]+'</td></tr>'+
	    		'<tr><td>'+my[2]+'</td></tr></table></div></div></div>';

				aaa=result1+bbb;
				$('#information').html(aaa);
				def.resolve(data+"c");
				return def;
			}
			
			a()
			  .then(function (data) {
			    return b(data)
			  })
			  .then(function (data) {
			    return c(data)
			  })	                
		}
		else {
			$('#information').html(aaa);
		} 	
    	
	   });	
});


google.charts.load('current', {packages: ['corechart']});

var options3 = {'title':"Revision Number Distribution Based On User Type For This Article",

    'width':1100,
    'height':600
};

var options4 = {'title':"Revision Number Distributed By Year And By User Type For This Article",
	    'width':1100,
	    'height':600
	};

function drawPie(data){
   	graphData = new google.visualization.DataTable();
   	graphData.addColumn('string', 'Element');
   	graphData.addColumn('number', 'Percentage');
	$.each(data, function(key, val) {
		graphData.addRow(val);
	});
	var chart = new google.visualization.PieChart($("#information")[0]);
	chart.draw(graphData, options3);
}

function drawBar1(data){
    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'Element');
    graphData.addColumn('number', 'Regular');
    graphData.addColumn('number', 'Anon');
    graphData.addColumn('number', 'Administrator');
    graphData.addColumn('number', 'Bot');
       
    $.each(data, function(index,val) {
        graphData.addRow(val);       
    })
    var chart = new google.visualization.ColumnChart($("#information")[0]);

    chart.draw(graphData, options4);
}

$(document).ready(function() {
    
    $("#pie").click(function(event){
    	if(change[0]==0){
    		change[0] = 1;
    		$.getJSON('/logining/getGraphs1',parameters, function(rdata) {
    	    	data1 = rdata;
    	    	event.preventDefault();
    	    	drawPie(rdata);
    	    });
    	}
    	else{
    		event.preventDefault();
	    	drawPie(data1);
    	}  	    	
	   });
	   
	$("#bar1").click(function(event){
		
		$.getJSON('/logining/getGraphs2',parameters, function(rdata) {			
			event.preventDefault();
	        drawBar1(rdata);
	    });       
    })
    $("#bar2").click(function(event){
    	
    	$.get('/logining/getGraphs3', parameters,function(result) {
            $("#information").html(result);
        });        
    })	
});

$(document).ready(function() {
	$("#searchAuthor").click(function(event){
				
		var authorName = {user: $('#authorName').val() };
		
        $.get('/logining/userInformation',authorName, function(result) {
            $('#authorInfo').html(result);
        });		
	});
});

$(document).ready(function() {
		
	var a= function(){
		var def = $.Deferred();
		$.getJSON('/logining/getSource', function(result) {
	    	
	    	cache = result; 
	    	def.resolve("a");
	    });
		return def;
	}
	
	var b= function(data){
		var def = $.Deferred();
		$(function() {
		    var availableTags = cache;
		    $( "#authorName" ).autocomplete({
		    	matchContains:false,
		    	minLength:3,
		    	maxHeight: 100,
		      source: availableTags
		    });
		    def.resolve(data+"b");
		  });
		return def;
	}
		
	a()
	  .then(function (data) {
	    return b(data)
	  })
	  
});
