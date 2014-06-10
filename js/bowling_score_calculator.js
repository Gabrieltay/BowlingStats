/**
 * Display bowling calc
 */
jQuery(document).ready(function() {
	jQuery("#calc-wrapper").show();
});

/**
 * Form variable to perform operations on calc form.
 */
var form = "";

var frame_no = 1;
var throw_no = 1;

//var scores = new Array();
var results = [];
//new Array();

/**
 * Function to return result for the operation performed on calc.
 */
function calc(op) {
	//alert(op);
	form = document.getElementById("generate-bowling-score-calculator");

	if (throw_no == 1) {
		results[frame_no] = [];
	} else if (throw_no == 2) {
		injectYBtn(10);
	}

	if (op == "1" || op == "2" || op == "3" || op == "4" || op == "5" || op == "6" || op == "7" || op == "8" || op == "9" || op == "0") {

		results[frame_no][throw_no] = parseInt(op);

		if (throw_no == 1) {
			$('#edit-frame' + frame_no + '-1').text(op);
			throw_no++;
			injectYBtn(parseInt(10 - op));
		} else if (throw_no == 2) {

			results[frame_no]['status'] = 'no';

			$('#edit-frame' + frame_no + '-2').text(op);

			if (frame_no != 10) {
				calculate_frame_result(parseInt(results[frame_no][throw_no] + results[frame_no][throw_no - 1]));
				throw_no--;
				frame_no++;
				injectXBtn(10);
			} else {
				if (results[frame_no]['1'] != 10) {
					calculate_frame_result(parseInt(parseInt(results[frame_no][throw_no]) + parseInt(results[frame_no][throw_no - 1])));
					throw_no++;
					end_game();
				} else {
					throw_no++;
				}
			}
		} else {
			$('#edit-frame' + frame_no + '-3').text(op);

			calculate_frame_result(parseInt(parseInt(results[frame_no][throw_no]) + parseInt(results[frame_no][throw_no - 1]) + parseInt(results[frame_no][throw_no - 2])));
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
		switch (throw_no) {
			case 1:
				if ( frame_no == 1)
					return;
				$('#edit-frame' + (frame_no - 1) + '-res').text('\xa0');
				if (frame_no >= 2 && results[frame_no-1]['status'] == 'X')// Previous Strike
				{
					$('#edit-frame' + (frame_no - 1) + '-1').text('');
					$('#edit-frame' + (frame_no - 1) + '-2').text('');
					throw_no = 1;
				} else if (frame_no >= 2) {
					var throw_1 = results[frame_no-1][1];
					$('#edit-frame' + (frame_no - 1) + '-2').text('');
					injectYBtn(parseInt(10 - throw_1));
					throw_no = 2;
				}
				if (frame_no > 2)
					recalculate(frame_no - 2);
				else {
					results[frame_no]['status'] = null;
					results[frame_no]['result'] = null;
					$('#edit-frame' + 1 + '-res').text('');
					frame_no--;
				}
				break;
			case 2:
				if (frame_no >= 1) {
					$('#edit-frame' + (frame_no) + '-1').text('');
					injectXBtn(10);
					throw_no = 1;
				}
				break;
			case 3:
				if (frame_no == 10) {

					$('#edit-frame' + frame_no + '-2').text('');
					if ($('#edit-frame' + frame_no + '-1').text() == 'X') {
						injectXBtn(10);
					} else {
						$('#edit-frame' + frame_no + '-res').text('');
						injectYBtn(parseInt(10 - parseInt($('#edit-frame' + frame_no + '-1').text())));
					}
					throw_no = 2;
					recalculate(frame_no - 1);
				}
				break;
			default:
				if (frame_no == 10) {
					$('#edit-frame' + (frame_no) + '-3').text('');
					$('#edit-frame' + frame_no + '-res').text('');
					if ($('#edit-frame' + frame_no + '-2').text() == 'X') {
						injectXBtn(10);
					} else {
						injectYBtn(parseInt(10 - parseInt($('#edit-frame' + frame_no + '-2').text())));
					}
					recalculate(frame_no - 1);
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
					$('#edit-frame' + frame_no + '-1').text('X');
					break;
				case 2:
					$('#edit-frame' + frame_no + '-2').text('X');
					injectXBtn(10);
					break;
				case 3:
					$('#edit-frame' + frame_no + '-3').text('X');
					calculate_frame_result(parseInt(parseInt(results[frame_no]['1']) + parseInt(results[frame_no]['2']) + parseInt(results[frame_no]['3'])));
					end_game();
					break;
			}
			throw_no++;
		} else {
			results[frame_no]['status'] = 'X';
			results[frame_no][throw_no] = '10';
			results[frame_no][throw_no + 1] = '';
			calculate_frame_result(parseInt(10));

			$('#edit-frame' + frame_no + '-1').text('');
			$('#edit-frame' + frame_no + '-2').text('X');

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
					$('#edit-frame' + frame_no + '-2').text('/');
					injectXBtn(10);
					throw_no++;
					break;
				case 3:
					$('#edit-frame' + frame_no + '-3').text('/');
					calculate_frame_result(parseInt(parseInt(results[frame_no]['1']) + parseInt(results[frame_no]['2']) + parseInt(results[frame_no]['3'])));
					throw_no++;
					end_game();
					break;
			}
		} else {
			results[frame_no]['status'] = '/';
			results[frame_no][throw_no] = parseInt(10 - results[frame_no][throw_no - 1]);
			calculate_frame_result(parseInt(10));
			$('#edit-frame' + frame_no + '-2').text('/');

			frame_no++;
			throw_no--;
			injectXBtn(10);
		}
		return;
	}

	if (op == "new") {
		for (var i = 1; i <= 10; i++) {
			$('#edit-frame' + i + '-1').text('\xa0');
			$('#edit-frame' + i + '-2').text('\xa0');
			$('#edit-frame' + i + '-res').text('\xa0');
			results.length = 0;
		}

		$('#edit-frame10-3').text('\xa0');
		$('#final-res').text('\xa0');
		frame_no = 1;
		throw_no = 1;
		injectXBtn(10);
	}
}

function recalculate(last_frame) {
	frame_no = 1;
	while (frame_no <= last_frame) {
		if (results[frame_no]['status'] != null) {
			if (results[frame_no]['status'] == 'no') {
				calculate_frame_result(parseInt(results[frame_no][1] + results[frame_no][2]));
			} else if (results[frame_no]['status'] == 'X' || results[frame_no]['status'] == '/') {
				calculate_frame_result(parseInt(10));
			}

			frame_no++;
		} else {
			return;
		}

	}
}

function calculate_frame_result(frame_res) {

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
	update_frame_result();
	return;
}

function update_frame_result() {

	switch (frame_no) {
		case 1:
			//eval("form['frame" + frame_no + "-res'].value = " + results[frame_no]['result']);
			$('#edit-frame' + frame_no + '-res').text(results[frame_no]['result']);
			break;
		case 2:
			//eval("form['frame" + parseInt(frame_no-1) + "-res'].value = " + results[frame_no-1]['result']);
			//eval("form['frame" + frame_no + "-res'].value = " + results[frame_no]['result']);
			$('#edit-frame' + parseInt(frame_no - 1) + '-res').text(results[frame_no-1]['result']);
			$('#edit-frame' + frame_no + '-res').text(results[frame_no]['result']);
			break;
		default:
			//eval("form['frame" + parseInt(frame_no-2) + "-res'].value = " + results[frame_no-2]['result']);
			//eval("form['frame" + parseInt(frame_no-1) + "-res'].value = " + results[frame_no-1]['result']);
			//eval("form['frame" + frame_no + "-res'].value = " + results[frame_no]['result']);
			$('#edit-frame' + parseInt(frame_no - 2) + '-res').text(results[frame_no-2]['result']);
			$('#edit-frame' + parseInt(frame_no - 1) + '-res').text(results[frame_no-1]['result']);
			$('#edit-frame' + frame_no + '-res').text(results[frame_no]['result']);
			break;
	}
	//eval("form['game_result'].value = " + results[frame_no]['result']);
	//$('#edit-game-result').text(results[frame_no]['result']);
	$('#final-res').text(results[frame_no]['result']);
	return;
}

function end_game() {
	clearBtn();
}

function injectXBtn(num) {
	var htmlString = "";
	var calcStr = "";
	$(".bowling-calc-buttons-table-1").empty();
	$(".bowling-calc-buttons-table-2").empty();
	for (var i = 0; i < num; i++) {
		var tableId = parseInt(i/6) + 1;
		calcStr = "calc('" + i + "')";
		htmlString = '<td class="bowling-calc-buttons-container"><input type="button" name="b-' + i + '" value="' + i + '" onclick=' + calcStr + ' /></td>';
		$('.bowling-calc-buttons-table-' + tableId).append(htmlString);
	}
	calcStr = "calc('X')";
	htmlString = '<td class="bowling-calc-buttons-container"><input type="button" name="b-X" value="X" onclick=' + calcStr + ' /></td>';
	if ( num >= 6 )
		$(".bowling-calc-buttons-table-2").append(htmlString);
	else
		$(".bowling-calc-buttons-table-1").append(htmlString);
	$(".bowling-calc-buttons-table-1").trigger('create');
	$(".bowling-calc-buttons-table-2").trigger('create');
}

function injectYBtn(num) {
	var htmlString = "";
	var calcStr = "";
	$(".bowling-calc-buttons-table-1").empty();
	$(".bowling-calc-buttons-table-2").empty();
	for (var i = 0; i < num; i++) {
		var tableId = parseInt(i/6) + 1;
		calcStr = "calc('" + i + "')";
		htmlString = '<td class="bowling-calc-buttons-container"><input type="button" name="b-' + i + '" value="' + i + '" onclick=' + calcStr + ' /></td>';
		$('.bowling-calc-buttons-table-' + tableId).append(htmlString);
	}
	calcStr = "calc('/')";
	htmlString = '<td class="bowling-calc-buttons-container"><input type="button" name="b-/" value="/" onclick=' + calcStr + ' /></td>';
	if ( num >= 6 )
		$(".bowling-calc-buttons-table-2").append(htmlString);
	else
		$(".bowling-calc-buttons-table-1").append(htmlString);
	$(".bowling-calc-buttons-table-1").trigger('create');
	$(".bowling-calc-buttons-table-2").trigger('create');
}

function clearBtn() {
	$(".bowling-calc-buttons-table-1").empty();
	$(".bowling-calc-buttons-table-2").empty();
	$(".bowling-calc-buttons-table-1").trigger('create');
	$(".bowling-calc-buttons-table-2").trigger('create');
}
