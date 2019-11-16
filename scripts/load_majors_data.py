# -*- coding: utf-8 -*-
import mysql.connector as db
import pandas as pd
import sys
import hashlib
import random
import traceback
NUMBER_OF_USERS = 116903
"""def check_hex(val):
    try:
        hexval = int(val)
"""
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
user_id = 1
i = 0
insert_sql = "UPDATE user SET major=\'{}\', degree_type=\'{}\', graduation_year=\'{}\' WHERE user_id=\'{}\'";
while(user_id<= NUMBER_OF_USERS):
    random_major = df_data.sample(1)['Major'].iloc[0]
    print(random_major)
    degree_type = random.choice(['UG','MS','PHD'])
    graduation_year = random.choice(range(2025,2018,-1))
    try:
        print("query = "+insert_sql.format(random_major,degree_type,graduation_year,str(user_id)))
        cursor.execute(insert_sql.format(random_major,degree_type,graduation_year,str(user_id)))
        user_id += 1
    except:
        print('error at user_id'+str(user_id))
        traceback.print_exc(file=sys.stdout)
    i+=1
conn.commit()
print('commited query!')
