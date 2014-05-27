// Initiatize function
const DBname = "bowlList";
const DBversion = "1,0";
const DBdisname = "listDB";
const DBsize = 4000000;

var  init = function () {
	onDeviceReady();
	$('#date_list li').swipeDelete({
				btnTheme: 'e',
				btnLabel: 'Delete',
				btnClass: 'aSwipeButton',
				click: function(e){
					e.preventDefault();
					var url = $(e.target).attr('href');
					$(this).parents('li').slideUp();
					$.post(url, function(data) {
					
					
					 
						console.log(data);
					});
				}
			});

			$('#triggerMe').on('click', function(){
				$('#date_list li:nth-child(1)').trigger('swiperight')
			});
};

$(document).ready(init);

function transactionDB(query){
	var db = window.openDatabase(DBname,DBversion,DBdisname,DBsize);
	db.transaction(query,errorDB);
} 

function onDeviceReady(){
	//var db = window.openDatabase(DBname,DBversion,DBdisname,DBsize);
    //db.transaction(creatDB,errorDB,successDB);
	transactionDB(CreatQuery);
}

function InsertData(){
	transactionDB(InsertQuery);
}

function GetData(dateValue){
	var date = new Date(dateValue);
	var dateString = dateToYMD(date);
	$('#date-header > h1').text(date.toDateString());
	$("#date_list").empty();
	var db = window.openDatabase(DBname,DBversion,DBdisname,DBsize);
	db.transaction(function (tx) {
	tx.executeSql('SELECT score FROM blist WHERE date="'+dateString+'"',[],function(tx,results){
		var len = results.rows.length;
		for(var i = 0;i<len;i++){
			var score = results.rows.item(i).score;
			var string = '<li id="all_'+i+'"><a href="#" data-rel="dialog" class="ui-link-inherit"> Game '+(i+1)+' - '+score+'</a></li>';		
			$("#date_list").append(string);
		};
		freshList("date_list");
	});
	});
}

function ClearData(){
	transactionDB(ClearQuery);
}

function PullData(){
	transactionDB(PullQuery);
}

function CreatQuery(tx){
	tx.executeSql('CREATE TABLE IF NOT EXISTS blist (id INTEGER PRIMARY KEY AUTOINCREMENT,score Integer,date varchar)');
}

function InsertQuery(tx){
	var score = $("#scoreinput").val();
	var date = $("#dateinput").val();
	var dateString = new String(date);

	if(score == '' || date == '') {
		alert("Empty Fields！");
		return;}

	tx.executeSql('INSERT INTO blist (score,date) VALUES ("'+score+'","'+dateString+'")',[],function(tx,results){
	$("#dialog").dialog('close');
	},errorDB);
	PullQuery(tx);
}

function ClearQuery(tx){
	$("#bowl_list").empty();
	tx.executeSql('DELETE FROM blist');
	freshList("bowl_list");
}

function PullQuery(tx){
	$("#bowl_list").empty();
	tx.executeSql('CREATE TABLE IF NOT EXISTS blist (id INTEGER PRIMARY KEY AUTOINCREMENT,score Integer,date varchar)');
	tx.executeSql("SELECT AVG(score) AS a, COUNT(score) AS c, date FROM blist GROUP BY date",[],function(tx,results){
		var len = results.rows.length;
			for(var i = 0;i<len;i++){
				var dateString = results.rows.item(i).date;
				var avg = results.rows.item(i).a;
				var count = results.rows.item(i).c;
				var date = new Date(dateString);
				//var string = '<li id="all_'+i+'"><a href="#all_content_p" data-rel="popup" onclick="getContent('+i+');" class="ui-link-inherit"> ['+date+'] '+count+' games Avg - '+avg+'</a></li>';
				var string = '<li id="all_'+i+'"><a href="#date-data" data-rel="dialog" onclick="GetData('+date.valueOf()+');" class="ui-link-inherit"> ['+date.toDateString()+'] '+count+' games Avg - '+avg+'</a></li>';		
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
