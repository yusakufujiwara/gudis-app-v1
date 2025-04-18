export type TopicCategory = "logic" | "speaking" | "cooperation" | "comment"; // 例
export const topics: string[] = [
    "都市部の交通渋滞を緩和するための施策を提案してください。",
    "高齢者の孤独死を防ぐ地域コミュニティの構築方法を考えてください。",
    "食品ロスを削減するための具体的な取り組みを提案してください。",
    "若者の投票率向上のための施策を考えてください。",
    "中小企業の人手不足を解消するための方法を提案してください。",
    "地方の過疎化を食い止めるための政策を考えてください。",
    "子どもの貧困問題を解決するための具体的な施策を提案してください。",
    "環境汚染を減少させるための企業の取り組みを考えてください。",
    "医療従事者の働き方改革を進めるための方法を提案してください。",
    "学校教育におけるいじめ問題を解決するための施策を考えてください。",
    "災害時の避難所運営を円滑にするための方法を提案してください。",
    "ペットの殺処分数を減らすための施策を考えてください。",
    "外国人観光客のマナー向上を促進するための方法を提案してください。",
    "インターネット上の誹謗中傷を減らすための施策を考えてください。",
    "再生可能エネルギーの普及を促進するための政策を提案してください。",
    "児童虐待を防止するための地域社会の取り組みを考えてください。",
    "フードデリバリーサービスの交通事故を減らすための施策を提案してください。",
    "働く女性の育児と仕事の両立を支援するための方法を考えてください。",
    "公共交通機関の遅延を減らすための施策を提案してください。",
    "若者のアルコール依存を防止するための具体的な取り組みを考えてください。",
    "都市部の自転車マナー向上のための施策を提案してください。",
    "学校給食の食品アレルギー対策を強化するための方法を考えてください。",
    "ネット依存症の若者を減らすための施策を提案してください。",
    "障害者の就労支援を効果的に行うための方法を考えてください。",
    "都市部のゴミのポイ捨てを減らすための施策を提案してください。",
    "子どもの運動不足を解消するための具体的な取り組みを考えてください。",
    "高齢者の運転免許返納を促進するための施策を提案してください。",
    "職場のハラスメントを防止するための具体的な方法を考えてください。",
    "地域の伝統文化を継承・発展させるための施策を提案してください。",
    "都市部の騒音問題を解決するための具体的な取り組みを考えてください。",
    "地方の老舗和菓子店が売上を向上させるための新しい販売戦略を提案してください。",
    "オンライン書店が売上を増加させるためのデジタルマーケティング施策を考えてください。",
    "地域密着型のスーパーマーケットが売上を伸ばすためのロイヤルティプログラムを提案してください。",
    "中小規模のフィットネスクラブが会員数を増やすためのプロモーション戦略を考えてください。",
    "地方の観光地にある旅館がオフシーズンの売上を向上させるための施策を提案してください。",
    "地元の工芸品店が若年層の顧客を増やすためのマーケティング戦略を提案してください。",
    "郊外にある飲食店が平日昼間の集客を増やすための施策を考えてください。",
    "新興の化粧品ブランドがSNSを活用して売上を伸ばす方法を提案してください。",
    "家具メーカーがECサイトでの売上を拡大するための取り組みを考えてください。",
    "地域密着型の薬局が他店と差別化して売上を増やす方法を提案してください。",
    "洋服のリサイクルショップがZ世代の顧客を増やすための施策を考えてください。",
    "オンライン学習サービスがリピーターを増やすための戦略を提案してください。",
    "街の小さな本屋が大手通販サイトに対抗して売上を伸ばす方法を考えてください。",
    "地方の観光施設が外国人観光客の売上を伸ばすための取り組みを提案してください。",
    "ベーカリーが近隣住民の来店頻度を増やすための施策を考えてください。",
    "動物カフェが来店数を増やすためのイベント企画を提案してください。",
    "アウトドア用品店が売上を増加させるためのキャンペーン施策を考えてください。",
    "学習塾が非受験生の集客を増やすための新サービスを提案してください。",
    "シニア向けフィットネスジムが新規入会者を獲得するための方法を考えてください。",
    "手作り雑貨のオンラインショップがリピーターを増やすための施策を提案してください。",
    "和菓子メーカーが若年層へのアプローチを強化するためのブランディング施策を考えてください。",
    "町の写真館が売上を伸ばすためのSNS活用法を提案してください。",
    "地方のバス会社が観光需要を取り込んで売上を増やす施策を考えてください。",
    "コインランドリーが空き時間の利用率を上げるための施策を提案してください。",
    "ネイルサロンが常連客を確保するための割引・特典制度を考えてください。",
    "スポーツ用品店が地域イベントと連携して売上を伸ばす方法を提案してください。",
    "コンビニチェーンが高齢者向けに展開すべき新サービスを提案してください。",
    "大手旅行会社が地方創生に貢献できる新規事業を考えてください。",
    "自動車メーカーが環境問題に対応するための新事業を提案してください。",
    "化粧品会社が男性顧客を開拓するための新ブランドを立ち上げるとしたら？",
    "電力会社が電気以外で展開できる新規事業を考えてください。",
    "アパレル企業が「持続可能性（サステナビリティ）」をテーマにした新商品を企画するとしたら？",
    "学習塾が学校外教育で展開すべき新しい教育事業を考えてください。",
    "出版社が紙以外のコンテンツで展開できる新規ビジネスを提案してください。",
    "銀行が若年層の取り込みのために取り組むべき新規サービスは？",
    "スーパーマーケットがシニア向けに展開すべき新規事業を考えてください。",
    "鉄道会社が交通以外で収益を上げる新規事業を提案してください。",
    "大手通信会社がIoT技術を活用して展開すべき新規事業は？",
    "家電量販店が「体験型店舗」として展開する新サービスを考えてください。",
    "ECサイト運営会社がリアル店舗で展開すべき新たなビジネスモデルを提案してください。",
    "コーヒーチェーンが健康志向の顧客向けに展開する新ブランドを考えてください。",
    "カラオケ店が昼間の空き時間を活用して展開できる新事業を提案してください。",
    "ファストフード店が「子どもの食育」をテーマにした新メニューやサービスを考えてください。",
    "プラットフォーム型IT企業が地方活性化に寄与する新規サービスを提案してください。",
    "不動産会社が高齢者向けに展開すべき新しい住まいサービスは？",
    "飲料メーカーが社会貢献と収益性を両立する新商品を開発するなら？",
    "ドラッグストアが「ヘルスケアプラットフォーム」として展開できる新事業を考えてください。",
    "学生向けSNSを運営する企業が展開すべき新しいキャリア支援事業とは？",
    "ゲーム会社が教育分野で展開できる新サービスを考えてください。",
    "運送会社がラストワンマイルの課題を解決するために始めるべき新規事業は？",
    "大手百貨店がインバウンド需要回復後に始めるべき新ビジネスを提案してください。",
    "オンライン動画プラットフォームが「地域文化の発信」をテーマにした新事業を始めるとしたら？",
    "介護事業者が若年層にも価値を提供する新たなサービスを考えてください。",
    "人材派遣会社が「副業時代」に対応するために始めるべき新規事業とは？",
    "観光地の宿泊施設が収益を多角化するために展開すべき新サービスは？",
    "飲食店が「オンラインコミュニティ」を活用して展開する新規事業を提案してください。",
    "多様性とは何か、そしてそれを社会で実現するにはどうすればよいか。",
    "幸せとは何か。現代人がより幸せになるにはどうすればよいか。",
    "成功とは何か。学生にとっての成功をどう定義すべきか。",
    "自由とは何か。現代社会における自由の在り方について考えてください。",
    "リーダーシップとは何か。良いリーダーに必要な資質とは。",
    "創造性を高めるにはどのような教育が必要か。",
    "人間関係における信頼とは何か。どう築くべきか。",
    "公平性と平等性の違いは何か。どちらを重視すべきか。",
    "時間の使い方と人生の質の関係性について考えてください。",
    "成長とは何か。個人と社会にとっての成長の違いとは。",
    "責任とは何か。社会人にとっての責任のあり方を考えてください。",
    "競争と協調のバランスはどう取るべきか。",
    "変化に強い人間とはどのような特徴を持っているか。",
    "失敗をどう捉えるべきか。失敗の価値について議論してください。",
    "モチベーションを維持するために必要なことは何か。",
    "「働く意味」について現代の若者はどう捉えるべきか。",
    "グローバル化は人々にどんな影響を与えているか。",
    "SNSは人間関係を良くしているか、それとも悪くしているか。",
    "教育の本質とは何か。知識と考える力のどちらを重視すべきか。",
    "人生において「成功」と「幸せ」は両立できるか。",
    "人間がAIと共存するには、どんな意識やルールが必要か。",
    "リスクを取るべきタイミングとはいつか。",
    "社会における「正義」とは何か。",
    "自己肯定感を高めるにはどうすればよいか。",
    "自立とは何か。若者にとっての精神的自立と経済的自立について考えてください。",
    "リスクとチャレンジは同じか。どのように捉え、乗り越えるべきか。",
    "現代社会で「個性」を活かすにはどのような環境が必要か。",
    "働き方の柔軟性は幸福度を高めるか。",
    "「他者理解」とは何か。それを深める方法とは。",
    "「豊かさ」とは何か。経済的、精神的側面の両面から考えてください。",
    "独立系カフェが大手チェーン店との差別化を図り、売上を増加させる方法を考えてください。",
    "地域の農産物直売所が売上を伸ばすための新しい販売チャネルを提案してください。",
    "小規模な美容室が新規顧客を獲得し、売上を向上させるための施策を考えてください。",
    "地元の工芸品店が若年層の顧客を増やすためのマーケティング戦略を提案してください。",
    "コンビニエンスストアの営業時間は24時間であるべきか。",
    "地方都市は観光誘致と企業誘致、どちらを優先すべきか。",
    "就活生が大手企業とベンチャー企業、どちらを選ぶべきか。",
    "飲食チェーンは都市部出店と地方出店、どちらを優先すべきか。",
    "高校が新しく導入する科目に「金融教育」と「AI教育」があるとしたらどちらが良いか。",
    "スーパーが「営業時間延長」か「サービス強化」のどちらに注力すべきか。",
    "中学生にスマートフォンを持たせるべきか否か。",
    "A大学が留学生枠を増やすか、国内学生の支援強化をするか、どちらを選ぶべきか。",
    "地方自治体は「子育て支援」と「高齢者福祉」のどちらに重点を置くべきか。",
    "通勤において「フルリモート」と「週2出社」のどちらが生産性が高いか。",
    "企業が人材採用で「ポテンシャル重視」か「即戦力重視」か、どちらを優先すべきか。",
    "ECサイトが「送料無料」と「ポイント還元」のどちらを実施すべきか。",
    "スポーツブランドがプロチームとの契約か、SNSインフルエンサーとのコラボか、どちらを優先すべきか。",
    "教育機関が「タブレット学習」か「紙教材」か、どちらを中心にすべきか。",
    "スマホアプリの収益モデルで「サブスク」と「広告収入」どちらを採用すべきか。",
    "イベントの集客方法として「街頭広告」か「SNS広告」か、どちらが効果的か。",
    "企業がSDGsに取り組むなら「環境」か「人権」どちらを優先すべきか。",
    "新卒研修で「OJT重視」と「座学重視」どちらが効果的か。",
    "YouTubeチャンネルが「特化型」か「バラエティ型」か、どちらを選ぶべきか。",
    "採用選考で「オンライン面接」か「対面面接」どちらが適切か。",
    "会社がボーナス制度を「成果連動型」か「固定型」どちらにすべきか。",
    "社会人1年目に求めるのは「積極性」か「正確性」か。",
    "大学生が学ぶなら「英語」か「プログラミング」か。",
    "就職活動で重視すべきは「安定性」か「成長性」か。",
    "地域イベントで「若者向け」か「家族向け」どちらを主ターゲットにすべきか。",
    "映画館が導入するなら「4D上映」か「サブスク制度」か。",
    "書店が導入するなら「カフェ併設」か「電子書籍レンタル」か。",
    "テレワークで必要なのは「評価制度の見直し」か「コミュニケーション施策」か。",
    "地方自治体が財源を使うなら「観光PR」か「生活インフラ整備」か。",
    "学校が導入するなら「制服の自由化」か「登校時間の緩和」か。",
  ];
  
  // カテゴリ別にトピックを分類
  export const categorizedTopics = [
    {
      category: "課題解決型",
      topics: topics.slice(0, 30), // 0番目から29番目まで
    },
    {
      category: "売上アップ型",
      topics: topics.slice(30, 60), // 30番目から59番目まで
    },
    {
      category: "新規事業型",
      topics: topics.slice(60, 90), // 60番目から89番目まで
    },
    {
      category: "抽象テーマ型",
      topics: topics.slice(90, 120), // 90番目から119番目まで
    },
    {
      category: "意思決定型",
      topics: topics.slice(120, 150), // 120番目から149番目まで
    },
  ];