import Head from "next/head";
import Image from "next/image";
// import styles from "../styles/Home.module.css";

import HomeMenubar from "../components/HomeMenubar";

const description = "This is the personal website of Xenu.";

export default function Home() {
  return (
    // <div className={styles.container}>
    <div>
      <Head>
        <title>Prophet of Xenu</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <HomeMenubar></HomeMenubar>
      <h1>Yeet</h1>
    </div>
  );
}
