var  store = 'https://play.google.com/store/apps/details?id=com.gaeyou.yeyak'

function onReady() {
	
	/* 로그인 */
	if ($('#login').length > 0) {
		// 카카오스토리 로그인
		$('#btnLogin').on('click', function(){
			var param = 'user_idx=' + getSetting('user_idx') + '&flag=' + getParam('flag') || '';
			_oc.link('http://yeyak.gaeyou.com/m/oauth/request.php?' + param, '', 'CLEAR_TOP', 'DEFAULT');
		})
	}
	
	/* 계정관리 */
	if ($('#account').length > 0) {
		
		$('#btnAdd').on('click', function(){
			var param = 'flag=add'
			_oc.link('../oauth/login.html', param, 'CLEAR_TOP')
		})
		
		var data = {}
		
		data['user_idx'] = getSetting('user_idx')
		_oc.sendPost('yeyak_member_account', data, 'cbPostYeyakMemberAccount');
	}
}

function cbPostYeyakMemberAccount(result) {
	if (result['result'] == 'success') {
		var rdata = result['data']
			,str = ''
			,accountIdx = getSetting('account_idx')
			,active
		
		console.log(rdata)	
		for (var i in rdata) {
			if (accountIdx == rdata[i]['idx']) {
				active = '<span class="badge"><i class="fa fa-check"></i></span>'
			} else {
				active = ''
			}
			str += '<li class="list-group-item" data-account="' + rdata[i]['idx'] + '"><img src="' + rdata[i]['story_profile'] + '" class="profile">' + rdata[i]['story_nickname'] + active + '</li>'
		}
		$('#account').html(str)
		$('[data-account]').on('click', function(){
			var idx = $(this).attr('data-account')
			setSetting('account_idx', idx);
			_oc.link('../yeyak/list.html')
		})
	}
}


// 이벤트
function initEvent() {
	$('#help').on('click', function(){
		var str = '';
		str += '<div class="modal-dialog">';
		str += '	<div class="modal-content">';
		str += '		<div class="modal-header">';
		str += '			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		str += '			<h4 class="modal-title" id="modalLabel">카스예약 올리기란?</h4>';
		str += '		</div>';
		str += '		<div class="modal-body" id="modalContent">';
		
		str += '<div class="form-group group-movie-input">';
		str += '	<img src="/m/images/help.png" style="width:100%">';
		str += '</div>';
	
		str += '</div>';
		str += '		<div class="modal-footer">';
		str += '			<button type="button" class="btn btn-primary" id="btnCloseModal">닫기</button>';
		str += '		</div>';
		str += '	</div>';
		str += '</div>';
		
		$('#modal').modal('show');
		$('#modal').html(str);
		
		$('#btnCloseModal').on('click', function(){
			hideModal();
		})
	})
}























