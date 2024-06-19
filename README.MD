# RecipeBurst

RecipeBurst is a platform that brings together food enthusiasts to share and explore various recipes. It utilizes modern web development technologies and cloud services to ensure efficient, secure, and reliable application delivery. The project emphasizes Continuous Integration and Continuous Deployment (CI/CD) practices to automate deployment through GitHub Actions and AWS Elastic Beanstalk.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Setup and Configuration](#setup-and-configuration)
- [Operations](#operations)
- [GitHub Workflows](#github-workflows)
- [Contributing](#contributing)
- [License](#license)

## Introduction

RecipeBurst is designed to revolutionize the interaction among food enthusiasts by providing a user-centric platform where they can share, explore, and manage recipes. The platform's main objective is to enhance the cooking journey by leveraging innovative technologies.

## Features

- **User Authentication and Authorization**: Secure login and signup using JWT and Google ReCAPTCHA.
- **Recipe Management**: Users can create, edit, delete, and view recipes.
- **Image Storage**: Recipe images are stored in AWS S3.
- **Continuous Integration and Deployment**: Automated CI/CD pipeline using GitHub Actions and AWS Elastic Beanstalk.
- **Static Code Analysis**: Ensuring code quality and security with manual use of SonarQube.

## Technologies

The project is built with the following technologies:

- **React.js**: A JavaScript library for building user interfaces.
- **Redux**: A state management tool for JavaScript apps.
- **Node.js**: A JavaScript runtime for building the backend.
- **Express.js**: A web application framework for Node.js.
- **TypeScript**: A typed superset of JavaScript.
- **Material-UI and Bootstrap**: CSS frameworks for developing responsive web apps.
- **AWS DynamoDB**: A NoSQL database for storing user and recipe data.
- **AWS S3**: A scalable object storage service for storing images.
- **AWS Elastic Beanstalk**: A platform for deploying and managing applications.
- **AWS CloudWatch**: A monitoring service for AWS resources.
- **SonarQube**: A tool used manually for static code analysis.


### Backend

The backend is built using Node.js and Express.js, with data stored in AWS DynamoDB. User authentication and authorization are handled using JWT, and CAPTCHA validation is implemented using Google reCAPTCHA.

### Frontend

The frontend is developed using React.js and Redux for state management. The UI is styled with Material-UI and Bootstrap.

### Deployment

The application is deployed using AWS Elastic Beanstalk, with CI/CD pipeline automation handled by GitHub Actions. Error logs are monitored using AWS CloudWatch.

## Installation

To run this project locally, follow these steps:

### Prerequisites

- Node.js
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend

2. Install the dependencies:
    ```bash
    npm install

3. Set up the environment variables in the .env file.

4. Start the backend server:
    ```bash
    npm start

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd frontend

2. Install the dependencies:
    ```bash
    npm install

3. Start the frontend application:
    ```bash
    npm start

## Usage
Once the servers are running, access the application via http://localhost:3000 for the frontend. Users can log in to manage their recipes, with images stored securely in AWS S3.

## Environment Variables
Ensure you have the necessary environment variables set up. You can find a sample configuration in the .env file. Here are the key variables:

1. `AWS_ACCESS_KEY_ID`: AWS access key ID for Elastic Beanstalk
2. `AWS_SECRET_ACCESS_KEY`: AWS secret access key for Elastic Beanstalk
3. `PORT`: Port for the backend server
4. `REACT_APP_API_URL`: URL for the backend API
5. `GOOGLE_RECAPTCHA_SECRET_KEY`: Google ReCAPTCHA secret key for server validation
6. `JWT_SECRET`: Secret key for JWT authentication

## setup-and-configuration

### Node.js and React.js
1. Initialize the Node.js project:
    ```bash
    npm init

2. Install necessary packages:
    ```bash
    npm install

3. Create a React.js project:
    ```bash
    npx create-react-app appname

### AWS Services
1. Set up AWS S3 for image storage.
2. Configure AWS DynamoDB for user and recipe data storage.
3. Deploy the application using AWS Elastic Beanstalk.

## Operations
1. User Authentication: Users log in using JWT and Google reCAPTCHA.
2. Recipe Management: Users can add, edit, and delete recipes.
3. Image Storage: Images are stored in AWS S3.
4. Deployment: Automated CI/CD pipeline deploys the application to AWS Elastic Beanstalk.
5. Monitoring: AWS CloudWatch monitors error logs.

## GitHub Workflows
This repository includes GitHub Actions workflows for CI/CD pipelines, which can be found in the `.github/workflows` directory. These workflows are provided as references and are not currently active for automated deployments. To use them, ensure you configure the necessary secrets and adjust the workflow triggers as needed.

### Example Workflows
1. CI/CD Pipeline: Automates the build, test, and deployment process using GitHub Actions and AWS Elastic Beanstalk.
2. Static Code Analysis: Utilized manually with SonarQube for static code analysis to maintain code quality and security.

Please review the workflow files and modify them according to your deployment requirements before activating them.

## Contributing
We welcome contributions from the community. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make your changes.
4. Commit your changes (git commit -m 'Add some feature').
5. Push to the branch (git push origin feature-branch).
6. Open a Pull Request.

## License
This project is licensed under the MIT License.

