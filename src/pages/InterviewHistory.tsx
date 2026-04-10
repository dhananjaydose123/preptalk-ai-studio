import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, History, ArrowLeft, Bot, User, CheckCircle, Mic } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Session {
  id: string;
  interview_type: string;
  difficulty: string;
  role: string;
  overall_score: number | null;
  summary: string | null;
  messages: { role: string; content: string }[];
  categories: { name: string; score: number }[];
  tips: string[];
  created_at: string;
}

const roleLabels: Record<string, string> = {
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  fullstack: "Full Stack Developer",
  data: "Data Analyst",
};

const InterviewHistory = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Session | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("interview_sessions")
        .select("*")
        .eq("firebase_uid", user.uid)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setSessions(data as unknown as Session[]);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Interview History</h1>
            <p className="text-muted-foreground">Review your past interview sessions</p>
          </div>
          <Button asChild>
            <Link to="/interview">
              <Mic className="mr-2 h-4 w-4" /> New Interview
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : sessions.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <History className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No interview sessions yet</p>
              <Button asChild variant="outline">
                <Link to="/interview">Start your first interview</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((s) => (
              <Card
                key={s.id}
                className="border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSelected(s)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="capitalize">{s.interview_type}</Badge>
                      <Badge variant="outline" className="capitalize">{s.difficulty}</Badge>
                      <span className="text-sm text-muted-foreground">{roleLabels[s.role] || s.role}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                      {" · "}
                      {s.messages.length} messages
                    </p>
                    {s.summary && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{s.summary}</p>
                    )}
                  </div>
                  {s.overall_score != null && (
                    <div className={`text-3xl font-black ${scoreColor(s.overall_score)}`}>
                      {s.overall_score}%
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Session Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Interview Details</DialogTitle>
            <DialogDescription>
              {selected && (
                <span className="capitalize">
                  {selected.interview_type} · {selected.difficulty} · {roleLabels[selected.role] || selected.role}
                  {" · "}
                  {new Date(selected.created_at).toLocaleDateString()}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* Score section */}
              {selected.overall_score != null && (
                <div>
                  <div className={`text-4xl font-black text-center mb-3 ${scoreColor(selected.overall_score)}`}>
                    {selected.overall_score}%
                  </div>
                  {selected.summary && (
                    <p className="text-sm text-muted-foreground text-center mb-4">{selected.summary}</p>
                  )}
                  <div className="space-y-2">
                    {selected.categories.map((c) => (
                      <div key={c.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{c.name}</span>
                          <span className="font-medium">{c.score}%</span>
                        </div>
                        <Progress value={c.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {selected.tips.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Improvement Tips</h3>
                  <ul className="space-y-2">
                    {selected.tips.map((tip, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conversation */}
              <div>
                <h3 className="font-semibold mb-2">Conversation</h3>
                <div className="space-y-3">
                  {selected.messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === "assistant" ? "gradient-primary" : "bg-secondary"}`}>
                        {msg.role === "assistant" ? <Bot className="h-3 w-3 text-primary-foreground" /> : <User className="h-3 w-3 text-secondary-foreground" />}
                      </div>
                      <div className={`max-w-[85%] rounded-xl p-3 text-xs ${msg.role === "assistant" ? "bg-secondary" : "gradient-primary text-primary-foreground"}`}>
                        <div className="prose prose-xs dark:prose-invert max-w-none [&>p]:m-0">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default InterviewHistory;
