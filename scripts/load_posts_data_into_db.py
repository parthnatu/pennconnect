# -*- coding: utf-8 -*-
import mysql.connector as db
import pandas as pd
import sys
import random
<<<<<<< HEAD
NUMBER_OF_USERS = 116903;
=======
NUMBER_OF_USERS = 116893
>>>>>>> ed55da6ad90b5bc00f16db197e67110a1dc565b5

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

insert_sql = "INSERT INTO posts(post_type,user_id,text,media_url,upvotes,downvotes,timestamp) VALUES (%s,%s,%s,%s,%s,%s,%s)"
for i in range(len(df_data)):
    post_type = str(df_data.iloc[i]["post_type"])
    user_id = str(random.randint(1,NUMBER_OF_USERS))
    text = str(df_data.iloc[i]["description"])
    media_url = "https://picsum.photos/700"
    upvotes = str(df_data.iloc[i]["likes_count"])
    downvotes = str(random.randint(0,int(upvotes)))
    timestamp = str(df_data.iloc[i]["posted_at"])
    vals = (post_type,user_id,text,media_url,upvotes,downvotes,timestamp)
    try:
        cursor.execute(insert_sql,vals)
    except:
        print("error at row : "+str(i) + "\nwith vals\n"+str(vals))

conn.commit()
print('committed query!')

