const base_url = 'http://localhost:8874';
export default (params) => {
	uni.showLoading({
		title: '加载中...'
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: base_url + params.url,
			method: params.method || 'GET',
			data: params.data || {},
			success: (res) => {
				console.log(res)
				uni.hideLoading();
				uni.stopPullDownRefresh();
				if (res.statusCode !== 200) {
					return uni.showToast({
						title: '获取数据失败'
					})
				}
				if (res.data.code !== 200) {
					return uni.showToast({
						title: '获取数据失败'
					})
				}
				resolve(res.data)
			},
			fail: (error) => {
				uni.hideLoading();
				uni.stopPullDownRefresh();
				uni.showToast({
					title: '请求接口失败'
				});
				reject(error)
			}
		})
	})
}
