'use client';

import { Pattaya, Outfit } from 'next/font/google/index.js';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation.js';
import { apiUserSignUp, setToken, UserSigin, setID, setName } from '../api.js';

import styles from './login.module.scss';

// font
const pattaya = Pattaya({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pattaya',
});
const outfit = Outfit({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export default function Login() {
  const router = useRouter();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmpasswordError, setconfirmpasswordError] = useState('');
  const [isSignInOrUp, setisSignInOrUp] = useState(false);
  const [loginstate, setloginstate] = useState('登入');
  const [signUpState, setsignUpState] = useState('註冊');

  // 使用 useState 定義登入頁面的狀態
  const [isRegisterPage, setIsRegisterPage] = useState(true);
  const handleTogglePage = () => {
    // 切換註冊/登入頁面
    setIsRegisterPage((prev) => !prev);
  };
  // 更改輸入內容
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [signin, setSignin] = useState({
    provider: 'native',
    email: '',
    password: '',
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value.trim(),
    }));
    setSignin((prevFormData) => ({
      ...prevFormData,
      [name]: value.trim(),
    }));
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  // 註冊api
  const handleRegister = async () => {
    let hasError = false;
    if (!emailRegex.test(signin.email)) {
      setEmailError('E-mail格式有錯誤');
      hasError = true;
    } else {
      setEmailError('');
      hasError = false;
    }
    if (!passwordRegex.test(signin.password)) {
      setPasswordError('密碼需同時包含大小寫英文、數字，並超過8個字。');
      hasError = true;
    } else {
      setPasswordError('');
      if (emailRegex.test(signin.email)) {
        hasError = false;
      }
    }
    if (formData.password !== formData.confirmPassword) {
      setconfirmpasswordError('密碼不一致');
      hasError = true;
    } else {
      setconfirmpasswordError('');
      if (emailRegex.test(signin.email) && passwordRegex.test(signin.password)) {
        hasError = false;
      }
    }
    if (hasError) {
      return;
    }
    try {
      setisSignInOrUp(true);
      setsignUpState('註冊中');
      const response = await apiUserSignUp(formData);
      // 處理回傳的資料，例如顯示成功註冊的訊息、導向登入頁面等等 ㄨㄨ
      console.log(response.data);

      // 從response中提取"access_token"
      const accessToken = response.data.access_token;

      setToken(accessToken); // 將 access_token 設定到 Cookie 中

      // // 將"access_token"存儲在sessionStorage中
      // sessionStorage.setItem('access_token', accessToken);

      setIsRegisterPage(!isRegisterPage);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status >= 500 && error.response.status < 600) {
        // 彈出提示視窗通知開發人員
        alert('錯誤錯誤錯誤，晚點再嘗試一次！');
      } else {
        // 如果不是 5xx 狀態碼的錯誤，可以顯示其他錯誤訊息給使用者
        alert('格式錯誤');
      }
      setsignUpState('註冊');
      setisSignInOrUp(false); // 無論成功或失敗，都設定為沒有正在發送請求
    }
  };
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  // 登入api
  const handleSignin = async () => {
    let hasError = false;

    // 驗證郵件地址格式
    if (!emailRegex.test(signin.email)) {
      setEmailError('E-mail格式有錯誤');
      hasError = true;
    } else {
      setEmailError('');
      hasError = false;
    }

    // 驗證密碼格式
    if (!emailRegex.test(signin.email)) {
      setEmailError('E-mail格式有錯誤');
      hasError = true;
    } else {
      setEmailError('');
      hasError = false;
    }
    if (!passwordRegex.test(signin.password)) {
      setPasswordError('密碼需同時包含大小寫英文、數字，並超過8個字。');
      hasError = true;
    } else {
      setPasswordError('');
      if (emailRegex.test(signin.email)) {
        hasError = false;
      }
    }
    if (hasError) {
      return;
    }

    // 如果郵件地址和密碼格式都正確，呼叫 API
    try {
      setloginstate('登入中');
      setisSignInOrUp(true);
      const response = await UserSigin(signin);
      // 處理回傳的資料，例如顯示成功註冊的訊息、導向登入頁面等等
      console.log(response.data);
      const { id } = response.data.user;
      const { name } = response.data.user;

      // 從response中提取"access_token"
      const accessToken = response.data.access_token;
      setToken(accessToken); // 將 access_token 設定到 Cookie 中
      setID(id); // 設置name到cookie中
      setName(name);
      setIsLoginSuccess(true);
      // // 將"access_token"存儲在sessionStorage中
      // sessionStorage.setItem('access_token', accessToken);
    } catch (error) {
      console.error(error);
      alert(error);
      setloginstate('登入');
      setisSignInOrUp(false); // 無論成功或失敗，都設定為沒有正在發送請求
    }
  };

  // 在登入成功後，觸發 useEffect
  useEffect(() => {
    // 如果登入成功，進行導向
    if (isLoginSuccess) {
      router.push(`/`);
    }
  }, [isLoginSuccess]); // 只有在 isLoginSuccess 狀態改變時才觸發 useEffect

  return (
    <div id={styles.wholePage}>
      <div id={styles.border}>
        <div>
          <div id={styles.signInUp}>
            <div className={`${styles.canchu} ${pattaya.variable}`}>CanChu</div>
            {isRegisterPage ? (
              <div className={`${styles.memRL} ${outfit.variable}`}>會員登入</div>
            ) : (
              <div className={`${styles.memRL} ${outfit.variable}`}>會員註冊</div>
            )}
            <div className={styles.textAndInput}>
              {!isRegisterPage && (
                <div>
                  <div>使用者名稱</div>
                  <input
                    type="text"
                    name="name"
                    placeholder="例: Chou Chou Hu"
                    className={styles.inputFrame}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
            <div className={styles.textAndInput}>
              <div>電子郵件</div>
              <input
                type="text"
                name="email"
                placeholder="例: shirney@appworks.tw"
                className={styles.inputFrame}
                onChange={handleInputChange}
              />
              <div className={styles.warningSigns}>{emailError}</div>
            </div>
            <div className={styles.textAndInput}>
              <div>密碼</div>
              <input
                type="password"
                name="password"
                className={styles.inputFrame}
                onChange={handleInputChange}
              />
              <div className={styles.warningSigns}>{passwordError} </div>
            </div>
            <div className={styles.textAndInput}>
              {!isRegisterPage && (
                <div>
                  <div>再次輸入密碼</div>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={styles.inputFrame}
                    onChange={handleInputChange}
                  />
                  <div className={styles.warningSigns}>{confirmpasswordError}</div>
                </div>
              )}
            </div>
            {isRegisterPage ? (
              <button
                type="button"
                className={styles.register}
                onClick={handleSignin}
                disabled={isSignInOrUp}
              >
                {loginstate}
              </button>
            ) : (
              <button
                type="button"
                className={styles.register}
                onClick={handleRegister}
                disabled={isSignInOrUp}
              >
                {signUpState}
              </button>
            )}

            {isRegisterPage ? (
              <div className={styles.blackBlueWords}>
                <div>尚未成為會員？</div>
                <button type="button" className={styles.blueWord} onClick={handleTogglePage}>
                  會員註冊
                </button>
              </div>
            ) : (
              <div className={styles.blackBlueWords}>
                <div>已經是會員了？</div>
                <button type="button" className={styles.blueWord} onClick={handleTogglePage}>
                  會員登入
                </button>
              </div>
            )}
          </div>
        </div>
        <div id={styles.buleBlock} />
      </div>
      <footer className={styles.copyRight}>
        關於我們 · 隱私權條款 · Cookie 條款 · © 2023 CanChu, Inc.
      </footer>
    </div>
  );
}
