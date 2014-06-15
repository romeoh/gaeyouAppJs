
function onReady() {
	
	/* 조별리그 */
	if ($('#history').length > 0) {
		initHistory();
	}
	
}



// 역대전적
function initHistory() {
	var data = {}
	
	request('fifa_history_list', data, function(result){
		if (result['result'] == 'success') {
			var  rdata = result['data']
				,str = ''

			for (var i in rdata) {
				//console.log(rdata[i])
				str += '<dd class="type2">';
				str += '	<ul>';
				str += '		<li data-match="' + rdata[i]['idx'] + '">';
				str += '			<p class="description">' + rdata[i]['ordinal'] + '회 ' + rdata[i]['year'] + '년 ' + rdata[i]['site'] + ' 월드컵</p>';
				if (rdata[i]['champion'] != '') {
					str += '			<ul class="result history">';
					str += '				<li><span>우승: </span>' + rdata[i]['champion'] + '</li>';
					str += '				<li><span>준우승: </span>' + rdata[i]['semi_champion'] + '</li>';
					str += '				<li><span>3위: </span>' + rdata[i]['third'] + '</li>';
					str += '				<li><span>4위: </span>' + rdata[i]['fourth'] + '</li>';
					
					if (rdata[i]['korea'] != '') {
						str += '				<li><span>대한민국 전적: </span>' + rdata[i]['korea'] + '</li>';
					}
					str += '			</ul>';
				} else {
					str += '			<ul class="result"><li>개최예정</li></ul>';
				}
				str += '		</li>';
				str += '	</ul>';
				str += '</dd>';
			}
			$('#historyList').html(str);
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
			
			for (var i in rdata) {
				var  date = moment(rdata[i]['date']+rdata[i]['time'], 'YYYY-MM-DDHH:mm:SS').format('M월 D일 오전 H시') + ' (' + rdata[i]['day'] + ')'
					,ground = ''
				
				str += '<dd>';
				str += '	<ul>';
				str += '		<li data-match="' + rdata[i]['match_idx'] + '">';
				
				if (rdata[i]['winner'] == '') {
					str += '			<p class="nickname">' + date + ground +'</p>';
					str += '			<p class="description">' + rdata[i]['nation_str1'] + ' VS ' + rdata[i]['nation_str2'] + '</p>';
				} else {
					var flag1 = 'flag_s_' + rdata[i]['nation1']['name_short'].toLowerCase()
						,flag2 = 'flag_s_' + rdata[i]['nation2']['name_short'].toLowerCase()
						
					str += '			<p class="nickname">' + date + ground +'</p>';
					str += '			<p class="description">' + rdata[i]['nation1']['name_ko'] + ' <span class="' + flag1 + '"></span> VS <span class="' + flag2 + '"></span> ' + rdata[i]['nation2']['name_ko'] + '</p>';
					
					str += '			<p class="result">' + rdata[i]['winner'] + ' 승 (2:1)</p>';
				}
				
				str += '		</li>';
				str += '	</ul>';
				str += '</dd>';
			}
			$('#tournamentList').html(str);
			$('[data-match]').on('click', function(){
				var  idx = $(this).attr('data-match')
					,param = 'flag=tournament&idx='+idx
				_oc.link('match.html', param, 'DEFAULT', 'DEFAULT');
			})
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
					,flag1 = 'flag_' + rdata['nation1']['name_short'].toLowerCase()
					,flag2 = 'flag_' + rdata['nation2']['name_short'].toLowerCase()
					,flag = '<span class="' + flag1 + '"></span> VS <span class="' + flag2 + '"></span>'
					,nation = rdata['nation1']['name_ko'] + ' VS ' + rdata['nation2']['name_ko']
					,detailStr = ''
				
				if (rdata['group'] != '') {
					detailStr += '<li>구분: ' + rdata['group'] + '조 예선</li>';
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
				
				$('#matchFlag').html(flag);
				$('#matchNation').html(nation);
				$('#matchDetail').html(detailStr);
				
				initReply(flag);
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
					if (rdata[i]['member_idx'] == getSetting('user_idx')) {
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
						
					data['user_key'] = getSetting('user_key');
					data['schedule_idx'] = schedule_idx;
					data['comment_idx'] = idx;
					if (fag == 'general') {
						// 일반
						tr = 'general_comment_delete';
					} else {
						// 소식
						tr = 'biz_comment_delete';
					}
					request(tr, data, function(result){
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
		if ($('#inputReply').html() == '이곳에 댓글을 써보세요~') {
			$('#inputReply').html('')
		}
	})
	$('#btnAddComment').on('click', function(){
		var comment = $('#inputReply').html()
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
		data['comment'] = encode(comment)
		data['platform'] = 'web'
		
		request('fifa_comment_insert', data, function(result){
			if (result['result'] == 'success') {
				replyStart = 0;
				$('#replayBox').html('');
				getReplyList(1);
			}
		})
	})
}
















