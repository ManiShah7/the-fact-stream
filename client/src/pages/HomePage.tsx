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
    <div className="h-svh">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            The Fact Stream
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trusted source for verified news analysis and reliable
            journalism
          </p>
        </header>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-4">
                AI-Powered News Analysis
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Get comprehensive analysis of news articles with source
                credibility assessment, fact-checking verification, and
                reliability scores powered by advanced AI.
              </p>

              <div className="flex justify-center items-center gap-4 mb-8">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  AI-Powered Analysis
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Community Verified
                </Badge>
              </div>

              {auth?.authState.user ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Use the <span className="font-medium">+ button</span> in the
                    navigation bar above to add news links for analysis
                  </p>
                  <Link to="/published-news">
                    <Button variant="outline" className="group">
                      Browse Published Analysis
                      <Newspaper className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-4 justify-center">
                    <Link to="/login">
                      <Button variant="outline">Login</Button>
                    </Link>
                    <Link to="/signup">
                      <Button>
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Shield className="w-20 h-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
