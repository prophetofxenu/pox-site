import Image from "next/image";
import Link from "next/link";

import styles from "../styles/components/HomeMenubar.module.scss";

import xe from "../public/images/xe-symbol-outlined.svg";

export default function HomeMenubar() {
  return (
    <>
      <div className={styles.homeMenubar} >

        <div className={styles.links} >

          <div className={styles.xeImg}>
            <Link href="/" passHref ><a>
              <Image src={xe} alt="Xenon" />
            </a></Link>
          </div>

          <div className={styles.textLinks}>
            <Link href="/blog" >Blog</Link>
            <Link href="/videos" >Videos</Link>
            <Link href="/about" >About</Link>
          </div>

        </div>

      </div>

    </>
  );
}
