import { useState, useEffect } from 'react';
import type { PageName, AssessmentType, TrialResult } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import AssessPage from '@/pages/AssessPage';
import AthletesPage from '@/pages/AthletesPage';
import DashboardPage from '@/pages/DashboardPage';
import RegisterPage from '@/pages/RegisterPage';
import TrialSelectPage from '@/pages/TrialSelectPage';
import TrialJumpPage from '@/pages/TrialJumpPage';
import ResultsPage from '@/pages/ResultsPage';
import ProfilePage from '@/pages/ProfilePage';

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>('home');
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>('TS-1024');
  const [selectedTrial, setSelectedTrial] = useState<AssessmentType>('jump');
  const [latestTrialResult, setLatestTrialResult] = useState<TrialResult | null>(null);

  const handleNavigate = (page: PageName) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = (data: {
    name: string;
    age: string;
    gender: string;
    state: string;
    district: string;
    sport: string;
  }) => {
    // In a real app, this would save to a database.
    // For demo mode, we just log it and navigate.
    console.log('Athlete registered:', data);
  };

  const handleSelectTrial = (type: AssessmentType) => {
    setSelectedTrial(type);
  };

  const handleSelectAthlete = (id: string) => {
    setSelectedAthleteId(id);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'assess':
        return <AssessPage onNavigate={handleNavigate} />;
      case 'athletes':
        return <AthletesPage onNavigate={handleNavigate} onSelectAthlete={handleSelectAthlete} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} onSelectAthlete={handleSelectAthlete} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} onRegister={handleRegister} />;
      case 'trial-select':
        return <TrialSelectPage onNavigate={handleNavigate} onSelectTrial={handleSelectTrial} />;
      case 'trial-jump':
        return (
          <TrialJumpPage
            onNavigate={handleNavigate}
            onTrialComplete={(res) => setLatestTrialResult(res)}
          />
        );
      case 'results':
        return (
          <ResultsPage
            onNavigate={handleNavigate}
            trialResult={latestTrialResult}
          />
        );
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} athleteId={selectedAthleteId} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Prevent body scroll when a modal-like page is active (not needed now, but kept for future)
  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
