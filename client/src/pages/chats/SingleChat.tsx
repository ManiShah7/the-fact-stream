import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  ExternalLink,
  Calendar,
  User,
  Globe,
  Share,
  Archive,
  MoreVertical,
  RefreshCw,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Flag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ChatStatus = "verified" | "questionable" | "unreliable" | "analyzing";

type ChatData = {
  id: string;
  url: string;
  title: string;
  domain: string;
  status: ChatStatus;
  createdAt: Date;
  lastChecked: Date;
  result: {
    title: string;
    domain: string;
    reliabilityScore: number;
    factors: {
      sourceCredibility: number;
      factualAccuracy: number;
      editorial: number;
      transparency: number;
    };
    warnings: string[];
    summary: string;
    publishDate: string;
    author: string;
    category: string;
    readTime: number;
    keyPoints: string[];
    similarArticles: Array<{
      title: string;
      domain: string;
      url: string;
      reliabilityScore: number;
    }>;
  };
};

const SingleChat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [chatData] = useState<ChatData>({
    id: chatId || "1",
    url: "https://reuters.com/technology/breakthrough-2024",
    title: "Breaking: Tech Company Announces Major Breakthrough",
    domain: "reuters.com",
    status: "verified",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    lastChecked: new Date(Date.now() - 1000 * 60 * 30),
    result: {
      title:
        "Revolutionary Battery Technology Promises Months of Energy Storage",
      domain: "reuters.com",
      reliabilityScore: 94,
      factors: {
        sourceCredibility: 96,
        factualAccuracy: 92,
        editorial: 94,
        transparency: 94,
      },
      warnings: [],
      summary:
        "This article reports on a significant technological advancement in energy storage. The reporting follows standard journalistic practices with multiple expert sources cited. The claims are backed by peer-reviewed research and the company's official statements have been verified.",
      publishDate: "2024-07-23",
      author: "Sarah Johnson",
      category: "Technology",
      readTime: 8,
      keyPoints: [
        "New battery technology can store energy for up to 6 months",
        "Technology uses advanced lithium-metal composition",
        "Could revolutionize renewable energy adoption",
        "Company plans commercial deployment by 2025",
        "Independent testing confirms performance claims",
      ],
      similarArticles: [
        {
          title: "Energy Storage Breakthrough Could Transform Grid",
          domain: "bbc.com",
          url: "https://bbc.com/news/energy-storage-2024",
          reliabilityScore: 89,
        },
        {
          title: "Battery Innovation Raises Renewable Energy Hopes",
          domain: "apnews.com",
          url: "https://apnews.com/battery-innovation-2024",
          reliabilityScore: 91,
        },
      ],
    },
  });

  const getStatusIcon = (status: ChatStatus) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "questionable":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "unreliable":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "analyzing":
        return <Shield className="w-5 h-5 text-blue-500 animate-pulse" />;
    }
  };

  const getStatusText = (status: ChatStatus) => {
    switch (status) {
      case "verified":
        return "Reliable Source";
      case "questionable":
        return "Mixed Reliability";
      case "unreliable":
        return "Unreliable Source";
      case "analyzing":
        return "Analyzing...";
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

  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsReanalyzing(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            {getStatusIcon(chatData.status)}
            <h1 className="text-xl font-semibold">Fact Check Analysis</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getStatusColor(chatData.status)}>
            {getStatusText(chatData.status)}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleReanalyze}
                disabled={isReanalyzing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    isReanalyzing ? "animate-spin" : ""
                  }`}
                />
                Re-analyze
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share className="w-4 h-4 mr-2" />
                Share Analysis
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Flag className="w-4 h-4 mr-2" />
                Report Issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-secondary">
                      You
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    You submitted for analysis
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(chatData.createdAt)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                <ExternalLink className="w-4 h-4 text-primary" />
                <a
                  href={chatData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm font-mono flex-1 truncate"
                >
                  {chatData.url}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Analysis Complete
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  Last checked {formatRelativeTime(chatData.lastChecked)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">
                    {chatData.result.title}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {chatData.result.domain}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{chatData.result.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{chatData.result.publishDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span>{chatData.result.readTime} min read</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {chatData.result.reliabilityScore}/100
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reliability Score
                    </p>
                  </div>
                  <Progress
                    value={chatData.result.reliabilityScore}
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Unreliable</span>
                    <span>Highly Reliable</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Detailed Analysis</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(chatData.result.factors).map(
                    ([factor, score]) => (
                      <div key={factor} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">
                            {factor.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="font-medium">{score}/100</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Analysis Summary</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {chatData.result.summary}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Key Points</h4>
                <ul className="space-y-2">
                  {chatData.result.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {chatData.result.warnings.length > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Potential Issues:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {chatData.result.warnings.map((warning, i) => (
                        <li key={i} className="text-sm">
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <h4 className="font-medium">Similar Verified Articles</h4>
                <div className="space-y-2">
                  {chatData.result.similarArticles.map((article, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium hover:text-primary truncate block"
                        >
                          {article.title}
                        </a>
                        <p className="text-xs text-muted-foreground">
                          {article.domain}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <Badge variant="outline" className="text-xs">
                          {article.reliabilityScore}/100
                        </Badge>
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Helpful
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Not Helpful
                  </Button>
                </div>

                <Button asChild>
                  <a
                    href={chatData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read Original
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SingleChat;
