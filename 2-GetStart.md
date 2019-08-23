# Get started with Cloud Firestore
> [本篇網址](https://firebase.google.com/docs/firestore/quickstart?authuser=0)

本篇將展示如何建立Forestore,加入資料,透過console檢查剛加入的資料。
## Create a Cloud Firestore database
1. 在[Firebase console](https://console.firebase.google.com/u/0/)裡按下**Add project**,依照指示建立新的專案或加入現有的服務到GCP專案中。
2. 在console視窗中選擇**Database**,點擊**Create database**。
3. 選擇專案的安全模式
   1. Test mode:用於測試,允許任何讀寫
   2. Locked mode:拒絕任何讀寫,只有後端伺服器(c#/java...)可連接資料庫
4. 選擇地區
   1. 此設定的地區為專案的預設[Google Cloud Platform(GCP) resource location](https://firebase.google.com/docs/firestore/locations?authuser=0#default-cloud-location),注意該地區會用在GCP服務中,尤其是[Cloud Storage bucket](https://firebase.google.com/docs/storage/?authuser=0),以及[App Engine](https://cloud.google.com/appengine/docs/?authuser=0)
   2. 若無法選擇地區,則擁有預設地區。
5. Click Done
6. 初始化完成後,同時啟用了[Cloud API Manager](https://console.cloud.google.com/projectselector/apis/api/firestore.googleapis.com/overview?authuser=0)

## Set up development environment
1. 依照專案類型將需要的依賴項目加入應用程式中
   1. Web
      1. [將Firebase加入專案](https://firebase.google.com/docs/web/setup?authuser=0)
