import pandas as pd


data = pd.read_json("./ccn-measurements-small.json")
# print(type(data["timestamp"]))


agg = data.groupby("timestamp", "site").mean()

