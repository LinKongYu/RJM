import { _decorator } from 'cc';
import UIView from '../framework/ui/UIView';
import { GetConfigs } from '../framework/csv/CsvCtrl';

const { ccclass, property } = _decorator;




class FoodSource {

    id: number;

    foodId: number;

    foodCnt: number;

    maxCnt: number;

    produceTIme: number;
}

class food

class FoodFinal {

    id: number;



}

@ccclass('WorkWin')
export class WorkWin extends UIView {


    private curFood: number = 0;

    private 

    // 场景初始
    onInit() {
        app.log.info('分包场景1_初始');
    }

    // 分包名称
    public static get pack(): string {
        return 'resources';
    }

    // 资源路径
    public static get url(): string {
        return 'views/WorkWin';
    }

    /** 点击打开按钮 */
    CC_ClickOpen() {
        // app.ui.showScene(TwoUI);
        app.ui.openWin("WorkWin");

    }
}
