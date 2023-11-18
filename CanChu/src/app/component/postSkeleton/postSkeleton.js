import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';

import styles from './postSkeleton.module.scss';

export default function PostSkeleton() {
  return (
    <div className={styles.firstpost}>
      <div className={styles.profile}>
        <Skeleton className={styles.bigcircle} count={1} circle />
        {/* <Image src="/小卡比.png" className={styles.bigcircle} width={36} height={36} alt="" /> */}
        <Skeleton count={1} width={50} className={styles.name} />
        <Skeleton count={1} width={50} className={styles.time} />
      </div>
      <div className={styles.articleBorder}>
        <Skeleton count={3} height={20} width={300} className={styles.postcontent} />
      </div>
      <hr className={styles.shortline} />
      <div className={styles.icon}>
        <Skeleton count={1} width={20} />
        <Skeleton count={1} width={20} />
      </div>
      <hr className={styles.shortline} />
      <div className={styles.number}>
        <Skeleton count={1} width={50} />
        <Skeleton count={1} width={50} />
      </div>
      <hr />
      <div className={styles.mid}>
        <Skeleton count={1} className={styles.userimage} circle />
        <div className={styles.leavemessage}>
          <Skeleton count={1} id={styles.userimage} className={styles.message} />
          <Skeleton count={1} id={styles.userimage} className={styles.right_arrow} />
        </div>
      </div>
    </div>
  );
}
