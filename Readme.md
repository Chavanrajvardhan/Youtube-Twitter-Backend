# Youtube Twitter Backend

This is a Backend project for Youtube And Twitter.
  - [API Documentation](https://documenter.getpostman.com/view/24145868/2sA3e2hAea)
---
# Summary of this project

This project is a complex backend project that is built with nodejs, expressjs, mongodb, mongoose, jwt, bcrypt, and many more. This project is a complete backend project that has all the features that a backend project should have.
Project uses all standard practices like JWT, bcrypt, access tokens, refresh Tokens and many more.

---
# Added Features
### Video Management
- **Video Upload**

### User Interactions
- **Like**
- **Dislike**
- **Comment**
- **Reply**

### Video 
- **Publish Video**
- **Update Video**
- **Delete Video**
- **Toggle Publish Status**

### Comment
- **Add Video Comment**
- **Update Comment**
- **Delete Comment**
- **Get All User Comments**

### Tweet 
- **Create Tweet**
- **Update Tweet**
- **Delete Tweet**
- **Get User Tweets**

### Playlist 
- **Create Playlist**
- **Add Video to Playlist**
- **Remove Video from Playlist**
- **Delete Playlist**
- **Get User Playlists**

### Like 
- **Toggle Comment Like**
- **Toggle Tweet Like**
- **Toggle Video Like**
- **Toggle Liked Videos**

### Subscription
- **Get User Channel Subscribers**
- **Get Subscribed Channels**

--- 
## Getting Started

### Step 1: Installation
First, you will need to install the necessary packages using npm. To do so, clone the repo into your local machine. Then, follow the below steps.

1. Clone the repository:
    ```sh
    git clone https://github.com/Chavanrajvardhan/Youtube-Twitter-Backend.git
    ```
2. Navigate to the project directory:
    ```sh
    cd Youtube-Backend
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
### Step 2: Configuration

1. Create a `.env` file in the root directory of youtube-backend. You can do this using the following command:
    ```sh
    touch .env
    ```
2. Make an account on MongoDB Atlas for the database, create a database, and copy the connection string [here](https://www.mongodb.com/atlas).
3. Make an account on Cloudinary to store images [here](https://cloudinary.com/).
4. Copy the code from `.env.sample` and update the following variables in your `.env` file:

    ```env
    MONGO_URI=your_mongodb_url
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```
### Step 4: Running the Project

To start the development server, use the following command:

```sh
#using npm
npm run dev
```
This will start the server on the default port

### Step 5: Testing the API
1.Send HTTP requests using Postman to test the API endpoints.

2.Follow the API documentation to check the functionality.
