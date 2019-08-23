# Firestore
> [本篇網址](https://firebase.google.com/docs/firestore/?authuser=0)

1. Firebase是一款彈性,可格式化的NoSql資料庫
2. 他藉由即時監聽器,使資料在端點間保持同步

***
### 主要能力
1. Flexibility
   1. 分級的結構
   2. 資料組成`documents`,`documents`組成`collections`
   3. Documents可為複雜的巢狀結構
2. Expressive querying
   1. 預設包含索引
   2. 可一次查詢一到多筆document
   3. 可使用`多重`,`鍊式`篩選器以及排序
   4. 查詢成本基於查詢結果而非整個資料集
3. Realtime updates
   1. 同步更新資料至所有連接中的應用
   2. 然而Firestore設計用以一次性,簡單地取得資料
4. Offline support
   1. Cloud Firestore會cache應用程式正在使用的資料
   2. 故應用程式在離線時仍可查詢資料
   3. 在上線後可及時將資料同步至線上
5. Designed to Scale
   1. 自動多地資料備份
   2. 高度一致性保證
   3. 自動批量運作
   4. 實際交易支持
***
### Firestore如何運作?
Cloud Forestore是一款`cloud-hosted`的應用,iOS,Android,Web可透過SDKs連接至NoSQL資料庫。
資料以`document`形式儲存,包含`field`對應其`value`,並集合成`collection`,document可包含多種形式的資料,如string,number,甚至是巢狀物件以及子collection。
此外,查詢語法為`ecpressive(表現式)`,高效與彈性的,透過`shallow queries`在document級查詢資料,而不是回傳整個`collection`。也可以為查詢加入排序,篩選以及限制以回傳資料。
為保持應用程式中的資料與Firestore同步,而不需要當資料有變更時回傳整個資料集,需要加入`realtime listener(即時監聽者)`,用以只傳遞變更的資料。
Android,iOS,javaScript透過`Firestore Authentication`與`Cloud Firestore Security Rules`,server-side透過`Identity Access Management(IAM)`以保護資料庫安全。
***
### 實作過程
1. 將SDKs整合入應用程式
2. 為資料加入安全保護
3. 寫入資料
4. 讀取資料