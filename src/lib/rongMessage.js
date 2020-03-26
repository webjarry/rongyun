class RongMessage {
    constructor(key, token) {
        this.app_key = key;
        this.id = 0;
        RongIMLib.RongIMClient.init(this.app_key);
        this.ImLib = RongIMLib;
        this.ImClient = RongIMClient;
    }

    // 初始化
    init() {
        RongIMClient.setConnectionStatusListener({
            onChanged: function (status) {
                switch (status) {
                    case RongIMLib.ConnectionStatus.CONNECTED:
                        console.log('链接成功');
                        break;
                    case RongIMLib.ConnectionStatus.CONNECTING:
                        console.log('正在链接');
                        break;
                    case RongIMLib.ConnectionStatus.DISCONNECTED:
                        console.log('断开连接');
                        break;
                    case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                        console.log('其他设备登录, 本端被踢');
                        break;
                    case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                        console.log('域名不正确, 请至开发者后台查看安全域名配置');
                        break;
                    case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                        console.log('网络不可用, 此时可调用 reconnect 进行重连');
                        break;
                    default:
                        console.log('链接状态为', status);
                        break;
                }
            }
        });
    }

    // 消息监听
    message(callback) {
        this.init();
        RongIMClient.setOnReceiveMessageListener({
            onReceived: (message) => callback(message)
        });
    }

    // 发送连接
    connect(token) {
        return new Promise((resolve, reject) => {
            RongIMClient.connect(token, {
                onSuccess: (id) => resolve(id),
                onTokenIncorrect: () => {
                    alert("Your token is invalid")
                },
                onError: (code) => reject(code)
            })
        })
    }

    // 历史消息 (不能用  需要开通商业服务授权)
    recording(number, id, time = null) {
        let conversationType = RongIMLib.ConversationType.PRIVATE,
            targetId = id,
            timestrap = time,
            count = number;

        return new Promise((resolve, reject) => {
            this.ImClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
                onSuccess: (list, hasMsg) => resolve(list, hasMsg),
                onError: (error) => reject(error)
            });
        })
    }

    // 发送消息
    submitMessage(value, id) {
        return new Promise((resolve, reject) => {
            var msg = new RongIMLib.TextMessage({content: value, extra: value});
            var conversationType = RongIMLib.ConversationType.PRIVATE;
            var targetId = id;  // 目标 Id

            RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
                onSuccess: (message) => resolve(message),
                onError: (code) => reject(code)
            });
        })
    }

    // 接听通话
    answerCall() {
        let CallType = RongIMLib.VoIPMediaType,
            targetId = '36',
            params = {
            conversationType: RongIMLib.ConversationType.PRIVATE,
            targetId: targetId,
            mediaType: CallType.MEDIA_VIDEO
        };


        rongCallLib.accept(params, function(error){
            if (error) {
                console.error('接听通话失败', error);
            }
        });
    }

    // 拒绝通话
    refuseCall() {
        var targetId = '36';
        var params = {
            conversationType: RongIMLib.ConversationType.PRIVATE,
            targetId: targetId
        };
        rongCallLib.reject(params, function(error){
            if (error) {
                console.error('拒绝通话失败', error);
            }
        });
    }
}
