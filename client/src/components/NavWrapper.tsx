import { Outlet, useNavigate } from "react-router";
import {
  Navbar05,
  type Navbar05NavItem,
} from "@/components/ui/shadcn-io/navbar-05";
import { useAuth } from "@/hooks/useAuth";
import { MessagesSquare, Rss } from "lucide-react";

const NavWrapper = () => {
  const auth = useAuth();
  const navigate = useNavigate();

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
      />

      <Outlet />
    </>
  );
};

export default NavWrapper;
