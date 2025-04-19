// types/evaluation.ts

export type Evaluation = {
  evaluator: string;
  target: string;
  score: number;
  logic?: number;
  speaking?: number;
  cooperation?: number;
  comment?: string;
  createdAt?: { toDate: () => Date };
  [key: string]: string | number | { toDate: () => Date } | undefined;
};