/* eslint-disable no-nested-ternary */

'use client';

import Cookies from 'universal-cookie';
import { useState, useEffect } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';
import styles from './editprofile.module.scss';
import {
  getProfile,
  editProfile,
  addFriend,
  deleteFriendInvitation,
  agreeFriendInvitation,
  deleteFriend,
} from '../api.js';

export default function Editprofile({ isMyHomePage, homepage_id, isFetchingPosts }) {
  // { isMyHomePage: true/false }
  // get porfile api
  const cookies = new Cookies();
  const name = cookies.get('name');
  const [homePageFunctionText, sethomePageFunctionText] = useState();
  const [profile, setProfile] = useState({ name, introduction: '', tags: '', friendship: null });
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfile(homepage_id);
      setProfile(response.data.user);
    };
    fetchProfile();
  }, []);
  useEffect(() => {
    if (profile === undefined) {
      return;
    }
    if (isMyHomePage) {
      sethomePageFunctionText('編輯個人檔案');
    } else if (profile.friendship === null) {
      sethomePageFunctionText('邀請成為好友');
    } else if (profile.friendship.status === 'requested') {
      sethomePageFunctionText('刪除好友邀請');
    } else if (profile.friendship.status === 'pending') {
      sethomePageFunctionText('接受好友邀請');
    } else if (profile.friendship.status === 'friend') {
      sethomePageFunctionText('刪除好友');
    }
  }, [profile]);

  const handleAddFriend = async () => {
    try {
      const response = await addFriend(homepage_id);
      // 處理回傳的回應，例如顯示成功訊息
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      // 處理錯誤，例如顯示錯誤訊息
      console.error(error);
      alert('加好友失敗');
    }
  };

  const handleDeleteFriendInvitation = async (friendship_id) => {
    try {
      const response = await deleteFriendInvitation(friendship_id);
      // 處理回傳的回應，例如顯示成功訊息
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      // 處理錯誤，例如顯示錯誤訊息
      console.error(error);
      alert('刪好友失敗');
    }
  };

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
      await deleteFriend(friendship_id);
      window.location.reload();
    } catch (error) {
      // 處理錯誤，例如顯示錯誤訊息
      console.error(error);
      alert('刪好友失敗');
    }
  };
  const [isEditing, setIsEditing] = useState(false);
  const handleEditButtonClick = () => {
    if (isMyHomePage) {
      // 切換編輯
      setIsEditing(!isEditing);
    } else if (profile.friendship === null) {
      handleAddFriend();
    } else if (profile.friendship.status === 'requested') {
      handleDeleteFriendInvitation(profile.friendship.id);
    } else if (profile.friendship.status === 'pending') {
      handleAgreeFriend(profile.friendship.id);
    } else if (profile.friendship.status === 'friend') {
      handleDeleteFriend(profile.friendship.id);
    }
  };

  const handleInputChange = (event) => {
    const { name: inputName, value } = event.target;
    setProfile((prevprofile) => ({
      ...prevprofile,
      [inputName]: value,
    }));
  };
  const handleEditProfile = async () => {
    try {
      // 在這裡調用你的 API 函式，將使用者輸入的文字發送到 API 上
      const response = await editProfile({
        name: profile.name,
        introduction: profile.introduction,
        tags: profile.tags,
      });
      // 處理回傳的回應，例如顯示成功訊息
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      // 處理錯誤，例如顯示錯誤訊息
      console.error(error);
      alert('個人檔案修改失敗！');
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.border}>
        <div id={styles.personalprofile_f}>
          <button
            type="button"
            id={styles.personalprofile}
            onClick={handleEditButtonClick}
            style={{
              background: isEditing && '#D3D3D3',
            }}
          >
            {isFetchingPosts ? <Skeleton /> : homePageFunctionText}
          </button>
        </div>
        <div className={styles.introTags_f}>
          <div className={styles.introAndHabbit}>自我介紹</div>
          {!isEditing ? (
            isFetchingPosts ? (
              <Skeleton count={1} className={styles.introAndTags} />
            ) : (
              <div className={styles.introAndTags}>{profile.introduction}</div>
            )
          ) : (
            <input
              className={styles.inputBar}
              name="introduction"
              onChange={handleInputChange}
              value={profile.introduction} // 設置 input 的值為使用者的自我介紹，便於編輯
            />
          )}
          <div className={styles.introAndHabbit}>興趣</div>
          {!isEditing ? (
            isFetchingPosts ? (
              <Skeleton count={1} className={styles.introAndTags} />
            ) : (
              <div className={styles.introAndTags}>{profile.tags}</div>
            )
          ) : (
            <input className={styles.inputBar} name="tags" onChange={handleInputChange} />
          )}
        </div>
        <div className={styles.confirmAndCancelButton}>
          {isEditing && (
            <button type="button" id={styles.confirmButton} onClick={handleEditProfile}>
              確認
            </button>
          )}
          {isEditing && (
            <button type="button" id={styles.cancelButton} onClick={handleEditButtonClick}>
              取消
            </button>
          )}
        </div>
      </div>
      <footer className={styles.copyRight}>
        關於我們 · 隱私權條款 · Cookie 條款 · © 2023 CanChu, Inc.
      </footer>
    </div>
  );
}
