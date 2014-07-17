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

var canSelected = false
	,accountList
	
function cbPostYeyakMemberAccount(result) {
	if (result['result'] == 'success') {
		var rdata = result['data']
			,str = ''
			,accountIdx = getSetting('account_idx')
			,active
		
		accountList = rdata;
		//console.log(rdata)	
		for (var i in rdata) {
			if (accountIdx == rdata[i]['idx']) {
				active = '<i class="fa fa-check"></i> '
				canSelected = true;
			} else {
				active = ''
			}
			str += '<li class="list-group-item" data-account="' + rdata[i]['idx'] + '">' + active;
			str += '	<img src="' + rdata[i]['story_profile'] + '" class="profile">' + rdata[i]['story_nickname'];
			str += '		<button class="btn btn-default log-out" data-logout="' + rdata[i]['idx'] + '">연결해제</button>';
			str += '</li>';
		}
		$('#account').html(str)
		$('[data-account]').on('click', function(){
			var idx = $(this).attr('data-account')
			setSetting('account_idx', idx);
			_oc.link('../yeyak/list.html')
		})
		
		// 로그아웃
		$('[data-logout]').on('click', function(){
			var  idx = $(this).attr('data-logout')
				,data = {}
			
			if (!confirm('이 계정을 연결해제 하시겠습니까?')) {
				return false;
			}
			data['user_idx'] = getSetting('user_idx')
			data['account_idx'] = idx
			
			_oc.sendPost('yeyak_member_logout', data, 'cbPostYeyakMemberLogout');
			return false;
		})
		if (!canSelected) {
			refreshAccount();
		}
	}
}

function cbPostYeyakMemberLogout(result) {
	_oc.toast('연결해제 되었습니다.');
	window.location.reload();
}

// account idx refresh
function refreshAccount() {
	if (accountList.length != 0) {
		setSetting('account_idx', accountList[0]['idx']);
		$('[data-account="' + accountList[0]['idx'] + '"]').prepend('<i class="fa fa-check"></i> ');
	} else {
		setSetting('account_idx', '');
	}
}




















