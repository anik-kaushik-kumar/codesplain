import Navbar from "@/components/Navbar";
import FreeTierBanner from "@/components/FreeTierBanner";
import EditorPanel from "@/components/EditorPanel";
import ExplanationPanel from "@/components/ExplanationPanel";

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <FreeTierBanner />

      {/* Two-panel layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Code Editor */}
        <div className="flex-[3] border-r border-brand-border">
          <EditorPanel />
        </div>

        {/* Right: Explanation Panel */}
        <div className="flex-[2] bg-brand-bg">
          <ExplanationPanel />
        </div>
      </div>
    </div>
  );
}
