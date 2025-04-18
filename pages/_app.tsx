import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "./components/Layout"; // 修正: 正しいパスに変更

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}