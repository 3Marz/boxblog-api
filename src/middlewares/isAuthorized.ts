import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken"

const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.headers.authorization?.split(" ")[1];
	const refreshToken = req.cookies['refreshToken'];

	if (!accessToken && !refreshToken) {
		return res.status(401).json({ error: "Access Denied, No token provided" })
	}

	try {
		const decoded = jwt.verify(accessToken as string, process.env.JWT_PRIVTE_KEY as string)
		//@ts-ignore
		req.userData = decoded
		next();
	}
	catch (err) {
		if (!refreshToken) {
			return res.status(401).json({ error: 'Access Denied. No refresh token provided.' });
		}

		try {
			const decoded = jwt.verify(refreshToken, process.env.JWT_PRIVTE_KEY as string)
			//@ts-ignore
			const newAccessToken = jwt.sign({ email: decoded.email, userId: decoded.userId }, process.env.JWT_PRIVTE_KEY as string)

			//res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
			//	.header('Authorization', newAccessToken)
			//@ts-ignore
			req.userData = decoded
			
			//@ts-ignore
			req.newToken = newAccessToken

			next();
		} catch (err) {
			console.error(err)
			res.status(401).json({
				error: "Invalid Token"
			})
		}
	}
}

export default isAuthorized
