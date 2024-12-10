import multer from 'multer';
import Route from '.';
import BlogController from '../controllers/blogs.controller';
import isAuthorized from "../middlewares/isAuthorized";

//const storage = multer.diskStorage({
//	destination: function(_req, _file, cb) {
//		cb(null, './uploads')
//	},
//	filename: function(_req, file, cb) {
//		const uniqueSuffix = Date.now()
//		cb(null, uniqueSuffix + '-' + file.originalname)
//	}
//})

const upload = multer({ dest: '/tmp/' })

class BlogRoute extends Route {
	controller: typeof BlogController
	constructor(controller: typeof BlogController) {
		super()
		this.controller = controller
	}
	init() {
		//Get all Blogs
		this.router.get('/', this.controller.findAll)

		//Get all Blogs By userId
		this.router.get('/u/:userId', this.controller.findAllByUserId)

		//Get A Random Blog
		this.router.get('/random', this.controller.findRandom)

		// Create a Blog
		this.router.post('/', isAuthorized, upload.single('image'), this.controller.createBlog)

		//Update a Blog
		//this.router.put('/:id', this.controller.updateBlog)

		// Get one Blog by id
		this.router.get('/:id', this.controller.findById)

		// Delete one Blog by id
		this.router.delete('/:id', isAuthorized, this.controller.deleteBlog)

		//this.router.delete("/", this.controller.deleteAll)
	}
}

export default BlogRoute;
