### 電影清單app後端
[電影清單app](https://movie-app-717.herokuapp.com)的後端，同樣部署在heroku，負責用戶登入、註冊、電影清單紀錄與jwt token驗證。
#### herokuapp.com上的jwt驗證
由於此後端的jwt token是使用cookie給予，雖然在localhost上可以正常運作，但基於herokuapp.com網域對cookie使用的[安全政策](https://devcenter.heroku.com/articles/cookies-and-herokuapp-com)，不允許對其它herokuapp.com的app傳送cookie（除非另尋網域），因此電影清單app上的token驗證未能運作。
