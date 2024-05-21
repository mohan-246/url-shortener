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

- **Docker Desktop**: Docker Desktop is needed to run ZooKeeper instances for range allocation. You can download and install it from [here](https://www.docker.com/products/docker-desktop).

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

4. Start the MongoDB server:
    ```
    mongod
    ```

5. Start ZooKeeper to handle range allocation. If you haven't set up ZooKeeper yet, refer to the documentation or README provided in the `server/services/Shortener/zookeeper` folder.

6. Start each microservice (Fetcher, Redirector, Shortener) in separate terminal windows:
    ```
    cd fetcher
    npm start
    ```
    ```
    cd ../redirector
    npm start
    ```
    ```
    cd ../shortener
    npm start
    ```

7. Finally, start the frontend:
    ```
    cd ../../client
    npm start
    ```

8. Access the application in your browser at `http://localhost:5173`.

## Contributions

Contributions to this project are welcome! If you have any suggestions or improvements, feel free to open an issue or submit a pull request.

Thank you for using our URL Shortener application! If you have any questions or need further assistance, please don't hesitate to contact us.
