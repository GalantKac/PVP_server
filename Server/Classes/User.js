const  Vector2 = require('./Vector2');

module.exports = class User {
    constructor(id,email,password,nick,wins,loses){
        this.id = id;
        this.email = email;
        this.password = password;
        this.nick = nick;
        this.wins = wins;
        this.loses = loses;
        this.x = 0.1;
        this.y = 0.1;
    }
}