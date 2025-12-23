// AdminSecure.jsx — Full Updated File with Boot Animation, Retina Scan, Audio Feedback

import React, { useState, useEffect } from "react";

export default function AdminSecure() {
  const ADMIN_PIN = "7531"; // your hidden PIN

  const [pin, setPin] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [stage, setStage] = useState("boot"); // boot → retina → pin → dashboard
  const [shake, setShake] = useState(false);
  const [codes, setCodes] = useState([]);

  // ----------------------------------------------------
  // AUDIO: Boot Beep
  // ----------------------------------------------------
  const playBeep = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  // ----------------------------------------------------
  // AUDIO: Alert Beep
  // ----------------------------------------------------
  const alertBeep = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(250, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  };

  // ----------------------------------------------------
  // VOICE SYNTHESIS
  // ----------------------------------------------------
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = 0.5;
    utter.rate = 0.85;
    utter.volume = 1;

    const voices = speechSynthesis.getVoices();
    utter.voice =
      voices.find((v) =>
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("google")
      ) || voices[0];

    speechSynthesis.speak(utter);
  };

  // ----------------------------------------------------
  // SUBMIT PIN
  // ----------------------------------------------------
  const submitPin = () => {
    playBeep();

    if (pin === ADMIN_PIN) {
      speak("Access Granted");

      const raw = localStorage.getItem("plb_verification");
      if (raw) setCodes(JSON.parse(raw));

      setAuthorized(true);
      setStage("dashboard");
    } else {
      alertBeep();
      speak("Access Denied");

      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPin("");
    }
  };

  // ----------------------------------------------------
  // BOOT-UP ANIMATION
  // ----------------------------------------------------
  useEffect(() => {
    speak("Initializing Secure Core");

    setTimeout(() => {
      speak("Retina scan required");
      setStage("retina");
    }, 2500);
  }, []);

  // ----------------------------------------------------
  // STAGE: BOOT SCREEN
  // ----------------------------------------------------
  if (stage === "boot") {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-green-400 text-xl font-mono animate-pulse">
        SYSTEM BOOTING...
      </div>
    );
  }

  // ----------------------------------------------------
  // STAGE: RETINA SCAN
  // ----------------------------------------------------
  if (stage === "retina") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-blue-400 font-mono">
        <div className="w-48 h-48 rounded-full border-4 border-blue-500 animate-ping"></div>
        <p className="mt-6 animate-pulse">SCANNING RETINA…</p>

        {setTimeout(() => {
          speak("Retina scan complete. Enter admin identification.");
          setStage("pin");
        }, 3000) && null}
      </div>
    );
  }

  // ----------------------------------------------------
  // STAGE: ENTER PIN
  // ----------------------------------------------------
  if (stage === "pin") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-xl mb-4 tracking-widest">ENTER ADMIN PIN</h1>

        <input
          type="password"
          maxLength={5}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitPin()}
          className={`w-40 text-center text-3xl p-3 bg-gray-900 border border-gray-700 rounded-md tracking-widest focus:outline-none 
            ${shake ? "animate-[shake_0.4s]" : ""}`}
        />

        <button
          onClick={submitPin}
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          UNLOCK
        </button>
      </div>
    );
  }

  // ----------------------------------------------------
  // STAGE: DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>

      <pre className="bg-black p-4 rounded-lg text-green-400 overflow-auto">
        {JSON.stringify(codes, null, 2)}
      </pre>
    </div>
  );
}
// End of AdminSecure.jsx