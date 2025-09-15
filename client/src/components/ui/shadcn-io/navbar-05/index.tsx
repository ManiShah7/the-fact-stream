import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import {
  BellIcon,
  ChevronDownIcon,
  Globe,
  Settings,
  LogOut,
  type LucideProps,
  CirclePlus,
  Send,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/authQueries";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQueueAnalysisLinksMutation } from "@/queries/queuedAnalysisQueries";
import { QueueAnalysesParams } from "@server/types/queue";
import { AnalysisStatus } from "shared/dist/shared/src/types/analysisStatus";

const HamburgerIcon = ({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn("pointer-events-none", className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

const AddNewsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [urlsToAnalyze, setUrlsToAnalyze] = useState<QueueAnalysesParams[]>([
    { url: "", publish: false },
  ]);

  const { mutate: queueAnalysisLinks } = useQueueAnalysisLinksMutation();

  const handleSubmit = () => {
    const validUrls = urlsToAnalyze.filter((url) => url.url.trim() !== "");
    if (validUrls.length > 0) {
      setUrlsToAnalyze([{ url: "", publish: false }]);
      setIsOpen(false);
      queueAnalysisLinks(validUrls);
    }
  };

  const handleUrlChange = (index: number, value: string) => {
    setUrlsToAnalyze((prevUrls) =>
      prevUrls.map((item, i) => (i === index ? { ...item, url: value } : item))
    );
  };

  const handlePublishChange = (index: number, checked: boolean) => {
    setUrlsToAnalyze((prevUrls) =>
      prevUrls.map((item, i) =>
        i === index ? { ...item, publish: checked } : item
      )
    );
  };

  const addUrlField = () => {
    if (urlsToAnalyze.length < 3) {
      setUrlsToAnalyze((prevUrls) => [
        ...prevUrls,
        { url: "", publish: false },
      ]);
    }
  };

  const removeUrlField = (index: number) => {
    if (urlsToAnalyze.length > 1) {
      const newUrls = urlsToAnalyze.filter((_, i) => i !== index);
      setUrlsToAnalyze(newUrls);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 px-2 py-0 hover:bg-accent hover:text-accent-foreground"
        >
          <CirclePlus />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-100 p-4">
        <div className="space-y-4">
          <div className="text-sm font-medium">Add News Links to Analyze</div>
          <div className="text-xs text-muted-foreground">
            You can queue up to 1-3 news links for AI analysis.
            <div className="mt-1 text-xs text-muted-foreground italic">
              Please note that it may take a few minutes to process each link.
              We will notify you once the analysis is complete.
            </div>
          </div>

          <div className="space-y-3">
            {urlsToAnalyze.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex  gap-2 flex-1 space-y-1">
                  <Input
                    placeholder="https://example.com/news-article"
                    value={url.url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                  />

                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`publish-switch-${index}`}
                      checked={url.publish}
                      onCheckedChange={(checked) =>
                        handlePublishChange(index, checked)
                      }
                    />
                    <Label
                      htmlFor={`publish-switch-${index}`}
                      className="text-sm"
                    >
                      Publish
                    </Label>
                  </div>
                </div>
                {urlsToAnalyze.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeUrlField(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}

            {urlsToAnalyze.length < 3 && (
              <Button
                variant="outline"
                size="sm"
                onClick={addUrlField}
                className="w-full"
              >
                <Plus className="h-3 w-3 mr-2" />
                Add Another Link
              </Button>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            size="sm"
            disabled={urlsToAnalyze.every((url) => url.url.trim() === "")}
          >
            <Send className="w-4 h-4 mr-2" />
            Analyze Links
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type NotificationMenuProps = {
  notificationCount?: number;
  onItemClick?: (item: AnalysisStatus) => void;
  notificationItems?: AnalysisStatus[];
};

// Notification Menu Component
const NotificationMenu = ({
  notificationCount = 3,
  onItemClick,
  notificationItems,
}: NotificationMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <BellIcon className="h-4 w-4" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {notificationCount > 9 ? "9+" : notificationCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notificationCount === 0 || !notificationItems ? (
          <div className="p-4 text-sm text-muted-foreground">
            No new notifications
          </div>
        ) : (
          notificationItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => onItemClick?.(item)}
              className="hover:bg-accent cursor-pointer"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Analysis Complete!</p>
                {/* <p className="text-xs text-muted-foreground">{item.url}</p> */}
                <Link
                  to={`/analyses/${item.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View Article
                </Link>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type UserMenuProps = {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onItemClick?: (item: string) => void;
};

// User Menu Component
const UserMenu = ({
  userName,
  userEmail,
  userAvatar,
  onItemClick,
}: UserMenuProps) => {
  const navigate = useNavigate();

  const { mutate: logout, isPending } = useLogoutMutation();

  const handleLogout = () => {
    onItemClick?.("logout");
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 px-2 py-0 hover:bg-accent hover:text-accent-foreground"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="text-xs">
              {userName
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon className="h-3 w-3 ml-1" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            navigate("/settings");
            onItemClick?.("settings");
          }}
        >
          <Settings /> Settings
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
  );
};

// Types
export interface Navbar05NavItem {
  href?: string;
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

export interface Navbar05Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks: Navbar05NavItem[];
  userName?: string | null;
  userEmail?: string;
  userAvatar?: string;
  notificationCount?: number;
  onNavItemClick?: (href: string) => void;
  onNotificationItemClick?: (item: AnalysisStatus) => void;
  onUserItemClick?: (item: string) => void;
  notificationItems?: AnalysisStatus[];
}

export const Navbar05 = React.forwardRef<HTMLElement, Navbar05Props>(
  (
    {
      className,
      logo = <Globe size={18} />,
      logoHref = "#",
      navigationLinks,
      userName,
      userEmail,
      userAvatar,
      notificationCount = 3,
      onNavItemClick,
      onNotificationItemClick,
      onUserItemClick,
      notificationItems,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLElement>(null);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    return (
      <header
        ref={combinedRef}
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline",
          className
        )}
        {...props}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-1">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-0">
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (onNavItemClick && link.href)
                                onNavItemClick(link.href);
                            }}
                            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                          >
                            {link.label}
                          </button>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Main nav */}
            <div className="flex items-center gap-6">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate(logoHref);
                }}
                className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
              >
                <div className="text-2xl">{logo}</div>
                <span className="hidden font-bold text-xl sm:inline-block">
                  The Fact Stream
                </span>
              </button>
              {/* Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex">
                  <NavigationMenuList className="gap-1">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index}>
                        <NavigationMenuLink
                          href={link.href}
                          onClick={(e) => {
                            e.preventDefault();
                            if (onNavItemClick && link.href)
                              onNavItemClick(link.href);
                          }}
                          className="text-muted-foreground hover:text-primary py-1.5 font-medium transition-colors cursor-pointer group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>

          {userName ? (
            <div className="flex items-center gap-3">
              <NotificationMenu
                notificationCount={notificationCount}
                onItemClick={onNotificationItemClick}
                notificationItems={notificationItems}
              />

              <AddNewsMenu />

              <UserMenu
                userName={userName}
                userEmail={userEmail}
                userAvatar={userAvatar}
                onItemClick={onUserItemClick}
              />
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </header>
    );
  }
);

Navbar05.displayName = "Navbar05";

export { HamburgerIcon, NotificationMenu, UserMenu, AddNewsMenu };
