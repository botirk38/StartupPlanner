# StartupPlanner Backend

This is the backend for the StartupPlanner application, built with Django. It provides REST APIs for managing the application's data and integrates with Canva for user authentication.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Running with Docker](#running-with-docker)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication with Canva integration
- CRUD operations for managing user data
- Secure environment variable management with `python-dotenv`

## Installation

### Prerequisites

- Python 3.12+
- pip (Python package installer)
- Virtual environment tool (optional but recommended)

### Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/botirk38/StartupPlanner.git
    cd startup_planner_backend
    ```

2. **Create and activate a virtual environment**:

    ```bash
    python -m venv .venv
    source .venv/bin/activate
    ```

3. **Install dependencies**:

    ```bash
    pip install -r requirements.txt
    ```

4. **Run migrations**:

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

## Environment Variables

Create a `.env` file in the root directory of the Django project and add the following environment variables:

```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
CANVA_CLIENT_ID=your-canva-client-id
CANVA_CLIENT_SECRET=your-canva-client-secret
CANVA_REDIRECT_URI=your-canva-redirect-uri
RESEND_API_KEY=your-resend-api-key
DATABASE_URL=your-database-url 
```

## Usage

1. **Run the development server**:

    ```bash
    python manage.py runserver
    ```

2. **Access the application**:

    Open your browser and go to `http://127.0.0.1:8000`.

## Running with Docker

### Prerequisites

- Docker
- Docker Compose

### Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/startup_planner_backend.git
    cd startup_planner_backend

2. Create ```db.env``` file in project root with database credentials
    ```

3. **Build and run the Docker containers**:

    ```bash
    docker-compose up --build
    ```

4. **Access the application**:

    Open your browser and go to `http://localhost:8000`.


```

## API Endpoints

Below is a list of available API endpoints:

- `GET /api/canva/auth/` - Initiate Canva authentication
- `GET /api/canva/auth/callback/` - Canva authentication callback
- `GET /api/users/` - Retrieve list of users
- `POST /api/users/` - Create a new user
- `GET /api/users/{id}/` - Retrieve a specific user
- `PUT /api/users/{id}/` - Update a specific user
- `DELETE /api/users/{id}/` - Delete a specific user

## Running Tests

To run tests, use the following command:

```bash
python manage.py test
```



## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


