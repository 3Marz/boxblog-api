import { Response, Request, NextFunction } from "express";
import db from "../database";
import { Sequelize } from "sequelize";
import { deleteFile, uploadFile } from "../s3";

const findAll = async (req: Request, res: Response) => {
	try {
		const category = req.query.cat;
		const blogs = await db.blog.findAll({
			where: {
				category,
			},
			limit: req.query.limit ? Number(req.query.limit) : undefined
		})

		res.status(200).json({
			count: blogs.length,
			data: blogs
		});
	} catch (err: any) {
		console.error(err);
		res.status(500).json({ message: err.message })
	}
}

const findAllByUserId = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const blogs = await db.blog.findAll({
			where: {
				userId,
			},
		})

		res.status(200).json({
			count: blogs.length,
			data: blogs
		});
	} catch (err: any) {
		console.error(err);
		res.status(500).json({ message: err.message })
	}
}

const findRandom = async (_req: Request, res: Response) => {
	try {
		const blog = await db.blog.findOne({
			order: Sequelize.literal('RAND()'),
			limit: 1
		})

		res.status(200).json(blog);
	} catch (err: any) {
		console.error(err);
		res.status(500).json({ message: err.message })
	}
}

const createBlog = async (req: Request, res: Response) => {
	if (!req.body.title || !req.body.desc || !req.body.body || !req.body.category || !req.file) {
		return res.status(400).json({
			message: "Data is invalid! send all required data:title, desc, body, category, image"
		})
	} else {
		try {
			const newBlog = {
				title: req.body.title,
				desc: req.body.desc,
				image: req.file?.filename,
				body: req.body.body,
				category: req.body.category,
				//@ts-ignore
				userId: req.userData.userId
			}
			await db.blog.create(newBlog)
			await uploadFile(`uploads/${req.file?.filename}`, req.file?.filename)

			res.status(201).json({
				message: "new Blog Created!",
				//@ts-ignore
				token: req.newToken ? req.newToken : null
			})
		}
		catch (err: any) {
			console.error(err);
			res.status(500).json({ error: err.message })
		}
	}
}

const updateBlog = async (req: Request, res: Response) => {
	if (!req.body.title || !req.body.desc || !req.body.image || !req.body.body || !req.body.category) {
		res.status(400).json({
			message: "Data is invalid! send all required data:title, desc, image, body, category", req: req.body
		})
	} else {
		try {
			const { id } = req.params

			const updatedBlog = {
				title: req.body.title,
				desc: req.body.desc,
				image: req.file?.filename,
				body: req.body.body,
				category: req.body.category,
				userId: req.body.userData.userId
			}
			const oldBlog = await db.blog.findByPk(id)

			if (oldBlog) {
				oldBlog.set(updatedBlog)
				await oldBlog.save()
				res.status(200).json({ message: "Blog has been updated!" })
			} else {
				res.status(404).json({ message: "Blog not found" });
			}
		}
		catch (err: any) {
			console.error(err);
			res.status(500).json({ message: err.message })
		}
	}
}

const findById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const blog = await db.blog.findByPk(id);
		if (!blog) {
			return res.status(404).json({ error: "Blog not found" })
		}
		try {
			const user = await db.user.findByPk(blog.userId)
			if (!user) { return res.status(404).json({ error: "Creater not found" }) }
			res.status(200).json({
				id: blog.id,
				title: blog.title,
				desc: blog.desc,
				image: blog.image,
				body: blog.body,
				category: blog.category,
				createdAt: blog.createdAt,
				username: user.username,
				userId: user.id
			})
		}
		catch (err: any) {
			console.error(err);
			res.status(500).json({ error: err.message })
		}
	} catch (err: any) {
		console.error(err);
		res.status(500).json({ error: err.message })
	}
}

const deleteBlog = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		//@ts-ignore
		const userId = req.userData.userId

		const blog = await db.blog.findByPk(id)

		if (!blog) {
			return res.status(404).json({ message: "Blog not found" });
		}
		if (blog.userId !== userId) {
			return res.status(401).json({ message: "You are not the owner of the blog" });
		}

		await deleteFile(blog.image)
		await blog.destroy()
		res.status(200).json({ message: "Blog has been Deleted!" })

	} catch (err: any) {
		console.error(err)
		res.status(500).json({ message: err.message })
	}
}

const deleteAll = async (_req: Request, res: Response) => {
	try {

		const result = await db.blog.destroy({})

		console.log(result)

		if (!result) {
			res.status(404).json({ message: "Some thing went wrong" });
		}

		res.status(200).json({ message: "All blogs have been deleted!" })

	}
	catch (err: any) {
		console.error(err);
		res.status(500).json({ message: err.message })
	}
}

const BlogController = {
	findAll,
	findRandom,
	createBlog,
	updateBlog,
	findById,
	findAllByUserId,
	deleteBlog,
	deleteAll
}

export default BlogController

