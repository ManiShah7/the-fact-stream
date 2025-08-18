import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MessageSquare,
  Calendar,
  Shield,
  MoreVertical,
  Trash2,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetAnalyzedNews } from "@/queries/analyzeNewsQueries";
import LoadingSpinner from "@/components/loading-spinner";
import {
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "@/utils/analysesUtils";
import { Link } from "react-router";

const AllAnalyses = () => {
  const { data: analyzedNews, isLoading, isError } = useGetAnalyzedNews();

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

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto">
      {isLoading ? (
        <LoadingSpinner />
      ) : analyzedNews ? (
        <>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">Your Analyses</h1>
                <p className="text-sm text-muted-foreground">
                  {analyzedNews.length} total analyses
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search by title or domain..."
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {analyzedNews.length > 0 ? (
                analyzedNews.map((chat) => (
                  <Card
                    key={chat.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={getStatusColor(
                                Number(chat.modelResponse.credibilityScore)
                              )}
                            >
                              {getStatusIcon(
                                Number(chat.modelResponse.credibilityScore)
                              )}
                              <span className="ml-1">
                                {getStatusText(
                                  Number(chat.modelResponse.credibilityScore)
                                )}
                              </span>
                            </Badge>

                            <div className="px-2 py-1 rounded text-sm font-medium">
                              {chat.modelResponse.credibilityScore}/100
                            </div>
                          </div>

                          <h3
                            className="font-semibold text-lg leading-tight"
                            title={chat.modelResponse.title}
                          >
                            <Link to={`/analyses/${chat.id}`}>
                              {chat.modelResponse.title}
                            </Link>
                          </h3>

                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <a
                                href={chat.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate max-w-48"
                              >
                                {new URL(chat.url).hostname}
                              </a>
                              <ExternalLink className="w-3 h-3" />
                            </div>

                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {formatRelativeTime(new Date(chat.createdAt))}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
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
                                <Link
                                  to={`/analyses/${chat.id}`}
                                  className="truncate"
                                >
                                  View Article
                                </Link>
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
                      <p className="line-clamp-2 text-sm">{chat.articleText}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No analyses found.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </>
      ) : isError ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-destructive">Failed to load analyses.</p>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default AllAnalyses;
