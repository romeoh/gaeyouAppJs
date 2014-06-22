/*
link url = http://goo.gl/xwrAKo
*/

function onReady() {

	/* DDAY 리스트 */
	if ($('#dList').length > 0) {
		initEvent();
		initList();
		initFirstRun('moa.game');
	}
	
	/* 새로운 디데이 */
	if ($('#addDday').length > 0) {
		initNew();
	}
	
	/* 디데이 보기 */
	if ($('#viewDday').length > 0) {
		initView();
	}
	
	/* 재미있는 디데이 보기 */
	if ($('#publicList').length > 0) {
		initEvent();
		initPublic();
	}
}


function initEvent() {

	$('#panelNew').on('click', function(){
		var param = 'flag=new'
		_oc.link('../content/add.html', param, 'DEFAULT', 'DEFAULT');
	})
	$('#panelPublic').on('click', function(){
		var param = ''
		_oc.link('../content/public.html', param, 'DEFAULT', 'DEFAULT');
	})
	$('#panelSetting').on('click', function(){
		//var param = 'flag=new'
		//_oc.link('../content/add.html', param, 'DEFAULT', 'DEFAULT');
	})
	$('#panelShare').on('click', function(){
		var msg = '쉽고 편리한 모두의 디데이를 다운받아 보세요.\nhttps://play.google.com/store/apps/details?id=com.gaeyou.dday'
		_oc.share(msg);
	})
	$('#panelFBPage').on('click', function(){
		_oc.uri.facebook('357555101043476');
	})
	$('#appsWorldcup').on('click', function(){
		_oc.href('http://goo.gl/NEphmg');
	})
	
	
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
	$('#btnNew').on('click', function(){
		var param = 'flag=new'
		_oc.link('../content/add.html', param, 'DEFAULT', 'DEFAULT');
	})
}


// 디데이리스트
function initList() {
	var data = {}
	data['user_idx'] = getSetting('user_idx')
	
	request('dday_content_list', data, function(result){
		if (result['result'] == 'success') {
			var  rdata = result['data']
				,str = ''
			
			$('#loading').css('display', 'none');	
			str += '<dd>';
			str += '	<ul>';
			if (rdata.length == 0) {
				str += '		<li data-idx="">';
				str += '			<p class=""></p>';
				str += '			<p class="welcom">디데이에 오신것을 환영합니다.</p>';
				str += '			<p class="info">아직 등록된 디데이가 없습니다.</p>';
				str += '		</li>';
				
				str += '	</ul>';
				
				str += '	<ul class="public-dday">';
				str += '	<li id="btnPublic"><button class="btn btn-warning btn-block"><i class="fa fa-cloud"></i> 공개된 재미있는 디데이를 가져와보세요.</button></li>';
				str += '	<li id="btnFirst"><button class="btn btn-warning btn-block"><i class="fa fa-edit"></i> 새로운 디데이를 등록해보세요.</button></li>';
				str += '	</ul>';
				str += '</dd>';
				
				$('#ddayList').html(str);
				
				// 재미있는 디데이
				$('#btnPublic').on('click', function(){
					var  idx = $(this).attr('data-idx')
						,param = ''
					_oc.link('../content/public.html', param, 'DEFAULT', 'DEFAULT');
				}).on('touchstart', function(){})
				$('#btnFirst').on('click', function(){
					var  idx = $(this).attr('data-idx')
						,param = ''
					_oc.link('../content/add.html', param, 'DEFAULT', 'DEFAULT');
				}).on('touchstart', function(){})
				
			} else {
				var  days = []
					,wasPublic = []
				for (var i in rdata) {
					rdata[i]['dday'] = calDay(rdata[i]['ddate'], false)
					days.push(rdata[i])
				}
				rdata = arrageJons(days)
				
				for (var i in rdata) {
					var  d_dayStr = moment(rdata[i]['ddate'], 'YYYY-MM-DD').format('YYYY년 M월 D일')
						,totalDday
						,ddayClass
					
					if (rdata[i]['was_public'] != '0') {
						wasPublic.push(rdata[i]['was_public'])
					}
					if (rdata[i]['dday']['flag'] == '0' || rdata[i]['dday']['last'] == '0') {
						// 오늘
						diffStr = '오늘입니다.';
						ddayClass = 'dday'
						totalDday = ''
					} else if (rdata[i]['dday']['flag'] == '-1') {
						// 지남
						diffStr = rdata[i]['dday']['next'] + '일 남았습니다.';
						ddayClass = 'dday past'
						totalDday = ' (' + rdata[i]['dday']['total'] + '일 지났습니다.)';
					} else {
						// 남음
						diffStr = M.toCurrency(rdata[i]['dday']['next']) + '일 남았습니다.';
						ddayClass = 'dday future'
						totalDday = ''
					}
					
					str += '		<li data-idx="' + rdata[i]['idx'] + '">';
					str += '			<p class="' + ddayClass + '">' + diffStr + '</p>';
					str += '			<p class="description">' + rdata[i]['description'] + '</p>';
					str += '			<p class="nickname">' + d_dayStr + totalDday + '</p>';				
					str += '		</li>';
				}
				str += '	</ul>';
				
				str += '	<ul class="public-dday">';
				str += '	<li id="btnPublic"><i class="fa fa-calendar"></i> 재미있는 디데이 보기</li>';
				str += '	</ul>';
				str += '</dd>';
				
				$('#ddayList').html(str);
				
				wasPublic.join(',')
				setSetting('was_public', wasPublic)
				// 상세보기
				$('[data-idx]').on('click', function(){
					var  idx = $(this).attr('data-idx')
						,param = 'idx='+idx
					_oc.link('../content/view.html', param, 'DEFAULT', 'DEFAULT');
				}).on('touchstart', function(){})
				
				// 재미있는 디데이
				$('#btnPublic').on('click', function(){
					var  idx = $(this).attr('data-idx')
						,param = ''
					_oc.link('../content/public.html', param, 'DEFAULT', 'DEFAULT');
				}).on('touchstart', function(){})
			}
		}
	})
}


// 새로운 디데이
function initNew() {
	var  tdateStr = moment().format('YYYY년 M월 D일')
		,tdateValue = moment().format('YYYY-MM-DD')
		,flag = getParam('flag')
	
	// 재미있는 디데이
	if (flag == 'public') {
		var data = {}
		data['dday_idx'] = getParam('idx')
		
		request('dday_public_view', data, function(result){
			if (result['result'] == 'success') {
				var  rdata = result['data']
					,tdateStr = moment(rdata['ddate'], 'YYYY-MM-DD').format('YYYY년 M월 D일')
					,tdateValue = moment(rdata['ddate'], 'YYYY-MM-DD').format('YYYY-MM-DD')
				
				$('#inputDescription').val(rdata['description'])
				$('#inputDate')
					.html(tdateStr)
					.attr('data-value', tdateValue)
				if (rdata['start_day'] === '1') {
					$('#btnCheck').html('<i class="fa fa-check-square-o"></i> 1일부터 계산합니다. (커플기념일 등)');
					$('#btnCheck').attr('data-value', '1');
				} else {
					$('#btnCheck').html('<i class="fa fa-square-o"></i> 0일부터 계산합니다. (크리스마스 등)');
					$('#btnCheck').attr('data-value', '0');
				}
			}
		})
		
	// 수정하기
	} else if (flag == 'edit') {
		var data = {}
		data['content_idx'] = getParam('idx')
		data['user_idx'] = getSetting('user_idx')
		
		request('dday_content_view', data, function(result){
			if (result['result'] == 'success') {
				var  rdata = result['data']
					,tdateStr = moment(rdata['ddate'], 'YYYY-MM-DD').format('YYYY년 M월 D일')
					,tdateValue = moment(rdata['ddate'], 'YYYY-MM-DD').format('YYYY-MM-DD')
				
				$('#inputDescription').val(rdata['description'])
				$('#inputDate')
					.html(tdateStr)
					.attr('data-value', tdateValue)
				if (rdata['start_day'] === '1') {
					$('#btnCheck').html('<i class="fa fa-check-square-o"></i> 1일부터 계산합니다. (커플기념일 등)');
					$('#btnCheck').attr('data-value', '1');
				} else {
					$('#btnCheck').html('<i class="fa fa-square-o"></i> 0일부터 계산합니다. (크리스마스 등)');
					$('#btnCheck').attr('data-value', '0');
				}
			}
		})
	} else {
		$('#inputDate')
			.html(tdateStr)
			.attr('data-value', tdateValue)
	}
		
	// dday 시작 설정
	$('#btnCheck').on('click', function(){
		var isChecked = $('#btnCheck').attr('data-value');
		
		if (isChecked === '0') {
			$('#btnCheck').html('<i class="fa fa-check-square-o"></i> 1일부터 계산합니다. (커플기념일 등)');
			$('#btnCheck').attr('data-value', '1');
		} else {
			$('#btnCheck').html('<i class="fa fa-square-o"></i> 0일부터 계산합니다. (크리스마스 등)');
			$('#btnCheck').attr('data-value', '0');
		}
	})
	
	// 데이터 피커
	$('#inputDate').on('click', function(){
		var defaultDate = $('#inputDate').attr('data-value')
		_oc.datepicker('cbDatepicker', defaultDate);
	});
	
	// 등록
	$('#btnSave').on('click', function(){
		var  description = $('#inputDescription').val()
			,date = $('#inputDate').attr('data-value')
			,startDay = $('#btnCheck').attr('data-value')
		
		if (description == '') {
			alert('내용을 입려하세요.');
			return false;
		}
		if (date == '') {
			alert('날짜를 입력하세요.');
			return false;
		}
		
		// 수정하기
		if (flag == 'edit') {
			var data = {}
			data['description'] = description
			data['ddate'] = date
			data['start_day'] = startDay
			data['user_agent'] = window.navigator.userAgent
			data['content_idx'] = getParam('idx')
			data['platform'] = platform

			request('dday_content_update', data, function(result){
				if (result['result'] == 'success') {
					alert('수정 되었습니다.');
					_oc.back();
				}
			})
		} else {
			var data = {}
			data['description'] = description
			data['ddate'] = date
			data['start_day'] = startDay
			data['user_agent'] = window.navigator.userAgent
			data['user_idx'] = getSetting('user_idx')
			data['platform'] = platform
			if (flag == 'public') {
				data['was_public'] = getParam('idx')
			}
			request('dday_content_insert', data, function(result){
				if (result['result'] == 'success') {
					alert('등록 되었습니다.');
					_oc.back();
				}
			})
		}
		

	})
}

function cbDatepicker(year, month, day) {
	var  dateStr = moment(year+'-'+month+'-'+day, 'YYYY-M-D').format('YYYY년 M월 D일')
		,dateValue = moment(year+'-'+month+'-'+day, 'YYYY-M-D').format('YYYY-MM-DD')
	$('#inputDate')
		.html(dateStr)
		.attr('data-value', dateValue)
}


// 디데이 보기
var publicData;
function initView() {
	
	var data = {}
	data['user_idx'] = getSetting('user_idx')
	data['content_idx'] = getParam('idx')
	
	request('dday_content_view', data, function(result){
		if (result['result'] == 'success') {
			var  rdata = result['data']
			publicData = rdata;
			rdata['dday'] = calDay(rdata['ddate'], true);
			var d_dayStr = moment(rdata['ddate'], 'YYYY-MM-DD').format('YYYY년 M월 D일')
			
			if (rdata['dday']['flag'] == '0' || rdata['dday']['last'] == '0') {
				// 오늘
				diffStr = '오늘입니다.';
				ddayClass = 'dday'
				totalDday = ''
			} else if (rdata['dday']['flag'] == '-1') {
				// 지남
				diffStr = rdata['dday']['next'] + '일 남았습니다.';
				ddayClass = 'dday past'
				totalDday = ' (' + rdata['dday']['total'] + '일 지났습니다.)';
			} else {
				// 남음
				diffStr = M.toCurrency(rdata['dday']['next']) + '일 남았습니다.';
				ddayClass = 'dday future'
				totalDday = ''
			}
			$('#description').html(rdata['description'])
			$('#dday').html(diffStr).addClass(ddayClass)
			
			// 날짜 상세
			dstr = ''
			dstr += '<li class="netizen">설정일: ' + d_dayStr + '</li>'
			// 오늘
			if (rdata['dday']['last'] === 0) {
				dstr += '<li class="netizen">전체일: ' + rdata['dday']['total'] + '일 지났습니다.</li>'
			// 미래날
			} else if (rdata['dday']['flag'] == '1') {
				dstr += '<li class="netizen">전체일: ' + rdata['dday']['total'] + '일 남았습니다.</li>'
			// 지난날
			} else if (rdata['dday']['lastDay']) {
				dstr += '<li class="netizen">전체일: ' + rdata['dday']['total'] + '일 지났습니다.</li>'
				dstr += '<li class="netizen">최근일: ' + rdata['dday']['last'] + '일 지났습니다. (' + rdata['dday']['lastDay'] + ')</li>'
				dstr += '<li class="netizen">다음일: ' + rdata['dday']['next'] + '일 남았습니다. (' + rdata['dday']['nextDay'] + ')</li>'
			}
			
			dstr += '<li>오늘날짜: ' + moment().format('YYYY년 M월 D일') + '</li>'
			$('#dayDetail').html(dstr)
			
			// 기념일
			dstr = ''
			var memorialDay = rdata['dday']['memorial']
			for (var i in memorialDay) {
				for (key in memorialDay[i]) {
					var dayStr = moment(memorialDay[i][key], 'YYYY-MM-DD').format('YYYY년 M월 D일')
					dstr += '<li><span class="anniver">' + key + '</span> :'+ dayStr + '</li>'
				}
			}
			$('#dayList').html(dstr);
			
			// 옵션메뉴
			$('#btnOption').on('click', function(){
				showOptionMenu(rdata['was_public']);
			})
		}
	})
}


function showOptionMenu(option) {
	var str = '';
	str += '<div class="modal-dialog">';
	str += '	<div class="modal-content">';
	str += '		<div class="modal-header">';
	str += '		</div>';
	str += '		<div class="modal-body" id="modalContent">';
	
	str += '<ul>';
	if (option === '0') {
		str += '<li data-option="1">재미있는 디데이에 공개하기</li>';
	}
	str += '<li data-option="2">디데이 수정</li>';
	str += '<li data-option="3">디데이 삭제</li>';
	str += '</ul>';
	
	str += '</div>';
	str += '		<div class="modal-footer">';
	str += '			<button type="button" class="btn btn-default" id="btnCloseModal">닫기</button>';
	str += '		</div>';
	str += '	</div>';
	str += '</div>';
	
	$('#modal').modal('show');
	$('#modal').html(str);
	
	$('#btnCloseModal').on('click', function(){
		hideModal();
	})
	// 메뉴선택
	$('[data-option]').on('click', function(){
		var idx = $(this).attr('data-option')
		
		// 공개하기
		if (idx === '1') {
			if (confirm('다른사람들에게 이 디데이는 공개하겠습니까?')) {
				hideModal();
				if (!getSetting('user_name')) {
					setId();
				} else {
					publicDday()
				}
			} else {
				hideModal()
			}
			return false;
		}
		// 수정하기
		if (idx === '2') {
			var param = 'idx='+getParam('idx')+'&flag=edit'
			_oc.link('../content/add.html', param, 'DEFAULT', 'DEFAULT')
		}
		
		// 삭제하기
		if (idx === '3') {
			var data = {}
			data['user_idx'] = getSetting('user_idx')
			data['content_idx'] = getParam('idx')
			
			request('dday_content_delete', data, function(result){
				if (result['result'] == 'success') {
					var  rdata = result['data']
					alert('삭제되었습니다.');
					_oc.back();
				}
			})
		}
	})
}

function publicDday() {
	var data = {}
	data['user_idx'] = getSetting('user_idx')
	data['user_name'] = getSetting('user_name')
	data['description'] = publicData['description']
	data['ddate'] = publicData['ddate']
	data['start_day'] = publicData['start_day']
	data['platform'] = platform
	data['user_agent'] = window.navigator.userAgent
	console.log(data)
	request('dday_public_insert', data, function(result){
		if (result['result'] == 'success') {
			var  rdata = result['data']
			alert('공개되었습니다.');
			_oc.link('../content/public.html', '', 'DEFAULT', 'DEFAULT');
		} else {
			alert('이미 공개된 디데이입니다.');
		}
	})
}




// 재미있는 디데이리스트
var  listStart = 0
	,listTotal = 20
function initPublic() {
	var data = {}
	data['user_idx'] = getSetting('user_idx')
	data['start'] = listStart
	data['total'] = listTotal
	
	request('dday_public_list', data, function(result){
		if (result['result'] == 'success') {
			var  rdata = result['data']
				,str = ''
			
			$('#loading').css('display', 'none');
			listStart = listTotal + listStart;
			if (rdata.length == 0) {
				console.log('없음')
			} else {
				var days = []
				for (var i in rdata) {
					rdata[i]['dday'] = calDay(rdata[i]['ddate'], false)
					days.push(rdata[i])
				}
				//rdata = arrageJons(days)
				
				for (var i in rdata) {
					if (!checkGetPublic(rdata[i]['idx'])) {
						var  d_dayStr = moment(rdata[i]['ddate'], 'YYYY-MM-DD').format('YYYY년 M월 D일')
							,totalDday
							,ddayClass
						
						if (rdata[i]['dday']['flag'] == '0') {
							// 오늘
							diffStr = '오늘입니다.';
							ddayClass = 'dday'
							totalDday = ''
						} else if (rdata[i]['dday']['flag'] == '-1') {
							// 지남
							diffStr = rdata[i]['dday']['next'] + '일 남았습니다.';
							ddayClass = 'dday past'
							totalDday = ' (' + rdata[i]['dday']['total'] + '일 지났습니다.)';
						} else {
							// 남음
							diffStr = M.toCurrency(rdata[i]['dday']['next']) + '일 남았습니다.';
							ddayClass = 'dday future'
							totalDday = ''
						}
						
						str += '		<li data-idx="' + rdata[i]['idx'] + '">';
						str += '			<p class="description public">' + rdata[i]['description'] + '</p>';
						str += '			<p class="' + ddayClass + '">' + diffStr + '</p>';
						str += '			<p class="nickname">' + d_dayStr + totalDday + '</p>';	
						str += '			<p class="nickname">공개한사람: ' + rdata[i]['user_name'] +'</p>';
						
						if (rdata[i]['user_idx'] == getSetting('user_idx')) {
							str += '			<p class="getDday"><button class="btn btn-default" data-del="' + rdata[i]['idx'] + '">삭제</button></p>';
						} else {
							str += '			<p class="getDday"><button class="btn btn-warning" data-get="' + rdata[i]['idx'] + '">가져오기</button></p>';
						}
						
						str += '		</li>';
					}
				}
				str += '<li class="more" id="listMore">';
				str += '	<button class="btn btn-info btn-block" id="btnMore">더 불러오기</button>';
				str += '</li>';
				$('#ddayList').append(str);
				
				// 더 불러오기
				$('#btnMore').off('click').on('click', function(){
					$('#listMore').remove();
					//$('#btnReload').remove();
					initPublic();
				})
				
				// 재미있는 디데이 가져가기
				$('[data-get]').on('click', function(){
					var  idx = $(this).attr('data-get')
						,param = 'idx='+idx+'&flag=public'
					
					data = {}
					data['content_idx'] = idx
					
					request('dday_public_follow', data, function(result){
						if (result['result'] == 'success') {
							var  rdata = result['data']
							_oc.link('../content/add.html', param, 'DEFAULT', 'DEFAULT')
						}
					})
					return false;
				})
				
				// 재미있는 디데이 삭제
				$('[data-del]').on('click', function(){
					var  idx = $(this).attr('data-del')
						,data = {}
					data['user_idx'] = getSetting('user_idx')
					data['content_idx'] = idx
					
					request('dday_public_delete', data, function(result){
						if (result['result'] == 'success') {
							var  rdata = result['data']
							alert('삭제되었습니다.');
							window.location.reload();
						}
					})
					return false;
				})
			}
		}
	})
}

// 가져온 디데이 체크
function checkGetPublic(idx) {
	var getPublic = getSetting('was_public')
	for (var i in getPublic) {
		if (getPublic[i] == idx) {
			return true;
		}
	}
	return false;
}


// initFirstRun()
function initFirstRun(app) {
	if (!getSetting(app)) {
		var str = '';
		str += '<div class="modal-dialog">';
		str += '	<div class="modal-content">';
		str += '		<div class="modal-header">';
		str += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		str += '			<h4 class="modal-title" id="modalLabel">추천앱</h4>';
		str += '		</div>';
		str += '		<div class="modal-body" id="modalContent">';
		
		str += '<div class="form-group group-movie-input" style="text-align:center">';
		str += '	<img src="http://romeoh.github.io/gaeyouAppJs/common/img/' + app + '.png" style="width:100%; margin-bottom:10px">';
		str += '	<button type="button" class="btn btn-warning" id="btnDownload"><i class="fa fa-android"></i> 다운로드</button>';
		str += '</div>';
	
		str += '</div>';
		str += '		<div class="modal-footer">';
		str += '			<button type="button" class="btn btn-default" id="btnCloseModal">닫기</button>';
		str += '			<button type="button" class="btn btn-primary" id="btnModalSelect">다시보지 않음</button>';
		str += '		</div>';
		str += '	</div>';
		str += '</div>';
		
		$('#modal').modal('show');
		$('#modal').html(str);
		
		$('#btnModalSelect').on('click', function(){
			setSetting(app, 'true')
			hideModal();
		})
		
		$('#btnCloseModal').on('click', function(){
			hideModal();
		})
		$('#btnDownload').on('click', function(){
			_oc.href('https://play.google.com/store/apps/details?id=com.gaeyou.' + app);
		})
	}
	
}













