import { useState, useEffect, useRef, useMemo } from "react";
import CMDIcon from "../assets/CMD-Icon.png";

/* ── Config ── */
const PHONE = ""; // e.g. "445490701" (without +)
const WHATSAPP = ""; // e.g. "9715xxxxxxx"
const WA_MESSAGE = "Hello, I need help";
const LOG_BASE_URL = "https://api.callmydoctor.app";

/* ── Icons ── */
const PhoneIcon = ({ size = 22, color = "white" }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.62 10.79a15.91 15.91 0 006.59 6.59l2.2-2.2a1 1 0 011-.24 11.72 11.72 0 003.69.59 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1H7.5a1 1 0 011 1 11.72 11.72 0 00.59 3.69 1 1 0 01-.25 1z" />
  </svg>
);

const WaIcon = ({ size = 22, color = "white" }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 2.9C8.6 2.9 2.9 8.6 2.9 16c0 2.6.8 5.2 2.2 7.3L3 29l5.9-2.1c2 .9 4.2 1.4 6.4 1.4 7.4 0 13.1-5.7 13.1-13.1S23.4 2.9 16 2.9zm0 23.6c-2 0-3.9-.5-5.6-1.4l-.4-.2-3.5 1.3 1.2-3.6-.2-.4c-1-1.7-1.6-3.6-1.6-5.6 0-6 4.9-10.9 10.9-10.9S26.9 10 26.9 16 22 26.5 16 26.5zm6-8.1c-.3-.1-1.8-.9-2-.9s-.5-.1-.7.1-.8.9-1 1.1-.4.3-.7.1c-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9s0-.5.1-.7c.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5s0-.4 0-.6-.7-1.7-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4 2.4 3.6 5.9 5c.8.3 1.4.5 1.9.6.8.3 1.6.2 2.2.1.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" />
  </svg>
);

/* ── Styles (CSS-first, minimal inline) ── */
const STYLES = `
  :root{
    --cmd-shadow: 0 12px 35px rgba(0,0,0,0.18);
    --cmd-radius: 18px;
    --cmd-blue: #0a66c2;
    --cmd-green: #30b230;
    --cmd-wa-header: #008268;
  }

  @keyframes cmdRipplePulse {
    0%   { transform: scale(1);    opacity: 0.55; }
    70%  { transform: scale(1.85); opacity: 0; }
    100% { opacity: 0; }
  }
  @keyframes cmdBlinkDot {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.15; }
  }

  .cmd-fixed{ position: fixed; z-index: 99999; }
  .cmd-card{
    background:#fff;
    border-radius: var(--cmd-radius);
    box-shadow: var(--cmd-shadow);
    overflow: hidden;
  }

  .cmd-popup{
    opacity: 0;
    transform: translateY(12px);
    pointer-events: none;
    transition: opacity .2s ease, transform .2s ease;
    will-change: transform, opacity;
  }
  .cmd-popup--open{
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .cmd-btn{
    border:0;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    transition: transform .15s ease, opacity .2s ease;
    user-select:none;
  }
  .cmd-btn:hover{ opacity: .8; }
  .cmd-btn:active{ transform: scale(.97); }

  .cmd-fab{
    width:62px; height:62px;
    border-radius:9999px;
    box-shadow: var(--cmd-shadow);
  }
  .cmd-fab--blue{ background: var(--cmd-blue); }
  .cmd-fab--green{ background: var(--cmd-green); }

  .cmd-ripple{ position: relative; }
  .cmd-ripple::before{
    content:"";
    position:absolute;
    inset:0;
    border-radius:50%;
    z-index:-1;
    background: rgba(48,178,48,0.38);
    animation: cmdRipplePulse 2s infinite ease-out;
  }
  .cmd-ripple--blue::before{ background: rgba(10,102,194,0.38); }

  .cmd-dot{ position: relative; }
  .cmd-dot::after{
    content:"";
    position:absolute;
    top:4px; right:6px;
    width:10px; height:10px;
    background:#ff2d2d;
    border-radius:50%;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.06);
    animation: cmdBlinkDot 3s infinite ease-in-out;
  }

  .cmd-close{
    width:34px; height:34px;
    border-radius:10px;
    background:#fff;
    font-size:20px;
    line-height:1;
  }
  .cmd-close:hover{ opacity:.3; }

  /* Call Popup */
  .cmd-call{
    width:290px;
    padding:18px 16px 16px;
    text-align:center;
    border-radius:16px;
  }
.cmd-logo{
  width: 62px;
  height: 62px;
  border-radius: 50%;
  margin: 0 auto 10px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.4);

  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
}

.cmd-logo img{
  max-width: 70%;        /* adjust if needed */
  max-height: 70%;
  object-fit: contain;   /* ✅ IMPORTANT */
  display: block;
}
  .cmd-title{ font-weight:700; font-size:14px; color:#0f172a; }
  .cmd-sub{ margin-top:4px; font-weight:700; font-size:12px; color: var(--cmd-green); }
  .cmd-help{ margin:14px 0; font-size:13px; color:#334155; line-height:1.35; }

  .cmd-pill{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:10px;
    border-radius:9999px;
    padding:12px 14px;
    font-weight:800;
    font-size:14px;
    color:#fff;
  }
  .cmd-pill--blue{ background: var(--cmd-blue); }

  .cmd-pill:hover{
  opacity: 0.8;
  }

  /* WhatsApp Popup */
  .cmd-wa{ width:360px; max-width: calc(100vw - 40px); }

  .cmd-wa-header{
    background: var(--cmd-wa-header);
    color:#fff;
    padding:14px;
    display:flex;
    align-items:center;
    justify-content:space-between;
  }
  .cmd-wa-head-left{ display:flex; align-items:center; gap:10px; }
  .cmd-wa-avatar{
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  background: white;
  border: 1px solid rgba(0,0,0,0.6);


  display: flex;                 /* ⬅ center helper */
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
}

.cmd-wa-avatar img{
  max-width: 70%;                /* ⬅ control logo size */
  max-height: 70%;
  object-fit: contain;           /* ⬅ IMPORTANT */
  display: block;
}


  .cmd-wa-name{ font-weight:800; font-size:14px; }
  .cmd-wa-sub{ font-size:12px; opacity:.95; }

  .cmd-wa-close{
    width:21px; height:21px;
    border-radius:10px;
    background: transparent;
    color:#fff;
    font-size:20px;
    line-height:1;
  }
  .cmd-wa-close:hover{ opacity:.3; }

  .cmd-wa-body{
    padding:14px;
    background-size:cover;
    background-position:center;
  }

  .cmd-wa-day{
    width:fit-content;
    margin:0 auto 12px;
    font-size:12px;
    padding:4px 10px;
    background: rgba(255,255,255,0.6);
    border-radius:9999px;
    color:#475569;
  }

  .cmd-bubble{
    position:relative;
    background:#fff;
    border-radius: 0 10px 10px 10px;
    padding:12px 12px 26px;
    font-size:13px;
    line-height:1.45;
    color:#0f172a;
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
    margin-bottom:14px;
    max-width:55%;
  }
  .cmd-bubble::before{
    content:"";
    position:absolute;
    top:0; left:-8px;
    width:0; height:0;
    border-bottom:8px solid transparent;
    border-right:8px solid #fff;
  }
  .cmd-bubble-time{
    position:absolute;
    right:10px;
    bottom:8px;
    font-size:11px;
    color:#64748b;
  }

  .cmd-bubble{
    position:relative;
    background:#fff;
    border-radius: 0 10px 10px 10px;
    padding:12px 12px 26px;
    font-size:13px;
    line-height:1.45;
    color:#0f172a;
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
    margin: 0 0 18px 15px;
    max-width: 56%;
  }
  .cmd-bubble::before{
    content:"";
    position:absolute;
    top:0; left:-8px;
    width:0; height:0;
    border-bottom:8px solid transparent;
    border-right:8px solid #fff;
  }
  .cmd-bubble-time{
    position:absolute;
    right:10px;
    bottom:8px;
    font-size:11px;
    color:#64748b;
  }
  .cmd-wa-chat{
    width:70%;
    height:40px;
    margin-left:47px;
    border-radius:9999px;
    background: var(--cmd-green);
    color:#fff;
    padding:12px 14px;
    gap:5px;
    font-weight:700;
  }

  @media (prefers-reduced-motion: reduce){
    .cmd-ripple::before{ animation: none; }
    .cmd-popup{ transition: none; }
    .cmd-btn{ transition: none; }
  }

  /* ✅ Force the floating buttons to stay fixed in corners (override WP/Elementor) */
.cmd-fixed {
  position: fixed !important;
  z-index: 2147483647 !important;
}

/* Make sure our FAB buttons are not affected by global button styles */
button.cmd-fab{
  position: fixed !important;
  display: flex !important;
  float: none !important;
  margin: 0 !important;
  right: auto;
  left: auto;
  top: auto;
  bottom: auto;
}

/* Ensure SVG doesn't collapse */
.cmd-fab svg{
  display:block;
}


/* Elementor transform fix (SAFE) */
body .elementor,
body .elementor-section,
body .elementor-container {
  transform: none !important;
}`;

function logClick(payload) {
  fetch(`${LOG_BASE_URL}/api/v1/logs/click`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    keepalive: true,
    body: JSON.stringify(payload),
  }).catch((err) => console.warn("Click log failed", err));
}

/* ── Main component ── */
export default function CallMyDoctorWidget() {
  const [callOpen, setCallOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  // stable ref per mount (better than top-level const)
  const uniqueRef = useRef(Date.now() + Math.floor(Math.random() * 1000)).current;

  // build wa link once
  const waLink = useMemo(() => {
    const text = `Hey!\n\nYour Conversation Ref No. CMD:${uniqueRef}\n\n${WA_MESSAGE}`;
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  }, [uniqueRef]);

  /* clock */
  useEffect(() => {
    const now = new Date();
    const hh = now.getHours() % 12 || 12;
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    setTimeStr(`${hh}:${mm} ${ampm}`);
  }, []);

  /* outside click dismiss */
  useEffect(() => {
    const handler = () => {
      setCallOpen(false);
      setWaOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleCallFab = (e) => {
    e.stopPropagation();
    setCallOpen((p) => !p);
    setWaOpen(false);
  };

  const handleWaFab = (e) => {
    e.stopPropagation();
    setWaOpen((p) => !p);
    setCallOpen(false);
  };

  const handleWaChat = (e) => {
    e.stopPropagation();
    logClick({
      url: location.href,
      refid: uniqueRef,
      buttonId: "whatsapp_floating_widget",
      destination: "whatsapp",
      data: waLink,
    });
    window.open(waLink, "_blank", "noopener,noreferrer");
  };

  const handleDial = (e) => {
    e.stopPropagation();
    logClick({
      url: location.href,
      refid: uniqueRef,
      buttonId: "call_floating_widget",
      destination: "call",
      data: PHONE,
    });
    window.open(`tel:+${PHONE}`, "_self");
  };

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Call Widget ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`cmd-fixed cmd-card cmd-popup cmd-call ${callOpen ? "cmd-popup--open" : ""}`}
        style={{ left: 26, bottom: 110 }}
        aria-hidden={!callOpen}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCallOpen(false);
          }}
          className="cmd-btn cmd-close"
          style={{ position: "absolute", right: 10, top: 8 }}
          aria-label="Close"
        >
          ×
        </button>

        <div className="cmd-logo">
          <img src={CMDIcon} alt="Call My Doctor" />
        </div>

        <div className="cmd-title">Call My Doctor™ Healthcare LLC</div>
        <div className="cmd-sub">Available 24/7</div>

        <div className="cmd-help">
          Click the phone number
          <br />
          below to dial.
        </div>

        <div onClick={handleDial} className="cmd-pill cmd-pill--blue">
          <PhoneIcon size={22} />
          04 549 0701
        </div>
      </div>

      {/* ── Call FAB ── */}
      <button
        onClick={handleCallFab}
        className="cmd-fixed cmd-btn cmd-fab cmd-fab--blue cmd-ripple cmd-ripple--blue"
        style={{ left: 26, bottom: 26 }}
        aria-label="Call"
      >
        <PhoneIcon size={26} />
      </button>

      {/* ── WhatsApp Widget ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`cmd-fixed cmd-card cmd-popup cmd-wa ${waOpen ? "cmd-popup--open" : ""}`}
        style={{ right: 26, bottom: 110 }}
        aria-hidden={!waOpen}
      >
        <div className="cmd-wa-header">
          <div className="cmd-wa-head-left">
            <div className="cmd-wa-avatar">
              <img src={CMDIcon} alt="CMD" />
            </div>
            <div>
              <div className="cmd-wa-name">Call My Doctor™ Healthcare</div>
              <span className="cmd-wa-sub">Typically replies instantly</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setWaOpen(false);
            }}
            className="cmd-btn cmd-wa-close"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div
          className="cmd-wa-body"
          style={{ backgroundImage: `url("https://cdn.callmydoctor.app/bg.jpeg")` }}
        >
          <div className="cmd-wa-day">Today</div>

          <div className="cmd-bubble">
           <strong>Need a doctor at your location in Dubai?</strong> 
            <br />
            <br />
            Click on the below button to start an instant conversation with us to book an appointment.
            <br />
            <br />
           <strong> We are available 24x7. </strong>
            <div className="cmd-bubble-time">{timeStr}</div>
          </div>

          <button onClick={handleWaChat} className="cmd-btn cmd-wa-chat">
            <WaIcon size={18} />
            <span style={{ fontSize: 14, lineHeight: 1 }}>Chat on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* ── WhatsApp FAB ── */}
      <button
        onClick={handleWaFab}
        className="cmd-fixed cmd-btn cmd-fab cmd-fab--green cmd-ripple cmd-dot"
        style={{ right: 26, bottom: 26 }}
        aria-label="WhatsApp"
      >
        <WaIcon size={38} />
      </button>



    </>
  );
}
