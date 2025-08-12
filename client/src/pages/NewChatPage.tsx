import React, { useState, useRef } from "react";
import {
  Send,
  Link2,
  Shield,
  LoaderCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  const [url, setUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  // const checksEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    mutate: analyzeNewsMutation,
    isPending,
    data,
  } = useAnalyzeNewsMutation();

  React.useEffect(() => {
    if (data && !isPending && typeof data === "object" && "title" in data) {
      setAnalysisResult(data);
      setShowModal(true);
    }
  }, [data, isPending]);

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

  const getCredibilityColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getCredibilityIcon = (score: number) => {
    if (score >= 8) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 6)
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <X className="w-5 h-5 text-red-600" />;
  };

  const getPoliticalAlignmentColor = (alignment: string) => {
    switch (alignment) {
      case "left":
        return "bg-blue-100 text-blue-800";
      case "right":
        return "bg-red-100 text-red-800";
      case "center":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setHasAnalyzed(true);
  };

  return (
    <>
      <div className="flex flex-col justify-center h-[calc(100svh-40px)] max-w-3xl mx-auto">
        {!hasAnalyzed ? (
          <ScrollArea>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>

                <h2 className="text-2xl font-semibold">
                  Check News Reliability
                </h2>

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
        ) : (
          <div className="flex-1 overflow-hidden">
            <div className="h-full">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">
                  Analysis Results
                </h2>
                <p className="text-muted-foreground">
                  Analysis completed for your news article
                </p>
              </div>

              {analysisResult && (
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Link2 className="w-5 h-5 text-primary" />
                        <span className="flex-1">{analysisResult.title}</span>
                        {getCredibilityIcon(analysisResult.credibilityScore)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Summary
                        </h4>
                        <p className="text-muted-foreground">
                          {analysisResult.summary}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">
                            Credibility Assessment
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                Score:
                              </span>
                              <span
                                className={`text-lg font-bold ${getCredibilityColor(
                                  analysisResult.credibilityScore
                                )}`}
                              >
                                {analysisResult.credibilityScore.toFixed(1)}/10
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {analysisResult.credibilityReason}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">
                            Source Analysis
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium block mb-1">
                                Political Alignment:
                              </span>
                              <Badge
                                className={getPoliticalAlignmentColor(
                                  analysisResult.politicalAlignment
                                )}
                              >
                                {analysisResult.politicalAlignment
                                  .charAt(0)
                                  .toUpperCase() +
                                  analysisResult.politicalAlignment.slice(1)}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-sm font-medium block mb-1">
                                Satire/Sarcasm:
                              </span>
                              <Badge
                                variant={
                                  analysisResult.sarcasmOrSatire === "yes"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {analysisResult.sarcasmOrSatire
                                  .charAt(0)
                                  .toUpperCase() +
                                  analysisResult.sarcasmOrSatire.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">
                          Recommended Action
                        </h4>
                        <Alert>
                          <Shield className="h-4 w-4" />
                          <AlertDescription>
                            {analysisResult.recommendedAction}
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollArea>
              )}
            </div>
          </div>
        )}

        <div className="bg-background mt-6">
          <form onSubmit={handleSubmitUrl} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a news article URL here..."
                className="pl-10"
                type="url"
                disabled={hasAnalyzed}
              />
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            <Button
              type="submit"
              disabled={!url.trim() || hasAnalyzed}
              className="shrink-0"
            >
              {isPending ? (
                <LoaderCircle className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>

          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">
              {hasAnalyzed
                ? "Analysis completed - results displayed above"
                : "Enter a valid news article URL to check its reliability"}
            </p>
            {hasAnalyzed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUrl("");
                  setAnalysisResult(null);
                  setHasAnalyzed(false);
                }}
              >
                Analyze New Article
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {analysisResult &&
                getCredibilityIcon(analysisResult.credibilityScore)}
              Analysis Complete
            </DialogTitle>
            <DialogDescription>
              Here's what we found about this news article's reliability and
              credibility.
            </DialogDescription>
          </DialogHeader>

          {analysisResult && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{analysisResult.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {analysisResult.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div
                      className={`text-2xl font-bold ${getCredibilityColor(
                        analysisResult.credibilityScore
                      )}`}
                    >
                      {analysisResult.credibilityScore.toFixed(1)}/10
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Credibility Score
                    </div>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Badge
                      className={getPoliticalAlignmentColor(
                        analysisResult.politicalAlignment
                      )}
                    >
                      {analysisResult.politicalAlignment
                        .charAt(0)
                        .toUpperCase() +
                        analysisResult.politicalAlignment.slice(1)}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-2">
                      Political Alignment
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Analysis Details</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    {analysisResult.credibilityReason}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium">Satire/Sarcasm:</span>
                    <Badge
                      variant={
                        analysisResult.sarcasmOrSatire === "yes"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {analysisResult.sarcasmOrSatire.charAt(0).toUpperCase() +
                        analysisResult.sarcasmOrSatire.slice(1)}
                    </Badge>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Recommendation:</strong>{" "}
                    {analysisResult.recommendedAction}
                  </AlertDescription>
                </Alert>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewChatPage;
