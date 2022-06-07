import { throttle } from '@/utils';
// import '../utils/whatsapp-api';
import '../utils/api';

console.log("脚本加载完成!");

const log = (...values: unknown[]) => {
	console.log(...values);
};


/**
 *  获取对话消息
 */
const getChatMessageList = async (id: string) => {

	const chatMsgsInfo = window.Store.Chat.get(id);

	log('chatMsgsInfo', chatMsgsInfo)
	const filterMsgs = (i: { isNotification: any }) => !i.isNotification;
	let chatMsgsLis = chatMsgsInfo.msgs.models.filter(filterMsgs);

	// 获取所有消息 最大取100条 可配置选择是否开启
	// for (; chatMsgsLis.length < 100;) {
	//     try {
	//         const listTemp = await chatMsgsInfo.loadEarlierMsgs();
	//         const loadEarlierMsgs = await chatMsgsInfo.loadEarlierMsgs();
	//         log('loadEarlierMsgs',loadEarlierMsgs)
	//         // log('listTemp', listTemp)
	//         if (!listTemp) break;
	//         chatMsgsLis = [...listTemp.filter(filterMsgs), ...chatMsgsLis];

	//     } catch (error) {
	//         log("异常", error);
	//     }

	//     log("msgs.length==>end", chatMsgsLis.length);
	// }

	chatMsgsLis = chatMsgsLis.map((item: any) => {
		return window.WAPI.getMessageById(item.__x_id._serialized);
	});

	log("chatMsgsLis", chatMsgsLis);

	return chatMsgsLis;
};

/**
 * 获取当前聊天成员
 */
// const getAllChats = throttle(() => {
// 	window.WAPI.getAllChats()
// 		.filter((item: any) => {
// 			return !1 === item.isGroup;
// 		})
// 		.forEach((item: any) => {
// 			item.sourcing = 'sourcing';
// 			getChatMessageList(item.id._serialized)
// 		})

// }, 500);

/** 监听切换聊天窗口 */
window.Store.Chat.on("change:active", async function (values: any) {
	log('values',values)
	// 非active状态的数据不处理
	if (!values.__x_active) return;

	// 获取当前对话用户信息
	const chatInfo = window.WAPI._serializeChatObj(values);
	log('chatInfo', chatInfo);

	// 获取头像
	window.Store.WapQuery.profilePicFind(chatInfo.id.user)
		.then((res: any) =>{
			console.log('res',res)

		})
		.catch((err: unknown) =>{
			log('error', err);
		})
	// try {
	//     const avatarUrl = (await window.Store.WapQuery.profilePicFind(chatInfo.id.user)).eurl;
	//     chatInfo.avatarUrl = avatarUrl;
	//     log("avatarUrl", avatarUrl);
	// } catch (error) {
	//     log("头像获取失败");
	// }
	log('chatInfo.active',chatInfo)
	if (chatInfo.active) {
	    log("切换对话", {
	        ClientInfo: chatInfo,
	        chatActive: {
	            id: chatInfo.id.user,
	            isGroup: chatInfo.isGroup,
	            nickName: chatInfo.name,
	        },
	    })
	}


	const list: any = await getChatMessageList(chatInfo.id._serialized);
	log('list',list)
	window.postMessage({
		isSourcing: true,
		data: list,
		chatInfo
	})

});

/** 监听新消息 */
window.Store.Msg.on("add", function (value: any) {
	if (!value.isNewMsg) return;
	log('add-value', value)

});


/** 监听传递过来的对话列表 */
window.addEventListener("message", async function (value: any) {

	// log('message-value', value);
	// return;

	if (!value.data.isSourcing) return;

	const chatMsgsLis = value.data.data;
	const chatInfo = value.data.chatInfo
	const chatMsgsLisTemp: any = [];

	for (let index = 0; index < chatMsgsLis.length; index++) {
		const element = chatMsgsLis[index];
		const dataTemp = {
			to: {...element.to,name:chatInfo.contact.name} ,
			from: element.from,
			sns_avatar: chatInfo.avatarUrl,
			message_id: element.id,
			send_time: element.t,
			type: element.type,
			ack: element.ack
		};


		const getData = async (id: string) => {
			// log('element',element, element.id)
			try {
				const data = await window.WAPI.downloadMedia(id);
				const dataTemp = window.WAPI.arrayBufferToBase64(data);
				return dataTemp;
			} catch (error) {
				log('下载失败', error)
				return '';
			}
		}
		switch (element.type) {
			case 'chat':
				chatMsgsLisTemp.push({
					...dataTemp,
					body: element.body

				})
				break;

			case "image":
				chatMsgsLisTemp.push({
					...dataTemp,
					body: {
						link: await getData(element.id),
						caption: element.caption
					}

				})

				break;

			case 'revoked':
				break;
			case 'sticker':
				chatMsgsLisTemp.push({
					...dataTemp,
					"body": {
						link: await getData(element.id),
					}

				})
				break;
			case "document":
				chatMsgsLisTemp.push({
					...dataTemp,
					"body": {
						size: element.size,
						caption: element.caption,
						link: await getData(element.id),
						filename: element.filename,
						mimetype: element.mimetype,
					}

				})
				break;

			case "ptt":
				chatMsgsLisTemp.push({
					...dataTemp,
					"body": {
						link: await getData(element.id),
						mimetype: element.mimetype,
					}
				})
				break;

			case "vcard":
				chatMsgsLisTemp.push({
					...dataTemp,
					"body": element.body
				})
				break;

			case "video":
				chatMsgsLisTemp.push({
					...dataTemp,
					"body": {
						"link": element.body,
						"mimetype": element.mimetype,
					}
				})
				break;

			default:
				chatMsgsLisTemp.push(element)
				break;
		}

	}

	log("chatMsgsLisTemp", chatMsgsLisTemp);

})

