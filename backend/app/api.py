from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from database.blob import save_to_blob

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://localhost:3000/",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root() -> dict:
    return {"message": "SERVER IS RUNNING HOOHA"}

@app.get("/api/ping")
async def ping() -> dict:
    return {"ping": "pong"}


#usage
# export const uploadFiles = async (formData: FormData) => {
#     const response = await api.post('/uploadFiles', formData, {
#         headers: {
#         'Content-Type': 'multipart/form-data',
#         },
#     });
#     return response.data;
# } 

@app.post("/api/uploadFiles")
async def upload_files(files: list[UploadFile] = File(...)) -> dict:
    return await save_to_blob(files)