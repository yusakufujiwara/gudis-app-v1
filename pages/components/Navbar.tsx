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
      <Link href="/" style={router.pathname === "/" ? activeLinkStyle : linkStyle}>ホーム</Link>
      <Link href="/room" style={router.pathname === "/room" ? activeLinkStyle : linkStyle}>グルディスを行う</Link>
      <Link href="/evaluations" style={router.pathname === "/evaluations" ? activeLinkStyle : linkStyle}>評価一覧</Link>
      <Link href="/profile" style={router.pathname === "/profile" ? activeLinkStyle : linkStyle}>プロフィール</Link>
      <Link href="/history" style={router.pathname === "/history" ? activeLinkStyle : linkStyle}>議題履歴</Link>
      <Link href="/my-evaluations" style={router.pathname === "/my-evaluations" ? activeLinkStyle : linkStyle}>自分の評価</Link>
    </nav>
  );
}