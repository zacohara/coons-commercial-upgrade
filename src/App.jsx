import { useState, useEffect, useRef } from "react";

const COONS_LOGO = "/logo-coons.png";
const COONS_LOGO_W = "/logo-coons-white.png";

const PH_MAINTENANCE = "/service-maintenance.jpg";
const PH_REPAIR = "/service-repair.jpg";
const PH_COATINGS = "/service-coatings.jpg";
const PH_REPLACEMENT = "/service-replacement.jpg";
const PH_INSPECTION = "/service-inspection.jpg";
const PH_EMERGENCY = "/service-emergency.jpg";
const HERO_BG = "/hero-bg.jpg";
const PH_BEFOREAFTER = "/before-after.jpg";
const MAP_IMG = "/houston-map.jpg";
const C = { black: "#0A0A0A", red: "#E62236", slate: "#4B4B4B", light: "#F3F3F3", white: "#FFFFFF", card: "#111111" };
const F = "'Poppins',sans-serif";
const PH_ROOF_PROJECT = "/roof-project.jpg";
const PH_FAMILY = "/family.jpg";
const PH_WADE = "/wade-owner.jpg";
const COONS_MARK = "/coons-mark.svg";
const COONS_MARK_W = "/coons-mark-white.svg";

// GoHighLevel Inbound Webhook URL (Workflow → "Inbound Webhook" trigger).
// Workflow: "Website Lead — Coons Roofing" (location zemOrVB3bS5ADz7ow32o).
/* Every lead used to arrive in GHL with an identical hardcoded source, so no
   page could ever be credited with a job. This captures where it came from. */
/* GA4 was firing a pageview and nothing else, so analytics could show traffic
   but never a conversion. These are the events that matter. */
function track(name, params) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try { window.gtag("event", name, params || {}); } catch (e) { /* never break the page for analytics */ }
}

function leadContext() {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const utm = {};
  ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"].forEach(k => {
    const v = q.get(k); if (v) utm[k] = v;
  });
  return {
    page_path: window.location.pathname,
    page_url: window.location.href,
    page_title: typeof document !== "undefined" ? document.title : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    ...utm,
  };
}

const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/zemOrVB3bS5ADz7ow32o/webhook-trigger/7d1b7f59-bedc-49ae-9f1f-81824b0bc818";

const LOGOS = [{n:"Versico",s:"/cert-versico.png"},{n:"FiberTite",s:"/cert-fibertite.png"},{n:"Duro-Last",s:"/cert-duro-last.png"},{n:"Karnak",s:"/cert-karnak.png"},{n:"Everest",s:"/cert-everest.png"},{n:"IPC",s:"/cert-ipc.png"},{n:"Western Colloid",s:"/cert-western-colloid.png"},{n:"Elevate",s:"/cert-elevate.png"},{n:"GAF",s:"/cert-gaf.png"}];

function useVis(t = 0.12) {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = r.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setV(true); return; }
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0, rootMargin: "320px 0px 320px 0px" });
    o.observe(el);
    return () => o.disconnect();
  }, [t]);
  return [r, v];
}

function Fade({ children, delay = 0, className = "", now = false }) {
  const [r, v] = useVis();
  const on = now || v;
  return (
    <div ref={r} className={("fade " + className).trim()} style={{
      opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(14px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>{children}</div>
  );
}

/* ── Router (real paths, SSR-safe, full-navigation) ── */
function routeFromPath() {
  if (typeof window === "undefined") return "home";
  const p = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return p || "home";
}
function useRouter(injected) {
  return injected != null ? injected : routeFromPath();
}
function hrefFor(to) {
  return to === "home" ? "/" : "/" + to + "/";
}
function Link({ to, children, style, onClick, ...props }) {
  return <a href={hrefFor(to)} style={{ textDecoration: "none", ...style }} onClick={onClick} {...props}>{children}</a>;
}

function Nav() {
  const [s, setS] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setS(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    const esc = (e) => { if (e.key === "Escape" && open) setOpen(false); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);
  const linkStyle = { color: "#ccc", fontFamily: F, fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: 1.5, textTransform: "uppercase", padding: "12px 0", display: "block", borderBottom: "1px solid rgba(255,255,255,0.06)" };
  const subStyle = { ...linkStyle, fontSize: 11, letterSpacing: 1, paddingLeft: 16, color: "#999" };
  const focusRing = { outline: "2px solid " + C.red, outlineOffset: 2 };
  return (
    <>
    <a href="#main-content" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden", zIndex: 999 }} onFocus={e => Object.assign(e.target.style, { position: "fixed", left: "16px", top: "16px", width: "auto", height: "auto", overflow: "visible", background: C.red, color: "#fff", padding: "12px 24px", fontFamily: F, fontSize: 14, fontWeight: 700 })} onBlur={e => Object.assign(e.target.style, { position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" })}>Skip to content</a>
    <header>
    <nav role="navigation" aria-label="Main navigation" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: s ? "rgba(10,10,10,0.97)" : "transparent", backdropFilter: s ? "blur(10px)" : "none", borderBottom: s ? "1px solid rgba(230,34,54,0.25)" : "none", transition: "all 0.4s", padding: "0 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <Link to="home" style={{ display: "flex", alignItems: "center" }}><img src={COONS_LOGO_W} alt="Coons Roofing" style={{ height: 30 }} /></Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="tel:+17133671495" style={{ background: C.red, color: "#fff", padding: "10px 16px", fontFamily: F, fontSize: 11, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, minHeight: 40 }} onFocus={e=>Object.assign(e.target.style,focusRing)} onBlur={e=>{e.target.style.outline="none"}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            Call
          </a>
          <button onClick={()=>setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", flexDirection: "column", gap: 5, width: 34, height: 34, alignItems: "center", justifyContent: "center" }} onFocus={e=>Object.assign(e.target.style,focusRing)} onBlur={e=>{e.target.style.outline="none"}}>
            <span style={{ width: 22, height: 2, background: "#fff", transition: "all 0.3s", transformOrigin: "center", transform: open ? "rotate(45deg) translateY(3.5px)" : "none" }}/>
            <span style={{ width: 22, height: 2, background: "#fff", transition: "all 0.3s", opacity: open ? 0 : 1 }}/>
            <span style={{ width: 22, height: 2, background: "#fff", transition: "all 0.3s", transformOrigin: "center", transform: open ? "rotate(-45deg) translateY(-3.5px)" : "none" }}/>
          </button>
        </div>
      </div>
    </nav>
    </header>
    {open && <div onClick={()=>setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 98, background: "transparent" }} />}
      <div role="menu" aria-hidden={!open} style={{ display: open ? "block" : "none", position: "fixed", top: 60, left: 0, right: 0, zIndex: 99, background: "rgba(10,10,10,0.98)", backdropFilter: "blur(12px)", padding: "8px 24px 16px", maxHeight: "calc(100vh - 60px)", overflowY: "auto" }}>
        <div style={{ ...linkStyle, color: C.red, fontSize: 10, fontWeight: 800, letterSpacing: 2, borderBottom: "none", padding: "12px 0 4px" }}>Services</div>
        {[{t:"Roof Repair",p:"repair"},{t:"Maintenance",p:"maintenance"},{t:"Coatings & Restoration",p:"coatings"},{t:"Metal Roof Coating",p:"metal-roof-coating-houston"},{t:"Replacement",p:"replacement"},{t:"Inspections",p:"inspections"},{t:"Emergency Response",p:"emergency"}].map(s=>(
          <Link key={s.p} to={s.p} role="menuitem" style={subStyle} onClick={()=>setOpen(false)}>{s.t}</Link>
        ))}
        <div style={{ ...linkStyle, color: C.red, fontSize: 10, fontWeight: 800, letterSpacing: 2, borderBottom: "none", padding: "12px 0 4px" }}>Building Types</div>
        <Link to="warehouse-roofing-houston" role="menuitem" style={subStyle} onClick={()=>setOpen(false)}>Warehouse & Industrial</Link>
        <Link to="retail-roofing-houston" role="menuitem" style={subStyle} onClick={()=>setOpen(false)}>Retail & Strip Centers</Link>
        <Link to="multifamily-roofing-houston" role="menuitem" style={subStyle} onClick={()=>setOpen(false)}>Multifamily & HOA</Link>
        <Link to="church-roofing-houston" role="menuitem" style={subStyle} onClick={()=>setOpen(false)}>Churches</Link>
        <Link to="medical-office-roofing-houston" role="menuitem" style={subStyle} onClick={()=>setOpen(false)}>Medical Offices</Link>
        <Link to="about" role="menuitem" style={linkStyle} onClick={()=>setOpen(false)}>About</Link>
        <Link to="blog" role="menuitem" style={linkStyle} onClick={()=>setOpen(false)}>Blog</Link>
        <Link to="projects" role="menuitem" style={linkStyle} onClick={()=>setOpen(false)}>Projects</Link>
        <div style={{ ...linkStyle, color: C.red, fontSize: 10, fontWeight: 800, letterSpacing: 2, borderBottom: "none", padding: "12px 0 4px" }}>Service Areas</div>
        {CITIES.map(c=>(
          <Link key={c.slug} to={c.slug} role="menuitem" style={subStyle} onClick={()=>setOpen(false)}>{c.name}</Link>
        ))}
        <Link to="contact" role="menuitem" style={linkStyle} onClick={()=>setOpen(false)}>Contact</Link>
        <a role="menuitem" href="tel:+17133671495" style={{ ...linkStyle, color: C.red, borderBottom: "none", fontWeight: 700 }}>713-367-1495</a>
      </div>
    </>
  );
}

function Hero() {
  return (
    <section style={{ minHeight: "100vh", background: `linear-gradient(160deg, rgba(0,0,0,0.7) 0%, rgba(10,2,4,0.8) 40%, rgba(0,0,0,0.85) 100%), url(${HERO_BG}) center/cover`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "100px 24px 60px", textAlign: "center" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.03, background: `repeating-linear-gradient(45deg, ${C.red} 0px, ${C.red} 1px, transparent 1px, transparent 50px)` }} />
      <div style={{ position: "absolute", bottom: "-20%", left: "50%", transform: "translateX(-50%)", width: "140%", height: "60%", background: `radial-gradient(ellipse, rgba(230,34,54,0.06) 0%, transparent 70%)` }} />
      <div style={{ maxWidth: 700, margin: "0 auto", width: "100%", position: "relative" }}>

        <Fade now delay={0.1}>
          <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: "clamp(32px,8vw,62px)", color: "#fff", lineHeight: 1.05, marginBottom: 24, textTransform: "uppercase", textShadow: "0 4px 12px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08)" }}>
            Houston Commercial Roofing That <span style={{ color: C.red, textShadow: "0 4px 16px rgba(230,34,54,0.35), 0 2px 0 rgba(140,10,20,0.5)" }}>Fixes the Actual Problem</span>
          </h1>
        </Fade>
        <Fade now delay={0.2}>
          <p style={{ fontFamily: F, fontSize: "clamp(14px,3.5vw,17px)", color: "rgba(255,255,255,0.78)", fontWeight: 400, marginBottom: 36, maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Repair, maintain, restore. We recommend replacement only when the numbers support it, and we show you the math.
          </p>
        </Fade>
        <Fade now delay={0.3}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 460, margin: "0 auto", alignItems: "stretch" }}>
            <a href="#contact" onClick={(e)=>{e.preventDefault();document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}} style={{ background: C.red, color: "#fff", padding: "20px 28px", fontFamily: F, fontSize: "clamp(15px,4vw,19px)", fontWeight: 800, textDecoration: "none", letterSpacing: 0.5, textTransform: "uppercase", textAlign: "center", boxShadow: "0 6px 28px rgba(230,34,54,0.45)", borderRadius: 4, lineHeight: 1.3 }}>Schedule Your Complimentary Roof Assessment</a>
            <a href="tel:+17133671495" style={{ background: "transparent", color: "#fff", padding: "12px 28px", fontFamily: F, textDecoration: "none", border: "2px solid rgba(255,255,255,0.3)", borderRadius: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>Call</span>
              <span style={{ fontSize: "clamp(17px,4.5vw,21px)", fontWeight: 800, letterSpacing: 0.5 }}>713-367-1495</span>
            </a>
          </div>
        </Fade>
        <Fade now delay={0.4}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 28 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.6)" }} />
            <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: 0.3 }}>Same-day emergency response across Houston</span>
          </div>
        </Fade>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "Fully Insured" },
    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, text: "GL + Workers Comp" },
    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>, text: "Manufacturer Warranties" },
    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>, text: "Owner on Every Job" },
  ];
  return (
    <section style={{ background: C.black, padding: "16px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "10px 28px" }}>
        {items.map(it => (
          <div key={it.text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {it.icon}
            <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: 0.5 }}>{it.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function LogoBar() {
  const id = useRef("marquee-" + Math.random().toString(36).slice(2, 8));
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `@keyframes ${id.current}{0%{transform:translateX(0)}100%{transform:translateX(calc(-100% / 3))}}`;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);
  const tripled = [...LOGOS, ...LOGOS, ...LOGOS];
  return (
    <section style={{ background: "#fff", padding: "28px 0", borderBottom: "1px solid #eee", overflow: "hidden" }}>
      <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: "#6b6b6b", letterSpacing: 2, textTransform: "uppercase", textAlign: "center", marginBottom: 18 }}>Certified By</p>
      <div style={{ overflow: "hidden", width: "100%", maskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 72, width: "max-content", animation: `${id.current} 40s linear infinite` }}>
          {tripled.map((l, i) => <img key={l.n + i} src={l.s} alt={l.n} style={{ height: 38, opacity: 0.65, filter: "grayscale(1)", flexShrink: 0 }} />)}
        </div>
      </div>
    </section>
  );
}

function Difference() {
  const iconStyle = { width: 32, height: 32, stroke: C.red, strokeWidth: 1.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const items = [
    { icon: <svg viewBox="0 0 24 24" style={iconStyle}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>, title: "Value-Engineered Repairs", desc: "We fix the actual failure — flashing, seams, drainage — not just the symptom, so you're not paying for the same leak twice." },
    { icon: <svg viewBox="0 0 24 24" style={iconStyle}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, title: "Photo-Documented Reports", desc: "Clear photo reports you can forward straight to your boss or ownership group. No extra work on your end." },
    { icon: <svg viewBox="0 0 24 24" style={iconStyle}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Proactive Maintenance", desc: "Regular checkups and clear plans so you're never caught off guard." },
    { icon: <svg viewBox="0 0 24 24" style={iconStyle}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>, title: "No-Surprise Communication", desc: "You'll always know where things stand, what it costs, and when we'll be done." },
    { icon: <svg viewBox="0 0 24 24" style={iconStyle}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, title: "Professional Crews", desc: "Our guys show up professional, keep your site clean, and respect your tenants." },
  ];
  return (
    <section style={{ background: C.light, padding: "80px clamp(16px,4vw,48px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Fade>
          <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, textAlign: "center" }}>The Coons Roofing Difference</p>
          <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: "clamp(24px,3.5vw,38px)", color: C.black, lineHeight: 1.1, marginBottom: 48, textAlign: "center" }}>
            Repair. Maintain. Restore.<br/><span style={{ color: C.red }}>Replace Only When Necessary.</span>
          </h2>
        </Fade>
        <Fade>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, maxWidth: 940, margin: "0 auto" }}>
            {items.map((it) => (
              <div key={it.title} style={{ flex: "1 1 240px", maxWidth: 290, background: "#fff", padding: 24, textAlign: "center", borderTop: `3px solid ${C.red}`, transition: "transform 0.3s" }} onMouseOver={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{ marginBottom: 12 }}>{it.icon}</div>
                <div style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: C.black, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.3 }}>{it.title}</div>
                <div style={{ fontFamily: F, fontSize: 13, color: C.slate, lineHeight: 1.5 }}>{it.desc}</div>
              </div>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

function ServiceAreas() {
  return (
    <section style={{background:"#fff",padding:"64px 16px"}}>
      <div style={{maxWidth:1200,margin:"0 auto",textAlign:"center"}}>
        <Fade><p style={{fontFamily:F,fontSize:12,fontWeight:700,color:C.red,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Service Areas</p></Fade>
        <Fade delay={0.05}><h2 style={{fontFamily:F,fontWeight:900,fontSize:"clamp(24px,6vw,40px)",color:C.black,lineHeight:1.1,marginBottom:24}}>Serving the Greater <span style={{color:C.red}}>Houston Area</span></h2></Fade>
        <Fade delay={0.1}><p style={{fontFamily:F,fontSize:14,color:C.slate,lineHeight:1.6,maxWidth:480,margin:"0 auto 28px"}}>
          Harris County, Montgomery County, Galveston County, and surrounding communities.
        </p></Fade>
        <Fade delay={0.15}>
        <div style={{maxWidth:640,margin:"0 auto",borderRadius:8,overflow:"hidden",boxShadow:"0 4px 24px rgba(0,0,0,0.08)",position:"relative"}}>
          <img src={MAP_IMG} alt="Houston metro service area map" width="520" height="508" loading="lazy" style={{width:"100%",height:"auto",display:"block"}} />
          <svg viewBox="0 0 520 494" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none"}}>
            <defs>
              <radialGradient id="sr" cx="50%" cy="50%"><stop offset="0%" stopColor={C.red} stopOpacity="0.18"/><stop offset="50%" stopColor={C.red} stopOpacity="0.08"/><stop offset="100%" stopColor={C.red} stopOpacity="0"/></radialGradient>
            </defs>
            {/* Red target overlay centered on Houston */}
            <circle cx="260" cy="247" r="200" fill="url(#sr)"/>
            <circle cx="260" cy="247" r="180" fill="none" stroke={C.red} strokeWidth="2" strokeDasharray="8,4" opacity="0.4"/>
            <circle cx="260" cy="247" r="120" fill="none" stroke={C.red} strokeWidth="1.5" strokeDasharray="6,4" opacity="0.3"/>
            <circle cx="260" cy="247" r="60" fill="none" stroke={C.red} strokeWidth="1" strokeDasharray="4,4" opacity="0.25"/>
            {/* Crosshair lines */}
            <line x1="260" y1="47" x2="260" y2="447" stroke={C.red} strokeWidth="0.8" opacity="0.15"/>
            <line x1="60" y1="247" x2="460" y2="247" stroke={C.red} strokeWidth="0.8" opacity="0.15"/>
            {/* Center pin */}
            <circle cx="260" cy="247" r="8" fill={C.red} opacity="0.9"/>
            <circle cx="260" cy="247" r="3" fill="#fff"/>
          </svg>
        </div>
        </Fade>
        <Fade delay={0.2}><div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap",marginTop:20}}>
          {["Harris County","Montgomery County","Galveston County","Tomball","Katy","The Woodlands","Pearland","League City"].map(a=>(
            <span key={a} style={{background:C.light,padding:"5px 12px",fontFamily:F,fontSize:10,fontWeight:600,color:C.slate}}>{a}</span>
          ))}
        </div></Fade>
      </div>
    </section>
  );
}

function Services() {
  const svcs = [
    {t:"Proactive Inspections",d:"Catch small issues before they become leaks, tenant complaints, or costly emergencies.",p:PH_INSPECTION,slug:"inspections"},
    {t:"Preventative Maintenance",d:"Routine roof care with photo reports, action plans, and clear documentation.",p:PH_MAINTENANCE,slug:"maintenance"},
    {t:"Roof Repair",d:"Fast diagnosis, clear proposals, and no surprise work before approval.",p:PH_REPAIR,slug:"repair"},
    {t:"Roof Replacement",d:"A guided replacement process with communication from start to finish.",p:PH_REPLACEMENT,slug:"replacement"},
    {t:"Storm & Emergency Response",d:"Rapid leak response across the Houston metro when water is coming in.",p:PH_EMERGENCY,slug:"emergency"},
    {t:"Coating & Restoration",d:"Extend roof life and delay major replacement costs with minimal disruption.",p:PH_COATINGS,slug:"coatings"},
  ];
  const scrollToContact = (e)=>{e.preventDefault();document.getElementById("contact")?.scrollIntoView({behavior:"smooth"});};
  return (
    <section id="services" style={{background:C.light,padding:"64px 16px",scrollMarginTop:80}}>
      <div style={{maxWidth:1000,margin:"0 auto",textAlign:"center"}}>
        <Fade><h2 style={{fontFamily:F,fontWeight:900,fontSize:"clamp(24px,6vw,40px)",color:C.black,lineHeight:1.15,marginBottom:16,textTransform:"uppercase"}}>
          Commercial Roofing Services Built Around <span style={{color:C.red}}>the Building Owner</span>
        </h2></Fade>
        <Fade delay={0.05}><p style={{fontFamily:F,fontSize:"clamp(14px,3.5vw,17px)",color:C.slate,lineHeight:1.7,maxWidth:640,margin:"0 auto 24px"}}>
          Keep your tenants dry, your budget predictable, and ownership confident — with documented inspections, proactive maintenance, and fast leak response.
        </p></Fade>
        <Fade delay={0.1}><div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",maxWidth:520,margin:"0 auto 40px"}}>
          <a href="#contact" onClick={scrollToContact} style={{background:C.red,color:"#fff",padding:"15px 28px",fontFamily:F,fontSize:13,fontWeight:700,textDecoration:"none",letterSpacing:1,textTransform:"uppercase",boxShadow:"0 4px 20px rgba(230,34,54,0.3)",flex:"1 1 200px",textAlign:"center"}}>Schedule Roof Assessment</a>
          <a href="tel:+17133671495" style={{background:"transparent",color:C.black,padding:"15px 28px",fontFamily:F,fontSize:13,fontWeight:700,textDecoration:"none",letterSpacing:1,textTransform:"uppercase",border:"2px solid rgba(10,10,10,0.2)",flex:"1 1 200px",textAlign:"center"}}>Call 713-367-1495</a>
        </div></Fade>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
          {svcs.map((s,i)=>(
            <Fade key={s.t} delay={i*0.06}>
              <Link to={s.slug} style={{
                background:"linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.12) 45%,rgba(0,0,0,0.88) 100%),url("+s.p+") center/cover",
                padding:"150px 22px 24px",borderRadius:8,textAlign:"left",minHeight:280,display:"flex",flexDirection:"column",justifyContent:"flex-end",
                transition:"transform 0.3s, box-shadow 0.3s",cursor:"pointer",textDecoration:"none",height:"100%",boxSizing:"border-box",boxShadow:"0 4px 16px rgba(0,0,0,0.12)"
              }} onMouseOver={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(0,0,0,0.22)";}} onMouseOut={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.12)";}}>
                <div style={{fontFamily:F,fontSize:19,fontWeight:800,color:"#fff",marginBottom:8,textShadow:"0 2px 6px rgba(0,0,0,0.75)"}}>{s.t}</div>
                <div style={{fontFamily:F,fontSize:13,color:"rgba(255,255,255,0.92)",lineHeight:1.6,textShadow:"0 1px 4px rgba(0,0,0,0.65)",marginBottom:12}}>{s.d}</div>
                <div style={{width:40,height:3,background:C.red,borderRadius:2}} />
              </Link>
            </Fade>
          ))}
        </div>
        <Fade delay={0.3}><div style={{background:"#fff",borderRadius:10,padding:"32px 24px",boxShadow:"0 6px 24px rgba(0,0,0,0.08)",maxWidth:640,margin:"40px auto 0"}}>
          <h3 style={{fontFamily:F,fontSize:"clamp(20px,4.5vw,26px)",fontWeight:900,color:C.black,marginBottom:8}}>Not sure what your roof needs?</h3>
          <p style={{fontFamily:F,fontSize:14,color:C.slate,lineHeight:1.6,marginBottom:20}}>Get a documented roof assessment and clear action plan.</p>
          <a href="#contact" onClick={scrollToContact} style={{background:C.red,color:"#fff",padding:"15px 36px",fontFamily:F,fontSize:13,fontWeight:700,textDecoration:"none",letterSpacing:1,textTransform:"uppercase",display:"inline-block",boxShadow:"0 4px 20px rgba(230,34,54,0.3)"}}>Schedule Assessment</a>
        </div></Fade>
      </div>
    </section>
  );
}
function Process() {
  const pIconStyle = { width: 36, height: 36, stroke: C.red, strokeWidth: 1.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const steps = [
    { icon: <svg viewBox="0 0 24 24" style={pIconStyle}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, title: "Always Know What's Happening", desc: "Real-time updates, not vague check-ins. You'll never wonder where things stand." },
    { icon: <svg viewBox="0 0 24 24" style={pIconStyle}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>, title: "Proof in Your Inbox", desc: "Every repair comes with after-photos and a summary you can forward straight to ownership." },
    { icon: <svg viewBox="0 0 24 24" style={pIconStyle}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>, title: "Zero Surprises", desc: "Clear scope, clear pricing, clear timeline. Built for how property managers actually work." },
    { icon: <svg viewBox="0 0 24 24" style={pIconStyle}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title: "Fast, Human Response", desc: "Need an update now? Call or text. No chasing, no waiting, no voicemail loops." },
  ];
  return (
    <section style={{ background: "#fff", padding: "64px 16px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Fade>
          <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: "clamp(24px,6vw,38px)", color: C.black, lineHeight: 1.1, marginBottom: 10, textAlign: "center" }}>
            How We Work With <span style={{ color: C.red }}>Building Owners and PMs</span>
          </h2>
          <p style={{ fontFamily: F, fontSize: 15, color: C.slate, textAlign: "center", maxWidth: 500, margin: "0 auto 24px", lineHeight: 1.6 }}>Managing property is firefighting. Let us handle the roofing so you can focus on everything else.</p>
        </Fade>
        <Fade>
          <div style={{ maxWidth: 740, margin: "0 auto 28px", borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", position: "relative", cursor: "pointer" }}
            onClick={(e) => {
              const container = e.currentTarget;
              container.innerHTML = '<div style="position:relative;padding-bottom:56.25%;height:0"><iframe src="https://player.vimeo.com/video/1008586531?h=15d792bdc8&autoplay=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen title="Coons Roofing"></iframe></div>';
            }}>
            <div style={{ paddingBottom: "56.25%", background: `linear-gradient(135deg, ${C.black} 0%, #1a1a1a 100%)`, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(230,34,54,0.4)", transition: "transform 0.3s" }}
                  onMouseOver={e=>e.currentTarget.style.transform="scale(1.1)"}
                  onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><polygon points="8,5 20,12 8,19"/></svg>
                </div>
                <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: 0.5 }}>Watch How We Work</span>
              </div>
            </div>
          </div>
        </Fade>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {steps.map((st, i) => (
            <Fade key={st.title} delay={i * 0.08}>
              <div style={{ background: C.light, padding: 28, textAlign: "center", borderBottom: `3px solid ${C.red}`, height: "100%" }}>
                <div style={{ marginBottom: 16 }}>{st.icon}</div>
                <div style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: C.black, marginBottom: 8 }}>{st.title}</div>
                <div style={{ fontFamily: F, fontSize: 13, color: C.slate, lineHeight: 1.6 }}>{st.desc}</div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" style={{ background: C.black, padding: "64px 16px", scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <Fade>
          <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>About Coons Roofing</p>
          <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: "clamp(28px,7vw,42px)", color: "#fff", lineHeight: 1.1, marginBottom: 24, textShadow: "0 3px 10px rgba(0,0,0,0.4)" }}>Owner on <span style={{ color: C.red, textShadow: "0 3px 12px rgba(230,34,54,0.3)" }}>Every Project</span></h2>
        </Fade>
        <Fade delay={0.1}>
          <div style={{ marginBottom: 24, borderRadius: 8, overflow: "hidden", maxWidth: 280, margin: "0 auto 24px" }}><img src={PH_FAMILY} alt="Wade Coons and family" width="700" height="1050" loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} /></div>
          <p style={{ fontFamily: F, fontSize: 15, color: "rgba(255,255,255,0.86)", lineHeight: 1.8, marginBottom: 12 }}>Wade Coons learned the construction business from his dad and turned that foundation into a commercial roofing company that property managers and building owners across Houston trust with the roofs over their tenants, their budgets, and their reputation.</p>
          <p style={{ fontFamily: F, fontSize: 15, color: "rgba(255,255,255,0.86)", lineHeight: 1.8, marginBottom: 24 }}>You deal with the decision-maker, not a salesperson. That's how we maintain the documentation standards, communication, and quality that commercial clients require.</p>
          <div style={{ marginBottom: 8, borderRadius: 8, overflow: "hidden", maxWidth: 320, margin: "0 auto 8px" }}><img src={PH_WADE} alt="Wade Coons, owner of Coons Roofing, on a commercial roof in Houston" width="760" height="1000" loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} /></div>
          <p style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.72)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 32 }}>Wade Coons — Owner</p>
        </Fade>
        <Fade delay={0.15}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
            {[["9","Manufacturer Certs"],["100s","Projects Done"],["3+","Years in Business"],["5.0★","Google Rating"]].map(([n,l])=>(
              <div key={n} style={{ background: C.card, padding: "28px 14px", borderRadius: 6 }}>
                <div style={{ fontFamily: F, fontSize: "clamp(40px,9vw,52px)", fontWeight: 900, color: C.red, lineHeight: 1, textShadow: "0 2px 8px rgba(230,34,54,0.25)" }}>{n}</div>
                <div style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.78)", marginTop: 10, letterSpacing: 0.3 }}>{l}</div>
              </div>
            ))}
          </div>
        </Fade>
        <Fade delay={0.2}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
            {["TPO","PVC","Metal","Coatings"].map(s => <span key={s} style={{ background: "rgba(230,34,54,0.12)", border: "1px solid rgba(230,34,54,0.3)", padding: "9px 22px", fontFamily: F, fontSize: 14, fontWeight: 700, color: C.red, letterSpacing: 1, borderRadius: 4 }}>{s}</span>)}
          </div>
          <p style={{ fontFamily: F, fontSize: 15, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, maxWidth: 620, margin: "0 auto" }}>Certified installer for Versico, FiberTite, Duro-Last, Karnak, Everest Systems, IPC, Western Colloid, Elevate, and GAF. Fully insured with GL and Workers Comp coverage.</p>
        </Fade>
      </div>
    </section>
  );
}


function BeforeAfter() {
  return (
    <section style={{ background: C.light, padding: "64px 16px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <Fade>
          <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Real Results</p>
          <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: "clamp(24px,6vw,38px)", color: C.black, lineHeight: 1.1, marginBottom: 24 }}>See the <span style={{ color: C.red }}>Difference</span></h2>
        </Fade>
        <Fade delay={0.1}>
          <div style={{ borderRadius: 6, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
            <img src={PH_BEFOREAFTER} alt="Before and after roof drain cleaning and coating" width="1000" height="1000" loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
          <p style={{ fontFamily: F, fontSize: 13, color: C.slate, marginTop: 16, lineHeight: 1.6 }}>Roof drain cleaning and coating at a Houston retail center. Debris removed, drains cleared, penetrations sealed.</p>
        </Fade>
      </div>
    </section>
  );
}
function Reviews() {
  const revs = [
    { name: "Zac O.", text: "Wade is a true professional. Saved us a ton of money by repairing what was wrong instead of forcing us into a full re-roof like other providers were suggesting. If you're in the greater Houston area, it's nice to work direct with owner nowadays!" },
    { name: "Melanie C.", text: "FINALLY! Fixed a leak I'd been trying to sort out for several months with other providers who didn't fix the problem, and did it quickly. Great communication too. Highly recommend." },
    { name: "Reagan S.", text: "Coons Roofing is very good. Excellent documentation and follow through regarding roof repairs and roof replacements. Projects big and small." },
    { name: "Jennifer A.", text: "We recently replaced our roof with Coons Roofing and couldn't be happier with the result. Wade was great to work with, very professional, and thorough in his communications. The work itself is top notch. The process of the roof replacement was very efficient and quality was great. I would highly recommend Coons Roofing!" },
    { name: "Mason A.", text: "The owner himself came to our house to inspect our roof after a tornado, and we were so impressed right away! He was punctual, professional, knowledgeable, and not to mention a friendly guy! His team ended up having to replace our whole roof, and they were very considerate about their equipment placement and clean up. Communication was top notch and it was very clear integrity was paramount for the owner. Coons Roofing provided us with quality work and great customer service!" },
    { name: "Sam B.", text: "The owner came out the morning after the bad wind storm that blew through Houston to personally inspect our roof after a few large branches landed on it. He identified a few torn up shingles and a hole in our roof that he was able to tarp to mitigate any future water damage inside until his team could get out there to fix the issue. His team came out the next morning and had the roof fixed, looking brand new! I really appreciate the communication and work that Wade and his team did for us. I can't recommend them enough for your roofing needs!" },
  ];
  return (
    <section style={{ background: "#fff", padding: "80px clamp(16px,4vw,48px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Fade>
          <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: "clamp(24px,6vw,38px)", color: C.black, lineHeight: 1.1, marginBottom: 12, textAlign: "center" }}>See What <span style={{ color: C.red }}>Our Clients</span> Say</h2>
        </Fade>
        <Fade delay={0.05}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <a href="https://g.page/r/CUZitDSZo8KcEBM" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.light, padding: "10px 16px", borderRadius: 40, textDecoration: "none", flexWrap: "wrap", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 48 48"><path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" fill="#4285F4"/><path d="M3 12.4l7.1 5.2C12.2 13.3 17.6 10 24 10c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 3.1 29.6 1 24 1 14.8 1 6.9 5.8 3 12.4z" fill="#EA4335"/><path d="M24 47c5.4 0 10.4-1.8 14.3-5l-6.6-5.6c-2 1.5-4.6 2.4-7.7 2.4-5.9 0-10.9-4-12.7-9.4L3.5 34.5C7.4 41.7 15.1 47 24 47z" fill="#34A853"/><path d="M46 24c0-1.3-.2-2.7-.5-4H24v8.5h11.8c-.9 3-2.8 5.4-5.2 7.1l6.6 5.6C41 38 46 31.8 46 24z" fill="#FBBC05"/></svg>
              <span style={{ fontFamily: F, fontSize: 18, fontWeight: 900, color: "#333" }}>5.0</span>
              <span style={{ display: "flex", gap: 1 }}>{[1,2,3,4,5].map(s=><span key={s} style={{ color: "#FFB800", fontSize: 14 }}>★</span>)}</span>
              <span style={{ fontFamily: F, fontSize: 12, color: "#888" }}>from 21 reviews on Google</span>
            </a>
          </div>
        </Fade>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, maxWidth: 820, margin: "0 auto" }}>
          {revs.map((r, i) => (
            <Fade key={r.name} delay={i * 0.08}>
              <div style={{ background: C.light, padding: 28, borderTop: `3px solid ${C.red}`, height: "100%", textAlign: "left" }}>
                <svg width="56" height="18" viewBox="0 0 272 92" style={{margin:"0 0 12px",display:"block"}}><path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/><path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/><path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/><path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/><path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.96 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/><path d="M35.29 41.19V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49-.01z" fill="#4285F4"/></svg>
                <div style={{ display: "flex", gap: 3, marginBottom: 14, justifyContent: "flex-start" }}>{[1,2,3,4,5].map(s=><span key={s} style={{ color: "#FFB800", fontSize: 16 }}>★</span>)}</div>
                <p style={{ fontFamily: F, fontSize: 14, color: C.slate, lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>"{r.text}"</p>
                <div style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: C.black }}>{r.name}</div>
              </div>
            </Fade>
          ))}
        </div>
        <Fade delay={0.3}>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <a href="https://g.page/r/CUZitDSZo8KcEBM/review" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.light, padding: "12px 24px", fontFamily: F, fontSize: 13, fontWeight: 700, color: C.black, textDecoration: "none", transition: "background 0.3s" }} onMouseOver={e=>e.currentTarget.style.background="#e8e8e8"} onMouseOut={e=>e.currentTarget.style.background=C.light}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Had a good experience? Leave us a review on Google
            </a>
            <p style={{ fontFamily: F, fontSize: 13, color: C.slate, marginTop: 10 }}>...and many more on Google</p>
          </div>
        </Fade>
      </div>
    </section>
  );
}

const HOME_FAQS = [
    { q: "How quickly can you respond to a roof leak?", a: "We respond to emergency leak calls within 24 hours across the Houston metro. For active leaks during business hours, we can often have someone on-site the same day. We'll get a temporary fix in place immediately and follow up with a permanent repair." },
    { q: "Do you provide photo reports after inspections?", a: "Every inspection includes a detailed photo report documenting current conditions, problem areas, and recommended next steps. Reports are formatted so you can forward them directly to ownership, insurance, or your maintenance files with no extra work on your end." },
    { q: "How do I know if my roof needs repair or full replacement?", a: "That's exactly what our complimentary assessment answers. We evaluate membrane condition, flashing integrity, drainage, and remaining service life. Our approach is always to repair, maintain, and restore first. We only recommend replacement when the numbers genuinely support it." },
    { q: "What types of commercial roofs do you work on?", a: "We service all major flat and low-slope systems including TPO, PVC, modified bitumen, metal, built-up roofing, and coating systems. We're certified installers for Versico, FiberTite, Duro-Last, GAF, Western Colloid, and several other manufacturers." },
    { q: "Do you handle insurance documentation?", a: "Yes. We provide the inspection reports, repair documentation, and photo evidence that insurance carriers need. We've helped many building owners get claims approved by providing clear, professional documentation of storm damage and pre-existing conditions." },
    { q: "Can you manage roofing across multiple properties?", a: "Absolutely. We work with property managers who oversee multiple buildings across the Houston metro. One point of contact, consistent quality standards, and documented history for every property in your portfolio." },
  ];;

function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);
  const faqs = HOME_FAQS;
  return (
    <section style={{ background: C.light, padding: "80px clamp(16px,4vw,48px)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Fade>
          <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, textAlign: "center" }}>Common Questions</p>
          <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: "clamp(24px,6vw,38px)", color: C.black, lineHeight: 1.1, marginBottom: 32, textAlign: "center" }}>What Building Owners <span style={{ color: C.red }}>Ask Us</span></h2>
        </Fade>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {faqs.map((faq, i) => (
            <Fade key={i} delay={i * 0.04}>
              <div style={{ background: "#fff", overflow: "hidden" }}>
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  aria-expanded={openIdx === i}
                  style={{
                    width: "100%", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                    background: "none", border: "none", cursor: "pointer", textAlign: "left", borderLeft: `3px solid ${openIdx === i ? C.red : "transparent"}`, transition: "border-color 0.3s"
                  }}
                >
                  <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: C.black, lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{ fontFamily: F, fontSize: 20, fontWeight: 300, color: C.red, flexShrink: 0, transform: openIdx === i ? "rotate(45deg)" : "none", transition: "transform 0.3s" }}>+</span>
                </button>
                <div style={{
                  maxHeight: openIdx === i ? 300 : 0, overflow: "hidden", transition: "max-height 0.4s ease",
                  padding: openIdx === i ? "0 20px 18px 23px" : "0 20px 0 23px"
                }}>
                  <p style={{ fontFamily: F, fontSize: 13, color: C.slate, lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", message: "", consent: false, marketingConsent: false });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    setError("");
    if (!form.name.trim()) { setError("Please enter your name."); return; }
    if (!form.phone.trim() || !/[\d\-\(\)\+\s]{7,}/.test(form.phone)) { setError("Please enter a valid phone number."); return; }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Please enter a valid email address."); return; }
    // SMS consent is intentionally OPTIONAL (not required to submit) — A2P 10DLC:
    // consent must be the user's independent choice, never a condition of submitting.
    setSubmitting(true);
    try {
      const res = await fetch(GHL_WEBHOOK_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          message: form.message,
          sms_consent: form.consent,
          marketing_consent: form.marketingConsent,
          consent_record: form.consent
            ? `Opted in (service/transactional) via coonsroofing.com on ${new Date().toISOString()} — calls & texts about roof assessment, scheduling, and service updates. Msg frequency varies, msg & data rates may apply, reply STOP to opt out, HELP for help.`
            : "Not provided",
          marketing_consent_record: form.marketingConsent
            ? `Opted in (promotional) via coonsroofing.com on ${new Date().toISOString()} — promotional offers and announcements by text. Consent is not a condition of purchase, reply STOP to opt out.`
            : "Not provided",
          source: "coonsroofing.com — Roof Assessment Form",
          ...leadContext(),
          submitted_at: new Date().toISOString()
        })
      });
      if (res.ok) {
        setSent(true);
        track("generate_lead", { form: "roof_assessment", page_path: typeof window !== "undefined" ? window.location.pathname : "" });
      } else { setError("Something went wrong. Please call us at 713-367-1495."); }
    } catch { setError("Connection error. Please call us at 713-367-1495."); }
    setSubmitting(false);
  };
  const inputStyle = { width: "100%", padding: "12px 14px", fontFamily: F, fontSize: 14, border: "none", borderRadius: 0, outline: "none", background: "rgba(255,255,255,0.95)", color: "#333", boxSizing: "border-box" };
  return (
    <section id="contact" style={{ background: C.red, padding: "64px 16px", position: "relative", overflow: "hidden", scrollMarginTop: 80 }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.05, background: "repeating-linear-gradient(135deg,#000 0px,#000 1px,transparent 1px,transparent 30px)" }} />
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <Fade>
          <div style={{ display: "inline-block", background: "#fff", padding: "14px 24px", borderRadius: 10, marginBottom: 22, boxShadow: "0 6px 20px rgba(0,0,0,0.18)" }}><img src={COONS_LOGO} alt="Coons Roofing" style={{ height: 44, display: "block" }} /></div>
          <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: "clamp(24px,6vw,38px)", color: "#fff", lineHeight: 1.1, marginBottom: 10 }}>Schedule Your Complimentary Roof Assessment</h2>
          <p style={{ fontFamily: F, fontSize: 14, color: "rgba(255,255,255,0.85)", marginBottom: 28, lineHeight: 1.6 }}>We'll walk your roof, take photos, and give you straight answers. No pressure, no gimmicks.</p>
        </Fade>
        {sent ? (
          <Fade><div style={{ background: "rgba(255,255,255,0.15)", padding: 32, borderRadius: 4 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
            <div style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Request Received</div>
            <div style={{ fontFamily: F, fontSize: 14, color: "rgba(255,255,255,0.85)", marginBottom: 16 }}>We'll be in touch within 24 hours. Need it sooner? Call us at <a href="tel:+17133671495" style={{ color: "#fff", fontWeight: 800, textDecoration: "none" }}>713-367-1495</a>.</div>
            <button onClick={()=>{setSent(false);setForm({name:"",phone:"",email:"",address:"",message:"",consent:false,marketingConsent:false});}} style={{ background: "none", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", padding: "12px 24px", fontFamily: F, fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5, minHeight: 44 }}>Submit Another Request</button>
          </div></Fade>
        ) : (
          <Fade delay={0.1}>
            <form onSubmit={(e)=>{e.preventDefault();handleSubmit();}} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
                <input id="cf-name" name="name" autoComplete="name" enterKeyHint="next" aria-label="Your name" style={inputStyle} placeholder="Your Name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                <input id="cf-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" enterKeyHint="next" aria-label="Phone number" style={inputStyle} placeholder="Phone *" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
              </div>
              <input id="cf-email" name="email" type="email" autoComplete="email" inputMode="email" enterKeyHint="next" aria-label="Email address" style={inputStyle} placeholder="Email *" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
              <input id="cf-address" name="address" autoComplete="street-address" enterKeyHint="next" aria-label="Property address" style={inputStyle} placeholder="Property Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
              <textarea aria-label="Message" style={{...inputStyle,minHeight:80,resize:"vertical"}} placeholder="Tell us what's going on with your roof..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", textAlign: "left", cursor: "pointer" }}>
                <input type="checkbox" aria-label="Consent to service text messages" checked={form.consent} onChange={e=>setForm({...form,consent:e.target.checked})} style={{ marginTop: 3, width: 18, height: 18, flexShrink: 0, accentColor: "#fff", cursor: "pointer" }}/>
                <span style={{ fontFamily: F, fontSize: 10.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.5 }}>
                  <strong style={{ color: "rgba(255,255,255,0.85)" }}>Optional.</strong> I agree to receive calls and service/transactional text messages (roof assessment, scheduling, appointment coordination, and follow-ups) from Coons Roofing LLC at the number provided. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help.
                </span>
              </label>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", textAlign: "left", cursor: "pointer" }}>
                <input type="checkbox" aria-label="Consent to promotional text messages" checked={form.marketingConsent} onChange={e=>setForm({...form,marketingConsent:e.target.checked})} style={{ marginTop: 3, width: 18, height: 18, flexShrink: 0, accentColor: "#fff", cursor: "pointer" }}/>
                <span style={{ fontFamily: F, fontSize: 10.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.5 }}>
                  <strong style={{ color: "rgba(255,255,255,0.85)" }}>Optional.</strong> I agree to receive marketing and promotional text messages (offers and announcements) from Coons Roofing LLC at the number provided. Message frequency varies. Msg &amp; data rates may apply. Consent is not a condition of purchase. Reply STOP to opt out, HELP for help. See our <a href="/privacy/" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "underline" }}>Privacy Policy</a> and <a href="/terms/" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "underline" }}>Terms</a>.
                </span>
              </label>
              <p style={{ fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.5, textAlign: "left", margin: "2px 0 0" }}>
                We reply within 24 hours, usually the same day. No pressure, no sales visit you did not ask for, and we never sell your information.
              </p>
              {error && <div role="alert" style={{ fontFamily: F, fontSize: 13, color: "#fff", background: "rgba(0,0,0,0.25)", padding: "8px 12px", textAlign: "left" }}>{error}</div>}
              <button type="submit" disabled={submitting} style={{ background: "#fff", color: C.red, padding: "14px", borderRadius: 4, fontFamily: F, fontSize: 14, fontWeight: 800, border: "none", cursor: submitting ? "wait" : "pointer", textTransform: "uppercase", letterSpacing: 1, opacity: submitting ? 0.7 : 1 }}>{submitting ? "Sending..." : "Get My Free Roof Report"}</button>
            </form>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
              <span style={{ fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>or call directly:</span>
              <a href="tel:+17133671495" style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: "#fff", textDecoration: "none" }}>713-367-1495</a>
            </div>
          </Fade>
        )}
      </div>
    </section>
  );
}

function Footer() {
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);
  const handleSub = async () => {
    if (!email.includes("@")) return;
    try {
      const res = await fetch(GHL_WEBHOOK_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "coonsroofing.com — Newsletter Signup",
          ...leadContext(),
          tag: "Newsletter",
          submitted_at: new Date().toISOString()
        })
      });
      if (res.ok) setSubbed(true);
    } catch { /* network error — leave the form in place so the user can retry */ }
  };
  const socialIcon = (path, href, label) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, background: "rgba(255,255,255,0.06)", borderRadius: 4, transition: "background 0.3s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(230,34,54,0.2)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#999" style={{display:"block"}}><path d={path}/></svg>
    </a>
  );
  return (
    <footer style={{ background: "#000", padding: "48px clamp(16px,4vw,48px) 24px", borderTop: "1px solid #1a1a1a" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ marginBottom: 12 }}>
              <img src={COONS_LOGO_W} alt="Coons Roofing" style={{ height: 22 }} />
            </div>
            <p style={{ fontFamily: F, fontSize: 12, color: "#8f8f8f", lineHeight: 1.6, maxWidth: 320, marginBottom: 16 }}>Commercial roofing serving building owners and property managers across the Houston metro. Repair. Maintain. Restore. Replace only when necessary.</p>
            <div style={{ display: "flex", gap: 8 }}>
              {socialIcon("M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z", "https://www.linkedin.com/company/coons-roofing", "LinkedIn")}
              {socialIcon("M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54v-2.9h2.54v-2.2c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.86h2.78l-.45 2.9h-2.33v7c4.78-.75 8.44-4.9 8.44-9.9 0-5.53-4.5-10.02-10-10.02z", "https://www.facebook.com/coonsroofing", "Facebook")}
              {socialIcon("M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm5.46 7.12c-.01.14-.01.29-.01.43 0 4.38-3.33 9.42-9.42 9.42-1.87 0-3.61-.55-5.07-1.49.26.03.52.04.79.04 1.55 0 2.98-.53 4.11-1.42-1.45-.03-2.67-.98-3.09-2.3.2.04.41.06.63.06.3 0 .6-.04.88-.11-1.51-.31-2.65-1.64-2.65-3.24v-.04c.45.25.96.4 1.5.42-.89-.59-1.47-1.6-1.47-2.74 0-.6.16-1.17.45-1.66 1.63 2 4.07 3.31 6.82 3.45-.06-.24-.08-.49-.08-.75 0-1.82 1.47-3.3 3.3-3.3.95 0 1.81.4 2.41 1.04.75-.15 1.46-.42 2.1-.8-.25.77-.77 1.42-1.46 1.83.67-.08 1.3-.26 1.9-.52-.44.66-1 1.24-1.65 1.7z", "https://g.page/r/CUZitDSZo8KcEBM", "Google")}

            </div>
          </div>
          {[{t:"Services",items:[{n:"Repair",s:"repair"},{n:"Maintenance",s:"maintenance"},{n:"Coatings",s:"coatings"},{n:"Replacement",s:"replacement"},{n:"Inspections",s:"inspections"},{n:"Emergency",s:"emergency"},{n:"TPO Roofing",s:"tpo-roofing-houston"},{n:"Flat Roof Repair",s:"flat-roof-repair-houston"},{n:"Metal Roof Coating",s:"metal-roof-coating-houston"}]},{t:"Areas",items:[{n:"Houston",s:"houston"},{n:"Katy",s:"katy"},{n:"The Woodlands",s:"the-woodlands"},{n:"Sugar Land",s:"sugar-land"},{n:"Pearland",s:"pearland"},{n:"Spring",s:"spring"},{n:"Tomball",s:"tomball"},{n:"League City",s:"league-city"},{n:"Cypress",s:"cypress"},{n:"Pasadena",s:"pasadena"},{n:"Conroe",s:"conroe"}]},{t:"Building Types",items:[{n:"Warehouse & Industrial",s:"warehouse-roofing-houston"},{n:"Retail & Strip Centers",s:"retail-roofing-houston"},{n:"Multifamily & HOA",s:"multifamily-roofing-houston"},{n:"Churches",s:"church-roofing-houston"},{n:"Medical Offices",s:"medical-office-roofing-houston"}]},{t:"Company",items:[{n:"About",s:"about"},{n:"Projects",s:"projects"},{n:"Blog",s:"blog"},{n:"Contact",s:"contact"}]},{t:"Contact",items:[{n:"713-367-1495",h:"tel:+17133671495"},{n:"wade@coonsroofing.com",h:"mailto:wade@coonsroofing.com"},{n:"10607 Lynbrook Dr"},{n:"Houston, TX 77042"}]}].map(col=>(
            <div key={col.t}>
              <div style={{ fontFamily: F, fontSize: 11, fontWeight: 800, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>{col.t}</div>
              {col.items.map(it=> it.s ? (
                <Link key={it.n} to={it.s} style={{ fontFamily: F, fontSize: 12, color: "#777", marginBottom: 6, display: "block", transition: "color 0.2s" }} onMouseOver={e=>e.target.style.color="#6b6b6b"} onMouseOut={e=>e.target.style.color="#777"}>{it.n}</Link>
              ) : it.h ? (
                <a key={it.n} href={it.h} style={{ fontFamily: F, fontSize: 12, color: "#777", marginBottom: 6, display: "block", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e=>e.target.style.color="#6b6b6b"} onMouseOut={e=>e.target.style.color="#777"}>{it.n}</a>
              ) : (
                <div key={it.n} style={{ fontFamily: F, fontSize: 12, color: "#777", marginBottom: 6 }}>{it.n}</div>
              ))}
            </div>
          ))}
          <div>
            <div style={{ fontFamily: F, fontSize: 11, fontWeight: 800, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Stay Updated</div>
            <p style={{ fontFamily: F, fontSize: 12, color: "#777", marginBottom: 10, lineHeight: 1.5 }}>Roof tips and seasonal maintenance reminders for property managers.</p>
            {subbed ? (
              <div style={{ fontFamily: F, fontSize: 12, color: C.red, fontWeight: 700 }}>You're on the list.</div>
            ) : (
              <div style={{ display: "flex", gap: 0 }}>
                <input aria-label="Email for newsletter" type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} style={{ flex: 1, padding: "8px 10px", fontFamily: F, fontSize: 12, border: "1px solid #333", borderRight: "none", background: "#111", color: "#ccc", outline: "none", minWidth: 0 }}/>
                <button onClick={handleSub} style={{ padding: "10px 16px", fontFamily: F, fontSize: 11, fontWeight: 800, background: C.red, color: "#fff", border: "none", cursor: "pointer", whiteSpace: "nowrap", minHeight: 40 }}>Join</button>
              </div>
            )}
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 20, paddingBottom: 64, textAlign: "center" }}>
          <span style={{ fontFamily: F, fontSize: 11, color: "#8f8f8f", display: "block", marginBottom: 4 }}>© 2026 Coons Roofing. All rights reserved.</span>
          <span style={{ fontFamily: F, fontSize: 11, color: "#8f8f8f", display: "block", marginBottom: 8 }}>Houston, TX</span>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <a href="/privacy/" style={{ fontFamily: F, fontSize: 11, color: "#777", textDecoration: "none" }}>Privacy Policy</a>
            <a href="/terms/" style={{ fontFamily: F, fontSize: 11, color: "#777", textDecoration: "none" }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


function StickyCallBar({ page }) {
  const [show, setShow] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    setContactVisible(false);
    let obs;
    const timer = setTimeout(() => {
      const el = document.getElementById("contact");
      if (!el) return;
      obs = new IntersectionObserver(([e]) => setContactVisible(e.isIntersecting), { threshold: 0.1 });
      obs.observe(el);
    }, 100);
    return () => { clearTimeout(timer); if (obs) obs.disconnect(); };
  }, [page]);
  if (!show || contactVisible) return null;
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 98, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(8px)", padding: "8px 16px", borderTop: "1px solid rgba(230,34,54,0.3)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, maxWidth: 500, margin: "0 auto" }}>
        <a href="tel:+17133671495" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", flex: 1, padding: "12px 0", minHeight: 44 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: 0.3 }}>Call Now</span>
        </a>
        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />
        <a href="/#contact" onClick={(e)=>{const el=document.getElementById("contact"); if(el){e.preventDefault();el.scrollIntoView({behavior:"smooth"});}}} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", flex: 1, padding: "12px 0", minHeight: 44 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: 0.3 }}>Free Assessment</span>
        </a>
        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />
        <a href="sms:713-367-1495" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", flex: 1, padding: "12px 0", minHeight: 44 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: 0.3 }}>Text Us</span>
        </a>
      </div>
    </div>
  );
}

/* ── Shared Inner Page Components ── */
function PageHero({ tag, title, highlight, desc }) {
  return (
    <section style={{ background: `linear-gradient(160deg, rgba(0,0,0,0.85) 0%, rgba(10,2,4,0.9) 100%), url(${HERO_BG}) center/cover`, padding: "120px 24px 60px", textAlign: "center" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <Fade now><p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{tag}</p></Fade>
        <Fade now delay={0.05}><h1 style={{ fontFamily: F, fontWeight: 900, fontSize: "clamp(28px,7vw,48px)", color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>{title} <span style={{ color: C.red }}>{highlight}</span></h1></Fade>
        <Fade now delay={0.1}><p style={{ fontFamily: F, fontSize: 15, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, marginBottom: 24 }}>{desc}</p></Fade>
        <Fade now delay={0.15}><div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 360, margin: "0 auto" }}>
          <a href="#contact" onClick={(e)=>{e.preventDefault();document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}} style={{ background: C.red, color: "#fff", padding: "14px 28px", fontFamily: F, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, textAlign: "center", textDecoration: "none", cursor: "pointer" }}>Get a Complimentary Assessment</a>
          <a href="tel:+17133671495" style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", textDecoration: "none", textAlign: "center" }}>or call 713-367-1495</a>
        </div></Fade>
      </div>
    </section>
  );
}

function BrandRule({ light = false, style }) {
  return (
    <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13, ...style }}>
      <span style={{ width: 26, height: 3, background: C.red, display: "block", flexShrink: 0 }} />
      <img src={light ? COONS_MARK_W : COONS_MARK} alt="" style={{ height: 17, width: "auto", display: "block", opacity: 1 }} />
    </div>
  );
}

function Figure({ src, cap, ratio = "3 / 2" }) {
  return (
    <figure style={{ margin: 0 }}>
      <img src={src} srcSet={srcSetFor(src, 800, 1600)} sizes="(max-width: 920px) 100vw, 880px" alt={cap} loading="lazy" style={{ width: "100%", aspectRatio: ratio, objectFit: "cover", display: "block", background: C.light }} />
      <figcaption style={{ borderLeft: `3px solid ${C.red}`, paddingLeft: 11, marginTop: 11, fontFamily: F, fontSize: 12.5, color: C.slate, lineHeight: 1.5 }}>{cap}</figcaption>
    </figure>
  );
}

function MidCTA({ headline = "Not sure where your roof stands?", sub = "We walk it, photograph everything, and give you the repair-or-replace answer backed by numbers. No charge." }) {
  return (
    <section style={{ background: C.black, padding: "44px clamp(16px,4vw,48px)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <img src={COONS_MARK_W} alt="" aria-hidden="true" style={{ height: 22, width: "auto", marginBottom: 14 }} />
        <p style={{ fontFamily: F, fontWeight: 900, fontSize: "clamp(20px,3.6vw,27px)", color: "#fff", lineHeight: 1.25, marginBottom: 10 }}>{headline}</p>
        <p style={{ fontFamily: F, fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.6, marginBottom: 22, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>{sub}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/#contact" onClick={(e)=>{const el=document.getElementById("contact"); if(el){e.preventDefault();el.scrollIntoView({behavior:"smooth"});}}} style={{ background: C.red, color: "#fff", padding: "14px 26px", fontFamily: F, fontSize: 13, fontWeight: 800, textDecoration: "none", textTransform: "uppercase", letterSpacing: 1, minHeight: 44, display: "flex", alignItems: "center" }}>Get a Free Assessment</a>
          <a href="tel:+17133671495" style={{ border: "2px solid rgba(255,255,255,0.35)", color: "#fff", padding: "12px 26px", fontFamily: F, fontSize: 13, fontWeight: 800, textDecoration: "none", textTransform: "uppercase", letterSpacing: 1, minHeight: 44, display: "flex", alignItems: "center" }}>713-367-1495</a>
        </div>
      </div>
    </section>
  );
}

function RelatedPosts({ slug }) {
  const others = BLOG.filter(p => p.slug !== slug).slice(0, 3);
  if (!others.length) return null;
  return (
    <div style={{ marginTop: 34, paddingTop: 26, borderTop: "1px solid #eee" }}>
      <BrandRule />
      <p style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: C.red, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Keep Reading</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}>
        {others.map(o => (
          <Link key={o.slug} to={"blog/" + o.slug} style={{ textDecoration: "none", display: "block" }}>
            <img src={blogCard(o)} srcSet={srcSetFor(blogCard(o), 400, 700)} sizes="(max-width: 700px) 100vw, 230px" alt={o.title} width="700" height="467" loading="lazy" style={{ width: "100%", aspectRatio: "3 / 2", objectFit: "cover", display: "block", background: C.light }} />
            <p style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: C.black, lineHeight: 1.35, marginTop: 8 }}>{o.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function QuoteBand({ text }) {
  return (
    <div style={{ background: C.black, padding: "36px clamp(20px,5vw,44px)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", gap: 18, alignItems: "flex-start" }}>
        <img src={COONS_MARK_W} alt="" aria-hidden="true" style={{ height: 27, width: "auto", flexShrink: 0, marginTop: 5 }} />
        <p style={{ fontFamily: F, fontSize: "clamp(17px,2.3vw,21px)", fontWeight: 800, color: "#fff", lineHeight: 1.45, margin: 0 }}>{text}</p>
      </div>
    </div>
  );
}

function MetalFig({ k }) {
  const p = METAL_PHOTOS[k];
  return <div style={{ marginTop: 26 }}><Figure src={p.s} cap={p.c} /></div>;
}

function PageSection({ title, children, bg = "#fff", mark = false }) {
  return (
    <section style={{ background: bg, padding: "64px clamp(16px,4vw,48px)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {title && <Fade><div>{mark && <BrandRule light={!(bg === "#fff" || bg === C.light)} />}<h2 style={{ fontFamily: F, fontWeight: 900, fontSize: "clamp(22px,5vw,34px)", color: bg === "#fff" || bg === C.light ? C.black : "#fff", lineHeight: 1.1, marginBottom: 20 }}>{title}</h2></div></Fade>}
        <Fade delay={0.05}>{children}</Fade>
      </div>
    </section>
  );
}

const LEGAL_H = { fontFamily: F, fontWeight: 800, fontSize: 18, color: C.black, margin: "28px 0 10px" };
const LEGAL_P = { fontFamily: F, fontSize: 14, color: C.slate, lineHeight: 1.7, marginBottom: 12 };

function PrivacyPage() {
  return (
    <>
      <PageHero tag="Legal" title="Privacy" highlight="Policy" desc="How Coons Roofing collects, uses, and protects the information you share with us." />
      <PageSection title="">
        <p style={{ ...LEGAL_P, fontSize: 13, color: "#999" }}>Last updated: June 13, 2026</p>
        <p style={LEGAL_P}>Coons Roofing ("we," "us," or "our") operates coonsroofing.com. This Privacy Policy explains what information we collect, how we use it, and the choices you have. By using our website or contacting us, you agree to this policy.</p>

        <h3 style={LEGAL_H}>Information We Collect</h3>
        <p style={LEGAL_P}>When you submit a form or contact us, we collect the information you provide — such as your name, phone number, property address, and any details about your roof. We may also collect basic technical data (like pages visited) through standard web analytics.</p>

        <h3 style={LEGAL_H}>How We Use Your Information</h3>
        <p style={LEGAL_P}>We use your information to respond to your request, schedule and perform your roof assessment, provide quotes and services, and communicate with you about your project. With your consent, we may contact you by phone call, text message (SMS), or email.</p>

        <h3 style={LEGAL_H}>SMS / Text Messaging</h3>
        <p style={LEGAL_P}>By providing your phone number and checking the consent box on our form, you agree to receive calls and text messages from Coons Roofing about your roof assessment and related services. Message frequency varies. Message and data rates may apply. You can opt out of text messages at any time by replying STOP, or reply HELP for assistance. Consent to receive messages is not a condition of any purchase.</p>
        <p style={{ ...LEGAL_P, fontWeight: 700, color: C.black }}>No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent are not shared with any third parties.</p>

        <h3 style={LEGAL_H}>How We Share Information</h3>
        <p style={LEGAL_P}>We do not sell your personal information. We may share information only with trusted service providers who help us operate our business (for example, our customer-relationship and messaging platform), and only to the extent needed to provide our services to you, or when required by law.</p>

        <h3 style={LEGAL_H}>Data Retention &amp; Security</h3>
        <p style={LEGAL_P}>We keep your information only as long as needed to provide our services and meet legal obligations, and we take reasonable measures to protect it from unauthorized access.</p>

        <h3 style={LEGAL_H}>Your Choices</h3>
        <p style={LEGAL_P}>You may request access to, correction of, or deletion of your personal information, and you may opt out of marketing communications at any time. To make a request, contact us using the details below.</p>

        <h3 style={LEGAL_H}>Contact Us</h3>
        <p style={LEGAL_P}>Coons Roofing<br/>10607 Lynbrook Dr, Houston, TX 77042<br/>Phone: <a href="tel:+17133671495" style={{ color: C.red, textDecoration: "none" }}>713-367-1495</a><br/>Email: <a href="mailto:wade@coonsroofing.com" style={{ color: C.red, textDecoration: "none" }}>wade@coonsroofing.com</a></p>
      </PageSection>
      <CTA />
    </>
  );
}

function TermsPage() {
  return (
    <>
      <PageHero tag="Legal" title="Terms of" highlight="Service" desc="The terms that apply to your use of our website and messaging program." />
      <PageSection title="">
        <p style={{ ...LEGAL_P, fontSize: 13, color: "#999" }}>Last updated: June 13, 2026</p>
        <p style={LEGAL_P}>These Terms govern your use of coonsroofing.com and your communications with Coons Roofing. By using our website or submitting a form, you agree to these Terms.</p>

        <h3 style={LEGAL_H}>Use of This Website</h3>
        <p style={LEGAL_P}>The content on this site is provided for general information about our commercial roofing services. Estimates, recommendations, and timelines are subject to an on-site assessment and a written agreement.</p>

        <h3 style={LEGAL_H}>Messaging Terms</h3>
        <p style={LEGAL_P}>When you opt in, Coons Roofing may send you calls and text messages related to your roof assessment, scheduling, and services. <strong>Message frequency varies.</strong> Message and data rates may apply. Reply <strong>STOP</strong> at any time to unsubscribe from text messages, or <strong>HELP</strong> for help. Carriers are not liable for delayed or undelivered messages.</p>

        <h3 style={LEGAL_H}>No Mobile Data Sharing</h3>
        <p style={LEGAL_P}>No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. See our <Link to="privacy" style={{ color: C.red, textDecoration: "underline" }}>Privacy Policy</Link> for full details on how we handle your information.</p>

        <h3 style={LEGAL_H}>Limitation of Liability</h3>
        <p style={LEGAL_P}>This website is provided "as is." To the fullest extent permitted by law, Coons Roofing is not liable for any indirect or incidental damages arising from your use of the site.</p>

        <h3 style={LEGAL_H}>Contact Us</h3>
        <p style={LEGAL_P}>Questions about these Terms? Contact us at <a href="tel:+17133671495" style={{ color: C.red, textDecoration: "none" }}>713-367-1495</a> or <a href="mailto:wade@coonsroofing.com" style={{ color: C.red, textDecoration: "none" }}>wade@coonsroofing.com</a>.</p>
      </PageSection>
      <CTA />
    </>
  );
}


/* ── City Service Area Pages ── */
export const CITIES = [
  { slug: "katy", name: "Katy", county: "Harris & Fort Bend County", desc: "Serving commercial properties along the I-10 corridor from Katy Mills to downtown Katy. Office parks, retail centers, churches, and HOA communities.", pop: "Over 21,000 businesses", detail: "Katy's rapid commercial growth means more flat roofs exposed to Houston's heat, UV, and storm cycles. We service everything from the LaCenterra retail district to the industrial parks along Franz Road. If you manage commercial property in Katy, you need a roofer who understands the local building codes and can respond fast when storms roll through." },
  { slug: "the-woodlands", name: "The Woodlands", county: "Montgomery County", desc: "Commercial roofing for office campuses, retail villages, medical facilities, and HOA properties throughout The Woodlands and surrounding areas.", pop: "Major commercial district", detail: "The Woodlands Town Center, Hughes Landing, and Research Forest Drive are home to some of the largest commercial roofing footprints north of Houston. We work with property managers overseeing multi-building portfolios across the master-planned community. Our crews know the area, understand HOA requirements, and deliver the documentation standards corporate tenants expect." },
  { slug: "tomball", name: "Tomball", county: "Harris & Montgomery County", desc: "Commercial roof repair, maintenance, and replacement for Tomball businesses, churches, and property management companies.", pop: "Growing commercial corridor", detail: "Tomball sits at the intersection of 249 and 2920, a rapidly developing commercial corridor. New strip centers, medical offices, and industrial buildings go up every year. We handle everything from emergency leak repair on older metal roofs in historic downtown to warranty-backed TPO installations on new construction along the Tomball Tollway." },
  { slug: "pearland", name: "Pearland", county: "Brazoria County", desc: "Trusted commercial roofing services for Pearland property managers, HOA boards, and building owners south of Houston.", pop: "Fast-growing suburb", detail: "Pearland's commercial growth along 288 and the Sam Houston Tollway means more property managers need reliable roofing partners. We service the Shadow Creek Ranch commercial district, Town Center, and industrial properties near Pearland Parkway. Proximity to the coast makes storm preparedness and proper drainage even more critical for buildings in this area." },
  { slug: "league-city", name: "League City", county: "Galveston County", desc: "Commercial roofing for League City and Clear Lake area businesses, churches, and multi-family properties.", pop: "Galveston County's largest city", detail: "League City and the Clear Lake area sit closer to the Gulf, which means higher wind loads, salt air exposure, and more aggressive storm seasons. Commercial roofs down here take a beating. We service properties from NASA Parkway to the mainland, including medical offices, retail centers, and the growing number of multi-family developments along I-45." },
  { slug: "sugar-land", name: "Sugar Land", county: "Fort Bend County", desc: "Commercial roofing contractor serving Sugar Land office parks, retail centers, and HOA communities in Fort Bend County.", pop: "Major employment center", detail: "Sugar Land's Town Square, First Colony, and the commercial corridor along Highway 6 represent significant commercial roofing inventory. We work with Fort Bend County property managers who need consistent quality across multiple buildings. Our photo-documented reports are formatted for the corporate ownership groups and institutional investors common in this market." },
  { slug: "spring", name: "Spring", county: "Harris County", desc: "Commercial roof maintenance, repair, and replacement for Spring and Klein area properties north of Houston.", pop: "Major suburban hub", detail: "Spring and the Klein area along I-45 North and the Grand Parkway contain thousands of commercial rooftops, from Old Town Spring's retail buildings to the massive developments near ExxonMobil's campus. We service strip centers, churches, medical facilities, and the growing number of multi-family properties in this corridor." },
  { slug: "cypress", name: "Cypress", county: "Harris County", desc: "Commercial roofing services for Cypress businesses, HOAs, and property managers along the 290 corridor.", pop: "Fastest-growing area", detail: "Cypress and the US-290 corridor represent some of Houston's fastest commercial growth. New retail, medical, and office construction means new flat roofs that need maintenance programs from day one. We also service the established commercial properties along Barker Cypress, Fry Road, and the Fairfield area. Getting ahead of maintenance in a new building protects your warranty and prevents expensive problems down the road." },
  { slug: "pasadena", name: "Pasadena", county: "Harris County", desc: "Commercial and industrial roofing services for Pasadena and the Houston Ship Channel area.", pop: "Industrial hub", detail: "Pasadena and the Ship Channel area present unique roofing challenges. Chemical exposure, industrial contaminants, and proximity to heavy industry mean PVC membranes often outperform TPO in this market. We understand the specific demands of industrial roofing and carry the certifications to install chemical-resistant systems that hold up in this environment." },
  { slug: "conroe", name: "Conroe", county: "Montgomery County", desc: "Commercial roofing for Conroe and Montgomery County businesses, churches, and property management companies.", pop: "County seat, growing fast", detail: "Conroe and greater Montgomery County are experiencing rapid commercial development along I-45 and the Grand Parkway. New medical facilities, retail centers, and mixed-use developments need roofing contractors who can handle both new construction warranty work and ongoing maintenance. We service the entire Montgomery County corridor from Willis to Shenandoah." },
];

// Unique, locally-specific content per city to avoid thin/duplicate pages.
export const CITY_EXTRA = {
  katy: {
    local: "Katy's commercial inventory skews new: TPO and modified-bitumen roofs going up across Cinco Ranch, LaCenterra, and the Energy Corridor spillover along I-10. New construction is exactly when a maintenance program pays off most, protecting the manufacturer warranty from day one. We also handle the aging metal and built-up roofs on older retail along Highway Blvd and Mason Road.",
    faqs: [
      { q: "How fast can you respond to a roof leak in Katy?", a: "We provide same-day emergency response across Katy and Fort Bend County for active water intrusion, and we can typically have someone on a roof the same day during business hours." },
      { q: "Do you work with Katy HOAs and retail property managers?", a: "Yes. A large share of our Katy work is HOA-governed commercial buildings and retail centers, where we provide the photo-documented reports boards and ownership groups expect." },
    ],
  },
  "the-woodlands": {
    local: "The Woodlands is corporate-campus country: Town Center, Hughes Landing, and the Research Forest office parks carry some of the largest single-building roof footprints north of Houston. These owners expect institutional-grade documentation, and the master-planned community's design requirements mean approvals and aesthetics matter. We coordinate around tenant operations and deliver reporting that satisfies corporate asset managers.",
    faqs: [
      { q: "Can you manage roofing across multiple Woodlands properties?", a: "Yes. We offer portfolio maintenance plans with one point of contact, consistent reporting standards, and a documented history for every building in your portfolio." },
      { q: "Do you meet The Woodlands' design and HOA requirements?", a: "We're familiar with the community's commercial design standards and provide the documentation and coordination needed for approvals before work begins." },
    ],
  },
  tomball: {
    local: "Tomball is a study in contrasts: historic downtown buildings with older metal and built-up roofs sitting beside brand-new TPO installations along the Tomball Tollway and the 249/2920 corridor. We handle both, from emergency leak repair on a decades-old roof to warranty-backed single-ply on new medical and retail construction.",
    faqs: [
      { q: "Do you repair older metal roofs in downtown Tomball?", a: "Yes. We diagnose and permanently repair aging metal and built-up systems, and we'll tell you honestly whether a targeted repair or a coating restoration makes more financial sense than replacement." },
      { q: "Do you handle new commercial construction in Tomball?", a: "We install warranty-backed systems on new retail, medical, and industrial buildings and can start a maintenance program immediately to protect the warranty." },
    ],
  },
  pearland: {
    local: "Pearland's commercial growth runs along 288 and the Sam Houston Tollway, through Shadow Creek Ranch and the Town Center district. Proximity to the coast makes drainage and storm preparedness critical here, ponding water and undersized drains are among the most common problems we find on Pearland flat roofs.",
    faqs: [
      { q: "Why does drainage matter so much for Pearland commercial roofs?", a: "Pearland's heavy rainfall and flat-roof construction mean poor drainage leads to ponding, accelerated membrane failure, and leaks. We assess and correct drainage as part of every inspection." },
      { q: "Do you serve the Shadow Creek and Town Center areas?", a: "Yes, we service commercial properties throughout Pearland including the Shadow Creek Ranch commercial district, Town Center, and the 288 corridor." },
    ],
  },
  "league-city": {
    local: "League City and the Clear Lake area sit closer to the Gulf, which changes everything: higher wind loads, salt-air corrosion, and a more aggressive storm season. We spec corrosion-resistant fasteners and detailing built for coastal exposure, and we prioritize storm preparedness for buildings from NASA Parkway to the I-45 corridor.",
    faqs: [
      { q: "How does coastal exposure affect commercial roofs in League City?", a: "Salt air corrodes fasteners and metal detailing faster, and higher wind loads stress seams and edges. We use coastal-appropriate materials and detailing to hold up in this environment." },
      { q: "Do you handle storm and hurricane damage in the Clear Lake area?", a: "Yes. We provide rapid storm response and the timestamped damage documentation insurance carriers need to process claims." },
    ],
  },
  "sugar-land": {
    local: "Sugar Land's commercial corridors, First Colony, Town Square, and Highway 6, are dominated by institutional owners and corporate ownership groups. That means reporting standards matter: our photo-documented findings are formatted for the boards, asset managers, and investors common in Fort Bend County's commercial market.",
    faqs: [
      { q: "Do your reports meet institutional ownership standards?", a: "Yes. Every inspection includes findings ranked by urgency with photos and budget estimates, formatted to forward directly to ownership groups, boards, or insurance." },
      { q: "Can you maintain multiple Sugar Land buildings consistently?", a: "We provide portfolio maintenance with one point of contact and consistent documentation across every property you manage in Fort Bend County." },
    ],
  },
  spring: {
    local: "Spring and the Klein area stretch along I-45 North and the Grand Parkway, from Old Town Spring's retail buildings to the large developments near the ExxonMobil campus. It's a deep mix of strip centers, churches, medical facilities, and multi-family, each with different roofing demands we handle daily.",
    faqs: [
      { q: "Do you service the Old Town Spring and ExxonMobil campus areas?", a: "Yes, we cover the full Spring and Klein corridor along I-45 North and the Grand Parkway, including retail, office, medical, and multi-family properties." },
      { q: "Do you offer maintenance plans for Spring property managers?", a: "We offer semi-annual maintenance programs with photo reports that catch small issues before they become emergency calls." },
    ],
  },
  cypress: {
    local: "Cypress and the US-290 corridor are among Houston's fastest-growing commercial areas, with new retail, medical, and office construction going up constantly along Barker Cypress, Fry Road, and Fairfield. New roofs need maintenance from day one to protect the warranty, and we also service the established properties throughout the area.",
    faqs: [
      { q: "Should a brand-new commercial roof in Cypress need maintenance?", a: "Yes, manufacturer warranties require documented maintenance. Starting a program day one protects your warranty and catches installation issues before they cause damage." },
      { q: "What areas of Cypress do you cover?", a: "We service the full US-290 corridor including Barker Cypress, Fry Road, and the Fairfield area." },
    ],
  },
  pasadena: {
    local: "Pasadena and the Ship Channel are unlike anywhere else we work. Chemical exposure, industrial contaminants, and heavy-industry proximity mean PVC membranes often outperform TPO here, they resist the grease and chemical attack that degrade other systems. We carry the certifications to install chemical-resistant systems built for industrial environments.",
    faqs: [
      { q: "Why do you recommend PVC over TPO near the Ship Channel?", a: "PVC resists chemical and grease exposure far better than TPO, which matters near industrial facilities, restaurants, and the Ship Channel. We'll spec the right membrane for your building's exposure." },
      { q: "Do you handle industrial roofing in Pasadena?", a: "Yes. We're certified for chemical-resistant systems and understand the specific demands of industrial commercial roofing in this corridor." },
    ],
  },
  conroe: {
    local: "Conroe and greater Montgomery County are booming along I-45 and the Grand Parkway, new medical facilities, retail centers, and mixed-use developments from Willis to Shenandoah. That growth means both new-construction warranty work and ongoing maintenance for owners who want to protect a fresh investment.",
    faqs: [
      { q: "Do you cover all of Montgomery County from Conroe?", a: "Yes, we service the entire Montgomery County corridor from Willis to Shenandoah, including Conroe's growing commercial and medical districts." },
      { q: "Do you do new-construction commercial roofing in Conroe?", a: "We install warranty-backed systems on new construction and start maintenance programs immediately to protect the warranty and the owner's investment." },
    ],
  },
};

/* ── Page Data ── */
export const PAGES = {
  "warehouse-roofing-houston": { posts: ["signs-commercial-roof-needs-repair", "flat-roof-drainage-problems-houston"], tag: "Warehouse Roofing", title: "Warehouse & Industrial Roofing in", highlight: "Houston", desc: "Distribution buildings put acres of membrane over product that cannot get wet. Wind uplift at the corners, fastener backout across long spans, and water that never reaches a drain are the usual culprits. We find the cause, document it, and repair or restore before anyone talks about a tear-off.", sections: [
    { t: "What a Big Roof Area Changes", c: ["A warehouse roof is not just a larger version of an office roof. Long, uninterrupted membrane runs over steel deck expand and contract every day, and that thermal cycling works its way out at the fasteners, the seams, and the expansion joints. Fastener backout shows up as small raised bumps under the membrane, and each one is a wear point that eventually opens up. Wind loading is not uniform either. Corners and perimeters carry the highest uplift pressure, which is why those zones get tighter fastening patterns and why they are usually the first place a mechanically attached system starts to lift.", "On a roof that covers acres, the failing detail can be a long way from the drip somebody reported inside. Water travels along the deck flutes and along seams before it finds a path down. That is why we walk the entire roof rather than the area above the reported leak, and why we mark and photograph every finding against a roof plan so you can see where problems cluster. Most of what we find on industrial roofs is repairable. When it is, we say so."] },
    { t: "Drainage on a Shallow Deck", c: ["Low-slope industrial roofs drain slowly by design. Water has to travel a long way to reach an internal drain or a scupper, and anything that interrupts that path leaves standing water behind. Deflection between joists, insulation crushed under years of foot traffic, and settled tapered board all create low spots that hold water after the rain stops. Ponding is not a cosmetic issue.", "Standing water adds structural load, accelerates membrane breakdown under UV, and finds any seam that is even slightly compromised. In Houston, where one storm can drop several inches in an afternoon, a clogged or undersized drain turns into interior damage fast. We clear drains, check sump condition and clamping rings, verify that scuppers and overflow provisions are actually open, and note where slope has been lost. Where ponding is chronic and the deck is sound, tapered insulation in the low areas or a silicone system rated for standing water usually solves it without a tear-off. Where the deck itself has deflected or a joist has moved, we say that plainly and keep the structural fix priced separately so you are not paying for it inside a roofing line item."] },
    { t: "Working Around Distribution Operations", c: ["Warehouses do not stop for roof work. Dock doors run on a schedule, racking sits directly under the deck, and the product below is often worth far more than the roof above it. We plan around that. On a tear-off, we sequence the work so no section is ever open wider than we can dry in the same day, and we protect the space underneath before anyone starts cutting. Fastening and deck work drop debris and dust into the building, so we agree with your operations lead on which bays get cleared, tarped, or worked outside of shift hours.", "Crane picks and material staging need lot space that trucks are usually occupying, so pick times and laydown areas get settled before mobilization rather than the morning of. If your building runs multiple shifts, the loudest phases can move to the quietest window. If forklift traffic runs under an active area, that lane comes out of service for the day. None of this is complicated, but it does have to be planned. We put the sequence in writing so your team knows what is happening over which bay on which day."] },
    { t: "Restoration Instead of Tear-Off", c: ["A lot of Houston industrial roofs are standing seam metal, aged modified bitumen, or a built-up system that has already been patched more than once. Those roofs are often better candidates for restoration than replacement. A fluid-applied system bonds to the existing surface, seals every seam and fastener head, and carries a new manufacturer warranty with no tear-off, no dumpsters in the yard, and no opening of the building. On metal, that means fastener-by-fastener prep, rust-inhibitive primer, and reinforced seam treatment before any topcoat goes down.", "We are certified applicators for Western Colloid, Karnak, Everest Systems, and IPC, and the right system depends on your substrate, your ponding conditions, and how many years you actually need out of the building. Restoration is not always the answer. If the insulation is saturated or the deck is compromised, coating over the top hides the problem and wastes the money. That is why we cut cores and take moisture readings before we quote. When replacement is the honest call, we install warranty-backed systems from Versico, FiberTite, Duro-Last, GAF, and Elevate and show you the math that got us there."] }
  ] },
  "retail-roofing-houston": { posts: ["commercial-roof-leak-during-business-hours", "commercial-roof-maintenance-program-houston"], tag: "Retail Roofing", title: "Retail & Strip Center Roofing in", highlight: "Houston", desc: "A leak in a strip center is a tenant problem before it is a roof problem. Grease off a restaurant exhaust fan, HVAC techs walking the same path for years, and sign penetrations nobody flashed all show up in the membrane. We trace the water to its actual source and document it suite by suite.", sections: [
    { t: "One Roof, Many Tenants", c: ["In a strip center the roof is a shared asset with a lot of individual stakeholders. Water that enters at a seam near the back parapet can travel along the deck and drip through a ceiling three suites over, which means the tenant reporting the leak is often not the tenant under the actual failure. Chasing that correctly matters, because the repair location determines who gets disrupted, what gets damaged, and under many leases how the cost gets allocated.", "We track findings by suite and by roof section, so the leak history for a given address reads chronologically and lines up with the complaints already sitting in your work order system. Interior damage in retail runs expensive out of all proportion to the roof repair. Inventory, fixtures, point of sale equipment, and ceiling grid all cost more to replace than the flashing that failed. When a tenant reports water, we respond, stop the intrusion, and hand you photo documentation you can forward to the tenant, to ownership, or to your carrier without rewriting any of it."] },
    { t: "Restaurant Bays and Grease Exhaust", c: ["Any center with a restaurant in it has a roof problem the rest of the building does not. Kitchen exhaust fans discharge hot, grease-laden air, and that grease lands on the membrane around the fan curb and spreads downslope with every rain. Grease attacks TPO and asphalt-based systems, softening the material and degrading the seams and adhesives it settles on. What you get is a ring of failing membrane around the fan, right where penetration density is already highest.", "Grease containment at the fan, periodic cleaning of the affected field, and the right membrane are what change the outcome. PVC handles grease and chemical exposure far better than TPO, which is why it is the standard call around kitchens and food service. On an existing roof we can often replace the affected field with PVC and tie it into the surrounding system rather than reroofing the whole center. We also check the make-up air units, the grease duct penetrations, and the curbs themselves, since those flashings take sustained heat on top of the chemical exposure."] },
    { t: "Rooftop Traffic and Added Penetrations", c: ["Retail roofs get walked on more than almost any other building type. Every tenant has its own rooftop unit, every unit gets serviced, and every service call means somebody dragging tools across the membrane, setting down a ladder, and occasionally cutting into it. Add sign electrical, security cameras, satellite dishes, and abandoned penetrations left behind by a tenant who moved out, and you have a roof full of details that were never part of the original design. Most retail leaks we find start at one of those details rather than in the open field.", "We inspect every curb, condensate line, gas line support, and pitch pocket, and we flag the ones installed without proper flashing. Condensate discharged onto the membrane instead of into a drain keeps an area permanently wet and fails it early. Walk pads between the roof hatch and the equipment cost very little and prevent a great deal of damage. Abandoned penetrations should be cut out and properly patched rather than smeared with mastic and forgotten. Those recommendations are what keep small line items from becoming tenant claims."] },
    { t: "Scheduling Around Store Hours", c: ["Retail work gets scheduled around customers, not around us. Lot staging takes spaces your tenants need, crane picks close lanes, and tear-off noise directly over a dining room or a salon costs that tenant business. So the plan gets settled before mobilization. Early starts ahead of opening, weekend or overnight phases for the loudest work, staging in the least-used corner of the lot, and debris control over occupied space.", "Tenants get advance notice through you, so nobody is surprised by a crew on the roof at seven in the morning. Roof access usually runs through a tenant space or a shared corridor, so the access route and key arrangements get confirmed in writing rather than by knocking on doors. Every day ends with a clean site, cones and debris cleared, and the lot back in full use. If one phase is going to hit a particular tenant harder than the rest, we tell you which day and for how long, so you can make the call and communicate it ahead of time instead of fielding the complaint afterward."] }
  ] },
  "multifamily-roofing-houston": { posts: ["hoa-multifamily-roofing-guide", "property-manager-roof-maintenance-budgeting"], tag: "Multifamily Roofing", title: "Multifamily & HOA Roofing in", highlight: "Houston", desc: "Apartment, condo, and HOA properties usually carry several roof systems of different ages on one site. Boards and asset managers need a phased plan, not one alarming number. We inspect building by building, rank findings by urgency, and write it up so a board can read it and vote on it.", sections: [
    { t: "Several Roof Systems, One Property", c: ["Apartment communities and condo properties rarely have one roof. A typical site carries low-slope sections over breezeways and flat buildings, shingle or metal on pitched roofs and mansards, separate systems on the clubhouse and leasing office, and carports and mail kiosks with details of their own. Those systems were often installed in different years by different contractors, so they age out at different times and sit under different warranties.", "Treating the property as a single roof leads to either overspending on buildings that still have years left or ignoring the one that is actually failing. We inspect building by building, assign each a condition rating and a remaining useful life estimate, and deliver a phased plan instead of one lump number. The buildings that need work this fiscal year get funded, and the rest get inspected again next cycle. Wall-to-roof transitions, stair tower flashings, breezeway edge metal, and balcony deck-to-wall details cause a disproportionate share of the leaks on these properties, and they are usually far cheaper to correct than anyone expects going in."] },
    { t: "Reserve Cycles and Board Approval", c: ["Roof spending at an apartment or association property has to fit a budget cycle, and at an HOA or condo it has to survive an approval process. Boards meet on a schedule, they compare bids, and they answer to owners who will ask why the money went out. The proposal has to stand on its own after we leave the room.", "Our reports separate what needs to happen now, what can wait six to twelve months, and what should simply be monitored, each with photos and an estimate tied to a specific building. Line items are broken out so a board can approve part of a scope and defer the rest without asking for an entirely new bid. Where we can, we describe scope in terms that line up with how other contractors are bidding it, because a board comparing three proposals written three different ways is not really comparing anything. If your association funds through a reserve study, we can align our remaining-life estimates with the categories your reserve analyst uses so the two documents reconcile rather than contradict each other."] },
    { t: "People Live Under This Roof", c: ["Multifamily work happens over occupied homes, at all hours, with residents who had no say in hiring the contractor. That changes how a job runs. Tear-off noise directly above a bedroom lands differently at seven in the morning than it does in an office park. Parking is tight and residents need their spaces back by evening. Kids, pets, and grills sit right below where debris falls.", "We work building by building rather than opening several at once, screen and tarp the ground area under active work, and sweep for nails and fasteners every evening before the crew leaves. Balconies below active work get cleared or covered with notice. Management gets a schedule far enough ahead that resident notices can go out with real dates on them, and we update it when weather moves us. Roof access, ladder placement, and staging get set with your maintenance team so nothing blocks an entrance or a fire lane. Complaints on these jobs almost always trace back to communication rather than the roofing itself, so we over-communicate on purpose."] },
    { t: "Leak History and Storm Claims", c: ["On a multifamily property the same unit tends to report the same leak year after year until somebody fixes the actual cause. The interior damage compounds. Drywall, flooring, cabinets, and the turn cost on a unit that cannot be leased add up quickly, and residents remember. We document by building and unit number so the history reads clearly: what was reported, what we found, what we did, and what the photos showed on that date.", "That record is what carries weight when a storm claim gets filed. Carriers look for evidence of pre-existing condition, and a maintained roof with dated inspection reports is far easier to defend than one with no paper trail. It matters for warranty claims too, since most manufacturer warranties require documented maintenance and can be denied on the absence of it. After a storm we inspect the whole property rather than only the buildings that reported water, and we document hail bruising, wind damage at edge metal, and displaced units on the buildings that look fine from the ground."] }
  ] },
  "church-roofing-houston": { posts: ["commercial-roof-inspection-houston", "roof-maintenance-protects-warranty"], tag: "Church Roofing", title: "Church & Worship Facility Roofing in", highlight: "Houston", desc: "Most church campuses grew one addition at a time, and the tie-ins between those additions are where water gets in. We work around services, weddings, funerals, and weekday school schedules, and we bring the committee a written scope with photos instead of a number spoken across a table.", sections: [
    { t: "Campuses Built in Phases", c: ["Most church properties grew in stages. A sanctuary, then a fellowship hall, then classrooms, then a gym or family life center, each added when the congregation could afford it and each roofed with whatever was standard that decade. The result is a campus carrying several roof systems of different ages, meeting at tie-ins that were never a clean detail to begin with. Those junctions are where we find most of the leaks. A newer low-slope addition butting into an older brick wall.", "A shingle roof dumping onto a flat section with no cricket and no gutter to take the volume. Counterflashing that was reglet-cut once and never resealed. Steeples, bell towers, cupolas, and skylights add flashing details that get overlooked because nobody walks up there. We inspect the whole campus and report on it building by building, with photos and a condition rating for each structure, so the trustees can see which building genuinely needs money and which one is fine for now. Usually the answer is targeted repairs on two buildings, not a re-roof of everything."] },
    { t: "What Sits Under the Ceiling", c: ["The cost of a church roof leak is rarely the roof. Sanctuaries hold plaster ceilings, exposed wood beams, pipe organs, pianos, sound and video systems, stained glass, and finishes that are difficult or impossible to match. Gyms have hardwood floors that cup and buckle from a slow drip and often cannot be repaired in place. Fellowship halls and classrooms carry acoustic tile and carpet that show water immediately and smell like it for months.", "That changes the math on maintenance. A drain cleared twice a year and a flashing resealed before it opens costs very little next to what is sitting underneath it. We pay particular attention to the details above high-value interiors: curbs and skylight flashings over the sanctuary, valleys and tie-ins above the platform, and downspouts or drains that discharge onto a lower gym roof. Where a leak has already happened, we photograph both the roof-side cause and the interior evidence, so the record you hand your insurance carrier connects the two instead of showing a wet ceiling with no explanation attached."] },
    { t: "Working Around the Calendar", c: ["Church buildings are busier than most people assume. Sunday services, Wednesday nights, weddings, funerals, choir and band rehearsals, preschool and daycare through the week, scout meetings, food pantries, and in many cases a school on the same campus. A crew cannot be running a tear-off over a funeral. We build the schedule around your calendar rather than ours, which usually means loud phases Monday through Thursday in daylight hours, hard stops before evening activities, and nothing left open on a Saturday going into Sunday.", "Daycare and preschool operations need particular care, since fall zones, staging areas, and playground access have to be worked out before anyone gets on the roof. Odor is a factor too, especially with hot asphalt or solvent-based products near air intakes serving occupied classrooms. Low-odor and mechanically attached options avoid the issue entirely, and we will tell you when the schedule justifies the different approach even though it changes the system. The plan gets confirmed in writing with your facilities contact each week."] },
    { t: "Proposals a Committee Can Read", c: ["Decisions at a church usually run through a trustee board, a property committee, or in some cases a vote of the congregation. The person who calls us is often not the person who approves the money, and the people approving it are volunteers with day jobs and no roofing background. The proposal has to explain itself. We write scope in plain language, attach photos of the specific conditions we are pricing, and break the work into line items that can be approved or deferred one at a time.", "If there is a phased path that spreads the work across two budget years, we lay it out alongside the all-at-once option and show what each one risks. We do not push a committee toward replacement when a repair or a coating restoration is the honest recommendation. If a coating buys real years on a structurally sound deck, that is what goes in front of you, along with a clear statement of what it will not fix. If it helps, bring us to the meeting. We will answer questions directly and in front of everyone."] }
  ] },
  "medical-office-roofing-houston": { posts: ["commercial-roof-leak-during-business-hours", "commercial-roof-inspection-houston"], tag: "Medical Office Roofing", title: "Medical Office & Clinic Roofing in", highlight: "Houston", desc: "In a clinic or surgical suite, the roof is the cheap part of a roof failure. Downtime, ruined finishes, and exposed equipment are not. We plan the work around patient schedules, control odor and noise, and keep water out of the building the entire time we are on it.", sections: [
    { t: "The Building Cannot Get Wet", c: ["In a medical office, a clinic, or a surgical suite, the roof is a small share of what a roof failure costs. Water over a procedure room shuts it down. Water near imaging equipment risks a repair bill that dwarfs the entire roofing scope. Water in a sterile or semi-sterile area triggers a remediation protocol, not a bucket and a fan.", "That reality shapes how the work gets planned. We do not open more roof than we can dry in the same day, we watch the forecast on a shorter leash than we would on a warehouse, and we keep temporary protection staged on site through every tear-off phase. Above sensitive spaces we coordinate interior protection with facilities before anything gets cut, because dust and debris dropping through a deck seam into a clean space is a problem of its own. Many healthcare facilities require infection control risk assessment procedures for any work that disturbs the building envelope. We follow the plan your facility puts in place and document what we did, in case it gets reviewed later."] },
    { t: "Penetration Density and Equipment", c: ["Medical buildings carry more rooftop equipment per square foot than most commercial property. Individual units serving separate suites, dedicated exhaust for labs and soiled utility rooms, isolation room exhaust, medical gas vents, sterilizer and vacuum pump discharges, and the condensate lines that come with all of it. Every one of those is a penetration, and penetrations are where low-slope roofs leak. Vibration from running equipment works flashings loose at the curbs over time.", "Condensate discharged onto the membrane instead of into a drain creates a permanently wet area that fails early. Gas lines and conduit resting directly on the membrane abrade it. We inspect each curb, pitch pocket, and equipment support, and we flag what was added after the original installation, because tenant improvement work is where most non-conforming penetrations come from. When equipment gets replaced, the old curb is frequently left in place and sealed over rather than removed and properly flashed. Those are the details we photograph and price, and they are usually inexpensive relative to what they prevent."] },
    { t: "Odor, Noise, and Patient Schedules", c: ["Roofing over occupied clinical space carries constraints most commercial work does not. Hot asphalt fumes and solvent-based adhesives get pulled straight into rooftop air intakes and end up in exam rooms and waiting areas. Torch-applied work near intakes or oxygen storage is a nonstarter. Fastening and demolition noise carries through a deck into rooms where a clinician is trying to hear a patient.", "So system selection is not only a performance question. Low-odor adhesives, mechanically attached assemblies, and self-adhered products exist for exactly this situation, and sometimes the right answer is putting the noisy phase in an afternoon the practice blocks off or a weekend the suite is closed. We ask about the schedule first: which rooms are in use when, where the air intakes sit, which days carry procedures, and whether a suite can shift for a day. Then the sequence gets built around those answers and put in writing, so the practice manager knows what to expect before the first truck shows up."] },
    { t: "Landlord, Tenant, and the Paper Trail", c: ["A medical office building usually involves at least three parties with a stake in the roof: the owner, the property manager, and a practice with expensive equipment and its own lease obligations. Who pays for what depends on the lease, and often on whether the penetration in question came in as part of a tenant improvement. Documentation settles that. Our reports show the location of each finding against a roof plan, dated photos of the condition, and a description of the cause, so a conversation about responsibility runs on evidence rather than recollection.", "The same report supports a warranty claim, since manufacturers require documented maintenance and will look for it before they pay. For owners and asset managers we provide remaining useful life estimates and prioritized budget figures formatted for capital planning without rewriting. For the practice we provide a plain summary of what happened, what we did, and what to watch for. Everyone works from the same set of facts, which is usually the fastest route to a decision."] }
  ] },
  "contact": { tag: "Contact", title: "Talk to a Commercial Roofer in", highlight: "Houston", desc: "Call, text, or send the form below. We answer within 24 hours and usually the same day. Every assessment includes a walk of the roof and a photo report you can forward to ownership or insurance.", sections: [
    { t: "How to Reach Us", c: ["Phone and text both go to the same number, 713-367-1495. Email reaches Wade directly at wade@coonsroofing.com. If you have an active leak during business hours, call rather than email so we can get someone moving.", "Office hours are Monday through Friday, 7am to 6pm. Emergency leak response runs outside those hours as well, including weekends during storm season."] },
    { t: "What Happens After You Reach Out", c: ["We ask a few questions about the building, the roof system if you know it, and what you are seeing. Then we schedule a walk. The assessment is free and there is no obligation attached to it.", "You get a photo report documenting current conditions, problem areas, and recommended next steps, formatted so you can forward it straight to ownership, a board, or an insurance carrier without rewriting anything."] },
    { t: "Where We Work", c: "Harris, Fort Bend, Montgomery, Galveston, and Brazoria counties, covering Houston and the surrounding metro. If you manage buildings in more than one of those, one point of contact covers all of them." },
  ], posts: ["commercial-roof-inspection-houston", "signs-commercial-roof-needs-repair"] },

  repair: { posts: ["signs-commercial-roof-needs-repair", "tpo-roof-repair-houston", "commercial-roof-leak-during-business-hours"], tag: "Roof Repair", title: "Commercial Roof Repair in", highlight: "Houston", desc: "Membrane deterioration, failed flashings, storm damage, and ponding water all need targeted repair before they escalate. We respond within 24 hours and deliver clear proposals before any work begins.", sections: [
    { t: "How We Handle Repairs", c: "Every repair starts with a full diagnostic, not a guess. We identify the root cause, document it with photos, and present you with options ranked by cost and longevity. No work begins until you approve the scope and price in writing." },
    { t: "What We Repair", c: "Punctured or deteriorated membranes, failed pipe boot flashings, cracked or separated seams, ponding water issues, damaged drains and scuppers, storm and wind damage, HVAC curb leaks, and parapet wall flashing failures. We work on TPO, PVC, modified bitumen, metal, built-up, and coated systems." },
    { t: "Insurance-Ready Documentation", c: "Every completed repair includes timestamped before and after photos, a written summary of work performed, material specs, and warranty information. Reports are formatted so you can submit them directly to your insurance carrier or forward to ownership without additional work on your end." },
    { t: "Repair vs. Replace", c: "We only recommend replacement when the numbers genuinely support it. If a targeted repair at $3,000 gives you another 5 years, that's the honest recommendation. We'll show you the math and let you decide. No pressure to over-buy." },
  ]},
  maintenance: { posts: ["commercial-roof-maintenance-program-houston", "roof-maintenance-protects-warranty", "property-manager-roof-maintenance-budgeting"], tag: "Roof Maintenance", title: "Commercial Roof Maintenance in", highlight: "Houston", desc: "A well-maintained commercial roof lasts years beyond its expected lifespan. Our maintenance program provides scheduled inspections, documented condition reports, and early-intervention repairs.", sections: [
    { t: "Preventative Maintenance Program", c: "Scheduled semi-annual inspections with full photo reports. We check every drain, seam, flashing, penetration, and membrane section. We rank findings by urgency so you know exactly what to budget for." },
    { t: "Why Maintenance Pays for Itself", c: "A $500 maintenance visit that catches a failing flashing saves a $15,000 interior damage claim. Documented maintenance also keeps manufacturer warranties valid and gives you leverage with insurance carriers. The math is simple: $1,200 per year in maintenance vs. $20,000+ in deferred damage." },
    { t: "What's Included", c: "Drain clearing, seam and flashing inspection, membrane condition assessment, photo-documented report with findings ranked by priority, minor repairs completed same-visit, and a recommended 12-month action plan." },
    { t: "Portfolio Maintenance Plans", c: "Managing multiple properties? We offer portfolio maintenance plans with a single point of contact, consistent reporting across all buildings, and volume pricing. One call to schedule, one set of reports, one relationship. Ask about custom maintenance agreements for property management companies." },
  ]},
  coatings: { posts: ["roof-coating-restoration-guide", "fluid-applied-metal-roof-restoration-houston", "commercial-roof-replacement-what-to-expect"], tag: "Coating & Restoration", title: "Roof Coatings & Restoration in", highlight: "Houston", desc: "Extend your roof's life 15-20 years and push out major capital expenses. We coordinate with tenants, provide detailed documentation for your board, and complete work with minimal disruption.", sections: [
    { t: "Restore Instead of Replace", c: "A coating restoration pushes out major capital expenses by extending your roof's life 15-20 years at 40-60% of replacement cost. No tear-off, no dumpsters, no multi-week disruption to your tenants. Coating systems bond directly to existing membranes, seal every seam and penetration, and create a seamless waterproof barrier. The result: a renewed roof with a new manufacturer-backed warranty and your capital budget intact." },
    { t: "Silicone vs. Acrylic", c: "Silicone coatings handle ponding water and UV exposure better than anything else on the market. If your roof has low spots where water sits after rain, silicone is the answer. Acrylic coatings cost less and work great on sloped sections where water drains quickly. They also deliver better reflectivity and energy savings. Most Houston commercial roofs benefit from silicone on the flat areas with acrylic on any sloped sections." },
    { t: "Coating Systems We Install", c: "We install coating systems from Western Colloid, Karnak, and Everest Systems. Each manufacturer has specific strengths depending on your existing membrane, ponding conditions, and budget. All come with manufacturer-backed warranties when installed by a certified applicator." },
    { t: "When Coatings Won't Work", c: "Coatings only work on structurally sound roofs. If you've got widespread membrane failure, saturated insulation, or deck damage, coating over the top just hides the problem. That's why we always inspect before we quote. We've walked away from coating jobs and recommended replacement instead because it was the honest call." },
    { t: "Restoring a Metal Roof?", c: "Metal deserves its own playbook. Fastener-by-fastener prep, rust-inhibitive primers, reinforced seams, and the right chemistry for your slope and ponding conditions. We put the full breakdown, including real cost numbers, in our metal roof coating guide.", link: { to: "metal-roof-coating-houston", label: "Read the Metal Roof Coating Guide" } },
  ]},
  replacement: { posts: ["commercial-roof-replacement-what-to-expect", "tpo-vs-pvc-houston", "roof-coating-restoration-guide"], tag: "Roof Replacement", title: "Commercial Roof Replacement in", highlight: "Houston", desc: "When it's truly time for a new roof, we walk you through every step. System selection, budgeting, scheduling, and installation. Full documentation throughout.", sections: [
    { t: "When Replacement Makes Sense", c: "We only recommend replacement when repair costs exceed 30% of a new roof, the membrane has reached end-of-life, or building code requirements mandate a new system. We'll show you the math so you can make an informed decision, not an emotional one." },
    { t: "Systems We Install", c: "TPO single-ply for cost-effective performance on standard commercial buildings. PVC for chemical resistance near restaurants, kitchens, and industrial facilities. Modified bitumen for heavy-traffic roofs. Metal retrofits for long-term durability. All installed under manufacturer warranty through Versico, FiberTite, Duro-Last, and GAF." },
    { t: "Timeline and Tenant Impact", c: "A typical 15,000-20,000 square foot commercial re-roof takes 5-10 working days. Your tenants will hear noise. There will be trucks and materials in the lot. We communicate daily about progress and keep the site clean every evening. For occupied buildings, we can schedule work around business hours or noise-sensitive tenants." },
    { t: "What to Expect", c: "Detailed proposal with system specs, timeline, and total cost. Weekly progress updates with photos. Clean job site daily. Final walkthrough with punch list. Complete warranty documentation delivered to your office. Before and after photos for your property records." },
  ]},
  inspections: { posts: ["commercial-roof-inspection-houston", "signs-commercial-roof-needs-repair", "property-manager-roof-maintenance-budgeting"], tag: "Roof Inspections", title: "Commercial Roof Inspections in", highlight: "Houston", desc: "Whether you're evaluating an acquisition, assessing storm damage, or planning maintenance, our inspections give you the documentation and clarity you need.", sections: [
    { t: "What We Inspect", c: "Every membrane section, seam, and flashing. All penetrations including HVAC curbs, pipes, and vents. Drainage systems, scuppers, and gutters. Parapet walls and coping. Edge metal and terminations. Interior leak evidence when accessible." },
    { t: "The Report You Get", c: "Photo-documented findings organized by urgency: immediate action, plan within 6 months, and monitor. Budget estimates for recommended repairs. Remaining useful life assessment. Everything formatted so you can forward it to ownership, insurance, or your capital planning team without rewriting anything." },
    { t: "When You Need One", c: "Before purchasing or selling commercial property. After any major storm event. For annual maintenance planning. Before warranty expiration deadlines. When tenants report leaks or water stains. When budgeting capital expenditures for the next fiscal year." },
    { t: "Insurance and Real Estate Inspections", c: "We provide the detailed documentation that insurance carriers need to process claims and that buyers and sellers need during due diligence. Our reports include the specific data points underwriters look for: membrane condition ratings, remaining useful life estimates, and repair cost projections with supporting photos." },
  ]},
  emergency: { posts: ["commercial-roof-leak-during-business-hours", "houston-storm-season-roof-preparation", "commercial-roof-storm-damage-insurance-claim-houston"], tag: "Emergency Roofing", title: "Storm & Emergency Repair in", highlight: "Houston", desc: "Water coming through the ceiling can't wait. We respond to emergency calls across the Houston metro the same day. Temporary protection first, permanent repair second.", sections: [
    { t: "Our Emergency Process", c: "Call or text 713-367-1495. We dispatch a crew to stop active water intrusion with temporary weatherproofing. Within 48 hours we deliver a full damage assessment with photos and a permanent repair proposal. You'll never be left wondering what's happening or what it costs." },
    { t: "Storm Damage Response", c: "When hail, wind, or heavy rain damages your roof, we assess the full scope, not just the visible leak. We check the entire membrane for hidden damage that could surface weeks later and document everything for insurance. Houston averages 3-5 significant storm events per year. Being prepared matters." },
    { t: "Insurance Claim Support", c: "We provide the timestamped photos, damage assessments, and repair documentation that insurance adjusters need to process your claim. We've helped dozens of building owners get claims approved by providing clear, professional evidence of storm damage alongside pre-existing condition documentation." },
    { t: "After-Hours Availability", c: "Our emergency line is monitored after hours and weekends. We prioritize active water intrusion calls and can typically have a crew on-site within hours, not days. If water is coming through your ceiling, don't wait until Monday morning." },
  ]},
  about: { tag: "About Us", title: "Meet", highlight: "Coons Roofing", desc: "Wade Coons built a commercial roofing company that property managers and building owners across Houston trust with their most important assets.", sections: [
    { t: "Owner on Every Project", c: "You deal with the decision-maker, not a salesperson. Wade is directly involved on every project, from initial inspection through final walkthrough. That's how we maintain the quality and communication commercial clients require." },
    { t: "Our Approach", c: "Repair. Maintain. Restore. Replace only when necessary. Every recommendation is backed by documentation and the math to support it. We don't sell roofs. We solve roofing problems in the most cost-effective way possible." },
    { t: "Built for Property Managers", c: "We understand that a property manager's job is putting out fires all day. You don't have time to chase your roofer for updates or explain what a photo report needs to look like. We built our entire process around how PMs actually work: clear communication, fast turnaround, and documentation you can forward without editing." },
    { t: "Certifications and Coverage", c: "Certified installer for Versico, FiberTite, Duro-Last, Karnak, Everest Systems, IPC, Western Colloid, Elevate, and GAF. Fully insured with General Liability and Workers Compensation coverage. Certificates provided before work begins on every project." },
  ]},
  houston: { cities: true, posts: ["commercial-roof-maintenance-program-houston", "signs-commercial-roof-needs-repair", "houston-storm-season-roof-preparation"], tag: "Houston Metro", title: "Commercial Roofing Across the", highlight: "Houston Metro", desc: "Coons Roofing is Houston's commercial roofing contractor for property managers and building owners. Repair, maintenance, coatings, and replacement across the metro. We repair and restore first, and recommend replacement only when the numbers genuinely support it.", sections: [
    { t: "Commercial Roofing Built for Houston's Climate", c: "Houston is brutal on flat and low-slope roofs. Relentless heat and UV break down membranes, sudden downpours expose every drainage weakness, and hurricane season tests every seam and flashing. We specialize in the commercial systems built to handle it, and we know how Houston buildings fail before they do." },
    { t: "Every System, Every Building Type", c: "TPO, PVC, modified bitumen, built-up, metal, and coating restorations across office buildings, retail and strip centers, warehouses, industrial facilities, medical offices, churches, and multi-family properties. Certified installer for Versico, FiberTite, Duro-Last, GAF, Western Colloid, and more." },
    { t: "Documentation Property Managers Actually Need", c: "Every inspection and repair comes with timestamped photo reports formatted for ownership, boards, and insurance carriers. Managing a portfolio? One point of contact, consistent reporting standards, and a documented history for every building." },
    { t: "Serving the Entire Houston Metro", c: "From inside the Loop to Katy, The Woodlands, Sugar Land, Pearland, League City, Spring, Cypress, Tomball, Pasadena, and Conroe. Same-day emergency response across Harris, Montgomery, Fort Bend, Galveston, and Brazoria counties." }
  ]},
  "tpo-roofing-houston": { posts: ["tpo-vs-pvc-houston", "tpo-roof-repair-houston"], tag: "TPO Roofing", title: "TPO Roofing in", highlight: "Houston", desc: "Certified TPO installation, repair, and replacement for Houston commercial buildings. An energy-efficient single-ply membrane built for Texas heat, with reflective surfaces that cut cooling costs.", sections: [
    { t: "Why TPO Works in Houston", c: "TPO's reflective white membrane bounces back the Texas sun, lowering roof surface temperatures and cutting cooling bills on big-footprint commercial buildings. It's heat-welded into a monolithic, watertight surface, and it's the most cost-effective single-ply system for standard commercial roofs in our climate." },
    { t: "TPO Installation & Replacement", c: "We're certified to install warranty-backed TPO systems from leading manufacturers. We handle tear-off, decking and insulation, mechanically-attached or fully-adhered membrane, and detailed flashing work, with daily clean-up and weekly photo progress updates throughout the project." },
    { t: "TPO Repair", c: "Most TPO problems start at seams, penetrations, and flashings. We diagnose the root cause, hot-air weld permanent repairs, and document everything with before and after photos. No band-aids, no callbacks." },
    { t: "TPO vs. PVC vs. Other Systems", c: "TPO is the value leader for most buildings. PVC is the better call near restaurants and industrial sites where grease and chemicals attack the membrane. We'll tell you honestly which system fits your building and budget, not just what we'd rather install." }
  ]},
  "flat-roof-repair-houston": { posts: ["flat-roof-drainage-problems-houston", "signs-commercial-roof-needs-repair"], tag: "Flat Roof Repair", title: "Flat Roof Repair in", highlight: "Houston", desc: "Fast, permanent flat and low-slope commercial roof repair across the Houston metro. Leaks, ponding water, failed seams and flashings, and storm damage, with same-day response on active water intrusion.", sections: [
    { t: "Common Flat Roof Problems in Houston", c: "Ponding water that never drains, split or open seams, cracked pipe-boot and curb flashings, clogged or undersized drains, and storm-driven punctures. On Houston's flat commercial roofs, small issues become interior-damage claims fast. We find the real source, not just the visible drip." },
    { t: "Our Repair Process", c: "Every repair starts with a full diagnostic, not a guess. We identify the root cause, document it with photos, and present a clear proposal before any work begins. Then we make a permanent repair and send you timestamped before-and-after documentation for your records or insurance." },
    { t: "Systems We Repair", c: "TPO, PVC, modified bitumen, built-up roofing, and metal. Whatever's on your building, we carry the certifications and materials to repair it correctly and keep your manufacturer warranty intact." },
    { t: "Repair vs. Replace", c: "We repair and restore first. We only recommend replacement when the numbers genuinely support it. If a targeted repair buys you years of reliable service, that's what we'll tell you, even when a full re-roof would be a bigger ticket for us." }
  ]},
  projects: { tag: "Our Work", title: "Recent", highlight: "Projects", desc: "Detailed case studies from commercial roofing projects across the Houston metro.", sections: [
    { t: "Project Gallery Coming Soon", c: "We're building out our gallery with before/after photos, scope details, and system specs from recent jobs. Call 713-367-1495 to discuss your building type, and we can share relevant examples directly." },
  ]},
  "metal-roof-coating-houston": { tag: "Metal Roof Coating", title: "Metal Roof Coating in", highlight: "Houston", desc: "Fluid-applied coating systems that stop leaks, kill rust, and add 10 to 20 years of life to your metal roof at 40 to 60 percent less than replacement. Certified applicators for IPC, Karnak, Everest Systems, and Western Colloid.", sections: [] },
};

/* Per-post SEO + imagery. Kept separate so published body copy is never touched. */
export const BLOG_SEO = {
  "fluid-applied-metal-roof-restoration-houston": { t: "Fluid-Applied Metal Roof Restoration", d: "Fluid-applied coatings can restore an aging Houston metal roof for a fraction of tear-off cost. See how the system works and when replacement still wins.", img: "/metal-1.jpg", hero: "/metal-1-hero.jpg", h: {"0": "Why Houston Metal Roofs Fail", "3": "What a Fluid Applied Restoration Does", "7": "The Energy and Warranty Payoff", "10": "Book a Free Roof Assessment"} },
  "commercial-roof-maintenance-program-houston": { t: "Commercial Roof Maintenance Programs", d: "A scheduled maintenance program catches small roof problems before they turn into six-figure failures. Here is what one covers on a Houston commercial roof.", img: "/blog-maintenance.jpg", hero: "/blog-maintenance-hero.jpg", h: {"0": "Why Houston Roofs Age Faster", "1": "What a Real Program Covers", "2": "Why Documentation Matters", "3": "The Ponding Water Problem", "4": "Repair Before Replacement"} },
  "tpo-roof-repair-houston": { t: "TPO Roof Repair: Signs and Costs", d: "Seam splits, punctures and ponding on a TPO roof are usually repairable. Learn the warning signs, the repair process and what drives cost in Houston.", img: "/blog-tpo-repair.jpg", hero: "/blog-tpo-repair-hero.jpg", h: {"0": "How TPO Roofs Fail in Houston", "1": "Warning Signs to Watch For", "2": "What a Proper Repair Looks Like", "3": "What Drives Repair Cost", "4": "Coating as a Middle Path"} },
  "commercial-roof-storm-damage-insurance-claim-houston": { t: "Roof Storm Damage Insurance Claims", d: "Documentation and timing decide whether a storm damage claim gets paid. Here is how Houston property owners should inspect, file and work with an adjuster.", img: "/blog-storm.jpg", hero: "/blog-storm-hero.jpg", h: {"0": "Storm Damage You Cannot See", "1": "Your First Moves After a Storm", "2": "Why the Photo Report Matters", "3": "Working With the Adjuster", "4": "Watch Out for Replacement Pressure"} },
  "commercial-roof-inspection-houston": { t: "Commercial Roof Inspection Frequency", d: "Twice a year is the minimum for a Houston commercial roof, plus a check after any major storm. Here is what a real inspection covers and why it matters.", img: "/blog-inspection.jpg", hero: "/blog-inspection-hero.jpg", h: {"0": "How Often to Inspect", "1": "The Mistake Most Managers Make", "2": "What an Inspection Should Cover", "3": "Inspections Protect Your Warranty", "4": "What We See in Houston"} },
  "tpo-vs-pvc-houston": { t: "TPO vs PVC Commercial Membranes", d: "TPO costs less and suits most Houston commercial buildings, while PVC earns its price around grease and chemicals. Compare cost, welds and service life.", img: "/blog-tpo-pvc.jpg", hero: "/blog-tpo-pvc-hero.jpg", h: {"0": "Where TPO Makes Sense", "1": "When PVC Is Worth It", "2": "Seam and Weld Strength", "3": "Our Recommendation for Most Buildings"} },
  "signs-commercial-roof-needs-repair": { t: "5 Signs Your Roof Needs Repair", d: "Ponding water, blisters, loose flashings and interior stains all point to repair rather than replacement. Learn the five signs Houston managers should watch.", img: "/blog-repair-signs.jpg", hero: "/blog-repair-signs-hero.jpg", h: {"0": "Ponding Water After 48 Hours", "1": "Blistering and Trapped Moisture", "2": "Flashing Separation at Penetrations", "3": "Interior Stains and Musty Smells", "4": "A Roof Past 15 Years"} },
  "roof-coating-restoration-guide": { t: "Roof Coating Restoration Guide", d: "A coating restoration adds 10 to 20 warranted years at roughly half the cost of replacement. See how silicone and acrylic systems perform on Houston roofs.", img: "/blog-coating.jpg", hero: "/blog-coating-hero.jpg", h: {"0": "How a Coating System Works", "1": "Silicone Versus Acrylic Coatings", "2": "When Coating Is the Wrong Call", "3": "The Budget Case for Managers", "4": "Systems We Install"} },
  "commercial-roof-leak-during-business-hours": { t: "Commercial Roof Leak: What to Do", d: "Water dripping through a tenant ceiling needs a specific order of operations. Follow these four steps to protect the building and your insurance claim.", img: "/blog-leak.jpg", hero: "/blog-leak-hero.jpg", h: {"0": "Contain the Interior Damage First", "1": "Call Your Roofer Immediately", "2": "Document Everything for the Claim", "3": "Notify Your Insurance Carrier", "4": "What Not to Do"} },
  "property-manager-roof-maintenance-budgeting": { t: "Roof Maintenance Budgeting Guide", d: "Two inspections a year cost far less than one failed flashing. Use these per square foot numbers to budget roof maintenance and a proper reserve fund.", img: "/blog-budgeting.jpg", hero: "/blog-budgeting-hero.jpg", h: {"0": "What Maintenance Actually Costs", "1": "The Price of Deferred Repairs", "2": "A Simple Budgeting Framework", "3": "Building a Roof Reserve Fund", "4": "Maintenance Records Protect Warranties"} },
  "houston-storm-season-roof-preparation": { t: "Storm Season Roof Preparation", d: "Clear drains, tight edge metal and a written emergency plan carry a commercial roof through Houston storm season. Here is the checklist to work through.", img: "/blog-storm-prep.jpg", hero: "/blog-storm-prep-hero.jpg", h: {"0": "Clear Every Drain and Scupper", "1": "Check Edge Metal and Coping", "2": "Secure Rooftop Equipment", "3": "Have an Emergency Plan Ready", "4": "Inspect Within 48 Hours"} },
  "roofing-contractor-insurance-requirements": { t: "Roofing Contractor Insurance Basics", d: "General liability and workers comp protect you, not just the roofer, and Texas lets contractors skip the second one. Learn what to verify before you sign.", img: "/blog-insurance.jpg", hero: "/blog-insurance-hero.jpg", h: {"0": "What General Liability Covers", "1": "Why Workers Comp Matters", "2": "Texas Lets Contractors Opt Out", "3": "Verify Coverage Before You Sign"} },
  "flat-roof-drainage-problems-houston": { t: "Flat Roof Drainage: Causes and Fixes", d: "Clogged drains, blocked scuppers and lost slope turn every Houston downpour into structural load. Learn the causes, the warning signs and the real fixes.", img: "/blog-drainage.jpg", hero: "/blog-drainage-hero.jpg", h: {"0": "Clogged Internal Drains", "1": "Blocked Scuppers at the Parapet", "2": "When the Slope Is Inadequate", "3": "Signs You Have a Problem", "4": "How Often to Clear Drains"} },
  "roof-maintenance-protects-warranty": { t: "Roof Maintenance and Your Warranty", d: "Most manufacturer warranties require documented maintenance, and claims do get denied without it. See what counts as maintenance and what compliance costs.", img: "/blog-warranty.jpg", hero: "/blog-warranty-hero.jpg", h: {"0": "What Manufacturers Actually Require", "1": "How Claims Get Denied", "2": "What Counts as Maintenance", "3": "What It Costs to Comply", "4": "Check Your Warranty Language"} },
  "commercial-roof-replacement-what-to-expect": { t: "Commercial Roof Replacement Process", d: "From core samples through closeout, here is what a Houston commercial roof replacement involves, including system choices, timelines and tenant disruption.", img: "/blog-replacement.jpg", hero: "/blog-replacement-hero.jpg", h: {"0": "The Assessment and Core Samples", "1": "Choosing the Right System", "2": "What a Good Proposal Includes", "3": "How Long the Work Takes", "4": "Closeout and Warranty Documents"} },
  "hoa-multifamily-roofing-guide": { t: "HOA and Multi-Family Roofing Guide", d: "Board members hiring a roofer face competing bids, insurance checks and warranty fine print. Here is what to verify before signing on a multi-family roof.", img: "/blog-hoa.jpg", hero: "/blog-hoa-hero.jpg", h: {"0": "Get Three Bids Minimum", "1": "Verify Insurance Before References", "2": "Scheduling Around Residents", "3": "Contractor Versus Manufacturer Warranty", "4": "Documentation for Association Records"} },
};
const bmeta = (p) => BLOG_SEO[p.slug] || {};
/* Phones were downloading desktop-width files. */
export const srcSetFor = (src, small, large) =>
  src.replace(/\.jpg$/, "-sm.jpg") + " " + small + "w, " + src + " " + large + "w";
export const blogCard = (p) => bmeta(p).img || p.img;
export const blogHero = (p) => bmeta(p).hero || bmeta(p).img || p.hero || p.img;

/* ── Blog Data ── */
export const BLOG = [
  { slug: "fluid-applied-metal-roof-restoration-houston", related: ["metal-roof-coating-houston", "coatings"], title: "Why We're Going All In on Fluid-Applied Roofing for Houston's Metal Buildings", date: "August 2026", published: "2026-08-02", read: "7 min", hero: "/metal-1-hero.jpg", img: "/metal-1.jpg", body: [
    "Fluid-applied coating systems are now our primary answer for aging metal roofs across Houston. Not a side offering, not a fallback when the replacement budget dies. The main play. Here is why we made that call, what these systems actually are, and when we still tell an owner to replace instead.",
    "Drive any industrial corridor in this city and you are looking at our reason. Houston is wrapped in metal buildings: warehouses, distribution centers, shops, church gyms, self-storage. Most of them are R-panel roofs screwed down decades ago, and every one of them fights the same physics. The panels bake past 150 degrees by afternoon, swell, then shrink again at night. That daily cycle backs fasteners out of their holes, dry-rots the washers, opens the laps, and grinds away the factory finish until Gulf Coast humidity can start rusting bare steel. The panels usually have plenty of life left. The details holding them together do not.",
    { img: "/metal-3.jpg", cap: "Seams and fastener heads sealed first, then basecoat over the panels" },
    "So the owner calls a roofer about a few leaks, and the quote that comes back is a full tear-off. Two, three, sometimes four hundred thousand dollars, weeks of noise, an exposed building in storm season, and a dumpster parade through the parking lot. For a lot of these roofs, that is the wrong answer to the wrong question.",
    { quote: "The panels usually have plenty of life left. The details holding them together do not." },
    "A fluid-applied restoration attacks the actual failure points instead. We wash the roof, replace or tighten every fastener, prime the rust so it stops, reinforce every seam and penetration, then coat the entire field with an elastomeric topcoat built up to warranty thickness. When it cures, the roof is one seamless waterproof membrane. No exposed screw heads, no open laps, no seams for wind-driven rain to find. It typically runs $2.50 to $5.00 per square foot, against $8 to $15 or more for replacement, and the building stays open the whole time.",
    { img: "/metal-2.jpg", cap: "Working the spray rig down the panel field, hose tended behind" },
    "We got certified with four manufacturers on purpose: IPC, Karnak, Everest Systems, and Western Colloid. Different roofs need different chemistry. Silicone where water ponds, acrylic where the slope sheds, fabric-reinforced systems where an older roof moves too much for coating alone. And here is the part we love: two of the four are made in our backyard. Everest Systems manufactures in Houston and IPC builds their cross-linked acrylics in Pearland. The people formulating these products drive under the same sun and through the same storms your roof does.",
    "The performance case keeps stacking. A white reflective coating can pull a metal roof's surface temperature down by 50 degrees or more on a summer afternoon, which your AC notices immediately. The systems carry manufacturer-backed warranties from 10 to 20 years, with no-dollar-limit and hail-rated options on qualifying roofs. And most of them can simply be recoated when the warranty runs out, which means the tear-off you keep postponing may never need to happen. Ask your CPA how a maintenance coating gets treated on the books versus a capital replacement while you are at it. That conversation surprises a lot of owners.",
    { img: "/metal-4.jpg", cap: "Coating carried around the roof penetrations and curbs" },
    "Now the honest part, because it is the same thing we say on your roof. Coatings do not fix everything. Rusted-through panels, soft decking, and saturated insulation cannot be coated over, and anyone willing to coat over those problems is selling you a very expensive delay. If the roof is structurally sound, restoration usually wins. If it is not, we will show you the photos and tell you to replace it, even when that is not the answer we are hoping to give.",
    "If you own or manage a metal-roofed building anywhere in the Houston metro, get eyes on it before storm season does. We will walk the roof, document everything with photos, and give you the restore-or-replace answer backed by numbers. The assessment is free, and the full breakdown of systems, costs, and warranties is in our metal roof coating guide right here on the site."
  ]},
  { slug: "commercial-roof-maintenance-program-houston", related: ["maintenance", "inspections"], title: "Why Every Houston Commercial Property Needs a Roof Maintenance Program", date: "June 2026", published: "2026-06-12", read: "6 min", img: "/blog-maintenance.webp", body: [
    "A commercial roof maintenance program is a scheduled plan of inspections, cleaning, and small repairs that catches problems before they become five- and six-figure failures. For Houston property managers running flat or low-slope roofs, it's the single highest-ROI line item you're probably underfunding, because every dollar spent on proactive upkeep typically defers a far larger replacement bill.",
    "Houston is one of the harshest roofing environments in the country. Relentless UV bakes membranes for nine months a year, summer heat drives thermal cycling that works seams and flashings loose, and then a single afternoon storm can dump several inches of rain onto a roof that doesn't drain fast enough. A roof that would last 25 years in a milder climate can degrade noticeably faster here without attention. A maintenance program is how you fight that math.",
    "What does a real program look like? At minimum, two scheduled inspections a year — typically spring and fall — plus a check after any major storm event. Each visit should cover the membrane field (TPO, PVC, or modified bitumen), all flashings and penetrations, drains and scuppers, and rooftop equipment curbs. Drains get cleared, debris gets removed, open seams get sealed, and minor punctures get patched on the spot before water finds them.",
    "The other half of a good program is documentation. Every visit should produce a dated photo report showing the condition of key areas, what was repaired, and what's being watched. That record does three things: it gives you a defensible budget when you ask ownership for capital, it preserves your manufacturer warranty (most TPO and PVC warranties require documented maintenance), and it becomes critical evidence if you ever file a storm-damage insurance claim.",
    "Ponding water deserves special mention because it's the issue we flag most often on Houston roofs. Standing water that lingers more than 48 hours after rain accelerates membrane breakdown, voids many warranties, and signals a drainage or slope problem that won't fix itself. A maintenance program catches ponding early — when the answer might be clearing a drain or adding a tapered insulation cricket, not tearing off the roof.",
    "The contractors who push replacement first aren't doing you any favors. The honest approach is to repair and restore while the roof still has life in it, document everything, and only recommend replacement when the inspection data and the numbers genuinely support it. A maintenance program is what gives you that data instead of a guess.",
    "If you're managing commercial property in the Houston area and you don't have a documented maintenance plan in place, that's worth fixing before the next storm season. Schedule a free roof assessment and we'll walk your roof, give you a photo report, and tell you honestly where it stands."
  ]},
  { slug: "tpo-roof-repair-houston", related: ["repair", "coatings"], title: "TPO Roof Repair in Houston: Signs, Process, and What Drives the Cost", date: "June 2026", published: "2026-06-13", read: "6 min", img: "/blog-tpo-repair.webp", body: [
    "Most TPO roof problems in Houston are repairable, and repair almost always costs a fraction of replacement. If you're seeing seam separations, punctures, or ponding on a TPO roof that still has years of membrane life left, the right first move is a targeted repair — not a tear-off. The key is catching the issue early and having someone diagnose the actual cause.",
    "TPO (thermoplastic polyolefin) is one of the most common commercial membranes in Houston for good reason: its reflective white surface fights our brutal heat and UV load, and its heat-welded seams create a strong, watertight bond. But no membrane is maintenance-free. Over years of thermal cycling and sun exposure, the most common failure points show up at the seams, at flashings and penetrations, and anywhere foot traffic or debris has punctured the field.",
    "The warning signs are usually visible if you know where to look. Watch for seams that have lifted or split, cracking or 'crazing' on the membrane surface, water stains on the ceiling or deck below, loose or pulling flashings around HVAC curbs and pipes, and ponding water that sits for days after rain. Any one of these means it's time for an inspection. Several of them together mean water is likely already getting in.",
    "A proper repair process starts with diagnosis, not a quote. A good contractor walks the roof, locates the actual entry points (which are often nowhere near the interior stain), and documents condition with a photo report. From there, repairs typically involve cleaning and re-welding open seams, patching punctures with matching TPO membrane, rebuilding failed flashing details, and addressing the drainage causing any ponding. Done right, a heat-welded TPO patch is as strong as the original.",
    "What drives the cost? A handful of factors: how many repair areas there are, how accessible the roof is, the condition of the surrounding membrane, and whether the underlying insulation has gotten wet and needs replacement. Wet insulation is the big one — if water has been sitting under the membrane, patching the top without addressing the saturated layer below just traps the problem. An honest assessment tells you which situation you're actually in.",
    "There's also a middle path worth knowing about: roof coatings. If a TPO roof is aging but still structurally sound, a restoration coating can extend its service life significantly and restore reflectivity — for far less than replacement. It's not right for every roof, but for the right candidate in Houston's sun, it's a smart way to buy years without a capital project.",
    "If you've got a TPO roof showing any of these signs, get eyes on it before the next storm makes it worse. Schedule a free roof assessment and we'll diagnose the real problem, send you a photo report, and give you a straight answer on repair versus anything bigger."
  ]},
  { slug: "commercial-roof-storm-damage-insurance-claim-houston", related: ["emergency", "inspections"], title: "How to Handle a Commercial Roof Storm Damage Insurance Claim in Houston", date: "June 2026", published: "2026-06-14", read: "7 min", img: "/blog-storm.webp", body: [
    "After a storm hits your commercial roof, the two things that decide whether your insurance claim succeeds are documentation and timing. Get a professional inspection and a dated photo report as soon as it's safe, file promptly, and don't let the damage sit — because in Houston, the next storm is rarely far behind, and insurers push back hard on damage that wasn't documented right away.",
    "Houston sees the full menu of roof-damaging weather: straight-line winds that lift and tear membrane, hail that bruises and fractures the surface, and torrential rain that exploits every weak seam and clogged drain. On flat and low-slope commercial roofs, the damage isn't always obvious from the ground — wind can peel back flashing, hail can compromise the membrane without an obvious hole, and water can travel far from its entry point before it shows up inside.",
    "Your first move after a storm is a safety-first damage assessment. If water is actively coming in, emergency measures — temporary patching, tarping, getting water off the roof — protect the building and, importantly, show the insurer you mitigated further damage, which is something most policies require. Then comes the thorough inspection: a contractor documenting every affected area with photos, measurements, and notes tied to the date of the storm event.",
    "That photo report is the backbone of your claim. Insurers and their adjusters respond to specifics: which seams separated, where the membrane was punctured or bruised, the condition of flashings and penetrations, and clear before-and-after context. This is exactly where a pre-existing maintenance record pays off — if you can show the roof was sound before the storm, it's far harder for an adjuster to write the damage off as 'wear and tear' or a pre-existing condition.",
    "A word on the adjuster process: the insurance company's adjuster works for the insurance company. It's reasonable and common to have your own roofing contractor present during the inspection to make sure all the damage is identified and properly attributed to the storm. Things get missed, and on a large commercial roof, a missed area can mean tens of thousands of dollars that don't make it into the scope.",
    "Be cautious of any contractor whose first instinct is to push a full replacement on insurance. The honest standard is to assess what the storm actually did, repair and restore what can be repaired, and only call for replacement when the damage genuinely warrants it and the numbers support it. That approach keeps your claim credible and your relationship with your carrier intact for the next event.",
    "If a storm has hit your property and you're not sure where you stand, the worst thing you can do is wait. Schedule a free roof assessment and we'll inspect the damage, document it properly for your claim, and help you take the right next step."
  ]},
  { slug: "commercial-roof-inspection-houston", related: ["inspections","maintenance"], title: "How Often Should a Commercial Roof Be Inspected in Houston?", date: "March 2026", read: "5 min", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80", body: [
    "If you manage a commercial property in Houston, your roof takes more punishment than almost any other building component. Between hurricane season, hail, 100-degree summers, and UV exposure that never lets up, the question isn't whether your roof will deteriorate. It's how fast.",
    "The short answer: twice a year minimum. Once in spring before storm season hits, and once in fall after the worst of it passes. If your building took a direct hit from a named storm or a serious hail event, you need an inspection within 48 hours regardless of schedule.",
    "Here's what most property managers get wrong. They wait until a tenant calls about water stains on the ceiling. By that point, the membrane has been compromised for weeks or months. The water you see inside the building traveled laterally through the insulation before it found a path down. The actual failure point could be 30 feet from where the stain shows up. That's a much bigger repair than it needed to be.",
    "A proper commercial roof inspection covers every membrane section, every seam, every flashing around pipes and HVAC curbs, all drainage points including scuppers and internal drains, parapet wall caps, and edge metal. The inspector should be documenting everything with photos and ranking findings by urgency: fix now, plan for within six months, or monitor.",
    "One thing worth knowing: most manufacturer warranties require documented maintenance to stay valid. Skip inspections for two years and you might find out your 20-year NDL warranty doesn't cover the $40,000 repair you just discovered. The inspection costs a few hundred dollars. The warranty coverage it preserves is worth tens of thousands.",
    "In Houston specifically, we see the most damage from ponding water after heavy rain events, UV degradation on exposed TPO and PVC membranes, and wind uplift on edge flashings. All three are catchable with regular inspections before they become emergencies."
  ]},
  { slug: "tpo-vs-pvc-houston", related: ["coatings","replacement"], title: "TPO vs PVC: Which Membrane Is Right for Your Houston Commercial Building?", date: "March 2026", read: "6 min", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80", body: [
    "If you're replacing a commercial roof in Houston, you'll probably hear two acronyms more than any others: TPO and PVC. Both are single-ply membranes. Both work well on flat and low-slope roofs. Both come in white, which helps with energy costs in Texas heat. But they're not interchangeable, and the right choice depends on your building.",
    "TPO (thermoplastic polyolefin) is the more common choice for standard commercial buildings. It costs less per square foot, installs quickly, and performs well against UV exposure. For a typical office building, retail strip center, or warehouse in Houston, TPO is usually the right call. It handles our heat and UV load well, and the price point makes it easier to justify to ownership groups or HOA boards.",
    "PVC (polyvinyl chloride) costs more upfront but earns it back in specific situations. If your building has rooftop grease exhaust (think restaurants, food processing, commercial kitchens), PVC is the only real option. Animal fats and cooking oils break down TPO over time, but PVC shrugs them off. PVC also has better chemical resistance overall, which matters for industrial buildings near refineries or chemical plants. In Houston, that's a real consideration for properties along the Ship Channel or in the industrial east side.",
    "On weld strength, PVC has a slight edge. The heat-welded seams on PVC tend to be stronger than the membrane itself, meaning the seam is the last thing that fails. TPO seams have improved significantly over the past decade, but early-generation TPO had seam issues that gave it a mixed reputation. The current formulations from Versico, Carlisle, and GAF are solid.",
    "For most Houston commercial buildings, our recommendation is TPO with a manufacturer-backed warranty through an approved installer. The cost savings over PVC are significant on a 15,000+ square foot roof, and the performance difference in a non-chemical, non-grease environment is negligible.",
    "If you're on the fence, we'll walk your roof and give you a straight recommendation based on your building's actual conditions. Not a sales pitch for whichever system has the higher margin."
  ]},
  { slug: "signs-commercial-roof-needs-repair", related: ["repair","inspections"], title: "5 Signs Your Commercial Roof Needs Repair Before It Needs Replacement", date: "March 2026", read: "5 min", img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1400&q=80", body: [
    "Not every roofing problem means you need a new roof. In fact, most of the service calls we run in Houston end with a targeted repair, not a replacement proposal. The trick is catching problems early enough that repair is still an option.",
    "First sign: ponding water that stays longer than 48 hours after rain. Some water pooling is normal on flat roofs. But if you've got standing water three days after a storm, your drainage is compromised. Clogged drains, sagging insulation, or settled decking are the usual culprits. Left alone, ponding water accelerates membrane breakdown and adds structural load your roof wasn't designed to carry.",
    "Second sign: blistering or bubbling on the membrane surface. This means moisture got trapped between the membrane and insulation. In Houston's heat, that trapped moisture expands and creates bubbles. Each blister is a weak point that will eventually split open. Catch them small and they're a simple patch. Let them spread and you're looking at a section replacement.",
    "Third sign: visible flashing separation around HVAC units, pipes, or parapet walls. Flashings are the most failure-prone part of any commercial roof because they're where the membrane meets a vertical surface. Thermal cycling in Houston (cool nights, 100-degree days) causes expansion and contraction that pulls flashings away from their substrate over time.",
    "Fourth sign: interior water stains or musty smell. If your tenants are reporting ceiling stains, you're already behind. The leak has been active long enough for water to migrate through the insulation and decking to the interior. The repair scope just tripled because now you're dealing with wet insulation that needs to come out.",
    "Fifth sign: the roof is 15+ years old and has never been recoated or maintained. A TPO or PVC membrane installed in 2010 is approaching the end of its expected service life. That doesn't mean it needs replacement tomorrow, but it does mean an inspection should happen now. Often, a coating restoration can extend the life another 10-15 years at a third of replacement cost."
  ]},
  { slug: "roof-coating-restoration-guide", related: ["coatings","maintenance"], title: "What Property Managers Need to Know About Roof Coating Restoration", date: "March 2026", read: "6 min", img: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1400&q=80", body: [
    "Roof coatings are the most underused tool in a property manager's budget. When the conversation turns to \"the roof is getting old,\" most people jump straight to replacement. That's a $150,000+ conversation for a mid-size commercial building. A coating restoration on the same building runs $50,000-$80,000 and adds 10-20 years of warranted life.",
    "Here's how it works. A fluid-applied coating system goes directly over your existing membrane. The coating fills every seam, crack, and pinhole, creating a seamless waterproof surface on top of what's already there. No tear-off, no dumpsters, no multi-week disruption to your tenants. Most coating jobs take 3-5 days.",
    "Two types dominate the Houston market. Silicone coatings handle ponding water and UV exposure better than anything else. If your roof has areas where water sits after rain, silicone is the answer. It won't break down in standing water the way acrylics do. Acrylic coatings cost less and work great on sloped sections where water drains quickly. They're also better for reflectivity and energy savings.",
    "The catch: coatings only work on roofs that are structurally sound. If your membrane has widespread failure, wet insulation underneath, or structural deck problems, coating over the top just traps the problem. That's why a thorough inspection matters before anyone starts quoting a coating job. We've walked away from coating projects and recommended replacement instead because the existing conditions didn't support it. Coating a bad roof is a waste of money.",
    "For property managers, the business case is straightforward. A coating restoration at 40-60% of replacement cost, with a manufacturer-backed warranty, that extends roof life 10-20 years. No capital expenditure approval needed for most coating budgets. Minimal tenant disruption. And you can time it with your fiscal year instead of waiting for an emergency.",
    "We install coating systems from Western Colloid, Karnak, and Everest Systems. Each has specific strengths depending on your roof type and conditions. Call us for an honest assessment of whether coating makes sense for your building."
  ]},
  { slug: "commercial-roof-leak-during-business-hours", related: ["emergency","repair"], title: "How to Handle a Commercial Roof Leak During Business Hours", date: "March 2026", read: "4 min", img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1400&q=80", body: [
    "It's 10am on a Tuesday. Your tenant calls and says water is dripping from the ceiling onto their office furniture. Here's exactly what to do, in order.",
    "Step one: contain the interior damage. Move furniture and electronics away from the drip zone. Place buckets or trash cans to catch water. If the drip is near electrical panels or wiring, kill power to that area and call an electrician. Water and electricity are the combination you don't ignore.",
    "Step two: call your roofer. Not tomorrow. Not after lunch. Right now. An active leak gets worse with every hour, and if rain is still falling, the damage is compounding. A good commercial roofer can have someone on your roof within hours to apply temporary weatherproofing and stop the active intrusion.",
    "Step three: document everything. Take photos and video of the interior damage, the ceiling stain, any visible water path. Note the time you discovered the leak and the current weather conditions. This documentation matters for insurance claims and for your roofer to trace the leak source. Water travels laterally through roof insulation before it drips through, so the stain on the ceiling is rarely directly below the actual breach.",
    "Step four: notify your insurance carrier. Most commercial property policies cover sudden water intrusion from roof failure. File the claim early even if the full scope isn't known yet. Your roofer should provide inspection photos and a written damage assessment that you can submit with the claim.",
    "What not to do: don't send your maintenance guy up on a wet roof to \"take a look.\" Wet commercial roofs are slip hazards, and an untrained person walking on a membrane can cause more damage. Don't ignore a small drip because it seems minor. Small drips become big problems, especially in Houston where the next rain event could be 4 inches in two hours."
  ]},
  { slug: "property-manager-roof-maintenance-budgeting", related: ["maintenance","inspections"], title: "The Property Manager's Guide to Roof Maintenance Budgeting", date: "March 2026", read: "5 min", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80", body: [
    "If you manage commercial property and you don't have a line item for roof maintenance in your annual budget, you're setting yourself up for a bad surprise. The math on preventative maintenance is some of the clearest math in building operations.",
    "A typical commercial roof maintenance visit costs $300-$600 depending on building size. That visit includes drain clearing, debris removal, a full visual inspection of membranes, seams, flashings, and penetrations, and a written report with photos. Two visits per year puts you at $600-$1,200 annually.",
    "Now compare that to the cost of deferred maintenance. A failed flashing that goes undetected for six months lets water into the insulation. By the time the leak shows up inside the building, you're looking at membrane repair ($2,000-$5,000), insulation replacement ($3,000-$8,000), and interior damage restoration ($5,000-$15,000). That's $10,000-$28,000 for a problem that a $400 inspection would have caught as a $500 flashing repair.",
    "Here's a budgeting framework that works. Set aside $0.10-$0.15 per square foot of roof area annually for maintenance. A 20,000 square foot commercial building should budget $2,000-$3,000 per year. That covers two inspections, minor repairs found during those inspections, and drain maintenance.",
    "For capital planning, budget $0.50-$1.00 per square foot per year into a roof reserve fund. That same 20,000 square foot building would accumulate $10,000-$20,000 per year toward eventual replacement. After 15 years, you've got $150,000-$300,000 set aside, which covers a full replacement without a special assessment or emergency capital call.",
    "One more thing: documented maintenance protects your manufacturer warranty. Most NDL (No Dollar Limit) warranties from TPO and PVC manufacturers require proof of regular maintenance. Skip it, and that 20-year warranty you paid a premium for might not cover the claim when you need it most."
  ]},
  { slug: "houston-storm-season-roof-preparation", related: ["emergency","inspections"], title: "Houston Storm Season: How to Prepare Your Commercial Roof", date: "March 2026", read: "5 min", img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&q=80", body: [
    "Houston's storm season runs roughly June through November, but if you've lived here long enough, you know April hailstorms and March windstorms are just as real. Preparing your commercial roof before the heavy weather hits is the cheapest insurance you'll buy all year.",
    "Start with drains. Every internal drain, scupper, and gutter on your roof should be completely clear of debris before storm season. A single clogged drain during a 3-inch-per-hour Houston downpour turns your roof into a swimming pool. That ponding load can exceed the structural capacity of the deck. We've seen roofs sag permanently from a single storm event where the drains were blocked.",
    "Check your edge metal and coping caps. Wind uplift starts at the edges and corners of a roof. If the edge metal is loose, corroded, or has gaps, that's where wind gets under the membrane and starts peeling it back. A $200 edge repair before the storm prevents a $20,000 membrane replacement after it.",
    "Inspect all rooftop equipment. HVAC units, exhaust fans, satellite dishes, signage. Each one penetrates the membrane and has flashings that can fail. Make sure nothing is loose that could become a projectile in high winds. Secure any rooftop items that aren't permanently mounted.",
    "Know your emergency plan. Have your roofer's number saved, not buried in a file drawer. Identify your building's most vulnerable points (typically edges, corners, and areas around older equipment) so you can communicate quickly if damage occurs. Keep a tarp kit on-site for temporary weatherproofing.",
    "After any significant storm event, get a professional inspection within 48 hours. Hail damage on a commercial membrane often isn't visible from the ground. Small impacts that bruise the membrane without puncturing it can fail weeks later when UV exposure breaks down the weakened material. Document everything for insurance before you make any repairs."
  ]},
  { slug: "roofing-contractor-insurance-requirements", related: ["about","repair"], title: "Why Your Roofing Contractor Should Carry Both GL and Workers Comp", date: "March 2026", read: "4 min", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1400&q=80", body: [
    "This is the thing nobody wants to talk about until something goes wrong. And when it goes wrong on a commercial roof, it goes really wrong.",
    "General Liability insurance covers damage the contractor causes to your property. A roofer drags equipment across your parking lot and cracks the asphalt. A worker drops a tool off the roof and damages a tenant's vehicle. The roofing crew accidentally damages an HVAC unit during membrane work. GL covers all of that. Without it, you're suing the contractor directly. Good luck collecting from a company with no assets.",
    "Workers Compensation covers injuries to the contractor's employees while working on your property. Roofing is consistently ranked in the top 5 most dangerous occupations. Falls, heat exhaustion, burns from hot-applied materials. If a worker gets hurt on your roof and the contractor doesn't carry Workers Comp, that injured worker's attorney is coming after your building's insurance policy. Your commercial property policy was not designed for this, and your premiums will reflect it for years.",
    "In Texas, Workers Comp is not mandatory. That's worth repeating. Texas is one of the few states where employers can opt out of Workers Comp coverage entirely. Some roofing companies do exactly that to lower their overhead. They'll give you a lower bid because their costs are lower. The risk transfers directly to you.",
    "Before you sign any roofing contract, ask for a current Certificate of Insurance showing both GL and Workers Comp coverage. Verify the certificate is active by calling the insurance company listed on it. Make sure the coverage amounts are adequate for your building's value. $1M/$2M GL is standard. Anything less should be a red flag.",
    "At Coons Roofing, we carry both GL and Workers Comp and provide certificates before work starts. Not because someone made us. Because it's the right way to run a commercial roofing company."
  ]},
  { slug: "flat-roof-drainage-problems-houston", related: ["repair","maintenance"], title: "Flat Roof Drainage Problems: Causes, Signs, and Fixes for Houston Buildings", date: "March 2026", read: "5 min", img: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1400&q=80", body: [
    "Houston gets an average of 50 inches of rain per year. Some years, we get that in three months. If your commercial flat roof can't move water off fast enough, every storm becomes a structural event.",
    "The most common drainage failure we see is clogged internal drains. Leaves, roofing granules, HVAC debris, and general dirt accumulate around drain baskets over time. In a slow rain, the drain handles it. In a Houston downpour, the clog creates a dam. Water backs up, spreads across the membrane, and adds hundreds or thousands of pounds of load that the structure wasn't designed to hold.",
    "Scupper blockage is the second most common issue. Scuppers are the openings in parapet walls that let water flow off the edge of the roof. They work great when they're clear. But debris piles up against the parapet wall during storms and blocks the opening. Regular clearing is the fix, and it takes about 10 minutes per scupper during a maintenance visit.",
    "The trickier problem is inadequate slope. Building code requires a minimum 1/4 inch per foot slope toward drains on flat roofs. But over time, insulation compresses, decking settles, and the slope diminishes. Areas that used to drain start holding water. Re-sloping with tapered insulation during the next re-roof is the permanent fix. In the meantime, adding crickets (small sloped diversions) around problem areas can redirect water toward functioning drains.",
    "Signs you have a drainage problem: visible ponding water 48+ hours after rain, algae or vegetation growing on the membrane surface, water stains on the underside of the deck inside the building, or sagging visible from the ground. Any of these warrant a professional inspection.",
    "For Houston buildings specifically, we recommend drain maintenance every 6 months. Before and after storm season. It's the single cheapest maintenance task with the highest return on investment."
  ]},
  { slug: "roof-maintenance-protects-warranty", related: ["maintenance","coatings"], title: "How Roof Maintenance Protects Your Manufacturer Warranty", date: "March 2026", read: "4 min", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&q=80", body: [
    "You paid extra for a manufacturer-backed warranty when your commercial roof was installed. 15 years. 20 years. Maybe even 25 years of coverage with no dollar limit on repairs. That warranty is one of the most valuable assets on your building. And you might be voiding it without knowing.",
    "Most manufacturer warranties from Versico, GAF, Carlisle, Duro-Last, and FiberTite include a maintenance requirement. The specific language varies, but the gist is the same: the building owner must perform regular roof maintenance and keep documentation of that maintenance. Fail to do so, and the manufacturer can deny your warranty claim.",
    "We've seen this happen. A building owner files a claim for a membrane failure on a 10-year-old TPO roof with a 20-year NDL warranty. Manufacturer sends an inspector. Inspector asks for maintenance records. Owner has none. Claim denied. The owner is now paying out of pocket for a repair that the warranty was designed to cover.",
    "What counts as maintenance? At minimum: semi-annual inspections by a qualified roofing professional, documented drain clearing, prompt repair of any identified issues, and written reports with photos stored for the life of the warranty. Some manufacturers also require that maintenance be performed by a contractor who holds their specific certification.",
    "The good news: setting up a maintenance program is simple and cheap relative to the warranty value it protects. Two inspections per year at $300-$500 each. Minor repairs caught during inspections. Reports filed with your property records. Total annual cost: $1,000-$2,000. Value of the warranty it protects: $100,000+.",
    "If you're not sure whether your current warranty requires maintenance, pull out the warranty document and read the exclusions section. Or call us. We can review it with you and set up a maintenance schedule that keeps you covered."
  ]},
  { slug: "commercial-roof-replacement-what-to-expect", related: ["replacement","inspections"], title: "Commercial Roof Replacement: What to Expect from Start to Finish", date: "March 2026", read: "6 min", img: PH_ROOF_PROJECT, body: [
    "If you've been told your commercial roof needs replacement, the first question in your head is probably \"how much.\" The second is \"how long.\" The third is \"how bad is this going to disrupt my tenants.\" Let's walk through the whole process so there are no surprises.",
    "Step one is the assessment. A qualified commercial roofer inspects the existing roof, takes core samples to evaluate insulation condition, checks the structural deck, and documents everything. This determines whether you actually need a full replacement or whether a partial replacement or coating restoration could work. Insist on core samples. Without them, nobody really knows what's happening under the membrane.",
    "Step two is system selection. For most Houston commercial buildings, the options are TPO, PVC, or a coating system over the existing roof. Your roofer should present options with cost comparisons, warranty differences, and expected service life. Metal and modified bitumen are also possibilities depending on the building. This is where certified installer status matters. A contractor certified by Versico or GAF can offer manufacturer-backed warranties that an uncertified installer cannot.",
    "Step three is the proposal. A good commercial roofing proposal includes: the scope of work in plain language, the specific system being installed with manufacturer and product names, the timeline with start and expected completion dates, the total cost with payment terms, and the warranty details including what's covered, what's not, and for how long.",
    "Step four is the actual work. A typical 15,000-20,000 square foot commercial re-roof takes 5-10 working days depending on complexity. Your tenants will hear noise. There will be trucks and materials in the parking lot. A good contractor communicates daily about what's happening and keeps the job site clean at the end of each day. If your building is occupied, weekend and off-hours work might make sense for noise-sensitive tenants.",
    "Step five is closeout. Final walkthrough with the contractor to review the installation. A punch list for any items that need attention. Warranty documents delivered to you with all registration information. Before and after photos for your records. And a maintenance schedule to protect the investment you just made."
  ]},
  { slug: "hoa-multifamily-roofing-guide", related: ["maintenance","inspections"], title: "HOA and Multi-Family Roofing: What Board Members Should Know Before Hiring a Contractor", date: "March 2026", read: "5 min", img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=80", body: [
    "If you sit on an HOA board or manage a multi-family property, roofing decisions come with an extra layer of complexity. You're spending other people's money. You need multiple bids. You need board approval. And you need a contractor who understands that dynamic.",
    "Start by getting three bids minimum. Not because the lowest bid wins, but because three bids give you a sense of the real market price. If two bids come in at $85,000 and one comes in at $45,000, the low bid is either cutting corners on materials, skipping insurance coverage, or planning to hit you with change orders. Boards that chase the cheapest number usually end up paying more in the long run.",
    "Check insurance before you check references. Ask for a Certificate of Insurance showing General Liability and Workers Compensation coverage. Verify it's current by calling the insurance company. An uninsured contractor working on HOA property exposes every homeowner in the association to personal liability. That's not an exaggeration. It's case law.",
    "Ask about scheduling flexibility. Multi-family roofing projects affect residents directly. Noise, debris, parking disruptions. A contractor who can phase the work building by building, schedule the loudest work during business hours when most residents are out, and communicate the schedule to residents in advance is worth more than a contractor who's $5,000 cheaper but shows up at 6am with no notice.",
    "Understand the warranty you're getting. A \"contractor warranty\" means the roofing company promises to fix their work for a period. A \"manufacturer warranty\" means the material manufacturer backs the installation with their own coverage. If the contractor goes out of business in 3 years, the contractor warranty goes with them. The manufacturer warranty survives. For an HOA spending six figures, insist on manufacturer-backed coverage.",
    "Finally, ask for documentation that you can file with your association records. A good commercial roofer provides before and after photos, a written scope of completed work, material specifications, warranty registration, and a recommended maintenance schedule. Your successor on the board needs to find this file five years from now and understand exactly what was done."
  ]},
];

/* ── Blog Components ── */
function BlogList() {
  return (
    <>
      <PageHero tag="Blog" title="Roofing Insights for" highlight="Building Owners" desc="Practical advice for property managers, facility directors, and building owners managing commercial roofs in Houston." />
      <section style={{ background: "#fff", padding: "64px 16px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {BLOG.map((post, i) => (
              <Fade key={post.slug} delay={i * 0.04}>
                <Link to={"blog/" + post.slug} style={{ display: "block", background: C.light, overflow: "hidden", transition: "transform 0.3s", height: "100%" }} onMouseOver={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
                  <img src={blogCard(post)} srcSet={srcSetFor(blogCard(post), 400, 700)} sizes="(max-width: 760px) 100vw, 340px" alt={post.title} width="700" height="467" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} loading="lazy" />
                  <div style={{ padding: 20 }}>
                    <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: C.red, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{post.date} · {post.read} read</div>
                    <div style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: C.black, lineHeight: 1.3 }}>{post.title}</div>
                  </div>
                </Link>
              </Fade>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}

function BlogPost({ slug }) {
  const post = BLOG.find(p => p.slug === slug);
  if (!post) return <PageHero tag="404" title="Post" highlight="Not Found" desc="This blog post doesn't exist." />;
  return (
    <div key={slug}>
      <section style={{ background: `linear-gradient(to bottom, rgba(0,0,0,${true ? 0.58 : 0.6}) 0%, rgba(0,0,0,${true ? 0.62 : 0.7}) 45%, rgba(0,0,0,${true ? 0.88 : 0.85}) 100%), url(${blogHero(post)}) ${true ? "center 32%" : "center"}/cover`, padding: true ? "132px 24px 76px" : "120px 24px 60px", textAlign: "center", minHeight: true ? 430 : undefined, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Fade now><p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{post.date} · {post.read} read</p></Fade>
          <Fade now delay={0.05}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "datePublished": post.published || "2026-03-15",
              "dateModified": post.updated || post.published || "2026-03-15",
              "image": SITE + blogHero(post),
              "author": { "@type": "Person", "@id": SITE + "/about/#wade", "name": "Wade Coons", "jobTitle": "Owner", "url": SITE + "/about/" },
              "publisher": { "@type": "Organization", "name": "Coons Roofing" },
              "description": (bmeta(post).d || post.body[0].slice(0, 155)),
              "mainEntityOfPage": "https://coonsroofing.com/blog/" + post.slug + "/"
            }) }} />
          <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: "clamp(24px,6vw,40px)", color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>{post.title}</h1></Fade>
          <Fade now delay={0.1}><nav aria-label="Breadcrumb" style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}><Link to="home" style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Home</Link><span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>›</span><Link to="blog" style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Blog</Link><span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>›</span><span style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Article</span></nav></Fade>
        </div>
      </section>
      <TrustBar />
      <section style={{ background: "#fff", padding: "48px 0" }}>
        <div style={{ maxWidth: 680, margin: "0 auto 26px", padding: "0 16px", display: "flex", gap: 11, alignItems: "center" }}>
          <img src={COONS_MARK} alt="" aria-hidden="true" style={{ height: 26, width: "auto" }} />
          <div>
            <p style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: C.black, margin: 0 }}>Wade Coons</p>
            <p style={{ fontFamily: F, fontSize: 12, color: C.slate, margin: 0 }}>Owner, Coons Roofing. On the roof since 2022.</p>
          </div>
        </div>
        {post.body.flatMap((item, i) => {
          const hs = (bmeta(post).h || {})[String(i)];
          return hs ? [item, { h: hs }] : [item];
        }).map((item, i) => {
          if (typeof item === "string") return (
            <div key={i} style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
              <Fade><p style={{ fontFamily: F, fontSize: 16, color: C.slate, lineHeight: 1.85, marginBottom: 24 }}>{item}</p></Fade>
            </div>
          );
          if (item.quote) return <Fade key={i}><div style={{ margin: "6px 0 34px" }}><QuoteBand text={item.quote} /></div></Fade>;
          if (item.h) return (
            <div key={i} style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
              <Fade><h2 style={{ fontFamily: F, fontWeight: 900, fontSize: "clamp(19px,3.4vw,25px)", color: C.black, lineHeight: 1.25, margin: "16px 0 14px" }}>{item.h}</h2></Fade>
            </div>
          );
          return (
            <div key={i} style={{ maxWidth: 880, margin: "0 auto", padding: "0 16px" }}>
              <Fade><div style={{ margin: "6px 0 36px" }}><Figure src={item.img} cap={item.cap} /></div></Fade>
            </div>
          );
        })}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
          {post.related && post.related.length > 0 && (
            <Fade delay={0.15}>
              <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #eee" }}>
                <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.red, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Related Services</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {post.related.map(r => PAGES[r] && <Link key={r} to={r} style={{ background: C.light, padding: "10px 16px", fontFamily: F, fontSize: 13, fontWeight: 700, color: C.black }}>{PAGES[r].tag}</Link>)}
                </div>
              </div>
            </Fade>
          )}
          <Fade delay={0.16}><RelatedPosts slug={slug} /></Fade>
          <Fade delay={0.18}>
            <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontFamily: F, fontSize: 12, color: C.slate }}>Share:</span>
              <a href={"https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent("https://coonsroofing.com/blog/" + post.slug + "/")} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#0A66C2", color: "#fff", fontFamily: F, fontSize: 11, fontWeight: 700, textDecoration: "none", borderRadius: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                LinkedIn
              </a>
            </div>
          </Fade>
          <Fade delay={0.2}>
            <div style={{ background: C.light, padding: 32, marginTop: 24, textAlign: "center" }}>
              <p style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: C.black, marginBottom: 8 }}>Need help with your commercial roof?</p>
              <p style={{ fontFamily: F, fontSize: 13, color: C.slate, marginBottom: 20 }}>We'll walk your roof, take photos, and give you straight answers.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 300, margin: "0 auto" }}>
                <a href="tel:+17133671495" style={{ background: C.red, color: "#fff", padding: "14px 24px", fontFamily: F, fontSize: 13, fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: 1, textAlign: "center", minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>Call 713-367-1495</a>
                <a href="/#contact" style={{ border: `2px solid ${C.red}`, color: C.red, padding: "12px 24px", fontFamily: F, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, textAlign: "center", minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Schedule Complimentary Assessment</a>
              </div>
            </div>
          </Fade>
        </div>
      </section>
      <CTA />
    </div>
  );
}

function ServicePage({ slug }) {
  const p = PAGES[slug];
  if (!p) return <PageHero tag="404" title="Page" highlight="Not Found" desc="This page doesn't exist yet." />;
  return (
    <div key={slug}>
      <PageHero tag={p.tag} title={p.title} highlight={p.highlight} desc={p.desc} />
      <TrustBar />
      {p.sections.map((s, i) => (
        <PageSection key={i} mark title={s.t} bg={i % 2 === 0 ? "#fff" : C.light}>
          {(Array.isArray(s.c) ? s.c : [s.c]).map((para, n) => (
            <p key={n} style={{ fontFamily: F, fontSize: 15, color: C.slate, lineHeight: 1.8, marginBottom: 14 }}>{para}</p>
          ))}
          {s.link && <div style={{ marginTop: 18 }}><Link to={s.link.to} style={{ display: "inline-block", background: C.red, color: "#fff", padding: "12px 22px", fontFamily: F, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.link.label}</Link></div>}
        </PageSection>
      ))}
      {p.cities && (
        <PageSection mark title="Where We Work Across the Metro" bg="#fff">
          <p style={{ fontFamily: F, fontSize: 15, color: C.slate, lineHeight: 1.8, marginBottom: 18 }}>
            We cover Harris, Fort Bend, Montgomery, Galveston, and Brazoria counties. Pick your city for local detail on what we see on roofs there.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
            {CITIES.map(c => (
              <Link key={c.slug} to={c.slug} style={{ display: "block", background: C.light, padding: "13px 16px", fontFamily: F, fontSize: 14, fontWeight: 700, color: C.black, textDecoration: "none" }}>{c.name}</Link>
            ))}
          </div>
        </PageSection>
      )}
      {p.posts && p.posts.length > 0 && (
        <PageSection mark title="Related Reading" bg={p.sections.length % 2 === 0 ? "#fff" : C.light}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}>
            {p.posts.map(ps => { const o = BLOG.find(b => b.slug === ps); return o ? (
              <Link key={ps} to={"blog/" + ps} style={{ textDecoration: "none", display: "block" }}>
                <img src={blogCard(o)} srcSet={srcSetFor(blogCard(o), 400, 700)} sizes="(max-width: 700px) 100vw, 230px" alt={o.title} width="700" height="467" loading="lazy" style={{ width: "100%", aspectRatio: "3 / 2", objectFit: "cover", display: "block", background: C.light }} />
                <p style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: C.black, lineHeight: 1.35, marginTop: 8 }}>{o.title}</p>
              </Link>
            ) : null; })}
          </div>
        </PageSection>
      )}
      <section style={{ background: C.light, padding: "48px clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Fade>
            <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>Related Services</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {Object.entries(PAGES).filter(([k]) => k !== slug && k !== "about" && k !== "projects").slice(0, 3).map(([k, v]) => (
                <Link key={k} to={k} style={{ padding: "10px 20px", background: "#fff", fontFamily: F, fontSize: 12, fontWeight: 700, color: C.black, letterSpacing: 0.5, transition: "background 0.3s" }}
                  onMouseOver={e=>e.currentTarget.style.background="#e8e8e8"} onMouseOut={e=>e.currentTarget.style.background="#fff"}>{v.tag}</Link>
              ))}
            </div>
          </Fade>
        </div>
      </section>
      <CTA />
    </div>
  );
}


function CityPage({ slug }) {
  const city = CITIES.find(c => c.slug === slug);
  if (!city) return <PageHero tag="404" title="Page" highlight="Not Found" desc="This page doesn't exist." />;
  const extra = CITY_EXTRA[slug] || {};
  return (
    <div key={slug}>
      <PageHero tag={"Service Area: " + city.county} title={"Commercial Roofing in"} highlight={city.name} desc={city.desc} />
      <TrustBar />
      <PageSection title={"Why " + city.name + " Building Owners Choose Coons Roofing"} bg="#fff">
        <p style={{ fontFamily: F, fontSize: 15, color: C.slate, lineHeight: 1.8 }}>{city.detail}</p>
        {extra.local && <p style={{ fontFamily: F, fontSize: 15, color: C.slate, lineHeight: 1.8, marginTop: 16 }}>{extra.local}</p>}
      </PageSection>
      <PageSection title="Services Available" bg={C.light}>
        <p style={{ fontFamily: F, fontSize: 15, color: C.slate, lineHeight: 1.8 }}>We provide the full range of commercial roofing services in {city.name}: inspections, preventative maintenance, repair, coatings and restoration, and full replacement when the numbers support it. Every service includes photo-documented reports you can forward directly to ownership or insurance.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>{["Inspections","Maintenance","Repair","Coatings","Replacement","Emergency"].map(s=><Link key={s} to={s.toLowerCase()} style={{ background: "rgba(230,34,54,0.08)", border: "1px solid rgba(230,34,54,0.2)", padding: "8px 16px", fontFamily: F, fontSize: 12, fontWeight: 700, color: C.red, letterSpacing: 0.5 }}>{s}</Link>)}</div>
      </PageSection>
      <PageSection title={"Certifications and Coverage in " + city.name} bg="#fff">
        <p style={{ fontFamily: F, fontSize: 15, color: C.slate, lineHeight: 1.8 }}>Certified installer for Versico, FiberTite, Duro-Last, Karnak, Everest Systems, IPC, Western Colloid, Elevate, and GAF. Fully insured with General Liability and Workers Compensation. Certificates provided before work begins. Same-day emergency response available across {city.name} and {city.county}.</p>
      </PageSection>
      {extra.faqs && extra.faqs.length > 0 && (
        <PageSection title={"Commercial Roofing FAQs — " + city.name} bg={C.light}>
          {extra.faqs.map((f, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <p style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: C.black, marginBottom: 6 }}>{f.q}</p>
              <p style={{ fontFamily: F, fontSize: 15, color: C.slate, lineHeight: 1.8 }}>{f.a}</p>
            </div>
          ))}
        </PageSection>
      )}
      <section style={{ background: "#fff", padding: "48px clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Fade>
            <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>We Also Serve</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {CITIES.filter(c => c.slug !== slug).slice(0, 5).map(c => (
                <Link key={c.slug} to={c.slug} style={{ padding: "8px 16px", background: C.light, fontFamily: F, fontSize: 12, fontWeight: 600, color: C.slate, transition: "color 0.3s" }}
                  onMouseOver={e=>e.currentTarget.style.color=C.red} onMouseOut={e=>e.currentTarget.style.color=C.slate}>{c.name}</Link>
              ))}
            </div>
          </Fade>
        </div>
      </section>
      <CTA />
    </div>
  );
}

/* ── Metal Roof Coating (pillar) ── */
const MP = { fontFamily: F, fontSize: 15, color: C.slate, lineHeight: 1.8 };
const METAL_FAILS = [
  { t: "Fasteners back out", d: "Daily thermal movement works screws loose, enlarges their holes, and dry-rots the rubber washers. A typical metal roof has thousands of fasteners, and every one is a potential leak." },
  { t: "Seams open up", d: "Panel laps, ridges, and transitions move with the metal. The original stitch screws and butyl tape eventually give, and wind-driven rain finds every gap they leave behind." },
  { t: "Rust sets in", d: "The factory galvalume finish sacrifices itself for years, then wears through. Once bare steel meets Gulf Coast humidity, corrosion moves fast." },
  { t: "Flashings and penetrations fail", d: "Pipes, curbs, skylights, and edge metal are where most leaks actually start. Chasing them one tube of caulk at a time is a treadmill, not a repair." },
];
const METAL_STEPS = [
  { t: "Pressure wash and prep", d: "We wash the entire roof down to a clean, sound surface and degrease anything the coating needs to grip. Adhesion is everything, so prep gets treated like its own job." },
  { t: "Fastener pass", d: "Every backed-out screw gets tightened or replaced, and failed washers get swapped. Tightening a stripped screw accomplishes nothing, so where threads are gone we upsize the fastener." },
  { t: "Rust-inhibitive primer", d: "Rusted areas and previously painted panels get a primer coat that locks down oxidation and guarantees the topcoat bonds. This is the step cheap coating jobs skip, and it is why they fail." },
  { t: "Seam and detail treatment", d: "Brush-grade sealant or fabric-reinforced base coat goes over every seam, fastener head, curb, and penetration. This is where the labor lives, because this is where metal roofs actually leak." },
  { t: "Full-field topcoat", d: "The finish coats are applied to the mil thickness your warranty requires, checked as we go, and photo-documented like everything else we do." },
];
const METAL_CHEM = [
  { t: "Silicone", d: "The default for low-slope metal with ponding water or brutal sun exposure. Silicone shrugs off standing water and UV better than anything else we install." },
  { t: "Acrylic", d: "The workhorse for sloped metal that sheds water fast. Highly reflective, easier on the budget, and the chemistry both of our Texas manufacturers build their metal systems around." },
  { t: "Fabric-Reinforced", d: "Polyester fabric embedded in the coating over the seams or the entire field. The call for older roofs with more movement, and for owners who want a membrane they can renew with a recoat instead of ever replacing." },
];
const METAL_BRANDS = [
  { n: "Everest Systems", s: "/cert-everest.png", loc: "Manufactured in Houston, TX", d: "A full line of acrylic, silicone, and urethane systems manufactured in Houston, including dedicated metal primers, rust bleed-blockers, and a PVDF topcoat for color-critical roofs. Warranties up to 20 years." },
  { n: "IPC", s: "/cert-ipc.png", loc: "Manufactured in Pearland, TX", d: "Cross-linked acrylic systems made in Pearland, minutes from many of the buildings we coat. IPC metal restorations have earned 20-year no-dollar-limit warranties that include 2-inch hail coverage." },
  { n: "Karnak", s: "/cert-karnak.png", loc: "Clark, NJ", d: "A family-owned manufacturer with a dedicated metal roof restoration system, a high-solids silicone, and products third-party certified by UL, FM, and the Cool Roof Rating Council. Warranties from 5 to 20 years." },
  { n: "Western Colloid", s: "/cert-western-colloid.png", loc: "Made in California", d: "Fluid Applied Reinforced Roofing: coating layered with polyester fabric into a seamless membrane that weighs about a pound per square foot. Warranties up to 20 years, renewable with a recoat instead of a tear-off." },
];
const METAL_PHOTOS = {
  spray: { s: "/metal-1.jpg", c: "Crew spraying white elastomeric coating across a metal roof" },
  field: { s: "/metal-2.jpg", c: "Working the spray rig down the panel field, hose tended behind" },
  seams: { s: "/metal-3.jpg", c: "Seams and fastener heads sealed first, then basecoat over the panels" },
  curbs: { s: "/metal-4.jpg", c: "Coating carried around the roof penetrations and curbs" },
};
const METAL_FAQS = [
  { q: "How much does metal roof coating cost in Houston?", a: "Most metal roof restorations in the Houston market run $2.50 to $5.00 per square foot depending on panel condition, how much seam and fastener work is needed, and the warranty length you want. A full replacement typically starts around $8 to $15 per square foot. We give you an exact number after a free on-roof assessment." },
  { q: "How long does a metal roof coating last?", a: "The systems we install carry manufacturer-backed warranties from 10 to 20 years depending on the applied thickness. At the end of that window, most of these roofs can be cleaned and recoated for a fraction of the original cost, which restarts the clock without a tear-off." },
  { q: "Can you coat a rusty metal roof?", a: "Usually, yes. Surface rust gets cleaned and locked down with a rust-inhibitive primer before any coating goes on. What we will not do is coat over rust-through, soft decking, or saturated insulation. If the panels are structurally gone, we will tell you that honestly." },
  { q: "Is coating better than replacing a metal roof?", a: "If the roof is structurally sound, coating usually wins on cost, speed, disruption, and energy performance. If it has widespread rust-through or deck damage, replacement is the honest answer. Our free assessment tells you which side of that line your roof is on, with photos to back it up." },
  { q: "Will a roof coating lower my energy bills?", a: "A bare metal panel can run 170 degrees or hotter on a Houston summer afternoon. A bright white reflective coating can cut that surface temperature by 50 degrees or more, which reduces the heat driving into your building and the load on your cooling equipment." },
  { q: "Do roof coatings come with a real warranty?", a: "Yes. Installed to spec by a certified applicator, these systems carry manufacturer-backed warranties up to 20 years, with no-dollar-limit options available on qualifying roofs. That is the manufacturer standing behind the roof, not just your contractor." },
];
function MetalRoofPage() {
  const p = PAGES["metal-roof-coating-houston"];
  const card = { background: C.light, padding: 22 };
  const cardW = { background: "#fff", padding: 22 };
  const grid2 = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 24 };
  return (
    <div key="metal-roof-coating-houston">
      <PageHero tag={p.tag} title={p.title} highlight={p.highlight} desc={p.desc} />
      <TrustBar />
      <LogoBar />
      <PageSection mark title="Why Metal Roofs Leak in Houston" bg="#fff">
        <p style={MP}>Metal is a great roof until the details give up. In Houston, a panel can swing from morning-cool to well over 150 degrees by afternoon, and that daily expansion and contraction slowly works the whole system loose. The panels themselves usually have plenty of life left. It is everything holding them together that fails.</p>
        <div style={grid2}>
          {METAL_FAILS.map(f => (
            <div key={f.t} style={{ ...card, borderTop: "3px solid " + C.red }}>
              <p style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: C.black, marginBottom: 8 }}>{f.t}</p>
              <p style={{ ...MP, fontSize: 14 }}>{f.d}</p>
            </div>
          ))}
        </div>
        <MetalFig k="seams" />
      </PageSection>
      <PageSection mark title="What Fluid-Applied Restoration Actually Is" bg={C.light}>
        <p style={MP}>A fluid-applied restoration is not a coat of paint. It is an engineered roof system installed as a liquid: cleaning and prep, a rust-inhibitive primer, reinforced treatment over every seam, fastener, and penetration, and then a full-field elastomeric topcoat built up to a specified thickness. When it cures, your entire roof is one seamless, waterproof, highly reflective membrane with no laps to open and no fasteners exposed to the weather.</p>
        <p style={{ ...MP, marginTop: 16 }}>Because it goes over the existing panels, there is no tear-off, no dumpsters, no exposed building, and no weeks of noise over your tenants. Most metal restorations finish in days, and the building stays open the whole time.</p>
        <MetalFig k="field" />
      </PageSection>
      <PageSection mark title="Our 5-Step Metal Restoration Process" bg="#fff">
        {METAL_STEPS.map((s, i) => (
          <div key={s.t} style={{ display: "flex", gap: 18, marginBottom: i === METAL_STEPS.length - 1 ? 0 : 24 }}>
            <div style={{ fontFamily: F, fontWeight: 900, fontSize: 28, color: C.red, lineHeight: 1, minWidth: 34 }}>{i + 1}</div>
            <div>
              <p style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: C.black, marginBottom: 6 }}>{s.t}</p>
              <p style={MP}>{s.d}</p>
            </div>
          </div>
        ))}
        <MetalFig k="spray" />
      </PageSection>
      <PageSection mark title="Silicone, Acrylic, or Fabric-Reinforced?" bg={C.light}>
        <div style={{ ...grid2, marginTop: 0 }}>
          {METAL_CHEM.map(ch => (
            <div key={ch.t} style={cardW}>
              <p style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: C.red, marginBottom: 8 }}>{ch.t}</p>
              <p style={{ ...MP, fontSize: 14 }}>{ch.d}</p>
            </div>
          ))}
        </div>
        <p style={{ ...MP, marginTop: 20 }}>Plenty of Houston metal roofs get a hybrid: reinforced details everywhere, silicone where water sits, acrylic where it drains. The roof tells us which system it needs. We do not decide that from the office.</p>
      </PageSection>
      <PageSection mark title="The Systems We Install" bg="#fff">
        <p style={MP}>We are certified applicators for four fluid-applied manufacturers, and we picked them deliberately. Two of the four make their coatings right here in the Houston metro, formulated for exactly the heat, humidity, and storm cycles your roof lives in.</p>
        <div style={grid2}>
          {METAL_BRANDS.map(b => (
            <div key={b.n} style={card}>
              <img src={b.s} alt={b.n} style={{ height: 34, marginBottom: 12, display: "block" }} loading="lazy" />
              <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: C.red, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{b.loc}</p>
              <p style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: C.black, marginBottom: 8 }}>{b.n}</p>
              <p style={{ ...MP, fontSize: 14 }}>{b.d}</p>
            </div>
          ))}
        </div>
      </PageSection>
      <PageSection mark title="What It Costs" bg={C.light}>
        <p style={MP}>Straight numbers, because that is how this decision actually gets made.</p>
        <div style={{ background: "#fff", marginTop: 20 }}>
          {[["Fluid-applied metal restoration", "$2.50 to $5.00 / sq ft"], ["Full metal roof replacement", "$8 to $15+ / sq ft"]].map(([k, v], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: i === 0 ? "1px solid #eee" : "none", flexWrap: "wrap" }}>
              <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: C.black }}>{k}</span>
              <span style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: i === 0 ? C.red : C.slate }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: C.black, padding: 24, marginTop: 16 }}>
          <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: C.red, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>A real-world example</p>
          <p style={{ fontFamily: F, fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>Restoring a 20,000 square foot warehouse roof typically lands between $70,000 and $140,000. Replacing that same roof can clear $300,000 before you count the disruption to your operation.</p>
        </div>
        <p style={{ ...MP, marginTop: 20 }}>Then there is the energy side. An uncoated metal panel can run 170 degrees or hotter on a Houston summer afternoon. A bright white reflective coating can cut that surface temperature by 50 degrees or more, and your cooling bill feels it immediately.</p>
        <p style={{ ...MP, marginTop: 16 }}>One more conversation worth having before you sign anything: coating work is often handled differently on your books than a capital roof replacement, and Section 179 now covers certain commercial roof improvements. We are roofers, not accountants, so take that question to your CPA. It is worth asking.</p>
      </PageSection>
      <MidCTA headline="Wondering if your metal roof can be restored?" sub="We walk it, document every seam and fastener, and tell you honestly whether coating is the right call or whether the panels are past saving." />
      <PageSection mark title="When We Won't Coat Your Metal Roof" bg="#fff">
        <p style={MP}>Coatings only work over a structurally sound roof. If your panels have rusted through, the decking is soft, or the insulation underneath is saturated, a coating just hides a problem that is still getting worse. That is why every project starts with a free on-roof assessment, and it is why we have walked away from coating jobs and recommended replacement instead. You will get the honest answer either way, with photos to back it up.</p>
      </PageSection>
      <PageSection mark title="Warranties That Actually Mean Something" bg={C.light}>
        <p style={MP}>Installed to spec by a certified applicator, the systems we use carry manufacturer-backed warranties from 10 to 20 years, with no-dollar-limit coverage available on qualifying roofs. That means the manufacturer, not just your contractor, stands behind the roof. And when the warranty window closes, most of these systems can be cleaned and recoated to start the clock again. Done right, this can be the last roof decision the building ever forces on you.</p>
        <MetalFig k="curbs" />
      </PageSection>
      <PageSection mark title="Metal Roof Coating FAQs" bg={C.light}>
        {METAL_FAQS.map((f, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: C.black, marginBottom: 6 }}>{f.q}</p>
            <p style={MP}>{f.a}</p>
          </div>
        ))}
      </PageSection>
      <section style={{ background: "#fff", padding: "48px clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Fade>
            <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>Related Services</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {["coatings", "repair", "maintenance"].map(k => (
                <Link key={k} to={k} style={{ padding: "10px 20px", background: C.light, fontFamily: F, fontSize: 12, fontWeight: 700, color: C.black, letterSpacing: 0.5 }}>{PAGES[k].tag}</Link>
              ))}
            </div>
          </Fade>
        </div>
      </section>
      <CTA />
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Hero /><TrustBar /><LogoBar /><Difference /><ServiceAreas />
      <Services /><Process /><About /><BeforeAfter /><MidCTA /><Reviews /><FAQ /><CTA />
    </>
  );
}

export const PAGE_TITLES = {
  "warehouse-roofing-houston": "Warehouse & Industrial Roofing Houston | Coons Roofing",
  "retail-roofing-houston": "Retail & Strip Center Roofing Houston | Coons Roofing",
  "multifamily-roofing-houston": "Multifamily & HOA Roofing Houston | Coons Roofing",
  "church-roofing-houston": "Church Roofing Houston | Coons Roofing",
  "medical-office-roofing-houston": "Medical Office Roofing Houston | Coons Roofing",
  "contact": "Contact Coons Roofing | Commercial Roofing Houston",
  home: "Coons Roofing | Commercial Roofing Houston TX",
  repair: "Commercial Roof Repair Houston | Coons Roofing",
  maintenance: "Commercial Roof Maintenance Houston | Coons Roofing",
  coatings: "Roof Coatings & Restoration Houston | Coons Roofing",
  replacement: "Commercial Roof Replacement Houston | Coons Roofing",
  inspections: "Commercial Roof Inspections Houston | Coons Roofing",
  emergency: "Emergency Roof Repair Houston | Coons Roofing",
  about: "About Coons Roofing | Houston Commercial Roofing Contractor",
  projects: "Commercial Roofing Projects Houston | Coons Roofing",
  houston: "Houston Metro Commercial Roofing | Coons Roofing",
  "tpo-roofing-houston": "TPO Roofing Houston | Commercial TPO Install & Repair",
  "flat-roof-repair-houston": "Flat Roof Repair Houston | Coons Roofing",
  "metal-roof-coating-houston": "Metal Roof Coating & Restoration Houston | Coons Roofing",
  blog: "Roofing Blog for Property Managers | Coons Roofing Houston",
};
const SITE = "https://coonsroofing.com";
export function headFor(route) {
  const canonical = route === "home" ? SITE + "/" : SITE + "/" + route + "/";
  const city = CITIES.find(c => c.slug === route);
  const blogPost = route.startsWith("blog/") && BLOG.find(p => p.slug === route.slice(5));
  let title, description;
  if (blogPost) {
    title = (BLOG_SEO[blogPost.slug]?.t || blogPost.title) + " | Coons Roofing Houston";
    description = BLOG_SEO[blogPost.slug]?.d || blogPost.body[0].slice(0, 155);
  } else if (city) {
    title = "Commercial Roofing " + city.name + " TX | Coons Roofing";
    description = city.desc;
  } else if (route === "blog") {
    title = PAGE_TITLES.blog;
    description = "Commercial roofing insights for Houston property managers and building owners: maintenance, repair, coatings, and replacement guidance.";
  } else if (PAGES[route]) {
    const HAND_DESC = { "warehouse-roofing-houston": "Commercial roofing for Houston warehouse, distribution and industrial buildings. Repair, coatings and metal restoration, documented for ownership.", "retail-roofing-houston": "Roofing for Houston retail centers, strip centers and restaurants. Grease-resistant systems, tenant-aware scheduling and suite by suite reporting.", "multifamily-roofing-houston": "Roofing for Houston apartments, condos and HOA properties. Building by building inspections, phased budgets and reports written for your board.", "church-roofing-houston": "Roofing for Houston churches, gyms and fellowship halls. Campus wide inspections, scheduling around services and proposals your committee can read.", "medical-office-roofing-houston": "Roofing for Houston medical offices, clinics and surgical suites. Odor and noise control, penetration detailing and documentation for owners." };
    title = PAGE_TITLES[route] || PAGE_TITLES.home;
    description = HAND_DESC[route] || PAGES[route].desc;
  } else {
    title = PAGE_TITLES.home;
    description = "Commercial roofing contractor serving property managers and building owners across the Houston metro. Repair. Maintain. Restore. Replace only when necessary.";
  }
  const jsonld = [];
  if (route !== "home") {
    const crumbName = blogPost ? blogPost.title : city ? city.name : route === "blog" ? "Blog" : PAGES[route] ? PAGES[route].tag : route;
    const crumbs = [{ "@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/" }];
    if (blogPost) crumbs.push({ "@type": "ListItem", "position": 2, "name": "Blog", "item": SITE + "/blog/" });
    crumbs.push({ "@type": "ListItem", "position": crumbs.length + 1, "name": crumbName, "item": canonical });
    jsonld.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": crumbs });
  }
  if (city) {
    jsonld.push({
      "@context": "https://schema.org", "@type": "Service",
      "serviceType": "Commercial Roofing", "name": "Commercial Roofing in " + city.name,
      "areaServed": { "@type": "City", "name": city.name },
      "provider": { "@type": "RoofingContractor", "@id": SITE + "/#business", "name": "Coons Roofing" },
      "url": canonical,
    });
  } else if (PAGES[route] && route !== "about" && route !== "projects") {
    jsonld.push({
      "@context": "https://schema.org", "@type": "Service",
      "serviceType": PAGES[route].tag, "name": route === "houston" ? "Commercial Roofing in Houston" : PAGES[route].tag + " in Houston",
      "areaServed": { "@type": "City", "name": "Houston" },
      "provider": { "@type": "RoofingContractor", "@id": SITE + "/#business", "name": "Coons Roofing" },
      "url": canonical,
    });
  }
  if (route === "home") {
    jsonld.push({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": HOME_FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) });
  }
  if (route === "metal-roof-coating-houston") {
    jsonld.push({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": METAL_FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) });
  }
  const OG_BY_ROUTE = { "metal-roof-coating-houston": "/metal-1-hero.jpg", "warehouse-roofing-houston": "/blog-replacement-hero.jpg", "retail-roofing-houston": "/blog-repair-signs-hero.jpg", "multifamily-roofing-houston": "/blog-hoa-hero.jpg", "church-roofing-houston": "/blog-tpo-pvc-hero.jpg", "medical-office-roofing-houston": "/blog-warranty-hero.jpg" };
  const image = SITE + (blogPost ? blogHero(blogPost) : OG_BY_ROUTE[route] || "/og-default.jpg");
  const ogType = blogPost ? "article" : "website";
  return { title, description, canonical, jsonld, image, ogType };
}

export default function CoonsHomepage({ route }) {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const where = window.location.pathname;
      if (href.startsWith("tel:")) track("contact_phone", { page_path: where });
      else if (href.startsWith("sms:")) track("contact_text", { page_path: where });
      else if (href.indexOf("#contact") !== -1) track("cta_click", { page_path: where, label: (a.textContent || "").trim().slice(0, 40) });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  const page = useRouter(route);
  useEffect(() => {
    const { title, description } = headFor(page);
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = description;
    document.documentElement.style.scrollBehavior = "smooth";
    if (page === "home" && window.location.hash === "#contact") {
      setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 300);
    }
    return () => { document.documentElement.style.scrollBehavior = ""; };
  }, [page]);
  return (
    <div style={{ background: C.black, minHeight: "100vh", overflowX: "hidden" }}>
      <Nav />
      <main id="main-content">{
        page === "home" ? <HomePage /> :
        page === "privacy" ? <PrivacyPage /> :
        page === "terms" ? <TermsPage /> :
        page === "blog" ? <BlogList /> :
        page.startsWith("blog/") ? <BlogPost slug={page.slice(5)} /> :
        page === "metal-roof-coating-houston" ? <MetalRoofPage /> :
        CITIES.find(c => c.slug === page) ? <CityPage slug={page} /> :
        <ServicePage slug={page} />
      }</main>
      <Footer /><StickyCallBar page={page} />
    </div>
  );
}
