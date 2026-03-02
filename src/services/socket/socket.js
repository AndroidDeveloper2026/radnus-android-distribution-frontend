import { io } from "socket.io-client";
import API from '../API/api';

const socket = io(API);

export default socket;