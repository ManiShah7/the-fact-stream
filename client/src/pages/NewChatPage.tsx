import { useState, useRef } from "react";
import {
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Link2,
  Shield,
  Clock,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAnalyzeNewsMutation } from "@/queries/analyzeNewsQueries";

type NewsCheck = {
  title: string;
  summary: string;
  politicalAlignment: "left" | "center" | "right" | "unknown";
  credibilityScore: number;
  credibilityReason: string;
  sarcasmOrSatire: "yes" | "no" | "unsure";
  recommendedAction: string;
};

const NewChatPage = () => {
  // const [checks, setChecks] = useState<NewsCheck[]>([]);
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<NewsCheck | null>(null);
  const checksEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    mutate: analyzeNewsMutation,
    isPending,
    data,
  } = useAnalyzeNewsMutation();

  const scrollToBottom = () => {
    checksEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  console.log(data);

  // useEffect(() => {
  //   scrollToBottom();
  // }, [checks]);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (error_) {
      console.error("Invalid URL:", error_);
      return false;
    }
  };

  const handleSubmitUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    if (!isValidUrl(url)) {
      alert("Please enter a valid URL");
      return;
    }

    analyzeNewsMutation({ url: url.trim() });
  };

  // const getStatusIcon = (status: NewsCheck["status"]) => {
  //   switch (status) {
  //     case "verified":
  //       return <CheckCircle className="w-5 h-5 text-green-500" />;
  //     case "questionable":
  //       return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  //     case "unreliable":
  //       return <XCircle className="w-5 h-5 text-red-500" />;
  //     case "analyzing":
  //       return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
  //     default:
  //       return <XCircle className="w-5 h-5 text-gray-500" />;
  //   }
  // };

  // const getStatusText = (status: NewsCheck["status"]) => {
  //   switch (status) {
  //     case "verified":
  //       return "Reliable";
  //     case "questionable":
  //       return "Mixed Reliability";
  //     case "unreliable":
  //       return "Unreliable";
  //     case "analyzing":
  //       return "Analyzing...";
  //     default:
  //       return "Error";
  //   }
  // };

  // const getStatusColor = (status: NewsCheck["status"]) => {
  //   switch (status) {
  //     case "verified":
  //       return "bg-green-500";
  //     case "questionable":
  //       return "bg-yellow-500";
  //     case "unreliable":
  //       return "bg-red-500";
  //     case "analyzing":
  //       return "bg-blue-500";
  //     default:
  //       return "bg-gray-500";
  //   }
  // };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-[calc(100%-2rem)] justify-center max-w-3xl mx-auto">
      <ScrollArea className="px-4">
        <div className="flex flex-col items-center justify-center h-full pt-2 pb-6">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Check News Reliability</h2>

              <p className="text-muted-foreground max-w-md mx-auto">
                Paste a news article URL below to analyze its credibility,
                fact-check claims, and assess source reliability.
              </p>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                We analyze source credibility, fact-checking records, editorial
                standards, and transparency to provide reliability scores.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <div ref={checksEndRef} />
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
              type="url"
            />
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <Button type="submit" disabled={!url.trim()} className="shrink-0">
            {isPending ? (
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

          {isPending && (
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Analyzing article...
            </p>
          )}
        </div>

        {data && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-primary" />
                {data.title || "News Article"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {data.summary || "No summary available."}
                </p>

                <div className="flex flex-col gap-1">
                  <span>
                    <strong>Political Alignment:</strong>{" "}
                    {data.politicalAlignment}
                  </span>
                  <span>
                    <strong>Credibility Score:</strong>{" "}
                    {data.credibilityScore.toFixed(2)}
                  </span>
                  <span>
                    <strong>Credibility Reason:</strong>{" "}
                    {data.credibilityReason}
                  </span>
                  <span>
                    <strong>Sarcasm or Satire:</strong> {data.sarcasmOrSatire}
                  </span>
                  <span>
                    <strong>Recommended Action:</strong>{" "}
                    {data.recommendedAction}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Analyzed at {formatTime(new Date())}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NewChatPage;
