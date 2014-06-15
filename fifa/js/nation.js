var  match_idx
	,flag = 'nation'
	,replyStart = 0
	,replyTotal = 10

function onReady() {
	match_idx = getParam('idx');
	
	/* 참가국 */
	if ($('#nation').length > 0) {
		initNationList();
	}
	
	/* 참가국 상세보기 */
	if ($('#nationDetailView').length > 0) {
		initDetailView();
	}
}


// 참가국
function initNationList() {
	var data = {}
	
	request('fifa_nation_list', data, function(result){
		if (result['result'] == 'success') {
			var  rdata = result['data']
				,str = ''
			
			for (var i in rdata) {
				flag = 'flag_s_' + rdata[i]['name_short'].toLowerCase();
				
				str += '<dd class="type2">';
				str += '	<ul>';
				str += '		<li data-match="' + rdata[i]['idx'] + '">';
				str += '			<p class="description"><span class="' + flag + '"></span> ' + rdata[i]['name_ko'] + '</p>';
				str += '			<p class="time">조: ' + rdata[i]['group'] + '조</p>';
				str += '			<p class="time">피파랭킹: ' + rdata[i]['fifa_ranking'] + '위</p>';
				str += '			<p class="time">대륙: ' + rdata[i]['continent'] + '</p>';
				str += '		</li>';
				str += '	</ul>';
				str += '</dd>';
			}
			$('#nationList').html(str);
			$('[data-match]').on('click', function(){
				var  idx = $(this).attr('data-match')
					,param = 'idx='+idx
				_oc.link('../nation/view.html', param, 'DEFAULT', 'DEFAULT');
			}).on('touchstart', function(){})
		}
	})
}


// 국가 상세보기
function initDetailView() {
	var data = {}
	data['nation_idx'] = match_idx
	
	request('fifa_nation_view', data, function(result){
		if (result['result'] == 'success') {
			var  rdata = result['data']
				,nation = '<span class="flag_' + rdata['name_short'].toLowerCase() + '"></span> ' + rdata['name_ko']
				,flag = 'flag_' + rdata['name_short'].toLowerCase()
				,flag = '<span class="' + flag + '"></span> ' + rdata['name_ko'] 
				,player = rdata['players']
				,str = ''
				
			
			console.log(rdata)
			$('#nation').html(rdata['name_ko'])
			$('#nationFlag').html(flag);
			if (rdata['group']) {
				str += '<li>조: ' + rdata['group'] + '조</li>'
			}
			if (rdata['continent']) {
				str += '<li>대륙: ' + rdata['continent'] + '</li>'
			}
			if (rdata['fifa_ranking']) {
				str += '<li>피파랭킹: ' + rdata['fifa_ranking'] + '</li>'
			}
			$('#nationDetail').html(str);
			
			str = '';
			if (player.length == 0) {
				str += '<li data-player="">엔트리는 곧 준비중입니다.</li>';
			} else {
				for (var i in player) {
					var  pinfo = ''
					
					if (player[i]['position']) {
						pinfo += player[i]['position'] + ': ';
					}
					if (player[i]['name']) {
						pinfo += player[i]['name'];
					}
					if (player[i]['back_number']) {
						pinfo += ' (No.' + player[i]['back_number'] + ')';
					}
					str += '<li data-player="' + player[i]['idx'] + '">' + pinfo + '</li>';
				}
			}
			$('#plyersList').html(str);
			initReply('nation')
		}
	})
}


// 댓글 가져오기
function initReply(flag) {
	initReplyAdd();
	getReplyList();
}















