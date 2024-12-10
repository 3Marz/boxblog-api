import dotenv from "dotenv"
dotenv.config()
import db from "./database";
import App from "./app";

import BlogRoute from "./routes/blogs.route";
import BlogController from './controllers/blogs.controller';

import UserRoute from "./routes/users.route";
import UserController from "./controllers/users.controller";

const app = new App()

const blogRoute = new BlogRoute(BlogController)
blogRoute.init()
app.addRoute("/blogs", blogRoute)

const userRoute = new UserRoute(UserController)
userRoute.init()
app.addRoute("/users", userRoute)

app.init()
db.sequelize.sync()

const port = process.env.PORT || 3030;

app.app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})

export default app.app;

