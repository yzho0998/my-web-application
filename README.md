# COMP 5347 - Assignment 2
This is an assignment that used the revision data from Wikipedia and provide analytics

## Pre-processing the data

### Import the data in to mongoDB

The first thing to be done is to import that data into the mongoDB, it could be different depending what method you think is suitable. We used Robo3T to import the data rather than the mongoshell.

### Change the data type

After the import of the data, the data type of attribute 'timestamp' is a 'string' rather than the required 'date', in this case we utilized the mongoshell to change the type of timestamp for all the documents:

```javascript
db.revisions.find().forEach(function(doc){
    doc.timestamp = new ISODate(doc.timestamp);
    db.revisions.save(doc)
});
```

### Adding attribute

We have to external txt files, we need the user information so that we can identify each user's type. Hence we used external python code to convert two text files into json file and import them to the database manually. The python file is named 'convert.py', you should put this file and the two .txt file in the same directory and execute the python file.

```python
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
```

We hence have two json file named administrators.json and bots.json. After importing them into the database and given names 'admin' and 'bot' specifically, we then use the following command to generate two new attribute for all documents within the revision collection:

```javascript
// For all admin users
db.admin.find().forEach(function(user){
    db.revisions.updateMany(
        {user:user.name},
        {$set:{ admin:true}}
    );
})

// For all bot users
db.admin.find().forEach(function(user){
    db.revisions.updateMany(
        {user:user.name},
        {$set:{ bot:true}}
    );
})
```

After this, the anon users will have an attribute 'anon', if true then the user is anonymous. The administrators will have an attribute 'admin' as true. Bot users will have an attribute 'bot' as true.

## Start the page

You should nevigate to the correct working directory and use command in your command center:

node server.js

and on your browser, go to http://localhost:3000 to play around