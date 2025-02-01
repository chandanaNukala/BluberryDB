# Blueberry_DB


Blueberry_DB is a full-stack web application that consists of a backend built with Django and a frontend developed with React. It is containerized using Docker for seamless deployment and management



## Prerequisites

Before running the application, ensure you have the following installed on your system:

- Git
- Docker
```
    brew install docker-compose

    brew install --cask docker

    open -a Docker
```

- Node.js

## Installation and Setup

1. Clone the Repository

```
git clone https://github.com/chandanaNukala/BluberryDB.git

```

```
cd Blueberry_DB
```

2. Create virtual environment

MacOS:
```
python3 -m venv venv
```
Windows:

```
python -m venv venv
```

3. Activate the Virtual Environment

macos/linux : 
``` 
source venv/bin/activate
 ```
 Windows:
 ```
 venv\Scripts\activate
 ```

4. Checkout to the Master Branch
```
git checkout master
```

### Backend Setup

5. Navigate to the Backend Directory
```
cd backend
```
6. Stop Any Running Containers (If Any)
```
docker-compose down
```
7. Start the Backend Services
```
docker-compose up -d
```
This will start the required services in detached mode.



### Frontend Setup

8. Navigate to the Frontend Directory
```
cd ../Blueberry_DB/frontend
```
9. Install Dependencies
```
npm install
```
10. Start the Development Server
```
npm start
```
The frontend should now be running and accessible in your browser.

## Usage

- After setting up, The frontend UI can be accessed at http://localhost:3000



Access the Web Container
```
docker-compose exec web bash
```
Create a Superuser for Django Admin
```
python manage.py createsuperuser
```
Follow the prompts to set up the superuser credentials.

- you can access the backend API admin at http://localhost:8000/admin

- To stop the services, use docker-compose down

## Features

- The application includes Login, Register, and Forgot Password options.

- Upon accessing the application, the user is directed to the Home Page.

- To access the database, users must log in.