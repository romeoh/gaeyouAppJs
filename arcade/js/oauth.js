var  store = 'https://play.google.com/store/apps/details?id=com.gaeyou.arcade'

function onReady() {
	
	/* 로그인 */
	if ($('#login').length > 0) {
		// 카카오스토리 로그인
		$('#btnLogin').on('click', function(){
			var param = 'user_idx=' + getSetting('user_idx');
			_oc.link('http://arcade.gaeyou.com/m/oauth/request.php?' + param, '', 'CLEAR_TOP', 'DEFAULT');
		})
	}
}

























