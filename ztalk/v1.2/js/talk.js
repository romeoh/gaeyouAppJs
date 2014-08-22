var  store = 'https://play.google.com/store/apps/details?id=com.gaeyou.ztalk'
	,shotStore = 'http://goo.gl/rbxiXH'
	,winWidth = document.body.clientWidth

function onReady() {
	//_oc.log('user_idx: '+getSetting('user_idx') + ' -- user_name: '+getSetting('user_name') + ' -- user_level: '+getSetting('user_level'))
	/* 친구들 */
	if ($('#friend').length > 0) {
		// 정렬
		if (!getSetting('assign')) {
			setSetting('assign', '0')
		}
		// 초대
		$('#sort').on('click', function(){
			var title = ''
				,item = i18n.t("message.sortList")	//'최신메세지순,가나다순,관심병순'
				,init = getSetting('assign')
				,callback = 'cbSort'
			_oc.list(title, item, init, callback);
		}).on('touchstart', function(){})
		
		// 설정
		$('#setting').on('click', function(){
			var param = 'flag=main'
			_oc.link('../talk/setting.html', param)
		}).on('touchstart', function(){})
		
		initFriend();
	}
	
	/* 대화창 */
	if ($('#talk').length > 0) {
		var keyWidth = winWidth / 6
		$('.keys li').css('width', keyWidth + 'px');
		
		var friendIdx = getParam('idx')
		if (friendIdx == '0' || friendIdx == '' || !friendIdx) {
			_oc.toast('잘못된 접근입니다.');
			_oc.back();
			return false;
		} else {
			initTalk();
		}
	}
	
	/* 설정 */
	if ($('#setting').length > 0) {
		initSetting();
		
		// ㅋ톡이란?
		/*$('#help').on('click', function(){
			_oc.link('../talk/help.html');
		})*/
	}
	
}

// 친구 정렬
function cbSort(idx) {
	setSetting('assign', idx);
	initFriend();
}

// 친구들
function initFriend() {
	// 친구리스트
	var data = {}
	
	data['user_idx'] = getSetting('user_idx')
	_oc.sendPost('ztalk_friend_list', data, 'cbPostFriendList');
}

function cbPostFriendList(result	) {
	var rdata = assignFriend(result['friend'])
		,me = result['me']
		
	setSetting('user_name', me['nickname'])
	setSetting('user_profile', me['profile'])
	setSetting('user_level', me['level'])
	
	var  str = ''
		,myProfile = getProfile(getSetting('user_profile'));
	
	// 나의 프로필
	level = getLevel(getSetting('user_level'))
	levelClass = getLevelClass(getSetting('user_level'));
	
	str += '<li class="friend" data-idx="me">';
	str += '    <p class="thum">';
	str += '    	<span data-bedge="" class="bedge level' + levelClass + '">' + level + '</span>';
	str += '    	<img src="' + myProfile + '" >';
	str += '    </p>';
	str += '	<p class="description">' + getSetting('user_name') + '</p>';
	str += '</li>';
	
	if (rdata.length == 0) {
		console.log('없음')
	} else {	
		for (var i in rdata) {
			//console.log(rdata[i])
			if (rdata[i]['nickname']) {
				var profile = getProfile(rdata[i]['profile']);
				level = getLevel(rdata[i]['level'])
				levelClass = getLevelClass(rdata[i]['level']);
	
				str += '<li class="friend" data-idx="' + rdata[i]['idx'] + '">';
				str += '	<p class="thum">';
				str += '		<span data-bedge="" class="bedge level' + levelClass + '">' + level + '</span>';
				str += '		<img src="' + profile + '" >';
				str += '	</p>';
				//str += '	<p class="thum"><img src="' + profile + '" ></p>';
				str += '	<p class="description">' + rdata[i]['nickname'] + '</p>';
				if(rdata[i]['was_view'] == '0') {
					str += '	<p class="bedge-box"><i class="fa fa-comment"></i></p>';
				}
				str += '</li>';
			}
		}
	}
	// 친구 초대
	str += '<li class="no-thum" data-idx="invite">';
	str += '	<p class="description" data-i18n="message.add_friend"></p>';
	str += '</li>';
	
	$('#friend').html(str);
	$("body").i18n();
	
	$('[data-idx]').on('click', function(){
		var  idx = $(this).attr('data-idx')
			,param = 'idx=' + idx
		if (idx == 'me') {
			_oc.toast(
				// XXX님은 X개의 관심병을 가지고 있습니다.
				i18n.t("message.mybottle", {
					user: getSetting('user_name'), 
					bottle:getSetting('user_level')
				}) 
			)
		} else if (idx == 'invite') {
			// [ㅋ톡: 관심병을 던져라]\n친구에게 ㅋㅋㅋㅋㅋㅋ를 보내는 신개념 메신져입니다.
			showSns();
		} else {
			_oc.link('../talk/talk.html', param, 'DEFAULT', 'DEFAULT', 'NO_ANIMATION')
		}
	}).on('touchstart', function(){})
}

function showSns() {
	var str = '';
	str += '<div class="modal-dialog">';
	str += '	<div class="modal-content">';
	str += '		<div class="modal-header">';
	str += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
	str += '			<h4 class="modal-title" id="modalLabel">친구가 많으면 훨씬 재미있어요.</h4>';
	str += '		</div>';
	str += '		<div class="modal-body" id="modalContent">';
	
	str += '<ul class="form-group group-movie-input">';
	str += '	<li data-sns="0"><span class="sns0"></span>카카오스토리</li>';
	str += '	<li data-sns="1"><span class="sns1"></span>카카오톡</li>';
	//str += '	<li data-sns="2"><span class="sns2"></span>페이스북</li>';
	//str += '	<li data-sns="3"><span class="sns3"></span>트위터</li>';
	str += '	<li data-sns="4"><span class="sns4"></span>라인</li>';
	str += '	<li data-sns="5"><span class="sns5"></span>밴드</li>';
	str += '	<li data-sns="6"><span class="sns6"></span>마이피플</li>';
	//str += '	<li data-sns="7"><span class="sns7"></span>지메일</li>';
	str += '	<li data-sns="8"><span class="sns8"></span>공유</li>';
	str += '</ul>';
	
	str += '</div>';
	str += '		<div class="modal-footer">';
	str += '			<button type="button" class="btn btn-default" id="btnCloseModal">닫기</button>';
	str += '		</div>';
	str += '	</div>';
	str += '</div>';
	
	$('#modal').modal('show');
	$('#modal').html(str);
	
	$('[data-sns]').on('click', function(){
		var idx = $(this).attr('data-sns');
		shareSns(idx);
	})
	$('#btnCloseModal').on('click', function(){
		hideModal();
	})
}

// sns 공ㅇ
function shareSns(idx) {
	var  id = 'ㅋ톡'
		,ver = '1.0'
		,app = '[ㅋ톡] 관심병을 던져라'
		,post = 'ㅋ톡에서 기다리고 있을께요.\n\n' + shotStore
		,title = '친구에게 매일 ㅋㅋㅋㅋ를 보내세요.'
		,desc = ''
		,img = 'http://ztalk.gaeyou.com/m/images/icon_512.png'
		
	// 카카오스토리
	if (idx == '0') {
		var urlinfo = {
				'title': title,
				'desc': desc,
				'imageurl': [img],
				'type': 'article'
			}
		
		kakao.link("story").send({   
			appid : id,
			appver : ver,
			appname : app,
			post : post,
			urlinfo : M.json(urlinfo)
		});
		return false;
	}
	// 카카오톡
	if (idx == '1') {
		kakao.link('talk').send({
			msg: post,
			url: '',
			appid: id,
			appver: ver,
			appname: app,
			type: 'link'
		});
		return false;
	}
	// 페이스북
	if (idx == '2') {
		
		return false;
	}
	// 트위터
	if (idx == '3') {
		desc += 'https://twitter.com/intent/tweet?text=';
		desc += encodeURIComponent(post);
		top.location.href = desc;
		return false;
	}
	// 라인
	if (idx == '4') {
		desc += 'line://msg/text/';
		desc += encodeURIComponent(post);
		top.location.href = desc;
		return false;
	}
	// 밴드
	if (idx == '5') {
		desc += 'band://';
		desc += encodeURIComponent(post);
		top.location.href = desc;
		return false;
	}
	// 마이피플
	if (idx == '6') {
		desc += 'mypto://sendMessage?message=';
		desc += encodeURIComponent(post);
		top.location.href = desc;
		return false;
	}
	// 지메일
	if (idx == '7') {
		//desc += 'googlegmail://co?subject=ㅋ톡&body=';
		//desc += encodeURIComponent(post);
		//top.location.href = desc;
		//return false;
	}
	// 공유
	var msg = i18n.t("message.sendSns") + '\n' + store
	_oc.share(msg);
}

// 친구정렬
function assignFriend (result) {
	assignFlag = getSetting('assign')
	
	// 마지막 메세지
	if (assignFlag == '0') {
		result = result.sort(function(a, b){
			if (a.last_date > b.last_date) return -1;
			if (b.last_date > a.last_date) return 1;
			return 0;
		})
	}
	// 가나다순
	if (assignFlag == '1') {
		result = result.sort(function(a, b){
			if (a.nickname > b.nickname) return 1;
			if (b.nickname > a.nickname) return -1;
			return 0;
		})
	}
	// 관심병순
	if (assignFlag == '2') {
		result = result.sort(function(a, b){
			if (a.level > b.level) return -1;
			if (b.level > a.level) return 1;
			return 0;
		})
	}
	return result;
}

// 대화창
function initTalk() {
	initGetMessage();
	initKeypad();
	keyAssign();
}

// 대화내용 가져오기
var  talkStart = 0
	,talkTotal = 10
function initGetMessage() {
	var data = {}
	
	data['user_idx'] = getSetting('user_idx');
	data['friend_idx'] = getParam('idx');
	data['start'] = talkStart;
	data['total'] = talkTotal;
	
	_oc.sendPost('ztalk_message_list', data, 'cbPostMessageList');
}

var  friend
	,meInfo
	,scrollBottom = true;
function cbPostMessageList(result) {
	var  rdata = result['data']
		,str = ''
	friend = result['friend']
	meInfo = result['me']
	
	//$('#friendInfo').html(friend['nickname'] + '<span class="bedge-box"><span class="bedge">' + friend['level'] + '</span></span>')
	$('#friendInfo').html(friend['nickname'])
	if (rdata.length == 0) {
		// 없음
	} else {
		talkStart = talkTotal + talkStart;
		// 더보기
		if (rdata.length == talkTotal) {
			str += '<li class="more" id="btnMore">';
			str += '	<p class="description">+</p>';
			str += '</li>';
		}
		//console.log(rdata)
		//for (var i in rdata) {
		var levelMe = meInfo['level']
			,levelFriend = friend['level']
		
		setSetting('user_level', meInfo['level'])
		setSetting('user_name', meInfo['nickname'])
		setSetting('user_profile', meInfo['profile'])
		
		for (var i=rdata.length-1; i>=0; i--) {
			var classFlag, profile, level, levelClass
			//console.log(rdata)
			if (rdata[i]['user_idx'] == getSetting('user_idx')) {
				classFlag = 'me'
				profile = getSetting('user_profile')
				level = getLevel(levelMe)
				levelClass = getLevelClass(levelMe);
			} else {
				classFlag = 'friend'
				profile = friend['profile']
				level = getLevel(levelFriend)
				levelClass = getLevelClass(levelFriend);
			}
			profile = getProfile(profile)
			
			str += '<li class="' + classFlag + '" data-message>';
			str += '    <p class="thum">';
			str += '    	<span data-bedge="' + classFlag + '" class="bedge level' + levelClass + '">' + level + '</span>';
			str += '    	<img src="' + profile + '" >';
			str += '    </p>';
			if (rdata[i]['bottle'] == '1') {
				str += '    <p class="description bottle"><img src="../images/bottle_' + classFlag + '.png" ></p>';
			} else {
				str += '    <p class="description">' + rdata[i]['message'] + '</p>';
			}
			if (rdata[i]['was_view'] == '0') {
				//str += '    <p class="bedge-message"><i class="fa fa-eye-slash"></i></p>';
			}
			str += '</li>';
		}
		$('#talk').prepend(str);
		
		$('#btnMore').on('click', function(){
			$('#btnMore').remove();
			initGetMessage(1);
		})
		
		// 메세지 줄이기
		$('[data-message]').on('click', function(){
			if ($(this).hasClass('short')) {
				$('[data-message]').removeClass('short')
			} else {
				$('[data-message]').addClass('short')
			}
		})
		
		if (scrollBottom) {
			var bodyBottom = parseInt($('body').css('height'), 10) * -1
			setTimeout(function(){
				$('body').ScrollTo({duration:0, offsetTop:bodyBottom});
			}, 100)
			scrollBottom = false;
		} else {
			setTimeout(function(){
				$('#talk li:nth-child(10)').ScrollTo({duration:0});
			}, 100)
		}
	}
}

function initKeypad() {
	$('[data-keypad]').on('touchstart', downListener)
	$('[data-keypad]').on('touchmove', downListener)
	$('[data-keypad]').on('touchend', downListener)
	//$('[data-keypad]').on('mousedown', downListener)
	//$('[data-keypad]').on('mousemove', downListener)
	//$('[data-keypad]').on('mouseup', downListener)
}

var isClick;
function downListener(evt) {
	switch (evt.type) {
		case 'touchstart': 
		case 'mousedown':
			if ($(evt.currentTarget).hasClass('disable')) {
				_oc.toast( getKeyMessage(getSetting('user_level')), 'LONG' );
			} else {
				isClick = true;
				$(this).addClass('active')
			}
		break;
		
		case 'touchmove': 
		case 'mousemove':
			isClick = false;
			$(this).removeClass('active');
		break;
		
		case 'touchend': 
		case 'mouseup':
			$(this).removeClass('active');
			if (isClick == true) {
				idx = $(this).attr('data-keypad')
				if (idx === 'back') {
					// 삭제
					delKey();
					return false;
				} else if (idx === 'enter') {
					// 보내기
					sendMessage();
					return false;
				} else if (idx === '0') {
					// 관심
					sendBottle();
					return false;
				} else{
					// 키보드
					addKey(idx)
					return false;
				}
			}
			isClick = false;
		break;
	}
	return false;
}

function getKeyMessage (idx) {
	if (idx == '1') {
		//return '관심병 1개 보유\n"ㅗ"를 사용할수 없습니다.';
		return i18n.t("message.keyWarning1");
	}
	if (idx == '2') {
		//return '관심병 2개 보유\n"ㅠ" 이상을 사용할수 없습니다.';
		return i18n.t("message.keyWarning2");
	}
	if (idx == '3') {
		//return '관심병 3개 보유\n"ㅇ" 이상을 사용할수 없습니다.';
		return i18n.t("message.keyWarning3");
	}
	if (idx == '4') {
		//return '관심병 4개 보유\n"ㅎ" 이상을 사용할수 없습니다.';
		return i18n.t("message.keyWarning4");
	}
	//return '관심병 ' + idx + '개 보유\n"ㅎ" 이상을 사용할수 없습니다.';
	return i18n.t("message.keyWarning5", {'bottle': idx});
}

// 병 던지기
function sendBottle() {
	var data = {}
	
	data['user_idx'] = getSetting('user_idx')
	data['friend_idx'] = getParam('idx')
	data['message'] = '';
	data['bottle'] = 1;
	data['platform'] = platform;
	data['user_agent'] = navigator.userAgent;
	_oc.sendPost('ztalk_message_send', data, 'cbPostMessageSend');
}


// 키추가
var message = []
function addKey(idx) {
	
	var key = getKey(idx)
	if (key) {
		if (message.length == 0) {
			$('#toast').css('display', 'block');
		}
		message.push(key)
		$('#msgbox').html(message.join(''))
	}
}

function getKey(idx) {
	if (idx == '1') {
		return 'ㅋ';
	}
	if (idx == '2') {
		if (getSetting('user_level') <= 3) {
			return 'ㅎ';
		}
		return false;
	}
	if (idx == '3') {
		if (getSetting('user_level') <= 2) {
			return 'ㅇ';
		}
		return false;
	}
	if (idx == '4') {
		if (getSetting('user_level') <= 1) {
			return 'ㅠ';
		}
		return false;
	}
	if (idx == '5') {
		if (getSetting('user_level') <= 0) {
			return 'ㅗ';
		}
		return false;
	}
}

// 키삭제
function delKey() {
	message.pop();
	$('#msgbox').html(message.join(''))
	if (message.length == 0) {
		$('#toast').css('display', 'none');
	}
	return false;
}

// 메세지 전송
function sendMessage() {
	var friendIdx = getParam('idx')
	if (friendIdx == '0' || friendIdx == '' || !friendIdx) {
		//_oc.toast('메세지를 전송하지 못했습니다.');
		_oc.toast(i18n.t("message.sendError"));
		_oc.back();
		return false;
	}
	if (message.length == 0) {
		$('#toast').css('display', 'none');
		//_oc.toast('메세지를 입력하세요.');
		_oc.toast(i18n.t("message.enterMessage"));
		return false;
	}
	var data = {}
	
	data['user_idx'] = getSetting('user_idx')
	data['friend_idx'] = getParam('idx')
	data['message'] = message.join('')
	data['bottle'] = 0;
	data['platform'] = platform;
	data['user_agent'] = navigator.userAgent;
	_oc.sendPost('ztalk_message_send', data, 'cbPostMessageSend');
}

function cbPostMessageSend(result) {
	if (result['result'] == 'success') {
		var  rdata = result['data']
			,str = ''
			,bodyBottom = parseInt($('body').css('height'), 10) * -1
			,profile = getSetting('user_profile')
			,level = getSetting('user_level')
			,levelClass = level
		
		if (rdata['bottle'] == '1') {
			level = levelClass = level-1
		}
		level = getLevel(level)
		levelClass = getLevelClass(levelClass)
		setSetting('user_level', level);
		profile = getProfile(profile);
			
		str += '<li class="me" data-message>';
		str += '    <p class="thum">';
		str += '    	<span data-bedge="me" class="bedge level' + levelClass + '">' + level + '</span>';
		str += '    	<img src="' + profile + '" >';
		str += '    </p>';
		if (rdata['bottle'] == '1') {
			str += '    <p class="description bottle"><span class="bottle-frame animation"></span></p>';
			
			// 나의 썸네일 벳지 처리
			$('[data-bedge="me"]').html(level).attr('class', 'bedge level'+levelClass);
			
			// 친구 썸네일 벳지처리
			friendLevel = friendLevelClass = Number(friend['level']) + Number(1)
			friendLevel = getLevel(friendLevel);
			friendLevelClass = getLevelClass(friendLevelClass);
			$('[data-bedge="friend"]').html(friendLevel).attr('class', 'bedge level'+friendLevelClass)
			
		} else {
			str += '    <p class="description">' + rdata['message'] + '</p>';
		}
		$('#talk').append(str);
		
		// 벳지 숫자 처리
		if (rdata['bottle'] == '1') {
			// 병 에니메이션
			bottleAnimationPlay(0)
		} else {
			message.length = 0;
			$('#toast').css('display', 'none');
		}
		setTimeout(function(){
			$('body').ScrollTo({duration:700, offsetTop:bodyBottom});
		}, 100);
		
		keyAssign();
	} else {
		// 병던지기 유효성 결과
		_oc.toast(result['message'], 'LONG');
	}
	
}


// 병 에니메이션
function bottleAnimationPlay(flag) {
	var  interval = 0
		,intervalAni = null
	intervalAni = setInterval(function(){
		$('.animation').css('backgroundPositionX', interval*100*-1+'px')
		interval++;
		if (interval == 13) {
			clearInterval(intervalAni);
			intervalAni = null;
			$('.animation').removeClass('animation')
		}
	}, 50)
	
	if (flag == 0) {
		// to friend
		$('.animation').animate({
			'right': winWidth-100+'px'
		}, 700)
	} else if (flag == 1) {
		// to me
		$('.animation').animate({
			'left': winWidth-100+'px'
		}, 700)
	} else if (flag == 2) {
		// to me in popup
		$('.animation').animate({
			'left': winWidth-150+'px'
		}, 700)
	}
}

// 메세지 푸시 받음
var intervalId = null;
function receiveMessage(result) {
	var rdata = M.json(result)
		,myLevel = myLevelClass = getSetting('user_level')
		
	if (rdata['bottle'] == '1') {
		myLevel = myLevelClass = parseInt(myLevel, 10) + parseInt(1, 10);
	}
	myLevel = getLevel(myLevel)
	myLevelClass = getLevelClass(myLevelClass)
	setSetting('user_level', myLevel)
	
	if (rdata['friendIdx'] == getParam('idx')) {
		// 메세지 푸시 받음
		var str = ''
			,bodyBottom = parseInt($('body').css('height'), 10) * -1
			,profile = friend['profile']
			,friendLevel = friendLevelClass = friend['level']
		
		if (rdata['bottle'] == '1') {
			friendLevel = friendLevelClass = friendLevel - 1;
		}
		friendLevel = getLevel(friendLevel)
		friendLevelClass = getLevelClass(friendLevelClass)
		friend['level'] = friendLevel
		profile = getProfile(profile)
		
		str += '<li class="friend" data-message>';
		str += '    <p class="thum">';
		str += '    	<span data-bedge="friend" class="bedge level' + friendLevelClass + '">' + friendLevel + '</span>';
		str += '    	<img src="' + profile + '" >';
		str += '    </p>';
		if (rdata['bottle'] == '1') {
			str += '    <p class="description bottle"><span class="bottle-frame animation"></span></p>';
		} else {
			str += '    <p class="description">' + rdata['message'] + '</p>';
		}
		$('#talk').append(str);
		$('[data-bedge="me"]').html(myLevel).attr('class', 'bedge level'+myLevelClass);
		$('[data-bedge="friend"]').html(friendLevel).attr('class', 'bedge level'+friendLevelClass);
		bottleAnimationPlay(1)
		setTimeout(function(){
			$('body').ScrollTo({duration:0, offsetTop:bodyBottom});
		}, 100)
		keyAssign();
		
		// 메세지 받음
		var data = {}
	
		data['user_idx'] = getSetting('user_idx')
		data['friend_idx'] = getParam('idx')
		_oc.sendPost('ztalk_message_view', data, 'cbPostMessageView');
	} else {
		// 팝업으로 푸시 받음
		$('#popup').css('display', 'block');
		$('#receiveFriend').html(rdata['nickname'] + '<span class="close-pop" id="btnClosePop"><i class="fa fa-times"></i></span>')
		if (rdata['bottle'] == '1') {
			$('#receiveMsg').html('<p class="description"><span class="bottle-frame animation"></span></p>');
			bottleAnimationPlay(2)
		} else {
			if (rdata['message'].indexOf('ㅋ톡을 시작합니다.') != -1) {
				$('#receiveMsg').html(rdata['message']).addClass('info');
				initFriend();
			} else {
				$('#receiveMsg').html(rdata['message']).removeClass('info');
			}
		}
		_oc.vabrator(1000);
		
		clearTimeout(intervalId);
		intervalId = null;
		intervalId = setTimeout(hidePopup, 4000);
		$('#btnClosePop').on('click', function(){
			clearTimeout(intervalId);
			intervalId = null;
			hidePopup();
		})
		$('[data-bedge="me"]').html(myLevel).attr('class', 'bedge level'+myLevelClass);
		// 말풍선 넣기
		if ($('[data-idx="' + rdata['friendIdx'] + '"] .bedge-box').length == '0') {
			$('[data-idx="' + rdata['friendIdx'] + '"]').append('<p class="bedge-box"><i class="fa fa-comment"></i></p>')
		}
		keyAssign();
	}
}

function cbPostMessageView(result) {
	// 메세지 받음 콜백
}

function keyAssign() {
	var myLevel = getSetting('user_level')
	//if (message.length != 0) {
		var  newMsg = []
			,delKey = ''
		
		if (myLevel == 1) {
			for (var i in message) {
				if (message[i] != 'ㅗ') {
					newMsg.push(message[i])
				}	
			}
			$('[data-keypad="5"]').addClass('disable');
		} else if (myLevel == 2) {
			for (var i in message) {
				if (message[i] != 'ㅠ') {
					newMsg.push(message[i])
				}	
			}
			$('[data-keypad="4"]').addClass('disable');
		} else if (myLevel == 3) {
			for (var i in message) {
				if (message[i] != 'ㅇ') {
					newMsg.push(message[i])
				}
			}
			$('[data-keypad="3"]').addClass('disable');
		} else if (myLevel == 4) {
			for (var i in message) {
				if (message[i] != 'ㅎ') {
					newMsg.push(message[i])
				}	
			}
			$('[data-keypad="2"]').addClass('disable');
		}
		message = newMsg;
		$('#msgbox').html(message.join(''))
	//}
	
	if (myLevel == 0) {
		// ㅗ
		$('[data-keypad="2"]').removeClass('disable')
		$('[data-keypad="3"]').removeClass('disable')
		$('[data-keypad="4"]').removeClass('disable')
		$('[data-keypad="5"]').removeClass('disable')
	} else if (myLevel == 1) {
		// ㅠ
		$('[data-keypad="2"]').removeClass('disable')
		$('[data-keypad="3"]').removeClass('disable')
		$('[data-keypad="4"]').removeClass('disable')
	} else if (myLevel == 2) {
		// ㅠ
		$('[data-keypad="2"]').removeClass('disable')
		$('[data-keypad="3"]').removeClass('disable')
	} else if (myLevel == 3) {
		// ㅇ
		$('[data-keypad="2"]').removeClass('disable')
	} else if (myLevel == 4) {
		// ㅎ
	}
}

function getLevel(lv) {
	if (lv > 9) {
		return '9';
	}
	if (lv < 0) {
		return 0;
	}
	return lv;
}
function getLevelClass(lv) {
	if (lv > 4) {
		return 4;
	}
	if (lv < 0) {
		return 0;
	}
	return lv;
}
function getProfile(profile) {
	if (profile == '') {
		return '../images/default.png';
	} else {
		return 'http://ztalk.gaeyou.com/upload/profile/' + profile;
	}
}



function hidePopup() {
	$('#receiveFriend').html('')
	$('#receiveMsg').html('');
	$('#popup').css('display', 'none');
}














// 설정
function initSetting() {
	var data = {}
	
	data['user_idx'] = getSetting('user_idx')
	_oc.sendPost('ztalk_setting', data, 'cbPostSetting');
}

function cbPostSetting(result) {
	var  rdata = result['data']
		,isPhone = rdata['phone_number']
	
	// 닉네임
	if (rdata['nickname']) {
		$('#nickname').attr('value', rdata['nickname'])
	}
	$('#nickname').on('focus', function(){
		var nickname = $('#nickname').val()
		if (nickname == '대화명입력' || nickname == 'nick name') {
			$('#nickname').attr('value', '')
		}
	})
	$('#nickname').on('blur', function(){
		var nickname = $('#nickname').val()
		if (nickname == '') {
			//$('#nickname').attr('value', '대화명입력')
			$('#nickname').attr('value', i18n.t("attr.nickname"))
		}
	})
	
	// 폰번호
	if (isPhone.length > 9) {
		$('#phoneNumber').remove();
	}
	if (isPhone == '' || isPhone == 'null') {
		$('#phone').on('focus', function(){
			var phone = $('#phone').val()
			$('#phone').attr('type', 'number');
			if (phone == '폰번호' || phone == 'phone number') {
				$('#phone').attr('value', '')
			}
		})
		$('#phone').on('blur', function(){
			var phone = $('#phone').attr('value')
			if (phone == '') {
				$('#phone').attr('type', 'text');
				//$('#phone').attr('value', '폰번호')
				$('#phone').attr('value', i18n.t("attr.phoneNumber"))
			} else {
				phone = phone.replace(/-/gi, '').replace(/ /gi, '');
				$('#phone').attr('type', 'number');
				$('#phone').attr('value', phone)
			}
		})
	}
	// 플사변경
	if (rdata['profile']) {
		var photoSrc = 'http://ztalk.gaeyou.com/upload/profile/'+rdata['profile'];
		$('#photo').attr('src', photoSrc);
	}
	
	$('#profile').on('click', function(){
		$('#profile .description').html('<i class="fa fa-circle-o-notch fa-spin"></i>')
		if (_oc.getPhoto('ztalk_image_upload', 'cbImageUpload')) {
			// 네이티브 화면
			//$('#groupPhoto').css('display', 'block');
		} else {
			// 웹용 화면
			var str = '';
			str += '<div class="modal-dialog">';
			str += '	<div class="modal-content">';
			str += '		<div class="modal-header">';
			str += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
			str += '			<h4 class="modal-title" id="modalLabel">사진을 선택하세요.</h4>';
			str += '		</div>';
			str += '		<div class="modal-body" id="modalContent">';
			
			str += '<div class="form-group group-movie-input">';
			str += '	<input type="file" class="form-control" name="inputFile" id="inputFile" placeholder="">';
			str += '</div>';
			
			str += '</div>';
			str += '		<div class="modal-footer">';
			str += '			<button type="button" class="btn btn-default" id="btnCloseModal">닫기</button>';
			str += '		</div>';
			str += '	</div>';
			str += '</div>';
			
			$('#modal').modal('show');
			$('#groupPhoto').css('display', 'block');
			$('#modal').html(str);
			
			// 파일 업로드
			$('#inputFile').on('change', function(){
				uploadListener();
			})
			$('#btnCloseModal').on('click', function(){
				if (uploadImage.length == 0) {
					$('#groupPhoto').css('display', 'none');
				}
				hideModal();
			})
		};
	}).on('touchstart', function(){})
	
	// 저장
	$('#btnSave').on('click', function(){
		var nickname = $('#nickname').val()
			,phoneNumber = $('#phone').val()
			,isPhone = !!$('#phone').length
			
		if (nickname == '' || nickname == '대화명입력' || nickname == 'nick name') {
			//_oc.toast('이름을 입력해주세요.');
			_oc.toast( i18n.t("message.enterNickname") );
			return false;
		}
		if (isPhone) {
			if (phoneNumber == '폰번호' || phoneNumber == '') {
				//_oc.toast('핸드폰 번호를 입력해주세요.');
				_oc.toast( i18n.t("message.enterNumber") );
				return false;
			}
			if (phoneNumber.length < 10) {
				//_oc.toast('핸드폰 번호가 잘못되었습니다.');
				_oc.toast( i18n.t("message.wrongNumber") );
				return false;
			}
			if (phoneNumber.substr(0, 2) != '01') {
				//_oc.toast('핸드폰 번호가 잘못되었습니다.');
				_oc.toast( i18n.t("message.wrongNumber") );
				return false;
			}
			if (isNaN(phoneNumber)) {
				//_oc.toast('핸드폰 번호가 잘못되었습니다.');
				_oc.toast( i18n.t("message.wrongNumber") );
				return false;
			}
		}
		$('#btnSave').html('<i class="fa fa-circle-o-notch fa-spin"></i>');
		//_oc.toast('잠시만 기다려주세요\n새로운 친구를 찾고있습니다.');
		_oc.toast( i18n.t("message.checkFriends") );
		
		setTimeout(function(){
			var data = {}
			
			data['user_idx'] = getSetting('user_idx')
			data['nickname'] = nickname
			data['profile'] = photoUrl
			if (isPhone) {
				data['phoneNumber'] = phoneNumber
			}
			_oc.log("nickname: "+nickname)
			_oc.sendPost('ztalk_member_update', data, 'cbPostMemberUpdate');
		}, 100)
	}).on('touchstart', function(){})
}

// 저장 콜백
function cbPostMemberUpdate(result) {
	var rdata = result['data']
	_oc.log('user_name: ' + rdata['user_name'])
	setSetting('user_name', rdata['user_name'])
	setSetting('user_profile', rdata['user_profile'])
	_oc.log('ok: '+getSetting('user_name'))
	setTimeout(function(){
		_oc.getContact(getSetting('user_idx'), "cbContact");
	}, 10)
}

// 프로필 콜백
var photoUrl = ''
function cbImageUpload(result) {
	//$('#profile .description').html('완료')
	$('#profile .description').html( i18n.t("message.complete") )
	photoUrl = result['photo_url']
	var photoSrc = 'http://ztalk.gaeyou.com/upload/profile/'+photoUrl;
	$('#photo').attr('src', photoSrc);
}

// 연락처 콜백
function cbContact(jsonText) {
	if (getParam('flag') == 'main') {
		_oc.back();
	} else {
		_oc.link('../talk/friend.html', '', 'CLEAR_TOP', 'DEFAULT')
	}
}

function cbGetPhotoCancel() {
	// 사진선택 취소
	//$('#profile .description').html('플사');
	$('#profile .description').html( i18n.t("message.profile") );
}





















