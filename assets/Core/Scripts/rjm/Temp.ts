import { _decorator, Component, Node, Button } from 'cc';
import { WorkWin } from './WorkWin';
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
        app.ui.showScene(WorkWin);
    }
}
