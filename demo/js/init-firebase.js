var BrandId = '',FriendId = '';
var userRecirdDone=false,officeRecirdDone=false;
var query_user=null,query_office=null;
var collection=null;
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

                    var records=[];

                    query_user=collection
                        .where('role','==','user')                        
                        .onSnapshot(querySnapshot=>{
                            querySnapshot.docChanges().forEach(ele=>{
                                records.push({
                                    role:ele.doc.data().role,
                                    value:ele.doc.data().value,
                                    time:ele.doc.data().time
                                });                                
                            });
                            userRecirdDone=true;
                            RenderRecord(records);
                        });
                        
                    query_office=collection
                        .where('role','==','office')                        
                        .onSnapshot(querySnapshot=>{                            
                            querySnapshot.docChanges().forEach(ele=>{
                                records.push({
                                    role:ele.doc.data().role,
                                    value:ele.doc.data().value,
                                    time:ele.doc.data().time
                                });                                
                            });
                            officeRecirdDone=true;
                            RenderRecord(records);
                        });                    
                } else {
                    AppendRecord('sys', '聊天記錄不存在');
                    AppendRecord('sys', '解鎖UI');
                    UnlockUI(collection);
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

var RenderRecord=(records)=>{
    if(userRecirdDone&&officeRecirdDone){
        records=records.sort(function(a,b){
            return a.time>b.time?1:-1;
        });
        records.forEach(ele=>{
            AppendRecord(ele.role,ele.value);
        });
        AppendRecord('sys', `聊天紀錄載入完成`);
        UnlockUI(collection);
    }
}

var UnlockUI = (collection) => {
    AppendRecord('sys', '請選擇角色');
    $('#slcRole').prop('disabled', false);
    $('#enterRole').prop('disabled', false);    

    $('#enterRole').click(function () {
        var role = $('#slcRole').val();
        var listenTo =(role=='user'?'office':'user');
        EnterRole(collection, role, listenTo);
    });
}

var EnterRole = (collection, role, listenTo) => {
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

        role=='user'?query_office():query_user();        
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