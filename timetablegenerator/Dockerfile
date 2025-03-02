FROM python:3.12
WORKDIR /app
COPY ./Pipfile ./Pipfile.lock .
RUN pip install pipenv
RUN pipenv install --deploy --system
COPY . .
CMD ["python","manage.py","runserver"]
