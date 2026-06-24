# Lab 10 — backend Dockerfile. Author this file.
#
# Build context must be the repo root:
#   docker build -t m10-api -f api/Dockerfile .
#
# See lab-guide.md "Containerization" section for the constraints the
# autograder will check.

FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN python -m spacy download en_core_web_sm || pip install --no-cache-dir https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1-py3-none-any.whl

COPY . .

EXPOSE 8000

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]