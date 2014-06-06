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
var results = [];//new Array();

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
  
  if ( throw_no == 1 ) {
    results[frame_no] = [];
  } else if (throw_no == 2) {
    for( var j=0; j < 10; j++) {
      eval("form['b-" + j + "'].disabled=false");
    }
    form['b-/'].disabled = false;
  }
  
  if (op == "1" || op == "2" || op == "3" || op == "4" || op == "5" ||
      op == "6" || op == "7" || op == "8" || op == "9" || op == "0") {
	
	results[frame_no][throw_no] = parseInt(op);
	
	if ( throw_no == 1 ) { 
	    //eval("form['frame" + frame_no + "-1'].value = " + op);
	    $('#edit-frame' + frame_no + '-1').text(op);
	    throw_no++;
	    form['b-X'].disabled=true;
	    form['b-/'].disabled=false;
	    for(var k=parseInt(10-op); k < 10; k++) {
	      eval("form['b-" + k + "'].disabled=true");
	    }
	  } else if (throw_no == 2) {
	    
	    results[frame_no]['status'] = 'no';
	    
	    	    
      	    //eval("form['frame" + frame_no + "-2'].value = " + op);
	    	 $('#edit-frame' + frame_no + '-2').text(op);
	    
	    if (calcType == "duckpin"	) {
		//eval("alert('heitto2='" + throw_no + ", 'frame='" + frame_no + ")");
		//alert("kaks");
		
		form['b-X'].disabled=true;
	        form['b-/'].disabled=false;
		
		var score = parseInt(results[frame_no][throw_no-1]) + parseInt(op);
		if (frame_no == 10 && parseInt(results[frame_no][throw_no-1]) == 10) {
		  score = parseInt(op);
		}
		
		//alert(score);
		for(var k=parseInt(10-score)+1; k < 10; k++) {
		  eval("form['b-" + k + "'].disabled=true");
		  form['b-X'].disabled=true;
		  form['b-/'].disabled=true;
		}
		throw_no = 3;
		//alert(throw_no);
	    } else if ( frame_no != 10) {
		//alert("normal");
		calculate_frame_result(parseInt(results[frame_no][throw_no] + results[frame_no][throw_no-1]));
		throw_no--;
		frame_no++;
		form['b-/'].disabled=true;
		form['b-X'].disabled=false;
	    } else {
	      if (results[frame_no]['1'] != 10) {
		calculate_frame_result(parseInt(parseInt(results[frame_no][throw_no]) + parseInt(results[frame_no][throw_no-1])));
		end_game();
	      } else {
		throw_no++;
	      }
	    }
	  } else {
	    //kolmas heitto
	    //eval("form['frame" + frame_no + "-3'].value = " + op);
	    $('#edit-frame' + frame_no + '-3').text(op);
	    //alert("kolme");
	    //alert(throw_no);
	    //eval("alert('heitto3='" + throw_no + ", 'frame='" + frame_no + ")");

	    calculate_frame_result(parseInt(parseInt(results[frame_no][throw_no]) + parseInt(results[frame_no][throw_no-1]) + parseInt(results[frame_no][throw_no-2])));
	    if (frame_no == 10) {
	      end_game();
	    } else {
	      throw_no = 1;
	      frame_no++;
	      for(var k=1; k < 10; k++) {
		  eval("form['b-" + k + "'].disabled=false");
		  form['b-X'].disabled=false;
		  form['b-/'].disabled=true;
	      }
	    }
	  }
   // alert("loppu");
   // alert(throw_no);
    return;
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
	  form['b-/'].disabled=true;
	  break;
	case 3:
          //eval("form['frame" + frame_no + "-3'].value = 'X'");
          $('#edit-frame' + frame_no + '-3').text('X');
	  calculate_frame_result(parseInt(parseInt(results[frame_no]['1'])+parseInt(results[frame_no]['2'])+parseInt(results[frame_no]['3'])));
	  end_game();
	  break;
      }
      throw_no++;
    } else {
      results[frame_no]['status'] = 'X';
      results[frame_no][throw_no] = '10';
      results[frame_no][throw_no+1] = '';
      calculate_frame_result(parseInt(10));
      //eval("form['frame" + frame_no + "-1'].value = ''");
      //eval("form['frame" + frame_no + "-2'].value = 'X'");
      $('#edit-frame' + frame_no + '-1').text('');
      $('#edit-frame' + frame_no + '-2').text('X');
  
      frame_no++;
      form['b-/'].disabled=true;
    }	
	
    return;
  }
  
  if (op == "/") {
	
    if (frame_no == 10) {
    
      results[frame_no][throw_no] = parseInt(10 - parseInt(results[frame_no][throw_no-1]));
    
      switch (throw_no) {
	case 2:
          //eval("form['frame" + frame_no + "-2'].value = '/'");
          $('#edit-frame' + frame_no + '-2').text('/');
	  form['b-X'].disabled=false;
	  form['b-/'].disabled=true;
	  throw_no++;
	  break;
	case 3:
          //eval("form['frame" + frame_no + "-3'].value = '/'");
          $('#edit-frame' + frame_no + '-3').text('/');
	  calculate_frame_result(parseInt(parseInt(results[frame_no]['1']) +
					  parseInt(results[frame_no]['2']) +
					  parseInt(results[frame_no]['3'])));
	  end_game();
	  break;
      }
    } else {
	results[frame_no]['status'] = '/';
	results[frame_no][throw_no] = parseInt(10 - results[frame_no][throw_no-1]);
	calculate_frame_result(parseInt(10));
	//eval("form['frame" + frame_no + "-2'].value = '/'");
	$('#edit-frame' + frame_no + '-2').text('/');
	
	frame_no++;
	throw_no--;
	form['b-X'].disabled=false;
	form['b-/'].disabled=true;
    }
	
    return;
  }
  
  if (op == "new") {
    for (var i=1; i <= 10; i++) {
//      eval("form['frame" + i + "-1'].value = ''");
//      eval("form['frame" + i + "-2'].value = ''");
		$('#edit-frame' + i + '-1').text('\xa0');
		$('#edit-frame' + i + '-2').text('\xa0');
      if (calcType == "duckpin") {
        eval("form['frame" + i + "-3'].value = '\xa0'");
      }
      //eval("form['frame" + i + "-res'].value = ''");
      $('#edit-frame' + i + '-res').text('\xa0');
      results.length = 0;
    }
      //eval("form['frame10-3'].value = ''");
      $('#edit-frame10-3').text('\xa0');
      //form['game_result'].value = '';
      $('#edit-game-result').text('\xa0');
      frame_no = 1;
      throw_no = 1;
      for( var j=0; j < 10; j++) {
	eval("form['b-" + j + "'].disabled=false");
      }
      form['b-X'].disabled = false;
      form['b-/'].disabled = true;
      
      
  }
}

function calculate_frame_result(frame_res) {

  switch (frame_no) {
    case 1:
      results[frame_no]['result'] = frame_res;
      break;
    case 2:
      if ( results[frame_no-1]['status'] == 'X' ) {
	results[frame_no-1]['result'] = parseInt(results[frame_no-1]['result']) + frame_res;
      } else if (results[frame_no-1]['status'] == '/') {
	results[frame_no-1]['result'] = parseInt(results[frame_no-1]['result']) + parseInt(results[frame_no]['1']);
      }
      results[frame_no]['result'] = parseInt(results[frame_no-1]['result'] + frame_res);
      break;
    default:
      if ( results[frame_no-1]['status'] == 'X' ) {
	if ( results[frame_no-2]['status'] == 'X' ) {
	  results[frame_no-2]['result'] = parseInt(results[frame_no-2]['result']) + parseInt(results[frame_no]['1']);
	  results[frame_no-1]['result'] = parseInt(results[frame_no-1]['result']) + parseInt(results[frame_no]['1']);
	} 
	results[frame_no-1]['result'] = parseInt(results[frame_no-1]['result']) +
					parseInt(results[frame_no]['1']) +
					(results[frame_no]['2'] == '' ? parseInt(0) : parseInt(results[frame_no]['2']));
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
      $('#edit-frame' + parseInt(frame_no-1) + '-res').text(results[frame_no-1]['result']);
      $('#edit-frame' + frame_no + '-res').text(results[frame_no]['result']);
      break;
    default:
      //eval("form['frame" + parseInt(frame_no-2) + "-res'].value = " + results[frame_no-2]['result']);
      //eval("form['frame" + parseInt(frame_no-1) + "-res'].value = " + results[frame_no-1]['result']);
      //eval("form['frame" + frame_no + "-res'].value = " + results[frame_no]['result']);
      $('#edit-frame' + parseInt(frame_no-2) + '-res').text(results[frame_no-2]['result']);
      $('#edit-frame' + parseInt(frame_no-1) + '-res').text(results[frame_no-1]['result']);
      $('#edit-frame' + frame_no + '-res').text(results[frame_no]['result']);
      break;
  }
  //eval("form['game_result'].value = " + results[frame_no]['result']);
  $('#edit-game-result').text(results[frame_no]['result']);
  return;
}

function end_game() {
  for(var i=0; i<10; i++) {
    eval("form['b-" + i + "'].disabled = true");
  }
  form['b-/'].disabled = true;
  form['b-X'].disabled = true;

}
