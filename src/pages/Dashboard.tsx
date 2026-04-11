import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { MotionCard, MotionButton, MotionStagger, MotionItem } from "@/components/MotionElements";
import { Mic, Users, TrendingUp, Flame, Target, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Session {
  id: string;
  interview_type: string;
  difficulty: string;
  role: string;
  overall_score: number | null;
  summary: string | null;
  created_at: string;
}

const roleLabels: Record<string, string> = {
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  fullstack: "Full Stack Developer",
  data: "Data Analyst",
};

const Dashboard = () => {
  const { user } = useAuth();
  const displayName = user?.displayName || "Student";
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("interview_sessions")
        .select("id, interview_type, difficulty, role, overall_score, summary, created_at")
        .eq("firebase_uid", user.uid)
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setSessions(data as unknown as Session[]);
      setLoading(false);
    };
    load();
  }, [user]);

  const stats = useMemo(() => {
    const scored = sessions.filter((s) => s.overall_score != null);
    const scores = scored.map((s) => s.overall_score!);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    // Calculate streak: consecutive days with sessions
    let streak = 0;
    if (sessions.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const days = new Set(
        sessions.map((s) => {
          const d = new Date(s.created_at);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      );
      const dayMs = 86400000;
      let check = today.getTime();
      // Allow today or yesterday as start
      if (!days.has(check)) check -= dayMs;
      while (days.has(check)) {
        streak++;
        check -= dayMs;
      }
    }

    return [
      { label: "Sessions Completed", value: String(sessions.length), icon: Target, color: "text-primary" },
      { label: "Average Score", value: scores.length ? `${avg}%` : "—", icon: TrendingUp, color: "text-primary" },
      { label: "Practice Streak", value: streak > 0 ? `${streak} day${streak > 1 ? "s" : ""}` : "0 days", icon: Flame, color: "text-primary" },
    ];
  }, [sessions]);

  return (
    <DashboardLayout>
      {/* Welcome */}
      <MotionItem>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Welcome back, {displayName}! 👋</h1>
          <p className="text-muted-foreground">Keep up the great work. Here's your progress overview.</p>
        </div>
      </MotionItem>

      {/* Quick Actions */}
      <MotionStagger className="grid md:grid-cols-2 gap-4 mb-8">
        <MotionItem>
          <MotionCard>
            <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-shadow border-border/50 cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <Mic className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Start AI Interview</h3>
                  <p className="text-sm text-muted-foreground">Practice with an AI interviewer</p>
                </div>
                <MotionButton>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/interview"><ArrowRight className="h-5 w-5" /></Link>
                  </Button>
                </MotionButton>
              </CardContent>
            </Card>
          </MotionCard>
        </MotionItem>
        <MotionItem>
          <MotionCard>
            <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-shadow border-border/50 cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <Users className="h-7 w-7 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Join Discussion</h3>
                  <p className="text-sm text-muted-foreground">Collaborate in group sessions</p>
                </div>
                <MotionButton>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/discussion"><ArrowRight className="h-5 w-5" /></Link>
                  </Button>
                </MotionButton>
              </CardContent>
            </Card>
          </MotionCard>
        </MotionItem>
      </MotionStagger>

      {/* Stats */}
      <MotionStagger className="grid md:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <MotionItem key={s.label}>
            <MotionCard>
              <Card className="border-border/50">
                <CardContent className="p-6 flex items-center gap-4">
                  <s.icon className={`h-8 w-8 ${s.color}`} />
                  <div>
                    <p className="text-2xl font-bold">{loading ? "…" : s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </MotionCard>
          </MotionItem>
        ))}
      </MotionStagger>

      {/* Recent Sessions */}
      <MotionItem>
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Sessions</CardTitle>
            {sessions.length > 0 && (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/history">View all</Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No sessions yet. Start your first interview!</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Difficulty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.slice(0, 5).map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium capitalize">{s.interview_type}</TableCell>
                      <TableCell>{roleLabels[s.role] || s.role}</TableCell>
                      <TableCell>
                        {s.overall_score != null ? (
                          <span className={s.overall_score >= 80 ? "text-primary font-semibold" : "text-muted-foreground"}>
                            {s.overall_score}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{s.difficulty}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </MotionItem>
    </DashboardLayout>
  );
};

export default Dashboard;
