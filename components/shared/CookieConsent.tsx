"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("anagha_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("anagha_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("anagha_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="animate-fadeIn"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "1.5rem",
        right: "1.5rem",
        maxWidth: "480px",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.5rem",
        zIndex: 60,
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <button
        onClick={decline}
        style={{
          position: "absolute",
          top: "0.75rem",
          right: "0.75rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--muted)",
        }}
      >
        <X size={16} />
      </button>
      <h4 style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.9375rem" }}>
        Cookie Notice
      </h4>
      <p style={{ fontSize: "0.8125rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.6 }}>
        We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={accept} className="btn btn-primary btn-sm">
          Accept
        </button>
        <button onClick={decline} className="btn btn-ghost btn-sm">
          Decline
        </button>
      </div>
    </div>
  );
}
