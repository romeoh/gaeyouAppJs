var platform = 'web'
	,urlParameter = {}
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
			//,stack = stack || 'DEFAULT'
			//,animation = animation || 'DEFAULT'
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
	}
}

function getAcitivityName(act) {
	act = act.replace(/\.\.\//, '').replace(/\.\//, '');
	return act
		.replace(/(\/[a-z])/g, function(arg){
			return arg.toUpperCase().replace('/','');
		})
		.replace(/(\_[a-z])/g, function(arg){
			return arg.toUpperCase().replace('_','');
		})
		.replace('.html', '')
		.replace(/\b([a-z])/g, function($1){
			return $1.toUpperCase();
		 })
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
	if ($('#dList').length > 0) {
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
	_oc.init("onInitPage");
})

function onInitPage(param) {
	initDefault();
	if (param) {
		p = param.split('&');
		for (var i in p) {
			urlParameter[p[i].split('=')[0]] = p[i].split('=')[1];
		}
	}
	window['onReady'](urlParameter);
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

function hideModal() {
	$('#modalContent').html('');
	$('#modalLabel').html('');
	$('#modal').modal('hide');
}








