export type DateRange = "7d" | "30d" | "1y";

export type KanbanColumn = {
  id: string;
  title: string;
  color: string;
  cards: KanbanCard[];
};

export type KanbanCard = {
  id: string;
  name: string;
  email: string;
  value: number;
  avatar: string;
  tag: string;
  daysInStage: number;
};
