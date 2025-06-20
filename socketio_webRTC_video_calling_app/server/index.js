import { Server } from 'socket.io';

const io = new Server(8000, {
    cors: {
        origin: "*", // Or specify your frontend URL, e.g. "http://localhost:3000"
        methods: ["GET", "POST"]
    }
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);
    socket.on('room:join', (data) => {
        console.log(data)
        const { email, room } = data;
        emailToSocketIdMap.set(email, socket.id);
        socketIdToEmailMap.set(socket.id, email);
        io.to(room).emit('room:joined', { email, id: socket.id });
        socket.join(room);
        io.to(socket.id).emit('room:join', { email, room });
    })

    socket.on('user:call', ({to,offer}) => {
        io.to(to).emit('incoming:call', {
            from: socket.id,
            offer
        });
    })

    socket.on('user:answer', ({to, answer}) => {
        io.to(to).emit('call:accepted', {
            from: socket.id,
            answer
        });
    });

    socket.on('peer:negotiation:needed', ({to, offer}) => {
        io.to(to).emit('peer:negotiation:needed', {
            from: socket.id,
            offer
        });
    });

    socket.on('peer:negotiation:done', ({to, answer}) => {
        io.to(to).emit('peer:negotiation:final', {
            from: socket.id,
            answer
        });
    });

});