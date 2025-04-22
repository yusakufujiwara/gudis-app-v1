// app/privacy/page.tsx

export default function PrivacyPolicyPage() {
    return (
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>プライバシーポリシー</h1>
        <p>
          gudis-app（以下、「本アプリ」）では、ユーザーの個人情報を適切に取り扱うことを重要視しています。
        </p>
  
        <h2 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>1. 取得する情報</h2>
        <p>
          本アプリでは、Googleアカウント情報（ユーザー名、メールアドレスなど）を、ログイン認証のために利用する場合があります。
          それ以外の個人情報は取得いたしません。
        </p>
  
        <h2 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>2. 利用目的</h2>
        <p>
          取得した情報は、本人確認やアカウント管理のためにのみ利用します。第三者への提供は行いません。
        </p>
  
        <h2 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>3. 情報の管理</h2>
        <p>
          取得した情報は、適切な管理のもと安全に保管されます。
        </p>
        <h2 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>4. 外部サービスとの連携</h2>
      <p>
        本アプリでは、Googleアカウントによるログイン機能（Google OAuth）を使用します。
        Googleのプライバシーポリシーについては、
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          こちら
        </a>
        をご参照ください。
      </p>

      <h2 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>5. 改定</h2>
      <p>
        本ポリシーは必要に応じて改定されることがあります。
      </p>

      <h2 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>6. お問い合わせ</h2>
      <p>
        プライバシーポリシーに関するご質問は以下のメールアドレスまでご連絡ください。<br />
        Email: yusaku@v02.itscom.net
      </p>

      <p style={{ marginTop: '1rem' }}>制定日：2025年4月21日</p>
    </main>
  );
}