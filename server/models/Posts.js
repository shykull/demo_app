module.exports = (sequelize, Datatypes) => {

    const Posts = sequelize.define("Posts", {
        title: {
            type: Datatypes.STRING,
            allownull:false,
        },
        postText: {
            type: Datatypes.STRING,
            allownull:false,
        },
        username: {
            type: Datatypes.STRING,
            allownull:false,
        },
    });

    Posts.associate = (models) => {
        Posts.hasMany(models.Comments,{
            onDelete: "cascade",
        });

        Posts.hasMany(models.Likes,{
            onDelete: "cascade",
        });
    };

    return Posts;
};