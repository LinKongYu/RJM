import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Main')

export class Main extends Component {

    private testNum: number = 1314;

    private testStr: string = 'cocos';

    // 加载

    onLoad() {

        game.bundle.getBundle('TestBundle', this.testLoad)

        .then((bundle) => {

            if (bundle) {

                game.log.info('分包加载成功');

            }

        });

    }

    // 开始

    start() {

        this.testLog();

    }

    // 日志测试

    testLog() {

        game.log.debug('我是日志1');

        game.log.info('我是日志2');

        game.log.warn('我是日志3');

        game.log.err('我是日志4');

        game.log.debug('打印数字变量:', this.testNum);

        game.log.warn('打印文本变量:', this.testStr);

    }

    // 分包进度

    testLoad(progress: number) {

        game.log.info('分包加载进度', progress);

    }

}