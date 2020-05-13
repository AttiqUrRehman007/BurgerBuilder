import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-d86fb.firebaseio.com/'
})

export default instance;