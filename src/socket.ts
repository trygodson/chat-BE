import { nanoid } from 'nanoid';
import { Server, Socket } from 'socket.io';

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    CREATE_ROOM: 'CREATE_ROOM',
    SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
    JOIN_ROOM: 'JOIN_ROOM',
  },
  SERVER: {
    ROOMS: 'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM',
    ROOM_MESSAGE: '',
  },
};

// const rooms: Record<string, { name: string }> = {};
const rooms = [];

function socket({ io }: { io: Server }) {
  console.info(`Sockets enabled`);

  io.on(EVENTS.connection, (socket: Socket) => {
    socket.emit(EVENTS.SERVER.ROOMS, rooms);

    /*
     * When a user creates a new room
     */
    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ createdRoom }) => {
      // add a new room to the rooms object
      rooms.push(createdRoom);

      socket.join(createdRoom);
      // socket.join(roomId);

      // broadcast an event saying there is a new room
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

      // emit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.ROOMS, rooms);
      // // emit event back the room creator saying they have joined a room
      // socket.emit(EVENTS.SERVER.JOINED_ROOM, createdRoom);
    });

    /*
     * When a user sends a room message
     */

    socket.on('send-msg', ({ to, messages }) => {
      socket.broadcast.emit('msg-recieve', { to, messages });
    });

    /*
     * When a user joins a room
     */
  });
}

export default socket;
