# Node.js + Express + PostgreSQL CRUD API

This is a simple REST API for managing products using Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js installed
- PostgreSQL installed and running

## Installation

1.  Navigate to the project directory:
    ```bash
    cd project
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1.  Create a `.env` file based on `.env.example`:
    ```bash
    cp .env.example .env
    ```

2.  Update the `.env` file with your PostgreSQL database credentials:
    ```env
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    PORT=3000
    ```

## Database Setup

1.  Create the database (if it doesn't exist) and the table using the provided SQL script:
    ```bash
    psql -U your_db_user -d your_db_name -f schema.sql
    ```
    *Replace `your_db_user` and `your_db_name` with your actual values.*

## Running the Server

-   Start the server in production mode:
    ```bash
    npm start
    ```

-   Start the server in development mode (with nodemon):
    ```bash
    npm run dev
    ```

The API will be available at `http://localhost:3000`.

## API Endpoints

-   `GET /products`: Get all products
-   `GET /products/:id`: Get a product by ID
-   `POST /products`: Create a new product
    -   Body: `{ "name": "Product Name", "price": 10.99 }`
-   `PUT /products/:id`: Update a product
    -   Body: `{ "name": "Updated Name", "price": 12.99 }`
-   `DELETE /products/:id`: Delete a product

## NGINX Reverse Proxy Configuration Example

Add this to your NGINX configuration file (e.g., `/etc/nginx/sites-available/default`) to proxy requests to this API:

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

## Deployment Guide

This guide explains how to deploy this application to a production server (e.g., Ubuntu VPS).

### 1. Prepare the Server

Ensure your server has Node.js and PostgreSQL installed.

```bash
# Update packages
sudo apt update

# Install Node.js (using nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib
```

### 2. Clone the Repository

```bash
git clone https://github.com/AlexCoilaJrt/crudpostgre.git
cd crudpostgre
npm install
```

### 3. Configure Database

```bash
# Enter PostgreSQL CLI
sudo -u postgres psql

# Create user and database
CREATE USER myuser WITH PASSWORD 'mypassword';
CREATE DATABASE mydb OWNER myuser;
\q
```

**Import the schema:**
```bash
psql -U myuser -d mydb -f schema.sql
```

### 4. Environment Variables

Create the `.env` file with your production credentials:

```bash
cp .env.example .env
nano .env
```

### 5. Run with PM2 (Process Manager)

Use PM2 to keep your application running in the background.

```bash
# Install PM2 globally
npm install -g pm2

# Start the app
pm2 start src/app.js --name "product-api"

# Save process list to restart on reboot
pm2 save
pm2 startup
```

### 6. Configure NGINX (Reverse Proxy)

Install NGINX:
```bash
sudo apt install nginx
```

Create a configuration file:
```bash
sudo nano /etc/nginx/sites-available/product-api
```

Add the following content. You can use your domain name (e.g., `example.com`) OR your server's public IP address (e.g., `203.0.113.1`).

```nginx
server {
    listen 80;
    # Replace with your Domain or Public IP
    server_name _; 

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart NGINX:
```bash
sudo ln -s /etc/nginx/sites-available/product-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Your API is now live!

