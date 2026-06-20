import { useState } from "react";
import {
  Car, Battery, Sparkles, Phone, Mail, MapPin, Star, CheckCircle,
  Clock, Users, ChevronRight, Menu, X, Calendar, Settings, LogOut,
  BarChart3, Bell, Shield, Zap, ArrowRight, MessageSquare,
  Eye, EyeOff, Wrench, Plus, Search, Edit, Trash2, Check,
  DollarSign, FileText, User, TrendingUp,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";

type Page = "home" | "services" | "booking" | "auth" | "dashboard" | "admin" | "whatsapp";

// ── DATA ──────────────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5800 },
  { month: "Mar", revenue: 7200 },
  { month: "Apr", revenue: 6100 },
  { month: "May", revenue: 8900 },
  { month: "Jun", revenue: 9400 },
];

const bookingTrend = [
  { month: "Jan", bookings: 32 },
  { month: "Feb", bookings: 45 },
  { month: "Mar", bookings: 58 },
  { month: "Apr", bookings: 49 },
  { month: "May", bookings: 71 },
  { month: "Jun", bookings: 84 },
];

const allBookings = [
  { id: "BK001", customer: "James Mitchell", service: "Premium Wash", date: "2026-06-21", time: "10:00 AM", status: "confirmed", amount: "$79", technician: "Mike Chen" },
  { id: "BK002", customer: "Sarah Connor", service: "Full Detail", date: "2026-06-21", time: "2:00 PM", status: "in-progress", amount: "$179", technician: "Alex Rivera" },
  { id: "BK003", customer: "David Park", service: "Battery Change", date: "2026-06-22", time: "9:00 AM", status: "pending", amount: "$99", technician: "Unassigned" },
  { id: "BK004", customer: "Emma Watson", service: "Interior Detail", date: "2026-06-22", time: "11:00 AM", status: "confirmed", amount: "$89", technician: "Jordan Lee" },
  { id: "BK005", customer: "Carlos Rivera", service: "Standard Wash", date: "2026-06-23", time: "3:00 PM", status: "completed", amount: "$49", technician: "Mike Chen" },
];

const allCustomers = [
  { id: "C001", name: "James Mitchell", email: "james.m@email.com", phone: "+1 (555) 234-5678", bookings: 8, joined: "Jan 2026", status: "active" },
  { id: "C002", name: "Sarah Connor", email: "sarah.c@email.com", phone: "+1 (555) 345-6789", bookings: 3, joined: "Mar 2026", status: "active" },
  { id: "C003", name: "David Park", email: "d.park@email.com", phone: "+1 (555) 456-7890", bookings: 1, joined: "Jun 2026", status: "active" },
  { id: "C004", name: "Emma Watson", email: "emma.w@email.com", phone: "+1 (555) 567-8901", bookings: 5, joined: "Feb 2026", status: "active" },
  { id: "C005", name: "Carlos Rivera", email: "c.rivera@email.com", phone: "+1 (555) 678-9012", bookings: 12, joined: "Nov 2025", status: "vip" },
];

const allTechnicians = [
  { id: "T001", name: "Mike Chen", specialty: "Car Wash & Detailing", rating: 4.9, jobs: 142, status: "available" },
  { id: "T002", name: "Alex Rivera", specialty: "Full Detailing", rating: 4.8, jobs: 98, status: "on-job" },
  { id: "T003", name: "Jordan Lee", specialty: "Battery & Electrical", rating: 4.7, jobs: 67, status: "available" },
  { id: "T004", name: "Sam Taylor", specialty: "Interior Detailing", rating: 4.9, jobs: 115, status: "off-duty" },
];

const reviews = [
  { name: "James M.", rating: 5, text: "AutoShine came right to my office parking lot. My car looked brand new in under an hour. Incredible service!", date: "June 15, 2026", service: "Premium Wash" },
  { name: "Sarah K.", rating: 5, text: "The full detail package completely transformed my 5-year-old SUV. Worth every penny. Highly recommend!", date: "June 10, 2026", service: "Full Detailing" },
  { name: "Carlos R.", rating: 5, text: "Dead battery at 7am. They arrived in 30 minutes and had me back on the road fast. Absolute life savers!", date: "June 5, 2026", service: "Battery Change" },
  { name: "Emma W.", rating: 4, text: "Great interior detailing. The team was professional, punctual, and thorough. Will definitely book again.", date: "May 28, 2026", service: "Interior Detail" },
];

const statusStyle: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  "in-progress": "bg-violet-100 text-violet-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

// ── SHARED ────────────────────────────────────────────────────────────────────

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow ${className}`}
    />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
      {children}
    </label>
  );
}

function Btn({
  children, variant = "primary", className = "", ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" }) {
  const base = "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all text-sm px-5 py-3 disabled:opacity-40";
  const variants = {
    primary: "bg-primary hover:bg-blue-700 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-px",
    ghost: "bg-muted hover:bg-accent text-foreground",
    outline: "border-2 border-border bg-transparent hover:bg-muted text-foreground",
  };
  return <button {...props} className={`${base} ${variants[variant]} ${className}`}>{children}</button>;
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────

function Navbar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  const links: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "Services", page: "services" },
    { label: "Book Now", page: "booking" },
    { label: "WhatsApp", page: "whatsapp" },
  ];
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-full">
        <button onClick={() => setPage("home")} className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Auto<span className="text-primary">Shine</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <button key={l.page} onClick={() => setPage(l.page)}
              className={`text-sm font-semibold transition-colors ${page === l.page ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => setPage("auth")} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Login</button>
          <Btn onClick={() => setPage("booking")} className="px-5 py-2 text-sm">Book Now</Btn>
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white border-b border-border px-4 py-4 space-y-1 shadow-lg">
          {links.map(l => (
            <button key={l.page} onClick={() => { setPage(l.page); setOpen(false); }}
              className="block w-full text-left px-3 py-2.5 text-sm font-semibold rounded-xl hover:bg-muted transition-colors text-foreground">
              {l.label}
            </button>
          ))}
          <div className="flex gap-2 pt-2 border-t border-border mt-2">
            <button onClick={() => { setPage("auth"); setOpen(false); }} className="flex-1 border border-border rounded-xl py-2.5 text-sm font-semibold text-foreground">Login</button>
            <Btn onClick={() => { setPage("booking"); setOpen(false); }} className="flex-1 py-2.5 text-sm">Book Now</Btn>
          </div>
        </div>
      )}
    </nav>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center bg-[#060E1F] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&h=900&fit=crop&auto=format"
            alt="Professional car detailing service"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060E1F] via-[#060E1F]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060E1F]/60 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" /> Mobile Service — We Come to You
            </div>
            <h1
              className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-white leading-[0.95] mb-6"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Premium Car<br />
              Care <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Delivered</span>
            </h1>
            <p className="text-blue-100/75 text-lg leading-relaxed mb-8 max-w-xl">
              Professional car wash, full detailing, and battery replacement — sent to wherever you are. No queues, no driving. Just a spotless car.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Btn onClick={() => setPage("booking")} className="px-8 py-4 text-base">
                Book a Service <ArrowRight className="w-4 h-4" />
              </Btn>
              <button onClick={() => setPage("services")} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all border border-white/15">
                View Pricing
              </button>
            </div>
            <div className="flex items-center gap-10 mt-12 pt-12 border-t border-white/10">
              {[["500+", "Happy Customers"], ["4.9★", "Average Rating"], ["≤30 min", "Avg. Response"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-white font-black text-2xl" style={{ fontFamily: "'Barlow', sans-serif" }}>{v}</div>
                  <div className="text-blue-300/60 text-xs mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-primary font-bold text-xs uppercase tracking-widest mb-2">What We Offer</p>
            <h2 className="text-4xl font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>Our Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Car className="w-7 h-7" />, title: "Mobile Car Wash", desc: "Exterior wash, rinse & dry. Basic through premium packages delivered anywhere.", from: "$29", color: "text-blue-600 bg-blue-50", img: "photo-1520340356584-f9917d1eea6f" },
              { icon: <Sparkles className="w-7 h-7" />, title: "Car Detailing", desc: "Full interior & exterior detailing, paint correction, and ceramic coating.", from: "$89", color: "text-indigo-600 bg-indigo-50", img: "photo-1502877338535-766e1452684a" },
              { icon: <Battery className="w-7 h-7" />, title: "Battery Change", desc: "Battery testing, replacement, and safe disposal. Fast on-site service.", from: "$69", color: "text-cyan-600 bg-cyan-50", img: "photo-1492144534655-ae79c964c9d7" },
            ].map(svc => (
              <div key={svc.title} className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-2xl hover:shadow-primary/8 transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 bg-slate-100 overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-${svc.img}?w=600&h=300&fit=crop&auto=format`} alt={svc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className={`inline-flex p-2.5 rounded-xl ${svc.color} mb-4`}>{svc.icon}</div>
                  <h3 className="text-lg font-black text-foreground mb-2" style={{ fontFamily: "'Barlow', sans-serif" }}>{svc.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{svc.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-black text-xl" style={{ fontFamily: "'Barlow', sans-serif" }}>From {svc.from}</span>
                    <button onClick={() => setPage("services")} className="text-primary font-semibold text-sm hover:text-blue-800 flex items-center gap-1 transition-colors">
                      Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[#060E1F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-3">Why AutoShine</p>
              <h2 className="text-4xl font-black text-white mb-6" style={{ fontFamily: "'Barlow', sans-serif" }}>The Smarter Way to Keep Your Car Clean</h2>
              <p className="text-blue-200/65 leading-relaxed mb-10">Professional-grade equipment and certified technicians — straight to your home, office, or wherever your car is parked.</p>
              <div className="space-y-5">
                {[
                  { icon: <Shield className="w-5 h-5" />, title: "Insured & Certified", desc: "All techs are background-checked and fully insured" },
                  { icon: <Clock className="w-5 h-5" />, title: "On-Time Guarantee", desc: "We arrive within your selected time window, every time" },
                  { icon: <Zap className="w-5 h-5" />, title: "Eco-Friendly Products", desc: "Waterless and biodegradable solutions protect your paint" },
                  { icon: <Star className="w-5 h-5" />, title: "100% Satisfaction", desc: "Not happy? We come back and make it right, free of charge" },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-blue-400">{item.icon}</div>
                    <div>
                      <div className="text-white font-semibold text-sm mb-0.5">{item.title}</div>
                      <div className="text-blue-200/55 text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-slate-800 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&h=680&fit=crop&auto=format" alt="Technician detailing a car" className="w-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-primary rounded-2xl p-5 shadow-2xl shadow-primary/40">
                <div className="text-white font-black text-4xl" style={{ fontFamily: "'Barlow', sans-serif" }}>4.9</div>
                <div className="flex gap-0.5 my-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}</div>
                <div className="text-blue-100/75 text-xs">500+ reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-primary font-bold text-xs uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="text-4xl font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { n: "01", icon: <MessageSquare className="w-6 h-6" />, title: "Choose a Service", desc: "Pick from wash, detailing, or battery service" },
              { n: "02", icon: <Calendar className="w-6 h-6" />, title: "Pick a Time", desc: "Select your preferred date and time slot" },
              { n: "03", icon: <MapPin className="w-6 h-6" />, title: "Share Location", desc: "Enter your address or drop a pin on the map" },
              { n: "04", icon: <CheckCircle className="w-6 h-6" />, title: "We Come to You", desc: "Sit back while our technician handles the rest" },
            ].map(item => (
              <div key={item.n} className="text-center">
                <div className="relative inline-flex mb-5">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/25">{item.icon}</div>
                  <span className="absolute -top-2 -right-2 bg-foreground text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">{item.n}</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Btn onClick={() => setPage("booking")} className="px-10 py-4 text-base">
              Book Your Service Now
            </Btn>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-primary font-bold text-xs uppercase tracking-widest mb-2">Customer Feedback</p>
            <h2 className="text-4xl font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>What Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.map(r => (
              <div key={r.name} className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex gap-0.5 mb-3">{[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
                <p className="text-foreground text-sm leading-relaxed mb-4">"{r.text}"</p>
                <div className="border-t border-border pt-4">
                  <div className="font-bold text-foreground text-sm">{r.name}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{r.service} · {r.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-primary font-bold text-xs uppercase tracking-widest mb-2">Get In Touch</p>
              <h2 className="text-4xl font-black text-foreground mb-4" style={{ fontFamily: "'Barlow', sans-serif" }}>Ready to Shine?</h2>
              <p className="text-muted-foreground mb-8">Contact us anytime — we operate 7 days a week, 7am to 9pm.</p>
              <div className="space-y-5">
                {[
                  { icon: <Phone className="w-5 h-5" />, main: "+1 (555) 800-WASH", sub: "Mon–Sun, 7am–9pm" },
                  { icon: <Mail className="w-5 h-5" />, main: "hello@autoshine.com", sub: "Reply within 1 hour" },
                  { icon: <MapPin className="w-5 h-5" />, main: "Greater Metro Area", sub: "50-mile service radius" },
                ].map(c => (
                  <div key={c.main} className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">{c.icon}</div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{c.main}</div>
                      <div className="text-muted-foreground text-xs">{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <h3 className="font-black text-foreground text-lg mb-6" style={{ fontFamily: "'Barlow', sans-serif" }}>Send a Message</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>First Name</Label><Input placeholder="James" /></div>
                  <div><Label>Last Name</Label><Input placeholder="Mitchell" /></div>
                </div>
                <div><Label>Email</Label><Input type="email" placeholder="james@email.com" /></div>
                <div>
                  <Label>Message</Label>
                  <textarea rows={4} className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-shadow" placeholder="How can we help?" />
                </div>
                <Btn className="w-full py-3.5 text-sm">Send Message</Btn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#060E1F] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center"><Car className="w-4 h-4 text-white" /></div>
                <span className="font-black text-xl" style={{ fontFamily: "'Barlow', sans-serif" }}>Auto<span className="text-blue-400">Shine</span></span>
              </div>
              <p className="text-blue-200/50 text-sm leading-relaxed max-w-xs">Professional mobile car care delivered to your door. Quality, convenience, and satisfaction guaranteed.</p>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-blue-400 mb-4">Services</h4>
              <ul className="space-y-2 text-blue-200/50 text-sm">
                {["Mobile Car Wash", "Car Detailing", "Battery Change", "Paint Protection", "Interior Cleaning"].map(s => (
                  <li key={s} className="hover:text-white cursor-pointer transition-colors">{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-blue-400 mb-4">Company</h4>
              <ul className="space-y-2 text-blue-200/50 text-sm">
                {["About Us", "Our Team", "Careers", "Privacy Policy", "Terms of Service"].map(s => (
                  <li key={s} className="hover:text-white cursor-pointer transition-colors">{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-blue-200/30 text-xs">
            <span>© 2026 AutoShine Mobile. All rights reserved.</span>
            <span>Made with care for car owners everywhere</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── SERVICES PAGE ─────────────────────────────────────────────────────────────

function ServicesPage({ setPage }: { setPage: (p: Page) => void }) {
  const [cat, setCat] = useState<"wash" | "detail" | "battery">("wash");

  const pkgs = {
    wash: [
      { name: "Basic Wash", price: "$29", dur: "30 min", feats: ["Exterior hand wash", "Rinse & blow dry", "Wheel cleaning", "Window wipe-down"], hot: false },
      { name: "Standard Wash", price: "$49", dur: "45 min", feats: ["Everything in Basic", "Interior vacuum", "Dashboard wipe", "Door jambs", "Tire shine"], hot: true },
      { name: "Premium Wash", price: "$79", dur: "60 min", feats: ["Everything in Standard", "Interior deep clean", "Leather wipe", "Air freshener", "Streak-free glass", "Trunk vacuum"], hot: false },
    ],
    detail: [
      { name: "Interior Detail", price: "$89", dur: "2 hrs", feats: ["Full vacuum", "Carpet shampoo", "Leather conditioning", "Dashboard detail", "Vent cleaning", "Odor treatment"], hot: false },
      { name: "Exterior Detail", price: "$119", dur: "2.5 hrs", feats: ["Hand wash & clay bar", "Paint decontamination", "Machine polish", "Wax protection", "Wheel detail", "Trim dressing"], hot: true },
      { name: "Full Detail", price: "$179", dur: "4 hrs", feats: ["Interior + Exterior", "Paint correction", "Ceramic sealant", "Engine bay clean", "Headlight restore", "VIP finish"], hot: false },
    ],
    battery: [
      { name: "Battery Test", price: "$19", dur: "15 min", feats: ["Battery health check", "Charging system test", "Alternator inspection", "Digital report"], hot: false },
      { name: "Standard Replace", price: "$69", dur: "30 min", feats: ["Test & replacement", "Standard battery included", "Old battery disposal", "12-month warranty"], hot: true },
      { name: "Premium Replace", price: "$99", dur: "30 min", feats: ["Test & replacement", "Premium AGM battery", "Old battery disposal", "36-month warranty", "Terminal protection"], hot: false },
    ],
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="bg-[#060E1F] py-18 text-center py-16">
        <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-2">Pricing</p>
        <h1 className="text-5xl font-black text-white mb-3" style={{ fontFamily: "'Barlow', sans-serif" }}>Clear, Simple Pricing</h1>
        <p className="text-blue-200/60 max-w-lg mx-auto text-sm">No hidden fees. No surprises. Quality service at a fair price, delivered to you.</p>
      </div>

      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex">
          {([
            { k: "wash", label: "Car Wash", icon: <Car className="w-4 h-4" /> },
            { k: "detail", label: "Detailing", icon: <Sparkles className="w-4 h-4" /> },
            { k: "battery", label: "Battery", icon: <Battery className="w-4 h-4" /> },
          ] as const).map(tab => (
            <button key={tab.k} onClick={() => setCat(tab.k)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${cat === tab.k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {pkgs[cat].map(pkg => (
            <div key={pkg.name} className={`relative rounded-2xl p-8 border-2 transition-all ${pkg.hot ? "border-primary bg-primary text-white shadow-2xl shadow-primary/25 scale-[1.02]" : "border-border bg-card"}`}>
              {pkg.hot && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
              )}
              <h3 className={`text-xl font-black mb-1 ${pkg.hot ? "text-white" : "text-foreground"}`} style={{ fontFamily: "'Barlow', sans-serif" }}>{pkg.name}</h3>
              <div className={`text-5xl font-black mt-3 mb-1 ${pkg.hot ? "text-white" : "text-foreground"}`} style={{ fontFamily: "'Barlow', sans-serif" }}>{pkg.price}</div>
              <div className={`text-sm mb-6 ${pkg.hot ? "text-blue-100/80" : "text-muted-foreground"}`}>⏱ {pkg.dur}</div>
              <ul className="space-y-3 mb-8">
                {pkg.feats.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${pkg.hot ? "text-blue-200" : "text-primary"}`} />
                    <span className={pkg.hot ? "text-blue-50" : "text-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => setPage("booking")}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${pkg.hot ? "bg-white text-primary hover:bg-blue-50" : "bg-primary text-white hover:bg-blue-700"}`}>
                Book This Package
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-card rounded-2xl border border-border p-8">
          <h3 className="text-xl font-black text-foreground mb-6" style={{ fontFamily: "'Barlow', sans-serif" }}>Available Add-Ons</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Ceramic Coating", price: "+$149" },
              { name: "Headlight Restore", price: "+$49" },
              { name: "Pet Hair Removal", price: "+$39" },
              { name: "Odor Elimination", price: "+$29" },
              { name: "Engine Bay Clean", price: "+$59" },
              { name: "Paint Protection", price: "+$199" },
              { name: "Ozone Treatment", price: "+$45" },
              { name: "Tar & Sap Removal", price: "+$35" },
            ].map(a => (
              <div key={a.name} className="bg-muted rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{a.name}</span>
                <span className="text-sm font-black text-primary ml-2">{a.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── BOOKING PAGE ──────────────────────────────────────────────────────────────

const bookingServices = [
  { id: "basic-wash", name: "Basic Wash", price: "$29", icon: <Car className="w-5 h-5" />, dur: "30 min" },
  { id: "standard-wash", name: "Standard Wash", price: "$49", icon: <Car className="w-5 h-5" />, dur: "45 min" },
  { id: "premium-wash", name: "Premium Wash", price: "$79", icon: <Car className="w-5 h-5" />, dur: "60 min" },
  { id: "interior-detail", name: "Interior Detail", price: "$89", icon: <Sparkles className="w-5 h-5" />, dur: "2 hrs" },
  { id: "full-detail", name: "Full Detail", price: "$179", icon: <Sparkles className="w-5 h-5" />, dur: "4 hrs" },
  { id: "battery-replace", name: "Battery Replace", price: "$69+", icon: <Battery className="w-5 h-5" />, dur: "30 min" },
];

const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];
const bookedSlots = ["10:00 AM", "2:00 PM", "5:00 PM"];

function BookingPage({ setPage }: { setPage: (p: Page) => void }) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [addr, setAddr] = useState("");
  const [done, setDone] = useState(false);

  const selectedSvc = bookingServices.find(s => s.id === service);
  const steps = ["Select Service", "Choose Date", "Pick Time", "Your Address", "Confirm"];

  if (done) {
    return (
      <div className="pt-16 min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-2" style={{ fontFamily: "'Barlow', sans-serif" }}>Booking Confirmed!</h2>
          <p className="text-muted-foreground text-sm mb-6">You'll receive a WhatsApp confirmation shortly with technician details.</p>
          <div className="bg-card border border-border rounded-2xl p-5 text-left mb-6 space-y-3">
            {[
              ["Booking ID", `BK${Math.floor(Math.random() * 9000 + 1000)}`],
              ["Service", selectedSvc?.name || ""],
              ["Date", date],
              ["Time", time],
              ["Address", addr || "123 Main St, New York"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{l}</span>
                <span className="font-semibold text-foreground">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Btn variant="ghost" onClick={() => { setStep(1); setService(""); setDate(""); setTime(""); setAddr(""); setDone(false); }} className="flex-1">New Booking</Btn>
            <Btn onClick={() => setPage("dashboard")} className="flex-1">My Bookings</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="bg-[#060E1F] py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-black text-white text-center mb-8" style={{ fontFamily: "'Barlow', sans-serif" }}>Book a Service</h1>
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${i + 1 < step ? "bg-emerald-500 text-white" : i + 1 === step ? "bg-primary text-white ring-4 ring-primary/30" : "bg-white/15 text-blue-300"}`}>
                    {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs hidden sm:block whitespace-nowrap ${i + 1 === step ? "text-white font-semibold" : "text-blue-300/50"}`}>{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 mb-5 ${i + 1 < step ? "bg-emerald-500" : "bg-white/15"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-black text-foreground mb-6" style={{ fontFamily: "'Barlow', sans-serif" }}>What service do you need?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {bookingServices.map(svc => (
                <button key={svc.id} onClick={() => setService(svc.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${service === svc.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${service === svc.id ? "bg-primary text-white" : "bg-muted text-primary"}`}>{svc.icon}</div>
                    {service === svc.id && <CheckCircle className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="font-bold text-foreground">{svc.name}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-muted-foreground text-xs">⏱ {svc.dur}</span>
                    <span className="text-primary font-black text-lg" style={{ fontFamily: "'Barlow', sans-serif" }}>{svc.price}</span>
                  </div>
                </button>
              ))}
            </div>
            <Btn disabled={!service} onClick={() => setStep(2)} className="w-full py-4 text-base">Continue →</Btn>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-black text-foreground mb-6" style={{ fontFamily: "'Barlow', sans-serif" }}>Choose a date</h2>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-8">
              {Array.from({ length: 14 }, (_, i) => {
                const d = new Date(2026, 5, 21 + i);
                const ds = d.toISOString().split("T")[0];
                return (
                  <button key={ds} onClick={() => setDate(ds)}
                    className={`py-3 px-1 rounded-xl border-2 text-center transition-all ${date === ds ? "border-primary bg-primary text-white" : "border-border bg-card hover:border-primary/40"}`}>
                    <div className={`text-xs font-medium ${date === ds ? "text-blue-100" : "text-muted-foreground"}`}>{d.toLocaleDateString("en", { weekday: "short" })}</div>
                    <div className="text-lg font-black">{d.getDate()}</div>
                    <div className={`text-xs ${date === ds ? "text-blue-100" : "text-muted-foreground"}`}>{d.toLocaleDateString("en", { month: "short" })}</div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <Btn variant="ghost" onClick={() => setStep(1)} className="flex-1">← Back</Btn>
              <Btn disabled={!date} onClick={() => setStep(3)} className="flex-1 py-4">Continue →</Btn>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-black text-foreground mb-2" style={{ fontFamily: "'Barlow', sans-serif" }}>Pick a time slot</h2>
            <p className="text-muted-foreground text-sm mb-6">Available slots for {date}</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
              {timeSlots.map(t => {
                const booked = bookedSlots.includes(t);
                return (
                  <button key={t} disabled={booked} onClick={() => setTime(t)}
                    className={`py-3 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                      booked ? "border-muted bg-muted text-muted-foreground cursor-not-allowed opacity-40"
                      : time === t ? "border-primary bg-primary text-white"
                      : "border-border bg-card hover:border-primary/40 text-foreground"
                    }`}>
                    {t}
                    {booked && <div className="text-xs font-normal mt-0.5 opacity-70">Taken</div>}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <Btn variant="ghost" onClick={() => setStep(2)} className="flex-1">← Back</Btn>
              <Btn disabled={!time} onClick={() => setStep(4)} className="flex-1 py-4">Continue →</Btn>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-black text-foreground mb-6" style={{ fontFamily: "'Barlow', sans-serif" }}>Where should we come?</h2>
            <div className="space-y-4 mb-8">
              <div><Label>Street Address *</Label><Input value={addr} onChange={e => setAddr(e.target.value)} placeholder="123 Main Street" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>City *</Label><Input placeholder="New York" /></div>
                <div><Label>ZIP Code *</Label><Input placeholder="10001" /></div>
              </div>
              <div><Label>Parking Notes</Label><textarea rows={3} className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-shadow" placeholder="e.g. Spot B12, call on arrival..." /></div>
              <div><Label>Phone Number</Label><Input type="tel" placeholder="+1 (555) 000-0000" /></div>
            </div>
            <div className="flex gap-3">
              <Btn variant="ghost" onClick={() => setStep(3)} className="flex-1">← Back</Btn>
              <Btn onClick={() => setStep(5)} className="flex-1 py-4">Review Booking →</Btn>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-2xl font-black text-foreground mb-6" style={{ fontFamily: "'Barlow', sans-serif" }}>Review & Confirm</h2>
            <div className="bg-card border border-border rounded-2xl p-6 mb-5">
              <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider text-muted-foreground">Booking Summary</h3>
              <div className="space-y-3.5">
                {[
                  ["Service", selectedSvc?.name],
                  ["Price", selectedSvc?.price],
                  ["Date", date],
                  ["Time", time],
                  ["Address", addr || "123 Main St, New York, NY 10001"],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                    <span className="text-muted-foreground">{l}</span>
                    <span className="font-semibold text-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-emerald-800 text-sm">WhatsApp Confirmation</div>
                <div className="text-emerald-700 text-xs mt-0.5">You'll receive booking details and technician info via WhatsApp instantly.</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Btn variant="ghost" onClick={() => setStep(4)} className="flex-1">← Back</Btn>
              <Btn onClick={() => setDone(true)} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20">Confirm Booking ✓</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── AUTH PAGE ─────────────────────────────────────────────────────────────────

function AuthPage() {
  const [view, setView] = useState<"login" | "register" | "forgot">("login");
  const [show, setShow] = useState(false);

  return (
    <div className="pt-16 min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/30">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-2xl text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>Auto<span className="text-primary">Shine</span></span>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
          {view === "login" && (
            <>
              <h2 className="text-2xl font-black text-foreground mb-1" style={{ fontFamily: "'Barlow', sans-serif" }}>Welcome back</h2>
              <p className="text-muted-foreground text-sm mb-6">Sign in to manage your bookings</p>
              <div className="space-y-4">
                <div><Label>Email</Label><Input type="email" placeholder="james@email.com" /></div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <Label>Password</Label>
                    <button onClick={() => setView("forgot")} className="text-xs text-primary font-semibold hover:text-blue-700">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <Input type={show ? "text" : "password"} placeholder="••••••••" className="pr-11" />
                    <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Btn className="w-full py-3.5">Sign In</Btn>
              </div>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative text-center"><span className="bg-card px-3 text-xs text-muted-foreground">or continue with</span></div>
              </div>
              <button className="w-full border border-border bg-muted hover:bg-accent text-foreground font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
              <p className="text-center text-sm text-muted-foreground mt-6">
                {"Don't have an account? "}
                <button onClick={() => setView("register")} className="text-primary font-bold hover:text-blue-700">Sign up</button>
              </p>
            </>
          )}

          {view === "register" && (
            <>
              <h2 className="text-2xl font-black text-foreground mb-1" style={{ fontFamily: "'Barlow', sans-serif" }}>Create account</h2>
              <p className="text-muted-foreground text-sm mb-6">Join AutoShine for exclusive offers</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>First Name</Label><Input placeholder="James" /></div>
                  <div><Label>Last Name</Label><Input placeholder="Mitchell" /></div>
                </div>
                <div><Label>Email</Label><Input type="email" placeholder="james@email.com" /></div>
                <div><Label>Phone</Label><Input type="tel" placeholder="+1 (555) 000-0000" /></div>
                <div>
                  <Label>Password</Label>
                  <div className="relative">
                    <Input type={show ? "text" : "password"} placeholder="Min. 8 characters" className="pr-11" />
                    <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Btn className="w-full py-3.5">Create Account</Btn>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <button onClick={() => setView("login")} className="text-primary font-bold hover:text-blue-700">Sign in</button>
              </p>
            </>
          )}

          {view === "forgot" && (
            <>
              <button onClick={() => setView("login")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 font-medium transition-colors">
                ← Back to login
              </button>
              <h2 className="text-2xl font-black text-foreground mb-1" style={{ fontFamily: "'Barlow', sans-serif" }}>Reset password</h2>
              <p className="text-muted-foreground text-sm mb-6">We'll send a reset link to your email address</p>
              <div className="space-y-4">
                <div><Label>Email Address</Label><Input type="email" placeholder="james@email.com" /></div>
                <Btn className="w-full py-3.5">Send Reset Link</Btn>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CUSTOMER DASHBOARD ────────────────────────────────────────────────────────

function CustomerDashboard({ setPage }: { setPage: (p: Page) => void }) {
  const [sec, setSec] = useState<"bookings" | "history" | "profile">("bookings");

  const upcoming = [
    { id: "BK001", service: "Premium Wash", date: "Jun 21, 2026", time: "10:00 AM", status: "confirmed", price: "$79", tech: "Mike Chen" },
    { id: "BK004", service: "Interior Detail", date: "Jun 22, 2026", time: "11:00 AM", status: "pending", price: "$89", tech: "TBD" },
  ];
  const history = [
    { id: "BK-H01", service: "Standard Wash", date: "Jun 10, 2026", price: "$49", rating: 5 },
    { id: "BK-H02", service: "Full Detail", date: "May 28, 2026", price: "$179", rating: 5 },
    { id: "BK-H03", service: "Battery Replace", date: "May 14, 2026", price: "$69", rating: 4 },
    { id: "BK-H04", service: "Basic Wash", date: "Apr 30, 2026", price: "$29", rating: 5 },
  ];

  const tabs = [
    { k: "bookings", label: "My Bookings", icon: <Calendar className="w-4 h-4" /> },
    { k: "history", label: "History", icon: <Clock className="w-4 h-4" /> },
    { k: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="bg-[#060E1F] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/30" style={{ fontFamily: "'Barlow', sans-serif" }}>JM</div>
            <div>
              <div className="text-white font-black text-xl" style={{ fontFamily: "'Barlow', sans-serif" }}>James Mitchell</div>
              <div className="text-blue-300/60 text-sm mt-0.5">james.m@email.com · Member since Jan 2026</div>
            </div>
          </div>
          <Btn onClick={() => setPage("booking")} className="text-sm px-5 py-2.5">+ New Booking</Btn>
        </div>
      </div>

      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[["8", "Total Bookings"], ["$48", "Total Saved"], ["840", "Loyalty Points"]].map(([v, l]) => (
              <div key={l}>
                <div className="text-2xl font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>{v}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border-b border-border sticky top-16 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex">
          {tabs.map(t => (
            <button key={t.k} onClick={() => setSec(t.k)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 transition-colors ${sec === t.k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {sec === "bookings" && (
          <div className="space-y-4">
            <h3 className="font-black text-lg text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>Upcoming Bookings</h3>
            {upcoming.map(bk => (
              <div key={bk.id} className="bg-card rounded-2xl border border-border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0"><Car className="w-6 h-6" /></div>
                  <div>
                    <div className="font-bold text-foreground">{bk.service}</div>
                    <div className="text-muted-foreground text-sm">{bk.date} at {bk.time}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">Tech: {bk.tech}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusStyle[bk.status]}`}>{bk.status}</span>
                  <span className="font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>{bk.price}</span>
                  <button className="text-sm text-destructive font-semibold hover:text-red-700 transition-colors">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {sec === "history" && (
          <div>
            <h3 className="font-black text-lg text-foreground mb-4" style={{ fontFamily: "'Barlow', sans-serif" }}>Booking History</h3>
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      {["Booking ID", "Service", "Date", "Status", "Price", "Rating"].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {history.map(item => (
                      <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{item.id}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-foreground">{item.service}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{item.date}</td>
                        <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">Completed</span></td>
                        <td className="px-6 py-4 text-sm font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>{item.price}</td>
                        <td className="px-6 py-4"><div className="flex gap-0.5">{[...Array(item.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {sec === "profile" && (
          <div className="max-w-lg">
            <h3 className="font-black text-lg text-foreground mb-6" style={{ fontFamily: "'Barlow', sans-serif" }}>Profile Settings</h3>
            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-4 pb-5 border-b border-border">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/25" style={{ fontFamily: "'Barlow', sans-serif" }}>JM</div>
                <div>
                  <button className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm">Change Photo</button>
                  <p className="text-muted-foreground text-xs mt-1.5">JPG or PNG, max 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>First Name</Label><Input defaultValue="James" /></div>
                <div><Label>Last Name</Label><Input defaultValue="Mitchell" /></div>
              </div>
              <div><Label>Email</Label><Input type="email" defaultValue="james.m@email.com" /></div>
              <div><Label>Phone</Label><Input type="tel" defaultValue="+1 (555) 234-5678" /></div>
              <div><Label>Default Address</Label><Input defaultValue="456 Park Ave, New York, NY 10022" /></div>
              <Btn className="px-8 py-3">Save Changes</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ADMIN DASHBOARD ───────────────────────────────────────────────────────────

function AdminDashboard() {
  const [sec, setSec] = useState<"overview" | "customers" | "bookings" | "services" | "technicians" | "reports">("overview");
  const [sidebar, setSidebar] = useState(true);

  const nav = [
    { k: "overview", label: "Overview", icon: <BarChart3 className="w-4.5 h-4.5" /> },
    { k: "customers", label: "Customers", icon: <Users className="w-4.5 h-4.5" /> },
    { k: "bookings", label: "Bookings", icon: <Calendar className="w-4.5 h-4.5" /> },
    { k: "services", label: "Services", icon: <Sparkles className="w-4.5 h-4.5" /> },
    { k: "technicians", label: "Technicians", icon: <Wrench className="w-4.5 h-4.5" /> },
    { k: "reports", label: "Reports", icon: <FileText className="w-4.5 h-4.5" /> },
  ] as const;

  return (
    <div className="pt-16 min-h-screen bg-[#F1F5F9] flex">
      <aside className={`fixed top-16 left-0 bottom-0 bg-[#060E1F] transition-all duration-300 z-30 flex flex-col ${sidebar ? "w-60" : "w-0 overflow-hidden"}`}>
        <div className="p-5 flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0"><Shield className="w-4 h-4 text-white" /></div>
            <span className="text-white font-bold text-sm whitespace-nowrap">Admin Portal</span>
          </div>
          <nav className="space-y-0.5">
            {nav.map(item => (
              <button key={item.k} onClick={() => setSec(item.k)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${sec === item.k ? "bg-primary text-white" : "text-blue-200/60 hover:bg-white/10 hover:text-white"}`}>
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-5 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-200/60 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut className="w-4.5 h-4.5" /> Sign Out
          </button>
        </div>
      </aside>

      <main className={`flex-1 min-w-0 transition-all duration-300 ${sidebar ? "ml-60" : "ml-0"}`}>
        <div className="bg-white border-b border-border px-6 py-3.5 flex items-center justify-between sticky top-16 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebar(!sidebar)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-black text-foreground capitalize text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>{sec}</h1>
              <p className="text-xs text-muted-foreground">AutoShine Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-xs font-black">AD</div>
          </div>
        </div>

        <div className="p-6">
          {sec === "overview" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Revenue", value: "$41,600", sub: "+12.5% vs last month", icon: <DollarSign className="w-5 h-5" />, color: "text-emerald-600 bg-emerald-50" },
                  { label: "Active Bookings", value: "24", sub: "+3 today", icon: <Calendar className="w-5 h-5" />, color: "text-blue-600 bg-blue-50" },
                  { label: "Customers", value: "512", sub: "+8 this week", icon: <Users className="w-5 h-5" />, color: "text-violet-600 bg-violet-50" },
                  { label: "Avg. Rating", value: "4.9★", sub: "Excellent", icon: <Star className="w-5 h-5" />, color: "text-amber-600 bg-amber-50" },
                ].map(s => (
                  <div key={s.label} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                    <div className={`inline-flex p-2.5 rounded-xl ${s.color} mb-3`}>{s.icon}</div>
                    <div className="text-2xl font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                    <div className="text-xs text-emerald-600 font-semibold mt-1.5">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h3 className="font-black text-foreground mb-5" style={{ fontFamily: "'Barlow', sans-serif" }}>Revenue Overview — 2026</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={revenueData} barSize={32}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} cursor={{ fill: "#F1F5F9" }} />
                    <Bar dataKey="revenue" fill="#1D4ED8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>Recent Bookings</h3>
                  <button onClick={() => setSec("bookings")} className="text-primary text-sm font-semibold hover:text-blue-700">View all →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/60">
                      <tr>
                        {["ID", "Customer", "Service", "Date", "Status", "Amount"].map(h => (
                          <th key={h} className="text-left px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {allBookings.map(bk => (
                        <tr key={bk.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{bk.id}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-foreground">{bk.customer}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{bk.service}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{bk.date}</td>
                          <td className="px-6 py-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusStyle[bk.status]}`}>{bk.status}</span></td>
                          <td className="px-6 py-4 text-sm font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>{bk.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {sec === "customers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>Customer Management</h2>
                <Btn className="px-4 py-2 text-sm"><Plus className="w-4 h-4" /> Add Customer</Btn>
              </div>
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-9 py-2.5 text-sm" placeholder="Search customers..." />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/60">
                      <tr>
                        {["Customer", "Email", "Phone", "Bookings", "Joined", "Status", ""].map(h => (
                          <th key={h} className="text-left px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {allCustomers.map(c => (
                        <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-xs font-black">{c.name.split(" ").map(n => n[0]).join("")}</div>
                              <span className="text-sm font-semibold text-foreground">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{c.email}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{c.phone}</td>
                          <td className="px-6 py-4 text-sm font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>{c.bookings}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{c.joined}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${c.status === "vip" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{c.status}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1">
                              <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-4 h-4" /></button>
                              <button className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {sec === "bookings" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>Booking Management</h2>
                <div className="flex gap-2 flex-wrap">
                  {["All", "Pending", "Confirmed", "In Progress", "Completed"].map(f => (
                    <button key={f} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${f === "All" ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{f}</button>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/60">
                      <tr>
                        {["ID", "Customer", "Service", "Date & Time", "Technician", "Status", "Amount", ""].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {allBookings.map(bk => (
                        <tr key={bk.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-4 text-xs font-mono text-muted-foreground">{bk.id}</td>
                          <td className="px-5 py-4 text-sm font-semibold text-foreground">{bk.customer}</td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">{bk.service}</td>
                          <td className="px-5 py-4">
                            <div className="text-sm font-medium text-foreground">{bk.date}</div>
                            <div className="text-xs text-muted-foreground">{bk.time}</div>
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">{bk.technician}</td>
                          <td className="px-5 py-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusStyle[bk.status]}`}>{bk.status}</span></td>
                          <td className="px-5 py-4 text-sm font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>{bk.amount}</td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1">
                              <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-4 h-4" /></button>
                              <button className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {sec === "services" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>Service Management</h2>
                <Btn className="px-4 py-2 text-sm"><Plus className="w-4 h-4" /> Add Service</Btn>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Basic Wash", cat: "Car Wash", price: "$29", dur: "30 min", cnt: 142 },
                  { name: "Standard Wash", cat: "Car Wash", price: "$49", dur: "45 min", cnt: 98 },
                  { name: "Premium Wash", cat: "Car Wash", price: "$79", dur: "60 min", cnt: 76 },
                  { name: "Interior Detail", cat: "Detailing", price: "$89", dur: "2 hrs", cnt: 54 },
                  { name: "Full Detail", cat: "Detailing", price: "$179", dur: "4 hrs", cnt: 38 },
                  { name: "Battery Replace", cat: "Battery", price: "$69+", dur: "30 min", cnt: 67 },
                ].map(s => (
                  <div key={s.name} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-bold text-foreground">{s.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{s.cat}</div>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="flex items-end justify-between mb-3">
                      <span className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>{s.price}</span>
                      <span className="text-sm text-muted-foreground">⏱ {s.dur}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{s.cnt} bookings</span>
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sec === "technicians" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>Technician Management</h2>
                <Btn className="px-4 py-2 text-sm"><Plus className="w-4 h-4" /> Add Technician</Btn>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allTechnicians.map(t => (
                  <div key={t.id} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-md shadow-primary/25" style={{ fontFamily: "'Barlow', sans-serif" }}>
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-foreground">{t.name}</div>
                      <div className="text-muted-foreground text-sm">{t.specialty}</div>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-foreground">{t.rating}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">{t.jobs} jobs</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${t.status === "available" ? "bg-emerald-100 text-emerald-700" : t.status === "on-job" ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground"}`}>{t.status}</span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"><Edit className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sec === "reports" && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>Reports & Analytics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                  <h3 className="font-bold text-foreground mb-4">Monthly Revenue</h3>
                  <ResponsiveContainer width="100%" height={190}>
                    <BarChart data={revenueData} barSize={28}>
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} cursor={{ fill: "#F1F5F9" }} />
                      <Bar dataKey="revenue" fill="#1D4ED8" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                  <h3 className="font-bold text-foreground mb-4">Booking Trends</h3>
                  <ResponsiveContainer width="100%" height={190}>
                    <LineChart data={bookingTrend}>
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="bookings" stroke="#1D4ED8" strokeWidth={2.5} dot={{ fill: "#1D4ED8", r: 4, strokeWidth: 2, stroke: "#fff" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm lg:col-span-2">
                  <h3 className="font-bold text-foreground mb-6">Service Mix Breakdown</h3>
                  <div className="grid grid-cols-3 gap-8">
                    {[
                      { service: "Car Wash", count: 316, pct: 51, color: "bg-primary" },
                      { service: "Detailing", count: 192, pct: 31, color: "bg-indigo-500" },
                      { service: "Battery", count: 112, pct: 18, color: "bg-cyan-500" },
                    ].map(item => (
                      <div key={item.service}>
                        <div className="text-4xl font-black text-foreground mb-1" style={{ fontFamily: "'Barlow', sans-serif" }}>{item.pct}%</div>
                        <div className="text-sm font-semibold text-foreground mb-0.5">{item.service}</div>
                        <div className="text-xs text-muted-foreground mb-2">{item.count} bookings</div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── WHATSAPP SCREENS ──────────────────────────────────────────────────────────

function WhatsAppScreens() {
  const [active, setActive] = useState<"confirmation" | "reminder" | "assignment">("confirmation");

  const screens = {
    confirmation: {
      title: "Booking Confirmed",
      msgs: [
        { from: "bot", text: "✅ *Booking Confirmed!*\n\nHi James! Your booking has been confirmed.\n\n🔧 *Service:* Premium Wash\n📅 *Date:* Jun 21, 2026\n⏰ *Time:* 10:00 AM\n📍 *Address:* 123 Main St, NY\n💰 *Price:* $79\n\n*Booking ID:* BK001\n\nWe'll keep you updated as your service approaches. Thank you for choosing AutoShine! 🚗✨", time: "9:42 AM" },
        { from: "user", text: "Thanks! Looking forward to it 👍", time: "9:44 AM" },
        { from: "bot", text: "Great! If you need to reschedule or have any questions, just reply here. See you soon! 😊", time: "9:44 AM" },
      ],
    },
    reminder: {
      title: "Service Reminder",
      msgs: [
        { from: "bot", text: "⏰ *Service Reminder*\n\nHi James! Your *Premium Wash* is scheduled for *tomorrow at 10:00 AM*.\n\n📍 We'll come to: 123 Main St, NY\n\nReply *CONFIRM* to confirm or *RESCHEDULE* to change your slot.", time: "Jun 20 · 5:00 PM" },
        { from: "user", text: "CONFIRM", time: "Jun 20 · 5:12 PM" },
        { from: "bot", text: "✅ *Confirmed!* See you tomorrow at 10:00 AM. Mike Chen will be your technician.", time: "Jun 20 · 5:12 PM" },
      ],
    },
    assignment: {
      title: "Technician Assigned",
      msgs: [
        { from: "bot", text: "🔧 *Technician Assigned!*\n\nHi James! Your technician has been assigned.\n\n👨‍🔧 *Technician:* Mike Chen\n⭐ *Rating:* 4.9/5 (142 jobs)\n📞 *Direct Line:* +1 (555) 111-2222\n\n*Estimated Arrival:* 9:55 AM\n\nYou can track Mike live in the app.", time: "9:30 AM" },
        { from: "bot", text: "📍 Mike is on his way — ETA 25 minutes.", time: "9:35 AM" },
        { from: "user", text: "Perfect, I'll be in the parking lot B12", time: "9:37 AM" },
        { from: "bot", text: "👍 Got it! Mike will meet you at B12. See you soon!", time: "9:37 AM" },
      ],
    },
  };

  const cur = screens[active];

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="bg-[#060E1F] py-16 text-center">
        <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-2">WhatsApp Integration</p>
        <h1 className="text-4xl font-black text-white mb-3" style={{ fontFamily: "'Barlow', sans-serif" }}>Customer Notifications</h1>
        <p className="text-blue-200/60 max-w-md mx-auto text-sm">Automated messages keep customers informed at every stage of the service journey.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex gap-3 mb-10 justify-center flex-wrap">
          {([
            { k: "confirmation", label: "Booking Confirmation" },
            { k: "reminder", label: "Service Reminder" },
            { k: "assignment", label: "Technician Assignment" },
          ] as const).map(tab => (
            <button key={tab.k} onClick={() => setActive(tab.k)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${active === tab.k ? "bg-primary text-white shadow-lg shadow-primary/25" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Phone mockup */}
          <div className="flex justify-center">
            <div className="w-72 bg-[#111827] rounded-[3rem] p-2.5 shadow-2xl">
              <div className="rounded-[2.5rem] overflow-hidden" style={{ backgroundColor: "#ECE5DD" }}>
                <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "#075E54" }}>
                  <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center flex-shrink-0"><Car className="w-5 h-5 text-white" /></div>
                  <div>
                    <div className="text-white font-bold text-sm">AutoShine</div>
                    <div className="text-emerald-200/80 text-xs">Business Account ✓</div>
                  </div>
                </div>
                <div className="p-3 space-y-2 min-h-[440px] overflow-y-auto">
                  <div className="text-center">
                    <span className="text-[10px] text-gray-500 bg-gray-200/80 rounded-full px-3 py-0.5">{cur.title}</span>
                  </div>
                  {cur.msgs.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[82%] rounded-2xl px-3 py-2 shadow-sm ${msg.from === "user" ? "rounded-tr-sm" : "rounded-tl-sm bg-white"}`}
                        style={{ backgroundColor: msg.from === "user" ? "#DCF8C6" : undefined }}>
                        <div className="text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                        <div className={`text-[10px] text-gray-400 mt-1 ${msg.from === "user" ? "text-right" : ""}`}>{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: "#F0F0F0" }}>
                  <div className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-gray-400">Type a message</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#075E54" }}>
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>Keeping Customers in the Loop</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Every booking triggers a chain of smart WhatsApp messages that keep customers informed without them having to check the app.</p>
            <div className="space-y-3">
              {[
                { icon: <CheckCircle className="w-5 h-5" />, title: "Instant Confirmation", desc: "Booking details sent the moment a customer completes checkout", color: "bg-emerald-50 text-emerald-600" },
                { icon: <Bell className="w-5 h-5" />, title: "Smart Reminders", desc: "Automated nudges 24 hours and 1 hour before service time", color: "bg-blue-50 text-blue-600" },
                { icon: <User className="w-5 h-5" />, title: "Technician Updates", desc: "Real-time assignment notice with technician profile and ETA", color: "bg-violet-50 text-violet-600" },
                { icon: <Star className="w-5 h-5" />, title: "Post-Service Review", desc: "Automated follow-up asking customers to rate their experience", color: "bg-amber-50 text-amber-600" },
              ].map(f => (
                <div key={f.title} className="bg-card rounded-xl border border-border p-4 flex gap-4 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>{f.icon}</div>
                  <div>
                    <div className="font-bold text-foreground text-sm">{f.title}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DEMO NAV PILL ─────────────────────────────────────────────────────────────

function DemoNav({ setPage }: { setPage: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  const items: { label: string; page: Page }[] = [
    { label: "Customer Dashboard", page: "dashboard" },
    { label: "Admin Dashboard", page: "admin" },
    { label: "Login / Auth", page: "auth" },
  ];
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border text-xs font-black text-muted-foreground uppercase tracking-wider">Demo Pages</div>
          {items.map(item => (
            <button key={item.page} onClick={() => { setPage(item.page); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-primary hover:text-white transition-colors">
              {item.label}
            </button>
          ))}
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        className="bg-primary text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-primary/30 hover:bg-blue-700 transition-all flex items-center gap-2">
        <Settings className="w-4 h-4" /> {open ? "Close" : "Demo Nav"}
      </button>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "services" && <ServicesPage setPage={setPage} />}
      {page === "booking" && <BookingPage setPage={setPage} />}
      {page === "auth" && <AuthPage />}
      {page === "dashboard" && <CustomerDashboard setPage={setPage} />}
      {page === "admin" && <AdminDashboard />}
      {page === "whatsapp" && <WhatsAppScreens />}
      <DemoNav setPage={setPage} />
    </div>
  );
}
