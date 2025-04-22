import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* Google Search Console 用の所有権確認タグ */}
        <meta name="google-site-verification" content="l4m03Ly8DZd" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
