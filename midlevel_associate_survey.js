var isie = true;
var xml1;
var xml2;
var map;
var url = window.location.href;

$(document).ready(function() {
	//for browser detection
//	if($.browser.webkit){
//		b = 'wk';
//		isie = false;
//	}
//	if($.browser.safari){
//		b = 's';
//		isie = false;
//	}
//	if($.browser.mozilla){
//		b = 'mz';
//		isie = false;
//	}
//	if($.browser.opera){
//		b = 'o';
//		isie = false;
//				 
	$.get('midlevel_associate_survey-index_content.html', function(data){
		$('#midlevel_associate_survey-container').html(data);

		buildPage();
	})
});//end document ready
			
function buildPage(){
	//get css
	var style = 'midlevel_associate_survey.css';

//	if($.browser.msie){
//		isie = true;
				
//		document.createStyleSheet(style);

//		if($.browser.version == 7){
			
//		}
//	}else{
		var link = $('<link />');
		
		$(link).attr({ type: 'text/css', rel: 'stylesheet', href: style });
		$("head").append( link );
//	}	
	
	//get xml for map 1
	$.get('midlevel_city-map1.xml', function(data){
          xml1 = data;
           map = 1;
          buildMap(data, 1);
    });
    
    $.get('midlevel_city-map2.xml', function(data){
          xml2 = data;
    });
    
     //init state for map2
	$('#midlevel_associate_survey-map2_img').animate({'width':'25px', 'height':'25px', 'top':'180px', 'right':'40px', 'opacity': 0.0 },{queue:false, duration:1000, easing:"circEaseOut"});

	//map zoom
	$('#midlevel_associate_survey-map_zoom').click(function(){
		map = 2;
		
		//remove the pop-up if displayed
		$('#midlevel_associate_survey-answers_container').css('display', 'none');
		
		//clear content of map2
		$('#midlevel_associate_survey-map2_container').html('<div id="map2_0"></div><div id="midlevel_associate_survey-map2_close" class="floatR"><img src="images/map2_close.png" width="98" height="15" alt="close" title="close" /></div><div class="clear"></div>');
		
		//display click block
		$('#midlevel_associate_survey-click_block').css('display', 'block');
		$('#midlevel_associate_survey-click_block').css('cursor', 'pointer');
		
		//animate map2
		$('#midlevel_associate_survey-map2_img').css('visibility', 'visible');
		$('#midlevel_associate_survey-map2_img').animate({'width':'503px', 'height':'436px', 'top':'0px', 'right':'10px', 'opacity': 1.0 },{queue:false, duration:1000, easing:"circEaseOut", complete: function(){
			$(this).css('visibility', 'hidden');
			
			$('#midlevel_associate_survey-map2_container').css('display', 'block');
			
			//display map2 close
			$('#midlevel_associate_survey-map2_close').css('display', 'block');
		
			//map2 close click
			$('#midlevel_associate_survey-map2_close').click(function(){
				closeMap2();
			});
		
			buildMap(xml2, 2);
		}});
	});
	
	$('#midlevel_associate_survey-click_block').click(function(){
		closeMap2();
	});
};//end buildPage

function closeMap2(){
	map = 1;
	
	//remove the pop-up if displayed
	$('#midlevel_associate_survey-answers_container').css('display', 'none');
	$('#midlevel_associate_survey-map2_img').css('visibility', 'visible');
	$('#midlevel_associate_survey-map2_container').css('display', 'none');
	//animate map2
	$('#midlevel_associate_survey-map2_img').animate({'width':'25px', 'height':'25px', 'top':'180px', 'right':'40px', 'opacity': 0.0 },{queue:false, duration:1000, easing:"circEaseOut", complete: function(){
		$('#midlevel_associate_survey-map2_img').css('visibility', 'hidden');
		//hide click block
		$('#midlevel_associate_survey-click_block').css('display', 'none');
	}});
	
};

function buildMap(xml, map){
	var i = 0;
	var incr = 1;
		
	$(xml).find('city').each(function(){
		var cityName = $(this).attr('cityName').toUpperCase();
		var x = parseInt($(this).attr('x'));
		var y = parseInt($(this).attr('y'));
		var tooltipX = x - 128;
		var tooltipY = y - 143;
		var cityScore = $(this).find('cityScore').text();
		var cityRank = $(this).find('cityRank').text();
		var mapContainer;
		var cityID;
		
		$('#midlevel_associate_survey-map'+map+'_container #map'+map+'_'+i).after('<div id="midlevel_associate_survey-city_map'+map+'_'+i+'"><!--tooltip--><div class="midlevel_associate_survey-tooltip"><div class="midlevel_associate_survey-tooltip_top"></div><!--end midlevel_associate_survey-tooltip_top--><div class="midlevel_associate_survey-tooltip_mid" style="color:#716F4B;"><span class="midlevel_associate_survey-tooltip_cityName">'+cityName+'</span><br /><span class="midlevel_associate_survey-cityScore">Average Score: '+cityScore+'</span><br /><span class="midlevel_associate_survey-cityRank">City Rank: '+cityRank+'</span><br /><div class="midlevel_associate_survey-clickformore" style="color:#999; font-size:8pt; padding-top:4px;">Click for more details</div></div><!--end midlevel_associate_survey-tooltip_mid--><div class="midlevel_associate_survey-tooltip_bot"></div><!--end midlevel_associate_survey-tooltip_bot--></div><!--end midlevel_associate_survey-tooltip--><!--marker--><div class="midlevel_associate_survey-marker"><img src="images/map_icon.png" width="10" height="10" /></div><!--end midlevel_associate_survey-marker--></div><!--end midlevel_associate_survey-city'+i+'--><div id="map'+map+'_'+incr+'"></div>');
			
		//position marker
		$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-marker').css('left', x+'px');
		$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-marker').css('top', y+'px');
		
		//general styles for marker
		$('.midlevel_associate_survey-marker').css({'position':'absolute', 'z-index':'3', 'cursor':'pointer'});
		$('.midlevel_associate_survey-marker img').css({'position':'relative'});
			
		//general styles for tooltip
		$('.midlevel_associate_survey-tooltip').css({'font-size':'10pt', 'position':'absolute', 'z-index':'2', 'display':'none'});
		$('.midlevel_associate_survey-tooltip_cityName').css({'color':'#333', 'font-weight':'bold', 'line-height':'15pt'});
		$('.midlevel_associate_survey-cityScore').css({'line-height':'18pt'});
			
		//if tooltip is too far left
		//check if map2  - different coords for too far top
		/*var map2 = false;
		
		if(map == 2){
			if(y <= 104){
				map2 = true;
			}else{
				map2 = false;
			}
		}*/
			
		if(x <= 219 && y >= 111){
			//set bg images
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip_top').css({'width':'180px', 'height':'17px', 'background-image':'url(/image/tal/midlevel_associates/2012/tooltip_left_top.png)', 'background-repeat':'no-repeat'});
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip_mid').css({'width':'140px', 'height':'auto', 'background-image':'url(/image/tal/midlevel_associates/2012/tooltip_left_mid.png)', 'background-repeat':'repeat-y', 'padding':'0 20px 0 20px'});
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip_bot').css({'width':'180px', 'height':'45px', 'background-image':'url(/image/tal/midlevel_associates/2012/tooltip_left_bot.png)', 'background-repeat':'no-repeat'});
				
			//position tooltip
			tooltipX = x - 35; 
				
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip').css('left', tooltipX+'px');
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip').css('top', tooltipY+'px');
			
		//if tooltip is too far top
		}else if(y <= 110 || map == 2){
			//set bg images
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip_top').css({'width':'180px', 'height':'45px', 'background-image':'url(/image/tal/midlevel_associates/2012/tooltip_top_bot.png)', 'background-repeat':'no-repeat'});
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip_mid').css({'width':'140px', 'height':'auto', 'background-image':'url(/image/tal/midlevel_associates/2012/tooltip_top_mid.png)', 'background-repeat':'repeat-y', 'padding':'0 20px 0 20px'});
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip_bot').css({'width':'180px', 'height':'17px', 'background-image':'url(/image/tal/midlevel_associates/2012/tooltip_top_top.png)', 'background-repeat':'no-repeat'});
				
			//position tooltip
			tooltipX = x - 35; 
			tooltipY = y - (-12);
				
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip').css('left', tooltipX+'px');
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip').css('top', tooltipY+'px');
			
		//standard tooltip styles
		}else if(x >= 122 && y >= 111){
			//set bg images
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip_top').css({'width':'180px', 'height':'17px', 'background-image':'url(/image/tal/midlevel_associates/2012/tooltip_top.png)', 'background-repeat':'no-repeat'});
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip_mid').css({'width':'140px', 'height':'auto', 'background-image':'url(/image/tal/midlevel_associates/2012/tooltip_mid.png)', 'background-repeat':'repeat-y', 'padding':'0 20px 0 20px'});
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip_bot').css({'width':'180px', 'height':'45px', 'background-image':'url(/image/tal/midlevel_associates/2012/tooltip_bot.png)', 'background-repeat':'no-repeat'});
				
			//position tooltip
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip').css('left', tooltipX+'px');
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-tooltip').css('top', tooltipY+'px');
		}
			
		//if city is New Jersey - change tooltip text(click functionality is in marker.click)
		if(cityName == "NEW JERSEY"){
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-cityScore').html('Click map marker for more details');
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-cityRank').css('display', 'none');
			$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-clickformore').css('display', 'none');
		}
			
		//hover for markers
		$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-marker img').hover(function(){
			//remove any tooltips
			$('.midlevel_associate_survey-tooltip').css('display', 'none');
			animateMarker(this, 'up');
		}, function(){
			//remove any tooltips
			$('.midlevel_associate_survey-tooltip').css('display', 'none');
			animateMarker(this, 'down');
		});
			
		//click for markers
		$('#midlevel_associate_survey-city_map'+map+'_'+i+' .midlevel_associate_survey-marker img').click(function(){
			//window.location.href = url + '#midlevel+associate_survey-page_marker';
			location.hash = 'midlevel+associate_survey-page_marker';
			
			//if city is New Jersey - change click functionality
			if(cityName == "NEW JERSEY"){
				map = 2;
		
				//remove the pop-up if displayed
				$('#midlevel_associate_survey-answers_container').css('display', 'none');
		
				//clear content of map2
				$('#midlevel_associate_survey-map2_container').html('<div id="map2_0"></div><div id="midlevel_associate_survey-map2_close" class="floatR"><img src="images/map2_close.png" width="98" height="15" alt="close" title="close" /></div><div class="clear"></div>');
		
				//display click block
				$('#midlevel_associate_survey-click_block').css('display', 'block');
				$('#midlevel_associate_survey-click_block').css('cursor', 'pointer');
		
				//animate map2
				$('#midlevel_associate_survey-map2_img').css('visibility', 'visible');
				$('#midlevel_associate_survey-map2_img').animate({'width':'503px', 'height':'436px', 'top':'0px', 'right':'10px', 'opacity': 1.0 },{queue:false, duration:1000, easing:"circEaseOut", complete: function(){
					$(this).css('visibility', 'hidden');
			
					$('#midlevel_associate_survey-map2_container').css('display', 'block');
			
					//display map2 close
					$('#midlevel_associate_survey-map2_close').css('display', 'block');
		
					//map2 close click
					$('#midlevel_associate_survey-map2_close').click(function(){
						closeMap2();
					});
		
					buildMap(xml2, 2);
				}});
			}else{
				//init/build table
				initTable(cityName);
			}
		});	
			
		i++;
		incr++;
	});
};//end buildMap

function animateMarker(marker, d){
	var markerCont = $(marker).parent();
	var tooltipCont = $(markerCont).parent();
	if(d == 'up'){
		$(markerCont).css('z-index', '2');
		$('.midlevel_associate_survey-tooltip').css('z-index', '4');
		$(marker).animate({'height': '28'},{queue:false, duration:150, easing:"circEaseOut"});
		$(marker).animate({'width': '28'},{queue:false, duration:150, easing:"circEaseOut"});
		$(marker).animate({'top': '-8'},{queue:false, duration:150, easing:"circEaseOut"});
		$(marker).animate({'left': '-9'},{queue:false, duration:150, easing:"circEaseOut"});
		$('.midlevel_associate_survey-tooltip', tooltipCont).css('display', 'block');
	}else if(d == 'down'){
		$(markerCont).css('z-index', '1');
		$('.midlevel_associate_survey-tooltip').css('z-index', '2');
		$(marker).animate({'height': '10'},{queue:false, duration:150, easing:"circEaseOut"});
		$(marker).animate({'width': '10'},{queue:false, duration:150, easing:"circEaseOut"});
		$(marker).animate({'top': '0'},{queue:false, duration:150, easing:"circEaseOut"});
		$(marker).animate({'left': '0'},{queue:false, duration:150, easing:"circEaseOut"});
		$('.midlevel_associate_survey-tooltip', markerCont).css('display', 'none');
	}
};//end animateMarker

function initTable(cityName){
	$('#midlevel_associate_survey-table-header').css('display', 'block');
	
	$('#midlevel_associate_survey-table_container').html('<table cellspacing="0" cellpadding="0" border="0" class="tablescroll" style="width:730px; margin:0; border:1px solid #c2beac; border-bottom:none; color:#716F4B;"><thead><tr style="background-color:#E0DCCA;"><th width="30" style="padding:10px; border-left:1px solid #c2beac; border-right:1px solid #c2beac; border-top:1px solid #c2beac; width:30px;">Rank</th><th width="495" style="padding:10px; border-right:1px solid #c2beac; border-top:1px solid #c2beac; width:495px;">Firm</th><th width="76" style="padding:10px; border-right:1px solid #c2beac; border-top:1px solid #c2beac; width:76px;">Respondents</th><th width="33" style="padding:10px; width:33px; border-right:1px solid #c2beac; border-top:1px solid #c2beac;">Score</th></tr></thead><tbody><tr style="background-color:#d89898;"><td width="30" style="width:30px;"></td><td width="495" style="width:495px;"></td><td width="76" style="width:76px;"></td><td width="33" style="width:33px;"></td></tr></tbody></table>');
	
	$.get('midlevel_city-data.xml', function(data){
          buildTable(data, cityName);
    });
};//end initTable

function buildTable(xml, cityName){
	var alternate = false;
	var maxNum;
	
	$('#midlevel_associate_survey-table-cityname').html(cityName);
	
	buildSalaryTable(cityName);
	
	$(xml).find('city').each(function(){
		var city = $(this).attr('cityName').toUpperCase();
		
		if(city == cityName){
			maxNum = $(this).find('firm').length;
			var natrank = $(this).attr('natRank');
			
			$(this).find('firm').each(function(i){
				//get the data
				var firmName = $(this).find('firmName').text();
				var firmScore = $(this).find('firmScore').text();
				var cityAvgScore = $(this).find('cityAvgScore').text();
				var respondents = $(this).find('respondents').text();
				var rank = $(this).find('firmRank').text();
				
				//score/rank
				$('#midlevel_associate_survey-score').html(cityAvgScore);
				$('#midlevel_associate_survey-rank').html(natrank);
				
				if(rank == '0'){
					$('#midlevel_associate_survey-table_container').html('<table cellspacing="0" cellpadding="0" border="0" class="tablescroll" style="width:730px; margin:0; border:1px solid #c2beac; border-bottom:none; color:#716F4B;"><thead><tr style="background-color:#E0DCCA;"><th width="495" style="padding:10px; border-right:1px solid #c2beac; border-top:1px solid #c2beac; border-left:1px solid #c2beac; width:495px;">Firm</th><th width="76" style="padding:10px; border-right:1px solid #c2beac; border-top:1px solid #c2beac; width:76px;">Respondents</th><th width="33" style="padding:10px; width:33px; border-top:1px solid #c2beac; border-right:1px solid #c2beac;">Score</th></tr></thead><tbody><tr style="background-color:#fff;"><td width="495" style="padding:10px; border-right:1px solid #c2beac; border-bottom:1px solid #c2beac; width:495px;"><div id="midlevel_associate_survey-table-firmname" class="floatL">'+firmName+'</div><div id="midlevel_associate_survey-clickformore" class="floatR">(Click for survey results)</div><div class="clear"></div></td><td width="76" style="padding:10px; text-align:right; border-right:1px solid #c2beac; border-bottom:1px solid #c2beac; width:76px;">'+respondents+'</td><td width="33" style="padding:10px; text-align:right; border-bottom:1px solid #c2beac; border-bottom:1px solid #c2beac; width:33px;">'+firmScore+'</td></tr></tbody></table>');
				}else{
					//build the table
					if(alternate == false){
						$('#midlevel_associate_survey-table_container table >tbody > tr:last').after('<tr style="background-color:#fff;"><td width="30" style="padding:10px; text-align:right; border-right:1px solid #c2beac; border-bottom:1px solid #c2beac; width:30px;">'+rank+'</td><td width="495" style="padding:10px; border-right:1px solid #c2beac; border-bottom:1px solid #c2beac; width:495px;"><div id="midlevel_associate_survey-table-firmname" class="floatL">'+firmName+'</div><div id="midlevel_associate_survey-clickformore" class="floatR">(Click for survey results)</div><div class="clear"></div></td><td width="76" style="padding:10px; text-align:right; border-right:1px solid #c2beac; border-bottom:1px solid #c2beac; width:76px;">'+respondents+'</td><td width="33" style="padding:10px; text-align:right; border-bottom:1px solid #c2beac; width:33px;">'+firmScore+'</td></tr>');
					
						alternate = true;
					}else{
						$('#midlevel_associate_survey-table_container table >tbody > tr:last').after('<tr style="background-color:#f1efe5;"><td width="30" style="padding:10px; text-align:right; border-right:1px solid #c2beac; border-bottom:1px solid #c2beac; width:30px;">'+rank+'</td><td width="495" style="padding:10px; border-right:1px solid #c2beac; border-bottom:1px solid #c2beac; width:495px;"><div id="midlevel_associate_survey-table-firmname" class="floatL">'+firmName+'</div><div id="midlevel_associate_survey-clickformore" class="floatR">(Click for survey results)</div><div class="clear"></div></td><td width="76" style="padding:10px; text-align:right; border-right:1px solid #c2beac; border-bottom:1px solid #c2beac; width:76px;">'+respondents+'</td><td width="33" style="padding:10px; text-align:right; border-bottom:1px solid #c2beac; width:33px;">'+firmScore+'</td></tr>');
					
						alternate = false;
					}
				}
				if(i == maxNum-1){
					if(parseInt($('table.tablescroll > tbody').css('height')) >= 210){
						$('table.tablescroll').css('width', '714px');
					}else{
						$('table.tablescroll').css('width', '730px');
					}
					
					initNav(xml);
					
					$('table.tablescroll').tableScroll({height:205});
				}
			});
		}
	});
};//end buildTable

function buildSalaryTable(cityname){
	//clear data
	$('#midlevel_associate_survey-salary_table-container').html('');
	
	//get the xml(based on what map currently on)
	$.get('midlevel_city-map'+map+'.xml', function(data){
		$(data).find('city').each(function(){
			var city = $(this).attr('cityName').toUpperCase();
			
			if(city == cityname){
				var third = $(this).find('thirdyearSal').text();
				var fourth = $(this).find('fourthyearSal').text();
				var fifth = $(this).find('fifthyearSal').text();
				var overall = $(this).find('avgSal').text();
				
				if(third == 'N/A' && fourth == 'N/A' && fifth == 'N/A' && overall == 'N/A'){
					$('#midlevel_associate_survey-salary_table-container').css('display', 'none');
				}else{
					$('#midlevel_associate_survey-salary_table-container').css('display', 'block');
				}
				
				$('#midlevel_associate_survey-salary_table-container').html('<table cellspacing="0" cellpadding="0" border="0" style="margin:15px 0;"><tr><td style="padding:5px 10px; text-align:right; font-weight:bold; border-right:1px dotted #c2beac;" rowspan="2">Average<br>Salary</td><td style="padding:5px 10px; text-align:right; font-weight:bold; border-bottom:1px dotted #c2beac; border-right:1px dotted #c2beac;">3rd Year</td><td style="padding:5px 10px; text-align:right; font-weight:bold; border-bottom:1px dotted #c2beac; border-right:1px dotted #c2beac;">4th Year</td><td style="padding:5px 10px; text-align:right; font-weight:bold; border-bottom:1px dotted #c2beac; border-right:1px dotted #c2beac;">5th Year</td><td style="padding:5px 0px 5px 10px; text-align:right; font-weight:bold; border-bottom:1px dotted #c2beac;">Overall</td></tr><tr><td style="padding:5px 10px; text-align:right; font-weight:normal; border-right:1px dotted #c2beac;">'+third+'</td><td style="padding:5px 10px; text-align:right; font-weight:normal; border-right:1px dotted #c2beac;">'+fourth+'</td><td style="padding:5px 10px; text-align:right; font-weight:normal; border-right:1px dotted #c2beac;">'+fifth+'</td><td style="padding:5px 0 5px 10px; text-align:right; font-weight:normal;">'+overall+'</td></tr></table>');
			}
		});
	});
	
};//end buildSalaryTable

function initNav(xml){
	var backgroundcolor;
	
	//hover
	$('table.tablescroll > tbody tr').hover(function(){
		backgroundcolor = $(this).css('background-color');
		$(this).css("cssText", "color: #fff !important; background-color: #918863 !important;");
		$('#midlevel_associate_survey-clickformore', this).css('display', 'block');
	}, function(){
		$(this).css("cssText", "color: #716F4B !important; background-color:"+backgroundcolor+" !important;");
		$('#midlevel_associate_survey-clickformore', this).css('display', 'none');
	});
	
	//click
	$('table.tablescroll > tbody tr').click(function(){
		var firmname = $(this).find('#midlevel_associate_survey-table-firmname').text();
		var city = $('#midlevel_associate_survey-table-cityname').html();
		var cityname;
		
		$('#midlevel_associate_survey-answers-firmname').html(firmname);
		$('#midlevel_associate_survey-answers-firmname').css('text-transform', 'uppercase');
		
		//clear the data
		$('#midlevel_associate_survey-interesting').html('');
		$('#midlevel_associate_survey-satisfying').html('');
		$('#midlevel_associate_survey-benefits').html('');
		$('#midlevel_associate_survey-associate_relations').html('');
		$('#midlevel_associate_survey-partner_relations').html('');
		$('#midlevel_associate_survey-training').html('');
		$('#midlevel_associate_survey-management').html('');
		$('#midlevel_associate_survey-communication').html('');
		$('#midlevel_associate_survey-billables').html('');
		$('#midlevel_associate_survey-attitude').html('');
		$('#midlevel_associate_survey-expect').html('');
		$('#midlevel_associate_survey-overall').html('');
		
		$(xml).find('city').each(function(){
			if($(this).attr('cityName').toUpperCase() == city){
				$(this).find('firm').each(function(){
					if($(this).find('firmName').text() == firmname){
						//get the data
						var interestingWork = $(this).find('interestingWork').text();
						var satisfyingWork = $(this).find('satisfyingWork').text();
						var benefits = $(this).find('benefits').text();
						var associateRelations = $(this).find('associateRelations').text();
						var partnerRelations = $(this).find('partnerRelations').text();
						var trainingGuidance = $(this).find('trainingGuidance').text();
						var managementOpenness = $(this).find('managementOpenness').text();
						var communication = $(this).find('communication').text();
						var billables = $(this).find('billables').text();
						var attitude = $(this).find('attitude').text();
						var expect2years = $(this).find('expect2years').text();
						var overall = $(this).find('overall').text();
						cityname = $(this).find('cityname').text();
						
						//display the data
						$('#midlevel_associate_survey-interesting').html(interestingWork);
						$('#midlevel_associate_survey-satisfying').html(satisfyingWork);
						$('#midlevel_associate_survey-benefits').html(benefits);
						$('#midlevel_associate_survey-associate_relations').html(associateRelations);
						$('#midlevel_associate_survey-partner_relations').html(partnerRelations);
						$('#midlevel_associate_survey-training').html(trainingGuidance);
						$('#midlevel_associate_survey-management').html(managementOpenness);
						$('#midlevel_associate_survey-communication').html(communication);
						$('#midlevel_associate_survey-billables').html(billables);
						$('#midlevel_associate_survey-attitude').html(attitude);
						$('#midlevel_associate_survey-expect').html(expect2years);
						$('#midlevel_associate_survey-overall').html(overall);
						
						$('#midlevel_associate_survey-answers_container ').css('display', 'block');
						$('#midlevel_associate_survey-answers_container').draggable();
					}
				})
			}
		});
		
		$('#midlevel_associate_survey-answers-cityname').html(cityname);
	});
	
	//close
	$('#midlevel_associate_survey-answers-close').click(function(){
		$('#midlevel_associate_survey-answers_container ').css('display', 'none');
	});
};//end initNav
