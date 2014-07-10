var  store = 'https://play.google.com/store/apps/details?id=com.gaeyou.yeyak'

function onReady() {
	/* 예약한 이야기 */
	if ($('#List').length > 0) {
		if (getParam('account_idx')) {
			setSetting('account_idx', getParam('account_idx'));
		}
		initEvent();
		initList();
	}
	
	/* 모두의 이야기 */
	if ($('#timeline').length > 0) {
		initEvent();
		initTimeline();
	}
	
	/* 예약하기 */
	if ($('#upload').length > 0) {
		initEvent();
		initReservation();
	}
	
	/* 보기 */
	if ($('#view').length > 0) {
		initEvent();
		initView();
	}
}

// 이벤트
function initEvent() {
	
	// 새로올리기
	$('#btnNew').on('click', function(){
		var param = ''
		_oc.link('../yeyak/upload.html', param, 'DEFAULT', 'DEFAULT');
	})
	
	/* 연결해제 */
	$('#panelLogout').on('click', function(){
		var  param = ''
			,data = {}
		
		data['user_idx'] = getSetting('user_idx');
		
		sendReservation('yeyak_member_logout', data, 'cbPostYeyakMemberLogout');
		//M.storage(settingId, '{}');
		//_oc.link('../index.html', param, 'DEFAULT', 'DEFAULT');
	})
	
	// 예약한 리스트
	$('#tabList').on('click', function(){
		var param = ''
		_oc.link('../yeyak/list.html', param, 'CLEAR_TOP', 'DEFAULT');
	})
	// 모두의 이야기
	$('#tabTimeline').on('click', function(){
		var param = ''
		_oc.link('../yeyak/timeline.html', param, 'CLEAR_TOP', 'DEFAULT');
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
	
	// 계정관리
	$('#panelAccount').on('click', function(){
		_oc.link('../oauth/account.html')
	})
	
	$('#panelShare').on('click', function(){
		var msg = '[카스미리쓰기]\n카카오스토리에 글쓰기를 예약할 수 있어요.\n-다중계정관리\n' + store
		_oc.share(msg);
	})
	$('#panelFBPage').on('click', function(){
		_oc.uri.facebook('357555101043476');
	})
}

// 로그아웃
function cbPostYeyakMemberLogout() {
	console.log(result)
	if (result['result'] == 'success') {
		var  rdata = result['data']
		//M.storage(settingId, '{}');
		_oc.toast('로그아웃 되었습니다.');
	}
}


// 리스트 불러오기
var  listStart = 0
	,listTotal = 15
function initList() {
	var data = {}
	
	data['user_idx'] = getSetting('user_idx') || '';
	//data['account_idx'] = getSetting('user_idx') || '';
	data['start'] = listStart
	data['total'] = listTotal
	
	_oc.sendPost('yeyak_content_list', data, 'cbPostYeyakContentList');
}

function cbPostYeyakContentList(result) {
	//console.log(result)
	if (result['result'] == 'success') {
		var  rdata = result['data']
			,str = ''
			
		$('#loading').css('display', 'none');
		
		if (rdata.length == 0) {
			console.log('없음');
			console.log(rdata)
		} else {
			listStart = listStart + listTotal;
			
			$('#count').html(rdata.length)
			for (var i in rdata) {
				console.log(rdata[i])
				var  dateFormat = 'YYYY-MM-DD HH:mm:SS'
					,date = moment(rdata[i]['reservation_date'], dateFormat).format('MM.DD')
					,time = moment(rdata[i]['reservation_date'], dateFormat).lang('ko').format('A h:mm')
					,condition = ''
				
				if (rdata[i]['was_action'] == '1') {
					condition = '<span class="reservation-complete"><i class="fa fa-check-circle-o"></i> 등록완료</span>'
				} else if (rdata[i]['reservation_cancel'] == '1') {
					condition = '<span class="reservation-cancel"><i class="fa fa-ban"></i> 예약취소</span>'
				} else {
					condition = '<span class="reservation"><i class="fa fa-clock-o"></i> 예약됨</span>'
				}
				
				str += '<dd>';
				str += '<ul>';
				str += '<li data-idx="' + rdata[i]['idx'] + '">';
				str += '	<div class="thumnail">';
				str += '		<div class="profile">';
				str += '			<img src="' + rdata[i]['story_profile'] + '">';
				str += '		</div> ';
				str += '		<div class="story-nickname">' + decode(rdata[i]['story_nickname']) + '</div>';
				str += '		<div class="story-date">' + date + ' ' + time + '</div>';
				str += '		<div class="favorite">' + condition + '</div>';
				str += '	</div>';
				//str += '	<div class="date"><strong>' + date + '</strong> ' + time + ' ' + condition + '</div>';
				str += '	<div class="description">' + rdata[i]['description'] + '</div>';
				if (rdata[i]['type'] == '2') {
					str += '	<div class="content-image">';
					if (rdata[i]['images'][0]['image'].split('.')[1] == 'gif') {
						str += '		<p class="icon-play" data-play="' + rdata[i]['idx'] + '"><i class="fa fa-play-circle-o"></i></p>';
						str += '		<p class="icon-gif" data-icon="' + rdata[i]['idx'] + '"><i class="fa fa-video-camera"></i> GIF 움짤</p>';
					}
					str += '		<img data-gif="' + rdata[i]['idx'] + '" src="http://yeyak.gaeyou.com/upload/small/' + rdata[i]['images'][0]['image'] + '">';
					str += '	</div>';
				}
				str += '	<div class="share-box">';
				//str += '		<i class="fa fa-heart"></i> ' + rdata[i]['heart'];
				str += '		<i class="fa fa-comment"></i> ' + rdata[i]['comments'];
				str += '		<i class="fa fa-share-alt"></i> ' + rdata[i]['share'];
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
			
			// gif play
			$('[data-play]').on('click', function(){
				var idx = $(this).attr('data-play')
					movieUrl = $('[data-gif="' + idx + '"]').attr('src').replace('\/small\/', '\/content\/')
				$('[data-play="' + idx + '"]').remove()
				$('[data-icon="' + idx + '"]').remove()
				$('[data-gif="' + idx + '"]').attr('src', movieUrl);
				return false;
			})
			
			$('[data-idx]').on('click', function(){
				var  idx = $(this).attr('data-idx')
					,param = 'idx=' + idx
				_oc.link('../yeyak/view.html', param, 'DEFAULT', 'DEFAULT');
			})
		}
	}
}


// 타임라인 불러오기
function initTimeline() {
	var data = {}
	
	//data['user_idx'] = getSetting('user_idx') || '';
	data['start'] = listStart
	data['total'] = listTotal
	data['permission'] = 'A';
	
	_oc.sendPost('yeyak_content_list', data, 'cbPostYeyakContentTimeline');
}

function cbPostYeyakContentTimeline(result) {
	//console.log(result)
	if (result['result'] == 'success') {
		var  rdata = result['data']
			,str = ''
			
		$('#loading').css('display', 'none');
		
		if (rdata.length == 0) {
			console.log('없음');
			console.log(rdata)
		} else {
			listStart = listStart + listTotal;
			
			$('#count').html(rdata.length)
			for (var i in rdata) {
				console.log(rdata[i])
				var  dateFormat = 'YYYY-MM-DD HH:mm:SS'
					,date = moment(rdata[i]['reservation_date'], dateFormat).format('MM.DD')
					,time = moment(rdata[i]['reservation_date'], dateFormat).lang('ko').format('A h:mm')
					,condition = ''
				
				str += '<dd>';
				str += '<ul>';
				str += '<li data-idx="' + rdata[i]['idx'] + '">';
				str += '	<div class="thumnail">';
				str += '		<div class="profile">';
				str += '			<img src="' + rdata[i]['story_profile'] + '">';
				str += '		</div> ';
				str += '		<div class="story-nickname">' + decode(rdata[i]['story_nickname']) + '</div>';
				str += '		<div class="story-date">' + date + ' ' + time + '</div>';
				str += '	</div>';
				//str += '	<div class="date"><strong>' + date + '</strong> ' + time + ' ' + condition + '</div>';
				str += '	<div class="description">' + rdata[i]['description'] + '</div>';
				if (rdata[i]['type'] == '2') {
					str += '	<div class="content-image">';
					if (rdata[i]['images'][0]['image'].split('.')[1] == 'gif') {
						str += '		<p class="icon-play" data-play="' + rdata[i]['idx'] + '"><i class="fa fa-play-circle-o"></i></p>';
						str += '		<p class="icon-gif" data-icon="' + rdata[i]['idx'] + '"><i class="fa fa-video-camera"></i> GIF 움짤</p>';
					}
					str += '		<img data-gif="' + rdata[i]['idx'] + '" src="http://yeyak.gaeyou.com/upload/small/' + rdata[i]['images'][0]['image'] + '">';
					str += '	</div>';
				}
				str += '	<div class="share-box">';
				//str += '		<i class="fa fa-heart"></i> ' + rdata[i]['heart'];
				str += '		<i class="fa fa-comment"></i> ' + rdata[i]['comments'];
				str += '		<i class="fa fa-share-alt"></i> ' + rdata[i]['share'];
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
			
			// gif play
			$('[data-play]').on('click', function(){
				var idx = $(this).attr('data-play')
					movieUrl = $('[data-gif="' + idx + '"]').attr('src').replace('\/small\/', '\/content\/')
				$('[data-play="' + idx + '"]').remove()
				$('[data-icon="' + idx + '"]').remove()
				$('[data-gif="' + idx + '"]').attr('src', movieUrl);
				return false;
			})
			
			$('[data-idx]').on('click', function(){
				var  idx = $(this).attr('data-idx')
					,param = 'idx=' + idx
				_oc.link('../yeyak/view.html', param, 'DEFAULT', 'DEFAULT');
			})
		}
	}
}

/* 보기 */
function initView() {
	// 우측 버튼
	$('#btnModify').on('click', function(){
		var  title = ''
			,items
			,init = ''
			,callback = 'cbModifyList'
		
		// 등록완료 상태
		if (viewData['was_action'] == '1') {
			items = '카스에서보기,수정,삭제'
		
		// 예약취소 상태
		} else if (viewData['reservation_cancel'] == '1') {
			items = '다시예약,수정,삭제'
		
		// 예약됨
		} else if (viewData['reservation_cancel'] == '0') {
			items = '예약취소,수정,삭제'
		}
		_oc.list(title, items, init, callback)
	})
	// 카스에 퍼가기
	$('#btnShare').on('click', function(){
		//var param = 'idx=' + getParam('idx')
		//_oc.link('../service/action.html', param, 'DEFAULT', 'DEFAULT');
		//_oc.link('../service/share.html', param, 'DEFAULT', 'DEFAULT');
		
		var data = {}
		data['account_idx'] = getSetting('account_idx')
		
		_oc.sendPost('yeyak_member_account_get', data, 'cbPostYeyakMemberAccountGet');
	})
	
	var  idx = getParam('idx')
		,data = {}
	data['content_idx'] = idx
	data['user_idx'] = getSetting('user_idx')
	
	_oc.sendPost('yeyak_content_view', data, 'cbPostYeyakContentView');
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
			data['reservation_date'] = moment().format('YYYY-MM-DD HH:mm:SS')
			data['user_agent'] = window.navigator.userAgent
			data['platform'] = platform
			//console.log(data)
			_oc.sendPost('yeyak_reservation', data, 'cbPostYeyakContentInsert');
		}
	}
}

// 퍼가기 등록
function cbPostYeyakContentInsert(result) {
	if (result['result'] == 'success') {
		var param = 'uniq=' + result['content_idx']
		_oc.link('../service/action.html', param, 'DEFAULT', 'DEFAULT');
	}
}


function cbModifyList(idx) {
	if (idx == '0') {
		// 등록완료 상태: 카스에서보기
		if (viewData['was_action'] == '1') {
			
		// 예약취소 상태: 다시예약
		} else if (viewData['reservation_cancel'] == '1') {
			var data = {}
			data['content_idx'] = getParam('idx')
			data['user_idx'] = getSetting('user_idx')
	
			_oc.sendPost('yeyak_content_rereservation', data, 'cbPostYeyakContentRereservation');
		// 예약됨:예약취소하기
		} else if (viewData['reservation_cancel'] == '0') {
			var data = {}
			data['content_idx'] = getParam('idx')
			data['user_idx'] = getSetting('user_idx')
	
			_oc.sendPost('yeyak_content_cancel_reservation', data, 'cbPostYeyakContentCancelReservation');
		}
	} else if (idx == '1') {
		// 수정
		var param = 'idx=' + getParam('idx')
		_oc.link('../yeyak/upload.html', param, 'DEFAULT', 'DEFAULT');
	} else if (idx == '2') {
		// 삭제
		var data = {}
		data['content_idx'] = getParam('idx')
		data['user_idx'] = getSetting('user_idx')

		_oc.sendPost('yeyak_content_delete_reservation', data, 'cbPostYeyakContentDeleteReservation');
	}
	
}

function cbPostYeyakContentRereservation(result) {
	time = getReservationTime(viewData['reservation_date']);
	if (time < 0) {
		_oc.toast('바로 등록되었습니다.');
	} else {
		_oc.toast('다시 예약 되었습니다.');
	}
	time = Math.abs(time);
	_oc.alarm.set(getParam('idx'), time);
	window.location.reload();
}

function cbPostYeyakContentCancelReservation() {
	_oc.toast('예약취소 되었습니다.');
	_oc.alarm.cancel(getParam('idx'));
	window.location.reload();
}

function cbPostYeyakContentDeleteReservation() {
	_oc.toast('삭제되었습니다.');
	_oc.alarm.cancel(getParam('idx'));
	_oc.back();
}


var  replyStart = 0
	,replyTotal = 10
	,reload = false
	,viewData
function cbPostYeyakContentView(result) {
	if (result['result'] == 'success') {
		var  rdata = result['data']
			,reservationDate = moment(rdata['reservation_date'], 'YYYY-MM-DD HH:mm:SS').lang('ko').format('YYYY.MM.DD A HH:mm')
			,condition = ''
		console.log(rdata)
		if (rdata['user_idx'] != getSetting('user_idx')) {
			$('#btnModify').css('display', 'none');
			$('#condition').css('display', 'none');
		}
		viewData = rdata;
		$('#profile').attr('src', rdata['story_profile'])
		$('#storyName').html(decode(rdata['story_nickname']))
		$('#reservationDate').html(reservationDate)
		if (rdata['was_action'] == '1') {
			condition = '<span class="reservation-complete"><i class="fa fa-check-circle-o"></i> 등록완료</span>'
		} else if (rdata['reservation_cancel'] == '1') {
			condition = '<span class="reservation-cancel"><i class="fa fa-ban"></i> 예약취소</span>'
		} else {
			condition = '<span class="reservation"><i class="fa fa-clock-o"></i> 예약됨</span>'
		}
		$('#condition').html(condition)
		$('#description').html(rdata['description'])
		
		if (rdata['type'] == '2') {
			var  images = rdata['images']
				,str = '';
			for (var i in images) {
				str += '<img src="http://yeyak.gaeyou.com/upload/content/' + images[i]['image'] + '">';
			}
			$('#imgBox').html(str)
		}
		
		// 댓글 가져오기
		initReplyAdd();
		getReplyList();
	}
}


/* 예약하기 */
var  type = '1'
	,permission = 'A'
	,uploadImage = []
function initReservation() {
	var  date = moment().add(1, 'h').format('YYYY-MM-DD')
		,dateString = moment().add(1, 'h').lang('ko').format('YYYY년 M월 D일 (dd)')
		,time = moment().add(1, 'h').format('HH:mm')
		,timeString = moment().add(1, 'h').lang('ko').format('A h시 mm분')
	
	var data = {}
	data['account_idx'] = getSetting('account_idx')
	data['user_idx'] = getSetting('user_idx')
	
	_oc.sendPost('yeyak_member_account_get', data, 'cbPostYeyakMemberAccountGetInfo');
	
	if (getParam('idx')) {
		// 수정
		var  idx = getParam('idx')
			,data = {}
		data['content_idx'] = idx
		data['user_idx'] = getSetting('user_idx')
		
		_oc.sendPost('yeyak_content_view', data, 'cbPostYeyakContentModify');
	}
	
	
	// 날짜
	$('#inputDate')
		.attr('data-value', date)
		.html(dateString)
		.on('click', function(){
			var initDate = $('#inputDate').attr('data-value')
			_oc.datepicker('cbDate', initDate);
		})
	
	// 시간
	$('#inputTime')
		.attr('data-value', time)
		.html(timeString)
		.on('click', function(){
			var initTime = $('#inputTime').attr('data-value')
			_oc.timepicker('cbTime', initTime)
		})
	
	// 매직봉
	$('#btnMagic').on('click', function(){
		timeMagic();
	})
	
	// 전체공개
	$('#btnPublic').on('click', function(){
		$('#btnPublic').css('display', 'none')
		$('#btnFriend').css('display', 'inline-block')
		permission = 'F'
	})
	
	// 친구공개
	$('#btnFriend').on('click', function(){
		$('#btnPublic').css('display', 'inline-block')
		$('#btnFriend').css('display', 'none')
		permission = 'A'
	})
	
	// 사진첨부
	$('#btnPhoto').on('click', function(){
		viewBackdrop();
		attachPhoto();
	})
	
	// 링크
	$('#btnLink').on('click', function(){
		addLink();
	})
	
	// 링크삭제
	$('#btnDelLink').on('click', function(){
		$('#groupLink').css('display', 'none');
		$('#link').html('');
		type = '1';
	})
	
	// 예약하기
	$('#btnReservation').on('click', function(){
		reservationListener();
	})
}

var accountInfo = {}
function cbPostYeyakMemberAccountGetInfo(result) {
	if (result['result'] == 'success') {
		accountInfo = result['data']
	}
}

function viewBackdrop() {
	var str = ''
	str += '<div class="modal-dialog">';
	str += '	<div class="modal-content">';
	str += '		<div class="progress-spin"><i class="fa fa-spinner fa-spin"></i> 이미지 업로드 준비 중입니다.</div>';
	str += '	</div>';
	str += '</div>';
	$('#modal').html(str);
	$('#modal').modal({
		backdrop: 'static',
		keyboard: false
	});
}
function hideBackdrop() {
	$('#modal').html('');
	$('#modal').modal('hide');
}

// 수정모드
function cbPostYeyakContentModify(result) {
	if (result['result']) {
		var rdata = result['data']
			,timeFormat = 'YYYY-MM-DD HH:mm:SS'
			,reservationDate = rdata['reservation_date']
			,date = moment(reservationDate, timeFormat).format('YYYY-MM-DD')
			,dateString = moment(reservationDate, timeFormat).lang('ko').format('YYYY년 M월 D일 (dd)')
			,time = moment(reservationDate, timeFormat).format('HH:mm')
			,timeString = moment(reservationDate, timeFormat).lang('ko').format('A h시 m분')
			
		$('#inputDescription').html(rdata['description']);
		$('#inputDate')
			.attr('data-value', date)
			.html(dateString)
		$('#inputTime')
			.attr('data-value', time)
			.html(timeString)
		
		if (rdata['type'] == '2') {
			// 사진
			var  images = rdata['images']
				,str = ''
			
			for (var i in images) {
				var n = parseInt(i, 10) + parseInt(1, 10)
				
				str += '	<li>';
				str += '		<p class="times" data-del="' + n + '"><i class="fa fa-times fa-2x"></i></p>';
				str += '		<img src="http://yeyak.gaeyou.com/upload/small/' + images[i]['image'] + '" data-url="' + images[i]['image'] + '" data-image="' + n + '">';
				if (images[i]['image'].split('.')[1] == 'gif') {
					str += '		<p class="icon-gif"><i class="fa fa-video-camera"></i> GIF 움짤</p>';
				}
				str += '	</li>';
				
				uploadImage.push(images[i]['image']);
			}
			
			$('#groupPhoto').css('display', 'block')
			$('#uploadImg').html(str);
			
			// 이미지 삭제
			$('[data-del]').on('click', function(){
				var idx = $(this).attr('data-del')
				removeByIndex(uploadImage, (idx-1));
				$('[data-image="' + idx + '"]').remove();
				$('[data-del="' + idx + '"]').remove();
				if (uploadImage.length == 0) {
					type = '1';
				}
			})
			type = '2';
		} else if(rdata['type'] == '3') {
			// 주소
			$('#groupLink').css('display', 'block')
			$('#link').html(rdata['url'])
			type = '3';
		}
	}
}

// 사진 첨부
function attachPhoto() {
	if (_oc.getPhoto('yeyak_image_upload', 'cbYeyakImageUpload')) {
		// 네이티브 화면
		$('#groupPhoto').css('display', 'block');
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
}

// 사진 콜백
function cbGetPhoto() {
	alert('cbGetPhoto')
}

// 웹용 파일 업로드
function uploadListener() {
	var  filename = $('#inputFile').val().split('.')
		,extend = filename[filename.length-1].toLowerCase()
		,str = ''
		
	if (extend == 'jpg' || 
		extend == 'jpeg' || 
		extend == 'png' || 
		extend == 'gif' || 
		extend == 'octet-stream') {
			_oc.upload('yeyak_image_upload', 'inputFile', 'cbYeyakImageUpload');
	} else {
		alert('지원하지 않는 포맷입니다.');
	}
}

function cbYeyakImageUpload(result) {
_oc.log(result)
	var rdata = result;
	if (rdata['result']) {
		if (rdata['result'] == 'error1') {
			_oc.toast('gif는 3MB를 초과할수 없습니다.')
		} else if(rdata['result'] == 'error2') {
			_oc.toast('5MB를 초과할수 없습니다.')
		}
		hideBackdrop();
		return false;
	} else {
		var  file = rdata['photo_url']
			,extension = file.split('.')[1]
		hideBackdrop();
		
		try{
			lastImageExtension = uploadImage[uploadImage.length-1].split('.')[1]
		}catch(e){
			lastImageExtension = '';
		}
		
		if(extension == 'gif') {
			if (uploadImage.length > 0) {
				_oc.toast('gif 파일은 1개만 업데이트 가능합니다.')
			}
			$('#uploadImg').html('');
			uploadImage.length = 0;
		} else if (extension != 'gif' && lastImageExtension == 'gif') {
			if (uploadImage.length > 0) {
				_oc.toast('gif 파일은 1개만 업데이트 가능합니다.')
			}
			$('#uploadImg').html('');
			uploadImage.length = 0;
		}
		
		uploadImage.push(file);
		img = 'http://yeyak.gaeyou.com/upload/small/' + rdata['photo_url']
		
		var str = '';
		str += '	<li>';
		str += '		<p class="times" data-del="' + uploadImage.length + '"><i class="fa fa-times fa-2x"></i></p>';
		str += '		<img src="' + img + '" alt="" data-url="' + file + '" data-image="' + uploadImage.length + '">';
		if (rdata['photo_url'].split('.')[1] == 'gif') {
			str += '		<p class="icon-gif"><i class="fa fa-video-camera"></i> GIF 움짤</p>';
		}
		str += '	</li>';
		
		$('#uploadImg').append(str);
		//$('#uploadImg').append('<img src="' + img + '" alt="" data-url="' + file + '" data-image="' + uploadImage.length + '"><p><button data-del="' + uploadImage.length + '" class="btn btn-default">사진 삭제</button></p>');
		type = '2';
		
		// 이미지 삭제
		$('[data-del="' + uploadImage.length + '"]').on('click', function(){
			var idx = $(this).attr('data-del')
			removeByIndex(uploadImage, (idx-1));
			$('[data-image="' + idx + '"]').remove();
			$('[data-del="' + idx + '"]').remove();
			if (uploadImage.length == 0) {
				type = '1';
			}
		})
		$('#modal1').modal('hide');
		
		// 링크삭제
		$('#link').html('');
		$('#groupLink').css('display', 'none');
	}
}

// 링크 추가
function addLink() {
	var str = '';
	str += '<div class="modal-dialog">';
	str += '	<div class="modal-content">';
	str += '		<div class="modal-header">';
	str += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
	str += '			<h4 class="modal-title" id="modalLabel">링크(URL) 추가</h4>';
	str += '		</div>';
	str += '		<div class="modal-body" id="modalContent">';
	
	str += '<div class="form-group group-movie-input">';
	str += '	<input type="text" class="form-control" id="inputUrl" placeholder="예) http://www.gaeyou.com" maxlength="50">';
	str += '</div>';

	str += '</div>';
	str += '		<div class="modal-footer">';
	str += '			<button type="button" class="btn btn-default" id="btnCloseModal">닫기</button>';
	str += '			<button type="button" class="btn btn-primary" id="btnOK">확인</button>';
	str += '		</div>';
	str += '	</div>';
	str += '</div>';
	
	$('#modal').modal('show');
	$('#modal').html(str);
	
	$('#btnCloseModal').on('click', function(){
		hideModal()
	})
	$('#btnOK').on('click', function(){
		var url = $('#inputUrl').val();
		if (validURL(url)) {
			$('#groupLink').css('display', 'block');
			$('#link').html(url);
			hideModal();
			type = '3';
			
			// 이미지 삭제
			uploadImage.length = 0;
			$('#uploadImg').html('');
			$('#groupPhoto').css('display', 'none');
		} else {
			_oc.toast('URL형식이 맞지 않습니다.');
		}
	})
}


// 날짜 콜백
function cbDate(y, m, d){
	var  dt = moment(y+'-'+m+'-'+d, 'YYYY-M-D')
		,date = dt.format('YYYY-MM-DD')
		,dateString = dt.lang('ko').format('YYYY년 M월 D일 (dd)')
	
	$('#inputDate')
		.attr('data-value', date)
		.html(dateString)
	validDate();
}

// 시간 콜백
function cbTime(h, m){
	var  dt = moment(h+':'+m, 'HH:mm')
		,time = dt.format('HH:mm')
		,timeString = dt.lang('ko').format('A h시 mm분')
	
	$('#inputTime')
		.attr('data-value', time)
		.html(timeString)
	validDate();
}

// 날짜 검증
function validDate() {
	var  d = $('#inputDate').attr('data-value')
		,t = $('#inputTime').attr('data-value')
		,isBefore = moment(d+' '+t, 'YYYY-MM-DD HH:mm').isBefore(moment())	
	
	if (isBefore) {
		_oc.toast('이전날짜에 예약할 수 없습니다.');
		var  date = moment().add(1, 'h').format('YYYY-MM-DD')
			,dateString = moment().add(1, 'h').lang('ko').format('YYYY년 M월 D일 (dd)')
			,time = moment().add(1, 'h').format('HH:mm')
			,timeString = moment().add(1, 'h').lang('ko').format('A h시 mm분')
		
		$('#inputDate')
			.attr('data-value', date)
			.html(dateString);
		$('#inputTime')
			.attr('data-value', time)
			.html(timeString);
	} else {
		var  setTime = moment(d+' '+t, 'YYYY-MM-DD HH:mm')
			,now = moment()
			,option = ''
		
		if (setTime.diff(now, 'year') > 0) {
			option = 'yy'
		} else if (setTime.diff(now, 'm') > 0) {
			option = 'mm'
		}
		//console.log(setTime.lang('ko').fromNow())
		$('#startString').html('('+setTime.lang('ko').fromNow()+')')
	}
}

// 매직봉
function timeMagic() {
	var str = '';
	str += '<div class="modal-dialog">';
	str += '	<div class="modal-content">';
	str += '		<div class="modal-header">';
	str += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
	str += '			<h4 class="modal-title" id="modalLabel">시작날짜를 선택하세요.</h4>';
	str += '		</div>';
	str += '		<div class="modal-body" id="modalContent">';
	
	str += '<li data-start="1">1시간 후</li>';
	str += '<li data-start="2">2시간 후</li>';
	str += '<li data-start="3">3시간 후</li>';
	str += '<li data-start="4">4시간 후</li>';
	str += '<li data-start="5">5시간 후</li>';
	str += '<li data-start="6">6시간 후</li>';
	str += '<li data-start="7">7시간 후</li>';
	str += '<li data-start="8">8시간 후</li>';
	str += '<li data-start="9">9시간 후</li>';
	str += '<li data-start="10">10시간 후</li>';
	str += '</ul>';
	
	str += '</div>';
	str += '		<div class="modal-footer">';
	str += '			<button type="button" class="btn btn-default" id="btnCloseModal">닫기</button>';
	str += '		</div>';
	str += '	</div>';
	str += '</div>';
	
	$('#modal').modal('show');
	$('#modal').html(str);
	$('[data-start]').on('click', function(){
		var interval = parseInt($(this).attr('data-start'), 10)
		
		$('#modal').modal('hide');
		date = moment().add(interval, 'hour').format('YYYY-MM-DD');
		dateString = moment().add(interval, 'hour').lang('ko').format('YYYY년 M월 D일 (dd)');
		time = moment().add(interval, 'hour').format('HH:mm');
		timeString = moment().add(interval, 'hour').lang('ko').format('A h시 mm분');
		
		$('#inputDate')
			.html( dateString )
			.attr('data-value', date)
		$('#inputTime')
			.html( timeString )
			.attr('data-value', time)
		validDate();
	})
	$('#btnCloseModal').on('click', function(){
		hideModal();
	})
}

// 유효성 검사
function checkValid() {
	var description = $('#inputDescription').html()
	if (type == '1' && description == '') {
		_oc.toast('내용을 입력해주세요.')
		return false;
	}
	return true;
}

// 예약하기
var resevationDate
function reservationListener() {
	if (checkValid()) {
		var  data = {}
			,inputDescription = removeTagAll($('#inputDescription').html())
		
		resevationDate = $('#inputDate').attr('data-value') +' '+ $('#inputTime').attr('data-value')
		diff = moment(resevationDate).lang('ko').fromNow()
		if ( !confirm('"' + accountInfo['story_nickname'] + '"님의 계정으로 ' + diff + "에 등록 예약하겠습니까?") ) {
			return false;
		}
		
		data['user_idx'] = getSetting('user_idx');
		data['account_idx'] = getSetting('account_idx');
		data['user_agent'] = window.navigator.userAgent;
		data['platform'] = platform;
		data['reservation_date'] = resevationDate;
		
		// 링크
		if (type == '3') {
			data['url'] = $('#link').html();
		}
		
		// 사진
		if (uploadImage.length > 0) {
			data['file'] = '';
			data['image'] = uploadImage.join(',');
		}
		
		data['description'] = inputDescription
		data['type'] = type;
		data['permission'] = permission;	//'F'
		//console.log(data)
		//return
		if (getParam('idx')) {
			// 수정
			data['content_idx'] = getParam('idx');
			_oc.alarm.cancel(getParam('idx'));
			_oc.sendPost('yeyak_reservation_update', data, 'cbPostYeyakReservation');
		} else {
			// 등록
			_oc.sendPost('yeyak_reservation', data, 'cbPostYeyakReservation');
		}
	}
}

function cbPostYeyakReservation(result) {
	//console.log(result)
	if (result['result'] == 'success') {
		var  time = Math.abs(getReservationTime(resevationDate))
			,timeString = moment(resevationDate, 'YYYY-MM-DD HH:mm:SS').lang('ko').format('M월 D일 A h시 m분')
		
		_oc.toast(timeString + '에 예약 되었습니다.');
		_oc.alarm.set(result['content_idx'], time);
		_oc.back();
	}
}














