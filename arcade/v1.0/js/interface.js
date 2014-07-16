var  server = 'http://arcade.gaeyou.com/api/v1/'
	,platform = ''
	,urlParameter = {}
	,webAlarmTimeout = {}
	,_oc = {
	
	// 초기화
	'init': function(callback){
		try{
			window.openInterface.init(callback);
			platform = 'android'
		} catch(e) {
			var  paramUrl = window.location.href.split('?')[1] || ''
			window[callback](paramUrl);
			platform = 'web'
		}
	},
	
	// 링크
	'link': function(url, param, stack, orientation) {
		var  param = param || ''
			,stack = stack || 'DEFAULT'
			,orientation = orientation || 'DEFAULT'
		if (platform == 'android') {
			activity = getAcitivityName(url);
			window.openInterface.link(activity, param, stack, orientation);
		} else {
			//alert("weblink")
			if (param != '') {
				param = '?' + param;
			}
			window.location.href = url + param;
		}
	},
	
	// 링크
	'game': function(url, param, stack, orientation) {
		var  param = param || ''
			,stack = stack || 'DEFAULT'
			,orientation = orientation || 'DEFAULT'
		if (platform == 'android') {
			activity = getAcitivityName(url);
			window.openInterface.game(url, param, stack, orientation);
		} else {
			//alert("weblink")
			if (param != '') {
				param = '?' + param;
			}
			window.location.href = url + param;
		}
	},
	
	// 링크
	'open': function(url) {
		if (platform == 'android') {
			window.openInterface.open(url);
		} else {
			window.open(url);
		}
	},
	
	// back
	'back': function() {
		if (platform == 'android') {
			window.openInterface.back();
		} else {
			window.history.go(-1);
		}
	},
	
	// 나의 전화번호 읽어오기
	'getPhoneNumber': function(callback) {
		if (platform == 'android') {
			window.openInterface.getPhoneNumber(callback);
		} else {
			window[callback]('', '');
		}
	},
	
	// 나의 전화번호 읽어오기
	'getContact': function(idx, callback) {
		if (platform == 'android') {
			window.openInterface.getContact(idx, callback);
		} else {
			window[callback]('');
		}
	},
	
	// 푸시아이디 읽어오기
	'getRegistrationId': function(callback) {
		if (platform == 'android') {
			window.openInterface.getRegistrationId(callback);
		} else {
			window[callback]('');
		}
	},
	
	// userAgent 읽어오기
	'getUserAgent': function(callback) {
		if (platform == 'android') {
			window.openInterface.getUserAgent(callback);
		} else {
			window[callback](window.navigator.userAgent);
		}
	},
		
	// 사진 불러오기
	'getPhoto': function(tr, callback) {
		if (platform == 'android') {
			window.openInterface.getPhoto(tr, callback);
			return true;
		} else {
			return false;
		}
	},
	
	// 외부링크
	'href': function(url) {
		if (platform == 'android') {
			window.openInterface.href(url);
		} else {
			window.open(url);
		}
	},
	
	// 네이티브 or web
	'isNative': function(){
		if (platform == 'android') {
			window.openInterface.isNatvie();
			return true;
		} else {
			return false;
		}
	},
	
	// datepicker
	'datepicker': function(callback, initdate){
		if (!initdate) {
			initdate = moment().format('YYYY-MM-DD')
		}
		if (platform == 'android') {
			window.openInterface.datepicker(callback, initdate);
		} else {
			webDatePicker(callback, initdate);
		}
	},
	
	// timepicker
	'timepicker': function(callback, initdate){
		if (!initdate) {
			initdate = moment().format('HH:mm')
		}
		if (platform == 'android') {
			window.openInterface.timepicker(callback, initdate);
		} else {
			webTimePicker(callback, initdate);
		}
	},
	
	// 리스트 
	'list': function(title, items, init, callback){
		if (platform == 'android') {
			window.openInterface.list(title.toString(), items.toString(), init.toString(), callback.toString());
		} else {
			webList(title, items, init, callback);
		}
	},
	
	// toast
	'toast': function(text, delay){
		if (platform == 'android') {
			if (!delay) {
				delay = 'SHORT'
			}
			window.openInterface.toast(text, delay);
		} else {
			console.log(text);
		}
	},
	
	// log
	'log': function(text){
		if (platform == 'android') {
			window.openInterface.log(text);
		} else {
			console.log(text);
		}
	},
	
	// 공유하기
	'share': function(msg){
		if (platform == 'android') {
			window.openInterface.share(msg);
		} else {
			console.log(msg);
		}
	},
	
	// API
	'api': {
		'kakaotalk': function(q, p){
			if (platform == 'android') {
				window.openInterface.kakaotalk(q, p);
			} else {
			
			}
		},
		
		'kakaostory': function() {
			if (platform == 'android') {
				window.openInterface.kakaostory();
			} else {
			
			}
		}
	},
	
	// uri
	'uri': {
		'facebook': function(id){
			if (platform == 'android') {
				window.openInterface.openFacebook('fb\:\/\/page\/'+id);
			} else {
				window.open('https://www.facebook.com/'+id)
			}
		}
	},
	
	// 알람
	'alarm': {
		// 설정
		'set': function(uniq, time){
			if (platform == 'android') {
				var userIdx = getSetting('user_idx')
				window.openInterface.alarm(userIdx, parseInt(uniq, 10), parseInt(time, 10));
			} else {
				webAlarmTimeout[uniq] = setTimeout(function(){
					console.log(time + '초 후에 알람등록 시뮬레이션 완료')
					delete webAlarmTimeout[uniq];
				}, time*1000);
			}
		},
		// 취소
		'cancel': function(uniq){
			if (platform == 'android') {
				window.openInterface.alarmCancel(parseInt(uniq, 10));
			} else {
				console.log(uniq + '예약취소 시뮬레이션 완료')
				clearTimeout(webAlarmTimeout[uniq]);
				delete webAlarmTimeout[uniq];
			}
		},
	},
	
	// 데이터 통신
	'sendPost': function(tr, data, callback){
		if (platform == 'android') {
			dataString = M.json(data);
			window.openInterface.sendPost(tr, dataString, callback);
		} else {
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
		if (platform == 'android') {
			window.openInterface.upload(tr, file, callback);
		} else {
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
		if (platform == 'android') {
			window.openInterface.kill();
		} else {
			if( confirm("창을 닫겠습니까?") ) {
				window.close();
			}
		}
	},
	
	// 진동
	'vabrator': function(time){
		if (platform == 'android') {
			window.openInterface.vabrator(time);
		} else {
			console.log('vabrator: ' + time)
		}
	},
	
	// 브라우져
	'clear': {
		'cookie': function() {
			if (platform == 'android') {
				window.openInterface.clearCookie();
			} else {
				//window[callback]()
			}
		}
	},
	
	// 전역변수 사용하기
	'variable': function(key, value){
		if (platform == 'android') {
			if (value) {
				window.openInterface.setVariable(key, value);
			} else {
				//window.openInterface.getVariable(key);
			}
		} else {
			setParam(key, value)
		}
	}

}


$(window).ready(function(){
	_oc.init("onInitPage");
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


































