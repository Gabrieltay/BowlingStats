// Initiatize function
const DBname = "bowlList";
const DBversion = "1,0";
const DBdisname = "listDB";
const DBsize = 4000000;
var mId = 0;

var  init = function () {
	onDeviceReady();		
	
	new SwipeOut(document.getElementById("bowl_list"));
	new SwipeOut(document.getElementById("date_list"));
	
	$("#date_list").on("delete", "li", RemoveGame);
	$("#bowl_list").on("delete", "li", RemoveDate);
	
	//drawChart();
};

$(document).ready(init);

function transactionDB(query){
	var db = window.openDatabase(DBname,DBversion,DBdisname,DBsize);
	db.transaction(query,errorDB);
} 

function onDeviceReady(){
	transactionDB(CreatQuery);
}

function InsertData(){
	transactionDB(InsertQuery);
}

function ClearData(buttonIndex){
	if ( buttonIndex == 1 )
	{
		transactionDB(ClearQuery);
		StatsData();
	}
}

function RefreshData(){
	transactionDB(RefreshQuery);
}

function StatsData(){
	transactionDB(StatsQuery);
}

function StatsQuery(tx){
	tx.executeSql('SELECT MAX(score) AS s FROM blist',[],function(tx,results){
		var hs = (results.rows.item(0).s == null) ? 0 :  results.rows.item(0).s;
		$("#hs-val").text(hs);
	},errorDB);
	
	tx.executeSql('SELECT MIN(score) AS s FROM blist',[],function(tx,results){
		var ls = (results.rows.item(0).s == null) ? 0 :  results.rows.item(0).s;
		$("#ls-val").text(ls);
	},errorDB);
	
	tx.executeSql('SELECT MAX(a) AS s FROM (SELECT AVG(score) AS a FROM blist GROUP BY date);',[],function(tx,results){
		var ha = (results.rows.item(0).s == null) ? 0 :  results.rows.item(0).s;
		$("#ha-val").text(Math.floor(ha));
	},errorDB);
	
	tx.executeSql('SELECT MIN(a) AS s FROM (SELECT AVG(score) AS a FROM blist GROUP BY date);',[],function(tx,results){
		var la = (results.rows.item(0).s == null) ? 0 :  results.rows.item(0).s;
		$("#la-val").text(Math.floor(la));
	},errorDB);
	
	tx.executeSql('SELECT SUM(score) AS s FROM blist',[],function(tx,results){
		var tp = (results.rows.item(0).s == null) ? 0 :  results.rows.item(0).s;
		$("#tp-val").text(tp);
	},errorDB);
	
	tx.executeSql('SELECT COUNT(score) AS s FROM blist',[],function(tx,results){
		var tg = (results.rows.item(0).s == null) ? 0 :  results.rows.item(0).s;
		$("#tg-val").text(tg);
	},errorDB);
	
	tx.executeSql('SELECT AVG(score) AS s FROM blist',[],function(tx,results){
		var ta = (results.rows.item(0).s == null) ? 0 :  results.rows.item(0).s;
		$("#ta-val").text(Math.floor(ta));
	},errorDB);
}

function CreatQuery(tx){
	tx.executeSql('CREATE TABLE IF NOT EXISTS blist (id INTEGER PRIMARY KEY AUTOINCREMENT,score Integer,date varchar, file varchar)');
}

function RefreshQuery(tx){
	$("#bowl_list").empty();
	CreatQuery(tx);
	tx.executeSql("SELECT AVG(score) AS a, COUNT(score) AS c, date FROM blist GROUP BY date ORDER BY date DESC",[],function(tx,results){
		var len = results.rows.length;
			for(var i = 0;i<len;i++){
				var dateString = results.rows.item(i).date;
				var avg = Math.floor(results.rows.item(i).a);
				var count = results.rows.item(i).c;
				var date = new Date(dateString);
				var string = '<li id="all_'+i+'"><a href="#date-data" data-rel="dialog" onclick="DateQuery('+date.valueOf()+');" class="ui-link-inherit"> ['+dateToYMD(date)+'] '+count+' games Avg - '+avg+'</a></li>';		
				$("#bowl_list").append(string);
			};
		freshList("bowl_list");
	},errorDB);
}

function InsertQuery(tx){
	var score = $("#scoreinput").val();
	var date = $("#dateinput").val();
	var dateString = new String(date);

	if(score == '' || date == '') {
		alert("Empty Fields！");
		return;}

	tx.executeSql('INSERT INTO blist (score,date,file) VALUES ("'+score+'","'+dateString+'", "NULL")',[],function(tx,results){
	$("#dialog").dialog('close');
	},errorDB);
	RefreshQuery(tx);
}

function DateQuery(dateValue){
	var date = new Date(dateValue);
	var dateString = dateToYMD(date);
	$('#date-header > h1').text(date.toDateString());
	$("#date_list").empty();
	var db = window.openDatabase(DBname,DBversion,DBdisname,DBsize);
	db.transaction(function (tx) {
	tx.executeSql('SELECT id, score FROM blist WHERE date="'+dateString+'" ORDER BY id',[],function(tx,results){
		var len = results.rows.length;
		for(var i = 0;i<len;i++){
			var id = results.rows.item(i).id;
			var score = results.rows.item(i).score;
			var string = '<li id="all_'+id+'" data-icon="flat-camera" data-iconpos="right"><a href="#photo-data" data-rel="dialog" onclick="GetImage('+id+');"> Game '+(i+1)+' - '+score+'</a></li>';
			$("#date_list").append(string);
		};
		freshList("date_list");
	});
	});
}

function ClearQuery(tx){
	$("#bowl_list").empty();
	tx.executeSql('DELETE FROM blist');
	tx.executeSql('DROP TABLE blist');
	CreatQuery(tx);
	freshList("bowl_list");
}

function RemoveGame(e)
{
	var id = $(e.currentTarget).attr('id').substring(4);
	var db = window.openDatabase(DBname,DBversion,DBdisname,DBsize);
	db.transaction(function (tx) {
	tx.executeSql('DELETE FROM blist WHERE id="' +id+ '"');});
	RefreshData();
}

function RemoveDate(e)
{
	var first = $('a', e.currentTarget).text().indexOf('[');
	var last = $('a', e.currentTarget).text().indexOf(']');
	var rawString = $('a', e.currentTarget).text().substring((first+1),last);
	var date = new Date(rawString);
	var dateString = dateToYMD(date);

	var db = window.openDatabase(DBname,DBversion,DBdisname,DBsize);
	db.transaction(function (tx) {
	tx.executeSql('DELETE FROM blist WHERE date="'+dateString+'"');});
}


function GetImage(id){
	var db = window.openDatabase(DBname,DBversion,DBdisname,DBsize);
	db.transaction(function (tx) {
		tx.executeSql('SELECT file FROM blist WHERE id="'+id+'"',[],function(tx,results){
		var len = results.rows.length;
		if ( len > 0) {
			var file = results.rows.item(0).file;
			if ( file == "NULL"){
				mId = id;
				var string = '<div class="ui-block-a"><a href="#" data-role="button" data-theme="c" onclick="TakePhoto()"><img src="images/camera.png"></a></div>' + 
					'<div class="ui-block-b"><a href="#" data-role="button" data-theme="c" onclick="FindPhoto()"><img src="images/library.png"></a></div>';	
				$("#photo-content").html(string);			
				$('#photo-content').trigger("create");		
			}
			else {
				var string = '<img id="game-photo" src="' +file+ '"></img>';
				$("#photo-content").html(string);			
				$('#photo-content').trigger("create");		
			}
		}
		});
		});
}

function ConfirmClear(){
	navigator.notification.confirm('Clear All Data?', ClearData);
}

function FindPhoto(){
	navigator.camera.getPicture(onURISuccess, onCameraError, { quality: 50, sourceType: Camera.PictureSourceType.PHOTOLIBRARY , destinationType: Camera.DestinationType.FILE_URI});	
}

function TakePhoto(){
	navigator.camera.getPicture(onURISuccess, onCameraError, { quality: 50, sourceType: Camera.PictureSourceType.CAMERA , destinationType: Camera.DestinationType.FILE_URI, saveToPhotoAlbum: true });
}

function onURISuccess(imageURI) {
	var db = window.openDatabase(DBname,DBversion,DBdisname,DBsize);
	db.transaction(function (tx) {
		tx.executeSql('UPDATE blist SET file="' +imageURI+ '" WHERE id="' +mId+ '"');
	});
	var string = '<img id="game-photo" src="' +imageURI+ '"></img>';
	$("#photo-content").html(string);			
	$('#photo-content').trigger("create");		
}

function PhotoExists(entry){
	
	alert("exists - " + entry.fullPath());
}

function PhotoNoExists(){
	alert("doesnt exists");
}

function errorDB(err){
	alert("Error processing SQL: "+ err.code);
}

function successDB(){
	//alert("Successful");	
}

function onCameraError(message) {
	//alert('Failed because: ' + message)
}

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

function freshList(id){
	var theid = "#"+id;
	$(theid).listview("refresh");
}

function resetFields(){
	$("#scoreinput").val("");
	
	$('#scoreinput').trigger("create");		
	document.getElementById('dateinput').valueAsDate = new Date();
}

function drawChart(){
	transactionDB(draw);
}

var d = [];

function weekendAreas(axes) {

			var markings = [],
				d = new Date(axes.xaxis.min);

			// go to the first Saturday

			d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7));
			d.setUTCSeconds(0);
			d.setUTCMinutes(0);
			d.setUTCHours(0);

			var i = d.getTime();

			// when we don't set yaxis, the rectangle automatically
			// extends to infinity upwards and downwards

			do {
				markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } });
				i += 7 * 24 * 60 * 60 * 1000;
			} while (i < axes.xaxis.max);

			return markings;
		}

		
		

function draw(tx) {
	
	tx.executeSql("SELECT AVG(score) AS a, date FROM blist GROUP BY date",[],function(tx,results){
		var len = results.rows.length;
			for(var i = 0;i<len;i++){
				var dateString = results.rows.item(i).date;
				var avg = Math.floor(results.rows.item(i).a);
				var date = new Date(dateString);
				alert(date.valueOf());
				d.push([date.valueOf(), avg]);
			};
	},errorDB);

	var options = {
			xaxis: {
				mode: "time",
				tickLength: 5
			},
			selection: {
				mode: "x"
			},
			grid: {
				markings: weekendAreas
			}
		};
		
	$.plot("#placeholder", [d], options);
	}
	


		