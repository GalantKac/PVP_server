const socket = require('socket.io');
const app = require('./app');
const db = require('./data');

db.initialiseDatabase(false, null);
const io = socket(app.listen(process.env.PORT || 3000, () => {
    console.log('App running on port 3000 or default');
}));

const User = require('./Classes/User');

let users = [];
let sockets = [];

io.on('connection', (socket) => {
        console.log('Connection mode');

        let user = new User();
        let thisUserId = 0;

        socket.on('loginCompleted', (loginUser) => {

            user = loginUser;
            thisUserId = loginUser.id;
            //  user.x = parseFloat(user.x.replace(",", "."));
            //  user.y = parseFloat(user.y.replace(",", "."));

            console.log(user);

            users[thisUserId] = user;
            sockets[thisUserId] = socket;

            socket.emit('loginCompleted', user);

            //wyslij inforamcje o userze w menu
            // socket.emit('userInformation', (user) =>{});


            socket.on('join', () => {
                console.log('Join to game Player: ' + thisUserId);

                //wysylanie inforamcji ze sie stowrzylem
                user.hp = 200;
                user.isDead = false;
                socket.emit('spawn', user);

                // wysylanie inforamcji do innych ze sie stworzylem
                socket.broadcast.emit('spawn', user);

                //powiedz mi kto jest w grze
                for (let playerID in users) {
                    if (playerID != thisUserId) {
                        {
                            //TU byl blad !!!!
                            socket.emit('spawn', users[playerID])
                        }
                    }
                }

                // aktualizacja pozycji gracza i powiadomienie o tym innych
                socket.on('updatePosition', (data) => {
                    user.x = data.x;
                    user.y = data.y;
                    socket.broadcast.emit('updatePosition', user);
                });

                //aktualizacja rotacji gracza
                socket.on('updateRotation', (data) => {
                    user.rotationX = data.rotationX;
                    socket.broadcast.emit('updateRotation', user);
                });

                //aktualizacja animacji
                socket.on('updateAnimation', (data) => {
                    user.animState = data.animState;
                    user.grounded = data.grounded;
                    socket.broadcast.emit('updateAnimation', user);
                });

                //aktaulizacja stanu zycia gracza
                socket.on('updateHp', (data) => {
                    for (var hitUser in users) {
                        if (hitUser == data.id) {
                            users[hitUser].hp -= Math.floor(Math.random() * 31); // losowy damage
                            if (users[hitUser].hp > 0) {
                                socket.emit('updateHp', users[hitUser]);
                                socket.broadcast.emit('updateHp', users[hitUser]);
                            } else {
                                users[hitUser].isDead = true;
                               // socket.broadcast.emit('backToMenu', users[hitUser]);
                                socket.emit('dead', users[hitUser]);
                                socket.broadcast.emit('dead', users[hitUser]);
                            }
                        }
                    }
                });

            });
        });
        socket.on('disconnect', () => {
            console.log('User disconnected');
            delete users[thisUserId];
            delete sockets[thisUserId];
            socket.broadcast.emit('disconnected', user);
        })
    }
);