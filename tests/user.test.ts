import supertest from 'supertest'
import App from '../src/app'
import UserRoute from '../src/routes/users.route'
import UserController from '../src/controllers/users.controller'
import db from '../src/database'

const app = new App()

const blogRoute = new UserRoute(UserController)
blogRoute.init()
app.addRoute("/blogs", blogRoute)

const mockDB = {
	blog: "m"
}



describe("/users endpoint test", () => {
	test("asdjl", () => {
		jest.mock("../src/database", () => (mockDB))
		console.log(db)
		expect(1).toBe(1)
	})
})
