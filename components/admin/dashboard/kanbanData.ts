import { KanbanColumn } from "./types";

export const kanbanData: KanbanColumn[] = [
  {
    id: "leads",
    title: "Leads",
    color: "#6366f1",
    cards: [
      { id: "k1", name: "Oliver Zhang", email: "oliver@nextstep.io", value: 4800, avatar: "OZ", tag: "Enterprise", daysInStage: 3 },
      { id: "k2", name: "Amara Diallo", email: "amara@loopai.com", value: 1200, avatar: "AD", tag: "Starter", daysInStage: 1 },
      { id: "k3", name: "Ben Foster", email: "ben@gridsys.com", value: 8400, avatar: "BF", tag: "Pro", daysInStage: 5 },
    ],
  },
  {
    id: "trial",
    title: "Trial",
    color: "#f59e0b",
    cards: [
      { id: "k4", name: "Leila Hassan", email: "leila@forma.design", value: 2400, avatar: "LH", tag: "Pro", daysInStage: 7 },
      { id: "k5", name: "Ivan Petrov", email: "ivan@datacraft.ru", value: 9600, avatar: "IP", tag: "Enterprise", daysInStage: 12 },
    ],
  },
  {
    id: "paying",
    title: "Paying",
    color: "#10b981",
    cards: [
      { id: "k6", name: "Sophia Carter", email: "sophia@acmecorp.io", value: 14800, avatar: "SC", tag: "Enterprise", daysInStage: 45 },
      { id: "k7", name: "Marcus Webb", email: "m.webb@techflow.com", value: 5880, avatar: "MW", tag: "Pro", daysInStage: 62 },
      { id: "k8", name: "Priya Nair", email: "priya.n@startup.dev", value: 2880, avatar: "PN", tag: "Starter", daysInStage: 28 },
    ],
  },
  {
    id: "churned",
    title: "Churned",
    color: "#f43f5e",
    cards: [
      { id: "k9", name: "Jordan Lee", email: "jordan@labs.co", value: 588, avatar: "JL", tag: "Starter", daysInStage: 90 },
    ],
  },
];
