"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Sparkles, RefreshCw, Server, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AmazingHypatiaPage() {
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [jiraEnabled, setJiraEnabled] = useState(false);
  const [figmaEnabled, setFigmaEnabled] = useState(false);
  const [linearEnabled, setLinearEnabled] = useState(false);
  
  const [logs, setLogs] = useState<string[]>([
    "[System] Integration sandbox initialized. Ready for connections..."
  ]);
  
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Log simulation updates based on active connections
  useEffect(() => {
    const activeIntegrations: string[] = [];
    if (slackEnabled) activeIntegrations.push("slack");
    if (jiraEnabled) activeIntegrations.push("jira");
    if (figmaEnabled) activeIntegrations.push("figma");
    if (linearEnabled) activeIntegrations.push("linear");

    if (activeIntegrations.length === 0) return;

    const interval = setInterval(() => {
      const randomType = activeIntegrations[Math.floor(Math.random() * activeIntegrations.length)];
      let message = "";
      const timestamp = new Date().toLocaleTimeString();

      switch (randomType) {
        case "slack":
          const slackMsgs = [
            `[Slack] Ava posted: "Launch checklist status updated to 82%."`,
            `[Slack] Webhook triggered: Alert posted to #product-alerts regarding user signups.`,
            `[Slack] Channel #general-launches updated with daily briefing report.`
          ];
          message = slackMsgs[Math.floor(Math.random() * slackMsgs.length)];
          break;
        case "jira":
          const jiraMsgs = [
            `[JIRA] Synced Epic "LAMF pre-deployment" - status: IN PROGRESS.`,
            `[JIRA] Resolved ticket: LAMF-304 "Confirm NbFC loan margin rules match portal engine".`,
            `[JIRA] Synced priority change: LAMF-120 updated from P2 to P0 (SLA breach threat).`
          ];
          message = jiraMsgs[Math.floor(Math.random() * jiraMsgs.length)];
          break;
        case "figma":
          const figmaMsgs = [
            `[Figma] Webhook received: File "Launch Asset Guidelines v2" edited by Design.`,
            `[Figma] Ava verified: All marketing sizes (1x1, 16x9, 9x16) are present in Figma frames.`,
            `[Figma] Status checked: Handoff specs exported and shared to development channel.`
          ];
          message = figmaMsgs[Math.floor(Math.random() * figmaMsgs.length)];
          break;
        case "linear":
          const linearMsgs = [
            `[Linear] Connected: Syncing development issues (3 completed, 2 remaining).`,
            `[Linear] Created bug ticket: "Resolve pre-launch onboarding page layout padding".`,
            `[Linear] Ava commented: "Design verified. Moving task to Dev Done."`
          ];
          message = linearMsgs[Math.floor(Math.random() * linearMsgs.length)];
          break;
      }

      setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
    }, 4500);

    return () => clearInterval(interval);
  }, [slackEnabled, jiraEnabled, figmaEnabled, linearEnabled]);

  // Handle toggle logic and initial confirmation logs
  const handleToggle = (integration: string, current: boolean, setter: (val: boolean) => void) => {
    const timestamp = new Date().toLocaleTimeString();
    const action = !current ? "CONNECTED" : "DISCONNECTED";
    setLogs((prev) => [
      ...prev,
      `[${timestamp}] [System] Integration for ${integration.toUpperCase()} was ${action}.`
    ]);
    setter(!current);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/docs/amazing-hypatia-PRD"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200"
            >
              <FileText className="h-4 w-4" />
              PRD
            </Link>
            <a
              href="https://amazing-hypatia.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300"
            >
              <Sparkles className="h-4 w-4" />
              Open Live Site
            </a>
          </nav>
        </div>
      </header>

      {/* Two-Column Interactive Layout */}
      <div className="flex-1 flex flex-col md:flex-row bg-zinc-950">
        
        {/* Left Column: Simulated Integration Center */}
        <aside className="w-full md:w-96 border-b md:border-b-0 md:border-r border-zinc-900 bg-zinc-900/30 p-6 flex flex-col gap-6 overflow-y-auto">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold">
              <Server className="h-3 w-3" />
              <span>Integration Sandbox</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Simulated Integration Center</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Connect Ava to your enterprise dev stack to coordinate marketing assets, JIRA tickets, and team communications automatically.
            </p>
          </div>

          {/* Connection Toggles */}
          <div className="space-y-3 bg-zinc-900/50 rounded-xl p-4 border border-zinc-900">
            <div className="flex items-center justify-between text-xs border-b border-zinc-850 pb-2 mb-2">
              <span className="font-semibold text-zinc-350">AVAILABLE WEBHOOKS</span>
              <span className="text-[10px] text-zinc-500">Toggles active</span>
            </div>
            
            {/* Slack */}
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${slackEnabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}></span>
                <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Slack Alerts</span>
              </div>
              <input
                type="checkbox"
                checked={slackEnabled}
                onChange={() => handleToggle("slack", slackEnabled, setSlackEnabled)}
                className="rounded border-zinc-855 bg-zinc-950 text-indigo-600 focus:ring-indigo-600"
              />
            </label>

            {/* JIRA */}
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${jiraEnabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}></span>
                <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">JIRA Backlog</span>
              </div>
              <input
                type="checkbox"
                checked={jiraEnabled}
                onChange={() => handleToggle("jira", jiraEnabled, setJiraEnabled)}
                className="rounded border-zinc-855 bg-zinc-950 text-indigo-600 focus:ring-indigo-600"
              />
            </label>

            {/* Figma */}
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${figmaEnabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}></span>
                <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Figma Designs</span>
              </div>
              <input
                type="checkbox"
                checked={figmaEnabled}
                onChange={() => handleToggle("figma", figmaEnabled, setFigmaEnabled)}
                className="rounded border-zinc-855 bg-zinc-950 text-indigo-600 focus:ring-indigo-600"
              />
            </label>

            {/* Linear */}
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${linearEnabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}></span>
                <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Linear Tasks</span>
              </div>
              <input
                type="checkbox"
                checked={linearEnabled}
                onChange={() => handleToggle("linear", linearEnabled, setLinearEnabled)}
                className="rounded border-zinc-855 bg-zinc-950 text-indigo-600 focus:ring-indigo-600"
              />
            </label>
          </div>

          {/* Terminal-like Logs Box */}
          <div className="flex-1 flex flex-col gap-2 min-h-[220px]">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <RefreshCw className="h-3 w-3 animate-spin text-zinc-650" />
              Live Integration Logs
            </span>
            <div className="flex-1 bg-black/80 rounded-xl p-4 font-mono text-[10px] leading-relaxed text-indigo-400 border border-zinc-800/80 overflow-y-auto h-64 shadow-inner max-h-[300px]">
              {logs.map((log, idx) => {
                let colorClass = "text-zinc-400";
                if (log.includes("[Slack]")) colorClass = "text-amber-300";
                if (log.includes("[JIRA]")) colorClass = "text-blue-400";
                if (log.includes("[Figma]")) colorClass = "text-fuchsia-400";
                if (log.includes("[Linear]")) colorClass = "text-purple-400";
                if (log.includes("[System]")) colorClass = "text-emerald-400 font-semibold";
                return (
                  <div key={idx} className={`mb-1.5 break-words ${colorClass}`}>
                    {log}
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>
          </div>
        </aside>

        {/* Right Column: Embedded Live Workspace Iframe */}
        <main className="flex-1 bg-zinc-950 relative min-h-[500px]">
          <iframe
            src="https://amazing-hypatia.vercel.app"
            className="w-full h-full border-none min-h-[600px] md:h-full"
            title="Launch Employee (Ava)"
            allow="clipboard-write"
          />
        </main>
      </div>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-sm text-zinc-500">
        Launch Employee (Ava) · Prince Kumar · Live Agentic Workspace
      </footer>
    </div>
  );
}
