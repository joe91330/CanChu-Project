import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from './friendlist.module.scss';
import {
  getFriend,
  pendingFriendInvitation,
  agreeFriendInvitation,
  deleteFriendInvitation,
} from '../api.js';

export default function Friendlist() {
  const [friends, setFriends] = useState([]);
  const [yetfriends, setyetfriends] = useState([]);

  const handleAgreeFriend = async (friendship_id) => {
    try {
      await agreeFriendInvitation(friendship_id);
      window.location.reload();
    } catch (error) {
      // 處理錯誤，例如顯示錯誤訊息
      console.error(error);
      alert('加好友失敗');
    }
  };
  const handleDeleteFriend = async (friendship_id) => {
    try {
      await deleteFriendInvitation(friendship_id);
      window.location.reload();
    } catch (error) {
      // 處理錯誤，例如顯示錯誤訊息
      console.error(error);
      alert('刪好友失敗');
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await getFriend();
        setFriends(response.data.data.users);
        console.log(response.data.data.users);
      } catch (error) {
        console.error(error);
        alert('沒有成功獲得好友');
      }
    };
    fetchFriends();
  }, []);
  useEffect(() => {
    const fetchFriendsInvitation = async () => {
      try {
        const response = await pendingFriendInvitation();
        setyetfriends(response.data.data.users);
        console.log(response.data.data.users);
      } catch (error) {
        console.error(error);
        alert('沒有成功獲得好友邀請');
      }
    };
    fetchFriendsInvitation();
  }, []);

  return (
    <div className={styles.body}>
      <div className={styles.border}>
        <div className={styles.friendList}>
          <Image src="/Ellipse 23.png" className={styles.userimage} width={60} height={60} alt="" />
          <div id={styles.userName}>你的名字</div>
        </div>
        <hr className={styles.shortLine} />

        <div className={`${styles.friendList} ${styles.myFriend}`}>
          <Image src="/Vector.png" className={styles.userimage} width={60} height={60} alt="" />
          <div id={styles.userName}>我的好友</div>
        </div>
        {yetfriends.map((friendsInvitation) => (
          <div key={friendsInvitation.friendship.id} className={styles.accepFriend}>
            <Image
              src={friendsInvitation.picture}
              className={styles.accepFriendPic}
              width={60}
              height={60}
              alt=""
            />
            <div id={styles.accepFriendName}>{friendsInvitation.name}好友邀請</div>
            <div className={styles.acceptAndRejectFriend}>
              <button
                type="button"
                className={styles.acceptFriend}
                onClick={() => handleAgreeFriend(friendsInvitation.friendship.id)}
              >
                確認
              </button>
              <button
                type="button"
                className={styles.rejectFriend}
                onClick={() => handleDeleteFriend(friendsInvitation.friendship.id)}
              >
                取消
              </button>
            </div>
          </div>
        ))}
        {friends.map((friend) => (
          <div key={friend.id} className={styles.friendList}>
            <Image
              src={friend.picture}
              className={styles.userimage}
              width={60}
              height={60}
              alt=""
            />
            <div id={styles.userName}>{friend.name}</div>
          </div>
        ))}
        {/* 插入六個好朋友的列表 */}
        {Array(3)
          .fill()
          .map(() => (
            <div key={Array} className={styles.friendList}>
              <Image
                src="/Ellipse 23.png"
                className={styles.userimage}
                width={60}
                height={60}
                alt=""
              />
              <div id={styles.userName}>好朋友</div>
            </div>
          ))}

        <div className={`${styles.friendList} ${styles.serchAll}`}>
          <Image src="/options 1.png" className={styles.userimage} width={60} height={60} alt="" />
          <div id={styles.userName}>查看全部</div>
        </div>
      </div>
      <footer className={styles.copyRight}>
        關於我們 · 隱私權條款 · Cookie 條款 · © 2023 CanChu, Inc.
      </footer>
    </div>
  );
}
