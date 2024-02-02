from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
import os
from fastapi import UploadFile

#debugging purposes
def list_blob_containers(blob_service_client: BlobServiceClient) -> None:
    
    print("Listing blob containers in the account:")
    try:
        containers = blob_service_client.list_containers()
        for container in containers:
            print(container['name'])
    except Exception as e:
        print(f"Failed to list containers: {e}")


#get clients
def get_blob_service_client() -> BlobServiceClient:
    return BlobServiceClient.from_connection_string("DefaultEndpointsProtocol=https;AccountName=resumestorage2;AccountKey=vsn7RlyFiBSKD6O77KviiDM7scsFF2nP+LMpi3wxd9lKIKMfUapzDGYpeM4lnrTAFheR16zNu8t7+AStRjUOrg==;EndpointSuffix=core.windows.net")
def get_form_recognizer_client() -> DocumentAnalysisClient:
    endpoint = "https://resume-document-int.cognitiveservices.azure.com/"
    key = "2626c971772c40ca99220c3a50770cb2"
    return DocumentAnalysisClient(endpoint, AzureKeyCredential(key))

#upload to blob
async def save_to_blob(files: list[UploadFile]) -> dict:
    blob_service_client = get_blob_service_client()
    container_client = blob_service_client.get_container_client("resume-container")
    blob_urls = []
    for file in files:
        blob_client = container_client.get_blob_client(file.filename)
        blob_client.upload_blob(await file.read())
        blob_url = f"{container_client.url}/{file.filename}"
        blob_urls.append(blob_url)
    return {"message": "success", "blob_urls": blob_urls}

#analyse resumes
async def analyse_resumes(files: list[UploadFile]) -> dict:
    save_result = await save_to_blob(files)
    # blob_urls = save_result.get("blob_urls", [])
    # form_recognizer_client = get_form_recognizer_client()

    # results = []

    # for blob_url in blob_urls:
    #     poller = await form_recognizer_client.begin_analyze_document_from_url("prebuilt-document", blob_url)
    #     result = poller.result()
    #     results.append(result)
    #     # Simplified example to print first page's lines
    #     for page in result.pages:
    #         for line in page.lines:
    #             print(line.text)



    return {"message": "success"}

async def analyse_hardcoded_resume(files: list[UploadFile]) -> dict:
    client = get_form_recognizer_client()
    
    # Path to your local resume file
    resume_path = "C:/Users/aurik/Desktop/Stuff/RandomProjects/Dialog/Resume-Compatibility-Analyser/backend/app/test_resume.pdf"
    
    results = []
    
    # Open and read the file
    with open(resume_path, "rb") as f:
        poller = client.begin_analyze_document("prebuilt-document", document=f)
        result = poller.result()

    # Simplified example to print first page's lines
    for page in result.pages:
        for line in page.lines:
            print(line.text)
    return {'message': 'success'}