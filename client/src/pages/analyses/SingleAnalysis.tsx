import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Shield,
  ExternalLink,
  Share,
  Archive,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Calendar,
  CalendarSync,
  RotateCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetSingleAnalyzedNews } from "@/queries/analyzeNewsQueries";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/loading-spinner";
import {
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "@/utils/analysesUtils";
import { formatRelativeTime } from "@/utils/dateTimeUtils";

const SingleAnalysis = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [publish, setPublish] = useState(false);
  const [reAnalyze, setReAnalyze] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isPending, error } = useGetSingleAnalyzedNews(chatId);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  useEffect(() => {
    setPublish(Boolean(data?.data.isPublished));
  }, [data?.data.isPublished]);

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
                <h1 className="text-lg font-semibold">Fact Check Analysis</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                disabled={publish === data.data.isPublished && !reAnalyze}
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Update
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleShare}>
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
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
                          <ExternalLink className="w-4 h-4 mr-2" />
                          <a
                            href={data.data.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:underline"
                          >
                            {new URL(data.data.url).hostname}
                          </a>
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

                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Label
                          htmlFor="publish-check"
                          className="cursor-pointer"
                        >
                          Publish
                        </Label>

                        <Switch
                          id="publish-check"
                          className="cursor-pointer"
                          checked={publish}
                          onCheckedChange={setPublish}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Label
                          htmlFor="re-analyze-check"
                          className="cursor-pointer"
                        >
                          Re-analyze
                        </Label>

                        <Switch
                          id="re-analyze-check"
                          className="cursor-pointer"
                          checked={reAnalyze}
                          onCheckedChange={setReAnalyze}
                        />
                      </div>
                    </div>
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
