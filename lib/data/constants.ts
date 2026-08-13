import {
  BarChart3,
  LayoutDashboard,
  Receipt,
  RefreshCw,
  Sparkles,
  Target,
  Users,
  Wallet,
} from "lucide-react";

export const NAV_GROUPS = [
    {
        label: "Overview",
        items: [
            { title: "Dashboard", href: "/home", icon:  LayoutDashboard, soon: false },
        ],
    },
    {
        label: "Money",
        items: [
            { title: "Transactions", href: "/transactions", icon: Receipt, soon: false },
            { title: "Accounts", href: "/accounts", icon: Wallet, soon: false },
            { title: "Recurring", href:"/recurring", icon: RefreshCw, soon: false },
        ],
    },
    {
        label: "Planning",
        items: [
            { title: "Budgets", href: "/budgets", icon: Target, soon: false },
            { title: "Reports", href: "/reports", icon: BarChart3, soon: false },
        ],
    },
    {
        label: "Together",
        items: [
            { title: "Splits", href: "/splits", icon: Users, soon: false },
        ],
    },
    {
        label: "Insights",
        items: [
            { title: "AI Insights", href: "/ai-insights", icon: Sparkles, soon: true },
        ],
    },
] as const;