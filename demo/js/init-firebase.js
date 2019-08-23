const BrandId = $('#BrandId').val();
const FriendId = $('#FriendId').val();
$(document).ready(() => {
    try {
        firebase.initializeApp(firebaseConfig);
        var db = firebase.firestore();
        var collection=db.collection(BrandId);
        var document = db.collection(BrandId).doc(FriendId);

        console.log('開始檢查紀錄')
        var promise = CheckIsIntied(document);

        promise.then(
            result => {
                console.log('紀錄檢查完成');
                if (!result.exists) {
                    console.log('未建立紀錄,初始化紀錄');
                    InitializeRecord(document).then(
                        result => {
                            console.log('紀錄初始化成功');
                            FuncionizeUI(document,collection);
                        },
                        err => {
                            console.log(`紀錄初始化失敗,錯誤訊息: ${err}`);
                        }
                    );
                } else {
                    console.log('已建立紀錄');
                    LoadRecords(document,
                        result => {                            
                            result.forEach(ele => {
                                AppendRecord(ele.role,ele.value);                                
                            });
                        },
                        err => {
                            console.log(err)
                        });
                    FuncionizeUI(document,collection);
                }
            },
            err => {
                console.log('檢查紀錄發生錯誤');
            }
        );
    }
    catch (e) {
        console.log(e);
    }
});

var sendMsg = (document, role, msg) => {
    document.set({
        role: role,
        value: msg,
        time: new Date(),
        isReaded: false
    },{merge:true})
        .then((result) => {
            AppendRecord(role,msg);            
        })
        .catch((err) => {
            console.log(err);
        });
}

var CheckIsIntied = (document) => {
    return document.get({ source: 'server' });
}

var InitializeRecord = (document) => {
    return document.set({        
    })
}

var LoadRecords = (document, callback, fail) => {
    document.get({ source: 'server' })
        .then(res => {
            callback(res.data());
        },
            err => {
                fail(err);
            })
}

var FuncionizeUI = (document,collection) => {
    console.log('解鎖UI');
    $('#btnUserSend').prop('disabled', false);
    $('#btnUserSend').click(function () {
        sendMsg(document, 'user', $('#userInput').val());
    });
    $('#btnOfficeSend').prop('disabled', false);
    $('#btnOfficeSend').click(function () {
        sendMsg(document, 'office', $('#officeInput').val());
    });
    console.log('開始監聽資料庫變化');
    collection.where('friendId','==',FriendId).onSnapshot(querySnapshot=>{
        querySnapshot.docChanges().forEach(ele=>{
            switch(ele.type){
                case 'added':
                console.log('新增');
                console.log(ele.doc.data());
                break;
                case 'modified':
                console.log('修改');
                console.log(ele.doc.data());
                break;
                case 'removed':
                console.log('刪除');
                console.log(ele.doc.data());
                break;
            }
        });
    });
}

var AppendRecord=(role,value)=>{
    var tr = $('<tr>', {
        class: `${role}Speak`
    });
    $('<td>', {
        text: `${value}`
    }).appendTo(tr);
    tr.appendTo("#tbdMsgs");
};