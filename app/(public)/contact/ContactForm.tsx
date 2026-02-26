"use client";

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Send, Loader2, CheckCircle, MessageSquare } from "lucide-react";
import gsap from "gsap";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Animate success state in
  useEffect(() => {
    if (sent && successRef.current) {
      const el = successRef.current;
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      );
      // Animate the check icon
      const icon = el.querySelector(".success-icon");
      if (icon) {
        gsap.fromTo(icon, { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.6, delay: 0.2, ease: "elastic.out(1, 0.5)" });
      }
    }
  }, [sent]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      message: fd.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      toast.success("Message sent successfully! We'll get back to you soon.");
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div
        ref={successRef}
        className="glass-strong"
        style={{
          textAlign: "center",
          padding: "3rem 2rem",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background accent */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle at center, color-mix(in srgb, var(--primary) 5%, transparent) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="success-icon"
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            color: "white",
            position: "relative",
          }}
        >
          <CheckCircle size={36} />
        </div>
        <h3 style={{ fontWeight: 800, fontSize: "1.375rem", marginBottom: "0.5rem" }}>
          Thank You!
        </h3>
        <p style={{ color: "var(--muted)", lineHeight: 1.7, maxWidth: "380px", margin: "0 auto" }}>
          Your message has been received. Our team will review it and get back to you within 24-48
          hours.
        </p>
        <button
          onClick={() => setSent(false)}
          className="btn btn-outline btn-sm"
          style={{ marginTop: "1.5rem", borderRadius: "9999px" }}
        >
          <MessageSquare size={14} /> Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="glass-strong"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        padding: "2rem",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative corner gradient */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle at top right, color-mix(in srgb, var(--primary) 6%, transparent), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative" }}>
        <label htmlFor="name" style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem", display: "block" }}>
          Full Name *
        </label>
        <input
          id="name"
          name="name"
          required
          className="input"
          placeholder="Your full name"
          style={{ transition: "border-color 0.3s ease, box-shadow 0.3s ease" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label htmlFor="email" style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem", display: "block" }}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input"
            placeholder="you@example.com"
            style={{ transition: "border-color 0.3s ease, box-shadow 0.3s ease" }}
          />
        </div>
        <div>
          <label htmlFor="phone" style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem", display: "block" }}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="input"
            placeholder="+91 XXXXX XXXXX"
            style={{ transition: "border-color 0.3s ease, box-shadow 0.3s ease" }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem", display: "block" }}>
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          className="input"
          rows={5}
          placeholder="Tell us about your requirements or inquiry..."
          style={{ resize: "vertical", transition: "border-color 0.3s ease, box-shadow 0.3s ease" }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary btn-lg"
        style={{ justifyContent: "center", borderRadius: "9999px", position: "relative", overflow: "hidden" }}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send size={18} /> Send Message
          </>
        )}
      </button>
    </form>
  );
}
