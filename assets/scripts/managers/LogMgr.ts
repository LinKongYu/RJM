/**

 * 日志管理类，用于统一日志输出格式

 */

class LogMgr {

    /** 私有构造函数，确保外部无法直接通过new创建实例 */

    private constructor() {}


    /** 单例实例 */

    public static readonly instance: LogMgr = new LogMgr();

    /**

     * 用于输出调试信息

     */
    public a: number = 0;


    public get debug() {

        return window.console.log.bind(window.console, '%c【调试】', 'color: white; background-color: #007BFF; font-weight: bold; font-size: 14px;');

    }

    /**

     * 用于输出一般信息

     */

    public get info() {

        return window.console.log.bind(window.console, '%c【信息】', 'color: white; background-color: #28A745; font-weight: bold; font-size: 14px;');

    }

    /**

     * 用于输出警告信息

     */

    public get warn() {

        return window.console.log.bind(window.console, '%c【警告】', 'color: black; background-color: #FFC107; font-weight: bold; font-size: 14px;');

    }

    /**

     * 用于输出错误信息

     */

    public get err() {

        return window.console.log.bind(window.console, '%c【错误】', 'color: white; background-color: #DC3545; font-weight: bold; font-size: 14px;');

    }

}

export const logMgr = LogMgr.instance;