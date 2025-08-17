import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Shield,
  ExternalLink,
  Globe,
  Share,
  Archive,
  MoreVertical,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Calendar,
  CalendarSync,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetSingleAnalyzedNews } from "@/queries/analyzeNewsQueries";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/loading-spinner";

const SingleAnalysis = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isPending, error } = useGetSingleAnalyzedNews(chatId);

  const getStatusIcon = (credibilityScore: number) => {
    if (credibilityScore >= 80) {
      return <Shield className="w-5 h-5 text-green-600" />;
    } else if (credibilityScore >= 50) {
      return <Shield className="w-5 h-5 text-yellow-600" />;
    } else {
      return <Shield className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (credibilityScore: number) => {
    if (credibilityScore >= 80) {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (credibilityScore >= 50) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    } else {
      return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getStatusText = (credibilityScore: number) => {
    if (credibilityScore >= 80) {
      return "High";
    } else if (credibilityScore >= 50) {
      return "Medium";
    } else {
      return "Low";
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
      {isPending ? (
        <LoadingSpinner />
      ) : data ? (
        <>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                {getStatusIcon(
                  Number(data.data.modelResponse.credibilityScore)
                )}
                <h1 className="text-xl font-semibold">Fact Check Analysis</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={getStatusColor(
                  Number(data.data.modelResponse.credibilityScore)
                )}
              >
                {getStatusText(
                  Number(data.data.modelResponse.credibilityScore)
                )}
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
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Analysis Complete
                    </CardTitle>

                    <div>
                      <span className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
                        <Calendar size={18} />
                        Initially checked on{" "}
                        {formatRelativeTime(new Date(data.data.createdAt))}
                      </span>

                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarSync size={18} />
                        Last checked{" "}
                        {formatRelativeTime(
                          data.data.updatedAt
                            ? new Date(data.data.updatedAt)
                            : new Date(data.data.createdAt)
                        )}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">
                        {data.data.modelResponse.title}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {new URL(data.data.url).hostname}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {data.data.modelResponse.credibilityScore}/100
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Credibility Score
                        </p>
                      </div>
                      <Progress
                        value={Number(data.data.modelResponse.credibilityScore)}
                        className="h-3"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Unreliable</span>
                        <span>Highly Reliable</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Summary</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {data.data.modelResponse.summary}
                    </p>
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
                        href={data.data.url}
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
        </>
      ) : (
        <div className="p-4 text-center">
          {error.message ? (
            <p className="text-red-600">{error.message}</p>
          ) : (
            <p>No analysis available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleAnalysis;
