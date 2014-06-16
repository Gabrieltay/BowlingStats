/**
 * Display bowling calc
 */
//jQuery(document).ready(function() {
//	jQuery("#calc-wrapper").show();
//});

/**
 * Form variable to perform operations on calc form.
 */

var frame_no = 1;
var throw_no = 1;
var complete = 0;
//var scores = new Array();
var results = [];
//new Array();

/**
 * Function to return result for the operation performed on calc.
 */
function calc(mode, op) {

	if (throw_no == 1) {
		results[frame_no] = [];
	} else if (throw_no == 2) {
		injectYBtn(10);
	}

	if (op == "1" || op == "2" || op == "3" || op == "4" || op == "5" || op == "6" || op == "7" || op == "8" || op == "9" || op == "0") {

		results[frame_no][throw_no] = parseInt(op);
		
		if (throw_no == 1) {
			$('#' + mode + '-frame' + frame_no + '-1').text(op);
			throw_no++;
			injectYBtn(parseInt(10 - op));
		} else if (throw_no == 2) {

			results[frame_no]['status'] = 'no';

			$('#' + mode + '-frame' + frame_no + '-2').text(op);

			if (frame_no != 10) {
				calculate_frame_result(mode, parseInt(results[frame_no][throw_no] + results[frame_no][throw_no - 1]));
				throw_no--;
				frame_no++;
				injectXBtn(10);
			} else {
				if (results[frame_no]['1'] != 10) {
					calculate_frame_result(mode, parseInt(parseInt(results[frame_no][throw_no]) + parseInt(results[frame_no][throw_no - 1])));
					throw_no++;
					end_game();
				} else {
					throw_no++;
				}
			}
		} else {
			$('#' + mode + '-frame' + frame_no + '-3').text(op);

			calculate_frame_result(mode, parseInt(parseInt(results[frame_no][throw_no]) + parseInt(results[frame_no][throw_no - 1]) + parseInt(results[frame_no][throw_no - 2])));
			if (frame_no == 10) {
				throw_no++;
				end_game();
			} else {
				throw_no = 1;
				frame_no++;
				injectXBtn(10);
			}
		}
		return;
	}

	if (op == "erase") {
		complete = 0;
		switch (throw_no) {
			case 1:
				if (frame_no == 1)
					return;
				$('#' + mode + '-frame' + (frame_no - 1) + '-res').text('\xa0');
				if (frame_no >= 2 && results[frame_no-1]['status'] == 'X')// Previous Strike
				{
					$('#' + mode + '-frame' + (frame_no - 1) + '-1').text('');
					$('#' + mode + '-frame' + (frame_no - 1) + '-2').text('');
					throw_no = 1;
				} else if (frame_no >= 2) {
					var throw_1 = results[frame_no-1][1];
					$('#' + mode + '-frame' + (frame_no - 1) + '-2').text('');
					injectYBtn(parseInt(10 - throw_1));
					throw_no = 2;
				}
				if (frame_no > 2)
					recalculate(mode, frame_no - 2);
				else {
					results[frame_no]['status'] = null;
					results[frame_no]['result'] = null;
					$('#' + mode + '-frame' + 1 + '-res').text('');
					frame_no--;
				}
				break;
			case 2:
				if (frame_no >= 1) {
					$('#' + mode + '-frame' + (frame_no) + '-1').text('');
					injectXBtn(10);
					throw_no = 1;
				}
				break;
			case 3:
				if (frame_no == 10) {

					$('#' + mode + '-frame' + frame_no + '-2').text('');
					if ($('#' + mode + '-frame' + frame_no + '-1').text() == 'X') {
						injectXBtn(10);
					} else {
						$('#' + mode + '-frame' + frame_no + '-res').text('');
						injectYBtn(parseInt(10 - parseInt($('#' + mode + '-frame' + frame_no + '-1').text())));
					}
					throw_no = 2;
					recalculate(mode, frame_no - 1);
				}
				break;
			default:
				if (frame_no == 10) {
					$('#' + mode + '-frame' + (frame_no) + '-3').text('');
					$('#' + mode + '-frame' + frame_no + '-res').text('');
					if ($('#' + mode + '-frame' + frame_no + '-2').text() == 'X') {
						injectXBtn(10);
					} else {
						injectYBtn(parseInt(10 - parseInt($('#' + mode + '-frame' + frame_no + '-2').text())));
					}
					recalculate(mode, frame_no - 1);
					throw_no = 3;
				}
				break;

		}
	}

	if (op == "X") {

		if (frame_no == 10) {

			results[frame_no][throw_no] = '10';

			switch (throw_no) {
				case 1:
					$('#' + mode + '-frame' + frame_no + '-1').text('X');
					break;
				case 2:
					$('#' + mode + '-frame' + frame_no + '-2').text('X');
					injectXBtn(10);
					break;
				case 3:
					$('#' + mode + '-frame' + frame_no + '-3').text('X');
					calculate_frame_result(mode, parseInt(parseInt(results[frame_no]['1']) + parseInt(results[frame_no]['2']) + parseInt(results[frame_no]['3'])));
					end_game();
					break;
			}
			throw_no++;
		} else {
			results[frame_no]['status'] = 'X';
			results[frame_no][throw_no] = '10';
			results[frame_no][throw_no + 1] = '';
			calculate_frame_result(mode, parseInt(10));

			$('#' + mode + '-frame' + frame_no + '-1').text('');
			$('#' + mode + '-frame' + frame_no + '-2').text('X');

			frame_no++;
			injectXBtn(10);
		}
		return;
	}

	if (op == "/") {

		if (frame_no == 10) {

			results[frame_no][throw_no] = parseInt(10 - parseInt(results[frame_no][throw_no - 1]));

			switch (throw_no) {
				case 2:
					$('#' + mode + '-frame' + frame_no + '-2').text('/');
					injectXBtn(10);
					throw_no++;
					break;
				case 3:
					$('#' + mode + '-frame' + frame_no + '-3').text('/');
					calculate_frame_result(mode, parseInt(parseInt(results[frame_no]['1']) + parseInt(results[frame_no]['2']) + parseInt(results[frame_no]['3'])));
					throw_no++;
					end_game();
					break;
			}
		} else {
			results[frame_no]['status'] = '/';
			results[frame_no][throw_no] = parseInt(10 - results[frame_no][throw_no - 1]);
			calculate_frame_result(mode, parseInt(10));
			$('#' + mode + '-frame' + frame_no + '-2').text('/');

			frame_no++;
			throw_no--;
			injectXBtn(10);
		}
		return;
	}

	if (op == "new") {
		complete = 0;
		for (var i = 1; i <= 10; i++) {
			$('#' + mode + '-frame' + i + '-1').text('\xa0');
			$('#' + mode + '-frame' + i + '-2').text('\xa0');
			$('#' + mode + '-frame' + i + '-res').text('\xa0');
			results.length = 0;
		}

		$('#' + mode + '-frame10-3').text('\xa0');
		$('#' + mode + '-final-res').text('\xa0');
		frame_no = 1;
		throw_no = 1;
		injectXBtn(10);
	}
}

function recalculate(mode, last_frame) {
	frame_no = 1;
	while (frame_no <= last_frame) {
		if (results[frame_no]['status'] != null) {
			if (results[frame_no]['status'] == 'no') {
				calculate_frame_result(mode, parseInt(results[frame_no][1] + results[frame_no][2]));
			} else if (results[frame_no]['status'] == 'X' || results[frame_no]['status'] == '/') {
				calculate_frame_result(mode, parseInt(10));
			}

			frame_no++;
		} else {
			return;
		}

	}
}

function calculate_frame_result(mode, frame_res) {

	switch (frame_no) {
		case 1:
			results[frame_no]['result'] = frame_res;
			break;
		case 2:
			if (results[frame_no-1]['status'] == 'X') {
				results[frame_no-1]['result'] = parseInt(results[frame_no-1]['result']) + frame_res;
			} else if (results[frame_no-1]['status'] == '/') {
				results[frame_no-1]['result'] = parseInt(results[frame_no-1]['result']) + parseInt(results[frame_no]['1']);
			}
			results[frame_no]['result'] = parseInt(results[frame_no-1]['result'] + frame_res);
			break;
		default:
			if (results[frame_no-1]['status'] == 'X') {
				if (results[frame_no-2]['status'] == 'X') {
					results[frame_no-2]['result'] = parseInt(results[frame_no-2]['result']) + parseInt(results[frame_no]['1']);
					results[frame_no-1]['result'] = parseInt(results[frame_no-1]['result']) + parseInt(results[frame_no]['1']);
				}
				results[frame_no-1]['result'] = parseInt(results[frame_no-1]['result']) + parseInt(results[frame_no]['1']) + (results[frame_no]['2'] == '' ? parseInt(0) : parseInt(results[frame_no]['2']));
			} else if (results[frame_no-1]['status'] == '/') {
				results[frame_no-1]['result'] = parseInt(results[frame_no-1]['result']) + parseInt(results[frame_no]['1']);
			}
			results[frame_no]['result'] = parseInt(results[frame_no-1]['result'] + frame_res);
			break;
	}
	update_frame_result(mode);
	return;
}

function update_frame_result(mode) {

	switch (frame_no) {
		case 1:
			$('#' + mode + '-frame' + frame_no + '-res').text(results[frame_no]['result']);
			break;
		case 2:
			$('#' + mode + '-frame' + parseInt(frame_no - 1) + '-res').text(results[frame_no-1]['result']);
			$('#' + mode + '-frame' + frame_no + '-res').text(results[frame_no]['result']);
			break;
		default:
			$('#' + mode + '-frame' + parseInt(frame_no - 2) + '-res').text(results[frame_no-2]['result']);
			$('#' + mode + '-frame' + parseInt(frame_no - 1) + '-res').text(results[frame_no-1]['result']);
			$('#' + mode + '-frame' + frame_no + '-res').text(results[frame_no]['result']);
			break;
	}
	$('#' + mode + '-final-res').text(results[frame_no]['result']);
	return;
}

function end_game() {
	complete = 1;
	clearBtn();
	$('.final-res-container').append('<h1 id="edit-final-res" class="final-res">'+results[frame_no]['result']+'</h1>');
}

function injectXBtn(num) {
	var htmlString = "";
	var calcStr = "";
	var tableId = 1;
	$(".bowling-calc-buttons-table-1").empty();
	$(".bowling-calc-buttons-table-2").empty();
	for (var i = 0; i < num; i++) {
		if (! isLandscape())
			tableId = parseInt(i / 6) + 1;
		calcStr = "calc('edit','" + i + "')";
		//htmlString = '<td class="bowling-calc-buttons-container"><input type="button" data-theme="n" name="b-' + i + '" value="' + i + '" onclick=' + calcStr + ' /></td>';
		htmlString = '<td class="bowling-calc-buttons-container"><a href="#" data-role="button" data-theme="n" name="b-' + i + '" value="' + i + '" onclick=' + calcStr + '>'+ i +'</a></td>';
		//htmlString = '<td class="bowling-calc-buttons-container"><a href="#" class="x-btn" data-theme="n" data-role="button" onclick=' + calcStr + '><image src="images/'+i+'-icon.png"/></a></td>';
		$('.bowling-calc-buttons-table-' + tableId).append(htmlString);
	}
	calcStr = "calc('edit','X')";
	var imgString = '<image src="images/X-icon.png"/>';
	/*
	for ( var j = frame_no -1; j >= 1; j-- )
	{
		if ( results[j]['status'] == 'X' )
			imgString = imgString + '<image src="images/X-icon.png"/>';
		else
			break;
	}*/
	
	//htmlString = '<td class="bowling-calc-buttons-container"><input type="button" class="x-btn" data-theme="n" name="b-X" value="X" onclick=' + calcStr + ' /></td>';
	htmlString = '<td class="bowling-calc-buttons-container"><a href="#" data-role="button" data-theme="n" name="b-X " value="' + i + '" onclick=' + calcStr + '>X</a></td>';
	//htmlString = '<td class="bowling-calc-buttons-container"><a href="#" class="x-btn" data-theme="n" data-role="button" onclick=' + calcStr + '><image src="images/X-icon.png"/></a></td>';
	//htmlString = '<a href="#" class="x-btn" data-theme="n" data-role="button" onclick=' + calcStr + '>'+imgString+'</a>';

	$(".close-frame-btn").empty();
	//$(".close-frame-btn").append(htmlString);
	if (num >= 6 && !isLandscape())
		$(".bowling-calc-buttons-table-2").append(htmlString);
	else
		$(".bowling-calc-buttons-table-1").append(htmlString);
	$(".bowling-calc-buttons-table-1").trigger('create');
	$(".bowling-calc-buttons-table-2").trigger('create');
	$(".close-frame-btn").trigger('create');
}

function injectYBtn(num) {
	var htmlString = "";
	var calcStr = "";
	var tableId = 1;
	$(".bowling-calc-buttons-table-1").empty();
	$(".bowling-calc-buttons-table-2").empty();
	for (var i = 0; i < num; i++) {
		if (! isLandscape())
			tableId = parseInt(i / 6) + 1;
		calcStr = "calc('edit','" + i + "')";
		//htmlString = '<td class="bowling-calc-buttons-container"><input type="button" data-theme="n" name="b-' + i + '" value="' + i + '" onclick=' + calcStr + ' /></td>';
		htmlString = '<td class="bowling-calc-buttons-container"><a href="#" data-role="button" data-theme="n" name="b-' + i + '" value="' + i + '" onclick=' + calcStr + '>'+ i +'</a></td>';
		//htmlString = '<td class="bowling-calc-buttons-container"><a href="#" class="x-btn" data-theme="n" data-role="button" onclick=' + calcStr + '><image src="images/'+i+'-icon.png"/></a></td>';
		$('.bowling-calc-buttons-table-' + tableId).append(htmlString);
	}
	calcStr = "calc('edit','/')";
	//htmlString = '<td class="bowling-calc-buttons-container"><input type="button" data-theme="n" name="b-/" value="/" onclick=' + calcStr + ' /></td>';
	htmlString = '<td class="bowling-calc-buttons-container"><a href="#" data-role="button" data-theme="n" name="b-/ " value="' + i + '" onclick=' + calcStr + '>/</a></td>';
	//htmlString = '<td class="bowling-calc-buttons-container"><a href="#" class="x-btn" data-theme="n" data-role="button" onclick=' + calcStr + '><image src="images/S-icon.png"/></a></td>';
	//htmlString = '<a href="#" class="x-btn" data-theme="n" data-role="button" onclick=' + calcStr + '><image src="images/S-icon.png"/></a>';
	$(".close-frame-btn").empty();
	//$(".close-frame-btn").append(htmlString);
	if (num >= 6 && !isLandscape())
		$(".bowling-calc-buttons-table-2").append(htmlString);
	else
		$(".bowling-calc-buttons-table-1").append(htmlString);
	$(".bowling-calc-buttons-table-1").trigger('create');
	$(".bowling-calc-buttons-table-2").trigger('create');
	$(".close-frame-btn").trigger('create');
}

function clearBtn() {
	$(".bowling-calc-buttons-table-1").empty();
	$(".bowling-calc-buttons-table-2").empty();
	$(".close-frame-btn").empty();
	$(".bowling-calc-buttons-table-1").trigger('create');
	$(".bowling-calc-buttons-table-2").trigger('create');
	$(".close-frame-btn").trigger('create');
}

function populateScores(record) {
	calc('view', 'new');
	$('#view-frame1-1').text((record.frame_1_1 == '') ? '\xa0' : record.frame_1_1);
	$('#view-frame1-2').text((record.frame_1_2 == '') ? '\xa0' : record.frame_1_2);
	$('#view-frame2-1').text((record.frame_2_1 == '') ? '\xa0' : record.frame_2_1);
	$('#view-frame2-2').text((record.frame_2_2 == '') ? '\xa0' : record.frame_2_2);
	$('#view-frame3-1').text((record.frame_3_1 == '') ? '\xa0' : record.frame_3_1);
	$('#view-frame3-2').text((record.frame_3_2 == '') ? '\xa0' : record.frame_3_2);
	$('#view-frame4-1').text((record.frame_4_1 == '') ? '\xa0' : record.frame_4_1);
	$('#view-frame4-2').text((record.frame_4_2 == '') ? '\xa0' : record.frame_4_2);
	$('#view-frame5-1').text((record.frame_5_1 == '') ? '\xa0' : record.frame_5_1);
	$('#view-frame5-2').text((record.frame_5_2 == '') ? '\xa0' : record.frame_5_2);
	$('#view-frame6-1').text((record.frame_6_1 == '') ? '\xa0' : record.frame_6_1);
	$('#view-frame6-2').text((record.frame_6_2 == '') ? '\xa0' : record.frame_6_2);
	$('#view-frame7-1').text((record.frame_7_1 == '') ? '\xa0' : record.frame_7_1);
	$('#view-frame7-2').text((record.frame_7_2 == '') ? '\xa0' : record.frame_7_2);
	$('#view-frame8-1').text((record.frame_8_1 == '') ? '\xa0' : record.frame_8_1);
	$('#view-frame8-2').text((record.frame_8_2 == '') ? '\xa0' : record.frame_8_2);
	$('#view-frame9-1').text((record.frame_9_1 == '') ? '\xa0' : record.frame_9_1);
	$('#view-frame9-2').text((record.frame_9_2 == '') ? '\xa0' : record.frame_9_2);
	$('#view-frame10-1').text((record.frame_10_1 == '') ? '\xa0' : record.frame_10_1);
	$('#view-frame10-2').text((record.frame_10_2 == '') ? '\xa0' : record.frame_10_2);
	$('#view-frame10-3').text((record.frame_10_3 == '') ? '\xa0' : record.frame_10_3);

	for ( frame_no = 1; frame_no < 10; frame_no++) {
		results[frame_no] = [];
		for ( throw_no = 1; throw_no <= 2; throw_no++) {
			var op = $('#view-frame' + frame_no + '-' + throw_no).text();

			if (op == "1" || op == "2" || op == "3" || op == "4" || op == "5" || op == "6" || op == "7" || op == "8" || op == "9" || op == "0") {
				results[frame_no][throw_no] = parseInt(op);

				if (throw_no == 2)
					results[frame_no]['status'] = 'no';
			} else {
				if (op == 'X') {
					results[frame_no]['status'] = 'X';
					results[frame_no][1] = '10';
					results[frame_no][2] = '';
				} else if (op == '/') {
					results[frame_no]['status'] = '/';
					results[frame_no][throw_no] = parseInt(10 - results[frame_no][throw_no - 1]);
				}
			}
		}
	}
	recalculate('view', 9);
	if (frame_no == 10) {
		throw_no = 1;
		while (throw_no <= 3) {
			//alert(throw_no + ' - ' + $('#view-frame10-' + throw_no).text());
			if ($('#view-frame10-' + throw_no).text() != '\xa0') {
				calc('view', $('#view-frame10-' + throw_no).text());
			} else
				throw_no++;
		}
	}
}

function saveScores() {
	if (complete == 1) {
		capture();
	} else {
		alert("Game is not finished!");
	}
}

function getScores() {
	var resultStr = '';
	var frameStr = "";
	for (var f = 1; f <= 10; f++)
		for (var t = 1; t < 3; t++) {
			frameStr = $('#edit-frame' + f + '-' + t).text();
			resultStr = resultStr + '"' + frameStr + '",';
		}
	frameStr = $('#edit-frame10-3').text();
	resultStr = resultStr + '"' + frameStr + '"';
	return resultStr;
}

function getStrikes() {
	var result = 0;
	for (var f = 1; f <= 10; f++)
		for (var t = 1; t < 3; t++) {
			frameStr = $('#edit-frame' + f + '-' + t).text();
			if (frameStr == 'X')
				result++;
		}
	if ($('#edit-frame10-3').text() == 'X')
		result++;
	return result;
}

function getSpares() {
	var result = 0;
	for (var f = 1; f <= 10; f++) {
		frameStr = $('#edit-frame' + f + '-2').text();
		if (frameStr == '/')
			result++;
	}
	if ($('#edit-frame10-3').text() == '/')
		result++;
	return result;
}

function isCompleted() {
	return complete;
}
