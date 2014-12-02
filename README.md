MarssengerServer
================
A. What's this?
It's the Server and Database for the Marssenger Project(https://github.com/nicolas-d-torres/Marssenger).
I used NodeJS/ExpressJS and MongoDb to realize the backend.
It has a simple usage: 
	1. Save the sended Data and all user
	2. Answer get requests and deleted read data

B. How to setup the server and database?
	1. Install MongoDB (http://www.mongodb.org/downloads) and Node.js (http://nodejs.org/download/) and download MarssengerServer
	2. Run cmd as admin and navigate to your nodejs installation folder
	3. Type 'npm install express -g' into cmd and wait for the installation to finish
	4. Navigate to your MarssengerServer folder
	5. Type 'npm install' into cmd and wait for the installation to finish
	6. Type 'npm start' into cmd (you may have to allow the server to communicate through your network)
	7. Open a second cmd window (run as admin) and navigate to the bin folder inside your mongoDB installation folder
	8. Type 'mongod --dpath [Path of your datafolder in MarssengerServer]' (example 'mongod --dbpath C:/nodejs/MarssengerServer/data')

Enjoy!
