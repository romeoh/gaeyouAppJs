
function onReady() {
	
	/* 세팅 */
	if ($('#setting').length > 0) {
		initSetting();
	}
	
	/* 고객센터 */
	if ($('#addReport').length > 0) {
		initReport();
	}
	
	/* 퀴즈내기 */
	if ($('#question').length > 0) {
		initQuestion();
	}
}



// 세팅
function initSetting() {
	$('#btnFBPage').on('click', function(){
		_oc.uri.facebook('357555101043476');
	})
	$('#bugReport').on('click', function(){
		_oc.link('../setting/suggest.html', '', 'DEFAULT', 'DEFAULT');
	})
	$('#btnQuestion').on('click', function(){
		_oc.link('../setting/question.html', '', 'DEFAULT', 'DEFAULT');
	})
	$('#btnDday').on('click', function(){
		_oc.href('http://goo.gl/xwrAKo');
	})
}


// 제안
function initReport() {
	
	$('#btnSave').on('click', function(){
		var  description = $('#inputDescription').html()
			,flag = $('#flag').val()
		
		if (flag == '-1') {
			alert('종류를 선택해주세요.');
			return false;
		}
		if (description == '') {
			alert('내용을 입력해주세요.');
			return false;
		}
		
		var data = {}
		data['user_name'] = getSetting('user_name');
		data['phone_number'] = getSetting('user_key');
		data['description'] = description;
		data['flag'] = flag;
		data['user_agent'] = window.navigator.userAgent;
		
		request('fifa_report_insert', data, function(result){
			if (result['result'] == 'success') {
				var  rdata = result['data']
				$('#inputDescription').html('');
				$('#btnSave').off('click');
				if (flag == 'bug') {
					 alert('불편을 드려 죄송합니다. 최대한 빨리 반영하겠습니다.');
				} else if(flag == 'suggest') {
					alert('제안 감사합니다. 검토후 연락드리겠습니다.');
				}
				_oc.back();
			}
		})
	})
	
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

function initQuestion() {
	$('#btnQuestion').on('click', function(){
		var prize = $('#prize').val()
		
		if (prize == '-1') {
			alert('친구에게 무엇을 해주실건가요?');
			return false;
		}
				
		var idx = process(q)
		question = q[idx]
		_oc.api.kakaotalk(question, prize);
	
		
		/*var str = '';
		str += '<div class="modal-dialog">';
		str += '	<div class="modal-content">';
		str += '		<div class="modal-header">';
		str += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		str += '			<h4 class="modal-title" id="modalLabel">선택하세요.</h4>';
		str += '		</div>';
		str += '		<div class="modal-body" id="modalContent">';
		
		str += '<ul class="form-group group-movie-input">';
		str += '	<li data-platform="kakaotalk" id="kakao-link-btn">카카오톡</li>';
		//str += '	<li data-platform="kakaostory">카카오스토리</li>';
		str += '</ul>';
	
		str += '</div>';
		str += '		<div class="modal-footer">';
		str += '			<button type="button" class="btn btn-default" id="btnCloseModal">닫기</button>';
		str += '		</div>';
		str += '	</div>';
		str += '</div>';
		
		$('#modal').modal('show');
		$('#modal').html(str);
		
		$('[data-platform]').on('click', function(){
			var platform = $(this).attr('data-platform')
			
			if(platform == 'kakaotalk') {
				var idx = process(q)
				question = q[idx]
				_oc.api.kakaotalk(question, prize);
			}
			if(platform == 'kakaostory') {
				_oc.api.kakaostory()
			}
			hideModal();
		})
		*/
	})
}

var q = [
	'제 1회 월드컵은 어느나라에서 했을까요?',
	'브라질은 월드컵에서 몇번 우승했을까요?',
	'우리나라가 처음으로 월드컵에 참가한 대회는 어느나라 대회였을까요?',
	'축구 최종 엔트리는 몇명의 선수를 선발할까요?',
	'월드컵 본선진출 국가는 몇 개국일까요?',
	'월드컵 최다 출전국가는 어디일까요?',
	'월드컵 최다 우승국은 어디일까요?',
	'축구는 전후반 몇분씩 경기할까요?',
	'2002년 월드컵에서 우리나라의 첫골은 누가 넣었을까요?',
	'2018년 월드컵 개최지는 어디일까요?',
	'우리나라는 월드컵에서 토너먼트에 몇번 진출했을까요?',
	'브라질월드컵에서 우리나라는 몇조에 속해있을까요? ',
	'브라질월드컵에서 우리나라의 첫경기는 어느나라와 경기할까요?',
	'브라질월드컵 공인구의 이름은 무엇일까요?'
]











