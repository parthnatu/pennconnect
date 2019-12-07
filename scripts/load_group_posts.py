# -*- coding: utf-8 -*-
import mysql.connector as db
import pandas as pd
import sys
import random
import traceback
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
flag = int(sys.argv[2])
NUMBER_OF_USERS = 116904
list_of_groups = range(1,11)
list_of_users = range(1,116904)
group_names = ["CS Club", "PSU Athletics", "Movie Fanatics", "Metal Gods", "MOBA Enthusiasts", "DMG", "Chess Club","Nittany Lions Football","IGSA","NittanyAI"]
if flag == 1:
    id = 1
    for group in group_names:
        user_id = str(random.randint(1,NUMBER_OF_USERS))
        insert_sql = "INSERT INTO groups(group_id,group_name,group_creator_user_id) VALUES (%s,%s,%s)"
        vals = (str(id),group,user_id)
        cursor.execute(insert_sql,vals)
        init_group_sql = "INSERT INTO group_users(group_id,member_user_id) VALUES(%s,%s)"
        vals = (id,user_id)
        cursor.execute(init_group_sql,vals)
        id +=1
    conn.commit()
    print('init groups')


def normal_choice(lst):
    mean = (len(lst)-1)/2
    std_dev = (len(lst)-1)/6
    while True:
        index = int(random.normalvariate(mean,std_dev)+0.5)
        if 0 <= index < len(lst):
            return lst[index]

insert_sql = "INSERT INTO group_posts(post_type,user_id,text,media_url,upvotes,downvotes,timestamp,group_id) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"
for i in range(len(df_data)):
    post_type = str(df_data.iloc[i]["post_type"])
    user_id = str(random.randint(1,NUMBER_OF_USERS))
    text = str(df_data.iloc[i]["description"])
    media_url = "https://picsum.photos/700"
    upvotes = str(df_data.iloc[i]["likes_count"])
    downvotes = str(random.randint(0,int(upvotes)))
    timestamp = str(df_data.iloc[i]["posted_at"])
    group_id = normal_choice(list_of_groups)
    vals = (post_type,user_id,text,media_url,upvotes,downvotes,timestamp,group_id)
    try:
        cursor.execute(insert_sql,vals)
    except:
        print("error at row : "+str(i) + "\nwith vals\n"+str(vals))
        traceback.print_exc(file=sys.stdout)
    try:
        init_group_sql = "INSERT INTO group_users(group_id,member_user_id) VALUES(%s,%s)"
        vals = (group_id,user_id)
        cursor.execute(init_group_sql,vals)
    except:
        print('member already present..')
        traceback.print_exc(file=sys.stdout)
        print(vals)

conn.commit()
print('committed query!')