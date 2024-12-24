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
class Level extends GameData {
	public static Create() : GameData {
		return new Level()
	}
	public get ID(): number{ return this.datas[0]};//
	public get Time(): number{ return this.datas[1]};//
	public get Row(): number{ return this.datas[2]};//
	public get Col(): number{ return this.datas[3]};//
}

ClassStorege["Level"] = Level.Create

KeyIndexs["Level"] = {"ID" : 0,"Time" : 1,"Row" : 2,"Col" : 3,}

