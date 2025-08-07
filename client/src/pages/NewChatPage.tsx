import { useState, useRef, useEffect } from "react";
import {
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Link2,
  Shield,
  Clock,
  ExternalLink,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

type NewsCheck = {
  id: string;
  url: string;
  timestamp: Date;
  status: "analyzing" | "verified" | "questionable" | "unreliable" | "error";
  result?: {
    title?: string;
    domain: string;
    reliabilityScore: number;
    factors: {
      sourceCredibility: number;
      factualAccuracy: number;
      editorial: number;
      transparency: number;
    };
    warnings?: string[];
    summary?: string;
    publishDate?: string;
    author?: string;
  };
};

const NewChatPage = () => {
  const [checks, setChecks] = useState<NewsCheck[]>([]);
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const checksEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    checksEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [checks]);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (error_) {
      console.error("Invalid URL:", error_);
      return false;
    }
  };

  const handleSubmitUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isAnalyzing) return;

    if (!isValidUrl(url)) {
      alert("Please enter a valid URL");
      return;
    }

    const newCheck: NewsCheck = {
      id: Date.now().toString(),
      url: url.trim(),
      timestamp: new Date(),
      status: "analyzing",
    };

    setChecks((prev) => [...prev, newCheck]);
    setUrl("");
    setIsAnalyzing(true);

    setTimeout(() => {
      const mockResult = {
        title: "Sample News Article Title",
        domain: new URL(url).hostname,
        reliabilityScore: Math.floor(Math.random() * 40) + 60, // 60-100
        factors: {
          sourceCredibility: Math.floor(Math.random() * 30) + 70,
          factualAccuracy: Math.floor(Math.random() * 25) + 75,
          editorial: Math.floor(Math.random() * 35) + 65,
          transparency: Math.floor(Math.random() * 20) + 80,
        },
        warnings:
          Math.random() > 0.7
            ? ["Potential bias detected", "Limited fact-checking available"]
            : [],
        summary:
          "This article discusses recent developments in the topic. Our analysis indicates generally reliable sourcing with standard journalistic practices.",
        publishDate: "2024-07-20",
        author: "John Doe",
      };

      const status =
        mockResult.reliabilityScore >= 80
          ? "verified"
          : mockResult.reliabilityScore >= 60
          ? "questionable"
          : "unreliable";

      setChecks((prev) =>
        prev.map((check) =>
          check.id === newCheck.id
            ? { ...check, status, result: mockResult }
            : check
        )
      );
      setIsAnalyzing(false);
    }, 3000);
  };

  const getStatusIcon = (status: NewsCheck["status"]) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "questionable":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "unreliable":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "analyzing":
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: NewsCheck["status"]) => {
    switch (status) {
      case "verified":
        return "Reliable";
      case "questionable":
        return "Mixed Reliability";
      case "unreliable":
        return "Unreliable";
      case "analyzing":
        return "Analyzing...";
      default:
        return "Error";
    }
  };

  const getStatusColor = (status: NewsCheck["status"]) => {
    switch (status) {
      case "verified":
        return "bg-green-500";
      case "questionable":
        return "bg-yellow-500";
      case "unreliable":
        return "bg-red-500";
      case "analyzing":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-[calc(100%-2rem)] justify-center max-w-3xl mx-auto">
      <ScrollArea className="px-4">
        {checks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full pt-2 pb-6">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">
                  Check News Reliability
                </h2>

                <p className="text-muted-foreground max-w-md mx-auto">
                  Paste a news article URL below to analyze its credibility,
                  fact-check claims, and assess source reliability.
                </p>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  We analyze source credibility, fact-checking records,
                  editorial standards, and transparency to provide reliability
                  scores.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {checks.map((check) => (
              <div key={check.id} className="space-y-3">
                {/* URL Submission */}
                <div className="flex gap-3 justify-end">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-secondary">
                      You
                    </AvatarFallback>
                  </Avatar>
                  <Card className="bg-primary text-primary-foreground max-w-[80%]">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4" />
                        <a
                          href={check.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline hover:no-underline truncate max-w-xs"
                        >
                          {check.url}
                        </a>
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      </div>
                      <span className="text-xs opacity-90">
                        {formatTime(check.timestamp)}
                      </span>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Shield className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-2 max-w-[80%]">
                    {check.status === "analyzing" ? (
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(check.status)}
                              <span className="font-medium">
                                Analyzing article...
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Checking source credibility</span>
                                <span>●●●○○</span>
                              </div>
                              <Progress value={60} className="h-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : check.result ? (
                      <Card className="bg-muted/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              {getStatusIcon(check.status)}
                              Analysis Complete
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(
                                check.status
                              )} text-white border-none`}
                            >
                              {getStatusText(check.status)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="font-medium text-sm">
                              Article Information
                            </h3>
                            <div className="text-sm space-y-1">
                              <p>
                                <strong>Domain:</strong> {check.result.domain}
                              </p>
                              {check.result.title && (
                                <p>
                                  <strong>Title:</strong> {check.result.title}
                                </p>
                              )}
                              {check.result.author && (
                                <p>
                                  <strong>Author:</strong> {check.result.author}
                                </p>
                              )}
                              {check.result.publishDate && (
                                <p>
                                  <strong>Published:</strong>{" "}
                                  {check.result.publishDate}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-sm">
                                Overall Reliability Score
                              </h3>
                              <span className="text-2xl font-bold">
                                {check.result.reliabilityScore}/100
                              </span>
                            </div>
                            <Progress
                              value={check.result.reliabilityScore}
                              className="h-3"
                            />
                          </div>

                          <div className="space-y-3">
                            <h3 className="font-medium text-sm">
                              Detailed Analysis
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Source Credibility</span>
                                  <span>
                                    {check.result.factors.sourceCredibility}/100
                                  </span>
                                </div>
                                <Progress
                                  value={check.result.factors.sourceCredibility}
                                  className="h-2"
                                />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Factual Accuracy</span>
                                  <span>
                                    {check.result.factors.factualAccuracy}/100
                                  </span>
                                </div>
                                <Progress
                                  value={check.result.factors.factualAccuracy}
                                  className="h-2"
                                />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Editorial Standards</span>
                                  <span>
                                    {check.result.factors.editorial}/100
                                  </span>
                                </div>
                                <Progress
                                  value={check.result.factors.editorial}
                                  className="h-2"
                                />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Transparency</span>
                                  <span>
                                    {check.result.factors.transparency}/100
                                  </span>
                                </div>
                                <Progress
                                  value={check.result.factors.transparency}
                                  className="h-2"
                                />
                              </div>
                            </div>
                          </div>

                          {check.result.summary && (
                            <div className="space-y-2">
                              <h3 className="font-medium text-sm">Summary</h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {check.result.summary}
                              </p>
                            </div>
                          )}

                          {check.result.warnings &&
                            check.result.warnings.length > 0 && (
                              <Alert className="border-yellow-200 bg-yellow-50">
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                <AlertDescription className="text-yellow-800">
                                  <strong>Potential Issues:</strong>
                                  <ul className="list-disc list-inside mt-1 space-y-1">
                                    {check.result.warnings.map((warning, i) => (
                                      <li key={i} className="text-sm">
                                        {warning}
                                      </li>
                                    ))}
                                  </ul>
                                </AlertDescription>
                              </Alert>
                            )}
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 text-red-800">
                            <XCircle className="w-5 h-5" />
                            <span className="font-medium">Analysis Failed</span>
                          </div>
                          <p className="text-sm text-red-700 mt-1">
                            Unable to analyze this URL. Please check if the link
                            is valid and accessible.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div ref={checksEndRef} />
          </div>
        )}
      </ScrollArea>

      <div className="p-4 bg-background">
        <form onSubmit={handleSubmitUrl} className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a news article URL here..."
              className="pl-10"
              disabled={isAnalyzing}
              type="url"
            />
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <Button
            type="submit"
            disabled={!url.trim() || isAnalyzing}
            className="shrink-0"
          >
            {isAnalyzing ? (
              <Search className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            Enter a valid news article URL to check its reliability
          </p>

          {isAnalyzing && (
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Analyzing article...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatPage;
