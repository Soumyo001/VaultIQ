'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { NAV_GROUPS } from "@/lib/data/constants";
import { 
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "./ui/sidebar";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "./ui/dropdown-menu";
import { 
  ChevronDown,
  LogOut,
  PieChart,
  Settings,
  SplitSquareHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

const AppSidebar = () => {
  const pathName = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const initials = (user?.username?.[0] ?? "U").toUpperCase();
  const userName = user?.username ?? "User";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex items-center gap-2 py-1 px-2">
          <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md bg-blue-100 dark:bg-blue-950">
            <PieChart className="w-4 h-4 text-blue-600 dark:text-blue-400"/>
          </div>
          <span className="text-sm text-slate-400 font-medium">
            BudgetFlow
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {NAV_GROUPS.map(group => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => {
                  const isSoon = item.soon;
                  const Icon = item.icon;
                  const isActive = !isSoon && (pathName === item.href 
                                || pathName.startsWith(item.href + "/"));
                  if(isSoon) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          className="cursor-not-allowed opacity-50 rounded-sm"
                          tabIndex={-1}
                          aria-disabled
                        >
                          <Icon className="w-4 h-4"/>
                          <span>{item.title}</span>
                          <span className="ml-auto px-1.5 py-0.5 bg-muted rounded-full text-[10px] text-muted-foreground">
                            soon
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  }
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href} className="rounded-sm">
                          <Icon className="w-4 h-4"/>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathName === "/settings"}>
              <Link href={"/settings"} className="rounded-sm">
                <Settings className="w-4 h-4"/>
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto py-2 cursor-pointer rounded-sm">
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 shrink-0",
                    "bg-blue-100 dark:bg-blue-950 rounded-full",
                    "text-xs text-blue-600 dark:text-blue-400 font-medium"
                  )}>
                    {initials}
                  </div>
                  <div className="flex flex-col text-left flex-1 min-w-0">
                    <div className="truncate text-xs font-medium">
                      {userName}
                    </div>
                    <div className="truncate text-[10px] text-muted-foreground">
                      {email}
                    </div>
                  </div>
                  <ChevronDown className="ml-auto w-3 h-3 text-muted-foreground shrink-0"/>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="right" className="rounded-md">
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2"/>
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => signOut({redirectUrl: "/sign-in"})}
                >
                  <LogOut className="mr-2 w-4 h-4"/>
                  SignOut
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar;