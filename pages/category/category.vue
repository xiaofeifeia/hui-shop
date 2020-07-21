<template>
	<view>
		<!--顶部搜索导航栏-->
		<rf-search-bar @search="toSearch" title="扫一扫" icon="iconsaomiao" :placeholder="hotSearchDefault" />
		<view class="category-list">
			<!-- 左侧分类导航 -->
			<scroll-view scroll-y="true" class="left">
				<view class="row" v-for="(category, index) in categoryList" :key="category.id" :class="[category.id == showCategoryIndex ? 'on' : '']"
				 @click="showCategory(category.id)">
					<view class="text">
						<view class="block"></view>
						{{ category.name }}
					</view>
				</view>
			</scroll-view>
			<!-- 右侧子导航 -->
			<scroll-view scroll-y="true" class="right">
				<view class="category" v-for="(category, index) in categoryList" :key="index" v-show="category.id == showCategoryIndex">
					<view v-for="(box, i) in category.children" :key="i">
						<view style="text-align: center">
							<text style="color: gainsboro">—</text>
							<text style="color: #000000;margin-right: 8px;margin-left: 8px">{{ box.name }}</text>
							<text style="color: gainsboro">—</text>
						</view>
						<view class="list" v-if="box.children.length>0">
							<view class="box" v-for="(item, i1) in box.children" :key="i1" @tap="navTo(`/pages/product/list?cate_id=${item.id}`)">
								<image @click="toCategory(item.name)" :src="item.image" lazy-load="https://www.gomyorder.cn/logo.png"></image>
								<view class="text">{{ item.name }}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<rf-empty :bottom="bottom" :info="'暂无产品分类~'" v-if="categoryList.length === 0 && !loading"></rf-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
	import rfSearchBar from '@/components/rf-search-bar';

	//高德SDK
	export default {
		components: {
			rfSearchBar
		},
		data() {
			return {
				hotSearchDefault: '请输入关键字', // 搜索默认关键字
				showCategoryIndex: 1,
				headerPosition: 'fixed',
				categoryList: [],
				loading: false
			}

		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = 'fixed';
			} else {
				this.headerPosition = 'absolute';
			}
		},
		onLoad() {
			this.getCategoryTree();
		},
		methods: {
			// 获取商品分类列表
			async getCategoryTree() {
				this.loading = true;
				const res = await this.$myRequest({
					url: '/api/category/getCategoryTree'
				});
				this.categoryList = res.data;
				this.loading = false;
			},
			//分类切换显示
			showCategory(index) {
				this.showCategoryIndex = index;
			},
			toCategory(name) {
				uni.navigateTo({
					url: '/pages/categray/search?cid=' + this.showCategoryIndex + '&name=' + name
				});
			},
			// 跳转至搜索详情页
			toSearch() {
				this.$mRouter.push({
					route: `/pages/index/search/search?data=${JSON.stringify(this.search)}`
				});
			},
			// 跳转至商品列表
			navTo(route) {
				this.$mRouter.push({
					route
				});
			}
		}
	};
</script>
<style lang="scss">
	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
	}

	.header {
		width: 92%;
		padding: 0 4%;
		height: 100rpx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */

		.addr {
			width: 120rpx;
			height: 60rpx;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			font-size: 28rpx;

			.icon {
				height: 60rpx;
				margin-right: 5rpx;
				display: flex;
				align-items: center;
				font-size: 42rpx;
				color: #ffc50a;
			}
		}

		.input-box {
			width: 100%;
			height: 60rpx;
			background-color: #f5f5f5;
			border-radius: 30rpx;
			position: relative;
			display: flex;
			align-items: center;

			.icon {
				display: flex;
				align-items: center;
				position: absolute;
				top: 0;
				right: 0;
				width: 60rpx;
				height: 60rpx;
				font-size: 34rpx;
				color: #c0c0c0;
			}

			input {
				padding-left: 28rpx;
				height: 28rpx;
				font-size: 28rpx;
			}
		}

		.icon-btn {
			width: 60rpx;
			height: 60rpx;
			flex-shrink: 0;
			display: flex;

			.icon {
				width: 60rpx;
				height: 60rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 42rpx;
			}
		}
	}

	.place {
		background-color: #ffffff;
		height: 100rpx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}

	.category-list {
		width: 100%;
		background-color: #fff;
		display: flex;

		.left,
		.right {
			top: 100rpx;
			bottom: 0rpx;
		}

		.left {
			position: fixed;
			width: 24%;
			left: 0rpx;
			background-color: #f2f2f2;

			.row {
				width: 100%;
				height: 90rpx;
				display: flex;
				align-items: center;

				.text {
					width: 100%;
					position: relative;
					font-size: 28rpx;
					display: flex;
					justify-content: center;
					color: #3c3c3c;

					.block {
						position: absolute;
						width: 0rpx;
						left: 0;
					}
				}

				&.on {
					height: 100rpx;
					background-color: #fff;

					.text {
						font-size: 30rpx;
						font-weight: 600;
						color: #2d2d2d;

						.block {
							width: 10rpx;
							height: 80%;
							top: 10%;
							background-color: #f06c7a;
						}
					}
				}
			}
		}

		.right {
			margin-left: 24%;
			width: 76%;
			left: 24%;

			.category {
				width: 94%;
				padding: 20rpx 3%;

				.banner {
					width: 100%;
					height: 24.262vw;
					border-radius: 10rpx;
					overflow: hidden;
					box-shadow: 0rpx 5rpx 20rpx rgba(0, 0, 0, 0.3);

					image {
						width: 100%;
						height: 24.262vw;
					}
				}

				.list {
					margin-top: 40rpx;
					width: 100%;
					display: flex;
					flex-wrap: wrap;

					.box {
						width: calc(65.44vw / 3);
						margin-bottom: 30rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-wrap: wrap;

						image {
							width: 60%;
							height: calc(71.44vw / 3 * 0.6);
						}

						.text {
							margin-top: 5rpx;
							width: 100%;
							display: flex;
							justify-content: center;
							font-size: 26rpx;
						}
					}
				}
			}
		}
	}
</style>
