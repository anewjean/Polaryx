# app/routes/s3.py

import os
import boto3
from fastapi import APIRouter, Body
from uuid import uuid4
import urllib.parse
import re

router = APIRouter()

@router.post("/s3/presigned-url")
def put_presigned_url(data: dict = Body(...)):
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
            'ContentType': data['filetype'],
        },
        ExpiresIn=60  # 유효시간 60초
    )

    # url = url.split("?")[0] 하면 정적 url 반환
    # message_id = data['message_id']

    # excute()로 데이터베이스에 저장 -> query를 insert로 짜면 DB에 저장되는 것 같음.

    print("url", url.split("?")[0]) # url 출력된다.
    return {"url": url, "key": file_key}


def get_content_type(filename):
    ext = filename.split('.')[-1].lower()
    print("ext", ext)
    if ext == "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    elif ext == "xls":
        return "application/vnd.ms-excel"
    elif ext == "pdf":
        return "application/pdf"
    # 필요시 더 추가
    return "application/octet-stream"

def encode_filename(filename):
    # 한글, 중국어, 일본어 등 비ASCII 문자 체크
    import string
    
    # ASCII 문자 + 기본 특수문자만 포함된 경우
    allowed_chars = string.ascii_letters + string.digits + ' ._-'
    if all(c in allowed_chars for c in filename):
        return f'attachment; filename="{filename}"'
    else:
        # 한글/특수문자 포함 시 RFC 5987 사용
        encoded_filename = urllib.parse.quote(filename)
        return f"attachment; filename*=UTF-8''{encoded_filename}"

@router.post("/s3/presigned-url-get")
def get_presigned_url(data: dict = Body(...)):
    decoded_filename = urllib.parse.unquote(data["filename"])
    s3 = boto3.client(
        "s3",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=os.getenv("AWS_REGION")
    )
    file_key = f"uploads/{decoded_filename}"  # 경로 + 파일명
    
    url = s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': os.getenv("AWS_BUCKET_NAME"),
            'Key': file_key,
            'ResponseContentDisposition': encode_filename(decoded_filename),
            'ResponseContentType' : get_content_type(decoded_filename)
        },
        ExpiresIn=60
    )
    return {"url": url, "key": file_key}