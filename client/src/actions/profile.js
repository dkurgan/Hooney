import api from "../api";
import { GET_ME } from './types';

// export const getCurUserProfile = (token) => async dispatch =>{
//     let res = await api.get('/profile/me',{
//         headers: { 
//             "x-auth-token": token,
//         },
//     });
//     console.log(res.data, 'actions')
//     dispatch({
//         type: GET_ME,
//         paylaod: res.data
//     })
// }
