import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
	class Blog extends Model { }
	Blog.init({
		title: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		desc: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		image: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		body: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		category: {
			type: DataTypes.STRING,
			allowNull: false
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: "blog",
		tableName: "blogs"
	})
	return Blog
};

