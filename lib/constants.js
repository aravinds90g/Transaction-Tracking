import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";

export const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Others",
];

export const CATEGORY_META = {
  Food: {
    label: "Food",
    color: "#fb923c",
    bg: "rgba(251, 146, 60, 0.12)",
    icon: UtensilsCrossed,
  },
  Transport: {
    label: "Transport",
    color: "#60a5fa",
    bg: "rgba(96, 165, 250, 0.12)",
    icon: Car,
  },
  Shopping: {
    label: "Shopping",
    color: "#c084fc",
    bg: "rgba(192, 132, 252, 0.12)",
    icon: ShoppingBag,
  },
  Bills: {
    label: "Bills",
    color: "#94a3b8",
    bg: "rgba(148, 163, 184, 0.12)",
    icon: Receipt,
  },
  Entertainment: {
    label: "Entertainment",
    color: "#f472b6",
    bg: "rgba(244, 114, 182, 0.12)",
    icon: Film,
  },
  Others: {
    label: "Others",
    color: "#2dd4bf",
    bg: "rgba(45, 212, 191, 0.12)",
    icon: MoreHorizontal,
  },
};

export const SUMMARY_ICONS = {
  balance: Wallet,
  income: TrendingUp,
  expense: TrendingDown,
};
