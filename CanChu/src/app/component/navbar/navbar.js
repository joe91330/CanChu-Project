import Image from 'next/image';
import { Pattaya } from 'next/font/google';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import Link from 'next/link';
import { useState } from 'react';
import style from './navbar.module.scss';
import { userSearch } from '../api.js';

const pattaya = Pattaya({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pattaya',
});

export default function Navbar() {
  const cookies = new Cookies();
  const router = useRouter();
  const enterPersonalProfile = () => {
    const user_id = cookies.get('id');
    router.push(`/user/${user_id}`);
  };

  const enterFriendProfile = (user_id) => {
    router.push(`/user/${user_id}`);
  };

  const [searchResults, setSearchResults] = useState([]);
  const [enterSearch, setenterSearch] = useState('');
  // search friend api
  const handleInputChange = async (event) => {
    setenterSearch(event.target.value);
    try {
      // 在這裡調用你的 API 函式，將使用者輸入的文字發送到 API 上
      const response = await userSearch(enterSearch);
      setSearchResults(response.data.data.users);
      console.log(response.data.data.users);
    } catch (error) {
      // 處理錯誤，例如顯示錯誤訊息
      console.error(error);
      alert('搜尋朋友失敗！');
    }
  };
  // console.log(searchResults);

  return (
    <header className={`${style.border} ${pattaya.variable}`}>
      <Link href="/">
        <div className={style.canchu}>CanChu</div>
      </Link>
      <div>
        <div className={style.search_bar}>
          <Image className={style.search_pic} src="/search 2.png" width={36} height={36} alt="" />
          <input
            type="text"
            value={enterSearch}
            placeholder="搜尋"
            className={style.searching}
            onChange={handleInputChange}
          />
        </div>
        <div className={style.scrollFriendList}>
          {searchResults.map((data) => (
            <button
              type="button"
              className={style.friendList}
              key={data.id}
              onClick={() => enterFriendProfile(data.id)}
            >
              <Image src="/小卡比.png" className={style.picCircle} width={36} height={36} alt="" />
              <div id={style.nameFont}>{data.name}</div>
            </button>
          ))}
        </div>
      </div>
      <button type="button" className={style.profile_pic}>
        <Image src="/個人照片.png" width={36} height={36} alt="" onClick={enterPersonalProfile} />
      </button>
    </header>
  );
}
