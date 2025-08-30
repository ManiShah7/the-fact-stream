import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Newspaper,
  Calendar,
  ExternalLink,
  SortDesc,
  BookOpen,
  Clock,
  Eye,
  Share,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router";
import { useGetPaginatedPublishedNews } from "@/queries/analyzeNewsQueries";

type PublishedArticle = {
  id: string;
  title: string;
  description: string;
  url: string;
  domain: string;
  author: string;
  publishedAt: Date;
  verifiedAt: Date;
  reliabilityScore: number;
  imageUrl?: string;
  readTime: number;
  views: number;
  shares: number;
};

const PublishedNewsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Query
  const { data, isPending } = useGetPaginatedPublishedNews({
    page: 1,
    pageSize: 10,
  });

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-semibold">Published News</h1>
            <p className="text-sm text-muted-foreground">
              {data?.length} verified articles
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Search articles, authors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <SortDesc className="w-4 h-4 mr-2" />
                {sortBy === "newest"
                  ? "Latest"
                  : sortBy === "oldest"
                  ? "Oldest"
                  : "Popular"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("newest")}>
                <Clock className="w-4 h-4 mr-2" />
                Latest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                <Calendar className="w-4 h-4 mr-2" />
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((article) => (
            <Card
              key={article.id}
              className="hover:shadow-lg transition-shadow group pb-3 pt-0"
            >
              {/* {article.imageUrl && (
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 object-cover duration-300"
                    />
                  </div>
                )} */}

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Verified Reliable
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        Score:
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {article.modelResponse.credibilityScore}/100
                      </span>
                    </div>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{
                        width: `${article.modelResponse.credibilityScore}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                    {article.modelResponse.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {article.modelResponse.summary}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  {/* <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${article.author}`}
                      />
                      <AvatarFallback className="text-xs">
                        {article.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar> */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {/* {article.author} */}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {/* <span>{article.domain}</span> */}
                      <span>•</span>
                      {/* <span>{formatRelativeTime(article.publishedAt)}</span> */}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  {/* <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{article.readTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{formatNumber(article.views)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share className="w-3 h-3" />
                        <span>{formatNumber(article.shares)}</span>
                      </div>
                    </div> */}

                  <Link
                    to={article.url}
                    target="_blank"
                    className="inline-flex items-center justify-center h-8 px-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Read
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PublishedNewsPage;
