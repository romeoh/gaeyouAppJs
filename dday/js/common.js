var settingId = 'dday_setting'

function initDefault() {
	if (M.storage(settingId) == null) {
		M.storage(settingId, '{}');
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

function request(tr, data, callback) {
	$.ajax({
		url : 'http://dday.gaeyou.com/api/v1/' + tr + '.php',
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
	var setting = M.json(M.storage(settingId));
	return setting[key] || '';
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
		var  userName = $('#inputName').val()
			,data = {}
		
		data['user_name'] = userName;
		
		request('dday_member_checkid', data, function(result){
			if (result['result'] == 'success') {	
				var data = {}
				data['user_name'] = userName;
				data['user_idx'] = getSetting('user_idx');
				
				request('dday_member_update', data, function(result){
					if (result['result'] == 'success') {
						var rdata = result['data']
						setSetting('user_name', rdata['user_name'])
						hideModal();
						publicDday();
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

// restart
function onRestart() {
	// list
	if ($('#dList').length > 0) {
		initList();
		return false;
	}
	
	// 재미있는 디데이
	if ($('#publicList').length > 0) {
		listStart = 0
		listTotal = 20
		initPublic();
		return false;
	}
}


// 날짜 계산기
function calDay(d, option) {
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
	if (option) {
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




