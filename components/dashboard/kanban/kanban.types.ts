export type PlanType = "Starter" | "Pro" | "Enterprise";

export type PipelineStage = "leads" | "trial" | "paying" | "churned";

export interface KanbanUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: PlanType;
  monthlyValue: number;
  joinDate: string;
  stage: PipelineStage;
}

export interface Transactions {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  avatar: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  paymentMethod: string;
}

export type TransactionStatus = "successful" | "failed" | "pending" | "refunded";

export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
  key: keyof Transactions;
  direction: SortDirection;
}

export interface KanbanBoardState {
  users: Record<PipelineStage, KanbanUser[]>;
}

export interface DragState {
  draggedUserId: string | null;
  sourceStage: PipelineStage | null;
  overStage: PipelineStage | null;
}
