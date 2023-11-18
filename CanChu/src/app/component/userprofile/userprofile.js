import Image from 'next/image';
import { useState } from 'react';
import styles from './userprofile.module.scss';
import { MockData3 } from '../mockdata.js';
import { changePic } from '../api.js';

export default function Userprofile() {
  const [profilePicture, setProfilePicture] = useState(MockData3.picture);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    // 在這裡可以處理選擇的檔案，例如上傳到伺服器或顯示預覽等操作
    try {
      // 在這裡調用你的 API 函式，將使用者輸入的照片發送到 API 上
      const response = await changePic(file);
      // 更新頭像顯示
      setProfilePicture(response.data.picture);
    } catch (error) {
      // 處理錯誤，例如顯示錯誤訊息
      console.error(error);
      alert('個人照片修改失敗！');
    }
  };
  return (
    <div className={styles.border}>
      <div className={styles.profileContainer}>
        <div className={styles.picContainer}>
          <div className={styles.picFrame}>
            <Image src={profilePicture} id={styles.userimage} width={200} height={200} alt="" />
            <label htmlFor="fileInput" id={styles.editProfile}>
              <u>編輯大頭貼</u>
              <input
                type="file"
                id="fileInput"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
        <div className={styles.nameFriend}>
          <div id={styles.userName}>{MockData3.name}</div>
          <div id={styles.friendCount}>{MockData3.friend_count} 位朋友</div>
        </div>
      </div>
      <hr id={styles.underLine} />
      <span id={styles.post}>貼文</span>
    </div>
  );
}
