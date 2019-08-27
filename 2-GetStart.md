# Get started with Cloud Firestore
> [本篇網址](https://firebase.google.com/docs/firestore/quickstart?authuser=0)

本篇將展示如何建立Forestore,加入資料,透過console檢查剛加入的資料。
## Create a Cloud Firestore database
1. 在[Firebase console](https://console.firebase.google.com/u/0/)裡按下**Add project**,依照指示建立新的專案或加入現有的服務到GCP專案中。
2. 在console視窗中選擇**Database**,點擊**Create database**。
3. 選擇專案的安全模式
   1. Test mode:用於測試,允許任何讀寫
   2. Locked mode:拒絕任何讀寫,透過撰寫規則,限制資料庫存取(例如只有後端伺服器可連接)
4. 選擇地區
   1. 此設定的地區為專案的預設[Google Cloud Platform(GCP) resource location](https://firebase.google.com/docs/firestore/locations?authuser=0#default-cloud-location),注意該地區會用在GCP服務中,尤其是[Cloud Storage bucket](https://firebase.google.com/docs/storage/?authuser=0),以及[App Engine](https://cloud.google.com/appengine/docs/?authuser=0)
   2. 若無法選擇地區,則擁有預設地區。
5. Click Done
6. 初始化完成後,同時啟用了[Cloud API Manager](https://console.cloud.google.com/projectselector/apis/api/firestore.googleapis.com/overview?authuser=0)

## Set up development environment
1. 依照專案類型將需要的依賴項目加入應用程式中
   1. Web
      1. [將Firebase加入專案](https://firebase.google.com/docs/web/setup?authuser=0)
      2. 引入必須的js
    ```html
    <script src="https://www.gstatic.com/firebasejs/6.4.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/6.4.0/firebase-firestore.js"></script>
    ```
2. 初始化Firestore
   ***注意:你必須已經取得用以初始化Firestore的config檔***
   ```js
      //.initializeApp()方法需傳入config作為參數
      firebase.initializeApp({
            apiKey: '### FIREBASE API KEY ###',
            authDomain: '### FIREBASE AUTH DOMAIN ###',
            projectId: '### CLOUD FIRESTORE PROJECT ID ###'
      });

      var db = firebase.firestore();
   ```
3. 寫入資料
   1. Firestore將資料儲存在`documents`,documents儲存在`collections`
   2. 在初次將資料寫入document時會自動建立collection,不需手動建立
   ```js
   db.collection("users").add({
      first: "Ada",
      last: "Lovelace",
      born: 1815
   }).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
   }).catch(function(error) {
      console.error("Error adding document: ", error);
   });
   ```
4. 讀取資料
   1. 透過`.get()查詢資料`
   2. .get()會返回`Promise`,用以異步處理
   ```js
   db.collection("users").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      });
   });
   ```
5. 保護資料
   1. 若你的專案基於**Web**,**Android**,**iOS**,請使用[Firebase Authentication](https://firebase.google.com/docs/auth/?authuser=0)與[Cloud Firestore安全規則](https://firebase.google.com/docs/firestore/security/get-started?authuser=0)來保護資料。
   2. 在[Rules tab](https://console.firebase.google.com/u/0/project/_/database/firestore/rules)中撰寫讀寫規則
      ```js
      // Allow read/write access on all documents to any user signed in to the application
      service cloud.firestore {
          match /databases/{database}/documents {
              match /{document=**} {
                  allow read, write: if request.auth.uid != null;
              }
          }
      }
      ```