# URL Shortener Application

Welcome to the URL Shortener application! This application is developed using the MERN stack (MongoDB, Express.js, React.js, Node.js) and Vite. It follows a microservices architecture for scalability and efficiency.

## Features

- **User Authentication**: Users can log in securely using Firebase Authentication to access their account and manage their short URLs.
  
- **URL Shortening**: Users can shorten long URLs to create concise and shareable links.
  
- **Storage**: Shortened URLs are stored in a MongoDB database to ensure persistence and accessibility.
  
- **Click Tracking**: Users can track the number of clicks on their shortened URLs to monitor their popularity and engagement.

## Prerequisites

Before you begin, ensure you have the following prerequisites installed on your local machine:

- **Node.js**: Make sure you have Node.js installed. You can download it from [here](https://nodejs.org/).

- **MongoDB**: MongoDB is required for storing data. If you don't have MongoDB installed locally, you can download and install it from [here](https://www.mongodb.com/try/download/community).

- **Docker Desktop**: Docker Desktop is needed to run Docker containers for some services. You can download and install it from [here](https://www.docker.com/products/docker-desktop).

- **ZooKeeper**: ZooKeeper is used for range allocation. Detailed setup instructions can be found in the `server/services/Shortener/zookeeper/README.md` file.

## Project Structure

The project is structured into three microservices:

1. **Fetcher Service**: Responsible for fetching original URLs from the database.
  
2. **Redirector Service**: Handles redirecting shortened URLs to their original destinations.
  
3. **Shortener Service**: Manages URL shortening and storage functionalities.

## Usage

Follow these steps to set up and run the URL Shortener application locally:

1. Clone the repository to your local machine.

2. Navigate to the project directory.

3. Install dependencies for both frontend and backend:
    ```
    cd client
    npm install
    cd ../server
    npm install
    ```

4. Start the MongoDB server (change your database url to mongodb://127.0.0.1:27017 if you're using mongod locally):
    ```
    mongod
    ```
    Alternatively, you can use the docker-compose.yml file in 'server/mongoDB' to create a Docker application with sharded clusters. Refer to this [blog](https://medium.com/@yasasvi/mongodb-sharding-with-docker-c8b18bee32eb).

5. Start ZooKeeper using the Docker Compose file located in server/services/Shortener/zookeeper:
    ```
    docker-compose up -d 
    ```


6. Start each microservice (Fetcher, Redirector, Shortener) in Docker containers:
    ```
    cd server/services/Shortener
    docker-compose up -d --build
    cd ../Fetcher
    docker-compose up -d --build
    cd ../Redirector
    docker-compose up -d --build
    ```

7. Check if each service is successfully connected to the database by accessing their logs.

8. Finally, start the frontend:
    ```
    cd ../../client
    npm start
    ```

9. Access the application in your browser at `http://localhost:5173`.

## Contributions

Contributions to this project are welcome! If you have any suggestions or improvements, feel free to open an issue or submit a pull request.
