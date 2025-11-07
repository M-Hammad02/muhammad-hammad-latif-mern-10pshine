export function snip(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  const text = tmp.innerText || "";
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const first = lines.slice(0, 2).join(" ");
  return escapeHtml(first);
}
export function escapeHtml(s=""){ return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
