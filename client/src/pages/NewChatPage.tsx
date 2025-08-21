import React, { useState, useRef } from "react";
import { Send, Link2, Shield, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAnalyzeNewsMutation } from "@/queries/analyzeNewsQueries";

const NewChatPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [url, setUrl] = useState("");

  const { mutate: analyzeNewsMutation, isPending } = useAnalyzeNewsMutation();

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
    setIsAnalyzing(true);
  };

  return (
    <>
      <div className="flex flex-col justify-center h-[calc(100svh-40px)] max-w-3xl mx-auto">
        <ScrollArea>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-semibold">Check News Reliability</h2>

              <p className="text-muted-foreground ">
                Paste a news article URL below to analyze its credibility,
                fact-check claims, and assess source reliability.
              </p>

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
        </ScrollArea>

        <div className="mt-6">
          {isAnalyzing ? (
            <>
              We have received your request and are analyzing the article. This
              may take some time. We will notify you once the analysis is
              complete. You can continue to use the app while you wait.
            </>
          ) : (
            <form onSubmit={handleSubmitUrl} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste a news article URL here..."
                  className="pl-10 bg-background "
                  type="url"
                  disabled={isPending}
                />
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>

              <Button type="submit" disabled={!url.trim()} className="shrink-0">
                {isPending ? (
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          )}

          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">
              Enter a valid news article URL to check its reliability
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewChatPage;
