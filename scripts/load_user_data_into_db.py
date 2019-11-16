# -*- coding: utf-8 -*-
import mysql.connector as db
import pandas as pd
import sys
import hashlib
NUMBER_OF_USERS = 116893
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
insert_sql = "INSERT INTO user(user_id,fname,lname,gender,email,uname,passwd,nationality,dob) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
while(user_id <= NUMBER_OF_USERS):
    fname = str(df_data.iloc[i]["name_first"])
    lname = str(df_data.iloc[i]["name_last"])
    gender = str(df_data.iloc[i]["gender"][0])
    email = str(df_data.iloc[i]["email"])
    uname = str(df_data.iloc[i]["login_username"])
    passwd = hashlib.sha1(str(df_data.iloc[i]["login_password"]).encode('utf-8')).hexdigest()
    nationality = str(df_data.iloc[i]["nat"])
    dob = df_data.iloc[i]["dob_date"][:10]
    vals = (user_id,fname,lname,gender,email,uname,passwd,nationality,dob)
    try:
        user_id += 1
        cursor.execute(insert_sql,vals)
    except:
        user_id -= 1
        print("error at row : "+str(user_id) + "with vals\n"+str(vals))
    i +=1

conn.commit()
print('committed query! number of records added : '+str(user_id))

