const BrandId = $('#BrandId').val();
const FriendId = $('#FriendId').val();
$(document).ready(() => {
    try {
        firebase.initializeApp(firebaseConfig);
        var db = firebase.firestore();
        var collection = db.collection(`${BrandId}-${FriendId}`);

        AppendRecord('sys', '連線已經建立');
        AppendRecord('sys', '開始檢查聊天記錄');
        CheckIsIntied(collection,
            result => {
                if (result) {
                    AppendRecord('sys', '聊天記錄已存在');
                    AppendRecord('sys', '開始載入聊天記錄');
                    var userChat=[];
                    var officeChat=[];
                    LoadRecords(collection,
                        data => {
                            data.forEach(ele => {
                                var row = ele.data();
                                switch (row.role) {
                                    case 'user':
                                        userChat.push(row.time);
                                        break;
                                    case 'office':
                                        officeChat.push(row.time);
                                        break;
                                }
                                AppendRecord(row.role, row.value);
                            });
                            var lastUserChatTime = userChat[userChat.length - 1];
                            var lastOfficeChatTime = officeChat[officeChat.length - 1];
                            AppendRecord('sys', '解鎖UI');
                            FuncionizeUI(collection, lastUserChatTime, lastOfficeChatTime);
                        },
                        err => {
                            console.log(err);
                        }
                    )
                } else {
                    AppendRecord('sys', '聊天記錄不存在');
                    AppendRecord('sys', '解鎖UI');
                    FuncionizeUI(collection);
                }
            },
            err => {
                AppendRecord('sys', `檢查聊天記錄發生例外: ${err}`);
            }
        );
    }
    catch (e) {
        AppendRecord('sys', `例外錯誤${e}`);
    }
});

var SendMsg = (collection, role, msg) => {
    collection.add({
        role: role,
        value: msg,
        time: new Date(),
        isReaded: false
    })
        .then((result) => {
            AppendRecord(role, msg);
        })
        .catch((err) => {
            AppendRecord('sys', `發送訊息發生錯誤: ${err}`);
        });
}

var CheckIsIntied = (collection, callback, fail) => {
    collection.get({ source: 'server' })
        .then(
            result => {
                callback(!result.empty);
            },
            err => {
                fail(err)
            }
        )
}

var LoadRecords = (collection, callback, fail) => {
    collection.orderBy('time').get({ source: 'server' })
    .then(
        result => {
            callback(result);
        },
        err => {
            fail(err)
        }
    )
}

var FuncionizeUI = (collection, lastUserChatTime = null, lastOfficeChatTime = null) => {
    AppendRecord('sys', '請選擇角色');
    $('#slcRole').prop('disabled', false);
    $('#enterRole').prop('disabled', false);

    $('#enterRole').click(function () { EnterRole(collection, lastUserChatTime, lastOfficeChatTime) });
}

var EnterRole = (collection, lastUserChatTime = null, lastOfficeChatTime = null) => {
    try {
        $('#slcRole').prop('disabled', true);
        $('#enterRole').prop('disabled', true);
        var listenTo = '';
        var lasttimeOfListenTo = null;
        switch ($('#slcRole').val()) {
            case 'user':
                listenTo = 'office';
                lasttimeOfListenTo = lastOfficeChatTime;
                $('#btnUserSend').prop('disabled', false);
                $('#btnUserSend').click(function () {
                    SendMsg(collection, 'user', $('#userInput').val());
                });
                $('.user').show();
                break;
            case 'office':
                listenTo = 'user';
                lasttimeOfListenTo = lastUserChatTime;
                $('#btnOfficeSend').prop('disabled', false);
                $('#btnOfficeSend').click(function () {
                    SendMsg(collection, 'office', $('#officeInput').val());
                });
                $('.office').show();
                break;
        }

        AppendRecord('sys', `已選擇${$('#slcRole').val()} 始監聽 ${listenTo}`);

        var query=null;

        if (lasttimeOfListenTo !== null) {
            query=collection.where('role', '==', listenTo).where('time', '>', lasttimeOfListenTo);
        } else {
            query=collection.where('role', '==', listenTo);
        }

        query.onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(ele => {
                AppendRecord('sys', `收到訊息,類型: ${ele.type}`);
                //console.log(ele);
                switch (ele.type) {
                    case 'added':
                        AppendRecord(ele.doc.data().role, ele.doc.data().value);
                        break;
                    case 'modified':
                        //console.log(ele.doc.data());
                        break;
                    case 'removed':
                        //console.log(ele.doc.data());
                        break;
                }
            });
        });
    } catch (e) {
        AppendRecord('sys', `發生例外: ${e}`);
    }
};

var AppendRecord = (role, value) => {
    var table = '#tbdMsgs';
    if (role == 'sys') {
        table = '#tbSysMsgs';
    }
    var tr = $('<tr>', {
        class: `${role}Speak`
    });
    $('<td>', {
        text: `${value}`
    }).appendTo(tr);
    tr.appendTo(table);
};