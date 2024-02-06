from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from app.blob import analyse_resumes, analyse_job_description
from pydantic import BaseModel



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

@app.post("/api/analyseResumes")
async def analyseResumes(files: list[UploadFile] = File(...)) -> dict:
    print("Analyse Resumes API called...")
    return await analyse_resumes(files)


class AnalyseJobDescriptionRequest(BaseModel):
    job_description: str


@app.post("/api/analyseJobDescription")
async def analyseJobDescription(request: AnalyseJobDescriptionRequest) -> dict:
    print("Analyse Job Description API called...")
    return await analyse_job_description(request.job_description)