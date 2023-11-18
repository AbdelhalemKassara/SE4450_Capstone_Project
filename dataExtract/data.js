const data = require('csvtojson')

const fs = require('fs');

data().fromFile("../Data/csvFiles/2019/2019 Canadian Election Study - Online Survey v1.0.csv").then(data => {
    console.log(data);
})


data().fromFile("../Data/csvFiles/2019/CES19_dictionarycoding_public_release_final.csv").then(data => {
    console.log(data);
})

data().fromFile("../Data/csvFiles/2020/Democracy Checkup 2020 v1.0.csv").then(data => {
    console.log(data);
})


data().fromFile("../Data/csvFiles/2021/2021 Canadian Election Study v1.0.csv").then(data => {
    console.log(data);
})

data().fromFile("../Data/csvFiles/2021/CES21_dictionarycoding_public_release_final.csv").then(data => {
    console.log(data);
})

data().fromFile("../Data/csvFiles/2022/Democracy Checkup 22_V1.csv").then(data => {
    console.log(data);
})