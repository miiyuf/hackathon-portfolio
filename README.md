# Portfolio Management

## Tech Stack
- **Backend**: Python (Flask)  
- **Frontend**: React  
- **Database**: MySQL  
- **Environment**: Docker, Docker Compose

## Development Environment Setup

1. **Install Docker Desktop via Homebrew**

    ```bash
    brew install --cask docker
    ```

    > After installation, launch Docker Desktop from your Applications folder and make sure it is running.

2. **Clone this repository**

    ```bash
    git clone https://github.com/miiyuf/hackathon-portfolio.git
    cd portfolio-management
    ```

## Environment Variables Setup

This project uses environment variables stored in a `.env` file for sensitive information such as database credentials.

1. Copy the example file:
```bash
cp .env.example .env
