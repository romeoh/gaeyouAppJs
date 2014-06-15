function initDefault() {
	if (M.storage('setting') == null) {
		M.storage('setting', '{}');
	}
	$('#btnBack').on('click', function(){
		//window.history.go(-1)
		_oc.back()
	})
	
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
		var  tday = moment()
			,lday = moment('2014-06-28')
		if (tday.isAfter(lday)) {
			_oc.link('../schedule/tournament.html', '', 'CLEAR_TOP', 'DEFAULT');
		} else {
			_oc.link('../schedule/league.html', '', 'CLEAR_TOP', 'DEFAULT');
		}
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
		setSetting('alarm1', 'true')
	})
	// 공유
	$('#btnShare').on('click', function(){
		var msg = '브라질월드컵 일정을 다운받아 보세요.\nhttps://play.google.com/store/apps/details?id=com.gaeyou.fifa'
		_oc.share(msg)
	})
	if (getSetting('alarm1') == 'true') {
		$('#alarm1').css('display', 'none');
	}
}

function request(tr, data, callback) {
	$.ajax({
		url : 'http://fifa.gaeyou.com/api/v1/' + tr + '.php',
		dataType : "jsonp",
		data: data,
		jsonp: 'callback',
		success : function(data){
			callback(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){
			console.log(textStatus, errorThrown)
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
	var setting = M.json(M.storage('setting'));
	return setting[key] || '';
}
function setSetting(key, value) {
	var setting = M.json(M.storage('setting'));
	setting[key] = value;
	M.storage('setting', M.json(setting));
}
function delSetting(key) {
	var setting = M.json(M.storage('setting'));
	delete setting[key];
	M.storage('setting', M.json(setting));
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
	var  at = moment(a.date+'T'+a.time, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm')
		,bt = moment(b.date+'T'+a.time, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm')
		//console.log(a.date+'T'+a.time, at)
	//return new Date(at).getTime() - new Date(bt).getTime();
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

var M = {
	'storage': function(key, value){
		if (value == undefined) {
			// getter
			return localStorage.getItem(key);
		}
		//setter
		localStorage.setItem(key, value);
	},
	'json': function(_value, _type) {
		if (_type == 0) {
			return JSON.stringify(_value);
		}
		if (_type == 1) {
			if (_value != ''){
				return JSON.parse(_value);
			} else {
				return {}
			}
		}
		if (typeof _value === 'object') {
			return JSON.stringify(_value);
		} else {
			if (_value != ''){
				return JSON.parse(_value);
			} else {
				return {}
			}
		}
	}
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
	return str.replace(/\<div\>/gi, '').replace(/\<\/div\>/gi, '<br>').replace(/\&nbsp\;/gi, ' ');
}




// 댓글가져오기
function getReplyList(reload) {
	var  data = {}
		
	data['match_idx'] = match_idx
	data['flag'] = flag
	data['start'] = replyStart
	data['total'] = replyTotal
	
	request('fifa_comment_list', data, function(result){
		if (result['result'] == 'success') {
			var  str = ''
				,rdata = result['data']
			
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
					var regTime = fromNow(rdata[i]['reg_date'])
					
					str += '<li data-reply="' + rdata[i]['comment_idx'] + '">';
					//str += '	<div class="profile"><img data-profile="' + rdata[i]['comment_idx'] + '" src="' + rdata[i]['profile'] + '"></div>';
					str += '	<div class="reply">';
					str += '		<p class="author">' + decode(rdata[i]['member']) + '</p>';
					str += '		<p class="description">' + decode(rdata[i]['comment']) + '</p>';
					if (rdata[i]['member'] == getSetting('user_name')) {
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
						
					data['user_name'] = getSetting('user_name');
					data['match_idx'] = match_idx;
					data['comment_idx'] = idx;
					request('fifa_comment_delete', data, function(result){
						if (result['result'] == 'success') {
							replyStart = 0;
							$('#replayBox').html('')
							getReplyList(1);
						}
					})
				}
				return false;
			})
			
			$('#btnReload').on('click', function(){
				replyStart = 0;
				$('#replayBox').html('')
				getReplyList(1);
			})
		}
	})
}

function initReplyAdd() {
	//댓글쓰기
	$('#inputReply').on('focus', function(){
		if (getSetting('user_name') == '') {
			setId()
			return false;
		}
		if ($('#inputReply').html() == '이곳에 댓글을 써보세요~') {
			$('#inputReply').html('')
		}
	})
	$('#btnAddComment').on('click', function(){
		if (getSetting('user_name') == '') {
			setId()
			return false;
		}
		var  comment = $('#inputReply').html()
			,member = getSetting('user_name')
		if (comment == '') {
			alert('댓글을 입력하세요.');
			return false;
		}
		if ($('#inputReply').html() == '이곳에 댓글을 써보세요~') {
			$('#inputReply').html('')
			alert('댓글을 입력하세요.');
			return false;
		}
		$('#inputReply').html('');
		var data = {}
		data['match_idx'] = match_idx;
		data['flag'] = flag
		data['member'] = member
		data['comment'] = encode(comment)
		data['platform'] = platform
		
		request('fifa_comment_insert', data, function(result){
			if (result['result'] == 'success') {
				replyStart = 0;
				$('#replayBox').html('');
				getReplyList(1);
			}
		})
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
		
		request('fifa_member_checkid', data, function(result){
			if (result['result'] == 'success') {
				console.log(userName)
				setSetting('user_name', userName);
								
				var data = {}
				data['user_name'] = userName;
				data['phone_number'] = getSetting('user_key');
				data['platform'] = platform;
				
				request('fifa_member_insert', data, function(result){
					if (result['result'] == 'success') {
						hideModal();
					}
				})
			} else {
				alert('이미 사용중인 이름입니다.');
			}
		})
	})
	
	$('#btnCloseModal').on('click', function(){
		hideModal();
	})
}














