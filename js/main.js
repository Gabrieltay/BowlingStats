// Initiatize function
const DBname = "bowlList";
const DBversion = "1,0";
const DBdisname = "listDB";
const DBsize = 4000000;

var  init = function () {
	onDeviceReady();
};

$(document).ready(init);

function onDeviceReady(){
	var db = window.openDatabase(DBname,DBversion,DBdisname,DBsize);
    db.transaction(creatDB,errorDB,successDB);
}

function creatDB(tx){
//	tx.executeSql("DROP TABLE IF EXISTS blist");
	tx.executeSql('CREATE TABLE IF NOT EXISTS blist (id INTEGER PRIMARY KEY AUTOINCREMENT,score Integer,date varchar)');
}

function errorDB(err){
	alert("Error processing SQL: "+ err.code);
}

function successDB(){
	//alert("Successful");	
}

function InsertData(){
	var db = window.openDatabase(DBname,DBversion,DBdisname,DBsize);
	db.transaction(saveData,errorDB);
}

function PullData(){
	var db = window.openDatabase(DBname,DBversion,DBdisname,DBsize);
	db.transaction(myQuery,errorDB);
}

function saveData(tx){
	var score = $("#scoreinput").val();
	var date = $("#dateinput").val();

	if(score == '' || date == '') {
		alert("Empty Fields！");
		return;}

	tx.executeSql('INSERT INTO blist (score,date) VALUES ("'+score+'","'+date+'")',[],function(tx,results){
/*
		var time = new Date().toLocaleDateString();
		//if(date == time){
			var id = results.insertId;
			var string = '<li id="today_'+id+'"><a href="#all_content" data-rel="popup" onclick="getContent('+id+');" data-inline="true" data-transition="pop">'+score+'</a></li>';
			$("#bowl_list").prepend(string);
			freshList("bowl_list");
			//};*/
		$("#dialog").dialog('close');
		},errorDB);myQuery(tx);
}

function queryDB(tx){
	tx.executeSql("SELECT * FROM blist order by date desc,id desc ",[],function(tx,results){
		var len = results.rows.length;
			for(var i = 0;i<len;i++){
				var score = results.rows.item(i).score;
				var id = results.rows.item(i).id;
				var string = '<li id="all_'+id+'"><a href="#all_content_p" data-rel="popup" onclick="getContent('+id+');" class="ui-link-inherit">'+score+' ['+results.rows.item(i).date+']</a></li>';
				$("#bowl_list").append(string);
			};
		freshList("bowl_list");


		//$("#logger").text(id);
	},errorDB);
}

function myQuery(tx){
	$("#bowl_list").empty();
	tx.executeSql("SELECT AVG(score) AS a, COUNT(score) AS c, date FROM blist GROUP BY date",[],function(tx,results){
		var len = results.rows.length;
			for(var i = 0;i<len;i++){
				var date = results.rows.item(i).date;
				var avg = results.rows.item(i).a;
				var count = results.rows.item(i).c;
				var string = '<li id="all_'+i+'"><a href="#all_content_p" data-rel="popup" onclick="getContent('+i+');" class="ui-link-inherit"> ['+date+'] '+count+' games Avg - '+avg+'</a></li>';
				$("#bowl_list").append(string);
			};
		freshList("bowl_list");


		//$("#logger").text(id);
	},errorDB);
}

function countAll(tx){
	tx.executeSql("SELECT * FROM blist",[],function(tx,results){
		var len = results.rows.length;
		$("#logger").text(len);
	},errorDB);
}

function freshList(id){
	var theid = "#"+id;
	$(theid).listview("refresh");
}

