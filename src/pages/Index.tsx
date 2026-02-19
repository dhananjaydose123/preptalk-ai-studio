import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { MotionCard, MotionButton, MotionStagger, MotionItem } from "@/components/MotionElements";
import { Mic, Users, BarChart3, Zap, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Mic, title: "AI Mock Interviews", description: "Practice with AI-powered interviewers that adapt to your skill level and provide real-time feedback." },
  { icon: Users, title: "Group Discussions", description: "Join collaborative discussion rooms to sharpen your communication and critical thinking skills." },
  { icon: BarChart3, title: "Performance Analytics", description: "Track your progress with detailed analytics, scores, and personalized improvement plans." },
  { icon: Zap, title: "Instant Feedback", description: "Get immediate, actionable feedback on your responses to accelerate your preparation." },
];

const steps = [
  { step: "01", title: "Choose Your Practice", description: "Select from AI interviews or group discussions based on your goals." },
  { step: "02", title: "Practice & Engage", description: "Dive into realistic scenarios with adaptive AI or real peers." },
  { step: "03", title: "Review & Improve", description: "Get detailed feedback and track your progress over time." },
];

const testimonials = [
  { name: "Priya S.", role: "Software Engineer", quote: "PrepTalkAI helped me ace my Google interview. The AI feedback was incredibly accurate!", rating: 5 },
  { name: "Alex M.", role: "MBA Student", quote: "The group discussions feature is a game-changer. I improved my communication skills dramatically.", rating: 5 },
  { name: "Jordan T.", role: "Data Analyst", quote: "I went from nervous wreck to confident speaker in just 2 weeks of practice.", rating: 5 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10 animate-gradient-shift" style={{ backgroundSize: "200% 200%" }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
              🚀 AI-Powered Interview Preparation
            </div>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Master Your Interviews with{" "}
            <span className="gradient-text">AI Precision</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            Practice mock interviews, join group discussions, and get instant AI feedback to land your dream role.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <MotionButton>
              <Button size="lg" asChild className="gradient-primary border-0 text-lg px-8 h-12">
                <Link to="/signup">Start Practicing Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </MotionButton>
            <MotionButton>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 h-12">
                <Link to="/dashboard">View Demo</Link>
              </Button>
            </MotionButton>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Everything You Need to <span className="gradient-text">Succeed</span></h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">Comprehensive tools designed to transform your interview skills from good to exceptional.</p>
          </motion.div>
          <MotionStagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <MotionItem key={f.title}>
                <MotionCard>
                  <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-shadow border-border/50 h-full">
                    <CardContent className="p-6">
                      <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                        <f.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.description}</p>
                    </CardContent>
                  </Card>
                </MotionCard>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It <span className="gradient-text">Works</span>
          </motion.h2>
          <MotionStagger className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s) => (
              <MotionItem key={s.step}>
                <div className="text-center">
                  <div className="text-5xl font-black gradient-text mb-4">{s.step}</div>
                  <h3 className="font-semibold text-xl mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.description}</p>
                </div>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Loved by <span className="gradient-text">Students</span>
          </motion.h2>
          <MotionStagger className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <MotionItem key={t.name}>
                <MotionCard>
                  <Card className="border-border/50 h-full">
                    <CardContent className="p-6">
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 italic">"{t.quote}"</p>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </MotionCard>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">© 2026 PrepTalkAI. Built for students who aim higher.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
