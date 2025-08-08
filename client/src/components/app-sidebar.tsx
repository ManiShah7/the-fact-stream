import {
  ChevronUp,
  CirclePlus,
  Globe,
  LogOut,
  MessagesSquare,
  Rss,
  Settings,
  User2,
} from "lucide-react";
import { Link } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/queries/authQueries";
import { useAuth } from "@/hooks/useAuth";

const items = [
  {
    title: "New Chat",
    url: "/new",
    icon: CirclePlus,
  },
  {
    title: "Chats",
    url: "/chats",
    icon: MessagesSquare,
  },
  {
    title: "Published News",
    url: "/published-news",
    icon: Rss,
  },
];

const myChats = [
  {
    title: "Chat 1",
    url: "chats/chat-1",
  },
  {
    title: "Chat 2",
    url: "chats/chat-2",
  },
  {
    title: "Chat 3",
    url: "chats/chat-3",
  },
];

export function AppSidebar() {
  const auth = useAuth();

  const { mutate: logout, isPending } = useLogoutMutation();

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroupLabel className="flex items-center mb-5">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            The Fact Stream <Globe size={20} />
          </Link>
        </SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="mb-5">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mb-5">
          <SidebarGroupContent>
            <h1 className="px-2 text-xs font-semibold mb-2">My Chats</h1>
            <SidebarMenu>
              {myChats.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center gap-2 cursor-pointer">
                  <User2 /> {auth?.user?.email || "User"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Settings /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isPending}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
