# -*- coding: utf-8 -*-
import mysql.connector as db
import pandas as pd
from neo4j import GraphDatabase

neo4j_driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "pennconnect"))
print('connected to neo4j')
conn = db.connect(
        host="localhost",
        user="root",
        passwd="PennConnect@123",
        database="pennconnect")
print("connected!")
cursor = conn.cursor()
print("got cursor!")

get_user_list_query = "SELECT user_id FROM user"
update_friend_count_query = "UPDATE user SET friend_count={} WHERE user_id={}"
cursor.execute(get_user_list_query)

all_users = cursor.fetchall()
def get_user_friend_count(tx,user_id):
    for record in tx.run("MATCH (:User { user_graph_id : $user_graph_id})-[:IS_FRIEND_OF]-(f:User) RETURN COUNT(f)",user_graph_id=user_id):
        return record["COUNT(f)"]

for user_id in all_users:
    with neo4j_driver.session() as session:
        friend_count = session.read_transaction(get_user_friend_count,str(user_id[0]))
        cursor.execute(update_friend_count_query.format(str(friend_count),str(user_id[0])))
        print("updated {} with friend count {}".format(str(user_id[0]),str(friend_count)))

conn.commit()

neo4j_driver.close()
