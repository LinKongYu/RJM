// 管理器

import { bundleMgr } from "./managers/BundleMgr";
import { logMgr } from "./managers/LogMgr";

/**

 * Core 类

 * 负责映射导出框架接口

 */

class Core {

    /** 日志管理器 */

    public log = logMgr;

    /** 分包管理器 */

    public bundle = bundleMgr;

}

/** 全局 Window 接口 */

declare global {

    interface Window {

        game: Core;

    }

    var game: Core;

}

/** 创建 Core 类的实例并赋值给全局 window 对象 */

window.game = new Core();