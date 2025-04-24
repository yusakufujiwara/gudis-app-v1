'use client';

import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const linkStyle = {
    marginRight: "1rem",
    textDecoration: "none",
    color: "#333",
    fontWeight: "normal",
  };

  const activeLinkStyle = {
    ...linkStyle,
    fontWeight: "bold",
    textDecoration: "underline",
  };

  return (
<nav style={{ padding: "1rem", background: "#f5f5f5", display: "flex", flexWrap: "wrap" }}>
      <Link href="/" legacyBehavior><a style={router.pathname === "/" ? activeLinkStyle : linkStyle}>ホーム</a></Link>
      <Link href="/room" legacyBehavior><a style={router.pathname === "/room" ? activeLinkStyle : linkStyle}>グルディスを行う</a></Link>
      <Link href="/evaluations" legacyBehavior><a style={router.pathname === "/evaluations" ? activeLinkStyle : linkStyle}>評価一覧</a></Link>
      <Link href="/profile" legacyBehavior><a style={router.pathname === "/profile" ? activeLinkStyle : linkStyle}>プロフィール</a></Link>
      <Link href="/history" legacyBehavior><a style={router.pathname === "/history" ? activeLinkStyle : linkStyle}>議題履歴</a></Link>
      <Link href="/my-evaluations" legacyBehavior><a style={router.pathname === "/my-evaluations" ? activeLinkStyle : linkStyle}>自分の評価</a></Link>
      <Link href="/terms" legacyBehavior><a style={router.pathname === "/terms" ? activeLinkStyle : linkStyle}>利用規約</a></Link>
      <Link href="/privacy" legacyBehavior><a style={router.pathname === "/privacy" ? activeLinkStyle : linkStyle}>プライバシー</a></Link>
    </nav>
  );
}