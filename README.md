# Vehicle Maintenance Tracker

## Overview

VroomVault is a simple web app that tracks vehicle maintenance and registration. 
It helps keep track of all things related to a vehicle in one centralized place.
Multiple vehicles can be added and tracked.

## Tech Stack

This project uses FastAPI and postgreSQL on the backend and react for the client side. 
It features user login for authentication and simple data handling.

- **Frontend**: React, Vite, React Router
- **Backend**: FastAPI
- **Database**: SQLite (initial setup), PostgreSQL, pgAdmin (for viewing/testing)
- **Authentication**: JWT
- **Deployment**: Docker

## Features

- Add, view, edit, and delete vehicles
- Record and manage various maintenance records
- Predefined service types
- Intuitive interface and responsive design

## Prerequisites

One must have these items to use locally

- Docker
- Docker Compose
- Git

## Usage

### 1. Set up the Repository

```bash
git clone https://github.com/kalebjay/VroomVault.git
cd VroomVault
```

### 2. Run with Docker

```bash
# Build and start the application locally
docker-compose up -d --build # remove -d flag to view logs in terminal
```

```bash
# Check logs
docker-compose logs -f <service_name>
```

### 3. Access the Application via browser

Open your favorite browser and open these two urls

- Frontend: `http://localhost:5173/`
- Backend: `http://localhost:8000/`

Stop the application with:

```bash
docker-compose down
```

Note - if you get a permission denied problem during the build, it's likely 
because your docker user account does not have permission to access the 
Docker daemon socket or specific files. Run this command to grant your
user account access:

```bash
sudo usermod -aG docker $USER
```

Apply the changes with:
```bash
newgrp docker
```

## Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

- It is strongly recommended to use a virtual environment 
- Requirements can be found in VroomVault/backend/requirements.txt
- Install all the requirements with this command:

```bash
pip install -r requirements.txt
```

Run the application with:

```bash
cd backend
uvicorn main:app --reload
```

press ctrl +c to bring it down


### Database Setup

SQLite can be used for light usage
- find the file VroomVault/backend/db/database.py
- simply uncomment the code on lines 11-12
- comment out the postgres code on lines 16-20

PostgreSQL is the recommended database for production
- see online tutorials for how to set up postgres locally
- set your database credentials in VroomVault/backend/.env
- recommend using a db viewer such as pgAdmin to view data


### Environment Variables

To run the application, you will need to configure the following environment variables.

**Backend (`backend/.env`):**
```env
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your_secret_key

# Email Settings (Required for notifications)
MAIL_USERNAME=your_email@example.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=your_email@example.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
```

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:8000
```


## Project Structure

```
├── backend
│   ├──auth 
│   ├──db
│   │   ├── database.py
│   │   └── models.py
│   ├── router
│   ├── utils
│   │   └── scheduler.py
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── css
│   │   ├── pages
│   │   ├── utils
│   │   │   ├── apiClient.js
│   │   │   └── AuthContext.js
│   │   ├── App.css
│   │   └── App.jsx
│   ├── .env.development
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
├── docker-compose.yml
└── README.md
