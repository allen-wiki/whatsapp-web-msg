/**
 * Auto discovery the webpack object references of instances that contains all functions used by the WAPI
 * functions and creates the Store object.
 */
if (!window.Store) {
	(function () {
		function getStore(modules: any[]) {
			let foundCount = 0;
			let neededObjects = [
				{ id: "Store", conditions: (module: { default: { Chat: any; Msg: any; }; }) => (module.default && module.default.Chat && module.default.Msg) ? module.default : null },
				{ id: "MediaCollection", conditions: (module: { default: { prototype: { processAttachments: any; }; }; }) => (module.default && module.default.prototype && module.default.prototype.processAttachments) ? module.default : null },
				{ id: "MediaProcess", conditions: (module: { BLOB: any; }) => (module.BLOB) ? module : null },
				{ id: "Wap", conditions: (module: { createGroup: any; }) => (module.createGroup) ? module : null },
				{ id: "ServiceWorker", conditions: (module: { default: { killServiceWorker: any; }; }) => (module.default && module.default.killServiceWorker) ? module : null },
				{ id: "State", conditions: (module: { STATE: any; STREAM: any; }) => (module.STATE && module.STREAM) ? module : null },
				{ id: "WapDelete", conditions: (module: { sendConversationDelete: string | any[]; }) => (module.sendConversationDelete && module.sendConversationDelete.length == 2) ? module : null },
				{ id: "Conn", conditions: (module: { default: { ref: any; refTTL: any; }; }) => (module.default && module.default.ref && module.default.refTTL) ? module.default : null },
				{ id: "WapQuery", conditions: (module: { queryExist: any; default: { queryExist: any; }; }) => (module.queryExist) ? module : ((module.default && module.default.queryExist) ? module.default : null) },
				{ id: "CryptoLib", conditions: (module: { decryptE2EMedia: any; }) => (module.decryptE2EMedia) ? module : null },
				{ id: "OpenChat", conditions: (module: { default: { prototype: { openChat: any; }; }; }) => (module.default && module.default.prototype && module.default.prototype.openChat) ? module.default : null },
				{ id: "UserConstructor", conditions: (module: { default: { prototype: { isServer: any; isUser: any; }; }; }) => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null },
				{ id: "SendTextMsgToChat", conditions: (module: { sendTextMsgToChat: any; }) => (module.sendTextMsgToChat) ? module.sendTextMsgToChat : null },
				{ id: "SendSeen", conditions: (module: { sendSeen: any; }) => (module.sendSeen) ? module.sendSeen : null },
				{ id: "sendDelete", conditions: (module: { sendDelete: any; }) => (module.sendDelete) ? module.sendDelete : null },
				{ id: "downloadManager", conditions: (module: { downloadManager: any; }) => (module.downloadManager) ? module.downloadManager : null },
				{ id: 'profilePicFind', conditions: (module: { profilePicFind: any; }) => (module.profilePicFind ? module.profilePicFind : null), },
			];
			for (let idx in modules) {
				if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
					neededObjects.forEach((needObj: any) => {
						if (!needObj.conditions || needObj.foundedModule)
							return;
						let neededModule = needObj.conditions(modules[idx]);
						if (neededModule !== null) {
							foundCount++;
							needObj.foundedModule = neededModule;
						}
					});

					if (foundCount == neededObjects.length) {
						break;
					}
				}
			}

			let neededStore: any = neededObjects.find((needObj) => needObj.id === "Store");
			window.Store = neededStore?.foundedModule ? neededStore?.foundedModule : {};
			neededObjects.splice(neededObjects.indexOf(neededStore), 1);
			neededObjects.forEach((needObj:any) => {
				if (needObj.foundedModule) {
					window.Store[needObj.id] = needObj.foundedModule;
				}
			});

			window.Store.Chat.modelClass.prototype.sendMessage = function (e: any) {
				window.Store.SendTextMsgToChat(this, ...arguments);
			}

			return window.Store;
		}

		if (typeof webpackJsonp === 'function') {
			webpackJsonp([], { 'parasite': (x: any, y: any, z: any[]) => getStore(z) }, ['parasite']);
		} else {
			let tag = new Date().getTime();
			webpackChunkwhatsapp_web_client.push([
				["parasite" + tag],
				{},
				function (o: { (arg0: string): any; m: any; }, e: any, t: any) {
					let modules = [];
					for (let idx in o.m) {
						let module = o(idx);
						// console.log('module',module);

						modules.push(module);
					}
					getStore(modules);
				}
			]);
		}

	})();
}


window.WAPI = {
	lastRead: {}
};

window.WAPI._serializeRawObj = (obj: { toJSON: () => any; }) => {
	if (obj) {
		return obj.toJSON();
	}
	return {}
};


/**
 * Serializes a chat object
 * 序列化一个聊天对象
 * @param rawChat Chat object
 * @returns {{}}
 */

 window.WAPI._serializeChatObj = (obj: { [x: string]: any; kind: any; isGroup: any; } | undefined) => {
	if (obj == undefined) {
		return null;
	}

	return Object.assign(window.WAPI._serializeRawObj(obj), {
		kind: obj.kind,
		isGroup: obj.isGroup,
		contact: obj['contact'] ? window.WAPI._serializeContactObj(obj['contact']) : null,
		groupMetadata: obj["groupMetadata"] ? window.WAPI._serializeRawObj(obj["groupMetadata"]) : null,
		presence: obj["presence"] ? window.WAPI._serializeRawObj(obj["presence"]) : null,
		msgs: null
	});
};

window.WAPI._serializeContactObj = (obj: { formattedName: any; isHighLevelVerified: any; isMe: any; isMyContact: any; isPSA: any; isUser: any; isVerified: any; isWAContact: any; profilePicThumb: any; statusMute: any; } | undefined) => {
	if (obj == undefined) {
		return null;
	}

	return Object.assign(window.WAPI._serializeRawObj(obj), {
		formattedName: obj.formattedName,
		isHighLevelVerified: obj.isHighLevelVerified,
		isMe: obj.isMe,
		isMyContact: obj.isMyContact,
		isPSA: obj.isPSA,
		isUser: obj.isUser,
		isVerified: obj.isVerified,
		isWAContact: obj.isWAContact,
		profilePicThumbObj: obj.profilePicThumb ? WAPI._serializeProfilePicThumb(obj.profilePicThumb) : {},
		statusMute: obj.statusMute,
		msgs: null
	});
};

window.WAPI._serializeProfilePicThumb = (obj: { eurl: any; id: any; img: any; imgFull: any; raw: any; tag: any; } | undefined) => {
	if (obj == undefined) {
		return null;
	}

	return Object.assign({}, {
		eurl: obj.eurl,
		id: obj.id,
		img: obj.img,
		imgFull: obj.imgFull,
		raw: obj.raw,
		tag: obj.tag
	});
};

window.WAPI._serializeMessageObj = (obj: { [x: string]: any; id: { _serialized: any; remote: any; }; isGroupMsg: any; isLink: any; isMMS: any; isMedia: any; isNotification: any; isPSA: any; type: any; } | undefined) => {
	if (obj == undefined) {
		return null;
	}

	return Object.assign(window.WAPI._serializeRawObj(obj), {
		id: obj.id._serialized,
		sender: obj["senderObj"] ? WAPI._serializeContactObj(obj["senderObj"]) : null,
		timestamp: obj["t"],
		content: obj["body"],
		isGroupMsg: obj.isGroupMsg,
		isLink: obj.isLink,
		isMMS: obj.isMMS,
		isMedia: obj.isMedia,
		isNotification: obj.isNotification,
		isPSA: obj.isPSA,
		type: obj.type,
		chat: WAPI._serializeChatObj(obj['chat']),
		chatId: obj.id.remote,
		quotedMsgObj: WAPI._serializeMessageObj(obj['_quotedMsgObj']),
		mediaData: window.WAPI._serializeRawObj(obj['mediaData'])
	});
};

window.WAPI.processMessageObj = function (messageObj: { isNotification: any; id: { fromMe: boolean; }; }, includeMe: any, includeNotifications: any) {
	if (messageObj.isNotification) {
		if (includeNotifications)
			return WAPI._serializeMessageObj(messageObj);
		else
			return;
		// System message
		// (i.e. "Messages you send to this chat and calls are now secured with end-to-end encryption...")
	} else if (messageObj.id.fromMe === false || includeMe) {
		return WAPI._serializeMessageObj(messageObj);
	}
	return;
};


window.WAPI.getMessageById = function (id: any, done: ((arg0: boolean) => void) | undefined) {
	let result = false;
	try {
		let msg = window.Store.Msg.get(id);
		if (msg) {
			result = WAPI.processMessageObj(msg, true, true);
		}
	} catch (err) { }

	if (done !== undefined) {
		done(result);
	} else {
		return result;
	}
};

/**
 * 下载资源
 */
 window.WAPI.downloadMedia = function (id: string) {
	const e = window.WAPI.getMessageById(id);
	console.log(e);

	return window.Store.downloadManager.downloadAndDecrypt(
		{
			directPath: e.directPath,
			encFilehash: e.encFilehash,
			filehash: e.filehash,
			mediaKey: e.mediaKey,
			mediaKeyTimestamp: e.mediaKeyTimestamp,
			type: e.type,
			mode: 'manual',
			signal: new AbortController().signal,
		}
	)
}

window.WAPI.arrayBufferToBase64 = function (data: any) {
	let a = "";
	const t = new Uint8Array(data),
		e = t.byteLength;
	for (let i = 0; i < e; i++)
		a += String.fromCharCode(t[i]);
	return window.btoa(a);
}
