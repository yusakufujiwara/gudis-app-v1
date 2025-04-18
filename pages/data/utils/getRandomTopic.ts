import { topics, categorizedTopics } from "../../data/topics";

// ランダムに1つ議題を返す関数
export function getRandomTopic(category?: string): string {
  if (category) {
    // 指定されたカテゴリのトピックを取得
    const categoryData = categorizedTopics.find((cat) => cat.category === category);
    if (categoryData) {
      const list = categoryData.topics;
      return list[Math.floor(Math.random() * list.length)];
    }
  }

  // カテゴリ未指定なら全体からランダム
  return topics[Math.floor(Math.random() * topics.length)];
}

// カテゴリ一覧を返す（ドロップダウン用）
export function getAllCategories(): string[] {
  return categorizedTopics.map((cat) => cat.category);
}