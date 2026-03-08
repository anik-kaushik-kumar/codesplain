import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* ─── Navbar ─── */}
      <nav className="flex items-center justify-between px-6 lg:px-16 py-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="text-brand-primary text-xl">&lt;&gt;</span>
          CodeSplain
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </div>
        <Link
          href="/app"
          className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Get Started
        </Link>
      </nav>

      {/* ─── Hero ─── */}
      <section className="px-6 lg:px-16 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left — Copy */}
          <div className="flex-1 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Understand
              <br />
              complex codebases
              <br />
              <span className="text-brand-primary">in seconds.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed max-w-md">
              AI-powered code explanation tool for developers.
              Paste any code and get instant line-by-line breakdowns,
              key concepts, and improvement suggestions.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/app"
                className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
              >
                Get Started — It&apos;s Free
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 hover:border-white/25 text-white font-medium px-6 py-3 rounded-lg transition-colors text-sm"
              >
                View on GitHub
              </a>
            </div>
          </div>

          {/* Right — Code Preview Mockup */}
          <div className="flex-1 w-full max-w-2xl">
            <div className="rounded-xl border border-white/10 bg-[#111118] shadow-2xl shadow-brand-primary/5 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0d0d14]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-xs text-gray-500 ml-3 font-mono">app.ts — codesplain</span>
              </div>
              {/* Two-panel layout */}
              <div className="flex min-h-[320px]">
                {/* Code panel */}
                <div className="flex-[3] p-4 font-mono text-[13px] leading-6 border-r border-white/5 overflow-hidden">
                  <div className="flex">
                    <div className="text-gray-600 select-none pr-4 text-right w-8">1{"\n"}2{"\n"}3{"\n"}4{"\n"}5{"\n"}6{"\n"}7{"\n"}8{"\n"}9</div>
                    <pre className="text-gray-300 whitespace-pre overflow-hidden">
                      <code>
                        {`async fn process_queue () {
  let client = Client:: new ();
  loop {
    match client. fetch_next (). await {
      `}<span className="bg-brand-primary/20 text-brand-link">Some(job) =&gt; execute (job). await ,</span>{`
      None => break ,
    }
  }
}`}
                      </code>
                    </pre>
                  </div>
                </div>
                {/* Analysis panel */}
                <div className="flex-[2] p-4 space-y-3">
                  <div className="text-xs font-semibold text-brand-primary uppercase tracking-wider">✦ Analysis</div>
                  <div className="space-y-2 text-[12px] text-gray-400 leading-5">
                    <p>
                      <span className="text-white font-medium">Line 5:</span> This pattern match handles
                      asynchronous job execution from the queue.
                    </p>
                    <p>
                      The <code className="text-brand-link bg-brand-primary/10 px-1 rounded">execute(job).await</code> ensures
                      sequential processing within the loop.
                    </p>
                  </div>
                  <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-brand-primary to-blue-400 rounded-full" />
                  </div>
                  <div className="text-[11px] text-gray-500">Claude 3.5 Sonnet active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="px-6 lg:px-16 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold">Built for Engineering Workflows</h2>
          <p className="mt-3 text-gray-400 max-w-lg text-lg">
            Designed to integrate seamlessly into your existing development environment with high-density information display.
          </p>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#111118] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg">BYOK Support</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                Bring your own API keys for Gemini, OpenAI, or Anthropic.
                We don&apos;t markup tokens — you use your own quota directly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#111118] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg">Multi-model Support</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                Toggle between Gemini, GPT-4o, and Claude models depending on
                your needs. Switch models instantly within the UI.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#111118] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg">6-Section Breakdown</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                Every explanation includes a summary, line-by-line breakdown,
                key concepts, improvements, simplified code, and examples.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#111118] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg">Secure by Design</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                API keys are AES-GCM encrypted and stored locally in your browser.
                They are never sent to our servers.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#111118] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg">Monaco Editor</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                The same editor that powers VS Code — with syntax highlighting,
                bracket matching, and 20+ supported languages.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#111118] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg">Shareable Links</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                Share code explanations with teammates via URL-encoded links.
                Anyone can view the code and settings you shared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="px-6 lg:px-16 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center">How It Works</h2>
          <p className="mt-3 text-gray-400 text-center text-lg">Three steps to instant code understanding</p>

          <div className="mt-14 grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold text-lg mx-auto">
                1
              </div>
              <h3 className="mt-4 text-white font-semibold text-lg">Paste Your Code</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                Drop any code snippet into the Monaco editor. Select the language and difficulty level.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg mx-auto">
                2
              </div>
              <h3 className="mt-4 text-white font-semibold text-lg">Choose Your Model</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                Use the free tier or bring your own API key for Gemini, OpenAI, or Anthropic models.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 font-bold text-lg mx-auto">
                3
              </div>
              <h3 className="mt-4 text-white font-semibold text-lg">Get Your Explanation</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                Receive a comprehensive 6-section breakdown streamed in real-time with markdown rendering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 lg:px-16 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto bg-[#111118] border border-white/5 rounded-2xl px-8 py-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold">Ready to demystify your code?</h2>
            <p className="mt-2 text-gray-400 text-lg">
              Start explaining with professional-grade tools today. Completely free.
            </p>
          </div>
          <Link
            href="/app"
            className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-sm whitespace-nowrap shrink-0"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="px-6 lg:px-16 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-brand-primary">&lt;&gt;</span>
            <span>CodeSplain</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
          <div className="text-xs text-gray-600">
            © 2026 CodeSplain. Built with Next.js.
          </div>
        </div>
      </footer>
    </div>
  );
}
