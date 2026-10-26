import { useLayoutEffect, useState } from "react";
import { onPush } from "../analytics/dataLayer";

/**
 * Optional on-page viewer for dataLayer pushes. Hidden by default.
 * Open the site with ?dl=1 to turn it on (remembered for the tab), ?dl=0 to turn it off.
 * Safe to delete this file and its line in App.jsx; nothing else depends on it.
 */
export default function DataLayerInspector() {
  const [enabled] = useState(() => {
    const p = new URLSearchParams(window.location.search).get("dl");
    try {
      if (p === "1") sessionStorage.setItem("lk_dl", "1");
      if (p === "0") sessionStorage.removeItem("lk_dl");
      return sessionStorage.getItem("lk_dl") === "1";
    } catch { return p === "1"; }
  });
  const [log, setLog] = useState([]);
  const [open, setOpen] = useState(true);

  useLayoutEffect(() => {
    if (!enabled) return;
    return onPush(obj => {
      if (obj.ecommerce === null && !obj.event) return; // hide the reset pushes
      setLog(l => [{ t: new Date().toLocaleTimeString(), obj: JSON.parse(JSON.stringify(obj)) }, ...l].slice(0, 60));
    });
  }, [enabled]);

  if (!enabled) return null;
  return (
    <aside className={"dli" + (open ? " open" : "")} aria-label="dataLayer inspector">
      <div className="dli-head">
        <button className="dli-toggle" onClick={() => setOpen(o => !o)}>dataLayer ({log.length})</button>
        {open && <button className="dli-toggle" onClick={() => setLog([])}>Clear</button>}
      </div>
      {open && (
        <div className="dli-body">
          {log.length === 0 && <p className="dli-empty">Click around the store. Pushes show up here.</p>}
          {log.map((e, i) => (
            <details key={log.length - i} open={i === 0}>
              <summary><b>{e.obj.event}</b><span>{e.t}</span></summary>
              <pre>{JSON.stringify(e.obj, null, 2)}</pre>
            </details>
          ))}
        </div>
      )}
    </aside>
  );
}
