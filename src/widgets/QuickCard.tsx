import React from "react";

export function QuickCard({ term, body }: { term: string; body: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <button
      className={"qc"+(open?" open":"")}
      aria-expanded={open}
      onClick={()=>setOpen(o=>!o)}
      title={term}
    >
      <span className="qc-term">{term}</span>
      {open && <span className="qc-body">{body}</span>}
    </button>
  );
}
