var  store = 'https://play.google.com/store/apps/details?id=com.gaeyou.arcade'

function onReady() {
	window.openInterface.checkKakaoSession();
}

// 카카오정보를 서버에 저장함
var firstRun = true;
function cbGetStoryProfile(result) {
	var  rdata = M.json(result)
		,nickname = rdata['nickname']
		,thumnail = rdata['thumnail']
	
	if (thumnail == 'null' || thumnail == null || thumnail == '') {
		thumnail = 'http://arcade.gaeyou.com/m/images/default.png';
	}
	
	if (firstRun) {
		var data = {};
	
		data['user_idx'] = getSetting('user_idx');
		data['story_nickName'] = nickname;
		data['story_thumnail'] = thumnail;
		data['sns_platform'] = 'kakaotalk';
		_oc.sendPost('arcade_member_token_update_v2', data, 'cbPostYeyakMemberTokenUpdate');
		_oc.log(getSetting('user_idx') +'  --  '+nickname +"  --  "+ thumnail)
	}
	firstRun = false;
}

function cbPostYeyakMemberTokenUpdate(result) {
	_oc.log(result);
	if (result['result'] == 'success') {
		var param = ''
		_oc.link('../game/new.html', param, 'CLEAR_TOP', 'DEFAULT')
	}
}






















