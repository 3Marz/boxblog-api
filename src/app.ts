import express, { Request, Response, Express } from "express";
import bodyParser from "body-parser"
import cors from "cors"
import path from 'path';
import cookieParser from "cookie-parser"

import Route from "./routes";

class App {
	app: Express
	constructor() {
		this.app = express();
		this.app.use(bodyParser.urlencoded({ extended: false }))
		this.app.use(bodyParser.json())
		this.app.use(cookieParser())
		this.app.use(cors({credentials:true, origin:"http://localhost:5173"}))
	}

	addRoute(path: string, route: Route) {
		this.app.use(path, route.router)
	}

	init() {

		this.app.get("/", (_req: Request, res: Response) => {
			res.status(200).send("Welcome To BoxBlog")
		})

		this.app.get('/uploads/:name', (req, res) => {
			const options = {
				root: path.join("./")
			};

			const name = `./uploads/${req.params.name}`;

			res.sendFile(name, options, (err) => {
				if (err) {
					console.error(err)
					return res.status(404).send("No file was found!");
				} else {
					console.log("Sent", name)
				}
			})
		})
	}
}

export default App;

