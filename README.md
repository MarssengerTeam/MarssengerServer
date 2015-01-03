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
	4. Type 'npm install forever -g' into cmd and wait for the installation to finish
	5. Navigate to your MarssengerServer folder
	6. Type 'npm install' into cmd and wait for the installation to finish
	7a. Type 'npm start' into cmd (you may have to allow the server to communicate through your network)
	7b. FOREVER to keep the server runnig
		If not for testing purpose, please start the server as an admin with the
		command "forever start ./bin/www".
		You will no longer see the normal running screen of the server, but if
		you want to see the child process for the server running type in
		"forever list".
		To stop the server, find out wich ID the child process has via "forever
		list"(most likely "0") and kill it with "forever stop [ID]" ex. "forever
		stop 0".
	8. Open a second cmd window (run as admin) and navigate to the bin folder inside your mongoDB installation folder
	9. Type 'mongod --dpath [Path of your datafolder in MarssengerServer]' (example 'mongod --dbpath C:/nodejs/MarssengerServer/data')

Enjoy!
