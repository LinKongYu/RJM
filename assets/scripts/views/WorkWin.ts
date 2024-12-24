import { _decorator, Node, Sprite, Color, EventTouch, random, randomRangeInt, Label} from 'cc';
import UIView from '../framework/ui/UIView';
import { GetConfigs } from '../framework/csv/CsvCtrl';

const { ccclass, property } = _decorator;


class FoodStore {

    id: number;

    foodId: number;

    foodCnt: number;

    maxCnt: number;

    produceTIme: number;
}


class FoodFinal {

    id: number;



}

@ccclass('WorkWin')
export class WorkWin extends UIView {

    @property([Node])
    node_customers: Node[] = [];

    @property([Node])
    node_parts: Node[] = [];

    private curNeed: number[] = [];

    private curFood: number[] = [];

    // 场景初始
    onInit() {
        app.log.info('分包场景1_初始');
    }

    protected start(): void {
        this.dispatchCustomer()
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

    CC_OnClickFood(event: EventTouch, foodIdStr: string) {
        let foodId = Number(foodIdStr);

        let len = this.curFood.length;

        this.node_parts[len].getComponent(Sprite).color = Color.YELLOW;
        let lbData = this.node_parts[len].getChildByName("Label");
        lbData.getComponent(Label).string = `${foodId}`;

        this.curFood.push(foodId);
    }

    CC_OnClickGo() {

        if (this.curFood.length !== this.curNeed.length) {
            return;
        }

        for (let i = 0; i < this.curFood.length; i++) {
            if (this.curFood[i] != this.curNeed[i]) {
                return;
            }
        }

        this.curFood.length = 0;
        this.curNeed.length = 0;
        this.dispatchCustomer();

        this.clearFoodCur();
    }

    CC_OnClickClear() {
        this.clearFoodCur()
        this.curFood.length = 0;
    }


    private dispatchCustomer() {

        if (this.curNeed.length > 0) return;

        this.curNeed.push(randomRangeInt(1, 4));
        this.curNeed.push(randomRangeInt(1, 4));

        let idx = randomRangeInt(0, this.node_customers.length);
        this.node_customers.forEach(item => item.active = (item === this.node_customers[idx]));

        let lbData = this.node_customers[idx].getChildByName("Label");
        lbData.getComponent(Label).string = this.curNeed.join(' ');

    }

    private clearFoodCur() {
        this.node_parts.forEach((node) => {
            node.getComponent(Sprite).color = Color.WHITE
            let lbData = node.getChildByName("Label");
            lbData.getComponent(Label).string = '';
        });
    }
}
