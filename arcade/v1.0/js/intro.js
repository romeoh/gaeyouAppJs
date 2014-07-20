function onReady() {
	if ($('#intro').length > 0) {
		//_oc.log("user_idx: " + getSetting('user_idx'));
		if (getSetting('user_idx')) {
			getAccessToken();
			//_oc.link('yeyak/list.html', '', 'CLEAR_TOP', 'DEFAULT');
		} else {
			_oc.getRegistrationId('cbRegistrationId');
		}
	}
	
}




// 폰번호 입력
var registrationId;
function cbRegistrationId(jsonText) {
	registrationId = jsonText
	_oc.getPhoneNumber('cbPhone');
}

// 폰번호 입력
function cbPhone(phoneNum, dvcid) {
	var  pnum = phoneNum.replace(/\+82/, '0')
		,deviceId = dvcid
		,data = {}
	
	data['user_number'] = pnum
	data['user_device'] = deviceId
	data['reg_id'] = registrationId
	data['user_agent'] = window.navigator.userAgent
	data['platform'] = platform
	
	_oc.sendPost('arcade_member_insert', data, 'cbPostYeyakMemberInsert');
}

function cbPostYeyakMemberInsert(result) {
	if (result['result'] == 'success') {
		var rdata = result['data']
		setSetting('user_idx', rdata['user_idx'])
		setSetting('user_key', rdata['user_key'])
		//_oc.link('oauth/login.html', '', 'CLEAR_TOP', 'DEFAULT');
		//initLogin();
		getAccessToken()
	}
}

// access token체크
function getAccessToken() {
	var data = {}
	
	data['user_idx'] = getSetting('user_idx')
	_oc.sendPost('arcade_get_token', data, 'cbPostYeyakGetToken');
}

function cbPostYeyakGetToken(result) {
	var rdata = result['data']
	if (rdata['access_token'] == '') {
		_oc.link('oauth/login.html', '', 'CLEAR_TOP', 'DEFAULT');
	} else {
		_oc.link('game/new.html', '', 'CLEAR_TOP', 'DEFAULT');
	}
}


























