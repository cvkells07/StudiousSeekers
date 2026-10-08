import json
from fastapi import FastAPI

app = FastAPI()

#we need to input the code for each study spot location here 
#electricity will be changed to has_outlets_ potentially, for one of the characteristics

# UF_study_spots = [ 
#     { 
#         "id": 1
        
#     }

# This function opens the clean JSON file and reads the data automatically
def load_spots():
    with open("spots.json", "r") as file:
        return json.load(file)

@app.get("/")
def read_root():
    return {"message": "StudiousSeekers API is running"}

@app.get("/spots")
def get_spots():
    # Python reads the JSON file dynamically every time someone asks for it!
    return load_spots()


# @app.get("/")
# def read_root():
#     return {"message": "StudiousSeekers API is running"}

# ... (all your existing code up here, leave it exactly as it is) ...

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
