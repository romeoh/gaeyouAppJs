function onReady() {
	_oc.log('user_idx: '+getSetting('user_idx') + ' -- user_name: '+getSetting('user_name') + ' -- user_level: '+getSetting('user_level'))
	if ($('#intro').length > 0) {
		if (!getSetting('user_idx') || !getSetting('user_name')) {
			var data = {}
			data['user_idx'] = getSetting('user_idx')
			_oc.sendPost('ztalk_setting', data, 'cbPostIntro');
		} else {
			goFriend()
		}
	}
	
}

function cbPostIntro(result) {
	var rdata = result['data']
	if (rdata['nickname'] == '') {
		_oc.getDevice('cbDevice');
	} else {
		setSetting('user_name', rdata['nickname'])
		goFriend();
	}
}

// 폰번호 입력
function cbDevice(info) {
	var  result = M.json(info)
		,pnum = result['phoneNumber'].replace(/\+82/, '0')
		,data = {}
	
	data['user_number'] = pnum
	data['user_device'] = result['deviceId']
	data['reg_id'] = result['registrationId']
	data['language'] = result['language']
	data['user_agent'] = window.navigator.userAgent
	data['platform'] = platform
	//_oc.log(M.json(data))
	_oc.sendPost('ztalk_member_insert', data, 'cbPostYeyakMemberInsert');
}

function cbPostYeyakMemberInsert(result) {
	if (result['result'] == 'success') {
		var rdata = result['data']
		setSetting('user_idx', rdata['user_idx'])
		setSetting('user_key', rdata['user_key'])
		_oc.link('talk/setting.html', '', 'CLEAR_TOP', 'DEFAULT');
	}
}

function goFriend() {
	_oc.link('talk/friend.html', '', 'CLEAR_TOP', 'DEFAULT');
}



























