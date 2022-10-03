const { uuid } = require('uuidv4');
			var express = require('express');
			var router = express.Router();



			const {db} = require("../mongo")

			router.get('/get-one-example/:id', async function(req, res, next) {
				const objectID = req.params.id
				const blogPost = await db().collection("blogs").findOne({
					objectID: {
						$regex: objectID
					}
				})
				res.json({
					success: true,
					post: blogPost
				})
			});
			router.post('/create-one',(req, res) =>  {
				const title = req.body.title
				const text = req.body.text
				const author = req.body.author
				const email = req.body.email
				const category = req.body.category
				const starRating = req.body.starRating
				const createdAt = new Date()
				const lastModified = new Date()
				const objectID = req.body.objectID
				const blogPost = {
					title: title,
					text: text,
					author: author,
					email: email,
					category: category,
					starRating: starRating,
					createdAt: createdAt,
					lastModified: lastModified,
					objectID: objectID
				

				}
				db().collection("blogs").insertOne(blogPost)
				res.json({
					success: true,
					post: blogPost
				})
			});
			router.put('/update-one/:id', async (req, res, next) => {
				    const objectID = req.params.id
			
					const title = req.body.title
					const text = req.body.text
					const author = req.body.author
					const email = req.body.email
					const category = req.body.category
					const starRating = req.body.starRating
					const lastModified = new Date()
			
					const blogPost = {
						title: title,
						text: text,
						author: author,
						email: email,
						category: category,
						starRating: starRating,
						lastModified: lastModified,
						
					
	
					}
			
					const blogData = await db().collection("blogs").update({
						objectID:objectID
					}, {
						$set: blogPost
					})
		            res.json({
						success: true,
						post: blogPost
					})
				
			})
			router.delete('/delete-one/:id', async (req, res, next) => {
				
				const objectID = req.params.id
			
					
					const blogPost = await db().collection("blogs").deleteOne({
						objectID: objectID
					})
					res.json({
						success: true,
						post: blogPost
					})
				
			});
			
			
			
			
			
			
			
			


				module.exports = router		



				