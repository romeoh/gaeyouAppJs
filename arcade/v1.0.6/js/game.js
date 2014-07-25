var  store = 'https://play.google.com/store/apps/details?id=com.gaeyou.arcade'

function onReady() {
	/* 인기게임 */
	if ($('#List').length > 0) {
		initEvent();
		initList();
	}
	
	/* 새로운게임 */
	if ($('#newGame').length > 0) {
		initEvent();
		initNew();
	}
	
	/* 보기 */
	if ($('#view').length > 0) {
		initEvent();
		initView();
	}
}

// 이벤트
function initEvent() {
	// 테스트
	$('#btnTest').on('click', function(){
		var param = ''
		//_oc.link('http://peacekeeper.futuremark.com/run.action', param, 'DEFAULT', 'DEFAULT');
		//_oc.link('http://www.speed-battle.com/index.php', param, 'DEFAULT', 'DEFAULT');
		var  img = 'http://auth-83051f68-ec6c-44e0-afe5-bd8902acff57.cdn.spilcloud.com/10/1401104360_300x135.png'
			,text = '오락실 안녕'
		_oc.kakao.story.post.image(img, text, 'cbKakaoStory');
		//_oc.kakao.story.post.note(text);
	})
	
	// 인기게임
	$('#tabList').on('click', function(){
		var param = ''
		_oc.link('../game/list.html', param, 'CLEAR_TOP', 'DEFAULT');
	})
	
	// 새로운게임
	$('#tabNew').on('click', function(){
		var param = ''
		_oc.link('../game/new.html', param, 'CLEAR_TOP', 'DEFAULT');
	})
	
	// 공유
	$('#btnShare').on('click', function(){
		var msg = '[오락실]\n재미있는 게임들이 매일 매일 업데이트 됩니다.\n' + store
		_oc.share(msg);
	})
	
	// 판넬 열기
	$('#btnPanel').on('click', function(){
		var isOpen = $('#panel').attr('data-open')
		
		if (isOpen == '0') {
			showPanel()
		} else {
			hidePanel()
		}
	})
	
	$('#panelBg').on('click', function(){
		hidePanel()
	})
	
	// 친구에게 알려주기
	$('#panelShare').on('click', function(){
		var msg = '[오락실]\n재미있는 게임들이 매일 매일 업데이트 됩니다.\n' + store
		_oc.share(msg);
	})
	
	$('#panelFBPage').on('click', function(){
		_oc.uri.facebook('357555101043476');
	})
}

// 인기게임 리스트 불러오기
var  listStart = 0
	,listTotal = 15
function initList() {
	var data = {}
	
	data['flag'] = 'popular';
	data['user_idx'] = getSetting('user_idx');
	data['start'] = listStart
	data['total'] = listTotal
	
	_oc.sendPost('arcade_content_list', data, 'cbPostYeyakContentList');
}

function cbPostYeyakContentList(result) {
	if (result['result'] == 'success') {
		var  rdata = result['data']
			,str = ''
		
		console.log(rdata)
		if (getSetting('user_name') == '') {
			setSetting('user_name', rdata[0]['user_name'])
		}
		$('#loading').css('display', 'none');
		//$('#panelCoin').html('<i class="fa fa-bank"></i> 보유코인: ' + rdata[0]['coin'])
		if (rdata.length == 0) {
			console.log('없음');
			console.log(rdata)
		} else {
			listStart = listStart + listTotal;
			
			for (var i in rdata) {
				//console.log(rdata[i])
				str += '<dd>';
				str += '<ul>';
				str += '<li data-idx="' + rdata[i]['idx'] + '" data-mode="' + rdata[i]['mode'] + '" data-url="' + rdata[i]['game_url'] + '">';
				str += '	<div class="thum_large">';
				str += '		<img src="' + rdata[i]['thum_large'] + '">';
				str += '	</div>';
				
				str += '	<div class="title">' + rdata[i]['title'] + '</div>';
				str += '	<div class="text">' + rdata[i]['text'] + '</div>';
				
				str += '	<div class="share-box">';
				str += '		<i class="fa fa-gamepad"></i> ' + rdata[i]['view'];
				str += '		<i class="fa fa-comment"></i> ' + rdata[i]['reply'];
				str += '		<i class="fa fa-thumbs-up"></i> ' + rdata[i]['good'];
				str += '		<i class="fa fa-thumbs-down"></i> ' + rdata[i]['bad'];
				str += '	</div>';
				str += '</li>';
				
				str += '</ul>';
				str += '</dd>';
			}
			if (rdata.length >= listTotal) {
				str += '<dd id="btnMore">';
				str += '	<div><button class="btn btn-warning btn-block">더보기</button></div>';
				str += '</dd>';
			}
			$('#ddayList').append(str);
			
			$('#btnMore').on('click', function(){
				$(this).remove();
				initList();
			})
			
			$('[data-idx]').on('click', function(){
				var  idx = $(this).attr('data-idx')
					,param = 'idx='+idx
				_oc.link('../game/view.html', param, 'DEFAULT', 'DEFAULT');
			})
		}
	}
}


// 새로운게임 불러오기
function initNew() {
	var data = {}
	
	data['user_idx'] = getSetting('user_idx');
	data['start'] = listStart
	data['total'] = listTotal
	data['flag'] = 'new';
	//console.log(data)
	_oc.sendPost('arcade_content_list', data, 'cbPostYeyakContentTimeline');
}

function cbPostYeyakContentTimeline(result) {
	console.log(result)
	if (result['result'] == 'success') {
		var  rdata = result['data']
			,str = ''
			
		$('#loading').css('display', 'none');
		//$('#panelCoin').html('<i class="fa fa-bank"></i> 보유코인: ' + rdata[0]['coin'])
		
		if (rdata.length == 0) {
			console.log('없음');
			console.log(rdata)
		} else {
			listStart = listStart + listTotal;
			
			for (var i in rdata) {
				//console.log(rdata[i])
				str += '<dd>';
				str += '<ul>';
				str += '<li data-idx="' + rdata[i]['idx'] + '" data-mode="' + rdata[i]['mode'] + '" data-url="' + rdata[i]['game_url'] + '">';
				str += '	<div class="thum_large">';
				str += '		<img src="' + rdata[i]['thum_large'] + '">';
				str += '	</div>';
				
				str += '	<div class="title">' + rdata[i]['title'] + '</div>';
				str += '	<div class="text">' + rdata[i]['text'] + '</div>';
				
				str += '	<div class="share-box">';
				str += '		<i class="fa fa-gamepad"></i> ' + rdata[i]['view'];
				str += '		<i class="fa fa-comment"></i> ' + rdata[i]['reply'];
				str += '		<i class="fa fa-thumbs-up"></i> ' + rdata[i]['good'];
				str += '		<i class="fa fa-thumbs-down"></i> ' + rdata[i]['bad'];
				str += '	</div>';
				str += '</li>';
				
				str += '</ul>';
				str += '</dd>';
			}
			if (rdata.length >= listTotal) {
				str += '<dd id="btnMore">';
				str += '	<div><button class="btn btn-warning btn-block">더보기</button></div>';
				str += '</dd>';
			}
			$('#ddayList').append(str);
			
			$('#btnMore').on('click', function(){
				$(this).remove();
				initNew();
			})
			
			$('[data-idx]').on('click', function(){
				var  idx = $(this).attr('data-idx')
					,param = 'idx='+idx
				_oc.link('../game/view.html', param, 'DEFAULT', 'DEFAULT');
			})
		}
	}
}

/* 보기 */
function initView() {
	var  idx = getParam('idx')
		,data = {}
	data['content_idx'] = idx
	data['user_idx'] = getSetting('user_idx')
	
	_oc.sendPost('arcade_content_view', data, 'cbPostYeyakContentView');
}


// 퍼가기
function cbPostYeyakMemberAccountGet(result) {
	if (result['result'] == 'success') {
		var  rdata = result['data']
		//console.log(rdata)
		if ( confirm('"' + rdata['story_nickname'] + '"님의 계정에 바로 등록할까요?') ) {
			var data = {}
				,imgs = ''
			
			if (viewData['images'].length > 0) {
				for (var i in viewData['images']) {
					if (i != 0) {
						imgs += ',';
					}
					imgs += viewData['images'][i]['image'];
				}
			}
			data['content_idx'] = getParam('idx')
			data['user_idx'] = getSetting('user_idx')
			data['account_idx'] = getSetting('account_idx')
			data['type'] = viewData['type']
			data['description'] = viewData['description']
			data['permission'] = viewData['permission']
			data['image'] = imgs
			data['url'] = viewData['url']
			data['reservation_date'] = moment().format('YYYY-MM-DD HH:mm')
			data['user_agent'] = window.navigator.userAgent
			data['platform'] = platform
			_oc.sendPost('yeyak_reservation', data, 'cbPostYeyakContentInsert');
		}
	}
}

// 퍼가기 등록
function cbPostYeyakContentInsert(result) {
	if (result['result'] == 'success') {
		var param = 'uniq=' + result['content_idx'] + "&flag=view2action"
		//_oc.log("uniq: "+result['content_idx']);
		_oc.link('../service/action.html', param, 'DEFAULT', 'DEFAULT');
	}
}

// 게임보기
var  replyStart = 0
	,replyTotal = 10
	,reload = false
	,viewData
function cbPostYeyakContentView(result) {
	if (result['result'] == 'success') {
		var  rdata = result['data']
			,str = ''
		
		viewData = rdata;	
		//console.log(rdata)
		$('#thum').attr('src', rdata['thum_large'])
		$('#channelTitle').html(rdata['title'])
		$('#description').html(rdata['text'])
		
		$('#play').on('click', function(){
			var data = {}
			data['content_idx'] = getParam('idx')
			data['user_idx'] = getSetting('user_idx')
	
			_oc.sendPost('arcade_play_v2', data, 'cbPostPlay');
		})
		$('#btnGaeup')
			.html('<i class="fa fa-thumbs-up"></i> 깨업 (' + rdata['good'] + ')')
			.on('click', function(){
				var data = {}
				data['content_idx'] = getParam('idx')
				data['user_idx'] = getSetting('user_idx')
				data['flag'] = 'UP'
		
				_oc.sendPost('arcade_like_v3', data, 'cbPostUpdown');		
			})
		$('#btnGaedown')
			.html('<i class="fa fa-thumbs-down"></i> 깨따 (' + rdata['bad'] + ')')
			.on('click', function(){
				var data = {}
				data['content_idx'] = getParam('idx')
				data['user_idx'] = getSetting('user_idx')
				data['flag'] = 'DOWN'
		
				_oc.sendPost('arcade_like_v3', data, 'cbPostUpdown');
			})
		
		// 댓글 가져오기
		initReplyAdd();
		getReplyList();
	}
}

// play
function cbPostPlay (result) {
	var param = ''
	_oc.game(viewData['game_url'], param, 'DEFAULT', viewData['mode']);
}


function cbPostUpdown(result) {
	if (result['result'] == 'fail') {
		_oc.toast('이미 평가하셨습니다.');
	} else {
		var rdata = result['data']
		if (rdata['flag'] == 'UP') {
			var score = parseInt(viewData['good'], 10) + parseInt(1, 10)
			$('#btnGaeup').html('<i class="fa fa-thumbs-up"></i> 깨업 (' + score + ')')
			_oc.toast('깨업하셨습니다. 감사합니다^^');
		} else if (rdata['flag'] == 'DOWN') {
			var score = parseInt(viewData['bad'], 10) + parseInt(1, 10)
			$('#btnGaedown').html('<i class="fa fa-thumbs-down"></i> 깨따 (' + score + ')')
			_oc.toast('깨따하셨습니다. 열심히 하겠습니다.ㅠ');
		}
	}
}











