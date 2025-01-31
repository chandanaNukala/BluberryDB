# Use official Python image
FROM python:3.12

# Set environment variables to prevent Python from buffering and bytecode generation
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Copy project files into the container
COPY . /app/

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Expose Django's default port
EXPOSE 8000

# Run the Django app
CMD ["gunicorn", "blueberry.wsgi:application", "--bind", "0.0.0.0:8000"]
