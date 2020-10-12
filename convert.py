#! /usr/bin/python3

import json

adminArray = []
botArray = []
adminFile = 'administrators.txt'
botFile = 'bots.txt'

with open(adminFile, 'r') as fr:
    for line in fr:
        line = line.strip('\n')
        adminArray.append({"name":line})

with open("administrators.json", 'w') as fw:
    json.dump(adminArray, fw)


with open(botFile, 'r') as fr:
    for line in fr:
        line = line.strip('\n')
        botArray.append({"name":line})

with open("bots.json", 'w') as fw:
    json.dump(botArray, fw)
