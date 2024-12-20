import { UIScene } from './../ui/UIScene';
import { _decorator, Button, Component, Node } from 'cc';
import UIView from '../ui/UIView';

const { ccclass, property } = _decorator;

@ccclass('WorkWin')
export class WorkWin extends UIView {

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

    /** 点击关闭按钮 */
    CC_ClickClose(): void
    {
        this.Hide();
    }
}
