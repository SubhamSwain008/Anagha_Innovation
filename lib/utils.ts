export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PROTOTYPE: "Prototype",
    AVAILABLE: "Available",
    UNDER_DEVELOPMENT: "Under Development",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PROTOTYPE: "var(--accent)",
    AVAILABLE: "var(--primary)",
    UNDER_DEVELOPMENT: "var(--secondary)",
  };
  return colors[status] || "var(--muted)";
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    ADVISOR: "Advisor",
    CORE_TEAM: "Core Team",
    DIRECTOR: "Director",
    MENTOR: "Mentor",
    ENGINEER: "Engineer",
  };
  return labels[role] || role;
}
