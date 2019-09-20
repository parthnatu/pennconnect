import sys
import requests
import pprint
import pandas as pd
import time

def parse_data(data,data_dict,parent):
    for key in data:
        if type(data[key]) == dict:
            parse_data(data[key],data_dict,key)
        else:
            if parent != "":
                if parent+"_"+key in data_dict:
                    data_dict[parent+"_"+key].append(data[key])
                else:
                    data_dict[parent+"_"+key] = list()
                    data_dict[parent+"_"+key].append(data[key])
            else:
                if key in data_dict:
                    data_dict[key].append(data[key])
                else:
                    data_dict[key] = list()
                    data_dict[key].append(data[key])


number_of_records = int(sys.argv[1])
user_data = list()
user_data_dict = dict()
count = 1
for i in range(int(number_of_records/5000)):
    if count == 4:
        print("sleeping for 1 minute to avoid DoS error")
        time.sleep(60)
        count = 1
    else:
        count += 1
    response = requests.get("https://randomuser.me/api/?results=5000")
    data = response.json()
    if "error" in data:
        print(data["error"])
        continue
    print("Processing data with seed : "+data["info"]["seed"])
    user_data += data["results"]
if number_of_records % 5000 > 0:
    response = requests.get("https://randomuser.me/api/?results="+str(number_of_records % 5000))
    data = response.json()
    print("Processing data with seed : "+data["info"]["seed"])
    user_data += data["results"]


for data in user_data:
    parse_data(data,user_data_dict,"")

user_data_df = pd.DataFrame().from_dict(user_data_dict)
user_data_df.to_csv("output.csv")

