import { KanbanUser, PipelineStage, Transactions, TransactionStatus, PlanType } from "./kanban.types";

// ─── Dummy Data Generators ───────────────────────────────────────────────────

const firstNames = [
  "Emma", "Liam", "Sophie", "Noah", "Olivia", "James", "Ava", "Oliver",
  "Isabella", "Elijah", "Mia", "Lucas", "Charlotte", "Mason", "Amelia",
  "Logan", "Harper", "Alexander", "Evelyn", "Benjamin", "Luna", "Daniel",
  "Chloe", "Matthew", "Penelope", "Henry", "Layla", "Jackson", "Riley",
  "Sebastian", "Zoey", "Aiden", "Nora", "Owen", "Lily", "Samuel", "Ella",
  "Ryan", "Hannah", "John", "Aria", "Nathan", "Sofia", "Caleb", "Camila",
];

const lastNames = [
  "Mueller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner",
  "Becker", "Schulz", "Hoffmann", "Koch", "Richter", "Klein", "Wolf",
  "Schaefer", "Bauer", "Neumann", "Schwarz", "Zimmermann", "Braun",
  "Krueger", "Hofmann", "Hartmann", "Lange", "Schmitt", "Werner",
  "Schmitz", "Krause", "Meier", "Lehmann",
];

const domains = ["gmail.com", "outlook.com", "yahoo.com", "proton.me", "icloud.com", "company.de", "techcorp.eu"];

const paymentMethods = ["Visa", "Mastercard", "PayPal", "Stripe", "Bank Transfer", "Apple Pay"];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateAvatarUrl(name: string): string {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true&size=128`;
}

function randomDate(daysBack: number, seed: number): string {
  const random = seededRandom(seed);
  const now = new Date();
  const pastDate = new Date(now.getTime() - random() * daysBack * 24 * 60 * 60 * 1000);
  return pastDate.toISOString().split("T")[0];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-EU", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Kanban Users ─────────────────────────────────────────────────────────────

const planValues: Record<PlanType, number[]> = {
  Starter: [29, 39, 49],
  Pro: [79, 99, 129],
  Enterprise: [199, 249, 299],
};

const stagePlans: Record<PipelineStage, PlanType[]> = {
  leads: ["Starter", "Starter", "Pro"],
  trial: ["Starter", "Pro", "Pro"],
  paying: ["Pro", "Enterprise", "Enterprise"],
  churned: ["Starter", "Pro", "Enterprise"],
};

export function generateKanbanUsers(): KanbanUser[] {
  const users: KanbanUser[] = [];
  const stages: PipelineStage[] = ["leads", "trial", "paying", "churned"];
  const counts: Record<PipelineStage, number> = { leads: 7, trial: 6, paying: 8, churned: 5 };
  let idCounter = 0;

  for (const stage of stages) {
    const count = counts[stage];
    const availablePlans = stagePlans[stage];

    for (let i = 0; i < count; i++) {
      const random = seededRandom(idCounter * 13 + stage.length);
      const firstName = firstNames[Math.floor(random() * firstNames.length)];
      const lastName = lastNames[Math.floor(random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      const domain = domains[Math.floor(random() * domains.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
      const plan = availablePlans[Math.floor(random() * availablePlans.length)];
      const monthlyValue = planValues[plan][Math.floor(random() * planValues[plan].length)];
      const joinDate = randomDate(90, idCounter * 7 + 3);

      users.push({
        id: `user-${stage}-${idCounter}`,
        name,
        email,
        avatar: generateAvatarUrl(name),
        plan,
        monthlyValue,
        joinDate: formatDate(joinDate),
        stage,
      });

      idCounter++;
    }
  }

  return users;
}

// ─── Transactions ─────────────────────────────────────────────────────────────

const statuses: TransactionStatus[] = ["successful", "failed", "pending", "refunded"];
const statusWeights = [0.55, 0.15, 0.18, 0.12]; // probability distribution

function weightedRandomStatus(seed: number): TransactionStatus {
  const random = seededRandom(seed * 31 + 17);
  const r = random();
  let cumulative = 0;
  for (let i = 0; i < statuses.length; i++) {
    cumulative += statusWeights[i];
    if (r <= cumulative) return statuses[i];
  }
  return statuses[0];
}

export function generateTransactions(): Transactions[] {
  const transactions: Transactions[] = [];
  const count = 35;

  for (let i = 0; i < count; i++) {
    const random = seededRandom(i * 23 + 5);
    const firstName = firstNames[Math.floor(random() * firstNames.length)];
    const lastName = lastNames[Math.floor(random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const domain = domains[Math.floor(random() * domains.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
    const amount = Math.round((29 + random() * 270) * 100) / 100;
    const status = weightedRandomStatus(i);
    const date = randomDate(90, i * 11 + 2);
    const paymentMethod = paymentMethods[Math.floor(random() * paymentMethods.length)];

    transactions.push({
      id: `txn-${i.toString().padStart(4, "0")}`,
      userId: `user-txn-${i}`,
      userName: name,
      userEmail: email,
      avatar: generateAvatarUrl(name),
      amount,
      status,
      date: formatDate(date),
      paymentMethod,
    });
  }

  return transactions;
}

// ─── Drag & Drop Utilities ───────────────────────────────────────────────────

export function moveUser(
  users: Record<PipelineStage, KanbanUser[]>,
  userId: string,
  fromStage: PipelineStage,
  toStage: PipelineStage
): Record<PipelineStage, KanbanUser[]> {
  if (fromStage === toStage) return users;

  const sourceUsers = [...users[fromStage]];
  const userIndex = sourceUsers.findIndex((u) => u.id === userId);
  if (userIndex === -1) return users;

  const [movedUser] = sourceUsers.splice(userIndex, 1);
  const updatedUser = { ...movedUser, stage: toStage };

  const destUsers = [...users[toStage], updatedUser];

  return {
    ...users,
    [fromStage]: sourceUsers,
    [toStage]: destUsers,
  };
}

export const STAGE_CONFIG: Record<PipelineStage, { label: string; color: string; bgColor: string; borderColor: string }> = {
  leads: {
    label: "Leads",
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  trial: {
    label: "Trial Users",
    color: "text-amber-700 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  paying: {
    label: "Paying Customers",
    color: "text-emerald-700 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  churned: {
    label: "Churned",
    color: "text-rose-700 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "border-rose-200 dark:border-rose-800",
  },
};

export const COLUMNS: PipelineStage[] = ["leads", "trial", "paying", "churned"];
