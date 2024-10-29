import { Response, Request } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../database';

const signup = async (req: Request, res: Response) => {
	try {
		const userEmail = await db.user.findOne({
			where: {
				email: req.body.email,
			}
		})
		const userUserName = await db.user.findOne({
			where: {
				username: req.body.username,
			}
		})
		if (userUserName) {
			res.status(409).json({ error: "Username taken" })
		}
		else if (userEmail) {
			res.status(409).json({ error: "Email already signed up" })
		}
		else {
			bcrypt.hash(req.body.password, 10, async (err: Error | undefined, hash: string) => {
				if (err) {
					return res.status(500).json({ error: err })
				}
				else {
					try {
						await db.user.create({
							username: req.body.username,
							email: req.body.email,
							password: hash
						});
						res.status(201).send({ massege: "User Created!" });
					}
					catch (err) {
						console.error(err)
						res.status(500).json({ error: "Somthing went wrong in creating a user" });
					}
				}
			})
		}
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: err })
	}
}

const login = async (req: Request, res: Response) => {
	try {
		const userEmail = await db.user.findOne({
			where: {
				email: req.body.email
			}
		})
		if (!userEmail) {
			res.status(401).json({
				error: "Auth failed"
			})
		} else {
			bcrypt.compare(req.body.password, userEmail.password, (err, result) => {
				if (err) {
					return res.status(401).json({
						error: "Auth failed"
					})
				}
				if (result) {

					const userData = {
						email: userEmail.email,
						userId: userEmail.id
					}

					const accessToken = jwt.sign(userData, process.env.JWT_PRIVTE_KEY as string, {
						expiresIn: "1h"
					})

					const refreshToken = jwt.sign(userData, process.env.JWT_PRIVTE_KEY as string, {
						expiresIn: "1d"
					})

					res.status(200)
						.cookie("refreshToken", refreshToken, { httpOnly: true })
						.json({
							massege: `User Logged In Succsfully as ${userEmail.username}`,
							token: accessToken,
							userId: userEmail.id
						})
				} else {
					return res.status(401).json({
						error: "Auth failed"
					})
				}
			})
		}
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: err })
	}
}

const getAll = async (_req: Request, res: Response) => {
	try {
		const users = await db.user.findAll()

		res.status(200).json(users)
	}
	catch (err) {
		console.error(err)
		res.status(500).json({ error: err })
	}
}

const getByUsername = async (req: Request, res: Response) => {
	try {
		const { username } = req.params;
		const user = await db.user.findOne({
			where: {
				username
			}
		})
		
		if(!user) {
			return res.status(404).json({ error: "User Not Found" })
		}

		res.status(200).json(user)
	}
	catch (err) {
		console.error(err)
		res.status(500).json({ error: err })
	}
}

const getByUserId = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const user = await db.user.findOne({
			where: {
				id: userId
			}
		})
		
		if(!user) {
			return res.status(404).json({ error: "User Not Found" })
		}

		res.status(200).json(user)
	}
	catch (err) {
		console.error(err)
		res.status(500).json({ error: err })
	}
}

const refresh = async (req: Request, res: Response) => {
	const refreshToken = req.cookies['refreshToken'];
	if (!refreshToken) {
		return res.status(401).send('Access Denied. No refresh token provided.');
	}

	try {
		const decoded = jwt.verify(refreshToken, process.env.JWT_PRIVTE_KEY as string);
		//@ts-ignore
		const accessToken = jwt.sign({ email: decoded.email, userId: decoded.userId }, process.env.JWT_PRIVTE_KEY as string, { expiresIn: '1h' });

		res.header('Authorization', accessToken).json({
			massege: "User Refreshed"
		})
	} catch (error) {
		return res.status(400).send('Invalid refresh token.');
	}
};

const isSigned = async (req: Request, res: Response) => {
	res.status(200).json({
		//@ts-ignore
		userId: req.userData.userId,
		//@ts-ignore
		username: req.userData.username,
		//@ts-ignore
		token: req.newToken ? req.newToken : null
	})
}

const UserController = {
	signup,
	login,
	refresh,
	getAll,
	getByUsername,
	getByUserId,
	isSigned,
}

export default UserController;

