# -*- coding: UTF-8 -*-
import os
import io
import csv
import re
import shutil
from xml.etree import ElementTree as ET
import chardet
import codecs
import sys

csv.field_size_limit(500 * 1024 * 1024)
reload(sys)
sys.setdefaultencoding('utf8')

# 输出文件的编码类型
encode_out = 'utf-8'

utf8_encoder = codecs.lookup('utf-8')

allDeses = {}

csvCount = 0
isHd = False

def generateCsv(name):
    global csvCount
    csvCount = csvCount + 1

    strCsvCnt = str(csvCount)

    print("cnt: " + strCsvCnt +  " generateCsv csv: " + name)

    csvPath = "csvNormal/" + name + ".csv"

    csvFile = open(csvPath, "r")
    reader = csv.reader(csvFile)

    readIdx = 0
    clientUseIdx = []
    clientIdxTps = {}
    clientIdxNames = {}
    for item in reader:
        itemIdx = 0
        for keyStr in item:
            keyStr = keyStr.replace('\"', '\"\"')
            if readIdx == 1:
                if useKeys.get(keyStr):
                    clientUseIdx.append(itemIdx)
                    clientIdxTps[itemIdx] = useKeys.get(keyStr)
                    for value in clientIdxNames.values():
                        if value == keyStr:
                            raise SystemExit("有重复key值："+keyStr)
                    clientIdxNames[itemIdx] = keyStr
                itemIdx = itemIdx+1
        readIdx = readIdx+1

    # print(clientUseIdx)

    # code change
    with open(csvPath, 'rb') as f:
        csvData = f.read()
        codeType = chardet.detect(csvData)["encoding"]
        with codecs.open(filename=csvPath, mode='r', encoding=codeType, errors="ignore") as fi:
            utf8_context = utf8_encoder.encode(data, 'ignore')
            with open(csvPath, "wb") as file_handle:
                file_handle.write(utf8_context[0])

    csvFile1 = open(csvPath, "r")
    reader1 = csv.reader(csvFile1)
    newStr = []

    clientDeses = {}
    readIdx = 0
    for item in reader1:
        itemIdx = 0
        items = ""
        length = 0
        for keyStr in item:
            keyStr = keyStr.replace('\"', '\"\"')
            if itemIdx in clientUseIdx:
                if readIdx == 2:  # use xml types
                    items = items+clientIdxTps[itemIdx]
                elif readIdx == 0:
                    clientDeses[clientIdxNames[itemIdx]] = keyStr
                else:
                    items = items+keyStr

                # print(itemIdx, clientUseIdx)
                length = length+1
                if length < len(clientUseIdx):
                    items = items+","
            itemIdx = itemIdx+1

        if readIdx != 0:
            newStr.append(items)
        readIdx = readIdx+1

    allDeses[name] = clientDeses

    csvFile.close()

    file = open("csvNormalOutput/" + name + ".csv", 'w')
    for str1 in newStr:
        file.write(str1 + "\n")

    file.close()

def generateCsvs():
    for root, dirs, files in os.walk('../asset/bundle/csv/'):
        for f in files:
            idx = f.index(".csv")
            fileName = f[0:idx]
            generateCsv(fileName, f)


def getTsType(type):
    if type == "int":
        return "number"
    elif type == "Int":
        return "number"
    elif type == "int64":
        return "number"
    elif type == "Int64":
        return "number"
    elif type == "float":
        return "number"
    elif type == "string":
        return "string"
    elif type == "String":
        return "string"
    elif type == "byte":
        return "string"
    elif type == "int32array":
        return "number[]"
    elif type == "int32Array":
        return "number[]"
    elif type == "int32arrayarray":
        return "number[][]"
    elif type == "int32ArrayArray":
        return "number[][]"
    else:
        return "undefined"


def generateConfT():
    print("generateConfT.............")
    NewConfT = "export let ClassStorege = {}\nexport function GetGameData(s:string) : GameData\n{\n\treturn ClassStorege[s]()\n}\n"
    NewConfT = NewConfT + "export let KeyIndexs = {}\nexport function GetGameDataKeyIndex(s:string)\n{\n\treturn KeyIndexs[s]\n}\n"
    ConfT = "declare global {\n\texport namespace ConfT {\n\t\t"
    NewConfT = NewConfT +  "export class GameData {\n\tpublic datas = []\n}\n"
    for root, dirs, files in os.walk('../assets/Csv/'):
        for fileName in files:
            if not fileName.endswith('.csv'):
                continue
            print(fileName)

            # 读取CSV文件
            with io.open('../assets/Csv/' + fileName, mode='r') as csvfile:
                csvreader = csv.reader(csvfile)
                next(csvreader)
                types = next(csvreader)  # 第二行作为类型
                names = next(csvreader)  # 第三行作为属性名
            
            # 确保类型和名称的数量相同
            assert len(types) == len(names), "类型和属性名的数量必须相同"
            
            idx = fileName.index(".csv")
            className = fileName[0:idx]

            ConfT = ConfT + "class " + className + " {\n\t"
            NewConfT = NewConfT + "class " + className + " extends GameData {\n\t"

            NewConfT = NewConfT + "public static Create() : GameData {\n\t\treturn new " + className + "()\n\t}\n\t"
            keyIndex = ""

            i = 0
            # 通过CSV中的类型和名称生成TypeScript代码
            for type_str, name_str in zip(types, names):
                ConfT = ConfT+ "public get " + name_str +"(): " + getTsType(type_str)+";"
                NewConfT = NewConfT+ "public get " + name_str +"(): " + getTsType(type_str)+"{ return this.datas["+ str(i) + "]};//"
                keyIndex = keyIndex + "\"" + name_str  + "\" : " + str(i) + ","
                i = i + 1
                ConfT = ConfT + "\n\t"
                NewConfT = NewConfT + "\n\t"

            ConfT = ConfT[:-1]
            ConfT = ConfT+"}\n\n\t\t"
            NewConfT = NewConfT[:-1]
            NewConfT = NewConfT+"}\n\n"

            NewConfT = NewConfT+"ClassStorege[\"" + className + "\"] = " + className + ".Create\n\n"
            NewConfT = NewConfT+"KeyIndexs[\"" + className + "\"] = {" + keyIndex + "}\n\n"

    ConfT = ConfT[:-3]
    ConfT = ConfT + \
        "\n\t\tclass Language {\n\t\t\tKey: string;\n\t\t\tChineseSimplified: string;\n\t\t}\n"
    ConfT = ConfT+"\t}\n}\nexport { };"


    file = open("../@types/conf.d.ts", "w")
    file.write(ConfT)
    file.close()

    file = open("../assets/Core/Scripts/Csv/ConfT.ts", "w")
    file.write(NewConfT)
    file.close()


def generateLanguage():
    print("generateLanguage.............")
    outPath = "LanguageOutPut/Language.csv"

    fileName = "Language/Language.csv"
    if not os.path.exists(fileName):
        return

    file = open(fileName)

    # code change
    with open("Language/Language.csv", 'rb') as f:
        csvData = f.read()
        codeType = chardet.detect(csvData)["encoding"]
        with codecs.open(filename=fileName, mode='r', encoding='gbk', errors="ignore") as fi:
            utf8_context = utf8_encoder.encode(data, 'ignore')
            with open(fileName, "wb") as file_handle:
                file_handle.write(utf8_context[0])

    reader = csv.reader(file)

    outStr = []
    readIdx = 0
    validIdx = []
    validKeys = ["Key", "ChineseSimplified"]
    for item in reader:
        valStr = ""

        valIdx = 0
        for val in item:
            val = val.replace('\"', '\"\"')
            if readIdx == 0:
                if val in validKeys:
                    valStr = valStr+val+","
                    validIdx.append(valIdx)
            else:
                if valIdx in validIdx:
                    valStr = valStr + "\"" + val + "\"" + ","

            valIdx = valIdx+1

        valStr = valStr[:-1]

        outStr.append(valStr)
        if readIdx == 0:
            outStr.append("string,string")
        readIdx = readIdx + 1

    # print(outStr)
    file.close()

    file = open(outPath, "w")
    for item in outStr:
        file.write(item+"\n")
    file.close()

def initDir():
    if os.path.exists("./csvNormal"):
        shutil.rmtree("./csvNormal")
    os.mkdir("./csvNormal")

def main():
    targetCsvDir = "csv"
    global csvCount
    csvCount = 0

    #print("###### init Dir ######")
    #initDir()

    #表项
    #print("###### generateCsvs ######")
    #generateCsvs()

    #多语言
    #print("###### generateLanguage ######")
    #generateLanguage()

    print("###### generateConfT ######")
    generateConfT()

main()

