// import axios from 'axios';

// // User相關的 api
// const userRequest = axios.create({
//   baseURL: 'https://Joe-canchu-api.octave.vip',
//   // 處理跨域問題
//   withCredentials: true,
// });
// // User 相關的 api
// // export const apiUserLogin = (data) => axios.get('/signIn', data);
// export const a = 5 + 1;
// export const apiUserSignUp = async (data) => {
//   try {
//     // 設定 Content-Type 為 application/json
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     };

//     // 發送 POST 請求，並將 data 資料轉換為 JSON 格式
//     const response = await userRequest.post('/users/signup', data, config);
//     return response.data; // 回傳從伺服器收到的資料
//   } catch (error) {
//     // 處理錯誤情況，例如顯示錯誤訊息
//     console.error(error);
//     throw error;
//   }
// };

import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
export const setToken = (accessToken) => {
  cookies.set('access_token', accessToken, { path: '/', secure: true, sameSite: true });
};
export const setID = (id) => {
  cookies.set('id', id, { path: '/', secure: true, sameSite: true });
};
export const setName = (name) => {
  cookies.set('name', name, { path: '/', secure: true, sameSite: true });
};

require('dotenv').config();

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// 註冊
export const apiUserSignUp = (data) => {
  return axios
    .post(`${apiUrl}/users/signup`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.data);
};

// 登入
export const UserSigin = (data) => {
  return axios
    .post(`${apiUrl}/users/signin`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.data);
};
// 貼文
export const postPost = (data) => {
  // 獲得使用者的 token
  const token = cookies.get('access_token');
  console.log(`Bearer ${token}`); // 檢查 token 是否正確
  console.log(data);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return axios.post(`${apiUrl}/posts`, data, { headers });
};

// 獲取貼文

export const getPost = (user_id, next_cursor) => {
  const token = cookies.get('access_token');
  return axios
    .get(
      `${apiUrl}/posts/search?${user_id ? `user_id=${user_id}` : ''}&${
        next_cursor ? `cursor=${next_cursor}` : ''
      }`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((response) => response.data);
};

// 獲取個人檔案

export const getProfile = (homepage_id) => {
  const token = cookies.get('access_token');
  return axios
    .get(`${apiUrl}/users/${homepage_id}/profile`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
};

// 修改個人檔案
export const editProfile = (enterProfile) => {
  const token = cookies.get('access_token');
  console.log(token);
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  return axios.put(`${apiUrl}/users/profile`, enterProfile, { headers });
};

// 修改個人頭像
export const changePic = (picture) => {
  const token = cookies.get('access_token');
  console.log(token);
  console.log(picture);
  const formData = new FormData();
  formData.append('picture', picture);
  console.log(formData);
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };
  return axios
    .put(`${apiUrl}/users/picture`, formData, { headers })
    .then((response) => response.data);
};

// 貼文like api
export const likePost = (id) => {
  const token = cookies.get('access_token');
  const headers = { Authorization: `Bearer ${token}` };
  console.log(`Bearer ${token}`);
  return axios.post(`${apiUrl}/posts/${id}/like`, {}, { headers });
};
// 貼文取消like api
export const dislikePost = (id) => {
  const token = cookies.get('access_token');
  const headers = { Authorization: `Bearer ${token}` };
  console.log(`Bearer ${token}`);
  return axios.delete(`${apiUrl}/posts/${id}/like`, { headers });
};

// 貼文評論 api
export const creatComment = (comment, id) => {
  console.log(comment, id);
  const token = cookies.get('access_token');
  const headers = { Authorization: `Bearer ${token}` };
  console.log(`Bearer ${token}`);
  return axios.post(`${apiUrl}/posts/${id}/comment`, comment, { headers });
};
// 獲取詳細貼文（包括評論)api
export const detailPosts = (post_id) => {
  const token = cookies.get('access_token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  console.log(`Bearer ${token}`);
  return axios.get(`${apiUrl}/posts/${post_id}`, { headers }).then((response) => response.data);
};

// 搜尋使用者 api
export const userSearch = (keyword) => {
  const token = cookies.get('access_token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  console.log(`Bearer ${token}`);
  return axios.get(`${apiUrl}/users/search?keyword=${keyword}`, { headers });
};

// 顯示朋友 api
export const getFriend = () => {
  const token = cookies.get('access_token');
  const headers = { Authorization: `Bearer ${token}` };
  console.log(`Bearer ${token}`);
  return axios.get(`${apiUrl}/friends/`, { headers });
};

// 好友邀請api
export const addFriend = (user_id) => {
  const token = cookies.get('access_token');
  const headers = { Authorization: `Bearer ${token}` };
  console.log(`Bearer ${token}`);
  return axios.post(`${apiUrl}/friends/${user_id}/request`, {}, { headers });
};

// 刪除好友邀請api
export const deleteFriendInvitation = (user_id) => {
  const token = cookies.get('access_token');
  const headers = { Authorization: `Bearer ${token}` };
  console.log(`Bearer ${token}`);
  return axios.delete(`${apiUrl}/friends/${user_id}`, { headers });
};

// 接受好友邀請 api
export const agreeFriendInvitation = (friendship_id) => {
  const token = cookies.get('access_token');
  const headers = { Authorization: `Bearer ${token}` };
  console.log(`Bearer ${token}`);
  return axios.post(`${apiUrl}/friends/${friendship_id}/agree`, {}, { headers });
};

// pending 好友邀請
export const pendingFriendInvitation = () => {
  const token = cookies.get('access_token');
  const headers = { Authorization: `Bearer ${token}` };
  console.log(`Bearer ${token}`);
  return axios.get(`${apiUrl}/friends/pending`, { headers });
};

// 刪除好友
export const deleteFriend = (friendship_id) => {
  const token = cookies.get('access_token');
  const headers = { Authorization: `Bearer ${token}` };
  console.log(`Bearer ${token}`);
  return axios.delete(`${apiUrl}/friends/${friendship_id}`, {}, { headers });
};

// 修改貼文
export const editPost = (post_id, newPostDetail) => {
  const token = cookies.get('access_token');
  const headers = { Authorization: `Bearer ${token}` };
  console.log(`Bearer ${token}`);
  return axios.put(`${apiUrl}/posts/${post_id}`, newPostDetail, { headers });
};
