# app/routes/s3.py

import os
import boto3
from fastapi import APIRouter, Body
from uuid import uuid4

router = APIRouter()

@router.post("/s3/presigned-url")
def get_presigned_url(data: dict = Body(...)):
    s3 = boto3.client(
        "s3",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=os.getenv("AWS_REGION")
    )
    file_key = f"uploads/{data['filename']}"  # 경로 + 파일명

    url = s3.generate_presigned_url(
        ClientMethod='put_object',
        Params={
            'Bucket': os.getenv("AWS_BUCKET_NAME"),
            'Key': file_key,
            'ContentType': data['filetype']
        },
        ExpiresIn=60  # 유효시간 60초
    )
    print("url", url) # url 출력된다.
    return {"url": url, "key": file_key}