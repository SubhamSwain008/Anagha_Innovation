"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Send, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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
        style={{
          textAlign: "center",
          padding: "3rem 2rem",
          background: "var(--card)",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "color-mix(in srgb, var(--primary) 15%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
            color: "var(--primary)",
          }}
        >
          <Send size={28} />
        </div>
        <h3 style={{ fontWeight: 800, fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          Thank You!
        </h3>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          Your message has been received. Our team will review it and get back to you within 24-48
          hours.
        </p>
        <button
          onClick={() => setSent(false)}
          className="btn btn-outline btn-sm"
          style={{ marginTop: "1.5rem" }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        padding: "2rem",
        background: "var(--card)",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
      }}
    >
      <div>
        <label htmlFor="name" style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem", display: "block" }}>
          Full Name *
        </label>
        <input
          id="name"
          name="name"
          required
          className="input"
          placeholder="Your full name"
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
          style={{ resize: "vertical" }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary btn-lg"
        style={{ justifyContent: "center" }}
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
