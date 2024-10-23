module.exports = (sequelize, Datatypes) => {

    const Comments = sequelize.define("Comments", {
        commentBody: {
            type: Datatypes.STRING,
            allownull:false,
        },
        username: {
            type: Datatypes.STRING,
            allownull:false,
        },
    });

    return Comments;
};