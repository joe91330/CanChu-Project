'use client';

import { useEffect, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import Cookies from 'universal-cookie';
import Navbar from '../../component/navbar/navbar.js';
import FirstPost, { postDetail } from '../../component/post/Post.js';
// import { MockData } from '../../component/mockdata.js';
import styles from './page.module.scss';
import PostSkeleton from '../../component/postSkeleton/postSkeleton.js';

export default function MyApp({ params }) {
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);
  const cookies = new Cookies();
  const my_id = cookies.get('id');
  const [post, setPosts] = useState();
  useEffect(() => {
    const fetchPosts = async () => {
      if (!post) {
        try {
          setIsFetchingPosts(true); // 設定為正在發送請求
          const data = await postDetail(params.post_id);
          setPosts(data.post);
        } catch (error) {
          console.error(error);
        } finally {
          setIsFetchingPosts(false); // 無論成功或失敗，都設定為沒有正在發送請求
        }
      } else console.log('沒拿到東西');
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <title>CanChu</title>
      <Navbar />

      <div className={styles.wholePage}>
        <div className={styles.firstPost}>
          {isFetchingPosts ? (
            <PostSkeleton />
          ) : (
            <FirstPost
              my_post={post && my_id === post.user_id.toString()}
              edit
              detail
              url={post?.picture || ''}
              name={post?.name || ''}
              time={post?.created_at || ''}
              context={post?.context || ''}
              like={post?.like_count || 0}
              comment_count={post?.comment_count || 0}
              is_like={post?.is_liked || false}
              id={post?.id || ''}
              comments={post?.comments || []}
            />
          )}
        </div>
      </div>
    </div>
  );
}
