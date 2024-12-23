export class Helper {

    public static loadSubGame(packageName: string, callBack?: Function) {
        const onProgress = (progress: number) => {
            app.log.debug('加载进度:', `${(progress * 100).toFixed(2)}%`);
        };

        app.bundle.getBundle(packageName, onProgress)
            .then((bundle) => {
                if (bundle) {
                    app.log.info('分包加载成功！');
                    // 在这里可以执行加载完成后的操作
                    callBack && callBack();
                }
            });
    }
}