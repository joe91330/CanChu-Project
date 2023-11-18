'use client';

import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import Navbar from './component/navbar/navbar.js';
import FirstPost, { getPosts } from './component/post/Post.js';
import Postcontent from './component/postcontent/postcontent.js';
import Friendlist from './component/friendlist/friendlist.js';
import styles from './page.module.scss';
import PostSkeleton from './component/postSkeleton/postSkeleton.js';

// import useInfiniteScroll from './component/getpost/getPost.js';

export default function MyApp() {
  // const [allPosts, setAllPosts] = useState([]);

  // const distanceToBottom = 100;
  // // 定義 updatePosts 函式來處理獲取的貼文
  // const updatePosts = (newPosts) => {
  //   setAllPosts((prevPosts) => [...prevPosts, ...newPosts]);
  // };
  // // 使用 useInfiniteScroll Hook 並傳遞 updatePosts 函式和 distanceToBottom
  // const posts = useInfiniteScroll(updatePosts, distanceToBottom);

  const cookies = new Cookies();
  const user_id = cookies.get('id');
  const [posts, setPosts] = useState([]);
  const [nextTenPostsCursor, setnextTenPostsCursor] = useState('');
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);

  const fetchPosts = async (cursor) => {
    // 如果正在發送請求，則直接返回
    if (isFetchingPosts) return;
    try {
      setIsFetchingPosts(true); // 設定為正在發送請求
      const data = await getPosts(cursor);
      console.log(data.next_cursor, nextTenPostsCursor);
      setnextTenPostsCursor(data.next_cursor);
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    } catch (error) {
      console.error(error);
      alert('無法取得貼文');
    } finally {
      setIsFetchingPosts(false);
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

  return (
    <div className={styles.wholePage}>
      <title>CanChu</title>
      <Navbar />
      <div>
        <div className={styles.sepSide}>
          <div className={styles.friendlist}>
            <Friendlist />
          </div>
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
                  my_post={user_id === post.user_id.toString()} // 將判斷結果傳遞給 my_post
                  edit
                  detail
                  url={post?.picture || ''}
                  name={post?.name || ''}
                  time={post?.created_at || ''}
                  context={post?.context || ''}
                  like={post?.like_count || 0}
                  comment_count={post?.comment_count || 0}
                  is_like={post?.is_liked || false}
                  id={post?.id || 0}
                  comments={post?.comments || []}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
