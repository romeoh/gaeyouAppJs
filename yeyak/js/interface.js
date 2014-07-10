var  server = 'http://yeyak.gaeyou.com/api/v1/'
	,platform = 'web'
	,urlParameter = {}
	,webAlarmTimeout = {}
	,_oc = {
	
	// 초기화
	'init': function(callback){
		try{
			window.openInterface.init(callback);
			platform = 'android'
		}catch(e){
			var  paramUrl = window.location.href.split('?')[1] || ''
			window[callback](paramUrl);
		}
	},
	
	// 링크
	'link': function(url, param, stack, anim) {
		var  param = param || ''
			,stack = stack || 'DEFAULT'
			,animation = animation || 'DEFAULT'
		try{
			activity = getAcitivityName(url);
			window.openInterface.link(activity, param, stack, anim);
		}catch(e){
			//alert("weblink")
			if (param != '') {
				param = '?' + param;
			}
			window.location.href = url + param;
		}
	},
	
	// 링크
	'open': function(url) {
		try{
			window.openInterface.open(url);
		}catch(e){
			window.open(url);
		}
	},
	
	// back
	'back': function() {
		try{
			window.openInterface.back();
		}catch(e){
			window.history.go(-1);
		}
	},
	
	// 나의 전화번호 읽어오기
	'getPhoneNumber': function(callback) {
		try{
			window.openInterface.getPhoneNumber(callback);
		}catch(e){
			window[callback]('', '');
		}
	},
	
	// 나의 전화번호 읽어오기
	'getContact': function(idx, callback) {
		try{
			window.openInterface.getContact(idx, callback);
		}catch(e){
			window[callback]('');
		}
	},
	
	// 푸시아이디 읽어오기
	'getRegistrationId': function(callback) {
		try{
			window.openInterface.getRegistrationId(callback);
		}catch(e){
			window[callback]('');
		}
	},
	
	// userAgent 읽어오기
	'getUserAgent': function(callback) {
		try{
			window.openInterface.getUserAgent(callback);
		}catch(e){
			window[callback](window.navigator.userAgent);
		}
	},
	
	// POST 통신
	'sendPost': function(tr, data, callback) {
		try{
			data = JSON.stringify(data)
			window.openInterface.sendPost(tr, data, callback);
		}catch(e){
			window[callback]();
		}
	},
	
	// 사진 불러오기
	'getPhoto': function(tr, callback) {
		try{
			window.openInterface.getPhoto(tr, callback);
			return true;
		}catch(e){
			return false;
		}
	},
	
	// 외부링크
	'href': function(url) {
		try{
			window.openInterface.href(url);
		}catch(e){
			window.open(url);
		}
	},
	
	// 네이티브 or web
	'isNative': function(){
		try{
			window.openInterface.isNatvie();
			return true;
		}catch(e){
			return false;
		}
	},
	
	// datepicker
	'datepicker': function(callback, initdate){
		if (!initdate) {
			initdate = moment().format('YYYY-MM-DD')
		}
		try{
			window.openInterface.datepicker(callback, initdate);
		}catch(e){
			webDatePicker(callback, initdate);
		}
	},
	
	// timepicker
	'timepicker': function(callback, initdate){
		if (!initdate) {
			initdate = moment().format('HH:mm')
		}
		try{
			window.openInterface.timepicker(callback, initdate);
		}catch(e){
			webTimePicker(callback, initdate);
		}
	},
	
	// 리스트 
	'list': function(title, items, init, callback){
		try{
			window.openInterface.list(title, items, init, callback);
		}catch(e){
			webList(title, items, init, callback);
		}
	},
	
	// toast
	'toast': function(text, delay){
		try{
			if (!delay) {
				delay = 'SHORT'
			}
			window.openInterface.toast(text, delay);
		}catch(e){
			console.log(text);
		}
	},
	
	// log
	'log': function(text){
		try{
			window.openInterface.log(text);
		}catch(e){
			console.log(text);
		}
	},
	
	// 공유하기
	'share': function(msg){
		try{
			window.openInterface.share(msg);
		}catch(e){
			console.log(msg);
		}
	},
	
	// API
	'api': {
		'kakaotalk': function(q, p){
			try{
				window.openInterface.kakaotalk(q, p);
			}catch(e){
			
			}
		},
		
		'kakaostory': function() {
			try{
				window.openInterface.kakaostory();
			}catch(e){
			
			}
		}
	},
	
	// uri
	'uri': {
		'facebook': function(id){
			try{
				window.openInterface.openFacebook('fb\:\/\/page\/'+id);
			}catch(e){
				window.open('https://www.facebook.com/'+id)
			}
		}
	},
	
	// 알람
	'alarm': {
		// 설정
		'set': function(uniq, time){
			try{
				window.openInterface.alarm(parseInt(uniq, 10), parseInt(time, 10));
			}catch(e){
				webAlarmTimeout[uniq] = setTimeout(function(){
					console.log(time + '초 후에 알람등록 시뮬레이션 완료')
					delete webAlarmTimeout[uniq];
				}, time*1000);
			}
		},
		// 취소
		'cancel': function(uniq){
			try{
				window.openInterface.alarmCancel(parseInt(uniq, 10));
			}catch(e){
				console.log(uniq + '예약취소 시뮬레이션 완료')
				clearTimeout(webAlarmTimeout[uniq]);
				delete webAlarmTimeout[uniq];
			}
		},
	},
	
	// 데이터 통신
	'sendPost': function(tr, data, callback){
		try{
			dataString = M.json(data);
			window.openInterface.sendPost(tr, dataString, callback);
		}catch(e){
			$.ajax({
				url : server + tr + '.php',
				type : "POST",
				data: data,
				success : function(result){
					window[callback](result);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown){
					console.log(XMLHttpRequest, textStatus, errorThrown)
				}
			});
		}
	},
	
	// 이미지 업로드
	'upload': function(tr, file, callback){
		try{
			window.openInterface.upload(tr, file, callback);
		}catch(e){
			var fileElement = $('#'+file).val()
			$.ajaxFileUpload({ 
				url : server + tr + '.php',
				type: "POST",
				secureuri : false, 
				fileElementId : file,
				dataType : 'json', 
				data : {
					'file': encodeURIComponent(fileElement)
				},
				complete:function(result){
					//console.log(e);
					if (!result.responseText || !M.json(result.responseText)) {
						console.log(result);
					} else {
						window[callback](M.json(result['responseText']));
					}
				}
			})
		}
	},
	
	// 앱종료
	'kill': function(tr, file, callback){
		try{
			window.openInterface.kill();
		}catch(e){
			if( confirm("창을 닫겠습니까?") ) {
				window.close();
			}
		}
	},
	
	// 진동
	'vabrator': function(time){
		try{
			window.openInterface.vabrator(time);
		}catch(e){
			console.log('vabrator: ' + time)
		}
	},
	
	// 브라우져
	'clear': {
		'cookie': function() {
			try{
				window.openInterface.clearCookie();
			}catch(e){
				//window[callback]()
			}
		}
	},
	
	// 전역변수 사용하기
	'variable': function(key, value){
		try{
			if (value) {
				window.openInterface.setVariable(key, value);
			} else {
				//window.openInterface.getVariable(key);
			}
		}catch(e){
			setParam(key, value)
		}
	}

}

function getAcitivityName(act) {
	return act.replace(/\.\.\//, '');//.replace(/\.\//, '');
}			

function onBack() {
	if ($('#modal').length == 0) {
		window.openInterface.back();
		return false;
	}
	if ($('#modal').hasClass('in')) {
		hideModal();
	} else if ($('#panel').attr('data-open') === '1') {
		hidePanel();
	} else {
		window.openInterface.back();
	}
}

function onOptionMenu() {
	if ($('#List').length > 0) {
		var isOpen = $('#panel').attr('data-open')
		
		if (isOpen == '0') {
			showPanel()
		} else {
			hidePanel()
		}
	}
}

// 상세보기에서 댓글 새로고침
function onReloadComment() {
	var str = '';
	str += '<div class="modal-dialog">';
	str += '	<div class="modal-content">';
	str += '		<div class="modal-body" id="modalContent">';
	str += '			<p>새로운 댓글이 있습니다.</p>';
	str += '			<button id="btnReload" class="btn btn-default">댓글 새로고침</button>';
	str += '		</div>';
	str += '	</div>';
	str += '</div>';
	$('#toast').html(str).css('display', 'block').removeClass('top-style');
	$('#btnReload').on('click', function(){
		replyStart = 0;
		$('#replayBox').html('');
		getReplyList(2);
	})
	
	$('body').on('click', removeToast)
	$(document).on('scroll', removeToast);
}

function onNewComment() {
	var str = '';
	str += '<div class="modal-dialog">';
	str += '	<div class="modal-content">';
	str += '		<div class="modal-body" id="modalContent">';
	str += '			<p>새로운 댓글이 등록되었습니다.</p>';
	str += '			<button id="btnRecent" class="btn btn-default">최근알림으로 이동</button>';
	str += '		</div>';
	str += '	</div>';
	str += '</div>';
	$('#toast').html(str).css('display', 'block').addClass('top-style');
	$('#btnRecent').on('click', function(){
		_oc.link('../timeline/recent.html');
	})
	
	$('body').on('click', removeToast)
	$(document).on('scroll', removeToast);
}

function removeToast() {
	$(document).off('scroll');
	$('body').off('click');
	$('#toast')
		.html('')
		.css('display', 'none')
		.removeClass('top-style');
}


$(window).ready(function(){
	if (platform == 'web') {
		_oc.init("onInitPage");
	}
})

function onInitPage(param) {
	initDefault(param);
	if (param) {
		p = param.split('&');
		for (var i in p) {
			urlParameter[p[i].split('=')[0]] = p[i].split('=')[1];
		}
	}
	window['onReady']();
}



// web용 데이터피커
function webDatePicker(callback, initdate) {
	var str = ''
	
	str += '<div class="modal-dialog">';
	str += '	<div class="modal-content">';
	str += '		<div class="modal-header">';
	str += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
	str += '			<h4 class="modal-title" id="modalLabel">날짜를 선택하세요.</h4>';
	str += '		</div>';
	str += '		<div class="modal-body" id="modalContent">';
	str += '<div class="cal-nav">';
	str += '	<input type="date" class="form-control" id="thisDate">';
	str += '</div>';
	str += '</div>';
	str += '		<div class="modal-footer">';
	str += '			<button type="button" class="btn btn-default" id="btnCloseModal">닫기</button>';
	str += '			<button type="button" class="btn btn-primary" id="btnModalSelect">선택</button>';
	str += '		</div>';
	str += '	</div>';
	str += '</div>';
	
	$('#modal').html(str);
	$('#modal').modal('show');
	
	if (initdate) {
		$('#thisDate').val(initdate)
	} else {
		var today = moment().format('YYYY-MM-DD')
		$('#thisDate').val(today)
	}
	
	$('#btnModalSelect').on('click', function(){
		var  selDate = $('#thisDate').val()
			,y = moment(selDate, 'YYYY-MM-DD').format('YYYY')
			,m = moment(selDate, 'YYYY-MM-DD').format('M')
			,d = moment(selDate, 'YYYY-MM-DD').format('D')
		window[callback](y, m, d);
		hideModal()
	})
	$('#btnCloseModal').on('click', function(){
		hideModal()
	})
}

// web용 타임피커
function webTimePicker(callback, initdate) {
	var str = ''
	
	str += '<div class="modal-dialog">';
	str += '	<div class="modal-content">';
	str += '		<div class="modal-header">';
	str += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
	str += '			<h4 class="modal-title" id="modalLabel">시간을 선택하세요.</h4>';
	str += '		</div>';
	str += '		<div class="modal-body" id="modalContent">';
	str += '<div class="cal-nav">';
	str += '	<input type="time" class="form-control" id="thisTime">';
	str += '</div>';
	str += '</div>';
	str += '		<div class="modal-footer">';
	str += '			<button type="button" class="btn btn-default" id="btnCloseModal">닫기</button>';
	str += '			<button type="button" class="btn btn-primary" id="btnModalSelect">선택</button>';
	str += '		</div>';
	str += '	</div>';
	str += '</div>';
	
	$('#modal').html(str);
	$('#modal').modal('show');
	
	if (initdate) {
		$('#thisTime').val(initdate)
	} else {
		var today = moment().format('HH:mm')
		console.log(today)
		$('#thisTime').val(today)
	}
	
	$('#btnModalSelect').on('click', function(){
		var  selTime = $('#thisTime').val()
			,h = moment(selTime, 'HH:mm').format('H')
			,m = moment(selTime, 'HH:mm').format('m')
		window[callback](h, m);
		hideModal()
	})
	$('#btnCloseModal').on('click', function(){
		hideModal()
	})
}


// 웹리스트
function webList(title, items, init, callback) {
	var str = ''
		,itemList = items.split(',')
	str += '<div class="modal-dialog">';
	str += '	<div class="modal-content">';
	if (title) {
		str += '		<div class="modal-header">';
		str += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		str += '			<h4 class="modal-title" id="modalLabel">' + title + '</h4>';
		str += '		</div>';
		str += '		<div class="modal-body" id="modalContent">';
	}
	str += '<ul class="modal-body">';
	for (var i in itemList) {
		if (init == i) {
			className = ' class="sel"';
		} else {
			className = '';
		}
		str += '	<li data-sel="' + i + '"' + className + '>' + itemList[i] + '</li>';
	}
	str += '</ul>';
	//str += '</div>';
	//str += '		<div class="modal-footer">';
	//str += '			<button type="button" class="btn btn-default" id="btnCloseModal">닫기</button>';
	//str += '			<button type="button" class="btn btn-primary" id="btnModalSelect">선택</button>';
	//str += '		</div>';
	//str += '	</div>';
	str += '</div>';
	
	$('#modal').html(str);
	$('#modal').modal('show');
	
	$('#btnModalSelect').on('click', function(){
		var  selDate = $('#thisDate').val()
			,y = moment(selDate, 'YYYY-MM-DD').format('YYYY')
			,m = moment(selDate, 'YYYY-MM-DD').format('M')
			,d = moment(selDate, 'YYYY-MM-DD').format('D')
		window[callback](y, m, d);
		hideModal()
	})
	$('#btnCloseModal').on('click', function(){
		hideModal()
	})
	$('[data-sel]').on('click', function(){
		var idx = $(this).attr('data-sel')
		window[callback](idx);
		hideModal();
	})
}

function hideModal() {
	$('#modalContent').html('');
	$('#modalLabel').html('');
	$('#modal').modal('hide');
}


































