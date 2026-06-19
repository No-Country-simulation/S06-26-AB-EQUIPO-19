import React from 'react';
import { useState } from "react"
import { CompanyView } from "@/pages/CompanyView";
import { TalentView } from "@/pages/TalentView";
import { PlatformHeader, type ViewMode } from "@/components/platform-header"

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>("empresa")

  return (
    <div className="min-h-screen">
      <div className="min-h-screen bg-background">
      <PlatformHeader view={view} onViewChange={setView} />
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {view === "empresa" ? <CompanyView /> : <TalentView />}
      </main>
    </div>
    </div>
  );
};

export default App;
