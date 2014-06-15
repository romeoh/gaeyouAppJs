function onReady() {
	if (getSetting('user_key')) {
		_oc.link('schedule/league.html', '', 'CLEAR_TOP', 'DEFAULT');
	} else {
		_oc.getPhoneNumber('cbPhone');
	}
}

// 폰번호 입력
function cbPhone(phoneNum) {
	var pnum = phoneNum.replace(/\+82/, '0')
	setSetting('user_key', pnum);
	_oc.link('schedule/league.html', '', 'DEFAULT', 'DEFAULT');
}