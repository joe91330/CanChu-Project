'use client';

import { Roboto } from 'next/font/google';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// import { MockData } from '../mockdata.js';
import styles from './post.module.scss';
import { getPost, detailPosts, likePost, dislikePost, creatComment, editPost } from '../api.js';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const getPosts = async (nextTenPostsCursor) => {
  try {
    // 在這裡調用 API 函式，將使用者的貼文從 API 拿出
    const response = await getPost(nextTenPostsCursor);
    return response.data;
  } catch (error) {
    console.error(error);
    alert('沒有成功獲得貼文');
    return null;
  }
};
export const postDetail = async (post_id) => {
  try {
    // 在這裡調用 API 函式，將使用者的貼文從 API 拿出
    const response = await detailPosts(post_id);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    alert('沒有成功獲得詳細貼文');
    return null;
  }
};

export default function FirstPost({
  like,
  my_post,
  // url,
  name,
  time,
  context,
  is_like,
  comment_count,
  detail,
  id,
  comments,
}) {
  const router = useRouter();
  const [isLike, setIsLike] = useState(is_like);
  const [likeCount, setLikeCount] = useState(like);

  const [PostChange, setPostChange] = useState(context);

  const handlePostChange = (event) => {
    setPostChange(event.target.value);
  };

  const [isEditingPost, setisEditingPost] = useState(false);

  const handleLikeClick = async () => {
    if (isLike === false) {
      // 更新本地狀態（Optimistic UI）
      setIsLike(true);
      setLikeCount((prevState) => (isLike ? prevState - 1 : prevState + 1));
      try {
        const response = await likePost(id); // 點擊愛心的 API
        // 如果回傳成功，則不需進行任何動作，本地狀態已經在前面更新過
        console.log(is_like);
        return response;
      } catch (error) {
        setIsLike(is_like);
        setLikeCount(like);
        console.error(error);
        alert('點讚失敗！');
        return null;
      }
    } else {
      setIsLike(false);
      setLikeCount((prevState) => (isLike ? prevState - 1 : prevState + 1));
      try {
        const response = await dislikePost(id); // 取消愛心的 API
        return response;
      } catch (error) {
        setIsLike(is_like);
        setLikeCount(like);
        console.error(error);
        alert('取消讚失敗！');
        return null;
      }
    }
  };
  const [newcomment, setUserComment] = useState('');
  const handleCommentChange = (event) => {
    setUserComment(event.target.value);
  };

  const handlePostComment = async () => {
    try {
      // 在這裡調用你的 API 函式，將使用者輸入的評論發送到 API 上
      const response = await creatComment({ content: newcomment }, id);
      // 處理回傳的回應，例如顯示成功訊息
      console.log(response.data);
      setUserComment('');
      window.location.reload();
    } catch (error) {
      // 處理錯誤，例如顯示錯誤訊息
      console.error(error);
      alert('貼文評論失敗！');
    }
  };
  const enterDetailPost = () => {
    router.push(`/posts/${id}`);
  };
  const pushEditPost = async (post_id) => {
    try {
      const response = await editPost(post_id, { context: PostChange });
      console.log(response.data);
      window.location.reload();
      setisEditingPost(false);
    } catch (error) {
      console.error(error);
      alert('貼文修改失敗！');
    }
  };
  return (
    <div className={`${styles.firstpost} ${roboto.variable}`}>
      {my_post && (
        <button
          type="button"
          onClick={() => setisEditingPost(!isEditingPost)}
          className={styles.editIcon}
        >
          <Image src="/icon.png" width={25} height={25} alt="" />
        </button>
      )}
      <div className={styles.profile}>
        <Image src="/小卡比.png" className={styles.bigcircle} width={36} height={36} alt="" />
        <div className={styles.NameAndTime}>
          <h5>
            <b>{name}</b>
          </h5>
          <Link href="/posts/demo">
            <h6>{time}</h6>
          </Link>
        </div>
      </div>
      {isEditingPost ? (
        <div>
          <textarea className={styles.postChange} value={PostChange} onChange={handlePostChange} />
          <div className={styles.ChangePostOrNot}>
            <button type="button" className={styles.ChangePost} onClick={() => pushEditPost(id)}>
              確認
            </button>
            <button
              type="button"
              className={styles.NotChangePost}
              onClick={() => setisEditingPost(false)}
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <article>{context}</article>
      )}
      <hr className={styles.shortline} />
      <div className={styles.icon}>
        <Image
          src={isLike === true ? '/heart-2 1.png' : '/heart-1.png'}
          id={styles.leftcircle}
          width={36}
          height={36}
          alt=""
          onClick={handleLikeClick}
        />
        <Image
          src="/Fb-comment.png"
          id={styles.rightcircle}
          width={36}
          height={36}
          alt=""
          onClick={enterDetailPost}
        />
      </div>
      <hr className={styles.shortline} />
      <div className={styles.number}>
        <Link href="/posts/demo">
          <p>
            {likeCount}
            人喜歡這則貼文
          </p>
        </Link>
        <Link href="/posts/demo">
          <p>
            {comment_count}
            則留言
          </p>
        </Link>
      </div>
      <hr />

      {/* 所有的comment */}
      {detail &&
        comments.map((comment) => (
          <div key={comment.id}>
            <div className={styles.commentPicComment}>
              <div className={styles.commentContainer}>
                <div className={styles.commentFrame}>
                  <Image src={comment.user.picture} width={36} height={36} alt="" />
                </div>
              </div>
              <span className={styles.commentText}>
                <div id={styles.userName}>{comment.user.name}</div>
                <div id={styles.userComment}>{comment.content}</div>
              </span>
            </div>
            <div id={styles.userCommentTime}>{comment.created_at}</div>
          </div>
        ))}

      {/* 留言 */}
      <div className={styles.mid}>
        <Image src="/個人照片.png" id={styles.userimage} width={36} height={36} alt="" />
        <div className={styles.leavemessage}>
          <input
            type="text"
            placeholder="留個言吧"
            onChange={handleCommentChange}
            className={styles.message}
          />
          <button type="button" className={styles.right_arrow} onClick={handlePostComment}>
            <Image src="/right_arrow.png" width={36} height={36} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}
