# Myface Server

## Technologies Used:

### Back-End Stack:
- [![Node.js](https://img.shields.io/badge/Node.js-✓-green)](https://nodejs.org/)
- [![Express.js](https://img.shields.io/badge/Express.js-✓-green)](https://expressjs.com/)
- [![Mongoose](https://img.shields.io/badge/Mongoose-✓-orange)](https://mongoosejs.com/)
- [![JWT](https://img.shields.io/badge/JWT-✓-blueviolet)](https://jwt.io/)
- [![Cors](https://img.shields.io/badge/Cors-✓-blueviolet)](https://www.npmjs.com/package/bcrypt)
- [![Bcrypt](https://img.shields.io/badge/Bcrypt-✓-blueviolet)](https://www.npmjs.com/package/bcrypt)
- [![Busboy](https://img.shields.io/badge/Busboy-✓-blueviolet)](https://www.npmjs.com/package/bcrypt)
- [![Nodemailer](https://img.shields.io/badge/Nodemailer-✓-blueviolet)](https://www.npmjs.com/package/bcrypt)

### CDN:
- [![Cloudinary](https://img.shields.io/badge/Cloudinary-✓-blue)](https://cloudinary.com/)

## Table of Contents:

- [Project Overview](#project-overview)
- [Features](#features)
- [Running the Application](#running-the-application)

## Project Overview:

This is a web API implemented specifically for the needs of [Myface](https://github.com/StoyanBanov/myface-client) web application

## Features

- **Auth:**
  - Register
  - Login
  - Logout
  - Update

- **Users:**
  - Read users
  - Read single user
  - Search
  - Friendships CRUD
 
- **Chats:**
  - Read chats
  - Read single chat
  - Create message
  - Read messages
 
- **Posts:**
  - CRUD
  - Search
  - Create like/comment
  - Delete like/comment
  - Read likes/comments

## Running the application
  ### Prerequisites:
  
  - Create an accout at [Cloudinary](https://cloudinary.com/)
  - Get an email address from an smtp provider(for instance [Zoho](https://www.zoho.com/mail/))

  ### Set-up:
   
  - In the root directory of the project create a .env file with the following properties:
    - DATABASE_URL=(url to a mongodb database)
    - PORT=(port of your choise)
    - CLIENT_ADDRESS=(address of the [Myface](https://github.com/StoyanBanov/myface-client) client app)
    - JWT_SECRET=(secret of your choise)
    - EMAIL_NAME=(email name of your smtp provider)
    - EMAIL_PASS=(password)
    - CLOUDINARY_CLOUD_NAME=(name from cloudinary)
    - CLOUDINARY_API_KEY=(key from cloudinary)
    - CLOUDINARY_API_SECRET=(secret from cloudinary)
  - Install dependencies - npm i
  - Run the appliaction - npm run debug
  - Run the [Myface Server](https://github.com/StoyanBanov/myface-server)

## Deployment Info
 - Deployed on [Render](https://render.com/)
