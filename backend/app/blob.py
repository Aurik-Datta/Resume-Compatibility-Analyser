from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import (
    TextAnalyticsClient,
    RecognizeEntitiesAction,
    RecognizeLinkedEntitiesAction,
    RecognizePiiEntitiesAction,
    ExtractKeyPhrasesAction,
    AnalyzeSentimentAction,
)
import os
from dotenv import load_dotenv
from fastapi import UploadFile

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
load_dotenv(dotenv_path)

#CONSTANTS
STORAGE_CONTAINER_NAME = "resume-container"

#debugging purposes
def list_blob_containers(blob_service_client: BlobServiceClient) -> None:
    
    print("Listing blob containers in the account:")
    try:
        containers = blob_service_client.list_containers()
        for container in containers:
            print(container['name'])
    except Exception as e:
        print(f"Failed to list containers: {e}")
def pretty_print_analysis_result(analysis_result) -> None:
    if analysis_result.kind == "EntityRecognition":
        print("...Results of Recognize Entities Action:")
        for entity in analysis_result.entities:
            print(f"......Entity: {entity.text}")
            print(f".........Category: {entity.category}")
            print(f".........Confidence Score: {entity.confidence_score}")
            print(f".........Offset: {entity.offset}")

    elif analysis_result.kind == "PiiEntityRecognition":
        print("...Results of Recognize PII Entities action:")
        for pii_entity in analysis_result.entities:
            print(f"......Entity: {pii_entity.text}")
            print(f".........Category: {pii_entity.category}")
            print(f".........Confidence Score: {pii_entity.confidence_score}")

    elif analysis_result.kind == "KeyPhraseExtraction":
        print("...Results of Extract Key Phrases action:")
        print(f"......Key Phrases: {analysis_result.key_phrases}")

    elif analysis_result.kind == "EntityLinking":
        print("...Results of Recognize Linked Entities action:")
        for linked_entity in analysis_result.entities:
            print(f"......Entity name: {linked_entity.name}")
            print(f".........Data source: {linked_entity.data_source}")
            print(f".........Data source language: {linked_entity.language}")
            print(
                f".........Data source entity ID: {linked_entity.data_source_entity_id}"
            )
            print(f".........Data source URL: {linked_entity.url}")
            print(".........Document matches:")
            for match in linked_entity.matches:
                print(f"............Match text: {match.text}")
                print(f"............Confidence Score: {match.confidence_score}")
                print(f"............Offset: {match.offset}")
                print(f"............Length: {match.length}")

    elif analysis_result.kind == "SentimentAnalysis":
        print("...Results of Analyze Sentiment action:")
        print(f"......Overall sentiment: {analysis_result.sentiment}")
        print(
            f"......Scores: positive={analysis_result.confidence_scores.positive}; \
            neutral={analysis_result.confidence_scores.neutral}; \
            negative={analysis_result.confidence_scores.negative} \n"
        )

    elif analysis_result.is_error is True:
        print(
            f"...Is an error with code '{analysis_result.error.code}' and message '{analysis_result.error.message}'"
        )



#get clients
def get_blob_service_client() -> BlobServiceClient:
    return BlobServiceClient.from_connection_string(os.getenv("AZURE_STORAGE_CONNECTION_STRING"))
def get_form_recognizer_client() -> DocumentAnalysisClient:
    endpoint = os.getenv("AZURE_FORM_RECOGNIZER_ENDPOINT")
    key = os.getenv("AZURE_FORM_RECOGNIZER_KEY")
    return DocumentAnalysisClient(endpoint, AzureKeyCredential(key))
def get_text_analytics_client() -> TextAnalyticsClient:
    endpoint = os.getenv("AZURE_TEXT_ANALYTICS_ENDPOINT")
    key = os.getenv("AZURE_TEXT_ANALYTICS_KEY")
    return TextAnalyticsClient(endpoint, AzureKeyCredential(key))

#upload to blob
async def save_to_blob(files: list[UploadFile]) -> dict:
    blob_service_client = get_blob_service_client()
    container_client = blob_service_client.get_container_client(STORAGE_CONTAINER_NAME)
    blob_urls = []
    for file in files:
        blob_client = container_client.get_blob_client(file.filename)
        blob_client.upload_blob(await file.read())
        blob_url = f"{container_client.url}/{file.filename}"
        blob_urls.append(blob_url)
    return {"message": "success", "blob_urls": blob_urls}

#analyse resumes
async def analyse_resumes(files: list[UploadFile]) -> dict:
    blob_service_client = get_blob_service_client()
    container_client = blob_service_client.get_container_client(STORAGE_CONTAINER_NAME)
    form_recognizer_client = get_form_recognizer_client()
    text_analytics_client = get_text_analytics_client()
    save_result = await save_to_blob(files)
    try:
        blob_urls = save_result.get("blob_urls", [])
        sas_token = os.getenv("AZURE_STORAGE_SAS_TOKEN")
        # append ?sas_token to all blob_urls
        blob_urls = [f"{url}?{sas_token}" for url in blob_urls]

        text_analytics_actions = [
            RecognizeEntitiesAction(),
            # RecognizeLinkedEntitiesAction(),
            # RecognizePiiEntitiesAction(),
            # ExtractKeyPhrasesAction(),
            # AnalyzeSentimentAction(),
        ]

        # extract content from resumes using form recognizer
        for url in blob_urls:
            poller = form_recognizer_client.begin_analyze_document_from_url("prebuilt-document", url)
            result = poller.result()
            # combine "all the lines of content in the resume into a list for text analysis
            content = ""
            for page in result.pages:
                for line in page.lines:
                    content+= line.content

            # analyse the content using text analytics
            response = text_analytics_client.begin_analyze_actions(
                documents=[{"id": "1", "text": content}],
                actions=text_analytics_actions,
            ).result()
            for document_analysis in response:
                recognized_entities = []
                print(len(document_analysis))
                for analysis_result in document_analysis:
                    if analysis_result.kind == "EntityRecognition":
                        recognized_entities = analysis_result.entities
                    #pretty_print_analysis_result(analysis_result)

                # filter skills from recognized entities
                skills = [entity.text for entity in recognized_entities if entity.category == "Skill"]
                print("SKILLS: ")
                for skill in skills:
                    print(skill)


    finally:
        # delete blobs after analysis
        for file in files:
            try:
                blob_name = file.filename  # Ensure this matches the blob's name used when uploading
                container_client.delete_blob(blob_name)
                print(f"Successfully deleted blob: {blob_name}")
            except Exception as e:
                print(f"Failed to delete blob: {e}")
    return {"message": "success"}
