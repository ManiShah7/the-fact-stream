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
import { useGetAnalyzedNews } from "@/queries/analyzeNewsQueries";

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

export function AppSidebar() {
  const auth = useAuth();

  const { mutate: logout, isPending } = useLogoutMutation();
  const { data: analyzedNews, isLoading } = useGetAnalyzedNews();

  console.log(analyzedNews);

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
            <h1 className="px-2 text-xs font-semibold mb-2">My Analyses</h1>

            <SidebarMenu>
              {analyzedNews?.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <span>{item.modelResponse.title}</span>
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
