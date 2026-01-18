# Book store app 📚
A simple book store application that uses 
- a MySQL database 
- a Vue frontend
- a Node.js / Express backend

It can be run **with Docker** or **without Docker**.  

## Installation
Fork and clone the repository.

## Running the application
### Configure and start the backend
1. Open a terminal and `cd` into the application folder.
2. `cd` into the `backend` folder.
3. Run `npm install`.
4. Run `cp .env.example .env` to rename *.env.example* into *.env* .
5. Edit *.env* and replace the default values with your database credentials.
6. Run `npm run dev`.
7. To test the backend, you can open http://localhost:3000/api/v1/ in a browser window. You should see `{"message":"Welcome to version 1 of this RESTful API!"}`.

### Configure and start the frontend
1. Open another terminal and `cd` into the `frontend` folder.
2. Run `npm install`.
3. If you changed `BACKEND_PORT=3000` to a different port in the backend *.env* file, open `frontend/src/utils/api.js` and update `apiUrl` to use the correct backend port. 
   If you didn't change the backend port, you can use the `apiUrl` as is.
4. Run `npm run dev`.
5. Open http://localhost:5173/ in a browser window.

## Running the application with Docker
1. Start Docker Desktop on your computer.
2. Open a terminal and `cd` into the application folder.
3. `cd` into the `backend` folder.
4. Run `cp .env.example .env` to rename *.env.example* into *.env* .
5. Edit *.env* and replace the default values with your database credentials.
6. Use `DB_HOST=db` instead of `DB_HOST=localhost`. This will create a new (empty) database. If you are using a local database instead of the one included in the docker compose setup, use `DB_HOST=host.docker.internal` instead of `DB_HOST=localhost`.
7. If you changed `BACKEND_PORT=3000` to a different port in the backend *.env* file, open `frontend/src/utils/api.js` and update `apiUrl` to use the correct backend port. 
   If you didn't change the backend port, you can use the `apiUrl` as is.
8. Run `docker compose up`
9. Open http://localhost:5173/ in a browser window.