import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Target, Award } from "lucide-react";

interface Session {
  id: string;
  interview_type: string;
  difficulty: string;
  role: string;
  overall_score: number | null;
  categories: { name: string; score: number }[];
  created_at: string;
}

interface Props {
  sessions: Session[];
}

const chartConfig = {
  score: { label: "Score", color: "hsl(var(--primary))" },
  average: { label: "Average", color: "hsl(var(--muted-foreground))" },
};

const InterviewAnalytics = ({ sessions }: Props) => {
  const scored = useMemo(() => sessions.filter((s) => s.overall_score != null), [sessions]);

  const trendData = useMemo(() => {
    return [...scored].reverse().map((s, i) => ({
      label: new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: s.overall_score!,
      index: i + 1,
    }));
  }, [scored]);

  const categoryAverages = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    scored.forEach((s) =>
      s.categories?.forEach((c) => {
        if (!map[c.name]) map[c.name] = { total: 0, count: 0 };
        map[c.name].total += c.score;
        map[c.name].count += 1;
      })
    );
    return Object.entries(map)
      .map(([name, { total, count }]) => ({ name, score: Math.round(total / count) }))
      .sort((a, b) => b.score - a.score);
  }, [scored]);

  const radarData = useMemo(() => {
    if (!scored.length) return [];
    const latest = scored[0];
    return (latest.categories || []).map((c) => ({
      category: c.name,
      score: c.score,
      fullMark: 100,
    }));
  }, [scored]);

  const stats = useMemo(() => {
    if (!scored.length) return null;
    const scores = scored.map((s) => s.overall_score!);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const best = Math.max(...scores);
    const latest = scores[0];
    const prev = scores[1];
    const trend = prev != null ? latest - prev : 0;
    return { avg, best, latest, trend, total: sessions.length };
  }, [scored, sessions]);

  if (!stats || scored.length < 1) {
    return (
      <Card className="border-border/50">
        <CardContent className="py-12 text-center text-muted-foreground">
          Complete at least one scored interview to see analytics.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Sessions", value: stats.total, icon: Target, color: "text-primary" },
          { label: "Average Score", value: `${stats.avg}%`, icon: Award, color: "text-primary" },
          { label: "Best Score", value: `${stats.best}%`, icon: TrendingUp, color: "text-green-500" },
          {
            label: "Last Trend",
            value: `${stats.trend >= 0 ? "+" : ""}${stats.trend}%`,
            icon: stats.trend >= 0 ? TrendingUp : TrendingDown,
            color: stats.trend >= 0 ? "text-green-500" : "text-red-500",
          },
        ].map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.color} shrink-0`} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Score trend line chart */}
      {trendData.length >= 2 && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Score Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Category averages bar chart */}
        {categoryAverages.length > 0 && (
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Category Averages</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={categoryAverages} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={75} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Latest session radar chart */}
        {radarData.length > 0 && (
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Latest Session Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid className="stroke-border/30" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InterviewAnalytics;
