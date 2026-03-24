import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Cog,
  FileText,
  Github,
  Linkedin,
  Menu,
  MousePointerClick,
  Play,
  Twitter,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CircuitSimulation } from "./components/simulations/CircuitSimulation";
import { FluidSimulation } from "./components/simulations/FluidSimulation";
import { MechanicsSimulation } from "./components/simulations/MechanicsSimulation";
import { ThermodynamicsSimulation } from "./components/simulations/ThermodynamicsSimulation";

// ─── HEADER ──────────────────────────────────────────────────────────────────
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Concepts", "VizLab", "Resources", "About"];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
            <Cog className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-navy tracking-tight">
            EngiViz
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-slate text-sm font-medium hover:text-teal transition-colors"
              data-ocid="nav.link"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            className="bg-teal hover:bg-[oklch(0.58_0.12_200)] text-white font-semibold px-5 h-9 rounded-full text-sm"
            data-ocid="nav.primary_button"
          >
            Start Learning
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-navy"
          onClick={() => setMenuOpen(!menuOpen)}
          data-ocid="nav.toggle"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-card"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-slate text-sm font-medium hover:text-teal transition-colors"
                  onClick={() => setMenuOpen(false)}
                  data-ocid="nav.link"
                >
                  {link}
                </a>
              ))}
              <Button
                className="bg-teal text-white font-semibold rounded-full text-sm w-fit"
                data-ocid="nav.primary_button"
              >
                Start Learning
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="hero"
      className="bg-hero hero-grid pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mb-3">
            <Badge className="bg-[#E0F7FA] text-teal border-0 text-xs font-semibold px-3 py-1 rounded-full">
              🎓 Free for Students
            </Badge>
          </div>
          <h1 className="font-extrabold text-navy leading-none mb-6">
            <span className="block text-5xl md:text-6xl lg:text-7xl">
              Visualize.
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl mt-1">
              Understand.
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl mt-1 text-teal">
              Engineer.
            </span>
          </h1>
          <p className="text-slate text-base md:text-lg leading-relaxed mb-8 max-w-md">
            Transform how you learn engineering. Interactive 3D visualizations,
            real-time simulations, and guided concept breakdowns help students
            truly grasp complex ideas — not just memorize formulas.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              className="bg-teal hover:bg-[oklch(0.58_0.12_200)] text-white font-semibold px-7 h-12 rounded-full text-sm shadow-lg shadow-[oklch(0.63_0.11_200_/_0.3)]"
              data-ocid="hero.primary_button"
            >
              Explore Concepts <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="border-2 border-[oklch(0.91_0.025_220)] text-navy font-semibold px-7 h-12 rounded-full text-sm hover:border-teal hover:text-teal transition-colors"
              data-ocid="hero.secondary_button"
            >
              <Play className="mr-2 w-4 h-4 fill-current" /> Watch Demo
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-6">
            <div className="text-center">
              <p className="font-bold text-2xl text-navy">50+</p>
              <p className="text-xs text-slate">Concepts</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="font-bold text-2xl text-navy">12K+</p>
              <p className="text-xs text-slate">Students</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="font-bold text-2xl text-navy">4.9★</p>
              <p className="text-xs text-slate">Rating</p>
            </div>
          </div>
        </motion.div>

        {/* Right — Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-teal/10 blur-3xl scale-110" />
            <img
              src="/assets/generated/hero-illustration.dim_600x450.png"
              alt="Engineering visualization with robotic arm and stress map"
              className="relative z-10 w-full max-w-lg rounded-2xl animate-float shadow-2xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-xl px-4 py-3 shadow-lg border border-card flex items-center gap-2 z-20"
            >
              <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-teal" />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy">Interactive</p>
                <p className="text-[10px] text-slate">Real-time simulation</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -top-4 -right-4 bg-white rounded-xl px-4 py-3 shadow-lg border border-card z-20"
            >
              <p className="text-xs font-semibold text-navy">
                🎯 Concept Mastery
              </p>
              <p className="text-[10px] text-slate">Step-by-step guidance</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CONCEPT CARDS ───────────────────────────────────────────────────────────
const concepts = [
  {
    id: 1,
    title: "Mechanics & Statics",
    desc: "Master forces, vectors, and free body diagrams through interactive simulations that bring Newton's laws to life.",
    tag: "Interactive",
  },
  {
    id: 2,
    title: "Thermodynamics",
    desc: "Explore heat transfer, entropy, and energy cycles with live visual representations of thermal systems.",
    tag: "Interactive",
  },
  {
    id: 3,
    title: "Electrical Circuits",
    desc: "Build and simulate circuits in real time. Learn Ohm's law, circuit analysis, and AC/DC fundamentals hands-on.",
    tag: "Interactive",
  },
  {
    id: 4,
    title: "Fluid Dynamics",
    desc: "Visualize flow rates, pressure gradients, and Bernoulli's principle with animated particle simulations.",
    tag: "Interactive",
  },
];

function SimulationHeader({ id }: { id: number }) {
  switch (id) {
    case 1:
      return <MechanicsSimulation />;
    case 2:
      return <ThermodynamicsSimulation />;
    case 3:
      return <CircuitSimulation />;
    case 4:
      return <FluidSimulation />;
    default:
      return null;
  }
}

function ConceptCard({
  concept,
  index,
}: {
  concept: (typeof concepts)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl border border-card overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 ${
        visible ? "fade-in-up" : "fade-in-up-hidden"
      }`}
      style={{ animationDelay: `${index * 0.12}s` }}
      data-ocid={`concepts.item.${index + 1}`}
    >
      {/* Interactive simulation header */}
      <SimulationHeader id={concept.id} />

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-navy text-base">{concept.title}</h3>
          <Badge className="bg-[#E0F7FA] text-teal border-0 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {concept.tag}
          </Badge>
        </div>
        <p className="text-slate text-sm leading-relaxed mb-4">
          {concept.desc}
        </p>
        <Button
          variant="ghost"
          className="text-teal hover:text-teal hover:bg-[#E0F7FA] font-semibold text-sm px-0 h-auto"
          data-ocid={`concepts.button.${index + 1}`}
        >
          Explore Now <ArrowRight className="ml-1 w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

function ConceptsSection() {
  return (
    <section id="concepts" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <Badge className="bg-[#E0F7FA] text-teal border-0 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Core Modules
          </Badge>
          <h2 className="font-extrabold text-navy text-3xl md:text-4xl mb-3">
            Explore Engineering Concepts
          </h2>
          <p className="text-slate text-base max-w-xl mx-auto">
            Dive into interactive modules designed to make complex engineering
            topics intuitive and engaging.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {concepts.map((c, i) => (
            <ConceptCard key={c.id} concept={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ────────────────────────────────────────────────────────────
const steps = [
  {
    title: "Select a Concept",
    icon: <MousePointerClick className="w-7 h-7 text-teal" />,
    desc: "Browse our library of 50+ engineering topics across mechanics, thermodynamics, circuits, and fluid dynamics.",
  },
  {
    title: "Interact & Visualize",
    icon: <BrainCircuit className="w-7 h-7 text-teal" />,
    desc: "Manipulate parameters in real-time, watch simulations respond, and build intuition through visual feedback.",
  },
  {
    title: "Test Your Understanding",
    icon: <CheckCircle2 className="w-7 h-7 text-teal" />,
    desc: "Complete guided challenges, quizzes, and design problems to confirm mastery before moving forward.",
  },
];

function HowItWorks() {
  return (
    <section id="vizlab" className="bg-navy py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <Badge className="bg-white/10 text-white border-0 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Simple Process
          </Badge>
          <h2 className="font-extrabold text-white text-3xl md:text-4xl mb-3">
            How EngiViz Works
          </h2>
          <p className="text-white/60 text-base max-w-xl mx-auto">
            A structured, interactive learning path designed for engineering
            students at every level.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-7 text-center hover:bg-white/10 transition-colors"
              data-ocid={`steps.item.${i + 1}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-teal/20 flex items-center justify-center mx-auto mb-5">
                {step.icon}
              </div>
              <div className="text-white/40 text-xs font-bold mb-2 tracking-widest">
                STEP {i + 1}
              </div>
              <h3 className="font-bold text-white text-lg mb-3">
                {step.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── RESOURCES + TESTIMONIALS ────────────────────────────────────────────────
const resources = [
  {
    icon: <Play className="w-5 h-5 text-teal" />,
    title: "Video Tutorials",
    desc: "Over 200 narrated walk-throughs covering every major engineering concept with visual breakdowns.",
    ocid: "resources.item.1",
    linkOcid: "resources.link.1",
  },
  {
    icon: <Calculator className="w-5 h-5 text-teal" />,
    title: "Practice Problems",
    desc: "Hundreds of auto-graded problems with step-by-step solutions and visual hints.",
    ocid: "resources.item.2",
    linkOcid: "resources.link.2",
  },
  {
    icon: <FileText className="w-5 h-5 text-teal" />,
    title: "Formula Sheets",
    desc: "Printable, cheat-sheet-ready reference cards for every topic with example usage.",
    ocid: "resources.item.3",
    linkOcid: "resources.link.3",
  },
];

const testimonials = [
  {
    name: "Aisha Ramirez",
    course: "Civil Engineering, Year 3",
    quote:
      "EngiViz completely changed how I understand beam deflection. The interactive diagrams made it click in 20 minutes when lectures hadn't worked in weeks.",
    initial: "A",
  },
  {
    name: "Marcus Chen",
    course: "Mechanical Engineering, Year 2",
    quote:
      "The thermodynamics module is outstanding. Watching entropy visualized in real-time made the whole concept finally make sense.",
    initial: "M",
  },
  {
    name: "Priya Nair",
    course: "Electrical Engineering, Year 4",
    quote:
      "I used EngiViz to prep for my circuits exam. The simulation tool let me explore Thevenin's theorem interactively — absolutely invaluable.",
    initial: "P",
  },
];

function ResourcesAndTestimonials() {
  return (
    <section id="resources" className="py-20 bg-[#F7FCFF]">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        {/* Resources */}
        <div>
          <Badge className="bg-[#E0F7FA] text-teal border-0 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Study Materials
          </Badge>
          <h2 className="font-extrabold text-navy text-2xl md:text-3xl mb-8">
            Learning Resources
          </h2>
          <div className="flex flex-col gap-5">
            {resources.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-xl border border-card p-5 flex gap-4 hover:shadow-md transition-shadow"
                data-ocid={r.ocid}
              >
                <div className="w-10 h-10 rounded-xl bg-[#E0F7FA] flex items-center justify-center shrink-0">
                  {r.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-navy text-sm mb-1">
                    {r.title}
                  </h3>
                  <p className="text-slate text-xs leading-relaxed mb-2">
                    {r.desc}
                  </p>
                  <a
                    href="#concepts"
                    className="text-teal text-xs font-semibold hover:underline flex items-center gap-1"
                    data-ocid={r.linkOcid}
                  >
                    Learn more <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <Badge className="bg-[#E0F7FA] text-teal border-0 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Student Reviews
          </Badge>
          <h2 className="font-extrabold text-navy text-2xl md:text-3xl mb-8">
            What Students Say
          </h2>
          <div className="flex flex-col gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-xl border border-card p-5 hover:shadow-md transition-shadow"
                data-ocid={`testimonials.item.${i + 1}`}
              >
                <p className="text-slate text-sm leading-relaxed mb-4 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-navy text-sm font-semibold">{t.name}</p>
                    <p className="text-slate text-xs">{t.course}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA BANNER ──────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section
      className="py-20"
      style={{
        background: "linear-gradient(135deg, #0FA6B3 0%, #0B6B8A 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-extrabold text-white text-3xl md:text-5xl mb-4">
            Ready to Master Engineering?
          </h2>
          <p className="text-white/80 text-base md:text-lg mb-8">
            Join thousands of students visualizing concepts like never before.
            Completely free — no credit card needed.
          </p>
          <Button
            className="bg-white text-teal hover:bg-white/90 font-bold px-10 h-12 rounded-full text-base shadow-xl"
            data-ocid="cta.primary_button"
          >
            Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Concepts", href: "#concepts" },
  { label: "Resources", href: "#resources" },
  { label: "Contact", href: "#hero" },
];

const socialLinks = [
  {
    icon: <Github className="w-4 h-4" />,
    label: "GitHub",
    href: "https://github.com",
  },
  {
    icon: <Twitter className="w-4 h-4" />,
    label: "Twitter",
    href: "https://twitter.com",
  },
  {
    icon: <Linkedin className="w-4 h-4" />,
    label: "LinkedIn",
    href: "https://linkedin.com",
  },
];

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer id="about" className="bg-navy-dark pt-14 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
                <Cog className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">EngiViz</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Making engineering education more accessible through interactive
              visualizations and simulations.
            </p>
          </div>

          <div className="flex justify-center">
            <div>
              <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-4">
                Navigation
              </p>
              <div className="flex flex-col gap-3">
                {footerLinks.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="text-white/50 text-sm hover:text-teal transition-colors"
                    data-ocid="footer.link"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex md:justify-end">
            <div>
              <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-4">
                Follow Us
              </p>
              <div className="flex gap-3">
                {socialLinks.map(({ icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-teal hover:text-white transition-colors"
                    data-ocid="footer.link"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">
            © {year} EngiViz. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              className="underline hover:text-teal transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main>
        <Hero />
        <ConceptsSection />
        <HowItWorks />
        <ResourcesAndTestimonials />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
