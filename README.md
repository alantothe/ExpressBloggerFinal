# ExpressBloggerFinal

AP- Persistent Blogger
# Assignment Setup

- Create a new github repo called ExpressBloggerFinal:
- Add a README = checked
- Add .gitignore = node
- Clone the repo to your computer and add the link to populi
- Setup the Express server:
- Run express-generator to generate the base ExpressJS server code
- run 'npx express-generator -e' in the ExpressBloggerFinal project folder
- Install nodemon as a dev-dependency
- run 'npm i --save-dev nodemon'
- Change the start script in package.json to use nodemon
- "scripts": {
"start": "nodemon ./bin/www"
}
- Install dotenv as a dependency
- run 'npm i dotenv'
- Require the dotenv config
- In app.js, add 'require("dotenv").config();' to the imports at the top of the file (line 6)
- Note: This code will allow us to use .env (environment variable) files in our server
- Create a .env file
- In the project root (./) make a new file '.env'
- Note: The terminal command 'touch .env' will create a new file called .env in the current directory
- Install uuidv4
- run 'npm i uuidv4'
- Setup Mongo for the Express server:
- Install the mongodb nodejs library
- run 'npm i mongodb'
- Create a new file ./mongo.js in the project root
- 'touch mongo.js'
- Add the following code to ./mongo.js
- const { MongoClient } = require("mongodb");
let database;

async function mongoConnect() {
// Connection URI
const uri = process.env.MONGO_URI;
// Create a new MongoClient
const client = new MongoClient(uri);
try {
// Connect the client to the server
await client.connect();
database = await client.db(process.env.MONGO_DATABASE);
// Establish and verify connection
console.log("db connected");
} catch (error) {
throw Error("Could not connect to MongoDB. " + error);
}
}
function db() {
return database;
}
module.exports = {
mongoConnect,
db,
};
- Note: The lines 'const uri = process.env.MONGO_URI;' and 'database = await client.db(process.env.MONGO_DATABASE);' require that we have the environment variables MONGO_URI and MONGO_DATABASE in our .env file.
- Add the following environment variables to the .env file
- MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority
- Note: You will have to replace the values in the angle brackets with your own values. So replace <username>, <password> and <cluster-name> in the MONGO_URI connection string with your credentials and cluster name that you created using Mongo Atlas. If you don't remember your credentials, you can export the whole uri string from NoSQLBooster by going to Connect -> Select your Mongo Cluster (most likely CodeImmersivesCluster) -> click To URI at the top -> copy/paste the connection string into the .env file.
- MONGO_DATABASE=<blog-database-name>
- Note: The MONGO_DATABASE environment variable will be the name of your database inside of your Mongo cluster, most likely 'blogs', 'posts' or 'BlogsDB'.
- Add code to ./app.js to connect our server to the database on start
- Above the line 'var app = express();', add the following code:
- var { mongoConnect } = require('./mongo.js');
mongoConnect();
- Note: By calling 'mongoConnect();' before 'var app = express();', we are ensuring that our server will connect to the database before our server starts. If there is any problem with connecting to mongo, then nodemon will throw the error in the terminal and the server will not start. This code will also run every time nodemon restarts our server due to a file change. In this way, we can always be sure that our server is connected to mongo before any of the routes execute.
- Create a basic blog GET route that connects to the mongo database
- Create a new file ./routes/blogs.js
- Add the following code to ./routes/blogs.js
- const { uuid } = require('uuidv4');
var express = require('express');
var router = express.Router();

const {db} = require("../mongo")

router.get('/get-one-example', async function(req, res, next) {
const blogPost = await db().collection("posts").findOne({
id: {
$exists: true}
})
res.json({
success: true,
post: blogPost
})
});

module.exports = router;
- Note:
- The line const { uuid } = require('uuidv4'); will import the uuid function from uuidv4, this function will generate uuid's for us. We can invoke uuid to generate a new id like so:
- const id = uuid();
- The line const { db } = require("../mongo") is importing the db FUNCTION from the ./mongo.js file. This function will return a database reference value similar to the db variable in NoSQLBooster, except we need to invoke it as a function. We can then chain mongo methods off of it.
- .collection(<collection-name>) is called on db() with our collection name passed in as an argument, this is so we can get a reference to our collection in the database. This is the equivalent of doing db.posts in NoSQLBooster.
- After we call .collection() we can call any of our mongo methods such as .find(), .insert(), .update() and .delete() on it.
- The db().collection().mongoMethod() function calls all return a pending promise. Thus, we must declare our route handler as an async function and await the mongo call.
- Important: All of the route handler functions that call mongo methods must be async functions.
- Add the following code to app.js to import the blogs routes
- After 'var usersRouter = require('./routes/users');', add 'var blogsRouter = require('./routes/blogs');'
- After 'app.use('/users', usersRouter);', add 'app.use('/blogs', blogsRouter);'
- Start the server and test with Postman
- Run 'npm start' to start the server and resolve any errors that show in the terminal.
- If the server started properly and connected to mongo, you should see an output like this:
[nodemon] 2.0.20
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): .
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./bin/www`
db connected
- Note: If your internet connection is slow it may take a moment for you to see the 'db connected' console log. You will have to wait for the connection to establish before making requests to your routes.
- Create a new collection in Postman called ExpressBloggerFinal, all requests for this project will go in this folder
- Add a new GET request to 'localhost:3000/blogs/get-one-example' and run it. You should see a response with one of your blog posts.
- Commit your repo code and push to origin
- 'git add .'
- 'git commit -m "initial commit"'
- 'git push'
- Note:
- One of the stretch goals is to wrap all routes in try/catch blocks. If you're going for this stretch goal, it would be easiest to write all your routes with try/catch blocks as you go. Remember in the catch block to:
- console.log the error
- Respond with an object containing success:false and the error message to the HTTP request
- catch (e) {
console.log(e)
res.json({
success: false,
error: e.toString()
})
}

# After Setup

- For the POST and PUT routes, the stretch goals are to add validations to the route. You may implement the validations inside the route handler function itself as inline code or create a new file ./validations/blogs.js and export all your validation functions from that file to be imported into the ./routes/blogs.js file. Either method is acceptable so long as the routes properly respond to the HTTP request with an object containing success:false and the validation error message if any of the validations fail.
- All routes and route functionality should be tested using Postman.

- Implement single document CRUD routes
- Implement a new GET route /blogs/get-one/:id
- This route should get the blog post id from the url params
- The route should then search mongo for the blog post whose id matches the url param
- If the post was found, then the route should respond with an object containing success: true and the found blog post
- If the post was not found, then the route should respond with an object containing success: false and a message saying that the post was not found
- Stretch: Add a condition to check to see that the id url param is defined and if it isn't, send back an object with success: false and an message saying that the blog id must be provided as a route parameter
- Implement a new POST route /blogs/create-one
- This route should get the following fields for the new blog post from the incoming request body:
- title: {String}
- text: {String}
- author: {String}
- email: {String}
- categories: {String[]}
- starRating: {Number}
- The following fields should be generated in the route and combined with the fields from the request body to create a new blog object:
- createdAt: {Date}
- lastModified: {Date}
- id: {String/uuid}
- The route should insert the new blog object into the blog posts collection as a new post
- If the above was successful, the route should respond with an object containing success:true and the new blog object
- Stretch:
- Add validation to the route to check the following conditions before inserting the blog object:
- title is defined, is a string, and is no longer than 30 characters
- text is defined and is a string
- author is defined and is a string
- if email is defined, it should be a string and must contain only a single @ symbol
- if categories is defined, it must be an array, it must have non-zero length and it must only contain strings
- if starRating is defined, it must be a number between 1 and 10
- If any of the validations fail, the route should respond with an object containing success: false and a validation error message describing which validation failed
- Implement a new PUT route /blogs/update-one/:id
- This route should get the blog post id from the url params and update the post containing that id with the incoming data from the request body
- This route should get the following fields to update the blog post from the incoming request body:
- title: {String}
- text: {String}
- author: {String}
- email: {String}
- categories: {String[]}
- starRating: {Number}
- The following fields should be generated in the route to be used in the update operation:
- lastModified: {Date}
- The route should update the target blog post with the new field values but only if those fields are defined in the request body. I.E. It should be possible to only send a single field such as starRating in the PUT request body. In that case, the only fields that should be updated on the target post is starRating and lastModified (since we always want to keep lastModified up to date). The rest of the fields should remain unchanged.
- If the above was successful, the route should respond with an object containing success:true
- Stretch:
- Add validation to check that for every field on the request body that is defined it is the correct type. Additionally, check the following field specific validations:
- title is no longer than 30 characters
- email must contain only a single @ symbol
- categories must be an array with non-zero length containing all strings
- starRating must be a number between 1 and 10
- If any of the validations fail, the route should respond with an object containing success:false and a validation error message describing which validation failed.
- Implement a new DELETE route /blogs/delete-one/:id
- This route should get the blog post id from the url params and delete the post containing that id from the collection
- If the above was successful, the route should respond with an object containing success:true

- Stretch: Implement the following routes
- Implement a new GET route /blogs/get-multi?sortField=<sortField>&sortOrder=<sortOrder>&limit=<limit>&page=<page>
- This route should get the following query params from the url:
- sortField: {String}
- sortOrder: {1 or -1}
- limit: {Number}
- page: {Number}
- Note:
- The goal of this route is to get a sorted list of all blogs posts that can be paged through.
- Therefore, we can pass an empty object into .find({}) since that will match all blog posts and chain .sort(), .limit() and .skip() off of it.
- For sortOrder, limit and page, we will have to coerce these values from type string into type number since query params always come through as strings.
- The limit param can be passed directly into .limit(), however the page param cannot be passed directly into .skip(). Since page represents the current page of limit number of results and skip represents the number of results to skip, we will first have to convert the number for page into the equivalent number for skip. To convert page to skip, multiply (page - 1) by the limit. E.G. Page 1 of limit 10 results should skip 0 results and return the first 10 found blog posts; page 3 of limit 10 results should skip the first 20 results and return blog posts 20 to 30.
- If any of the query params are missing from the url, the following values should be the defaults:
- sortField = 'id'
- sortOrder = -1
- limit = 10
- page = 1
- Additionally, add the following validations for the query params:
- sortOrder must be either 1 or -1
- limit must be a number greater than 1
- page must be a number greater than 1
- If any of the query param validations fail, the values should be reverted to the defaults
- If the above was successful, the route should respond with an object containing success:true and the found blogs
- Implement a new DELETE route /blogs/delete-multi
- This route should get a list of blog ids from the request body and delete all blogs with matching ids
- If the above was successful, the route should respond with an object containing success:true

- Stretch: Wrap all route handler code in try/catch blocks