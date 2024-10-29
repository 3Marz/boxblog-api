import UserController from '../controllers/users.controller'
import Route from '.';
import isAuthorized from '../middlewares/isAuthorized';

class UserRoute extends Route {
	controller: typeof UserController
	constructor(controller: typeof UserController) {
		super()
		this.controller = controller
	}
	init() {
		// Signup new users
		this.router.post("/signup", this.controller.signup)

		// Login users
		this.router.post("/login", this.controller.login)

		// Refresh users
		this.router.post("/refresh", this.controller.refresh)

		// Refresh users
		this.router.post("/isSigned", isAuthorized, this.controller.isSigned)

		// Get All users
		this.router.get("/", this.controller.getAll)

		// Get User By Username
		this.router.get("/:username", this.controller.getByUsername)
		
		// Get User By UserID
		this.router.get("/id/:userId", this.controller.getByUserId)

	}
}

export default UserRoute;

