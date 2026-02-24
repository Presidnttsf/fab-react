import { useState } from "react";

/* ── Styles ── */
const STYLES = `
  .vbtn-wrap {
    position: fixed;
    right: 0;
    top: 20%;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    user-select: none;
    filter: drop-shadow(-4px 2px 8px rgba(0,0,0,0.28));
    transition: opacity 0.2s ease;
  }

  .vbtn-wrap:hover {
    opacity: 0.88;
  }

  /* Main pill body — rounded on the LEFT side (which is "top" visually) */
  .vbtn-pill {
    background: #30b230;
    color: #fff;
    font-weight: 700;
    font-size: 13.5px;
    letter-spacing: 0.3px;
    line-height: 0.25;

    /* Vertical text flowing bottom → top */
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);

    padding: 18px 10px 14px;
    border-radius: 15px 15px 15px 15px; /* rounds the TOP (left on screen) */

    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    margin: 8px;
  }

  /* Stethoscope emoji sits inline with the text */
  .vbtn-emoji {
    font-size: 12px;
    line-height: 1;
  }

  /* Small square icon box at the bottom flush with the edge */
  .vbtn-icon-box {
    background: #279427;          /* slightly darker green */
    width: 100%;
    padding: 9px 10px;
    border-radius: 0;             /* flush bottom */
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid rgba(255,255,255,0.18);
  }

  @media (max-width: 768px) {
    .vbtn-wrap {
      top: 45%;
    }
    .vbtn-pill {
      font-size: 12.5px;
      padding: 16px 9px 12px;
    }
  }
`;

/* Message icon */
const MessageIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"
       style={{ transform: "rotate(90deg)" }}>
    <path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/>
  </svg>
);
/**
 * VerticalBtn
 * Props:
 *   label    — button text           (default: "Need A Nurse? (Select Package)")
 *   onClick  — click handler
 *   top      — CSS top value         (default: "40%")
 */
export default function VerticalBtn({
  label = "Need A Nurse? (Select Package)",
  toggle,
  top = "40%",
}) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 200);
    if (toggle) toggle();
  };  

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="vbtn-wrap"
        style={{ top, transform: pressed ? "scale(0.96)" : "scale(1)" }}
        onClick={handleClick}
        role="button"
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
      >
        {/* Text pill */}
        <div className="vbtn-pill">
          <span className="vbtn-emoji"><MessageIcon size={14}/></span>
          {label}
        </div>

      </div>
    </>
  );
}