var BrandId = '', FriendId = '';
var getUserRecord = false, getOfficeRecord = false;
var query_user = null, query_office = null;
var collection = null;
var isInitialized = false;
var records = [];
$(document).ready(() => {
    try {
        BrandId = $('#BrandId').val();
        FriendId = $('#FriendId').val();

        firebase.initializeApp(firebaseConfig);
        var db = firebase.firestore();
        collection = db.collection(`${BrandId}-${FriendId}`);

        AppendRecord('sys', '連線已經建立');
        AppendRecord('sys', '開始檢查聊天記錄');

        CollectionExisted(collection,
            result => {
                if (result) {
                    AppendRecord('sys', '聊天記錄已存在');
                    AppendRecord('sys', '開始載入聊天記錄');
                } else {
                    AppendRecord('sys', '聊天記錄不存在');
                }
                query_user = collection
                    .where('role', '==', 'user')
                    .onSnapshot(querySnapshot => {
                        querySnapshot.docChanges().forEach(ele => {
                            records.push({
                                role: ele.doc.data().role,
                                value: ele.doc.data().value,
                                time: ele.doc.data().time
                            });
                        });
                        getUserRecord = true;
                        RenderRecord();
                    });

                query_office = collection
                    .where('role', '==', 'office')
                    .onSnapshot(querySnapshot => {
                        querySnapshot.docChanges().forEach(ele => {
                            records.push({
                                role: ele.doc.data().role,
                                value: ele.doc.data().value,
                                time: ele.doc.data().time
                            });
                        });
                        getOfficeRecord = true;
                        RenderRecord();
                    });
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

var RenderRecord = () => {
    if (getUserRecord && getOfficeRecord) {
        records = records.sort(function (a, b) {
            return a.time > b.time ? 1 : -1;
        });
        records.forEach(ele => {
            AppendRecord(ele.role, ele.value);
        });
        AppendRecord('sys', `聊天紀錄載入完成`);
        records = [];
        if (!isInitialized) {
            isInitialized = true;
            UnlockUI();
        }
    }
}

var UnlockUI = () => {
    AppendRecord('sys', '請選擇角色');
    $('#slcRole').prop('disabled', false);
    $('#enterRole').prop('disabled', false);

    $('#enterRole').click(function () {
        var role = $('#slcRole').val();
        var listenTo = (role == 'user' ? 'office' : 'user');
        EnterRole(role, listenTo);
    });
}

var EnterRole = (role, listenTo) => {
    try {
        $('#slcRole').prop('disabled', true);
        $('#enterRole').prop('disabled', true);

        $(`#btn${role}Send`).prop('disabled', false);
        $(`#btn${role}Send`).click(function () {
            InsertData(collection,
                {
                    role: role,
                    value: $(`#${role}Input`).val(),
                    time: new Date(),
                    isReaded: false
                },
                result => {
                    AppendRecord(role, $(`#${role}Input`).val());
                },
                err => {
                    AppendRecord('sys', `發送訊息發生錯誤: ${err}`);
                }
            );
        });
        $(`.${role}`).show();

        AppendRecord('sys', `已選擇${role} 始監聽 ${listenTo}`);
        role == 'user' ? query_user() : query_office();
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