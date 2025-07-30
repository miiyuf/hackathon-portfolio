# backend/Dockerfile

FROM python:3.11-slim

# Set working directory
WORKDIR /portfolio_app

COPY . /portfolio_app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Set PYTHONPATH so 'app' can be imported
ENV PYTHONPATH=/portfolio_app/

# Set Flask environment variables
ENV FLASK_APP=main:app
ENV FLASK_ENV=development

EXPOSE 8000

CMD ["flask", "run", "--host=0.0.0.0", "--port=8000"]





