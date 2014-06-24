// Initiatize function
const DBname = "bowlList";
const DBversion = "1,0";
const DBdisname = "listDB";
const DBsize = 4000000;
const MaxRecords = 15;
var mId = 0;
var mCanvas = "";
var mFile = "";
var mDate = "";
var mStatus = "ready";

var frameCols = "";
for (var i = 2; i <= 22; i++) {
	if (i <= 19)
		frameCols = frameCols + 'frame_' + parseInt(i / 2) + '_' + ((i % 2 == 0) ? '1' : '2') + ', ';
	else if (i <= 21)
		frameCols = frameCols + 'frame_10_' + parseInt(i - 19) + ', ';
	else
		frameCols = frameCols + 'frame_10_' + parseInt(i - 19);
}

var init = function() {
	onDeviceReady();

	var options = {
		frequency : 3000
	};

	$(window).resize(function() {
		if ($.mobile.activePage.attr('id') == "score-page")
			buttonsRedraw();
		//if ($.mobile.activePage.attr('id') == "graph-page")
		//draw();
	});
	draw();
	
	FastClick.attach(document.body);
};

$(document).ready(init);

$(document).on("pagecontainershow", function(event, ui) {
	var activePage = $.mobile.pageContainer.pagecontainer("getActivePage").prop('id');
	if (activePage == "graph-page")
		draw();
});

function onProfileSubmit(event) {
	event.preventDefault();
	//MaxRecordsQuery();
	InsertData();
}

function transactionDB(query) {
	var db = window.openDatabase(DBname, DBversion, DBdisname, DBsize);
	db.transaction(query, errorDB);
}

function onDeviceReady() {
	transactionDB(CreatQuery);
}

function InsertData() {
	transactionDB(InsertQuery);
}

function ClearData(buttonIndex) {
	if (buttonIndex == 1) {
		transactionDB(ClearQuery);
		StatsData();
	}
}

function ClearSession(buttonIndex) {
	if (buttonIndex == 1) {
		transactionDB(RemoveCurrentSession);
		StatsSessionData();
	}
}

function RefreshData() {
	transactionDB(RefreshQuery);
}

function StatsData() {
	transactionDB(StatsQuery);
}

function StatsSessionData() {
	transactionDB(StatsSessionQuery);
}

function MaxRecordsQuery() {
	var db = window.openDatabase(DBname, DBversion, DBdisname, DBsize);
	db.transaction(function(tx) {

		tx.executeSql('SELECT COUNT(score) AS s FROM blist', [], function(tx, results) {
			if (results.rows.item(0).s >= MaxRecords) {
				toast("Sorry, Pro Bowling Lite version only allow up to " + MaxRecords + " games! Please purchase Full version for unlimited records and new features.")
			} else {
				InsertData();
			}
		}), errorDB
	});

}

function StatsQuery(tx) {
	tx.executeSql('SELECT MAX(score) AS s FROM blist', [], function(tx, results) {
		var hs = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".hs-val").text(hs);
	}, errorDB);

	tx.executeSql('SELECT MIN(score) AS s FROM blist', [], function(tx, results) {
		var ls = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".ls-val").text(ls);
	}, errorDB);

	tx.executeSql('SELECT MAX(a) AS s FROM (SELECT AVG(score) AS a FROM blist GROUP BY date);', [], function(tx, results) {
		var ha = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".ha-val").text(Math.floor(ha));
	}, errorDB);

	tx.executeSql('SELECT MIN(a) AS s FROM (SELECT AVG(score) AS a FROM blist GROUP BY date);', [], function(tx, results) {
		var la = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".la-val").text(Math.floor(la));
	}, errorDB);

	tx.executeSql('SELECT SUM(score) AS s FROM blist', [], function(tx, results) {
		var tp = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".tp-val").text(tp);
	}, errorDB);

	tx.executeSql('SELECT COUNT(score) AS s FROM blist', [], function(tx, results) {
		var tg = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".tg-val").text(tg);
	}, errorDB);

	tx.executeSql('SELECT AVG(score) AS s FROM blist', [], function(tx, results) {
		var ta = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".ta-val").text(Math.floor(ta));
	}, errorDB);

	tx.executeSql('SELECT SUM(strikes) AS s FROM blist WHERE frames="true"', [], function(tx, results) {
		var tsk = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".tsk-val").text(Math.floor(tsk));
	}, errorDB);

	tx.executeSql('SELECT AVG(strikes) AS s FROM blist WHERE frames="true"', [], function(tx, results) {
		var ask = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".ask-val").text(Math.floor(ask));
	}, errorDB);

	tx.executeSql('SELECT SUM(spares) AS s FROM blist WHERE frames="true"', [], function(tx, results) {
		var tsp = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".tsp-val").text(Math.floor(tsp));
	}, errorDB);

	tx.executeSql('SELECT AVG(spares) AS s FROM blist WHERE frames="true"', [], function(tx, results) {
		var asp = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".asp-val").text(Math.floor(asp));
	}, errorDB);
}

function StatsSessionQuery(tx) {
	var dateValue = $("#date-page .date-header").text();
	var date = new Date(dateValue);
	var dateString = dateToYMD(date);

	tx.executeSql('SELECT MAX(score) AS s FROM blist WHERE date="' + dateString + '"', [], function(tx, results) {
		var hs = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".hs-val").text(hs);
	}, errorDB);

	tx.executeSql('SELECT MIN(score) AS s FROM blist WHERE date="' + dateString + '"', [], function(tx, results) {
		var ls = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".ls-val").text(ls);
	}, errorDB);

	tx.executeSql('SELECT SUM(score) AS s FROM blist WHERE date="' + dateString + '"', [], function(tx, results) {
		var tp = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".tp-val").text(tp);
	}, errorDB);

	tx.executeSql('SELECT COUNT(score) AS s FROM blist WHERE date="' + dateString + '"', [], function(tx, results) {
		var tg = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".tg-val").text(tg);
	}, errorDB);

	tx.executeSql('SELECT AVG(score) AS s FROM blist WHERE date="' + dateString + '"', [], function(tx, results) {
		var ta = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".ta-val").text(Math.floor(ta));
	}, errorDB);

	tx.executeSql('SELECT SUM(strikes) AS s FROM blist WHERE frames="true" AND date="' + dateString + '"', [], function(tx, results) {
		var tsk = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".tsk-val").text(Math.floor(tsk));
	}, errorDB);

	tx.executeSql('SELECT AVG(strikes) AS s FROM blist WHERE frames="true" AND date="' + dateString + '"', [], function(tx, results) {
		var ask = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".ask-val").text(Math.floor(ask));
	}, errorDB);

	tx.executeSql('SELECT SUM(spares) AS s FROM blist WHERE frames="true" AND date="' + dateString + '"', [], function(tx, results) {
		var tsp = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".tsp-val").text(Math.floor(tsp));
	}, errorDB);

	tx.executeSql('SELECT AVG(spares) AS s FROM blist WHERE frames="true" AND date="' + dateString + '"', [], function(tx, results) {
		var asp = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
		$(".asp-val").text(Math.floor(asp));
	}, errorDB);
}

function CreatQuery(tx) {
	var sqlStr = "";
	for (var i = 2; i <= 22; i++) {
		if (i != 22)
			sqlStr = sqlStr + 'frame_' + parseInt(i / 2) + '_' + ((i % 2 == 0) ? '1' : '2') + ' varchar(1), ';
		else
			sqlStr = sqlStr + 'frame_10_3 varchar(1)';
	}
	tx.executeSql('CREATE TABLE IF NOT EXISTS blist (id INTEGER PRIMARY KEY AUTOINCREMENT,score Integer,date varchar, file varchar, frames varchar, strikes Integer, spares Integer,' + sqlStr + ')', [], function(tx, results) {
	}, errorDB);
}

function RefreshQuery(tx) {
	$("#bowl_list").empty();
	CreatQuery(tx);
	tx.executeSql("SELECT AVG(score) AS a, COUNT(score) AS c, date FROM blist GROUP BY date ORDER BY date DESC", [], function(tx, results) {
		var len = results.rows.length;
		for (var i = 0; i < len; i++) {
			var dateString = results.rows.item(i).date;
			var avg = Math.floor(results.rows.item(i).a);
			var count = results.rows.item(i).c;
			var date = new Date(dateString);
			var string = '<li id="all_' + i + '" data-theme="o' + (i % 2) + '"><a href="#date-page" data-transition="slide" data-rel="page" onclick="DateQuery(' + date.valueOf() + ');" class="ui-link-inherit"> [' + dateToYMD(date) + '] ' + count + ' games Avg - ' + avg + '</a></li>';
			$("#bowl_list").append(string);
		};
		freshList("bowl_list");
	}, errorDB);
}

function InsertQuery(tx) {
	if (mStatus != "ready") {
		alert("Phone not ready to save data!");
		return;
	}

	var score = $("#scoreinput").val();
	var date = $("#dateinput").val();
	var dateString = new String(date);

	if (score == '' || date == '' || parseInt(score) > 300) {
		toast("Empty/Invalid Fields！");
		return;
	}

	if (isCompleted() == 1 && $('#edit-final-res').text() == $("#scoreinput").val()) {
		tx.executeSql('INSERT INTO blist (score,date,file,frames,strikes,spares,' + frameCols + ') VALUES ("' + score + '","' + dateString + '", "' + mFile + '", "true",' + getStrikes() + ',' + getSpares() + ',' + getScores() + ')', [], function(tx, results) {
			$.mobile.back();
		}, errorDB);
	} else {
		tx.executeSql('INSERT INTO blist (score,date,file,frames,strikes,spares,' + frameCols + ') VALUES ("' + score + '","' + dateString + '", "' + mFile + '", "false",0,0, "","","","","","","","","","","","","","","","","","","","","")', [], function(tx, results) {
			$.mobile.back();
		}, errorDB);
	}
	RefreshQuery(tx);
}

function DateQuery(dateValue) {
	mDate = dateValue;
	var date = new Date(dateValue);
	var dateString = dateToYMD(date);
	$('.date-header').text(date.toDateString());
	$("#date_list").empty();
	var db = window.openDatabase(DBname, DBversion, DBdisname, DBsize);
	db.transaction(function(tx) {
		tx.executeSql('SELECT id, score FROM blist WHERE date="' + dateString + '" ORDER BY id', [], function(tx, results) {
			var len = results.rows.length;
			if (len > 0) {
				for (var i = 0; i < len; i++) {
					var id = results.rows.item(i).id;
					var score = results.rows.item(i).score;
					var string = '<li id="all_' + id + '" data-icon="flat-new" data-iconpos="right" data-theme="o' + (i % 2) + '""><a href="#record-page" data-rel="page" data-transition="slide" onclick="GetImage(' + id + ');"> Game ' + (i + 1) + ' - ' + score + '</a></li>';
					$("#date_list").append(string);
				};
				freshList("date_list");
			} else {
				$.mobile.back();
			}
		}, errorDB);
	});
}

function ClearQuery(tx) {
	$("#bowl_list").empty();
	tx.executeSql('DELETE FROM blist');
	tx.executeSql('DROP TABLE blist');
	CreatQuery(tx);
	freshList("bowl_list");
}

/*
 function RemoveGame(e) {
 var id = $(e.currentTarget).attr('id').substring(4);
 var db = window.openDatabase(DBname, DBversion, DBdisname, DBsize);
 db.transaction(function(tx) {
 tx.executeSql('DELETE FROM blist WHERE id="' + id + '"');
 });
 RefreshData();
 }

 function RemoveDate(e) {
 var first = $('a', e.currentTarget).text().indexOf('[');
 var last = $('a', e.currentTarget).text().indexOf(']');
 var rawString = $('a', e.currentTarget).text().substring((first + 1), last);
 var date = new Date(rawString);
 var dateString = dateToYMD(date);

 var db = window.openDatabase(DBname, DBversion, DBdisname, DBsize);
 db.transaction(function(tx) {
 tx.executeSql('DELETE FROM blist WHERE date="' + dateString + '"');
 });
 }*/
function RemoveCurrentGame() {
	navigator.notification.confirm('Delete?', function(index) {
		if (index == 1) {
			var db = window.openDatabase(DBname, DBversion, DBdisname, DBsize);
			db.transaction(function(tx) {
				tx.executeSql('DELETE FROM blist WHERE id="' + mId + '"');
			});
			DateQuery(mDate);
			RefreshData();
			$.mobile.back();
		}
	});
}

function RemoveCurrentSession() {
	var dateValue = $("#date-page .date-header").text();
	var date = new Date(dateValue);
	var dateString = dateToYMD(date);
	var db = window.openDatabase(DBname, DBversion, DBdisname, DBsize);
	db.transaction(function(tx) {
		tx.executeSql('DELETE FROM blist WHERE date="' + dateString + '"');
	});
	DateQuery(mDate);
	RefreshData();
	$.mobile.back();
}

function GetImage(id) {
	mFile = "";
	var db = window.openDatabase(DBname, DBversion, DBdisname, DBsize);
	db.transaction(function(tx) {
		tx.executeSql('SELECT file,date,score,frames,' + frameCols + ' FROM blist WHERE id="' + id + '"', [], function(tx, results) {
			var len = results.rows.length;
			if (len > 0) {
				var imageData = results.rows.item(0).file;
				var date = new Date(results.rows.item(0).date);
				var score = results.rows.item(0).score;
				var frames = results.rows.item(0).frames;
				$(".date-header").text(date.toDateString());
				mId = id;
				if (imageData != "NULL" || imageData != "") {
					mFile = imageData;
				}

				populateScores(results.rows.item(0));
				$("#view-final-res").text(score);
			}
		});
	});

}

function ConfirmAllClear() {//ClearData(1);return;
	navigator.notification.confirm('Clear All Data?', ClearData);
}

function ConfirmSessionClear() {
	navigator.notification.confirm('Clear Session Data?', ClearSession);
}

function FindPhoto() {
	if (arguments.length == 0) {
		navigator.camera.getPicture(onEditSuccess, onCameraError, {
			quality : 40,
			allowEdit : true,
			sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
			destinationType : Camera.DestinationType.DATA_URL
		});
	} else {
		navigator.camera.getPicture(onNewSuccess, onCameraError, {
			quality : 40,
			allowEdit : true,
			sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
			destinationType : Camera.DestinationType.DATA_URL
		});
		mStatus = "busy";
	}
}

function TakePhoto() {
	if (arguments.length == 0) {
		navigator.camera.getPicture(onEditSuccess, onCameraError, {
			quality : 40,
			allowEdit : true,
			destinationType : Camera.DestinationType.DATA_URL
		});
	} else {
		navigator.camera.getPicture(onNewSuccess, onCameraError, {
			quality : 40,
			allowEdit : true,
			destinationType : Camera.DestinationType.DATA_URL
		});
		mStatus = "busy";
	}
}

function onEditSuccess(imageData) {
	var db = window.openDatabase(DBname, DBversion, DBdisname, DBsize);
	db.transaction(function(tx) {
		tx.executeSql('UPDATE blist SET file="' + imageData + '" WHERE id="' + mId + '"');
	});
	var string = '<img class="game-photo" src="' + "data:image/jpeg;base64," + imageData + '"></img>';
	$("#photo-content").html(string);
	$('#photo-content').trigger("create");
}

function onNewSuccess(imageData) {
	mStatus = "ready";
	mFile = "data:image/jpeg;base64," + imageData;
}

function errorDB(err) {
	alert("Error processing SQL: " + err.code);
}

function successDB() {
}

function onCameraError(message) {
	alert('Failed because: ' + message);
}

function onSuccess() {

}

function onError() {

}

function dateToYMD(date) {
	var d = date.getDate();
	var m = date.getMonth() + 1;
	var y = date.getFullYear();
	return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

function freshList(id) {
	var theid = "#" + id;
	$(theid).listview("refresh");
}

function resetFields() {
	mCanvas = "";
	mFile = "";

	$("#scoreinput").val("");

	$('#scoreinput').trigger("create");
	document.getElementById('dateinput').valueAsDate = new Date();
	calc('edit', 'new');
}

function share() {
	if (mCanvas != "") {
		window.plugins.socialsharing.available(function(isAvailable) {
			if (isAvailable) {
				window.plugins.socialsharing.share('Sharing my score via Pro Bowl app', "My Name", mCanvas, null);
			} else {
				alert("Social Plugin not available");
			}
		});
	} else {
		toast('Frames scores not recorded. Unable to share.');
	}
}

function shareComplete() {
	mCanvas = "";
	if (isCompleted()) {
		html2canvas($("#edit-bowling-calc-score-container"), {
			onrendered : function(canvas) {
				mCanvas = canvas.toDataURL("image/jepg");
				share();
			}
		});
	} else {
		toast('Frames scores not recorded. Unable to share.');
	}
}

function shareCapture() {
	mCanvas = "";
	if ($("#view-frame1-res").text().trim() != "") {
		html2canvas($("#view-bowling-calc-score-container"), {
			onrendered : function(canvas) {
				mCanvas = canvas.toDataURL("image/jepg");
				share();
			}
		});
	} else {
		toast('Frames scores not recorded. Unable to share.');
	}
}

function saveCapture() {
	if (isCompleted()) {
		html2canvas($("#edit-bowling-calc-score-container"), {
			onrendered : function(canvas) {
				mCanvas = canvas.toDataURL("image/jepg");

				$("#scoreinput").val($('#edit-final-res').text());
			}
		});
	}
}

function isLandscape() {
	return ($(window).width() > $(window).height());
}

function toast(msg) {
	window.plugins.toast.show(msg, 'long', 'center');
}

function buttonFeedback(mode) {//return;
	//if (mode == 'edit')
	//	navigator.notification.beep(1);
	//		navigator.notification.vibrate(100);
}

function draw() {
	drawLine($('#lineCanvas'));
	drawPie($('#pieCanvas'));
}

function drawLine(canvas) {
	canvas.empty();
	var width = canvas.parent().width();
	var height = $(window).height() * 0.4;
	canvas.attr("width", width);
	canvas.attr("height", height);

	var lineChartData = {
		labels : [],
		datasets : [{
			//fillColor : "rgba(220,220,220,0.5)",
			fillColor : "#FF9500",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "#FFAA33",
			pointStrokeColor : "#fff",
			data : [],
			title : "Hello"
		}]
	};

	var db = window.openDatabase(DBname, DBversion, DBdisname, DBsize);
	db.transaction(function(tx) {
		tx.executeSql("SELECT AVG(score) AS a, date FROM blist GROUP BY date ORDER BY date DESC LIMIT 5", [], function(tx, results) {
			var len = results.rows.length;
			var max = 0;
			var min = 300;
			for (var i = len - 1; i >= 0; i--) {
				var date = new Date(results.rows.item(i).date);
				var avg = Math.floor(results.rows.item(i).a);
				if ( avg > max )
					max = avg;
				if ( min > avg )
					min = avg;
				var d = date.getDate();
				var m = date.getMonth() + 1;
				var dateString = (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m);

				lineChartData.labels.push(dateString);
				lineChartData.datasets[0].data.push(avg);
			}
			var options = {
				scaleOverride : true,
				scaleSteps : 10,
				scaleStepWidth : Math.floor((max-min)/10),
				scaleStartValue : min,
			};
			var myLine = new Chart(canvas.get(0).getContext("2d")).Line(lineChartData, options);
		});
	});
}

function drawPie(canvas) {
	canvas.empty();
	var width = canvas.parent().width();
	var height = $(window).height() * 0.4;
	canvas.attr("width", width);
	canvas.attr("height", height);

	var data = [{
		value : 0,
		color : "#FF3A2D",
		title : "Strikes"
	}, {
		value : 0,
		color : "#FF9500",
		title : "Spares"
	}, {
		value : 0,
		color : "#4A4A4A",
		title : "Open"
	}];

	var myoptions = {
		inGraphDataShow : true,
		inGraphDataAnglePosition : 2,
		inGraphDataRadiusPosition : 2,
		inGraphDataRotate : "inRadiusAxisRotateLabels",
		inGraphDataAlign : "center",
		inGraphDataVAlign : "middle",
		inGraphDataFontColor : "white",
		inGraphDataFontSize : 11
	}
	var db = window.openDatabase(DBname, DBversion, DBdisname, DBsize);
	db.transaction(function(tx) {
		tx.executeSql('SELECT AVG(strikes) AS a, AVG(spares) AS s FROM blist WHERE frames="true"', [], function(tx, results) {
			var ask = (results.rows.item(0).a == null) ? 0 : results.rows.item(0).a;
			var asp = (results.rows.item(0).s == null) ? 0 : results.rows.item(0).s;
			data[0].value = Math.floor(ask);
			data[1].value = Math.floor(asp);
			data[2].value = (11 - Math.floor(ask) - Math.floor(asp));

			var myPie = new Chart(canvas.get(0).getContext("2d")).Pie(data, myoptions);
		});
	});
}
