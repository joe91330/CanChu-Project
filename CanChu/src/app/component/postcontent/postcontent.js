'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './postcontent.module.scss';
import { postPost } from '../api.js';

export default function Postcontent() {
  const [userComment, setUserComment] = useState('');
  // 在 textarea 中輸入文字時觸發，將輸入的內容更新到 userComment 狀態中 用於處理比較簡單的欄位
  const handleCommentChange = (event) => {
    setUserComment(event.target.value);
  };

  const handlePostComment = async () => {
    try {
      // 在這裡調用你的 API 函式，將使用者輸入的文字發送到 API 上
      const response = await postPost({ context: userComment });
      // 處理回傳的回應，例如顯示成功訊息
      console.log(response.data);
      setUserComment('');
      window.location.reload();
    } catch (error) {
      // 處理錯誤，例如顯示錯誤訊息
      console.error(error);
      alert('貼文發佈失敗！');
    }
  };

  return (
    <div className={styles.border}>
      <div className={styles.userAndComment}>
        <Image src="/個人照片.png" id={styles.userimage} width={60} height={60} alt="" />
        <textarea
          id={styles.userComment}
          placeholder="說點什麼嗎?"
          value={userComment}
          onChange={handleCommentChange}
        />
      </div>
      <button type="button" id={styles.postComment} onClick={handlePostComment}>
        發佈貼文
      </button>
    </div>
  );
}
