import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
	class User extends Model {}
	User.init({
		username : {
			type: DataTypes.STRING,
			allowNull: false
		},
		email : {
			type: DataTypes.STRING, 
			allowNull: false
		}, 
		password : {
			type: DataTypes.STRING, 
			allowNull: false
		},
	}, {
		sequelize,
		modelName: "user",
		tableName: "users"
	})
	return User;
}

