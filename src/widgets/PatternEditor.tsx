import React from "react";

export function PatternEditor({
  mode,
  showInbound=false,
  starter="",
  lockedLines=0,
  onCheck
}:{
  mode: "CDP"|"TM";
  showInbound?: boolean;
  starter?: string;
  lockedLines?: number;
  onCheck: (text: string)=>void;
}) {
  const [text, setText] = React.useState(starter);
  React.useEffect(()=>setText(starter),[starter]);

  function handleInput(v: string) {
    setText(v);
    onCheck(v);
  }

  const placeholder =
    mode==="CDP"
      ? `'ALPHA ...' PATTERN NAME DEF\nREC='GVN-NM1(1) ... SRNM(1)'`
      : `'ALPHA ...'\n  INSERT PATTERN NAME DEF\n  RECODE='FIRST ... LAST ...'\n  EXPORT='FIRST(1) ... LAST(1)'`;

  const lines = text.split("\n");
  const locked = lines.slice(0, lockedLines).join("\n");
  const editable = lines.slice(lockedLines).join("\n");

  return (
    <div className="pattern-editor">
      <div className="editor-header">
        <span className="pill">{mode}</span>
      </div>
      {lockedLines>0 && locked && (
        <pre className="locked" aria-readonly="true">{locked}</pre>
      )}
      <textarea
        value={editable}
        onChange={(e)=>handleInput((locked?locked+"\n":"")+e.target.value)}
        placeholder={placeholder}
        rows={mode==="CDP"?6:8}
        spellCheck={false}
      />
      {showInbound && <div className="hint muted">Fill the missing line(s) only.</div>}
    </div>
  );
}
