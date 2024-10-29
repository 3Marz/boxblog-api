import { ModelStatic, Sequelize } from "sequelize";
import Blog from "./models/blogs.model"
import User from "./models/users.model"

type Database = {
	sequelize: Sequelize
	blog: ModelStatic<any>
	user: ModelStatic<any>
}

const sequelize = new Sequelize(
	'sqlite:prod.db', {
	//logging: false
});

const blog = Blog(sequelize)
const user = User(sequelize)

user.hasMany(blog, {
	foreignKey: "userId"
})
blog.belongsTo(user)

let db: Database = {
	blog,
	user,
	sequelize: sequelize
}


export default db;

