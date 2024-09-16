# Practice-App-Node

This is a Node.js application that provides an API for managing blogs, users, projects, and tasks. The project also integrates with a third-party weather service. The application uses Express, Mongoose for MongoDB, and JWT for authentication.

## Project Setup

### 1. Clone the Repository
Using https
```bash
git clone https://github.com/hamzamaqsood07/Practice-App-Node.git
```
Or using ssh
```bash
git clone git@github.com:hamzamaqsood07/Practice-App-Node.git
```
Then
```bash
cd Practice-App-Node
```


### 2. Install dependencies
Make sure you have node 20 installed then run:
```bash
npm install
```

### 3. Set Environement
create .env from .env.sample

### 4. Run Server
If you wish to run on dev mode:
```bash
npm run dev
```
If you wish to run production build:
```bash
npm run start
```


## Project Structure
### Root Directory
- index.js is the entry file
- startup directory contains the db connectivity code + routers definitions.
- routes directory contains all the routes.
- models directory contains all the models.
- middlewares directory contains authentication and authorization logic
- services directory contains third party integration logic