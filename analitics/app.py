# connections to mysql and mongodb
# calculate bmi
# write to mongodb

# Path: analitics/app.py
from pymongo import MongoClient
import mysql.connector

# start mysql connection
mysql = mysql.connector.connect(
    host='localhost', user='input', password='password', database='webdata', port=3307)
mysql_cursor = mysql.cursor()

query = ("SELECT * from input_data")
mysql_cursor.execute(query)
# assigning values to variables to a list
records = mysql_cursor.fetchall()
mysql_cursor.close()


print(records)


# start mongodb connection
client = MongoClient("mongodb://root:password@mongo:27017",
                     username='admin', password='admin')
db = client.webdata
collection = db.input_data
db = client["webdata"]
collection = db["input_data"]

# Database Name
db = client["bmi_mongo"]

# Collection Name
col = db["bmi_table"]

# calculate bmi


def calculate_bmi(weight, height):
    bmi = weight / (height * height)
    return bmi


classification = 'normal'
# create a dictionary from records
for record in records:
    bmi_dict = {
        "name": record[0],
        "age": record[4],
        "gender": record[3],
        "bmi": calculate_bmi(record[2], record[1])
    }
    if bmi_dict['bmi'] < 18.5:
        classification = 'underweight'
    elif bmi_dict['bmi'] >= 18.5 and bmi_dict['bmi'] < 25:
        classification = 'normal'
    elif bmi_dict['bmi'] >= 25 and bmi_dict['bmi'] < 30:
        classification = 'overweight'
    elif bmi_dict['bmi'] >= 30:
        classification = 'obese'
    bmi_dict['classification'] = classification
    print(bmi_dict)

    # inserting data into mongodb
    col.insert_one(bmi_dict)

    # if inserted successfully, print the message
    print("Data inserted with record id", col.inserted_id)

# closing mongodb connection
client.close()

# closing mysql connection
mysql.close()