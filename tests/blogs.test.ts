import supertest from 'supertest'
import App from '../src/app'
import BlogRoute from '../src/routes/blogs.route'
import BlogController from '../src/controllers/blogs.controller'
import db from '../src/database'

const app = new App()

const blogRoute = new BlogRoute(BlogController)
blogRoute.init()
app.addRoute("/blogs", blogRoute)

describe("/blogs endpoint test", () => {
	describe("GET /blogs", () => {

		afterEach(() => {
			jest.resetAllMocks()
		})

		it("return a status code of 200 and findAll called", async () => {
			const spy = jest.spyOn(db.blog, "findAll").mockResolvedValue([])
			const res = await supertest(app.app).get("/blogs")
			expect(res.statusCode).toBe(200)
			expect(spy).toHaveBeenCalled()
		})
	})
	
	describe("POST /blogs", () => {

		afterEach(() => {
			jest.resetAllMocks()
		})

		it("return a 400 status when request body isnt complete and create NOT called", async () => {
			const spy = jest.spyOn(db.blog, "create").mockResolvedValue({
				toJSON: jest.fn()
			})
			const badbodys = [
				{title: "test"},
				{title: "test", desc: "test descrption"},
				{body: "<a>asddsadasd</a>"},
				{title: "test", body: "<a>asddsadasd</a>", category: "Art"},
			]
			for(const body of badbodys) {
				const res = await supertest(app.app).post("/blogs").send(body)
				expect(res.statusCode).toBe(400)
				expect(spy).toHaveBeenCalledTimes(0)
			}
		})

		it("return a 201 status when request body is complete and create called", async () => {
			const spy = jest.spyOn(db.blog, "create").mockResolvedValue({
				toJSON: jest.fn()
			})
			const badbodys = [
				{title: "test", desc: "test descrption", body: "<a>asddsadasd</a>",  category: "Art"},
				{title: "tes231", desc: "other test descrption", body: "<h1>Pythonis..</h1><a>asddsadasd</a>",  category: "Tech"},
				{title: "testdome", desc: "test somr descrption", body: "<a>asddsadasd</a><ul><li>1.asd</li></ul>",  category: "Food"},
			]
			for(const body of badbodys) {
				const res = await supertest(app.app).post("/blogs").send(body)
				expect(res.statusCode).toBe(201)
				expect(spy).toHaveBeenCalled()
			}
		})

	})

	
	//describe("GET /blogs/:id", () => {
	//	beforeEach(() => {
	//		jest.spyOn(db.blog, "findByPk")
	//	})
	//
	//	afterEach(() => {
	//		jest.resetAllMocks()
	//	})
	//})

	//describe("DELETE /blogs/:id", () => {
	//	beforeEach(() => {
	//		jest.spyOn(db.blog, "findByPk").mockImplementation()
	//	})
	//
	//	afterEach(() => {
	//		jest.resetAllMocks()
	//	})
	//})
})






