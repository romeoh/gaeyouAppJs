
function drawPie(data, flag) {
	var  d = parsePieData(data)
		,canvas = document.getElementById("pie")
		,context = canvas.getContext("2d")
		,sw = 300
		,sh = 300
		,centerX = sw/2
		,centerY = sh/2
		,now = getNow()
	
	for (var i in d) {
		var   startArc = (d[i]['start']-90) * Math.PI / 180
			,endArc = (d[i]['end']-90) * Math.PI / 180
			,ranR = process(0, 255)
			,ranG = process(0, 255)
			,ranB = process(0, 255)

		context.strokeStyle = "rgba(153, 153, 153, 0.2)";
		context.fillStyle = 'rgba(' + ranR + ', ' + ranG + ', ' + ranB + ', 0.2)';
		context.beginPath();
		context.moveTo(centerX, centerY);
		context.arc(sw/2, sh/2, 120, endArc, startArc, true);
		context.lineTo(centerX, centerY);
		context.closePath();
		context.stroke();
		context.fill(); 
		
		context.onclick = function(){
			console.log('aaaa')
		}
	}
	
	// 시간
	if (data[0] && moment(moment(data[0]['dtstart'], 'YYYYMMDD').format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))) {
		context.strokeStyle = "rgba(165,42,42, 0.5)";
		context.translate(centerX, centerY);
		context.rotate((now-90) * Math.PI / 180);
		context.beginPath();
		context.lineTo(0, 0);
		context.lineTo(100, 0);
		context.closePath();
		context.lineWidth = 2;
		context.stroke();
	}
}

function clearCanvas() {
	//context.clearRect(0, 0, 600, 600);
	$('.dairy').html('<canvas id="pie" class="pie" width="300" height="300"></canvas>')
}

function parsePieData(data) {
	var arr = []
	for (var i in data) {
		var   degreeHour = 15
			,sh = moment(data[i]['dtstart'], 'YYYYMMDDTHHmmSS').format('HH') * degreeHour
			,sm = degreeHour * (moment(data[i]['dtstart'], 'YYYYMMDDTHHmmSS').format('mm') / 60)
			,eh = moment(data[i]['dtend'], 'YYYYMMDDTHHmmSS').format('HH') * degreeHour
			,em = degreeHour * (moment(data[i]['dtend'], 'YYYYMMDDTHHmmSS').format('mm') / 60)
			,description = decode(data[i]['description'])
			,startTime = parseInt(sh, 10) + parseInt(sm, 10)
			,endTime = parseInt(eh, 10) + parseInt(em, 10)
			
		if (data[i]['dtstart'] != data[i]['dtend']) {
			arr.push({
				'start': startTime, 
				'end': endTime,
				'title': description
			})
		}
	}
	return arr;
}

function getNow() {
	var   degreeHour = 15
		,sh = moment().format('HH') * degreeHour
		,sm = degreeHour * (moment().format('mm') / 60)
		,startTime = parseInt(sh, 10) + parseInt(sm, 10)
	return startTime;
}







