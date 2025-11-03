import React from "react";
import {
  tokenizeInbound,
  makeCdpNamePattern,
  makeTmNamePattern,
  validateCdp,
  validateTm,
  previewPrepos,
  PARTICLES,
  CONNECTORS,
  PersonParts,
  EngineMode,
} from "../utils/trillium";
import { QuickCard } from "./QuickCard";
import { PatternEditor } from "./PatternEditor";
import { labsLessons } from "../content/lessons";
import { saveProgress, loadProgress, ProgressRecord, updateEwma } from "../utils/progress";

type Phase = "learn" | "guided" | "freehand";

export function LessonRunner() {
  const [mode, setMode] = React.useState<EngineMode>("CDP");
  const [lessonIdx, setLessonIdx] = React.useState(0);
  const [phase, setPhase] = React.useState<Phase>("learn");
  const [orig, setOrig] = React.useState("");
  const [parts, setParts] = React.useState<PersonParts>({ first: "", last: "" });
  const [cdpOut, setCdpOut] = React.useState("");
  const [tmOut, setTmOut] = React.useState("");
  const [errors, setErrors] = React.useState<string[]>([]);
  const [hint, setHint] = React.useState<string>("");

  const lesson = labsLessons[lessonIdx];

  React.useEffect(() => {
    // initialize defaults per lesson
    setOrig(lesson.sample.original);
    setParts(lesson.sample.parts);
    setMode(lesson.defaultMode || "CDP");
    setPhase("learn");
    setCdpOut("");
    setTmOut("");
    setErrors([]);
    setHint("");
  }, [lessonIdx]);

  function onGenerate() {
    setErrors([]);
    setHint("");
    const errs: string[] = [];

    try {
      if (!orig.trim()) errs.push("Original Bad Line is required.");
      if (!parts.first.trim() || !parts.last.trim()) errs.push("First and Last are required.");

      if (errs.length) throw new Error();

      // generate outputs
      if (mode === "CDP") {
        const cd = makeCdpNamePattern(orig, parts);
        setCdpOut(`${cd.inbound}\n${cd.rec}`);
        const val = validateCdp(`${cd.inbound}\n${cd.rec}`);
        errs.push(...val);
      } else {
        const tm = makeTmNamePattern(orig, parts);
        setTmOut(`${tm.insert}\n${tm.rec}\n${tm.exp}`);
        const val = validateTm(`${tm.insert}\n${tm.rec}\n${tm.exp}`);
        errs.push(...val);
      }
    } catch (e) {
      // fallthrough
    }
    setErrors(errs);
  }

  function checkFreehand(cdpText: string, tmText: string) {
    const errs = [];
    if (mode === "CDP") errs.push(...validateCdp(cdpText));
    else errs.push(...validateTm(tmText));
    setErrors(errs);

    // scoring
    const ok = errs.length === 0;
    const rec: ProgressRecord = loadProgress() || { ewma: {}, streak: 0, lastSeen: {} };
    const key = `${lesson.key}:${mode}:${phase}`;
    const newScore = updateEwma(rec.ewma[key] || 0.5, ok ? 1 : 0);
    rec.ewma[key] = newScore;
    rec.streak = ok ? rec.streak + 1 : 0;
    rec.lastSeen[key] = Date.now();
    saveProgress(rec);
  }

  const inboundTokens = tokenizeInbound(orig).join(" ") || "—";
  const pre = previewPrepos(parts);

  const progress = loadProgress();

  return (
    <section className="labs-grid">
      {/* left: mini-lesson & glossary */}
      <aside className="lesson-pane" aria-label="Mini lesson">
        <h2 className="lesson-title">{lesson.title}</h2>
        <div className="lesson-cards">
          {lesson.cards.map((c) => (
            <div key={c.title} className="card">
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              {c.points && (
                <ul>
                  {c.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="glossary">
          <h4>QuickCards</h4>
          <div className="qc-row">
            <QuickCard term="CDP pattern" body="Two-line NAME rule. Line 1 describes tokens. Line 2 is REC='…' with name numbers (1) on each NAME attribute." />
            <QuickCard term="TM pattern" body="Table Maintenance / CLWDPAT. Three lines: INSERT PATTERN NAME DEF, RECODE='…', EXPORT='…'. EXPORT required for NAME." />
            <QuickCard term="CONCATENEE (CON)" body="Surname particle (e.g., DE, DE LA, VAN DER). Treated as one token." />
            <QuickCard term="CONNECTOR (CTR)" body="Between-person joiner (e.g., Y). Not part of a single surname." />
            <QuickCard term="REC / RECODE / EXPORT" body="CDP uses REC (with (1) on each NAME attr). TM uses RECODE + EXPORT (with (1) on EXPORT items)." />
            <QuickCard term="PREPOS" body="Where parsed pieces land (e.g., Surname1/2/3). QC checks this." />
          </div>
        </div>
        <div className="progress-bar" aria-label="Mastery">
          <span>Progress</span>
          <div className="bar">
            <div
              className="fill"
              style={{
                width: `${Math.min(100, Math.round((progress?.streak || 0) * 5))}%`,
              }}
            />
          </div>
          <small>Streak: {progress?.streak || 0}</small>
        </div>
      </aside>

      {/* right: editors */}
      <section className="work-pane" aria-label="Practice">
        <div className="controls">
          <div className="control">
            <label>Engine Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as EngineMode)} aria-label="Engine Mode">
              <option value="CDP">CDP v7.16</option>
              <option value="TM">Table Maintenance (CLWDPAT)</option>
            </select>
          </div>

          <div className="control full">
            <label>Original Bad Line *</label>
            <textarea
              value={orig}
              onChange={(e) => setOrig(e.target.value)}
              placeholder="e.g., DE LA ROSA ANNA MARIE"
              rows={2}
            />
            <div className="hint">Inbound tokens: <code>{inboundTokens}</code></div>
          </div>

          <div className="row">
            <div className="control">
              <label>Prefix</label>
              <input value={parts.prefix || ""} onChange={(e) => setParts({ ...parts, prefix: e.target.value })} />
            </div>
            <div className="control">
              <label>First *</label>
              <input value={parts.first} onChange={(e) => setParts({ ...parts, first: e.target.value })} />
            </div>
            <div className="control">
              <label>Middle</label>
              <input value={parts.middle || ""} onChange={(e) => setParts({ ...parts, middle: e.target.value })} />
            </div>
            <div className="control">
              <label>Last *</label>
              <input value={parts.last} onChange={(e) => setParts({ ...parts, last: e.target.value })} />
            </div>
            <div className="control">
              <label>Generation</label>
              <input value={parts.gen || ""} onChange={(e) => setParts({ ...parts, gen: e.target.value })} />
            </div>
          </div>
        </div>

        {/* teach → guided → freehand */}
        <div className="phase-switch">
          <button className={phase==="learn"?"on":""} onClick={()=>setPhase("learn")}>Mini‑lesson</button>
          <button className={phase==="guided"?"on":""} onClick={()=>setPhase("guided")}>Guided</button>
          <button className={phase==="freehand"?"on":""} onClick={()=>setPhase("freehand")}>Freehand</button>
        </div>

        {phase === "learn" && (
          <div className="panel">
            <p className="muted">Read the cards on the left. When ready, click <b>Guided</b> to try a scaffolded item.</p>
            <div className="cta-row">
              <button onClick={()=>setPhase("guided")}>Start Guided Practice</button>
            </div>
          </div>
        )}

        {phase === "guided" && (
          <div className="panel">
            <p className="muted">We'll generate a correct base and ask you to complete the missing line.</p>
            <div className="cta-row">
              <button onClick={onGenerate}>Generate Base</button>
              <button onClick={()=>setPhase("freehand")}>Skip to Freehand</button>
            </div>

            <div className="grid2">
              <div>
                <h4>CDP</h4>
                <PatternEditor
                  mode="CDP"
                  showInbound
                  starter={cdpOut}
                  lockedLines={1}
                  onCheck={(txt)=>setErrors(validateCdp(txt))}
                />
              </div>
              <div>
                <h4>TM</h4>
                <PatternEditor
                  mode="TM"
                  showInbound
                  starter={tmOut}
                  lockedLines={2}
                  onCheck={(txt)=>setErrors(validateTm(txt))}
                />
              </div>
            </div>
          </div>
        )}

        {phase === "freehand" && (
          <div className="panel">
            <p className="muted">Write the full pattern by hand. Use the QuickCards for help.</p>
            <div className="grid2">
              <PatternEditor mode="CDP" onCheck={(txt)=>checkFreehand(txt,"")} />
              <PatternEditor mode="TM"  onCheck={(txt)=>checkFreehand("",txt)} />
            </div>
          </div>
        )}

        <div className="preview">
          <div><b>PREPOS (simulated)</b></div>
          <code>Surname1={pre.surname1 || "—"} | Surname2={pre.surname2 || "—"} | Surname3={pre.surname3 || "—"}</code>
        </div>

        {!!errors.length && (
          <div className="errors" role="alert" aria-live="polite">
            <b>Feedback</b>
            <ul>{errors.map((e,i)=><li key={i}>{e}</li>)}</ul>
          </div>
        )}

        <footer className="lesson-footer">
          <div className="nav">
            <button disabled={lessonIdx===0} onClick={()=>setLessonIdx(i=>Math.max(0,i-1))}>◀ Prev</button>
            <span>Lesson {lessonIdx+1} / {labsLessons.length}</span>
            <button disabled={lessonIdx===labsLessons.length-1} onClick={()=>setLessonIdx(i=>Math.min(labsLessons.length-1,i+1))}>Next ▶</button>
          </div>
          <div className="meta">
            <small>Particles: {PARTICLES.join(", ")}</small>
            <small>Connector(s): {CONNECTORS.join(", ")}</small>
          </div>
        </footer>
      </section>
    </section>
  );
}
