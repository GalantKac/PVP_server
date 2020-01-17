const path = require("path");
const Sequelize = require("sequelize");
const  Vector2 = require('./Classes/Vector2');

const dataDir = path.join(__dirname, "data");

const sequelize = new Sequelize("pvpDB", null, null, {
    dialect: "sqlite",
    storage: path.join(dataDir, "pvp.sqlite")
});

//connect with db
sequelize.authenticate().then(
    function() {
        console.log("Connection has been established successfully.");
    },
    function(err) {
        console.log("Unable to connect to the database:", err);
    }
);

//Models db

const User = sequelize.define("User",{
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    nick: Sequelize.STRING,
    wins: Sequelize.INTEGER,
    loses: Sequelize.INTEGER,
    x: Sequelize.FLOAT,
    y: Sequelize.FLOAT
},{
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

//  SYNC SCHEMA
const initialiseDatabase = function(clear, addToDB) {
    sequelize.sync({ force: clear }).then(
        function() {
            console.log("Database Synchronised");
            if (addToDB) {
                addToDB();
            }
        },
        function(err) {
            console.log("An error occurred while creating the tables:", err);
        }
    );
};

module.exports = {
    initialiseDatabase,
    User
};