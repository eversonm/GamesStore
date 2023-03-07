FROM python:3.10-alpine
LABEL maintainer="eversonmc"

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /requirements.txt

RUN pip install -r /requirements.txt

RUN mkdir /api
WORKDIR /api
COPY . /api

# CMD gunicorn --bind 0.0.0.0:80 "app:create_app()"
EXPOSE 5000
# CMD ["flask --app pspython db migrate", "flask --app pspython db upgrade"]