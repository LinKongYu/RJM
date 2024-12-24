import { _decorator, Component, Node, Button, Prefab, instantiate } from 'cc';
import { Helper } from '../framework/utils/Helper';
const { ccclass, property } = _decorator;

@ccclass('Temp')
export class Temp extends Component {
    // 打开界面一按钮
    private btn: Node = null;

    // 加载
    onLoad() {
        this.btn = this.node.getChildByName('Button');
        if (this.btn) {
            this.btn.on(Button.EventType.CLICK, this.onOpenClick, this);
        }
    }

    /** 点击打开按钮 */
    onOpenClick() {
        app.ui.openWin("WorkWin");

        // Helper.loadSubGame("SubGame_002", async () => {
        //     // 1、加载分包预制体资源：prefabs/Temp.prefab
        //     const prefab = await app.res.loadRes<Prefab>('SubGame_002/Gopher');

        //     // 2、实例化预制体
        //     const newNode = instantiate(prefab);

        //     // 3、将实例化的节点添加到当前节点下
        //     this.node.addChild(newNode);
        // })
    }
}
