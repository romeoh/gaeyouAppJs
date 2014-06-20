function onReady() {
	if (getSetting('user_key')) {
		_oc.link('rss/list.html', '', 'CLEAR_TOP', 'DEFAULT');
	} else {
		_oc.getRegistrationId('cbRegistrationId');
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
	data['category'] = category
	
	request('moa_member_insert', data, function(result){
		if (result['result'] == 'success') {
			var rdata = result['data']
			setSetting('user_idx', rdata['user_idx'])
			setSetting('user_key', rdata['user_key'])
			setSetting('user_name', rdata['user_name'])
			_oc.link('rss/list.html', '', 'DEFAULT', 'DEFAULT');
		}
	})
	
}