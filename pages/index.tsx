import Head from "next/head";
import Image from "next/image";
import { GetServerSideProps } from "next";

import styles from "../styles/Home.module.scss";

import HomeMenubar from "../components/HomeMenubar";
import HackerTyper from "../components/HackerTyper";

import Quotes from "../data/quotes";

const description = "This is the personal website of Xenu.";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  let quote = Quotes[Math.floor(Math.random() * Quotes.length)];
  return {
    props: {
      quote: quote.quote,
      quoteAuthor: quote.author
    }
  };
};

export default function Home(props: { quote: string, quoteAuthor: string }) {
  return (
    <div>
      <Head>
        <title>Prophet of Xenu</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <HomeMenubar></HomeMenubar>
      <main className={styles.main}>
        <HackerTyper className={styles.quote} text={props.quote} mouseOver={props.quoteAuthor} />
      </main>
    </div>
  );
}
