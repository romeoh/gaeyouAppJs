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
	
	i18n.init(function(t) {
		// translate nav
		$("body").i18n();
		
		// programatical access
		var appName = t("app.name");
	});
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


function arrageJons(arr) {
	arr.sort(function(a, b){
		return a['dday']['next'] - b['dday']['next']
	});
	return arr;
}

function getReservationTime(d) {
	return Math.round( moment(d).diff()/1000 );
	
}


