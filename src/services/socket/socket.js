import { io } from "socket.io-client";
// import API from '../../services/API/api';
import { API_BASE_URL } from '@env';

const socket = io(API_BASE_URL);

export default socket;