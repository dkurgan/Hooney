import axios from 'axios';

export default axios.create({
    baseURL: "https://hooney.herokuapp.com/api"
})