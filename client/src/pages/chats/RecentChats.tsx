import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  MessageSquare,
  Calendar,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MoreVertical,
  Trash2,
  ExternalLink,
  Filter,
  SortDesc,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ChatStatus = "verified" | "questionable" | "unreliable" | "analyzing";

type Chat = {
  id: string;
  title: string;
  url: string;
  domain: string;
  status: ChatStatus;
  reliabilityScore: number;
  createdAt: Date;
  lastChecked: Date;
  messageCount: number;
  isArchived?: boolean;
};

const RecentChats = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<ChatStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "score">("newest");

  const [chats] = useState<Chat[]>([
    {
      id: "1",
      title: "Breaking: Tech Company Announces Major Breakthrough",
      url: "https://reuters.com/technology/breakthrough-2024",
      domain: "reuters.com",
      status: "verified",
      reliabilityScore: 92,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      lastChecked: new Date(Date.now() - 1000 * 60 * 30),
      messageCount: 1,
    },
    {
      id: "2",
      title: "Local News: City Council Meeting Results",
      url: "https://localnews.com/city-council-meeting",
      domain: "localnews.com",
      status: "questionable",
      reliabilityScore: 67,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      lastChecked: new Date(Date.now() - 1000 * 60 * 60 * 2),
      messageCount: 1,
    },
    {
      id: "3",
      title: "Shocking Celebrity News - You Won't Believe What Happened",
      url: "https://tabloidsite.com/celebrity-scandal",
      domain: "tabloidsite.com",
      status: "unreliable",
      reliabilityScore: 23,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      lastChecked: new Date(Date.now() - 1000 * 60 * 60 * 4),
      messageCount: 1,
    },
    {
      id: "4",
      title: "Economic Report: Market Analysis Q3 2024",
      url: "https://bbc.com/business/market-analysis-q3",
      domain: "bbc.com",
      status: "verified",
      reliabilityScore: 89,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      lastChecked: new Date(Date.now() - 1000 * 60 * 60 * 24),
      messageCount: 1,
    },
    {
      id: "5",
      title: "Health Alert: New Study Findings",
      url: "https://medicalnews.com/health-study-2024",
      domain: "medicalnews.com",
      status: "questionable",
      reliabilityScore: 71,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      lastChecked: new Date(Date.now() - 1000 * 60 * 60 * 48),
      messageCount: 1,
      isArchived: true,
    },
  ]);

  const getStatusIcon = (status: ChatStatus) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "questionable":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "unreliable":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "analyzing":
        return <Shield className="w-4 h-4 text-blue-500 animate-pulse" />;
    }
  };

  const getStatusText = (status: ChatStatus) => {
    switch (status) {
      case "verified":
        return "Reliable";
      case "questionable":
        return "Mixed";
      case "unreliable":
        return "Unreliable";
      case "analyzing":
        return "Analyzing";
    }
  };

  const getStatusColor = (status: ChatStatus) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 border-green-200";
      case "questionable":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "unreliable":
        return "bg-red-100 text-red-800 border-red-200";
      case "analyzing":
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredAndSortedChats = chats
    .filter((chat) => {
      const matchesSearch =
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.domain.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || chat.status === filterStatus;
      return matchesSearch && matchesFilter && !chat.isArchived;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "score":
          return b.reliabilityScore - a.reliabilityScore;
        default:
          return 0;
      }
    });

  const statusCounts = {
    all: chats.filter((c) => !c.isArchived).length,
    verified: chats.filter((c) => c.status === "verified" && !c.isArchived)
      .length,
    questionable: chats.filter(
      (c) => c.status === "questionable" && !c.isArchived
    ).length,
    unreliable: chats.filter((c) => c.status === "unreliable" && !c.isArchived)
      .length,
    analyzing: chats.filter((c) => c.status === "analyzing" && !c.isArchived)
      .length,
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-semibold">Your Chat History</h1>
            <p className="text-sm text-muted-foreground">
              {statusCounts.all} total checks • {statusCounts.verified} verified
              • {statusCounts.unreliable} unreliable
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Search by title or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <Filter className="w-4 h-4 mr-2" />
                {filterStatus === "all"
                  ? "All Status"
                  : getStatusText(filterStatus as ChatStatus)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All Status ({statusCounts.all})
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus("verified")}>
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Reliable ({statusCounts.verified})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("questionable")}>
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                Mixed ({statusCounts.questionable})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("unreliable")}>
                <XCircle className="w-4 h-4 mr-2 text-red-500" />
                Unreliable ({statusCounts.unreliable})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <SortDesc className="w-4 h-4 mr-2" />
                {sortBy === "newest"
                  ? "Newest"
                  : sortBy === "oldest"
                  ? "Oldest"
                  : "Score"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("newest")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("score")}>
                Highest Score
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {filteredAndSortedChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {searchQuery || filterStatus !== "all"
                ? "No matching fact checks"
                : "No fact checks yet"}
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Start by checking the reliability of a news article URL."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedChats.map((chat) => (
              <Card
                key={chat.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={getStatusColor(chat.status)}
                        >
                          {getStatusIcon(chat.status)}
                          <span className="ml-1">
                            {getStatusText(chat.status)}
                          </span>
                        </Badge>
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(
                            chat.reliabilityScore
                          )}`}
                        >
                          {chat.reliabilityScore}/100
                        </div>
                      </div>
                      <h3
                        className="font-medium text-base leading-tight truncate"
                        title={chat.title}
                      >
                        {chat.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          <span
                            className="truncate max-w-48"
                            title={chat.domain}
                          >
                            {chat.domain}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatRelativeTime(chat.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-muted text-xs">
                          {chat.messageCount}
                        </AvatarFallback>
                      </Avatar>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Article
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="w-4 h-4 mr-2" />
                            Re-check
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-muted-foreground">
                    <p className="truncate" title={chat.url}>
                      <span className="font-mono">{chat.url}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default RecentChats;
