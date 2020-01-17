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
                socket.emit('spawn', user);

                // wysylanie inforamcji do innych ze sie stworzylem
                socket.broadcast.emit('spawn', user);

                //powiedz mi kto jest w grze
                for (let playerID in users) {
                    if (playerID != thisUserId) {
                        {
                            socket.emit('spawn', users[thisUserId])
                        }
                    }
                }

                // aktualizacja pozycji gracza i powiadomienie o tym innych
                socket.on('updatePosition', (data) => {
                    // let tmpX = parseFloat(data.x.replace(",", "."));
                    // let tmpY = parseFloat(data.y.replace(",", "."));
                    user.x = data.x;
                    user.y = data.y;
                    console.log(user);

                    //socket.emit('updatePosition', user);
                    socket.broadcast.emit('updatePosition', user);
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