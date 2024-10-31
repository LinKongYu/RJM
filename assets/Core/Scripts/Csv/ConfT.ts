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
class AreaInfo extends GameData {
	public static Create() : GameData {
		return new AreaInfo()
	}
	public get ID(): number{ return this.datas[0]};//
	public get StartPos(): number[]{ return this.datas[1]};//
	public get Row(): number{ return this.datas[2]};//
	public get Col(): number{ return this.datas[3]};//
}

ClassStorege["AreaInfo"] = AreaInfo.Create

KeyIndexs["AreaInfo"] = {"ID" : 0,"StartPos" : 1,"Row" : 2,"Col" : 3,}

class TestData extends GameData {
	public static Create() : GameData {
		return new TestData()
	}
	public get ID(): number{ return this.datas[0]};//
	public get Name(): string{ return this.datas[1]};//
	public get Num(): number{ return this.datas[2]};//
	public get Level(): number{ return this.datas[3]};//
}

ClassStorege["TestData"] = TestData.Create

KeyIndexs["TestData"] = {"ID" : 0,"Name" : 1,"Num" : 2,"Level" : 3,}

