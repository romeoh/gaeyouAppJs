var  store = 'https://play.google.com/store/apps/details?id=com.gaeyou.poll'

function onReady() {
	
	/* 올리기 */
	if ($('#action').length > 0) {
		//_oc.toast(getParam('content_idx'))
		initService();
	}
	
}


/* 올리기 */
function initService() {
	var  data = {}
	
	data['user_idx'] = getSetting('user_idx');
	//data['account_idx'] = getSetting('account_idx');
	data['content_idx'] = getParam('uniq');
	//_oc.toast("user_idx: "+getSetting('user_idx')+" -- uniq: "+getParam('uniq'))
	_oc.sendPost('yeyak_action', data, 'cbPostYeyakAction');
}


function cbPostYeyakAction(result) {
	rdata = result['data']
	console.log(result)
	if (rdata['story_msg'] == '' || rdata['story_msg'] == 'ApiLimitExceedException') {
		var reservationDate = moment(rdata['reservation_date'], 'YYYY-MM-DD HH:mm:SS').lang('ko').format('YYYY.MM.DD A HH:mm')
			,condition = '<span class="reservation-complete"><i class="fa fa-check-circle-o"></i> 등록완료</span>'
		
		$('#profile').attr('src', rdata['story_profile'])
		$('#storyName').html(rdata['story_nickname'])
		$('#reservationDate').html(reservationDate)
		$('#condition').html(condition)
		
		if (rdata['type'] == '2') {
			var  images = rdata['image'].split(',')
				,str = ''
			for (var i in images) {
				str += '<img src="http://yeyak.gaeyou.com/upload/content/' + images[i] + '">';
			}
			$('#img').html(str)
		}
		if (rdata['type'] == '3') {
			$('#url').html(url)
		}
		
		$('#description').html(rdata['description'])
		
		var dateInfo = ''
		dateInfo += '<p class="text-primary">예약한 시간: ' + rdata['reservation_date'] + '</p>';
		dateInfo += '<p class="text-primary">등록한 시간: ' + rdata['reg_date'] + '</p>';
		$('#date-box').html(dateInfo)
		
		$('#btnList').on('click', function(){
			_oc.link('../yeyak/list.html');
		})
		$('#btnKill').on('click', function(){
			// story_id
			_oc.kill();
		})
		
		_oc.vabrator(500);
		_oc.toast('예약하신 이야기를 카스에 등록했습니다.');
		//window.location.reload();
	} else {
		_oc.toast(rdata['story_msg']);
	}
}












