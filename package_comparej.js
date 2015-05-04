// GLOBALS ////////////////////////////////////////////////////////////////////////////////////

var currentPackage = '';
var requestedPackage = '';
var varCount1 = 0;
var varCount2 = 0;
var varCount3 = 0;
var varCount4 = 0;
var varPubCount = 0;
var ourEVO = '';
var varTEXT1 = '';
var varTEXT2 = '';
var varTEXT3 = '';
var varTEXT4 = '';
var xtraMsg = '';
var xtraMsg2 = '';
var varGenre = '';
var site = '';
var varCurrentPackageURL = '';
var column = '+ChannelNumber';

varStartTable ='<table cellpadding="0" cellspacing="0" border="0" width="200" class="rows">';

varTableHead1 =	'';

varTableHead2 =		'<table class="rows" width="200"><thead>' +
						'<tr>'+
							'<th align="center" width="12"><font color="black"> # </font></th>' +
							'<th align="center"><font color="black">Channel Name</font></th>' +
							'<th align="center" width="41"><font color="black">Genre</font></th>' +
							'</tr>'+
						'</thead></table>';

varTableHead3 =		'<table class="rows" width="200"><thead>' +
						'<tr>'+
							'<th align="center" width="12"><font color="black"> # </font></th>' +
							'<th align="center"><font color="black">Channel Name</font></th>' +
							'<th align="center" width="41"><font color="black">Genre</font></th>' +
							'</tr>'+
						'</thead></table>';

varTableHead4 = '';
										
varEndTable = 		'</table>';



function why(val)
{	
	$("#why").css({"left":700,"top":110});
	$('.why_box').toggle();  // show the container
}


function setEVOrange(val)
{
	ourEVO = val;
	$('.COMcurrentPackage').show();
	$('.COMrequestedPackage').show();
	
	//fill in prices
	
	if (val=="0-50"){
		com_choice_price= '($62.99)';
		com_choice_plus_price='($203.99)';
	}else if (val=="51-100"){
		com_choice_price= '($74.99)';
		com_choice_plus_price='(243.99)';
	}else if (val=="101-150"){
		com_choice_price= '($88.99)';
		com_choice_plus_price='($294.99)';
	}else if (val=="151-200"){
		com_choice_price= '($108.99)';
		com_choice_plus_price='($345.99)';
	}else if (val=="201-500"){
		com_choice_price= '($123.99)';
		com_choice_plus_price='($397.99)';
	}else if (val=="501-1000"){
		com_choice_price= '($143.99)';
		com_choice_plus_price='($425.99)';
	}else if (val=="1001-2000"){
		com_choice_price= '($177.99)';
		com_choice_plus_price='($456.99)';
	}else if (val=="2000+"){
		com_choice_price= '($205.99)';
		com_choice_plus_price='($493.99)';
	}
	
	$('#COMcurrentPackage option').eq(8).text('Com Choice '+com_choice_price);
	$('#COMcurrentPackage option').eq(9).text('Com Choice Plus* '+com_choice_plus_price);
	$('#COMrequestedPackage option').eq(6).text('Com Choice '+com_choice_price);
	$('#COMrequestedPackage option').eq(7).text('Com Choice Plus* '+com_choice_plus_price);
			  
}




					  


function reSort(col)
{
	column = col;
	setCurrentValue(currentPackage);
	// DISPLAY THE PLUS/MINUS IMAGES
	$('#current_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#gained_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#lost_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#requested_plus').attr("src","%%pub%%system/img/chan_plus.png");
}


function setCurrentValue(val)
{	
currentPackage = val;	
	if (requestedPackage!='')
	{
		$('#current_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#gained_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#lost_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#requested_plus').attr("src","%%pub%%system/img/chan_plus.png");
		$('.all_text').hide();
		$('.warning_box').hide();
		varTEXT1 = '';
		varTEXT2 = '';
		varTEXT3 = '';
		varTEXT4 = '';
		varCount1 = 0;
		varCount2 = 0;
		varCount3 = 0;
		varCount4 = 0;
		currentPackage = currentPackage.replace(/_/g," ");	
		requestedPackage = requestedPackage.replace(/_/g," ");
		displayResults(currentPackage,requestedPackage);
	}
}

function setRequestedValue(val)
{
	requestedPackage = val;	
	if (currentPackage!='')
	{	
		if ((requestedPackage=='Commercial Xtra Pack' || requestedPackage=='Commercial Entertainment Pack' || requestedPackage=='Comercial Mas Ultra Pack') && (ourEVO!='0-50' && ourEVO!='51-100'))
		{
			alert('The package chosen is meant for EVO of 100 or less. Please choose another package.');
		}
		else{
			$('#current_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#gained_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#lost_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#requested_plus').attr("src","%%pub%%system/img/chan_plus.png");
			$('.all_text').hide();
			$('.warning_box').hide();
			varTEXT1 = '';
			varTEXT2 = '';
			varTEXT3 = '';
			varTEXT4 = '';
			varCount1 = 0;
			varCount2 = 0;
			varCount3 = 0;
			varCount4 = 0;
			currentPackage = currentPackage.replace(/_/g," ");	
			requestedPackage = requestedPackage.replace(/_/g," ");
			displayResults(currentPackage,requestedPackage);
		}

	}
	else alert("Please select the customer's current package.");
}


function displayResults(varX,varY){
	$('.sort_radio').show();
	if (varX === undefined || varX === "=" || varY ===undefined || varY === "=") {
		return;
	} else{
		var result = "";
		var callType = "%%pub%%";
		var priceCustPack = packagePricing(varX);
		var priceAgentPack = packagePricing(varY);

		if (priceCustPack < priceAgentPack) {result = "UpSell";} 
		else if (priceCustPack > priceAgentPack) {result = "DownGrade";}
		else {result = "No Change";}

		dcsMultiTrack("DCSext.tool_package_compare_selected_packages",varX+"-"+varY+"-"+result+"-"+callType);
	};
	if (site =='com')
{
		COMChannels.Sort = column;
		COMChannels.Reset();
		rsChannels = COMChannels.recordset;
}
	else {
		Channels.Sort = column;
		rebate_action();
		Channels.Reset();
		rsChannels = Channels.recordset;
	} 	
	rsChannels.MoveFirst();		//resets recordset..
	//alert(varX+"  --  "+varY);
	if (varX!='' && varY!='')
	{
		while (!rsChannels.EOF){
			varPackage1 = rsChannels.Fields(varX).value;
			varOurPackage = rsChannels.Fields("Packages").value;
					while(varPackage1.charAt(varPackage1.length-1) == " "){				//removes any trailing spaces
				varPackage1 = varPackage1.substring(0,varPackage1.length-1);
			}
			while(varPackage1.substring(0,1) ==" "){										//removes any leading spaces
				varPackage1 = varPackage1.substring(1,varPackage1.length);
			}		
			varPackage2 = rsChannels.Fields(varY).value;
			while(varPackage2.charAt(varPackage2.length-1) == " "){				//removes any trailing spaces
				varPackage2 = varPackage2.substring(0,varPackage2.length-1);
			}
			while(varPackage2.substring(0,1) ==" "){										//removes any leading spaces
				varPackage2 = varPackage2.substring(1,varPackage2.length);
			}	
			
			
			// show all the channels included with the FIRST package selected ////////////////////////////////////////////////////////////////////////////////////		
			if(varOurPackage == currentPackage){	
				varCurrentPackageURL = rsChannels.Fields('PackagesURL').value;
				varTableHead1 =		'<table class="rows" width="190"><thead>' +
								'<tr>'+
									'<th align="center" colspan="2"><a href="%%pub%%programming/'+ varCurrentPackageURL +'" target="_blank"><br>'+currentPackage+'</a></th>' +
								'</tr><tr>'+
									'<th align="center"><font color="black" width="12"> # </font></th>' +
									'<th align="center"><font color="black">Channel Name</font></th>' +
								'</tr>'+
								'</thead></table>';
				
			}
			if(varOurPackage == requestedPackage){	
				varRequestedPackageURL = rsChannels.Fields('PackagesURL').value;
				varTableHead4 =		'<table class="rows" width="190"><thead>' +
								'<tr>'+
									'<th align="center" colspan="2"><a href="%%pub%%programming/'+ varRequestedPackageURL +'" target="_blank"><br>'+requestedPackage+'</a></th>' +
								'</tr><tr>'+
									'<th align="center" width="12"><font color="black"> # </font></th>' +
									'<th align="center"><font color="black">Channel Name</font></th>' +
									'</tr>'+
								'</thead></table>';
			}
							
			if(varPackage1 == 'x'){	
				if (site =='com')
					varChannelName = rsChannels('ChannelNameBold');
				else varChannelName = rsChannels('ChannelName');
				
				varChannelNumber = rsChannels('ChannelNumber');
				varURL = rsChannels('URL');			
				varTEXT1 = varTEXT1 +  '<tr><td align="center" valign="top" width="12">&nbsp;' + varChannelNumber + '&nbsp;</td><td><a target="_blank" href=' + varURL + '>' + varChannelName + '</a></td></tr>';
				varCount1++;
			}
					
			// show all the channels included with the SECOND package, but not the FIRST (upgrade package) /////////////////////////////////////////////////////////	
			if((varPackage1 != 'x') && (varPackage2 == 'x')){	
				if (site =='com')
					varChannelName = rsChannels('ChannelNameBold');
				else {
					varChannelName = rsChannels('ChannelName');
					varGenre = rsChannels('Genre');
				}
				varChannelNumber = rsChannels('ChannelNumber');
				varURL = rsChannels('URL');			
				varTEXT2 = varTEXT2 +  '<tr><td align="center" valign="top" width="12">&nbsp;' + varChannelNumber + '&nbsp;</td><td><a target="_blank" href=' + varURL + '>' + varChannelName + '</a></td><td width="41">' + varGenre + '</td></tr>';
				varCount2++;
			}
	
	
			// show all the channels included with the FIRST package, but not the SECOND (downgrade package) ////////////////////////////////////////////////////////
			if((varPackage1 == 'x') && (varPackage2 != 'x')){	
				if (site =='com')
					varChannelName = rsChannels('ChannelNameBold');
				else {
					varChannelName = rsChannels('ChannelName');
					varGenre = rsChannels('Genre');
				}
				varChannelNumber = rsChannels('ChannelNumber');
				varURL = rsChannels('URL');
				varTEXT3 = varTEXT3 +  '<tr><td align="center" valign="top" width="12">&nbsp;' + varChannelNumber + '&nbsp;</td><td><a target="_blank" href=' + varURL + '>' + varChannelName + '</a></td><td width="41">' + varGenre + '</td></tr>';
				varCount3++;
			}
	
			// show all the channels included with the SECOND package, but not the FIRST (upgrade package) /////////////////////////////////////////////////////////	
			if(varPackage2 == 'x'){
				if (site =='com')
					varChannelName = rsChannels('ChannelNameBold');
				else varChannelName = rsChannels('ChannelName');
				
				varChannelNumber = rsChannels('ChannelNumber');
				varURL = rsChannels('URL');
				varTEXT4 = varTEXT4 +  '<tr><td align="center" valign="top" width="12">&nbsp;' + varChannelNumber + '&nbsp;</td><td><a target="_blank" href=' + varURL + '>' + varChannelName + '</a></td></tr>';
				varCount4++;
			}
	
			rsChannels.MoveNext();
		}
	}
	
	
				
	/* INITIAL NUMBERS ARE DISPLAYED AFTER BOTH PACKAGES ARE CHOSEN   */	
	varResults1 = 	'<a href="javascript:show_channels(\'current_plus\',1)">'+varCount1+'</a><div id="current_channels_package"></div><div id="current_channels_list"></div>';
	varResults2 = 	'<a href="javascript:show_channels(\'gained_plus\',2)">'+varCount2+'</a><div id="gained_channels_package"></div><div id="gained_channels_list"></div>';
	varResults3 = 	'<a href="javascript:show_channels(\'lost_plus\',3)">'+varCount3+'</a><div id="lost_channels_package"></div><div id="lost_channels_list"></div>';
	varResults4 = 	'<a href="javascript:show_channels(\'requested_plus\',4)">'+varCount4+'</a><div id="requested_channels_package"></div><div id="requested_channels_list"></div>';	
	
					
	//varAdditional = '';			
	varEndTable2 = 		'</td>';
								
	
	
	varTEXT1 =	varStartTable + varTEXT1 + varEndTable + xtraMsg + varEndTable2;
	if (varTEXT2 != ''){varTEXT2 = varStartTable + varTEXT2 + varEndTable + xtraMsg + varEndTable2;} 		//this hides the upgrade column
	if (varTEXT3 != ''){varTEXT3 = varStartTable + varTEXT3 + varEndTable + xtraMsg2 + varEndTable2;}  		//this hides the downgrade column
	if (varTEXT4 != ''){varTEXT4 = varStartTable + varTEXT4 + varEndTable + varEndTable2;} 								//this hides the additonal column
	
	$('#results').show();
	
	// FILL IN CHANNEL NUMBERS
	$('#current_channels').html(varResults1);
	$('#gained_channels').html(varResults2);
	$('#lost_channels').html(varResults3);
	$('#requested_channels').html(varResults4);
	
	// DISPLAY CHANNEL NUMBERS
	$('#current_holder').show();
	$('#gained_holder').show();
	$('#lost_holder').show();
	$('#requested_holder').show();
	
	// DISPLAY THE PLUS/MINUS IMAGES
	$('#current_plus').show();
	$('#gained_plus').show();
	$('#lost_plus').show();
	$('#requested_plus').show();

	
	if(varTEXT2 == ''){
			varTEXT2 = 'No Channels';
			$('#gained_plus').hide();
	}
	
	if(varTEXT3 == ''){
			varTEXT3 = 'No Channels';
			$('#lost_plus').hide();
	}
 } 

function rebate_action()
{
	
	if (currentPackage == "Premier" && requestedPackage != ""){
		$('.premier_text').show();
		$('.warning_box').show();
	}
	else if (currentPackage == "Ultimate" && requestedPackage != "" && requestedPackage != "Premier" && requestedPackage != "Lo Maximo"){
		$('.choice_ultimate_text').show();
		$('.warning_box').show();
	}
	else if (currentPackage == "Xtra" && requestedPackage != "" && (requestedPackage != "Premier" && requestedPackage != "Ultimate" && requestedPackage != "Lo Maximo")){
		$('.warning_box').show();
		$('.choice_xtra_text').show();
	}
	else if (currentPackage == "Choice" && requestedPackage != "" && (requestedPackage != "Premier" && requestedPackage != "Ultimate" && requestedPackage != "Xtra" && requestedPackage != "Lo Maximo")){
		$('.choice_text').show();
		$('.warning_box').show();	
	}
	else if (currentPackage == "Lo Maximo" && requestedPackage != ""){
		$('.lo_maximo_text').show();
		$('.warning_box').show();
	}
	else if (currentPackage == "Mas Ultra" && requestedPackage != "" && requestedPackage != "Premier" && requestedPackage != "Lo Maximo"){
		$('.mas_ultra_text').show();
		$('.warning_box').show();
	}
	else if (currentPackage == "Optimo Mas" && requestedPackage != "" && (requestedPackage != "Choice" && requestedPackage != "Xtra" && requestedPackage != "Entertainment" && requestedPackage != "Premier" && requestedPackage != "Mas Ultra" && requestedPackage != "Choice" && requestedPackage != "Lo Maximo")){
		$('.warning_box').show();
		$('.optimo_mas_text').show();
	}
	else if (currentPackage == "Mas Latino" && requestedPackage != "" && (requestedPackage != "Entertainment" && requestedPackage != "Premier" && requestedPackage != "Ultimate"  && requestedPackage != "Mas Ultra" && requestedPackage != "Optimo Mas" && requestedPackage != "Xtra" && requestedPackage != "Lo Maximo")){
		$('.mas_latino_text').show();
		$('.warning_box').show();	
	}
	else {
		$('.all_text').hide();
		$('.warning_box').hide();
	}
}


// THIS FUNCTION CALLS the other TWO FUNCTIONS THAT SHOW/HIDE THE PLUS/MINUS IMAGE AND THE CHANNEL LISTS
function show_channels(oursign,val)
{
	flip_sign(oursign,val);
	showChannels(val)
}

// SWITCH THE PLUS/MINUS IMAGE
function flip_sign(oursign,val)
{
	if ($('#'+oursign).attr("src").match(/chan_plus.png/) != null)
		$('#'+oursign).attr("src","%%pub%%system/img/chan_minus.png");
	else 
		$('#'+oursign).attr("src","%%pub%%system/img/chan_plus.png");
}

// SHOW/HIDE THE CHANNEL LISTS
function showChannels(val)
{
	if (val==1)

	{
		$('#current_channels_package').html(varTableHead1);
		$('#current_channels_package').toggle();	
		$('#current_channels_list').html(varTEXT1);
		$('#current_channels_list').toggle();
		$('#current_channels_list table.rows tr:odd').addClass('odd');
		$('#current_channels_list table.rows tr:even').addClass('even');
	}
	if (val==2)
	{
		$('#gained_channels_package').html(varTableHead2);
		$('#gained_channels_package').toggle();
		$('#gained_channels_list').html(varTEXT2);
		$('#gained_channels_list').toggle();
		$('#gained_channels_list table.rows tr:odd').addClass('odd');
		$('#gained_channels_list table.rows tr:even').addClass('even');
	}
	if (val==3)
	{
		$('#lost_channels_package').html(varTableHead3);
		$('#lost_channels_package').toggle();
		$('#lost_channels_list').html(varTEXT3);
		$('#lost_channels_list').toggle();
		$('#lost_channels_list table.rows tr:odd').addClass('odd');
		$('#lost_channels_list table.rows tr:even').addClass('even');
	}
	if (val==4)
	{
		$('#requested_channels_package').html(varTableHead4);
		$('#requested_channels_package').toggle();
		$('#requested_channels_list').html(varTEXT4);
		$('#requested_channels_list').toggle();
		$('#requested_channels_list table.rows tr:odd').addClass('odd');
		$('#requested_channels_list table.rows tr:even').addClass('even');
	}
	
       
}

//Package Pricing
function packagePricing(package){
	switch (package) {
		case "Americas Plus":
		case "Mexico Plus":
			return 7.99;
			break;
		case "Basic":
			return 19.99;
			break;
		case "Basic Choice (Int'l)":
			return 17.99;
			break;
		case "Basico":
			return 42.49;
			break;
		case "Choice":
			return 70.99;
			break;
		case "Mas Ultra":
			return 71.99;
			break;
		case "Choice Xtra Classic":
			return 79.49;
			break;
		case "En Espanol":
			return 14.99;
			break;
		case "Entertainment":
			return 59.99;
			break;
		case "Entertainment Classic":
			return 59.99;
			break;
		case "Familiar":
			return 60.99;
			break;
		case "Familiar Ultra":
			return 72.99;
			break;
		case "Family":
			return 29.99;
			break;
		case "Lo Maximo":
		case "Premier":
			return 136.99;
			break;
		case "Mas Mexico":
			return 35.99;
			break;
		case "Mas Latino":
			return 36.99;
			break;
		case "Mas Ultra Original":
			return 69.99;
			break;
		case "Opcion Especial":
			return 45.49;
			break;
		case "Preferred Xtra":
			return 75.99;
			break;
                case "Preferred Choice (Int'l)":
			return 48.99;
			break;
		case "Select Classic":
			return 48.49;
			break;
		case "Opcion Extra Especial":
			return 65.49;
			break;
		case "Opcion Premier":
			return 136.99;
			break;
		case "Opcion Ultra Especial":
			return 67.49;
			break;
		case "Optimo Mas":
			return 54.99;
			break;
                case "Select Choice":
			return 51.99;
			break;
		case "Select":
			return 49.99;
			break;
		case "Total Choice":
			return 72.99;
			break;
		case "Total Choice Limited":
			return 62.49;
			break;   		
		case "Ultimate":
			return 86.99;
			break;
		case "Xtra":
			return 77.99;
			break;
		default :
			return;
			break;
	}
// GLOBALS ////////////////////////////////////////////////////////////////////////////////////

var currentPackage = '';
var requestedPackage = '';
var varCount1 = 0;
var varCount2 = 0;
var varCount3 = 0;
var varCount4 = 0;
var varPubCount = 0;
var ourEVO = '';
var varTEXT1 = '';
var varTEXT2 = '';
var varTEXT3 = '';
var varTEXT4 = '';
var xtraMsg = '';
var xtraMsg2 = '';
var varGenre = '';
var site = '';
var varCurrentPackageURL = '';
var column = '+ChannelNumber';

varStartTable ='<table cellpadding="0" cellspacing="0" border="0" width="200" class="rows">';

varTableHead1 =	'';

varTableHead2 =		'<table class="rows" width="200"><thead>' +
						'<tr>'+
							'<th align="center" width="12"><font color="black"> # </font></th>' +
							'<th align="center"><font color="black">Channel Name</font></th>' +
							'<th align="center" width="41"><font color="black">Genre</font></th>' +
							'</tr>'+
						'</thead></table>';

varTableHead3 =		'<table class="rows" width="200"><thead>' +
						'<tr>'+
							'<th align="center" width="12"><font color="black"> # </font></th>' +
							'<th align="center"><font color="black">Channel Name</font></th>' +
							'<th align="center" width="41"><font color="black">Genre</font></th>' +
							'</tr>'+
						'</thead></table>';

varTableHead4 = '';
										
varEndTable = 		'</table>';



function why(val)
{	
	$("#why").css({"left":700,"top":110});
	$('.why_box').toggle();  // show the container
}


function setEVOrange(val)
{
	ourEVO = val;
	$('.COMcurrentPackage').show();
	$('.COMrequestedPackage').show();
	
	//fill in prices
	
	if (val=="0-50"){
		com_choice_price= '($62.99)';
		com_choice_plus_price='($203.99)';
	}else if (val=="51-100"){
		com_choice_price= '($74.99)';
		com_choice_plus_price='(243.99)';
	}else if (val=="101-150"){
		com_choice_price= '($88.99)';
		com_choice_plus_price='($294.99)';
	}else if (val=="151-200"){
		com_choice_price= '($108.99)';
		com_choice_plus_price='($345.99)';
	}else if (val=="201-500"){
		com_choice_price= '($123.99)';
		com_choice_plus_price='($397.99)';
	}else if (val=="501-1000"){
		com_choice_price= '($143.99)';
		com_choice_plus_price='($425.99)';
	}else if (val=="1001-2000"){
		com_choice_price= '($177.99)';
		com_choice_plus_price='($456.99)';
	}else if (val=="2000+"){
		com_choice_price= '($205.99)';
		com_choice_plus_price='($493.99)';
	}
	
	$('#COMcurrentPackage option').eq(8).text('Com Choice '+com_choice_price);
	$('#COMcurrentPackage option').eq(9).text('Com Choice Plus* '+com_choice_plus_price);
	$('#COMrequestedPackage option').eq(6).text('Com Choice '+com_choice_price);
	$('#COMrequestedPackage option').eq(7).text('Com Choice Plus* '+com_choice_plus_price);
			  
}




					  


function reSort(col)
{
	column = col;
	setCurrentValue(currentPackage);
	// DISPLAY THE PLUS/MINUS IMAGES
	$('#current_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#gained_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#lost_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#requested_plus').attr("src","%%pub%%system/img/chan_plus.png");
}


function setCurrentValue(val)
{	
currentPackage = val;	
	if (requestedPackage!='')
	{
		$('#current_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#gained_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#lost_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#requested_plus').attr("src","%%pub%%system/img/chan_plus.png");
		$('.all_text').hide();
		$('.warning_box').hide();
		varTEXT1 = '';
		varTEXT2 = '';
		varTEXT3 = '';
		varTEXT4 = '';
		varCount1 = 0;
		varCount2 = 0;
		varCount3 = 0;
		varCount4 = 0;
		currentPackage = currentPackage.replace(/_/g," ");	
		requestedPackage = requestedPackage.replace(/_/g," ");
		displayResults(currentPackage,requestedPackage);
	}
}

function setRequestedValue(val)
{
	requestedPackage = val;	
	if (currentPackage!='')
	{	
		if ((requestedPackage=='Commercial Xtra Pack' || requestedPackage=='Commercial Entertainment Pack' || requestedPackage=='Comercial Mas Ultra Pack') && (ourEVO!='0-50' && ourEVO!='51-100'))
		{
			alert('The package chosen is meant for EVO of 100 or less. Please choose another package.');
		}
		else{
			$('#current_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#gained_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#lost_plus').attr("src","%%pub%%system/img/chan_plus.png");
	$('#requested_plus').attr("src","%%pub%%system/img/chan_plus.png");
			$('.all_text').hide();
			$('.warning_box').hide();
			varTEXT1 = '';
			varTEXT2 = '';
			varTEXT3 = '';
			varTEXT4 = '';
			varCount1 = 0;
			varCount2 = 0;
			varCount3 = 0;
			varCount4 = 0;
			currentPackage = currentPackage.replace(/_/g," ");	
			requestedPackage = requestedPackage.replace(/_/g," ");
			displayResults(currentPackage,requestedPackage);
		}

	}
	else alert("Please select the customer's current package.");
}


function displayResults(varX,varY){
	$('.sort_radio').show();
	if (varX === undefined || varX === "=" || varY ===undefined || varY === "=") {
		return;
	} else{
		var result = "";
		var callType = "%%pub%%";
		var priceCustPack = packagePricing(varX);
		var priceAgentPack = packagePricing(varY);

		if (priceCustPack < priceAgentPack) {result = "UpSell";} 
		else if (priceCustPack > priceAgentPack) {result = "DownGrade";}
		else {result = "No Change";}

		dcsMultiTrack("DCSext.tool_package_compare_selected_packages",varX+"-"+varY+"-"+result+"-"+callType);
	};
	if (site =='com')
{
		COMChannels.Sort = column;
		COMChannels.Reset();
		rsChannels = COMChannels.recordset;
}
	else {
		Channels.Sort = column;
		rebate_action();
		Channels.Reset();
		rsChannels = Channels.recordset;
	} 	
	rsChannels.MoveFirst();		//resets recordset..
	//alert(varX+"  --  "+varY);
	if (varX!='' && varY!='')
	{
		while (!rsChannels.EOF){
			varPackage1 = rsChannels.Fields(varX).value;
			varOurPackage = rsChannels.Fields("Packages").value;
					while(varPackage1.charAt(varPackage1.length-1) == " "){				//removes any trailing spaces
				varPackage1 = varPackage1.substring(0,varPackage1.length-1);
			}
			while(varPackage1.substring(0,1) ==" "){										//removes any leading spaces
				varPackage1 = varPackage1.substring(1,varPackage1.length);
			}		
			varPackage2 = rsChannels.Fields(varY).value;
			while(varPackage2.charAt(varPackage2.length-1) == " "){				//removes any trailing spaces
				varPackage2 = varPackage2.substring(0,varPackage2.length-1);
			}
			while(varPackage2.substring(0,1) ==" "){										//removes any leading spaces
				varPackage2 = varPackage2.substring(1,varPackage2.length);
			}	
			
			
			// show all the channels included with the FIRST package selected ////////////////////////////////////////////////////////////////////////////////////		
			if(varOurPackage == currentPackage){	
				varCurrentPackageURL = rsChannels.Fields('PackagesURL').value;
				varTableHead1 =		'<table class="rows" width="190"><thead>' +
								'<tr>'+
									'<th align="center" colspan="2"><a href="%%pub%%programming/'+ varCurrentPackageURL +'" target="_blank"><br>'+currentPackage+'</a></th>' +
								'</tr><tr>'+
									'<th align="center"><font color="black" width="12"> # </font></th>' +
									'<th align="center"><font color="black">Channel Name</font></th>' +
								'</tr>'+
								'</thead></table>';
				
			}
			if(varOurPackage == requestedPackage){	
				varRequestedPackageURL = rsChannels.Fields('PackagesURL').value;
				varTableHead4 =		'<table class="rows" width="190"><thead>' +
								'<tr>'+
									'<th align="center" colspan="2"><a href="%%pub%%programming/'+ varRequestedPackageURL +'" target="_blank"><br>'+requestedPackage+'</a></th>' +
								'</tr><tr>'+
									'<th align="center" width="12"><font color="black"> # </font></th>' +
									'<th align="center"><font color="black">Channel Name</font></th>' +
									'</tr>'+
								'</thead></table>';
			}
							
			if(varPackage1 == 'x'){	
				if (site =='com')
					varChannelName = rsChannels('ChannelNameBold');
				else varChannelName = rsChannels('ChannelName');
				
				varChannelNumber = rsChannels('ChannelNumber');
				varURL = rsChannels('URL');			
				varTEXT1 = varTEXT1 +  '<tr><td align="center" valign="top" width="12">&nbsp;' + varChannelNumber + '&nbsp;</td><td><a target="_blank" href=' + varURL + '>' + varChannelName + '</a></td></tr>';
				varCount1++;
			}
					
			// show all the channels included with the SECOND package, but not the FIRST (upgrade package) /////////////////////////////////////////////////////////	
			if((varPackage1 != 'x') && (varPackage2 == 'x')){	
				if (site =='com')
					varChannelName = rsChannels('ChannelNameBold');
				else {
					varChannelName = rsChannels('ChannelName');
					varGenre = rsChannels('Genre');
				}
				varChannelNumber = rsChannels('ChannelNumber');
				varURL = rsChannels('URL');			
				varTEXT2 = varTEXT2 +  '<tr><td align="center" valign="top" width="12">&nbsp;' + varChannelNumber + '&nbsp;</td><td><a target="_blank" href=' + varURL + '>' + varChannelName + '</a></td><td width="41">' + varGenre + '</td></tr>';
				varCount2++;
			}
	
	
			// show all the channels included with the FIRST package, but not the SECOND (downgrade package) ////////////////////////////////////////////////////////
			if((varPackage1 == 'x') && (varPackage2 != 'x')){	
				if (site =='com')
					varChannelName = rsChannels('ChannelNameBold');
				else {
					varChannelName = rsChannels('ChannelName');
					varGenre = rsChannels('Genre');
				}
				varChannelNumber = rsChannels('ChannelNumber');
				varURL = rsChannels('URL');
				varTEXT3 = varTEXT3 +  '<tr><td align="center" valign="top" width="12">&nbsp;' + varChannelNumber + '&nbsp;</td><td><a target="_blank" href=' + varURL + '>' + varChannelName + '</a></td><td width="41">' + varGenre + '</td></tr>';
				varCount3++;
			}
	
			// show all the channels included with the SECOND package, but not the FIRST (upgrade package) /////////////////////////////////////////////////////////	
			if(varPackage2 == 'x'){
				if (site =='com')
					varChannelName = rsChannels('ChannelNameBold');
				else varChannelName = rsChannels('ChannelName');
				
				varChannelNumber = rsChannels('ChannelNumber');
				varURL = rsChannels('URL');
				varTEXT4 = varTEXT4 +  '<tr><td align="center" valign="top" width="12">&nbsp;' + varChannelNumber + '&nbsp;</td><td><a target="_blank" href=' + varURL + '>' + varChannelName + '</a></td></tr>';
				varCount4++;
			}
	
			rsChannels.MoveNext();
		}
	}
	
	
				
	/* INITIAL NUMBERS ARE DISPLAYED AFTER BOTH PACKAGES ARE CHOSEN   */	
	varResults1 = 	'<a href="javascript:show_channels(\'current_plus\',1)">'+varCount1+'</a><div id="current_channels_package"></div><div id="current_channels_list"></div>';
	varResults2 = 	'<a href="javascript:show_channels(\'gained_plus\',2)">'+varCount2+'</a><div id="gained_channels_package"></div><div id="gained_channels_list"></div>';
	varResults3 = 	'<a href="javascript:show_channels(\'lost_plus\',3)">'+varCount3+'</a><div id="lost_channels_package"></div><div id="lost_channels_list"></div>';
	varResults4 = 	'<a href="javascript:show_channels(\'requested_plus\',4)">'+varCount4+'</a><div id="requested_channels_package"></div><div id="requested_channels_list"></div>';	
	
					
	//varAdditional = '';			
	varEndTable2 = 		'</td>';
								
	
	
	varTEXT1 =	varStartTable + varTEXT1 + varEndTable + xtraMsg + varEndTable2;
	if (varTEXT2 != ''){varTEXT2 = varStartTable + varTEXT2 + varEndTable + xtraMsg + varEndTable2;} 		//this hides the upgrade column
	if (varTEXT3 != ''){varTEXT3 = varStartTable + varTEXT3 + varEndTable + xtraMsg2 + varEndTable2;}  		//this hides the downgrade column
	if (varTEXT4 != ''){varTEXT4 = varStartTable + varTEXT4 + varEndTable + varEndTable2;} 								//this hides the additonal column
	
	$('#results').show();
	
	// FILL IN CHANNEL NUMBERS
	$('#current_channels').html(varResults1);
	$('#gained_channels').html(varResults2);
	$('#lost_channels').html(varResults3);
	$('#requested_channels').html(varResults4);
	
	// DISPLAY CHANNEL NUMBERS
	$('#current_holder').show();
	$('#gained_holder').show();
	$('#lost_holder').show();
	$('#requested_holder').show();
	
	// DISPLAY THE PLUS/MINUS IMAGES
	$('#current_plus').show();
	$('#gained_plus').show();
	$('#lost_plus').show();
	$('#requested_plus').show();

	
	if(varTEXT2 == ''){
			varTEXT2 = 'No Channels';
			$('#gained_plus').hide();
	}
	
	if(varTEXT3 == ''){
			varTEXT3 = 'No Channels';
			$('#lost_plus').hide();
	}
 } 

function rebate_action()
{
	
	if (currentPackage == "Premier" && requestedPackage != ""){
		$('.premier_text').show();
		$('.warning_box').show();
	}
	else if (currentPackage == "Ultimate" && requestedPackage != "" && requestedPackage != "Premier" && requestedPackage != "Lo Maximo"){
		$('.choice_ultimate_text').show();
		$('.warning_box').show();
	}
	else if (currentPackage == "Xtra" && requestedPackage != "" && (requestedPackage != "Premier" && requestedPackage != "Ultimate" && requestedPackage != "Lo Maximo")){
		$('.warning_box').show();
		$('.choice_xtra_text').show();
	}
	else if (currentPackage == "Choice" && requestedPackage != "" && (requestedPackage != "Premier" && requestedPackage != "Ultimate" && requestedPackage != "Xtra" && requestedPackage != "Lo Maximo")){
		$('.choice_text').show();
		$('.warning_box').show();	
	}
	else if (currentPackage == "Lo Maximo" && requestedPackage != ""){
		$('.lo_maximo_text').show();
		$('.warning_box').show();
	}
	else if (currentPackage == "Mas Ultra" && requestedPackage != "" && requestedPackage != "Premier" && requestedPackage != "Lo Maximo"){
		$('.mas_ultra_text').show();
		$('.warning_box').show();
	}
	else if (currentPackage == "Optimo Mas" && requestedPackage != "" && (requestedPackage != "Choice" && requestedPackage != "Xtra" && requestedPackage != "Entertainment" && requestedPackage != "Premier" && requestedPackage != "Mas Ultra" && requestedPackage != "Choice" && requestedPackage != "Lo Maximo")){
		$('.warning_box').show();
		$('.optimo_mas_text').show();
	}
	else if (currentPackage == "Mas Latino" && requestedPackage != "" && (requestedPackage != "Entertainment" && requestedPackage != "Premier" && requestedPackage != "Ultimate"  && requestedPackage != "Mas Ultra" && requestedPackage != "Optimo Mas" && requestedPackage != "Xtra" && requestedPackage != "Lo Maximo")){
		$('.mas_latino_text').show();
		$('.warning_box').show();	
	}
	else {
		$('.all_text').hide();
		$('.warning_box').hide();
	}
}


// THIS FUNCTION CALLS the other TWO FUNCTIONS THAT SHOW/HIDE THE PLUS/MINUS IMAGE AND THE CHANNEL LISTS
function show_channels(oursign,val)
{
	flip_sign(oursign,val);
	showChannels(val)
}

// SWITCH THE PLUS/MINUS IMAGE
function flip_sign(oursign,val)
{
	if ($('#'+oursign).attr("src").match(/chan_plus.png/) != null)
		$('#'+oursign).attr("src","%%pub%%system/img/chan_minus.png");
	else 
		$('#'+oursign).attr("src","%%pub%%system/img/chan_plus.png");
}

// SHOW/HIDE THE CHANNEL LISTS
function showChannels(val)
{
	if (val==1)

	{
		$('#current_channels_package').html(varTableHead1);
		$('#current_channels_package').toggle();	
		$('#current_channels_list').html(varTEXT1);
		$('#current_channels_list').toggle();
		$('#current_channels_list table.rows tr:odd').addClass('odd');
		$('#current_channels_list table.rows tr:even').addClass('even');
	}
	if (val==2)
	{
		$('#gained_channels_package').html(varTableHead2);
		$('#gained_channels_package').toggle();
		$('#gained_channels_list').html(varTEXT2);
		$('#gained_channels_list').toggle();
		$('#gained_channels_list table.rows tr:odd').addClass('odd');
		$('#gained_channels_list table.rows tr:even').addClass('even');
	}
	if (val==3)
	{
		$('#lost_channels_package').html(varTableHead3);
		$('#lost_channels_package').toggle();
		$('#lost_channels_list').html(varTEXT3);
		$('#lost_channels_list').toggle();
		$('#lost_channels_list table.rows tr:odd').addClass('odd');
		$('#lost_channels_list table.rows tr:even').addClass('even');
	}
	if (val==4)
	{
		$('#requested_channels_package').html(varTableHead4);
		$('#requested_channels_package').toggle();
		$('#requested_channels_list').html(varTEXT4);
		$('#requested_channels_list').toggle();
		$('#requested_channels_list table.rows tr:odd').addClass('odd');
		$('#requested_channels_list table.rows tr:even').addClass('even');
	}
	
       
}

//Package Pricing
function packagePricing(package){
	switch (package) {
		case "Americas Plus":
		case "Mexico Plus":
			return 7.99;
			break;
		case "Basic":
			return 19.99;
			break;
		case "Basic Choice (Int'l)":
			return 17.99;
			break;
		case "Basico":
			return 42.49;
			break;
		case "Choice":
			return 70.99;
			break;
		case "Mas Ultra":
			return 71.99;
			break;
		case "Choice Xtra Classic":
			return 79.49;
			break;
		case "En Espanol":
			return 14.99;
			break;
		case "Entertainment":
			return 59.99;
			break;
		case "Entertainment Classic":
			return 59.99;
			break;
		case "Familiar":
			return 60.99;
			break;
		case "Familiar Ultra":
			return 72.99;
			break;
		case "Family":
			return 29.99;
			break;
		case "Lo Maximo":
		case "Premier":
			return 136.99;
			break;
		case "Mas Mexico":
			return 35.99;
			break;
		case "Mas Latino":
			return 36.99;
			break;
		case "Mas Ultra Original":
			return 69.99;
			break;
		case "Opcion Especial":
			return 45.49;
			break;
		case "Preferred Xtra":
			return 75.99;
			break;
                case "Preferred Choice (Int'l)":
			return 48.99;
			break;
		case "Select Classic":
			return 48.49;
			break;
		case "Opcion Extra Especial":
			return 65.49;
			break;
		case "Opcion Premier":
			return 136.99;
			break;
		case "Opcion Ultra Especial":
			return 67.49;
			break;
		case "Optimo Mas":
			return 54.99;
			break;
                case "Select Choice":
			return 51.99;
			break;
		case "Select":
			return 49.99;
			break;
		case "Total Choice":
			return 72.99;
			break;
		case "Total Choice Limited":
			return 62.49;
			break;   		
		case "Ultimate":
			return 86.99;
			break;
		case "Xtra":
			return 77.99;
			break;
		default :
			return;
			break;
	}
}}
