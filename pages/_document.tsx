import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* Google Search Console 用の所有権確認タグ */}
        <meta name="google-site-verification" content="I7zYDjgWp0RbJG7i0KnXDWzW-fQa1RP6loZ1WAz2eJI" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
