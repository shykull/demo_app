module.exports = (sequelize, Datatypes) => {

    const Users = sequelize.define("Users", {
        username: {
            type: Datatypes.STRING,
            allownull:false,
        },
        password: {
            type: Datatypes.STRING,
            allownull:false,
        },
    });

    Users.associate = (models) => {
        Users.hasMany(models.Likes,{
            onDelete: "cascade",
        });
    }

    return Users;
};