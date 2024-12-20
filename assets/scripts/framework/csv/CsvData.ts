export let ClassStorege = {}
export function GetGameData(s:string) : GameData
{
	return ClassStorege[s]()
}

export let KeyIndexs = {}
export function GetGameDataKeyIndex(s:string)
{
	return KeyIndexs[s]
}

export class GameData {
	public datas = []
}