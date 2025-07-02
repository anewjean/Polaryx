FROM python:3.12-slim

ARG GITHUBS_CLIENT_SECRET
ARG GOOGLE_CLIENT_SECRET

ENV GITHUBS_CLIENT_SECRET=$GITHUBS_CLIENT_SECRET 
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET 

WORKDIR /app

COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]