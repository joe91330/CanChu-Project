// import { useEffect, useState } from 'react';
// import { getPost } from '../api.js';

// const getPosts = async (nextTenPostsCursor) => {
//   try {
//     // 在這裡調用 API 函式，將使用者的貼文從 API 拿出
//     const response = await getPost(nextTenPostsCursor);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     alert('沒有成功獲得貼文');
//     return null;
//   }
// };
// const [posts, setPosts] = useState([]);
// const [nextTenPostsCursor, setNextTenPostsCursor] = useState('');
// const [isFetchingPosts, setIsFetchingPosts] = useState(false);

// const fetchPosts = async (cursor) => {
//   if (isFetchingPosts) return;
//   try {
//     setIsFetchingPosts(true);
//     // 在這裡調用 API 函式，將使用者的貼文從 API 拿出
//     // 請確保 getPosts 函式回傳的格式與下面範例一致
//     const data = await getPosts(cursor);
//     setNextTenPostsCursor(data.next_cursor);
//     setPosts((prevPosts) => [...prevPosts, ...data.posts]);
//   } catch (error) {
//     console.error(error);
//     alert('無法取得貼文');
//   } finally {
//     setIsFetchingPosts(false);
//   }
// };

// const useInfiniteScroll = (fetchPosts, distanceToBottom) => {
//   const handleScroll = () => {
//     const { scrollY } = window;
//     const pageHeight = document.documentElement.scrollHeight;
//     const windowHeight = window.innerHeight;

//     if (
//       scrollY + windowHeight >= pageHeight - distanceToBottom &&
//       !isFetchingPosts &&
//       nextTenPostsCursor != null
//     ) {
//       fetchPosts(nextTenPostsCursor);
//     }
//   };

//   const debounce = (fn, delay) => {
//     let timeId = null;
//     return function (...args) {
//       const shouldExecuteImmediate = !timeId;

//       if (timeId) clearTimeout(timeId);

//       timeId = setTimeout(() => {
//         timeId = null;
//         if (!shouldExecuteImmediate) {
//           fn.apply(this, args);
//         }
//       }, delay);

//       if (shouldExecuteImmediate) {
//         fn.apply(this, args);
//       }
//     };
//   };

//   useEffect(() => {
//     const handleScrollDebounced = debounce(handleScroll, 1000);
//     window.addEventListener('scroll', handleScrollDebounced);

//     return () => {
//       window.removeEventListener('scroll', handleScrollDebounced);
//     };
//   }, [isFetchingPosts, nextTenPostsCursor]);

//   useEffect(() => {
//     if (posts.length === 0) fetchPosts(nextTenPostsCursor);
//   }, [nextTenPostsCursor]);

//   useEffect(() => {
//     fetchPosts(cursor);
//   }, [posts, fetchPosts]);

//   return posts;
// };

// export default useInfiniteScroll;
