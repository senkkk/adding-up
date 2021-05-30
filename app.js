'use strict';

//fs=FileSystem：ファイルを扱うためのモジュールを読み込む
const fs = require('fs');
//readline：ファイルを一行ずつ読み込むためのモジュールを読み込む
const readline = require('readline');

const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });

//key：都道府県、value：集計データのオブジェクト
const prefectureDataMap = new Map();

//rlで、「line」イベントが発生したタイミングで実行される
rl.on('line', lineString => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);

    if (year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture);
        if(!value){
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }

        if (year === 2010){
            value.popu10 = popu;
        }
        else {
            value.popu15 = popu;
        }

        prefectureDataMap.set(prefecture, value);
    }
});

//すべての行を読み込み終わった際の呼び出し
rl.on('close', () => {
    for (const [key,value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;
    }

    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });

    const rankingStrings = rankingArray.map(([key, value]) => {
        return (
            key +
            ': ' +
            value.popu10 +
            '=>' +
            value.popu15 +
            ' 変化率:' +
            value.change
        )
    });

    console.log(rankingStrings);
});