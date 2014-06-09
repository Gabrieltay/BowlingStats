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
function calc(op, calcType) {
	
	//_gaq.push(['_trackEvent', calcType, op]);

	if (calcType == "ten-pin") {
		form = document.getElementById("generate-bowling-score-calculator");
	} else if (calcType == "duckpin") {
		form = document.getElementById("generate-duckpin-bowling-calculator");
	}

	if (throw_no == 1) {
		results[frame_no] = [];
	} else if (throw_no == 2) {
		for (var j = 0; j < 10; j++) {
			eval("form['b-" + j + "'].disabled=false");
		}
		form['b-/'].disabled = false;
	}
	
	if (op == "1" || op == "2" || op == "3" || op == "4" || op == "5" || op == "6" || op == "7" || op == "8" || op == "9" || op == "0") {

		results[frame_no][throw_no] = parseInt(op);

		if (throw_no == 1) {
			$('#edit-frame' + frame_no + '-1').text(op);
			throw_no++;
			form['b-X'].disabled=true;
			form['b-/'].disabled = false;
			for (var k = parseInt(10 - op); k < 10; k++) {
				eval("form['b-" + k + "'].disabled=true");
			}
		} else if (throw_no == 2) {

			results[frame_no]['status'] = 'no';


			$('#edit-frame' + frame_no + '-2').text(op);

			if (frame_no != 10) {
				calculate_frame_result(parseInt(results[frame_no][throw_no] + results[frame_no][throw_no - 1]));
				throw_no--;
				frame_no++;
				form['b-/'].disabled = true;
				form['b-X'].disabled = false;
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
				for (var k = 1; k < 10; k++) {
					eval("form['b-" + k + "'].disabled=false");
					form['b-X'].disabled = false;
					form['b-/'].disabled = true;
				}
			}
		}
		//$('#debug').text(frame_no + ' - ' + throw_no);
		return;
	}

	if (op == "erase") {
		switch (throw_no) {
			case 1:
				$('#edit-frame' + (frame_no - 1) + '-res').text('\xa0');
				if (frame_no >= 2 && results[frame_no-1]['status'] == 'X')// Previous Strike
				{
					$('#edit-frame' + (frame_no - 1) + '-1').text('');
					$('#edit-frame' + (frame_no - 1) + '-2').text('');
					throw_no = 1;
				}
				else if (frame_no >= 2)
				{
					var throw_1 = results[frame_no-1][1];
					$('#edit-frame' + (frame_no - 1) + '-2').text('');
					form['b-X'].disabled = true;
					form['b-/'].disabled = false;
					for (var k = parseInt(10 - throw_1); k < 10; k++) {
						eval("form['b-" + k + "'].disabled=true");
					}
					throw_no = 2;
				}
				if ( frame_no > 2 )
					recalculate(frame_no - 2);
				else
					{
						results[frame_no]['status'] = null;
						results[frame_no]['result'] = null;
						$('#edit-frame' + 1 + '-res').text('');
						frame_no--;
					}	
				break;
			case 2:
				if (frame_no >= 1)
				{
					$('#edit-frame' + (frame_no) + '-1').text('');
					for (var k = 1; k < 10; k++) {
						eval("form['b-" + k + "'].disabled=false");
						form['b-X'].disabled = false;
						form['b-/'].disabled = true;
						throw_no = 1;
					}
				}
				break;
			case 3:
				if (frame_no == 10)
				{
					
					$('#edit-frame' + frame_no + '-2').text('');
					if ($('#edit-frame' + frame_no + '-1').text() == 'X')
					{
						for (var k = 0; k < 10; k++) {
						eval("form['b-" + k + "'].disabled=false");}
						form['b-X'].disabled = false;
						form['b-/'].disabled = true;
					}
					else 
					{
						$('#edit-frame' + frame_no + '-res').text('');
						form['b-X'].disabled = true;
						form['b-/'].disabled = false;
						for (var k = 0; k < 10; k++) {
							eval("form['b-" + k + "'].disabled=false");
							}
						for (var k = parseInt(10 - parseInt($('#edit-frame' + frame_no + '-1').text())); k < 10; k++) {
							eval("form['b-" + k + "'].disabled=true");
							}
					}
					throw_no = 2;
					recalculate(frame_no - 1);
				}
				break;
			default:
				if (frame_no == 10)
				{
					$('#edit-frame' + (frame_no) + '-3').text('');
					$('#edit-frame' + frame_no + '-res').text('');
					if ($('#edit-frame' + frame_no + '-2').text() == 'X')
					{
						for (var k = 0; k < 10; k++) {
						eval("form['b-" + k + "'].disabled=false");}
						form['b-X'].disabled = false;
						form['b-/'].disabled = true;
					}
					else
					{
						form['b-X'].disabled = true;
						form['b-/'].disabled = false;
						for (var k = 0; k < 10; k++) {
							eval("form['b-" + k + "'].disabled=false");
							}
						for (var k = parseInt(10 - parseInt($('#edit-frame' + frame_no + '-2').text())); k < 10; k++) {
							eval("form['b-" + k + "'].disabled=true");
							}
					}
					recalculate(frame_no - 1);
					throw_no = 3;
				}
				break;

		}
		//$('#debug').text(frame_no + ' - ' + throw_no);
	}


	if (op == "X") {

		if (frame_no == 10) {

			results[frame_no][throw_no] = '10';

			switch (throw_no) {
				case 1:
					//eval("form['frame" + frame_no + "-1'].value = 'X'");
					$('#edit-frame' + frame_no + '-1').text('X');
					break;
				case 2:
					//eval("form['frame" + frame_no + "-2'].value = 'X'");
					$('#edit-frame' + frame_no + '-2').text('X');
					form['b-/'].disabled = true;
					break;
				case 3:
					//eval("form['frame" + frame_no + "-3'].value = 'X'");
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
			form['b-/'].disabled = true;
		}
		$('#debug').text(frame_no + ' - ' + throw_no);
		return;
	}

	if (op == "/") {

		if (frame_no == 10) {

			results[frame_no][throw_no] = parseInt(10 - parseInt(results[frame_no][throw_no - 1]));

			switch (throw_no) {
				case 2:
					//eval("form['frame" + frame_no + "-2'].value = '/'");
					$('#edit-frame' + frame_no + '-2').text('/');
					form['b-X'].disabled = false;
					form['b-/'].disabled = true;
					throw_no++;
					break;
				case 3:
					//eval("form['frame" + frame_no + "-3'].value = '/'");
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
			//eval("form['frame" + frame_no + "-2'].value = '/'");
			$('#edit-frame' + frame_no + '-2').text('/');

			frame_no++;
			throw_no--;
			form['b-X'].disabled = false;
			form['b-/'].disabled = true;
		}
		$('#debug').text(frame_no + ' - ' + throw_no);
		return;
	}

	if (op == "new") {
		for (var i = 1; i <= 10; i++) {
			//      eval("form['frame" + i + "-1'].value = ''");
			//      eval("form['frame" + i + "-2'].value = ''");
			$('#edit-frame' + i + '-1').text('\xa0');
			$('#edit-frame' + i + '-2').text('\xa0');

			//eval("form['frame" + i + "-res'].value = ''");
			$('#edit-frame' + i + '-res').text('\xa0');
			results.length = 0;
		}
		//eval("form['frame10-3'].value = ''");
		$('#edit-frame10-3').text('\xa0');
		//form['game_result'].value = '';
		//$('#edit-game-result').text('\xa0');
		$('#final-res').text('\xa0');
		frame_no = 1;
		throw_no = 1;
		for (var j = 0; j < 10; j++) {
			eval("form['b-" + j + "'].disabled=false");
		}
		form['b-X'].disabled = false;
		form['b-/'].disabled = true;
	}
}

function recalculate(last_frame){
	frame_no=1;
	while ( frame_no <= last_frame )
	{
		if ( results[frame_no]['status'] != null )
		{
			if ( results[frame_no]['status'] == 'no')
			{
				calculate_frame_result(parseInt(results[frame_no][1] + results[frame_no][2]));
			}
			else if ( results[frame_no]['status'] == 'X' || results[frame_no]['status'] == '/')
			{
				calculate_frame_result(parseInt(10));
			}
			
			frame_no++;	
		}
		else {
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
	for (var i = 0; i < 10; i++) {
		eval("form['b-" + i + "'].disabled = true");
	}
	form['b-/'].disabled = true;
	form['b-X'].disabled = true;

}

function injectNumXButtons(num) {
	var htmlString = '';
	for (var i = 0; i <= num; i++) {
		htmlString = htmlString + '<td class="bowling-calc-buttons-container-' + parseInt(i/6) +"> <input type="button" name="b-"
	}
	<td class="bowling-calc-buttons-container">
									<input class="calc-buttons" type="button" name="b-0" value="0" onclick="calc('0', 'ten-pin')" />
									</td>
}

function injectNumYButtons() {
	
}
