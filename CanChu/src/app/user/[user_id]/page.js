'use client';

import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Navbar from '../../component/navbar/navbar.js';
import Userprofile from '../../component/userprofile/userprofile.js';
import Editprofile from '../../component/editprofile/editprofile.js';
import Postcontent from '../../component/postcontent/postcontent.js';
import styles from './page.module.scss';
import FirstPost, { getPosts } from '../../component/post/Post.js';
import PostSkeleton from '../../component/postSkeleton/postSkeleton.js';

export default function MyApp({ params }) {
  // console.log(params);
  const cookies = new Cookies();
  const my_id = cookies.get('id');
  const [posts, setPosts] = useState([]);
  const [nextTenPostsCursor, setnextTenPostsCursor] = useState('');
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);

  let isMyHomePage = false;
  if (my_id === params.user_id) {
    isMyHomePage = true;
  }
  const fetchPosts = async (user_id, cursor) => {
    // 如果正在發送請求，則直接返回
    if (isFetchingPosts) return;
    try {
      setIsFetchingPosts(true); // 設定為正在發送請求
      const data = await getPosts(user_id, cursor);
      console.log(data.next_cursor, nextTenPostsCursor);
      setnextTenPostsCursor(data.next_cursor); // 使用函式式的更新形式來更新 nextTenPostsCursor
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    } catch (error) {
      console.error(error);
      alert('無法取得貼文');
    } finally {
      setIsFetchingPosts(false); // 無論成功或失敗，都設定為沒有正在發送請求
    }
  };
  useEffect(() => {
    fetchPosts(nextTenPostsCursor);
  }, []);
  // if (posts.length === 0) fetchPosts(nextTenPostsCursor);

  // 使用 useEffect 來監聽捲動事件
  useEffect(() => {
    const handleScroll = () => {
      const { scrollY } = window;
      const pageHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const remainingDistance = 100;

      if (
        scrollY + windowHeight >= pageHeight - remainingDistance &&
        !isFetchingPosts &&
        nextTenPostsCursor != null
      ) {
        console.log('get the posts!');
        fetchPosts(nextTenPostsCursor);
      }
    };

    const debounce = (fn, delay) => {
      let timeId = null;
      return function (...args) {
        const shouldExecuteImmediate = !timeId;

        if (timeId) clearTimeout(timeId);

        timeId = setTimeout(() => {
          timeId = null;
          if (!shouldExecuteImmediate) {
            fn.apply(this, args);
          }
        }, delay);

        if (shouldExecuteImmediate) {
          fn.apply(this, args);
        }
      };
    };

    // 在捲動事件上套用 debounce 處理
    const handleScrollDebounced = debounce(handleScroll, 1000);
    window.addEventListener('scroll', handleScrollDebounced);

    // 移除事件監聽器，避免記憶體洩漏
    return () => {
      window.removeEventListener('scroll', handleScrollDebounced);
    };
  }, [isFetchingPosts, nextTenPostsCursor]);

  //   let previousTime = 0;

  //   return function (...args) {
  //     const nowTime = new Date().getTime();

  //     if (nowTime - previousTime > delay) {
  //       fn.apply(this, args);
  //       previousTime = nowTime;
  //     }
  //   };
  // }
  // const throttledHandleScroll = throttle(handleScroll, 2000);
  // window.addEventListener('scroll', throttledHandleScroll);

  // window.addEventListener('scroll', handleScroll);

  return (
    <div className={styles.wholePage}>
      <title>CanChu</title>
      <Navbar className={styles.Navbar} />
      <Userprofile />
      <div>
        <div className={styles.sepSide}>
          <Editprofile
            isMyHomePage={isMyHomePage}
            homepage_id={params.user_id}
            isFetchingPosts={isFetchingPosts}
          />
          <div className={styles.posts}>
            <Postcontent />
            {isFetchingPosts ? (
              <div>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </div>
            ) : (
              posts.map((post) => (
                <FirstPost
                  my_post={my_id === post.user_id.toString()} // 將判斷結果傳遞給 my_post
                  edit
                  detail={false}
                  url={post.picture}
                  name={post.name}
                  time={post.created_at}
                  context={post.context}
                  like={post.like_count}
                  comment_count={post.comment_count}
                  is_like={post.is_liked}
                  id={post.id}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
