var  settingId = 'ztalk_setting'

function initDefault() {
	if (M.storage(settingId) == null) {
		M.storage(settingId, '{}');
	}
	$('#btnBack').on('click', function(){
		//window.history.go(-1)
		_oc.back()
	}).on('touchstart', function(){})
	
	// 타이틀 누르면 최상위
	$('.header .tc').on('click', function(){
		if (window.scrollY == '0') {
			var bodyBottom = parseInt($('body').css('height'), 10) * -1
			$('body').ScrollTo({duration:700, offsetTop:bodyBottom});
		} else {
			$('body').ScrollTo({duration:700});
		}
	})
	
	// 네비게이션
	// 경기일정
	$('#navSchedule').on('click', function(){
		//window.location.href = '../timeline/index.html';
		_oc.link('../schedule/league.html', '', 'CLEAR_TOP', 'DEFAULT');
	})
	// 참가국
	$('#navNation').on('click', function(){
		_oc.link('../nation', '', 'CLEAR_TOP', 'DEFAULT');
	})
	// 역대전적
	$('#navHistory').on('click', function(){
		_oc.link('../history', '', 'CLEAR_TOP', 'SLIDE_LEFT');
	})
	// 설정
	$('#navSetting').on('click', function(){
		//window.location.href = '../setting/index.html';
		_oc.link('../setting', '', 'CLEAR_TOP', 'DEFAULT');
	})
}

/*
function request(tr, data, callback) {
	$.ajax({
		url : server + tr + '.php',
		dataType : "jsonp",
		data: data,
		jsonp: 'callback',
		success : function(data){
			callback(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){
			console.log(XMLHttpRequest, textStatus, errorThrown)
		}
	});
}
*/

/*
// 깨유서버에 이미지 올리기
function upload(tr, file, callback) {
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
		complete:function(e){
			//console.log(e);
			if (!e.responseText || !M.json(e.responseText)) {
				console.log(e);
			} else {
				callback(e);
			}
		}
	})
}
*/

// 예약 올리기
function sendReservation(tr, data, callback) {
	$.ajax({
		'url' : server + tr + '.php',
		'contentType': 'application/x-www-form-urlencoded',
		'type': "POST",
		'data': data,
		'success': function(result){
			callback(result);
		},
		'error':function(e, a, b) {
			console.log(e, a, b)
		}
	})
}


function getRss(url, callback) {
	$.ajax({
		//type: 'GET',
		url: server + 'rss.php',
		dataType : "jsonp",
		data: {'url': url},
		jsonp: 'callback',
		success:function(data) {
			callback(data);
		},
		error:function(e) {
			var data = {'result': 'error'}
			callback(data);
		}
	});
}

// 텍스트 인코딩
function decode(txt) {
	return decodeURIComponent(txt);
}
function encode(txt) {
	return encodeURIComponent(txt);
}

// 세팅저장
function getSetting(key) {
	var setting = M.json(M.storage(settingId));
	if (setting[key] == undefined) {
		return '';
	} else {
		return setting[key];
	}
}
function setSetting(key, value) {
	var setting = M.json(M.storage(settingId));
	setting[key] = value;
	M.storage(settingId, M.json(setting));
}
function delSetting(key) {
	var setting = M.json(M.storage(settingId));
	delete setting[key];
	M.storage(settingId, M.json(setting));
}

function removeByIndex(arrayName,arrayIndex){ 
	arrayName.splice(arrayIndex,1); 
}

// 프로세스
function process(_min, _max){
	var data, min, max

	if ( getDataType(_min) === 'object' || getDataType(_min) === 'array' ) {
		data = _min;
		return Math.floor(Math.random() * data.length);
	} else {
		min = _min;
		max = _max;
		return Math.floor(Math.random() * (max-min) + min)
	}
}

function getDataType(_value) {
	if (typeof _value === 'string') {
		return 'string';
	}
	if (typeof _value === 'number') {
		return 'number';
	}
	if (_value.constructor === Object) {
		return 'object';
	}
	if (_value.constructor === Array) {
		return 'array';
	}
	if (_value.constructor === Function) {
		return 'function';
	}
	if (_value.constructor === Boolean) {
		return 'boolean';
	}
	return undefined;
}

// 전달된 파라미터를 파싱한다.
function getParam(key, value) {
	if (!key) {
		return urlParameter;
	} else if (!value) {
		return urlParameter[key];
	} else {
		urlParameter[key] = value;
	}
}

// 일정을 날짜순으로 재배열한다.
function arrageSchedule(sch, flag) {
	var  newSch = []
		,newSchMember = []
		,tumpDate

	sch = sch.sort(comp);
	if (flag) {
		sch = addToday(sch);
	}
	for (var i in sch) {
		var thisDate = parseTime(7, sch[i]['date'])
		if (tumpDate == '' || tumpDate != thisDate) {
			// 새 날짜
			tumpDate = thisDate;
			if (newSchMember.length > 0) {
				newSch.push(newSchMember);
			}
			newSchMember = []
			newSchMember.push(sch[i])
		} else {
			// 기존 날짜
			newSchMember.push(sch[i])
		}
	}
	if (newSchMember.length > 0) {
		newSch.push(newSchMember);
	}
	return newSch;
}
// 오늘 날짜 공백처리
function addToday(sch) {
	var  tday = parseTime(0)
		,todayMark = false
		,returnSch = []
		
	for (var i in sch) {
		var chday = parseTime(0, sch[i]['dtstart'])
		if (todayMark != undefined) {
			todayMark = moment(tday).isBefore(chday)
		}
		if (moment(tday).isSame(chday)){
			todayMark = undefined;
		}
		if (todayMark) {
			returnSch.push({'dtstart': parseTime(7)})
			todayMark = undefined;
		}
		returnSch.push(sch[i]);
	}
	if (todayMark === false) {
		returnSch.push({'dtstart': parseTime(7)})
	}
	return returnSch;
}

// 날짜 정렬
function comp(a, b) {
	var  at = moment(a.date, 'YYYYMMDDTHHmm').format('YYYY-MM-DD HH:mm')
		,bt = moment(b.date, 'YYYYMMDDTHHmm').format('YYYY-MM-DD HH:mm')
	return new Date(at).getTime() - new Date(bt).getTime();
}
// 친구 가나다순 정렬
function compStringReverse(a, b) {
	if (a.friend_nickname > b.friend_nickname) return 1;
	if (b.friend_nickname > a.friend_nickname) return -1;
	return 0;
}

// 페이지 id
function getPageId(id) {
	var page = window.location.href;
	if (page.split('/')[page.split('/').length-1] == '') {
		page += 'index.html';
	}
	if (!id) {
		return page.split('/')[page.split('/').length-1].split('.')[0];
	}
	if (page.indexOf(id) != '-1') {
		return true;
	}
	return false;
}

function hideModal() {
	$('#modalContent').html('');
	$('#modalLabel').html('');
	$('#modal').modal('hide');
}

function parseTime(option, d) {
	var dt = d;	//moment(d, 'YYYYMMDDTHHmmSS')
	switch (option) {
		case 0:
			// 2014-04-17
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').format('YYYY-MM-DD');
			}
			return moment().format('YYYY-MM-DD');
		break;
		case 1:
			// 2014년 4월 17일(목)
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').lang('ko').format('YYYY년 M월 DD일(dd)');
			}
			return moment().lang('ko').format('YYYY년 M월 DD일(dd)');
		break;
		case 2:
			// 4월 17일
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').lang('ko').format('M월 DD일');
			}
			return moment().lang('ko').format('M월 DD일');
		break;
		case 3:
			// 4월 17일 (목)
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').lang('ko').format('M월 DD일 (dd)');
			}
			return moment().lang('ko').format('M월 DD일 (dd)');
		break;
		case 31:
			// 4월 7일 (목)
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').lang('ko').format('M월 D일 (dd)');
			}
			return moment().lang('ko').format('M월 D일 (dd)');
		break;
		case 4:
			// 2014
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').format('YYYY');
			}
			return moment().format('YYYY');
		break;
		case 5:
			// 04
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').format('MM');
			}
			return moment().format('MM');
		break;
		case 51:
			// 4
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').format('M');
			}
			return moment().format('M');
		break;
		case 6:
			// 17일
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').format('DD');
			}
			return moment().format('DD');
		break;
		case 7:
			// 20140417
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').format('YYYYMMDD');
			}
			return moment().format('YYYYMMDD');
		break;
		case 71:
			// 201404
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').format('YYYYMM');
			}
			return moment().format('YYYYMM');
		break;
		case 8:
			// 2014년 4월 17일
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').format('YYYY년 M월 DD일');
			}
			return moment().format('YYYY년 M월 DD일');
		break;
		case 9:
			// 4/17
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').format('M/D');
			}
			return moment().format('M/D');
		break;
		
		
		case 10:
			// 17:01
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').format('HH:mm');
			}
			return moment().format('HH:mm');
		break;
		case 11:
			// 오후 5:01
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').lang('ko').format('A h:mm');
			}
			return moment().lang('ko').format('A h:mm');
		break;
		case 12:
			// 5
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').format('H');
			}
			return moment().format('H');
		break;
		case 121:
			// 17
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').format('h');
			}
			return moment().format('h');
		break;
		case 13:
			// 01
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').format('mm');
			}
			return moment().format('mm');
		break;
		case 14:
			// 오전
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').lang('ko').format('A');
			}
			return moment().lang('ko').format('A');
		break;
		
		case 100:
			// 4월 17일 오후 5시
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').lang('ko').format('M월 D일 A hh시');
			}
			return moment().lang('ko').format('M월 D일 A hh시');
		break;
		case 101:
			// 4월 17일 오후 5시 01분
			if (d) {
				return moment(dt, 'YYYYMMDDTHHmmSS').lang('ko').format('M월 D일 A hh시 mm분');
			}
			return moment().lang('ko').format('M월 D일 A hh시 mm분');
		break;
	}
}



function fromNow(dt) {
	var  fnow = moment(dt, 'YYYY-MM-DD HH:mm:SS').format('YYYY년 M월 D일')
		,diffYear = Math.abs( moment(dt, 'YYYY-MM-DD HH:mm:SS').diff(moment(), 'Year') )
		,diffDay = Math.abs( moment(dt, 'YYYY-MM-DD HH:mm:SS').diff(moment(), 'Days') )
		,diffHour = Math.abs( moment(dt, 'YYYY-MM-DD HH:mm:SS').diff(moment(), 'Hours') )
	
	if (diffYear > 0) {
		return fnow;
	}
	if (diffDay > 0) {
		return moment(dt, 'YYYY-MM-DD HH:mm:SS').lang('ko').format('M월 D일 A h시 mm분');
	}
	if (diffHour > 0) {
		return moment(dt, 'YYYY-MM-DD HH:mm:SS').lang('ko').format('A h시 mm분');
	}
	return moment(dt, 'YYYY-MM-DD HH:mm:SS').lang('ko').from();
}


// 랜덤 추출
function process(_min, _max){
	var data, min, max

	if ( getDataType(_min) === 'object' || getDataType(_min) === 'array' ) {
		data = _min;
		return Math.floor(Math.random() * data.length);
	} else {
		min = _min;
		max = _max;
		return Math.floor(Math.random() * (max-min) + min)
	}
}

// 태그제거
function removeTag(str) {
	return str.replace(/\<div\>/gi, '\n').replace(/\<\/div\>/gi, '').replace(/\&nbsp\;/gi, ' ').replace(/\<br\>/gi, '\n');
}
function removeTagAll(input, allowed) {
	allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
	var  tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
		,commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi
		,nbspTags = /\&nbsp\;/gi
		,imgTag
		,resultImg = input.replace(tags, function ($0, $1) {
				imgTag = allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
			})
		,resultTxt = input.replace(commentsAndPhpTags, '')
						.replace(/\<div\>/gi, '\n').replace(/\<\/div\>/gi, '').replace(/\&nbsp\;/gi, ' ').replace(/\<br\>/gi, '\n')
						.replace(tags, '').replace(nbspTags, '')
	return resultTxt;
}
// url 유효성 검사
function validURL(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	if(!pattern.test(str)) {
		return false;
	} else {
		return true;
	}
}



// 댓글가져오기
function getReplyList(reload) {
	var  data = {}
		
	data['content_idx'] = getParam('idx')
	data['start'] = replyStart
	data['total'] = replyTotal
	
	_oc.sendPost('arcade_comment_list', data, 'cbPostYeyakCommentList');
}

function cbPostYeyakCommentList(result) {
	if (result['result'] == 'success') {
		var  str = ''
			,rdata = result['data']
		
		//console.log(rdata)
		replyStart = replyTotal + replyStart;
		if (rdata.length == 0) {
			str += '<li class="no-reply">';
			str += '	<i class="fa fa-smile-o"></i> 댓글이 없습니다.';
			str += '</li>';
			reloadStr = '	<button class="btn btn-alpha btn-block reload" id="btnReload"><i class="fa fa-rotate-left"></i> 새로고침</button>';
			$('#replayBox').html(str);
			$('#replayBox').append(reloadStr);
		} else {
			totalReply = rdata[0]['total']
			str += '<li class="more" id="listMore">';
			str += '	<button class="btn btn-warning btn-block" id="btnMore">댓글 더 불러오기</button>';
			str += '</li>';
			
			for (var i=rdata.length-1; i>=0; i--) {
				var  regTime = fromNow(rdata[i]['reg_date'])
					,profile = rdata[i]['story_profile']
					,nickname = decode(rdata[i]['story_nickname'])
					
				if (nickname == '') {
					nickname = '&nbsp;'
				}
				if (profile == '') {
					profile = '../images/default.png'
				}
				str += '<li data-reply="' + rdata[i]['comment_idx'] + '">';
				str += '		<p class="profile"><img src="' + profile + '" style="height:45px"></p>';
				str += '	<div class="reply">';
				
				str += '		<p class="author">' + nickname + '</p>';
				str += '		<p class="description">' + decode(rdata[i]['comment']) + '</p>';
				if (rdata[i]['user_idx'] == getSetting('user_idx')) {
					str += '		<p class="control">' + regTime + ' | <span data-delReply="' + rdata[i]['comment_idx'] + '">삭제</span></p>';
				} else {
					str += '		<p class="control">' + regTime + '</p>';
				}
				str += '	</div>';
				str += '</li>';
			}
			$('#commentTotal').html('(총 ' + totalReply + '개)');
			reloadStr = '	<button class="btn btn-alpha btn-block reload" id="btnReload"><i class="fa fa-rotate-left"></i> 새로고침</button>';
			$('#replayBox').prepend(str);
			$('#replayBox').append(reloadStr);
			if (totalReply == $('[data-reply]').length) {
				$('#listMore').remove();
			}
			// 댓글 더 불러오기
			$('#btnMore').off('click').on('click', function(){
				$('#listMore').remove();
				$('#btnReload').remove();
				getReplyList();
			})
		}
		
		if (reload) {
			$("html, body").animate({ scrollTop: $(document).height() }, 0);
		}
		
		// 삭제
		$('[data-delReply]').on('click', function(){
			var idx = $(this).attr('data-delReply');
			if (confirm('댓글을 삭제하겠습니까?')) {
				var  data = {}
					
				data['user_idx'] = getSetting('user_idx');
				data['content_idx'] = getParam('idx');
				data['comment_idx'] = idx;
				_oc.sendPost('arcade_comment_delete', data, 'cbPostYeyakCommentDelete')
			}
			return false;
		})
		
		$('#btnReload').on('click', function(){
			replyStart = 0;
			$('#replayBox').html('')
			getReplyList(1);
		})
	}
}

function cbPostYeyakCommentDelete(result) {
	if (result['result'] == 'success') {
		replyStart = 0;
		$('#replayBox').html('')
		getReplyList(1);
	}
}

function initReplyAdd() {
	//댓글쓰기
	$('#inputReply').on('focus', function(){
		if (getSetting('user_name') == '') {
			setId()
			return false;
		}
		if($('#inputReply').html() == '이곳에 댓글을 써보세요~') {
			$('#inputReply').html('')
		}
	})
	$('#btnAddComment').on('click', function(){
		if (getSetting('user_name') == '') {
			setId()
			return false;
		}
		var  comment = removeTagAll($('#inputReply').html()).replace(/\n/gi, '\r\n')
		if (comment == '') {
			_oc.toast('댓글을 입력하세요.');
			return false;
		}
		if ($('#inputReply').html() == '이곳에 댓글을 써보세요~') {
			_oc.toast('댓글을 입력하세요.');
			return false;
		}
		$('#inputReply').html('');
		
		var data = {}
		data['content_idx'] = getParam('idx');
		data['user_idx'] = getSetting('user_idx')
		data['comment'] = comment
		data['platform'] = platform
		data['user_agent'] = window.navigator.userAgent
		
		_oc.sendPost('arcade_comment_insert', data, 'cbPostYeyakCommentInsert');
	})
}

function setId() {
	var str = '';
	str += '<div class="modal-dialog">';
	str += '	<div class="modal-content">';
	str += '		<div class="modal-header">';
	str += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
	str += '			<h4 class="modal-title" id="modalLabel">사용할 이름을 입력해주세요.</h4>';
	str += '		</div>';
	str += '		<div class="modal-body" id="modalContent">';
	
	str += '<div class="form-group group-movie-input">';
	str += '	<input type="text" class="form-control" id="inputName" placeholder="" maxlength="50">';
	str += '</div>';

	str += '</div>';
	str += '		<div class="modal-footer">';
	str += '			<button type="button" class="btn btn-default" id="btnCloseModal">닫기</button>';
	str += '			<button type="button" class="btn btn-primary" id="btnModalSelect">확인</button>';
	str += '		</div>';
	str += '	</div>';
	str += '</div>';
	
	$('#modal').modal('show');
	$('#modal').html(str);
	
	$('#btnModalSelect').on('click', function(){
		var userName = $('#inputName').val()
		
		var data = {}
		data['user_name'] = userName;
		data['user_idx'] = getSetting('user_idx');
		
		_oc.sendPost('arcade_member_checkid', data, 'cbPostCheckId');
	})
	
	$('#btnCloseModal').on('click', function(){
		hideModal();
	})
}

function cbPostCheckId(result) {
	if (result['result'] == 'success') {
		var userName = $('#inputName').val()
		setSetting('user_name', userName);
						
		var data = {}
		data['user_name'] = userName;
		data['user_idx'] = getSetting('user_idx');
		
		_oc.sendPost('arcade_member_insert_nickname', data, 'cbPostUpdateNickname');
	} else {
		alert('이미 사용중인 이름입니다.');
	}
}

function cbPostUpdateNickname(result) {
	if (result['result'] == 'success') {
		setSetting('user_name', result['data']['user_name'])
		hideModal();
	}
}

function cbPostYeyakCommentInsert(result) {
	if (result['result'] == 'success') {
		replyStart = 0;
		$('#replayBox').html('');
		getReplyList(1);
	}
}

// 사이드메뉴 컨트롤 
function showPanel() {
	M('#panel').animate({
		'left': '0px',
		'time': '.5s'
	})
	M('#panelBg').css('display', 'block').animate({
		'opacity': '.4',
		'time': '.5s'
	})
	$('#panel').attr('data-open', '1');
}

function hidePanel() {
	M('#panel').animate({
		'left': '-250px',
		'time': '.5s'
	})
	M('#panelBg')
		.css('display', 'none')
		.css('opacity', '0')
	$('#panel').attr('data-open', '0');
}

// 날짜 계산기
function calDay(d, start_day) {
	var  fullToday = moment().format('YYYY-MM-DD')
		,thisYear = moment().format('YYYY')
		,today = moment().format('MM-DD')
		,fullDday = d
		,dday = moment(d, 'YYYY-MM-DD').format('MM-DD')
		,diffday = parseInt(moment(fullDday).diff(fullToday, 'days'))
		,diffFlag = moment(today).isBefore(dday)
		,fullDiffFlag = moment(fullToday).isBefore(fullDday)
		,sameFlag = moment(today).isSame(dday)
		,next = ''
		,last = ''
		,memorials = []
		,meYear = []
		
	if (diffday < 0) {
		flag = '-1'
	} else if (diffday > 0) {
		flag = '1'
	} else {
		flag = '0'
	}
	
	var  lastDay = moment(thisYear+'-'+dday, 'YYYY-MM-DD')
		,lastDayStr = moment(lastDay).format('YYYY-MM-DD')
		,nextDay = moment(thisYear+'-'+dday, 'YYYY-MM-DD')
		,nextDayStr = moment(nextDay).format('YYYY-MM-DD')
	
	// 날짜 같음
	if (sameFlag) {
		// 년도도 같음
		if (moment(fullToday).isSame(fullDday)) {
			last = 0;
			next = 0;
		// 년도 다름
		} else {
			next = moment(dday).diff(today, 'days');
			last = moment(fullToday).diff(lastDay, 'days');
			lastDayStr = ''
			nextDayStr = ''
		}
		
	} else if (fullDiffFlag) {
		var basisDay = moment(thisYear+'-'+dday, 'YYYY-MM-DD').subtract('year', 1)
		next = moment(fullDday).diff(fullToday, 'days');
		last = moment(fullToday).diff(basisDay, 'days');
	} else {
		if (diffFlag) {
			// 안지남
			lastDay = moment(thisYear+'-'+dday, 'YYYY-MM-DD').subtract('year', 1)
			lastDayStr = moment(lastDay).format('YYYY-MM-DD')
			
			next = moment(dday).diff(today, 'days');
			last = moment(fullToday).diff(lastDay, 'days');
		} else {
			// 지남
			nextDay = moment(thisYear+'-'+dday, 'YYYY-MM-DD').add('year', 1)
			nextDayStr = moment(nextDay).format('YYYY-MM-DD')
			
			last = moment(today).diff(dday, 'days');
			next = moment(nextDay).diff(fullToday, 'days');
		}
	}
	
	// 기념주년
	for (i=1; i<55; i++) {
		var  memorialYear = moment(fullDday, 'YYYY-MM-DD').add('year', i)
			,memYearDiff = moment(memorialYear).diff(fullDday, 'days')
		meYear.push(memYearDiff)
	}
	// 기념일
	var j=0;
	for(var i=100; i<20000; i=i+100) {
		var mday = {}
		if (i - meYear[j] > 0) {
			k = j+1
			mday[k+'주년'] = moment(fullDday, 'YYYY-MM-DD').add('year', k).format('YYYY-MM-DD')
			memorials.push(mday);
			j++
		}
		var mday = {}
		mday[M.toCurrency(i)+'일'] = moment(fullDday, 'YYYY-MM-DD').add('days', i-1).format('YYYY-MM-DD')
		memorials.push(mday)
	}
	return {
		'flag': flag,
		'total': M.toCurrency(Math.abs(diffday)),
		'last': last,
		'lastDay': lastDayStr,
		'next': next,
		'nextDay': nextDayStr,
		'memorial': memorials
	}
}

function arrageJons(arr) {
	arr.sort(function(a, b){
		return a['dday']['next'] - b['dday']['next']
	});
	return arr;
}

function getReservationTime(d) {
	return Math.round( moment(d).diff()/1000 );
	
}


