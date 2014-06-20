var  category = 'game'
	,store = 'https://play.google.com/store/apps/details?id=com.gaeyou.moa.game'

function onReady() {
	
	/* 채널모아보기 */
	if ($('#channelList').length > 0) {
		initEvent();
		initList();
	}
	
	/* 피드보기 */
	if ($('#feedList').length > 0) {
		initEvent();
		initFeed();
	}
	
	/* 즐겨찾기 보기 */
	if ($('#favoriteList').length > 0) {
		initEvent();
		initFavorite();
	}
}


function initEvent() {
	$('#navChannel').on('click', function(){
		var param = ''
		_oc.link('../rss/list.html', param, 'DEFAULT', 'CLEAR_TOP');
	})
	$('#panelChannel').on('click', function(){
		var param = ''
		_oc.link('../rss/list.html', param, 'DEFAULT', 'CLEAR_TOP');
	})
	$('#panelFavorite').on('click', function(){
		var param = ''
		_oc.link('../rss/favorite.html', param, 'DEFAULT', 'CLEAR_TOP');
	})
	$('#panelShare').on('click', function(){
		var msg = '최신 게임뉴스를 한눈에\n게임뉴스 모아보기를 다운받아 보세요.\n' + store
		_oc.share(msg);
	})
	$('#panelFBPage').on('click', function(){
		_oc.uri.facebook('357555101043476');
	})
	
	$('#appsDday').on('click', function(){
		_oc.href('http://goo.gl/xwrAKo');
	})
	$('#appsWorldcup').on('click', function(){
		_oc.href('http://goo.gl/NEphmg');
	})
	
	
	$('#btnPanel').on('click', function(){
		var isOpen = $('#panel').attr('data-open')
		
		if (isOpen == '0') {
			showPanel()
		} else {
			hidePanel()
		}
	})
	$('#navFavorite').on('click', function(){
		var param = ''
		_oc.link('../rss/favorite.html', param, 'DEFAULT', 'CLEAR_TOP');
	})
	
	$('#panelBg').on('click', function(){
		hidePanel()
	})
	$('#btnNew').on('click', function(){
		var param = 'flag=new'
		_oc.link('../content/add.html', param, 'DEFAULT', 'DEFAULT');
	})
}


// 채널리스트
function initList() {
	var data = {}
	data['channel'] = category
	data['user_idx'] = getSetting('user_idx')
	
	request('moa_channel_list', data, function(result){
		if (result['result'] == 'success') {
			var  rdata = result['data']
				,str = ''
			
			$('#loading').css('display', 'none');	
			str += '<dd>';
			str += '	<ul>';
			if (rdata.length == 0) {
				
			} else {
				for (var i in rdata) {
					//var isFav = checkFavorite(rdata[i]['idx'], result['favorites'])
					str += '		<li data-idx="' + rdata[i]['idx'] + '">';
					str += '			<p class="dday">' + rdata[i]['title'] + '</p>';
					str += '			<p class="nickname"><i class="fa fa-briefcase"></i> ' + rdata[i]['count'] + '개의 뉴스모아</p>';
					str += '		</li>';
				}
				str += '	</ul>';
				
				$('#ddayList').html(str);
				
				// 즐겨찾기
				$('[data-favorite]').on('click', function(){
					var  idx = $(this).attr('data-favorite')
						,isFavorite = $(this).attr('data-isfavorite')
						,channelName = $(this).attr('data-channel')
						
					var data = {}
					data['category'] = category;
					data['is_favorite'] = isFavorite;
					data['user_idx'] = getSetting('user_idx');
					data['channel_idx'] = idx;
					data['channel_name'] = channelName;
					data['platform'] = platform;
					data['user_agent'] = window.navigator.userAgent;
					
					request('moa_favorite_insert', data, function(result){
						if (result['result'] == 'success') {
							var  rdata = result['data']
							if (isFavorite == '1') {
								$('[data-favorite="' + idx + '"]')
									.html('<i class="fa fa-star-o fa-2x"></i>')
									.attr('data-isfavorite', '0')
								_oc.toast('즐겨찾기에서 삭제되었습니다.')
							} else {
								$('[data-favorite="' + idx + '"]')
									.html('<i class="fa fa-star fa-2x fa-yellow"></i>')
									.attr('data-isfavorite', '1')
								_oc.toast('즐겨찾기에 추가되었습니다.')
							}
						}
					})
					return false;
				})
				
				// 상세보기
				$('[data-idx]').on('click', function(){
					var  idx = $(this).attr('data-idx')
						,param = 'idx='+idx+'&feed=0'
					
					$(this).addClass('pressed')
					_oc.link('../rss/news.html', param, 'DEFAULT', 'DEFAULT');
				}).on('touchstart', function(){})
				
			}
		}
	})
}

// 즐겨찾기 검증
function checkFavorite(idx, favorites) {
	var favArr = favorites.split(',')
	for (var i in favArr) {
		if (favArr[i] == idx) {
			return true;
		}
	}
	return false;
}


// 피드
var  feedValues = []
	,selFeed
	,myfavorite
function initFeed() {
	selFeed = getParam('feed')
	var data = {}
	data['channel_idx'] = getParam('idx')
	data['category'] = category;
	data['user_idx'] = getSetting('user_idx');
	
	request('moa_feed_list', data, function(result){
		//console.log(result)
		if (result['result'] == 'success') {
			var  rdata = result['data']
				,str = ''
			
			feedValues.length = 0
			for (var i in rdata) {
				//console.log(rdata[i])
				feedValues.push({
					'idx': i,
					'feedIdx': rdata[i]['feed_idx'],
					'feedSeq': rdata[i]['feed_seq'],
					'channelIdx': rdata[i]['channel_idx'],
					'channelTitle': rdata[i]['channel_title'],
					'feedTitle': rdata[i]['feed_title'],
					'rss': rdata[i]['rss_address']
				})
				//console.log(feedValues)
				/*
				if (getParam('feed') == rdata[i]['feed_seq']) {
					var sel = ' selected="selected"'
				} else {
					if (i == selFeed) {
						var sel = ' selected="selected"'
					} else {
						var sel = ''
					}
				}
				str += '<option value="' + rdata[i]['feed_seq'] + '" ' + sel + '>' + rdata[i]['feed_title'] + '</option>'
				*/
			}
			if (!selFeed) {
				selFeed = feedValues[0]['feedSeq']
			}/* else {
				selFeed = feedValues[$('#channels').val()]['feedSeq']
			}*/
			myfavorite = result['favorites']
			isFavorite = checkFavorite(selFeed, myfavorite)
			//console.log(feedValues[getParam('feed')]['feedIdx'], result['favorites'])
			$('#channelTitle').html(rdata[0]['channel_title']);
			$('#channels')
				.attr('data-feed-seq', getParam('feed'))
				.attr('data-feed-idx', feedValues[selFeed]['feedIdx'])
				.html(feedValues[selFeed]['feedTitle'])
				.on('click', function(){
					var titleArr = ''
					for (var i in feedValues) {
						if (i != 0) {
							titleArr += ','
						}
						titleArr += feedValues[i]['feedTitle'];
					}
					
					var  title = '카테고리를 선택하세요.'
						,items = titleArr
						,init = selFeed
						,callback = 'callbackList';
					_oc.list(title, items, init, callback);
					getFeed();
				})
			getFeed();
			
			// 즐겨찾기
			$('#btnFavorite')
				.attr('data-favorite', $('#channels').val())
				.on('click', function(){
					var  idx = $(this).attr('data-feed-idx')
						,isFavorite = $(this).attr('data-is-favorite')
						,channelName = $(this).attr('data-channel-title')
						,channelIdx = $(this).attr('data-channel-idx')
						,feedSeq = $(this).attr('data-feed-seq')
						,rss = $(this).attr('data-rss-address')
						
					var data = {}
					data['category'] = category;
					data['is_favorite'] = isFavorite;
					data['user_idx'] = getSetting('user_idx');
					data['feed_idx'] = idx;
					data['feed_seq'] = feedSeq;
					data['channel_idx'] = channelIdx;
					data['channel_name'] = channelName;
					data['rss_address'] = rss;
					data['platform'] = platform;
					data['user_agent'] = window.navigator.userAgent;
					//console.log(data)
					//return
					request('moa_favorite_insert', data, function(result){
						if (result['result'] == 'success') {
							var  rdata = result['data']
							if (isFavorite == '1') {
								$('#btnFavorite')
									.html('<i class="fa fa-star-o fa-2x"></i>')
									.attr('data-is-favorite', '0')
								_oc.toast('즐겨찾기에서 삭제되었습니다.')
							} else {
								$('#btnFavorite')
									.html('<i class="fa fa-star fa-2x fa-yellow"></i>')
									.attr('data-is-favorite', '1')
								_oc.toast('즐겨찾기에 추가되었습니다.')
							}
						}
					})
				})
		}
	})
}


function callbackList(result) {
	selFeed = result;
	$('#channels')
		.attr('data-feed-idx', feedValues[result]['feedIdx'])
		.attr('data-feed-seq', selFeed)
		.html(feedValues[selFeed]['feedTitle'])
	getFeed();
}

// 뉴스 가져오기
function getFeed() {
	var  url = feedValues[$('#channels').attr('data-feed-seq')]['rss']
		,feedSeq = $('#channels').attr('data-feed-seq')
		
	//selFeed = feedValues[$('#channels').val()]['feedSeq']
	getRss(url, function(data){
		if( !data['result']) {
			var  rss = data['rss']['channel']
				,items = rss['item']
				,str = ''
				,news = []
				
			$('#btnFavorite')
				.attr('data-favorite', feedValues[selFeed]['idx'])
				.attr('data-feed-idx', feedValues[selFeed]['feedIdx'])
				.attr('data-feed-seq', feedValues[selFeed]['feedSeq'])
				.attr('data-channel-title', feedValues[selFeed]['channelTitle'])
				.attr('data-channel-idx', feedValues[selFeed]['channelIdx'])
				.attr('data-rss-address', feedValues[selFeed]['rss'])
			isFavorite = checkFavorite(feedValues[selFeed]['feedIdx'], myfavorite)
			if (isFavorite) {
				$('#btnFavorite')
					.attr('data-is-favorite', '1')
					.html('<i class="fa fa-star fa-2x fa-yellow"></i>')
			} else {
				$('#btnFavorite')
					.attr('data-is-favorite', '0')
					.html('<i class="fa fa-star-o fa-2x"></i>')
			}
			
			$('#loading').css('display', 'none');
			str += '<dd>';
			str += '	<ul>';
			for (var i in items) {
				var  pubdate = items[i]['pubDate'] || items[i]['dc:date']
					,pubDate = '작성일: ' + getTimeFormat(getParam('idx'), pubdate)
					,content = removeTagAll(items[i]['description'], '<img>')
					,link = parseMobileUrl(getParam('idx'), items[i]['link'])
				str += '		<li data-feed="' + link + '">';
				str += '			<p class="dday">' + items[i]['title'] + '</p>';
				if (content['img']) {
					str += '		<div class="feed-description">';
					str += '			<p class="thum">' + content['img'] + '</p>';
					str += '			' + content['description'];
					str += '		</div>';
				} else {
					str += '		<div class="feed-description">' + content['description'] + '</div>';
				}
				
				str += '			<p class="nickname">' + pubDate + '</p>';
				str += '			<p class="nickname">';
				str += '				<button class="btn btn-default" data-share="' + i + '"><i class="fa fa-share-alt"></i> 공유</button>';
				//str += '				<button class="btn btn-default" data-like="' + i + '"><i class="fa fa-thumbs-up"></i> 좋아요</button>';
				str += '			</p>';
				str += '		</li>';
				news.push({
					'title': items[i]['title'],
					'description': content['description'],
					'link': link,
					'date' : pubDate,
					'channelTitle' : feedValues[selFeed]['channelTitle'],
					'feedTitle' : feedValues[selFeed]['feedTitle']
				})
			}
			str += '	</ul>';
			str += '</dd>';
			
			$('#ddayList').html(str);
			
			// 뉴스보기
			$('[data-feed]').on('click', function(){
				var link = $(this).attr('data-feed')
				$(this).addClass('pressed')
				_oc.open(link);
				return false;
			})
			
			// 공유
			$('[data-share]').on('click', function(){
				var idx = $(this).attr('data-share')
					,txt = ''
				txt += '[' + news[idx]['channelTitle'] + ' > ' + news[idx]['feedTitle'] + '] \n'
				txt += news[idx]['title'] + '\n'
				txt += news[idx]['description'] + '\n'
				txt += news[idx]['link'] + '\n\n'
				txt += '===============\n'
				txt += '[게임뉴스 모아보기]\n'
				txt += store

				_oc.share(txt)
				return false;
			})
			
			// 좋아요
			$('[data-like]').on('click', function(){
				var idx = $(this).attr('data-like')
				console.log(news[idx])
				return false;
			})
			
		} else {
			// 오류
			console.log(data['result'])
		}
	})
}

function parseMobileUrl (channel, url) {
	// FNN
	if (channel == '2') {
		var murl = url.replace(/www./, 'm.').replace(/content\.asp/, 'smart/smart_view.asp')
		return murl
	}
	
	// 게임포커스
	if (channel == '5') {
		var murl = url + '&thread=14r01'
		return murl
	}
	
	// 루리웹
	if (  channel == '9' ||
		channel == '10' ||
		channel == '11' ||
		channel == '12' ||
		channel == '13' ||
		channel == '14' ||
		channel == '15' ||
		channel == '16' ||
		channel == '17' ||
		channel == '18' ||
		channel == '19' ||
		channel == '20' ||
		channel == '21' ||
		channel == '22' ) {
			// 웹: http://bbs2.ruliweb.daum.net/gaia/do/ruliweb/default/read?articleId=1432866&objCate1=&bbsId=G003&itemGroupId=40&itemId=&platformId=
			// 모바일: http://m.bbs2.ruliweb.daum.net/gaia/do/mobile/ruliweb/default/etc/93/read?articleId=1432866&bbsId=G003&itemGroupId=40&pageIndex=1&cPageIndex=1
			var murl = url.replace(/bbs2/, 'm.bbs2').replace(/\/ruliweb\//, '/mobile/ruliweb/')
			return murl
	}
	return url;
}

// 시간포맷
function getTimeFormat(channel, t) {
	var  format = 'YYYY년 M월 D일 HH시 mm분 SS초'
		,type1 = 'ddd DD MMM YYYY HH:mm:SS ZZ'
		,type2 = 'YYYY-MM-DD  HH:mm:SS'
		,dt
		
	if (	channel == 1 || 	// 아이뉴스 24
		channel == 4 ||	// 인벤
		channel == 5 ||	// 게임포커스
		channel == 8	// 디스이즈게임
			) {
		dt = moment(t, type1).format(format)
		//console.log(channel, dt + ' -- ' + t)
		return dt;
	}
	if (	channel == 2 || 	// FNN
		channel == 3 ||	// 게임톡
		channel == 6	// 경향게임스
			) {
		dt = moment(t, type2).format(format)
		return dt
	}
	
	// 루리웹
	dt = moment(t, type2).format(format)
	//console.log(channel, dt + ' -- ' + t)
	return dt;
}



// 즐겨찾기
function initFavorite() {
	var data = {}
	data['category'] = category
	data['user_idx'] = getSetting('user_idx')
	
	request('moa_favorite_list', data, function(result){
		//console.log(result)
		if (result['result'] == 'success') {
			var  rdata = result['data']
				,str = ''
			//console.log(rdata)
			$('#loading').css('display', 'none');	
			str += '<dd>';
			str += '	<ul>';
			if (rdata.length == 0) {
				str += '		<li>';
				str += '			<p class="nickname"><i class="fa fa-coffee"></i> 즐겨찾는 채널이 없습니다.</p>';
				str += '		</li>';
				str += '	</ul>';
				
				$('#ddayList').html(str);
			} else {
				for (var i in rdata) {
					//var isFav = checkFavorite(rdata[i]['idx'], result['favorites'])
					str += '		<li data-channel="' + rdata[i]['channel_idx'] + '" data-feed="' + rdata[i]['feed_seq'] + '">';
					str += '			<p class="dday">' + rdata[i]['channel_title'] + '</p>';
					str += '			<p class="nickname"><i class="fa fa-briefcase"></i> ' + rdata[i]['feed_title'] + '</p>';
					str += '			<p class="favorite" ';
					str += '				data-channel-idx="' + rdata[i]['channel_idx'] + '"';
					str += '				data-feed-idx="' + rdata[i]['feed_idx'] + '"';
					str += '				><i class="fa fa-star fa-2x fa-yellow"></i></p>';
					str += '		</li>';
				}
				str += '	</ul>';
				
				$('#ddayList').html(str);
				
				// 즐겨찾기
				$('[data-channel-idx]').on('click', function(){
					var  channelIdx = $(this).attr('data-channel-idx')
						,feedIdx = $(this).attr('data-feed-idx')
						,isFavorite = $(this).attr('data-isfavorite')
						,channelName = $(this).attr('data-channel')
						,isFavorite = '1'
						,thisObj = $(this).parent()
						
					var data = {}
					data['category'] = category;
					data['is_favorite'] = isFavorite;
					data['user_idx'] = getSetting('user_idx');
					data['feed_idx'] = feedIdx;
					data['channel_idx'] = channelIdx;
					
					request('moa_favorite_insert', data, function(result){
						if (result['result'] == 'success') {
							var  rdata = result['data']
							thisObj.remove();
							_oc.toast('즐겨찾기에서 삭제되었습니다.')
							if ($('[data-channel-idx]').length == 0) {
								var str = '';
								str += '<dd>';
								str += '	<ul>';
								str += '		<li>';
								str += '			<p class="nickname"><i class="fa fa-coffee"></i> 즐겨찾는 채널이 없습니다.</p>';
								str += '		</li>';
								str += '	</ul>';
								str += '</dd>';
								$('#ddayList').html(str);
							}
						}
					})
					return false;
				})
				
				// 상세보기
				$('[data-channel]').on('click', function(){
					var  channel = $(this).attr('data-channel')
						,feed = $(this).attr('data-feed')
						,param = 'idx='+channel+'&feed='+feed
					
					$(this).addClass('pressed')
					_oc.link('../rss/news.html', param, 'DEFAULT', 'DEFAULT');
				}).on('touchstart', function(){})
				
			}
		}
	})
}














