import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router";

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

  // Mock data
  const [articles] = useState<PublishedArticle[]>([
    {
      id: "1",
      title: "Major Technological Breakthrough in Renewable Energy Storage",
      description:
        "Scientists have developed a revolutionary battery technology that could store renewable energy for months, potentially solving one of the biggest challenges in clean energy adoption.",
      url: "https://reuters.com/technology/energy-breakthrough-2024",
      domain: "reuters.com",
      author: "Sarah Johnson",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
      reliabilityScore: 94,
      imageUrl:
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=200&fit=crop",
      readTime: 8,
      views: 15420,
      shares: 2341,
    },
    {
      id: "2",
      title: "Global Climate Summit Reaches Historic Agreement",
      description:
        "World leaders have agreed on unprecedented climate action measures, including binding emissions targets and a $500 billion green technology fund.",
      url: "https://bbc.com/news/climate-summit-agreement",
      domain: "bbc.com",
      author: "Michael Chen",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      reliabilityScore: 91,
      imageUrl:
        "https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=400&h=200&fit=crop",
      readTime: 12,
      views: 28750,
      shares: 4521,
    },
    {
      id: "3",
      title: "Healthcare Innovation: New Treatment Shows 90% Success Rate",
      description:
        "Clinical trials for a new gene therapy treatment have shown remarkable results in treating a previously incurable genetic disorder.",
      url: "https://medicalnews.com/gene-therapy-breakthrough",
      domain: "medicalnews.com",
      author: "Dr. Emily Rodriguez",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 11),
      reliabilityScore: 89,
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
      readTime: 6,
      views: 12340,
      shares: 1876,
    },
    {
      id: "4",
      title: "Stock Market Reaches All-Time High Amid Economic Recovery",
      description:
        "Major indices hit record levels as investors show confidence in the ongoing economic recovery and corporate earnings reports exceed expectations.",
      url: "https://wsj.com/markets/record-high-2024",
      domain: "wsj.com",
      author: "Robert Thompson",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
      verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 17),
      reliabilityScore: 87,
      readTime: 5,
      views: 9876,
      shares: 1234,
    },
    {
      id: "5",
      title: "Scientific Discovery: New Species Found in Deep Ocean",
      description:
        "Marine biologists have discovered over 20 new species in the deep Pacific Ocean, highlighting the incredible biodiversity that still remains unexplored.",
      url: "https://nature.com/marine-discovery-2024",
      domain: "nature.com",
      author: "Dr. Maria Santos",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
      reliabilityScore: 96,
      imageUrl:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop",
      readTime: 10,
      views: 7654,
      shares: 987,
    },
    {
      id: "6",
      title: "Championship Finals: Underdog Team Wins in Stunning Upset",
      description:
        "In a thrilling championship game that went into overtime, the underdog team secured victory with a last-minute goal that will be remembered for years.",
      url: "https://espn.com/championship-upset-2024",
      domain: "espn.com",
      author: "James Wilson",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
      verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 35),
      reliabilityScore: 92,
      readTime: 4,
      views: 45231,
      shares: 8762,
    },
  ]);

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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const filteredAndSortedArticles = articles.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.publishedAt.getTime() - a.publishedAt.getTime();
      case "oldest":
        return a.publishedAt.getTime() - b.publishedAt.getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-semibold">Published News</h1>
            <p className="text-sm text-muted-foreground">
              {articles.length} verified articles
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            All Verified
          </Badge>
        </div>
      </div>

      <div className="p-4 border-b space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Search articles, authors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
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
        {filteredAndSortedArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Newspaper className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground max-w-sm">
              {searchQuery
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Published articles will appear here after verification and approval."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedArticles.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-lg transition-shadow group pb-3 pt-0"
              >
                {article.imageUrl && (
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 object-cover duration-300"
                    />
                  </div>
                )}

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
                          {article.reliabilityScore}/100
                        </span>
                      </div>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${article.reliabilityScore}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {article.description}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${article.author}`}
                      />
                      <AvatarFallback className="text-xs">
                        {article.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {article.author}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{article.domain}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(article.publishedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                    </div>

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
        )}
      </ScrollArea>
    </div>
  );
};

export default PublishedNewsPage;
