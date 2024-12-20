/*
 * @Description: 配置导入控制器
 * @Autor: xxx
 * @Date: xxx
 */

import { assetManager } from "cc";
import { csv_open, rs_make_tab } from "./CsvLoader";
import { TextAsset } from "cc";
import { resMgr } from "../Managers/ResMgr";


export const ONLINE_CSV_HASH = "90db225638717d689ca1b90a67ba804ff84c820d";


export class ConfigsCtrl {
    
    // 单例
    private static _instance: ConfigsCtrl = null!;
    static get instance() {
        if (!this._instance) {
            this._instance = new ConfigsCtrl();
        }
        return this._instance;
    }

    //public CSVType : CUSTOM_BUNDLE_NAME = CUSTOM_BUNDLE_NAME.CSV; 

    // 当前缓存的所有配置
    private _configs: { [key: string]: any; } = {};
    public get configs(): Readonly<{ [key: string]: any; }> {
        return this._configs;
    }


    private _configMaxKeys: { [key: string]: any; } = {};
    public get configMaxKeys(): Readonly<{ [key: string]: any; }> {
        return this._configMaxKeys;
    }


    // 加载表项配置
    loadConfigs(progress: (now: number, total: number) => void, complete: () => void, errCb: Function, csvType: string) {

        let bundle = assetManager.getBundle(csvType);

        resMgr.loadResDir("csv/", (finish: number, total: number) => {
            if (progress) progress(finish, total);
        }, (err: Error | null, assets: TextAsset[]) => {
            if (err) {
                if (errCb) {
                    // errCb();
                }
                console.error("load configs failed!", err);
                return;
            }

            for (let i = 0, j = assets.length; i < j; i++) {
                let rs = csv_open(assets[i].text);
                let csvName = "";
                try {
                    csvName = assets[i].name;
                    let tab = rs_make_tab(csvName, rs);
                    {
                        this._configs[csvName] = tab.tab
                        this._configMaxKeys[csvName] = tab.maxKey
                    }
                    assetManager.releaseAsset(assets[i]);
                } catch (error) {
                    console.error(`在读取${csvName}表的时候出错了`)
                    console.error(error);
                    assetManager.releaseAsset(assets[i]);
                    if (errCb) {
                        // errCb();
                    }
                    return;
                }
            }

            // console.log("configs:", this._configs);

            if (complete) complete();
        });
    }

    // 热更
    hotUpdateConfigs(datas: string) {
        if (!datas) return;

        try {
            let csvList = datas.slice(1).split('\n\n');
            for (let i = 0; i < csvList.length; i++) {
                const csv = csvList[i];
                let infos = csv.split('\n');
                let csvName = infos[0];
                let rs = csv_open(infos.slice(1).join('\n'));
                try {
                    let tab = rs_make_tab(csvName, rs);
                    let data = tab.tab
                    this._configMaxKeys[csvName] = tab.maxKey
                    let origin = this._configs[csvName];
                    if (origin) {
                        for (const key in data) {
                            const val = data[key];
                            this._configs[csvName][key] = val;
                            // console.warn("hot update conf, key=", key, ",val=", val);
                        }
                    }
                } catch (error) {
                    console.error(error);
                    return;
                }
            }
        } catch (error) {
            console.error(error);
        }

        // EventListener.dispatchEvent(ClientEvents.UPDATED_CONFIG)

        // console.log("hot update configs:", this._configs);

    }
};

/**
 * 获取配置文件
 * 例：let confs = GET_CONF<ConfT.ActHeroSkin>("actHeroSkin");
 * @author: qiaomingwu
 * @param {string} name 配置文件名，需要指定泛型T（类型位于命名空间ConfT）
 * @param {number} key_n 表示由多个id通过|组成key
 */
function GetConfigs<T>(name: string): { [key: string]: Readonly<T> } | undefined;
function GetConfigs<T>(name: string, key1: number | string): Readonly<T> | undefined;
function GetConfigs<T>(name: string, key1: number | string, key2: number | string): Readonly<T> | undefined;
function GetConfigs<T>(name: string, key1: number | string, key2: number | string, key3: number | string): Readonly<T> | undefined;
function GetConfigs<T>(name: string, key1?: number | string, key2?: number | string, key3?: number | string): { [key: string]: Readonly<T> } | Readonly<T> | undefined {

    let confs: { [key: string]: T } | undefined = ConfigsCtrl.instance.configs[name];
    if (!confs) return;

    if (key1 === undefined) return confs;

    //多个key表示ID、ID1、ID2最多三个
    let realKey = String(key1);
    if (key2 !== undefined) realKey += `|${key2}`;
    if (key3 !== undefined) realKey += `|${key3}`;

    if (!confs[realKey]) {
        return undefined;
    } else {
        return confs[realKey];
    }
};

function GetConfigMaxKey(name: string): number {
    let conf = ConfigsCtrl.instance.configMaxKeys[name];
    if (!conf)
        return 0;
    return conf
};

export { GetConfigs, GetConfigMaxKey };
