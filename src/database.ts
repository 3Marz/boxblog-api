import { ModelStatic, Sequelize } from "sequelize";
import Blog from "./models/blogs.model"
import User from "./models/users.model"

type Database = {
	sequelize: Sequelize
	blog: ModelStatic<any>
	user: ModelStatic<any>
}

const sequelize = new Sequelize(
	'boxblog',
	'omar',
	'0909',
	{
		host: 'localhost',
		dialect: 'mysql',
		logging: false
	});

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
   return
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

