import { Link, useNavigate } from "react-router";
import {
  Home,
  ArrowLeft,
  Search,
  Shield,
  MessageSquare,
  Newspaper,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      label: "New Fact Check",
      href: "/",
      icon: Shield,
      description: "Check the reliability of a news article",
    },
    {
      label: "Recent Checks",
      href: "/chats",
      icon: MessageSquare,
      description: "View your fact-checking history",
    },
    {
      label: "Published News",
      href: "/published-news",
      icon: Newspaper,
      description: "Browse verified news articles",
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Manage your account preferences",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="text-8xl font-bold text-primary/20 select-none">
            404
          </div>
          <div className="text-6xl">🔍</div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Looks like this page got lost in the fact-checking process. Let's
            get you back to verifying news!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button asChild className="gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Home
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Search className="w-4 h-4" />
            <span>Or try one of these popular pages:</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Card
                key={link.href}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <Link
                    to={link.href}
                    className="block space-y-2 text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <link.icon className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors" />
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {link.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground border-t pt-6">
          <p>
            If you believe this is an error, please check the URL or{" "}
            <Link to="/settings" className="text-primary hover:underline">
              contact support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
