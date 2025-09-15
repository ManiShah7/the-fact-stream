import { Outlet, useNavigate } from "react-router";
import { MessagesSquare, Rss } from "lucide-react";
import {
  Navbar05,
  type Navbar05NavItem,
} from "@/components/ui/shadcn-io/navbar-05";
import { useAuth } from "@/hooks/useAuth";
import useWebSocket from "react-use-websocket";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAnalysisStatuses } from "@/queries/analysisStatusesQueries";

const NavWrapper = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isPending } = useGetAnalysisStatuses();

  const items: Navbar05NavItem[] = [
    {
      label: "My Analyses",
      href: "/analyses",
      icon: MessagesSquare,
    },
    {
      label: "Published News",
      href: "/published-news",
      icon: Rss,
    },
  ];

  const { lastMessage } = useWebSocket(
    auth?.authState.user
      ? `${import.meta.env.VITE_SERVER_URL}/api/v1/ws/${
          auth.authState.user.id
        }/updates`
      : null,
    {
      onMessage: () => {
        queryClient.invalidateQueries({ queryKey: ["analysisStatuses"] });
      },
      shouldReconnect: () => true,
    }
  );

  return (
    <>
      <Navbar05
        userEmail={auth?.authState.user?.email}
        userName={
          auth?.authState.user
            ? `${auth.authState.user.firstName} ${auth.authState.user.lastName}`
            : null
        }
        navigationLinks={items}
        logoHref="/"
        onNavItemClick={(href) => {
          navigate(href);
        }}
        notificationCount={
          data ? data.data.filter((item) => !item.isRead).length : 0
        }
        notificationItems={data ? data.data : []}
      />

      <Outlet />
    </>
  );
};

export default NavWrapper;
