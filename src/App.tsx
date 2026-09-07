import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { ScanNewView } from './components/ScanNewView';
import { HistoryView } from './components/HistoryView';
import { ReportsView } from './components/ReportsView';
import { DocumentModal } from './components/DocumentModal';
import { INITIAL_MOCK_RECORDS } from './data/mockDocuments';
import { ScanRecord } from './types';

export default function App() {
  const [records, setRecords] = useState<ScanRecord[]>(INITIAL_MOCK_RECORDS);
  const [currentTab, setCurrentTab] = useState<NavTab>('scan');
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<ScanRecord | null>(null);

  // Save new scan to history log
  const handleSaveScan = (newRecord: ScanRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  // Update status (e.g. override, approve, detain)
  const handleUpdateStatus = (id: string, newStatus: ScanRecord['status']) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: newStatus } : rec))
    );
    if (selectedRecordForModal && selectedRecordForModal.id === id) {
      setSelectedRecordForModal((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const flaggedCount = records.filter(
    (r) => r.overallRisk === 'High' || r.blacklistStatus === 'Flagged' || r.status === 'Detained'
  ).length;

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      {/* Navigation Sidebar (Dark Navy Bento theme) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        totalScans={records.length}
        threatCount={flaggedCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#f8fafc]">
        {/* Top Header with AI Screening Terminal, Session Time & Actions */}
        <Header
          flaggedCount={flaggedCount}
          onNavigateToScan={() => setCurrentTab('scan')}
        />

        {/* Dynamic Bento Grid Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0">
          {currentTab === 'dashboard' && (
            <DashboardView
              records={records}
              onNavigateToScan={() => setCurrentTab('scan')}
              onOpenDossier={(rec) => setSelectedRecordForModal(rec)}
            />
          )}

          {currentTab === 'scan' && (
            <ScanNewView
              onSaveScan={handleSaveScan}
              onOpenDossier={(rec) => setSelectedRecordForModal(rec)}
            />
          )}

          {currentTab === 'history' && (
            <HistoryView
              records={records}
              onOpenDossier={(rec) => setSelectedRecordForModal(rec)}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView records={records} />
          )}

          {/* Subtle Border Security Footer */}
          <div className="mt-8">
            <Footer />
          </div>
        </main>
      </div>

      {/* Detailed Forensic Inspection Modal */}
      <DocumentModal
        record={selectedRecordForModal}
        onClose={() => setSelectedRecordForModal(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
