declare global {
	export namespace ConfT {
		class Level {
	public get ID(): number;
	public get Time(): number;
	public get Row(): number;
	public get Col(): number;
}

		class Language {
			Key: string;
			ChineseSimplified: string;
		}
	}
}
export { };