import useWebSocket from "react-use-websocket";
import { Link } from "react-router";
import { Shield, Newspaper, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/logo";
import { useAuth } from "@/hooks/useAuth";

const HomePage = () => {
  const auth = useAuth();

  const socketUrl = "ws://localhost:9000/api/v1/ws";
  const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    onMessage: (event) => {
      const data = event.data;

      if (data === "ping") {
        console.log("Received ping from server, sending pong");
        sendMessage("pong");
        return;
      }

      if (data === "pong") {
        console.log("Received pong from server");
        return;
      }
    },
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: () => true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            The Fact Stream
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your trusted source for verified news analysis and reliable
            journalism
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center">
                  <Newspaper className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Published News</h2>
                  <p className="text-muted-foreground">
                    Verified & Analyzed Articles
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Discover news articles that have been thoroughly analyzed and
                verified by our community. Each article includes reliability
                scores, fact-checking, and source credibility assessment.
              </p>

              <Link to="/published-news">
                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  Browse Published News
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Newspaper className="w-16 h-16" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Analyze News</h2>
                  <p className="text-muted-foreground">
                    Check Article Reliability
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Paste any news article URL to get comprehensive analysis
                including source credibility, fact-checking records, editorial
                standards, and reliability scores.
              </p>

              <div className="flex items-center gap-4 mb-6">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  AI-Powered
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  <Users className="w-3 h-3 mr-1" />
                  Community Driven
                </Badge>
              </div>

              <Link to={auth?.user ? "/new" : "/login"}>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-accent transition-colors"
                >
                  {auth?.user ? "Start Analysis" : "Login to Analyze News"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield className="w-16 h-16" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
