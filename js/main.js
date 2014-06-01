// Initiatize function
const DBname = "bowlList";
const DBversion = "1,0";
const DBdisname = "listDB";
const DBsize = 4000000;

var  init = function () {
	onDeviceReady();		
	
	new SwipeOut(document.getElementById("bowl_list"));
	new SwipeOut(document.getElementById("date_list"));
	
	$("#date_list").on("delete", "li", RemoveGame);
	$("#bowl_list").on("delete", "li", RemoveDate);
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

function ClearData(){
	transactionDB(ClearQuery);
}

function PullData(){
	transactionDB(PullQuery);
}

function GetData(dateValue){
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
			var string = '<li id="all_'+id+'" data-icon="flat-camera" data-iconpos="right"><a href="#" onclick="GetImage('+id+');"> Game '+(i+1)+' - '+score+'</a></li>';
			$("#date_list").append(string);
		};
		freshList("date_list");
	});
	});
}

function GetImage(id){
	var db = window.openDatabase(DBname,DBversion,DBdisname,DBsize);
	db.transaction(function (tx) {
		tx.executeSql('SELECT file FROM blist WHERE id="'+id+'"',[],function(tx,results){
		var len = results.rows.length;
		alert(id +' - '+ len)
		if ( len == 0)
		{
			alert("No Image");
			tx.executeSql('UPDATE blist SET file="hello world" WHERE id="' +id+ '"');
		} else {
			alert(results.rows.item(0).file);
		}	
		});
		});
}

function RemoveGame(e)
{
	var id = $(e.currentTarget).attr('id').substring(4);
	var db = window.openDatabase(DBname,DBversion,DBdisname,DBsize);
	db.transaction(function (tx) {
	tx.executeSql('DELETE FROM blist WHERE id="' +id+ '"');});
	PullData();
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

function CreatQuery(tx){
	tx.executeSql('CREATE TABLE IF NOT EXISTS blist (id INTEGER PRIMARY KEY AUTOINCREMENT,score Integer,date varchar, file varchar)');
}

function InsertQuery(tx){
	var score = $("#scoreinput").val();
	var date = $("#dateinput").val();
	var dateString = new String(date);

	if(score == '' || date == '') {
		alert("Empty Fields！");
		return;}

	tx.executeSql('INSERT INTO blist (score,date,file) VALUES ("'+score+'","'+dateString+'", "Bye Bye")',[],function(tx,results){
	$("#dialog").dialog('close');
	},errorDB);
	PullQuery(tx);
}

function ClearQuery(tx){
	$("#bowl_list").empty();
	tx.executeSql('DELETE FROM blist');
	tx.executeSql('DROP TABLE blist');
	CreatQuery(tx);
	freshList("bowl_list");
}

function PullQuery(tx){
	$("#bowl_list").empty();
	CreatQuery(tx);
	tx.executeSql("SELECT AVG(score) AS a, COUNT(score) AS c, date FROM blist GROUP BY date ORDER BY date DESC",[],function(tx,results){
		var len = results.rows.length;
			for(var i = 0;i<len;i++){
				var dateString = results.rows.item(i).date;
				var avg = Math.floor(results.rows.item(i).a);
				var count = results.rows.item(i).c;
				var date = new Date(dateString);
				var string = '<li id="all_'+i+'"><a href="#date-data" data-rel="dialog" onclick="GetData('+date.valueOf()+');" class="ui-link-inherit"> ['+dateToYMD(date)+'] '+count+' games Avg - '+avg+'</a></li>';		
				$("#bowl_list").append(string);
			};
		freshList("bowl_list");
	},errorDB);
}

function errorDB(err){
	alert("Error processing SQL: "+ err.code);
}

function successDB(){
	//alert("Successful");	
}

function freshList(id){
	var theid = "#"+id;
	$(theid).listview("refresh");
}

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}
