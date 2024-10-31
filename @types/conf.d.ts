declare global {
	export namespace ConfT {
		class AreaInfo {
	public get ID(): number;
	public get StartPos(): number[];
	public get Row(): number;
	public get Col(): number;
}

		class TestData {
	public get ID(): number;
	public get Name(): string;
	public get Num(): number;
	public get Level(): number;
}

		class Language {
			Key: string;
			ChineseSimplified: string;
		}
	}
}
export { };