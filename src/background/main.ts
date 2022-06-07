// chrome.runtime.

chrome.tabs.query({}, function (data) {
	console.log(data);

})


// chrome.browserAction.onClicked.addListener(function (tab) {
// 	// // 扩展向内容脚本发送消息
// 	console.log('tab', tab);

// });



/**
 * 向tabs页面发送数据
 * @param id tab_id
 * @param data 发送的数据
 */
const sendMessage = (id: string, data: any) => {

	chrome.browserAction.onClicked.addListener(function (tab) {
		// // 扩展向内容脚本发送消息
		// chrome.tabs.sendMessage(id, data, function (response) {
		// 	console.log(response.farewell);
		// });
	});
}
