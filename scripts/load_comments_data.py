# -*- coding: utf-8 -*-
import mysql.connector as db
import pandas as pd
import sys
import traceback
import json
import random

list_of_users = range(1,116904)
list_of_posts = range(1,116479)

conn = db.connect(
        host="localhost",
        user="root",
        passwd="PennConnect@123",
        database="pennconnect")
print("connected!")
cursor = conn.cursor()
print("got cursor!")
df_data = pd.read_csv(sys.argv[1])
print("loaded dataframe!")
query = "INSERT INTO comments(post_id,user_id,text,timestamp) VALUES(%s,%s,%s,%s)"

def normal_choice(lst):
    mean = (len(lst)-1)/2
    std_dev = (len(lst)-1)/6
    while True:
        index = int(random.normalvariate(mean,std_dev)+0.5)
        if 0 <= index < len(lst):
            return lst[index]

for i in range(len(df_data)):
    timestamp = " ".join(df_data.iloc[i]["created_time"].split("T"))
    timestamp = timestamp[:len(timestamp)-5]
    text_data = dict()
    text_data["comment_text"] = df_data.iloc[i]["message"]
    text_data["replies"] = list()
    text_json = json.dumps(text_data)
    user_id = normal_choice(list_of_users)
    post_id = normal_choice(list_of_posts)
    vals = [post_id,user_id,text_json,timestamp]
    try:
        #print("query = "+insert_sql.format(random_major,degree_type,graduation_year,str(user_id)))
        cursor.execute(query,vals)
    except:
        traceback.print_exc(file=sys.stdout)
conn.commit()
print('commited query!')

