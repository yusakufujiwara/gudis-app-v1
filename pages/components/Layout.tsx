import Navbar from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head />
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}