# Blueberry_DB

Blueberry_DB is a full-stack web application designed for secure and efficient database management. It features a Django backend and a React frontend, both containerized using Docker for seamless deployment. The application includes authentication features, user role management, and a responsive UI.

## Features

- User Authentication: Register, Login, and Password Reset functionality.
- Role-Based Access: Admin approval required for new user accounts.
- Database Access: Users can explore the database after logging in.
- Security Features: Hashed passwords, auto logout after inactivity.
- Responsive UI: Optimized for desktop and mobile devices.
- Admin Dashboard: Manage user registrations and permissions.
- Session Management: Automatic logout after 5 minutes of inactivity.

##  Tech Stack

- Frontend: React, JavaScript, HTML, CSS
- Backend: Django, Django REST Framework
- Database: PostgreSQL 
- Containerization: Docker, Docker Compose
- Security: JWT Authentication, Password Hashing
- Other Tools: Node.js, Git

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
7. Build and Start backend server
```
docker-compose build
```
```
docker-compose up -d
```
This will start the required services in detached mode.

Access the Web Container
```
docker-compose exec web bash
```
Create a Superuser for Django Admin
```
python manage.py createsuperuser
```
Follow the prompts to set up the superuser credentials.





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

- you can access the backend API admin at http://localhost:8000/admin

- To stop the services, use docker-compose down

### Installation guide video
https://www.youtube.com/watch?v=euSWtnm8EfQ