var  match_idx
	,flag
	,replyStart = 0
	,replyTotal = 20

function onReady() {
	match_idx = getParam('idx');
	flag = getParam('flag');
	
	/* 조별리그 */
	if ($('#league').length > 0) {
		initTab();
		initLeague();
		initFirstRun('moa.game');
	}
	
	/* 토너먼트 */
	if ($('#tournament').length > 0) {
		initTab();
		initTournament();
	}
	
	/* 매치 */
	if ($('#match').length > 0) {
		initMatch(flag);
	}
}


function initTab() {
	$('#tabLeague').on('click', function(){
		_oc.link('../schedule/league.html', '', 'DEFAULT', 'DEFAULT');
	})
	$('#tabTournament').on('click', function(){
		_oc.link('../schedule/tournament.html', '', 'DEFAULT', 'DEFAULT');
	})
}


// 조별리그
function initLeague() {
	var data = {}
	
	request('fifa_league_V11', data, function(result){
		if (result['result'] == 'success') {
			var  rdata = result['data']
				,str = ''
			
			rdata = arrageSchedule(rdata, true)
			for (var i in rdata) {
				var  dateMem = rdata[i]
					,titleDate = dateMem[0]['date']
					,dday = moment(dateMem[0]['date'], 'YYYY-MM-DD').diff(moment().format('YYYY-MM-DD'), 'days')
					,weekday = moment(dateMem[0]['date'], 'YYYYMMDDTHHmm').weekday();
				
				if (dday > 0) {
					dday = ' (' + dday + '일 후)'
				} else if (dday < 0) {
					dday = ' (' + Math.abs(dday) + '일 전)'
				} else {
					dday = ''
				}
				if ( parseTime(7, dateMem[0]['date']) == parseTime(7) ) {
					str += '<dt class="tday" id="todayTitle">오늘 - ' + parseTime(31, dateMem[0]['date']) + '</dt>';
				} else {
					str += '<dt data-month="' + parseTime(71, dateMem[0]['dtstart']) + '">' + parseTime(3, titleDate) + dday + '</dt>';
				}
				str += '<dd>';
				str += '	<ul>';
				for (var j in dateMem) {
					var  date = moment(dateMem[j]['date']+dateMem[j]['time'], 'YYYY-MM-DDHH:mm:SS').format('M월 D일 오전 H시') + ' (' + dateMem[j]['day'] + ')'
						,ground = ''
						,flag1 = 'flag_s_' + dateMem[j]['nation1']['name_short'].toLowerCase()
						,flag2 = 'flag_s_' + dateMem[j]['nation2']['name_short'].toLowerCase()
					
					str += '		<li data-match="' + dateMem[j]['match_idx'] + '">';
					str += '			<p class="nickname">' + date + ground +'</p>';
					str += '			<p class="description">' + dateMem[j]['nation1']['name_ko'] + ' <span class="' + flag1 + '"></span> VS <span class="' + flag2 + '"></span> ' + dateMem[j]['nation2']['name_ko'] + '</p>';
					
					if (dateMem[j]['netizen_team1']) {
						str += '			<p class="description">네티즌 예상점수: <span class="score">' + dateMem[j]['netizen_team1'] + '</span> : <span class="score">' + dateMem[j]['netizen_team2'] + '</span> (' + dateMem[j]['netizen_count'] + '명 참여)</p>';
					}
					if (dateMem[j]['comment_count'] != '0') {
						str += '			<p class=""><span class="score">' + dateMem[j]['comment_count'] + '개</span>의 댓글</p>';
					}
					if (dateMem[j]['winner'] != '') {
						if (dateMem[j]['nation_score1'] == dateMem[j]['nation_score2']) {
							str += '			<p class="result">무승부 (' + dateMem[j]['nation_score1'] + ':' + dateMem[j]['nation_score2'] + ')</p>';
						} else {
							str += '			<p class="result">' + dateMem[j]['winner'] + ' 승 (' + dateMem[j]['nation_score1'] + ':' + dateMem[j]['nation_score2'] + ')</p>';
						}
					}
					str += '		</li>';
				}
				str += '	</ul>';
				str += '</dd>';
			}
			$('#leagueList').html(str);
			if ($('#todayTitle').length > 0) {
				setTimeout(function(){
					$('#todayTitle').ScrollTo({duration:300, offsetTop:60});
				}, 300)
			}
			$('[data-match]').on('click', function(){
				var  idx = $(this).attr('data-match')
					,param = 'flag=league&idx='+idx
				_oc.link('../schedule/match.html', param, 'DEFAULT', 'DEFAULT');
			}).on('touchstart', function(){})
		}
	})
}


// 토너먼트
function initTournament() {
	var data = {}
	
	request('fifa_tournament', data, function(result){
		if (result['result'] == 'success') {
			var  rdata = result['data']
				,str = ''
			rdata = arrageSchedule(rdata, true)
			for (var i in rdata) {
				var  dateMem = rdata[i]
					,titleDate = dateMem[0]['date']
					,dday = moment(dateMem[0]['date'], 'YYYY-MM-DD').diff(moment().format('YYYY-MM-DD'), 'days')
					,weekday = moment(dateMem[0]['date'], 'YYYYMMDDTHHmm').weekday();
				
				if (dday > 0) {
					dday = ' (' + dday + '일 후)'
				} else if (dday < 0) {
					dday = ' (' + Math.abs(dday) + '일 전)'
				} else {
					dday = ''
				}
				if ( parseTime(7, dateMem[0]['date']) == parseTime(7) ) {
					str += '<dt class="tday" id="todayTitle">오늘 - ' + parseTime(31, dateMem[0]['date']) + '</dt>';
				} else {
					str += '<dt data-month="' + parseTime(71, dateMem[0]['dtstart']) + '">' + parseTime(3, titleDate) + dday + '</dt>';
				}
				str += '<dd>';
				str += '	<ul>';
				for (var j in dateMem) {
					var  date = moment(dateMem[j]['date']+dateMem[j]['time'], 'YYYY-MM-DDHH:mm:SS').format('M월 D일 오전 H시') + ' (' + dateMem[j]['day'] + ')'
						,ground = ''
					
					str += '		<li data-match="' + dateMem[j]['match_idx'] + '">';
					if (dateMem[j]['nation_idx1'] != '') {
						var  flag1 = 'flag_s_' + dateMem[j]['nation1']['name_short'].toLowerCase()
							,flag2 = 'flag_s_' + dateMem[j]['nation2']['name_short'].toLowerCase()
							,nation1 = dateMem[j]['nation1']['name_ko']
							,nation2 = dateMem[j]['nation2']['name_ko']
						
						if (nation1 == '') {
							nation1 = dateMem[j]['nation_str1']
							flag1 = '';
						}
						if (nation2 == '') {
							nation2 = dateMem[j]['nation_str2']
							flag2 = '';
						}
						str += '			<p class="nickname">' + date + ground +'</p>';
						str += '			<p class="description">' + nation1 + ' <span class="' + flag1 + '"></span> VS <span class="' + flag2 + '"></span> ' + nation2 + '</p>';
						
						if (dateMem[j]['winner'] != '') {
							str += '			<p class="result">' + dateMem[j]['winner'] + ' 승 (' + dateMem[j]['nation_score1'] + ':' + dateMem[j]['nation_score2'] + ')</p>';
						}
					} else {
						str += '			<p class="nickname">' + date + ground +'</p>';
						str += '			<p class="description">' + dateMem[j]['nation_str1'] + ' VS ' + dateMem[j]['nation_str2'] + '</p>';
					}
					str += '		</li>';
				}
				str += '	</ul>';
				str += '</dd>';
			}
			$('#tournamentList').html(str);
			if ($('#todayTitle').length > 0) {
				setTimeout(function(){
					$('#todayTitle').ScrollTo({duration:300, offsetTop:60});
				}, 300)
			}
			$('[data-match]').on('click', function(){
				var  idx = $(this).attr('data-match')
					,param = 'flag=tournament&idx='+idx
				_oc.link('../schedule/match.html', param, 'DEFAULT', 'DEFAULT');
			}).on('touchstart', function(){})
		}
	})
}


// 경기상세
function initMatch(flag) {
	// 조별리그
	if(flag == 'league') {
		var  data = {}
		data['match_idx'] = match_idx
		
		request('fifa_view_league', data, function(result){
			if (result['result'] == 'success') {
				var  rdata = result['data']
					,nation1 = rdata['nation1']['name_ko']
					,nation2 = rdata['nation2']['name_ko']
					,flag1 = 'flag_' + rdata['nation1']['name_short'].toLowerCase()
					,flag2 = 'flag_' + rdata['nation2']['name_short'].toLowerCase()
					,flagVS = '<span class="' + flag1 + '"></span> VS <span class="' + flag2 + '"></span>'
					,nation = rdata['nation1']['name_ko'] + ' VS ' + rdata['nation2']['name_ko']
					,detailStr = ''
				console.log(rdata)
				if (rdata['group'] != '') {
					detailStr += '<li>구분: ' + rdata['group'] + '조 예선</li>';
				}
				if (rdata['date'] != '') {
					var date = moment(rdata['date']+rdata['time'], 'YYYY-MM-DDHHmmSS').lang('ko').format('M월 D일 오전 H시 (dd)')
					detailStr += '<li>경기일정: ' + date + '</li>';
				}
				if (rdata['ground'] != '') {
					detailStr += '<li>경기장: ' + rdata['ground'] + '</li>';
				}
				
				if (rdata['winner'] != '') {
					detailStr += '<li>결과: ' + rdata['winner'] + ' 승 (' + rdata['nation_score1'] + ':' + rdata['nation_score2'] + ')</li>';
					$('#btnBatting').css('display', 'none');
				}
				
				$('#matchFlag').html(flagVS);
				$('#matchNation').html(nation);
				$('#matchDetail').html(detailStr);
				
				initReply(flag);
				
				// 결과예상해보기
				$('#btnBatting').on('click', function(){
					if (getSetting('user_name') == '') {
						setId()
						return false;
					}
					
					var str = '';
					str += '<div class="modal-dialog">';
					str += '	<div class="modal-content">';
					str += '		<div class="modal-header">';
					str += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
					str += '			<h4 class="modal-title" id="modalLabel">결과를 예상해보세요.</h4>';
					str += '		</div>';
					str += '		<div class="modal-body" id="modalContent">';
					
					str += '<div class="form-group group-movie-input">';
					str += '	<p>'+nation1+'</p>';
					str += '	<select class="form-control" id="team1">';
					str += '		<option value="-1">선택해주세요.</option>';
					str += '		<option value="0">0점</option>';
					str += '		<option value="1">1점</option>';
					str += '		<option value="2">2점</option>';
					str += '		<option value="3">3점</option>';
					str += '		<option value="4">4점</option>';
					str += '		<option value="5">5점</option>';
					str += '		<option value="6">6점</option>';
					str += '		<option value="7">7점</option>';
					str += '		<option value="8">8점</option>';
					str += '		<option value="9">9점</option>';
					str += '		<option value="10">10점</option>';
					str += '		<option value="11">11점</option>';
					str += '		<option value="12">12점</option>';
					str += '		<option value="13">13점</option>';
					str += '		<option value="14">14점</option>';
					str += '		<option value="15">15점</option>';
					str += '		<option value="16">16점</option>';
					str += '		<option value="17">17점</option>';
					str += '		<option value="18">18점</option>';
					str += '		<option value="19">19점</option>';
					str += '		<option value="20">20점</option>';
					str += '	</select>';
					str += '	<p style="margin-top:20px">'+nation2+'</p>';
					str += '	<select class="form-control" id="team2">';
					str += '		<option value="-1">선택해주세요.</option>';
					str += '		<option value="0">0점</option>';
					str += '		<option value="1">1점</option>';
					str += '		<option value="2">2점</option>';
					str += '		<option value="3">3점</option>';
					str += '		<option value="4">4점</option>';
					str += '		<option value="5">5점</option>';
					str += '		<option value="6">6점</option>';
					str += '		<option value="7">7점</option>';
					str += '		<option value="8">8점</option>';
					str += '		<option value="9">9점</option>';
					str += '		<option value="10">10점</option>';
					str += '		<option value="11">11점</option>';
					str += '		<option value="12">12점</option>';
					str += '		<option value="13">13점</option>';
					str += '		<option value="14">14점</option>';
					str += '		<option value="15">15점</option>';
					str += '		<option value="16">16점</option>';
					str += '		<option value="17">17점</option>';
					str += '		<option value="18">18점</option>';
					str += '		<option value="19">19점</option>';
					str += '		<option value="20">20점</option>';
					str += '	</select>';
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
					
					$('#btnCloseModal').on('click', function(){
						hideModal();
					})
					$('#btnModalSelect').on('click', function(){
						var  team1 = $('#team1').val()
							,team2 = $('#team2').val()
						
						if (team1 == '-1') {
							alert(nation1+'팀의 예상점수를 선택해주세요.');
							return false;
						}
						if (team2 == '-1') {
							alert(nation2+'팀의 예상점수를 선택해주세요.');
							return false;
						}
						
						var data = {}
						data['flag'] = flag
						data['match_idx'] = match_idx
						data['team1'] = team1;
						data['team2'] = team2;
						data['user_name'] = getSetting('user_name');
						data['user_agent'] = window.navigator.userAgent;
						
						request('fifa_batting_insert', data, function(result){
							if (result['result'] == 'success') {
								var  rdata = result['data']
								alert('결과가 합산되었습니다.')
								window.location.reload()
							}
						})
					})
				})
				
				// 결과예상해보기 결과
				var data = {}
				data['flag'] = flag
				data['match_idx'] = match_idx
				data['user_name'] = getSetting('user_name');
				
				request('fifa_batting_get', data, function(result){
					if (result['result'] == 'success') {
						var  rdata = result['data']
							,str = ''
						
						// 참가전
						if (rdata['my']['team1'] != '') {
							$('#btnBatting').css('display', 'none');
							$('#myScore').html(nation1 + ' <span>' + rdata['my']['team1'] + '</span> : <span>' + rdata['my']['team2'] + '</span> ' + nation2);
						} else {
							$('#myScore').html(nation1 + ' <span>?</span> : <span>?</span> ' + nation2);
						}
						// 네티증
						$('#natizen').html(nation1 + ' <span>' + rdata['netizen']['team1'] + '</span> : <span>' + rdata['netizen']['team2'] + '</span> ' + nation2)
						$('#natizenCount').html(rdata['netizen']['count'] + '명의 평균 예상점수');
					}
				})
			}
		})
		return false;
	}
	
	// 토너먼트
	if(flag == 'tournament') {
		var  data = {}
		data['match_idx'] = match_idx
		
		request('fifa_view_tournament', data, function(result){
			if (result['result'] == 'success') {
				var  rdata = result['data']
					,detailStr = ''
				
				if (rdata['flag'] != '') {
					detailStr += '<li>구분: ' + rdata['flag'] + '</li>';
				}
				if (rdata['date'] != '') {
					var date = moment(rdata['date']+rdata['time'], 'YYYY-MM-DDHHmmSS').format('M월 D일 오전 H시')
					detailStr += '<li>경기일정: ' + date + '</li>';
				}
				if (rdata['ground'] != '') {
					detailStr += '<li>경기장: ' + rdata['ground'] + '</li>';
				}
				
				if (rdata['winner'] != '') {
					detailStr += '<li>결과: ' + rdata['winner'] + ' 승 (:)</li>';
				}
				
				// 토너먼트 결과 없음
				if (rdata['nation_idx1'] == '') {
					var flag1 = 'flag_' + rdata['nation1']['name_short'].toLowerCase()
						,flag2 = 'flag_' + rdata['nation2']['name_short'].toLowerCase()
						,nation = rdata['nation_str1'] + ' VS ' + rdata['nation_str2']
					$('#matchFlag').html(nation);
				
				// 토너먼트 결과 있음
				} else {
					var flag1 = 'flag_' + rdata['nation1']['name_short'].toLowerCase()
						,flag2 = 'flag_' + rdata['nation2']['name_short'].toLowerCase()
						,flag = '<span class="' + flag1 + '"></span> VS <span class="' + flag2 + '"></span>'
						,nation = rdata['nation1']['name_ko'] + ' VS ' + rdata['nation2']['name_ko']
					$('#matchFlag').html(flag);
					$('#matchNation').html(nation);
				}
				if (rdata['winner'] != '') {
					var winnerStr = rdata['winner'] + ' 승 (' + rdata['nation_score1'] + ' : ' + rdata['nation_score2'] + ')'
					$('#description').html('경기결과: ' + winnerStr);
				}
				$('#matchDetail').html(detailStr);
				
				initReply(flag);
			}
		})
		return false;
	}
}

// 댓글 가져오기
function initReply(flag) {
	initReplyAdd();
	getReplyList();
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














