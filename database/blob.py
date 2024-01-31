from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import os
from fastapi import UploadFile

def get_blob_service_client() -> BlobServiceClient:
    return BlobServiceClient.from_connection_string(os.getenv("AZURE_STORAGE_CONNECTION_STRING"))

async def save_to_blob(files: list[UploadFile]) -> dict:
    blob_service_client = get_blob_service_client()
    container_client = blob_service_client.get_container_client("resumes")
    for file in files:
        blob_client = container_client.get_blob_client(file.filename)
        blob_client.upload_blob(file.file.read())
    return {"message": "success"}