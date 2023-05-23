# Used for debugging the connection to the database

MONGODB_URI = "mongodb+srv://AmanDB0081:AmanDB0081@amandb.ogyrtmp.mongodb.net/?retryWrites=true&w=majority"
from pymongo import MongoClient

client = MongoClient(MONGODB_URI)

db = client["Recipes"]

print(db["categories"].find_one({"name": "Chinese"}))