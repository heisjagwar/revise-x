export type Category = 'DSA' | 'System Design' | 'OOPs';

export const CATEGORIES: Category[] = ['DSA', 'System Design', 'OOPs'];
export const REVISION_DAYS = [2, 5, 12, 25, 40, 60];

export type Revision = {
  day: number;
  completed: boolean;
  dueDate: string; // ISO string for serialization
};

export type Topic = {
  id: string;
  name: string;
  category: Category;
  createdAt: string; // ISO string for serialization
  revisions: Revision[];
};
