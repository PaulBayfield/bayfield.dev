FROM python:3.12

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y postgresql-client
RUN apt-get install -y --no-install-recommends ffmpeg
RUN rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD gunicorn -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 --chdir /app/ website.main:app
