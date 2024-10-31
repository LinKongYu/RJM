/*
 * @Description: csv加载器
 * @Autor: xxx
 * @Date: xxx
 */

import { ClassStorege, GetGameData, GetGameDataKeyIndex } from "./CsvData";

function csv_parse(line: string, lineIdx: number) {
    var res: string[] = [];
    var pos = 0;
    var sep = ',';

    while (true) {
        var c = line.charAt(pos);
        if (c == '"') {
            // quoted value (ignore separator within)
            var txt = "";
            do {
                var startp = line.indexOf('"', pos);
                var endp = line.indexOf('"', startp + 1);
                if (endp == -1) throw 'quote NOT paired';

                txt = txt + line.substring(startp + 1, endp);
                pos = endp + 1;
                c = line.charAt(pos);
                if (c == '"') txt = txt + '"';
                // check first char AFTER quoted string, if it is another
                // quoted string without separator, then append it
                // this is the way to "escape" the quote char in a quote. example:
                //   value1,"blub""blip""boing",value3  will result in blub"blip"boing  for the middle
            } while (c == '"');
            res.push(txt);
            pos++;
            // console.assert(c == sep || c == "");
            if (c == "") break;
        } else {
            // no quotes used, just look for the first separator
            var startp = line.indexOf(sep, pos);
            if (startp >= 0) {
                res.push(line.substring(pos, startp));
                pos = startp + 1;
            } else {
                // no separator found -> use rest of string and terminate
                res.push(line.substring(pos));
                break;
            }
        }
    }

    return res;
}

function csv_open(source: string) {
    var rs: string[][] = [];
    let idx = 0;
    source.split('\n').forEach(line => {
        line = line.replace(/\r+$/, '');

        if (line == '') return;

        rs.push(csv_parse(line, idx++));
    });
    return rs;
}

function rs_make_meta(rs: any): number {
    if (rs.length < 2)
        throw "rs: less than 2 rows";
    if (rs[0].length < 1)
        throw "rs: no columns found";

    var meta: { cols: any, types: any[] } = {
        cols: rs[0],
        types: [],
    };
    rs.meta = meta;

    //多个ID，更换唯一id
    let keyCnt = 0;
    for (var i = 0; i < rs[1].length; i++) {
        let colName: string = meta.cols[i];
        if (!colName.match(/^ID\d*$/)) break;
        keyCnt++;
    }

    let typesArr: string[] = rs[1];
    // types
    for (var i = 0; i < typesArr.length; i++) {
        meta.types.push(typesArr[i]);
    }

    return keyCnt;
}

function rs_get_val(v: string, t: string, csv : string) {
    switch (t) {
        case "int":
        case "Int":
        case "int64":
        case "Int64":
        case "float":
        case "int32":
            return Number(v);

        case "string":
        case "String":
        case "byte":
            return JSON.parse(JSON.stringify(v.replace(/\\n/g, '\n')));
        //new String(v)// ;;

        case "int32array":
        case "int32Array":
            let retArr: number[] = [];
            if (v !== "") {
                let arr = v.split('#');
                for (let i = 0; i < arr.length; i++) {
                    const val = arr[i];
                    retArr.push(Number(val));
                }
            }
            return retArr;

        case "int32arrayarray":
        case "int32ArrayArray":
            let retArrArr: number[][] = [];
            if (v !== "") {
                let arrArr = v.split(';');
                for (let i = 0; i < arrArr.length; i++) {
                    const arr = arrArr[i].split('#');
                    let tmpArr: number[] = [];
                    for (let j = 0; j < arr.length; j++) {
                        const val = arr[j];
                        tmpArr.push(Number(val));
                    }
                    retArrArr.push(tmpArr);
                }
            }
            return retArrArr;

        default:
            console.warn(`csv: ${csv}, rs_get_val, invalid val type: "${t}"`);
            return v;
    }
}

function rs_make_tab(name:string, rs: any) {
    var tab: { [key: string]: any } = {};
    let maxKey = 0

    // make meta
    let keyCnt = rs_make_meta(rs);

    // rows
    for (var i = 2; i < rs.length; i++) {
        var row = rs[i];

        //var obj: { [key: number]: any } = {};
        let gameData = null
        let keyIndex = null

        if (ClassStorege[name])
        {
            gameData = GetGameData(name)
            keyIndex = GetGameDataKeyIndex(name)
            gameData.datas = new Array(rs.meta.types.length)
        }
        else
        {
            gameData = {};
        }

        //合并所有ID组成新的key
        let key = row[0];
        if (keyCnt > 1) {
            for (let i = 1; i < keyCnt; i++) {
                key += `|${row[i]}`;
            }
        }
        tab[key] = gameData;

        // cols
        for (var j = 0; j < rs.meta.types.length; j++) {
            if (j >= row.length){
                console.error(`第${i}行的列数不太够，应该有${rs.meta.types.length}列, 实际上只有${row.length}列->这一行：${row.join().toString()}`)
            }
            if (keyCnt == 1 && j == 0) {
                let tp = rs.meta.types[j];
                if (row.length > 0 && tp == "int") {
                    let rowVal = row[j];
                    maxKey = Math.max(maxKey, rs_get_val(rowVal, tp, name));
                }
            }

            var col = rs.meta.cols[j];
            let rowVal = row[j];
            let tp = rs.meta.types[j];
            if (gameData.datas)
            {
                gameData.datas[keyIndex[col]] = rs_get_val(rowVal, tp, name);
            }
            else
            {
                gameData[col] = rs_get_val(rowVal, tp, name);
            }
            
        }
    }

    return {tab, maxKey};
}

export { csv_open, rs_make_tab }
