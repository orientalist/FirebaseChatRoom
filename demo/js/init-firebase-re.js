var brandId='',friendId='';
var collection=null;
$(document).ready(()=>{
    try{
        brandId='brand0001';
        friendId='friend0001';

        firebase.initializeApp(firebaseConfig);
        var db=firebase.firestore();
        collection=db.collection(`${brandId}-${friendId}`);
        AppendRecord('sys', '連線已經建立');
        AppendRecord('sys', '開始檢查聊天記錄');

        CollectionExisted(collection,
            result=>{
                if(result){
                    AppendRecord('sys', '聊天記錄已存在');
                }else{
                    AppendRecord('sys', '聊天記錄不存在');
                }
                AppendRecord('sys', '開始監聽聊天');
                ListenToAllChange(collection,'time',
                callback=>{
                    AppendRecord(callback.doc.data().role,callback.doc.data().value);
                },
                fail=>{
                    AppendRecord('sys', `監聽聊天發生例外: ${fail}`);
                });
                UnlockUI(collection);
            },
            err=>{
                AppendRecord('sys', `檢查聊天記錄發生例外: ${err}`);
            }
        );
    }
    catch(e){
        AppendRecord('sys', `進入點錯誤: ${e}`);
    }
});

var UnlockUI=(collection)=>{
    AppendRecord('sys', '請選擇角色');
    $('#slcRole').prop('disabled', false);
    $('#enterRole').prop('disabled', false);

    $('#enterRole').click(function () {
        var role = $('#slcRole').val();
        var listenTo = (role == 'user' ? 'office' : 'user');
        EnterRole(collection,role, listenTo);
    });
}

var EnterRole=(collection,role, listenTo)=>{
    try{
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
                    AppendRecord('sys', `資料寫入成功-role:${role},value:${$(`#${role}Input`).val()}`);
                },
                err => {
                    AppendRecord('sys', `發送訊息發生錯誤: ${err}`);
                }
            );
        });
        AppendRecord('sys', `已選擇${role} 始監聽 ${listenTo}`);
        $(`.${role}`).show();
    }catch(e){
        AppendRecord('sys', `寫入例外: ${e}`);
    }
}

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