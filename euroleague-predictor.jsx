import React, { useState, useEffect, useMemo, useCallback } from 'react';

// API Configuration
const API_BASE = 'https://feeds.incrowdsports.com/provider/euroleague-feeds/v2';
const COMPETITION = 'E';
const SEASON = '2025';
const SEASON_CODE = `E${SEASON}`;

// Initial team data from current 2025-26 EuroLeague standings (using API team codes)
// Official EuroLeague standings as of Round 21 (Jan 2026)
const initialTeams = [
  { code: 'HTA', name: 'Hapoel Tel Aviv', wins: 14, losses: 6, ptsFor: 1758, ptsAgainst: 1643 },
  { code: 'MCO', name: 'AS Monaco', wins: 14, losses: 7, ptsFor: 1909, ptsAgainst: 1752 },
  { code: 'PAM', name: 'Valencia Basket', wins: 14, losses: 7, ptsFor: 1896, ptsAgainst: 1797 },
  { code: 'BAR', name: 'FC Barcelona', wins: 14, losses: 7, ptsFor: 1804, ptsAgainst: 1744 },
  { code: 'ULK', name: 'Fenerbahce', wins: 13, losses: 7, ptsFor: 1640, ptsAgainst: 1596 },
  { code: 'MAD', name: 'Real Madrid', wins: 13, losses: 8, ptsFor: 1830, ptsAgainst: 1769 },
  { code: 'PAN', name: 'Panathinaikos', wins: 13, losses: 8, ptsFor: 1837, ptsAgainst: 1784 },
  { code: 'OLY', name: 'Olympiacos', wins: 12, losses: 8, ptsFor: 1766, ptsAgainst: 1688 },
  { code: 'ZAL', name: 'Zalgiris Kaunas', wins: 12, losses: 9, ptsFor: 1834, ptsAgainst: 1708 },
  { code: 'RED', name: 'Crvena Zvezda', wins: 11, losses: 10, ptsFor: 1787, ptsAgainst: 1771 },
  { code: 'MIL', name: 'EA7 Milano', wins: 11, losses: 10, ptsFor: 1761, ptsAgainst: 1755 },
  { code: 'VIR', name: 'Virtus Bologna', wins: 10, losses: 11, ptsFor: 1733, ptsAgainst: 1743 },
  { code: 'DUB', name: 'Dubai Basketball', wins: 10, losses: 11, ptsFor: 1807, ptsAgainst: 1850 },
  { code: 'TEL', name: 'Maccabi Tel Aviv', wins: 8, losses: 13, ptsFor: 1855, ptsAgainst: 1915 },
  { code: 'PRS', name: 'Paris Basketball', wins: 7, losses: 13, ptsFor: 1804, ptsAgainst: 1843 },
  { code: 'BAS', name: 'Baskonia', wins: 7, losses: 14, ptsFor: 1810, ptsAgainst: 1880 },
  { code: 'MUN', name: 'Bayern Munich', wins: 7, losses: 14, ptsFor: 1666, ptsAgainst: 1777 },
  { code: 'IST', name: 'Anadolu Efes', wins: 6, losses: 15, ptsFor: 1644, ptsAgainst: 1752 },
  { code: 'ASV', name: 'ASVEL Lyon', wins: 6, losses: 15, ptsFor: 1625, ptsAgainst: 1802 },
  { code: 'PAR', name: 'Partizan Belgrade', wins: 6, losses: 15, ptsFor: 1682, ptsAgainst: 1879 },
];

// Upcoming schedule data (rounds 22-38) - fetched from EuroLeague API on 2026-01-11
const initialSchedule = [
  // Round 22
  { round: 22, home: 'PAR', away: 'OLY', date: '2026-01-14' },
  { round: 22, home: 'DUB', away: 'VIR', date: '2026-01-15' },
  { round: 22, home: 'IST', away: 'BAS', date: '2026-01-15' },
  { round: 22, home: 'MUN', away: 'PAN', date: '2026-01-15' },
  { round: 22, home: 'TEL', away: 'ZAL', date: '2026-01-15' },
  { round: 22, home: 'MIL', away: 'RED', date: '2026-01-15' },
  { round: 22, home: 'PRS', away: 'MCO', date: '2026-01-15' },
  { round: 22, home: 'ULK', away: 'PAM', date: '2026-01-16' },
  { round: 22, home: 'ASV', away: 'HTA', date: '2026-01-16' },
  { round: 22, home: 'MAD', away: 'BAR', date: '2026-01-16' },
  // Round 23
  { round: 23, home: 'OLY', away: 'TEL', date: '2026-01-20' },
  { round: 23, home: 'HTA', away: 'IST', date: '2026-01-20' },
  { round: 23, home: 'MCO', away: 'RED', date: '2026-01-20' },
  { round: 23, home: 'ASV', away: 'ZAL', date: '2026-01-20' },
  { round: 23, home: 'PAN', away: 'BAS', date: '2026-01-20' },
  { round: 23, home: 'MUN', away: 'PAR', date: '2026-01-20' },
  { round: 23, home: 'PAM', away: 'PRS', date: '2026-01-20' },
  { round: 23, home: 'BAR', away: 'DUB', date: '2026-01-20' },
  { round: 23, home: 'MAD', away: 'MIL', date: '2026-01-20' },
  { round: 23, home: 'VIR', away: 'ULK', date: '2026-01-21' },
  // Round 24
  { round: 24, home: 'IST', away: 'OLY', date: '2026-01-22' },
  { round: 24, home: 'TEL', away: 'PAN', date: '2026-01-22' },
  { round: 24, home: 'MIL', away: 'ZAL', date: '2026-01-22' },
  { round: 24, home: 'MUN', away: 'PAM', date: '2026-01-22' },
  { round: 24, home: 'MAD', away: 'MCO', date: '2026-01-22' },
  { round: 24, home: 'PRS', away: 'DUB', date: '2026-01-22' },
  { round: 24, home: 'ULK', away: 'BAS', date: '2026-01-23' },
  { round: 24, home: 'VIR', away: 'RED', date: '2026-01-23' },
  { round: 24, home: 'PAR', away: 'HTA', date: '2026-01-23' },
  { round: 24, home: 'ASV', away: 'BAR', date: '2026-01-23' },
  // Round 25
  { round: 25, home: 'PRS', away: 'MAD', date: '2026-01-27' },
  { round: 25, home: 'ULK', away: 'IST', date: '2026-01-29' },
  { round: 25, home: 'HTA', away: 'MUN', date: '2026-01-29' },
  { round: 25, home: 'OLY', away: 'BAR', date: '2026-01-29' },
  { round: 25, home: 'MIL', away: 'PAR', date: '2026-01-29' },
  { round: 25, home: 'PAM', away: 'TEL', date: '2026-01-29' },
  { round: 25, home: 'MCO', away: 'VIR', date: '2026-01-30' },
  { round: 25, home: 'RED', away: 'DUB', date: '2026-01-30' },
  { round: 25, home: 'BAS', away: 'ZAL', date: '2026-01-30' },
  { round: 25, home: 'ASV', away: 'PAN', date: '2026-01-30' },
  // Round 26
  { round: 26, home: 'DUB', away: 'OLY', date: '2026-02-03' },
  { round: 26, home: 'IST', away: 'PAM', date: '2026-02-03' },
  { round: 26, home: 'ZAL', away: 'MCO', date: '2026-02-03' },
  { round: 26, home: 'RED', away: 'HTA', date: '2026-02-03' },
  { round: 26, home: 'TEL', away: 'PAR', date: '2026-02-03' },
  { round: 26, home: 'PAN', away: 'MAD', date: '2026-02-03' },
  { round: 26, home: 'MUN', away: 'PRS', date: '2026-02-03' },
  { round: 26, home: 'BAR', away: 'ULK', date: '2026-02-03' },
  { round: 26, home: 'MIL', away: 'BAS', date: '2026-02-03' },
  { round: 26, home: 'VIR', away: 'ASV', date: '2026-02-04' },
  // Round 27
  { round: 27, home: 'DUB', away: 'MAD', date: '2026-02-05' },
  { round: 27, home: 'HTA', away: 'PAM', date: '2026-02-05' },
  { round: 27, home: 'PAR', away: 'PAN', date: '2026-02-05' },
  { round: 27, home: 'MUN', away: 'MCO', date: '2026-02-05' },
  { round: 27, home: 'PRS', away: 'ULK', date: '2026-02-05' },
  { round: 27, home: 'IST', away: 'ZAL', date: '2026-02-06' },
  { round: 27, home: 'ASV', away: 'MIL', date: '2026-02-06' },
  { round: 27, home: 'RED', away: 'TEL', date: '2026-02-06' },
  { round: 27, home: 'OLY', away: 'VIR', date: '2026-02-06' },
  { round: 27, home: 'BAS', away: 'BAR', date: '2026-02-06' },
  // Round 28
  { round: 28, home: 'IST', away: 'VIR', date: '2026-02-12' },
  { round: 28, home: 'TEL', away: 'MUN', date: '2026-02-12' },
  { round: 28, home: 'OLY', away: 'RED', date: '2026-02-12' },
  { round: 28, home: 'BAR', away: 'PRS', date: '2026-02-12' },
  { round: 28, home: 'PAM', away: 'ASV', date: '2026-02-12' },
  { round: 28, home: 'ZAL', away: 'HTA', date: '2026-02-13' },
  { round: 28, home: 'MCO', away: 'BAS', date: '2026-02-13' },
  { round: 28, home: 'PAN', away: 'ULK', date: '2026-02-13' },
  { round: 28, home: 'MIL', away: 'DUB', date: '2026-02-13' },
  { round: 28, home: 'PAR', away: 'MAD', date: '2026-02-13' },
  // Round 29
  { round: 29, home: 'ULK', away: 'PAR', date: '2026-02-25' },
  { round: 29, home: 'ZAL', away: 'OLY', date: '2026-02-25' },
  { round: 29, home: 'VIR', away: 'BAR', date: '2026-02-25' },
  { round: 29, home: 'DUB', away: 'ASV', date: '2026-02-26' },
  { round: 29, home: 'MCO', away: 'TEL', date: '2026-02-26' },
  { round: 29, home: 'RED', away: 'IST', date: '2026-02-26' },
  { round: 29, home: 'HTA', away: 'MIL', date: '2026-02-26' },
  { round: 29, home: 'PAN', away: 'PRS', date: '2026-02-26' },
  { round: 29, home: 'BAS', away: 'PAM', date: '2026-02-26' },
  { round: 29, home: 'MAD', away: 'MUN', date: '2026-02-26' },
  // Round 30
  { round: 30, home: 'ULK', away: 'MCO', date: '2026-03-05' },
  { round: 30, home: 'TEL', away: 'HTA', date: '2026-03-05' },
  { round: 30, home: 'PAM', away: 'ZAL', date: '2026-03-05' },
  { round: 30, home: 'PAR', away: 'DUB', date: '2026-03-05' },
  { round: 30, home: 'MIL', away: 'BAR', date: '2026-03-05' },
  { round: 30, home: 'MAD', away: 'VIR', date: '2026-03-05' },
  { round: 30, home: 'IST', away: 'ASV', date: '2026-03-06' },
  { round: 30, home: 'RED', away: 'MUN', date: '2026-03-06' },
  { round: 30, home: 'OLY', away: 'PAN', date: '2026-03-06' },
  { round: 30, home: 'BAS', away: 'PRS', date: '2026-03-06' },
  // Round 31
  { round: 31, home: 'DUB', away: 'BAS', date: '2026-03-12' },
  { round: 31, home: 'MCO', away: 'OLY', date: '2026-03-12' },
  { round: 31, home: 'PAN', away: 'ZAL', date: '2026-03-12' },
  { round: 31, home: 'VIR', away: 'PAR', date: '2026-03-12' },
  { round: 31, home: 'MUN', away: 'IST', date: '2026-03-12' },
  { round: 31, home: 'MAD', away: 'PAM', date: '2026-03-12' },
  { round: 31, home: 'PRS', away: 'ASV', date: '2026-03-12' },
  { round: 31, home: 'RED', away: 'ULK', date: '2026-03-13' },
  { round: 31, home: 'BAR', away: 'HTA', date: '2026-03-13' },
  { round: 31, home: 'MIL', away: 'TEL', date: '2026-03-13' },
  // Round 32
  { round: 32, home: 'IST', away: 'MCO', date: '2026-03-19' },
  { round: 32, home: 'HTA', away: 'VIR', date: '2026-03-19' },
  { round: 32, home: 'OLY', away: 'BAS', date: '2026-03-19' },
  { round: 32, home: 'PAM', away: 'BAR', date: '2026-03-19' },
  { round: 32, home: 'MUN', away: 'DUB', date: '2026-03-19' },
  { round: 32, home: 'PRS', away: 'PAR', date: '2026-03-19' },
  { round: 32, home: 'ULK', away: 'MIL', date: '2026-03-20' },
  { round: 32, home: 'ZAL', away: 'MAD', date: '2026-03-20' },
  { round: 32, home: 'ASV', away: 'TEL', date: '2026-03-20' },
  { round: 32, home: 'PAN', away: 'RED', date: '2026-03-20' },
  // Round 33
  { round: 33, home: 'DUB', away: 'PAN', date: '2026-03-24' },
  { round: 33, home: 'TEL', away: 'ULK', date: '2026-03-24' },
  { round: 33, home: 'ZAL', away: 'MUN', date: '2026-03-24' },
  { round: 33, home: 'MCO', away: 'MIL', date: '2026-03-24' },
  { round: 33, home: 'PAM', away: 'OLY', date: '2026-03-24' },
  { round: 33, home: 'PAR', away: 'ASV', date: '2026-03-24' },
  { round: 33, home: 'BAR', away: 'IST', date: '2026-03-24' },
  { round: 33, home: 'VIR', away: 'PRS', date: '2026-03-24' },
  { round: 33, home: 'MAD', away: 'HTA', date: '2026-03-24' },
  { round: 33, home: 'BAS', away: 'RED', date: '2026-03-25' },
  // Round 34
  { round: 34, home: 'PRS', away: 'OLY', date: '2026-03-10' },
  { round: 34, home: 'TEL', away: 'DUB', date: '2026-03-26' },
  { round: 34, home: 'MUN', away: 'ASV', date: '2026-03-26' },
  { round: 34, home: 'MIL', away: 'VIR', date: '2026-03-26' },
  { round: 34, home: 'MAD', away: 'IST', date: '2026-03-26' },
  { round: 34, home: 'ULK', away: 'ZAL', date: '2026-03-27' },
  { round: 34, home: 'PAN', away: 'MCO', date: '2026-03-27' },
  { round: 34, home: 'PAR', away: 'PAM', date: '2026-03-27' },
  { round: 34, home: 'BAR', away: 'RED', date: '2026-03-27' },
  { round: 34, home: 'BAS', away: 'HTA', date: '2026-03-27' },
  // Round 35
  { round: 35, home: 'MUN', away: 'ULK', date: '2026-04-01' },
  { round: 35, home: 'TEL', away: 'IST', date: '2026-04-01' },
  { round: 35, home: 'ZAL', away: 'BAR', date: '2026-04-02' },
  { round: 35, home: 'RED', away: 'PAR', date: '2026-04-02' },
  { round: 35, home: 'HTA', away: 'PAN', date: '2026-04-02' },
  { round: 35, home: 'PRS', away: 'MIL', date: '2026-04-02' },
  { round: 35, home: 'DUB', away: 'MCO', date: '2026-04-03' },
  { round: 35, home: 'ASV', away: 'OLY', date: '2026-04-03' },
  { round: 35, home: 'VIR', away: 'PAM', date: '2026-04-03' },
  { round: 35, home: 'BAS', away: 'MAD', date: '2026-04-03' },
  // Round 36
  { round: 36, home: 'HTA', away: 'ULK', date: '2026-04-07' },
  { round: 36, home: 'ZAL', away: 'DUB', date: '2026-04-07' },
  { round: 36, home: 'RED', away: 'PRS', date: '2026-04-07' },
  { round: 36, home: 'OLY', away: 'MAD', date: '2026-04-07' },
  { round: 36, home: 'VIR', away: 'MUN', date: '2026-04-07' },
  { round: 36, home: 'PAM', away: 'MIL', date: '2026-04-07' },
  { round: 36, home: 'BAR', away: 'PAN', date: '2026-04-07' },
  { round: 36, home: 'BAS', away: 'TEL', date: '2026-04-07' },
  { round: 36, home: 'MCO', away: 'ASV', date: '2026-04-08' },
  { round: 36, home: 'IST', away: 'PAR', date: '2026-04-08' },
  // Round 37
  { round: 37, home: 'ULK', away: 'MAD', date: '2026-04-09' },
  { round: 37, home: 'HTA', away: 'OLY', date: '2026-04-09' },
  { round: 37, home: 'MIL', away: 'MUN', date: '2026-04-09' },
  { round: 37, home: 'PAM', away: 'PAN', date: '2026-04-09' },
  { round: 37, home: 'PRS', away: 'TEL', date: '2026-04-09' },
  { round: 37, home: 'DUB', away: 'IST', date: '2026-04-10' },
  { round: 37, home: 'MCO', away: 'BAR', date: '2026-04-10' },
  { round: 37, home: 'ASV', away: 'RED', date: '2026-04-10' },
  { round: 37, home: 'VIR', away: 'BAS', date: '2026-04-10' },
  { round: 37, home: 'PAR', away: 'ZAL', date: '2026-04-10' },
  // Round 38
  { round: 38, home: 'ASV', away: 'ULK', date: '2026-04-16' },
  { round: 38, home: 'TEL', away: 'VIR', date: '2026-04-16' },
  { round: 38, home: 'OLY', away: 'MIL', date: '2026-04-16' },
  { round: 38, home: 'PAR', away: 'BAS', date: '2026-04-16' },
  { round: 38, home: 'MAD', away: 'RED', date: '2026-04-16' },
  { round: 38, home: 'DUB', away: 'PAM', date: '2026-04-17' },
  { round: 38, home: 'ZAL', away: 'PRS', date: '2026-04-17' },
  { round: 38, home: 'MCO', away: 'HTA', date: '2026-04-17' },
  { round: 38, home: 'PAN', away: 'IST', date: '2026-04-17' },
  { round: 38, home: 'BAR', away: 'MUN', date: '2026-04-17' },
];

const TOTAL_GAMES = 38;
const SIMULATIONS = 5000;

// Calculate ELO-like rating based on wins and point differential
const calculateRating = (team) => {
  const games = team.wins + team.losses;
  if (games === 0) return 1500;
  const winPct = team.wins / games;
  const avgMargin = (team.ptsFor - team.ptsAgainst) / games;
  return 1500 + (winPct - 0.5) * 400 + avgMargin * 10;
};

// Expected win probability based on ratings
const expectedWinProb = (ratingA, ratingB, isHome = false, h2hBonus = 0) => {
  const homeAdv = isHome ? 50 : 0;
  return 1 / (1 + Math.pow(10, (ratingB - ratingA - homeAdv - h2hBonus) / 400));
};

// Simple bar chart component for position distribution
const PositionChart = ({ positions, teamName }) => {
  const maxProb = Math.max(...positions);

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>{teamName} - Position Probability</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '100px' }}>
        {positions.slice(0, 20).map((prob, idx) => (
          <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '100%',
                height: `${(prob / maxProb) * 80}px`,
                background: idx < 6 ? '#22c55e' : idx < 10 ? '#eab308' : '#ef4444',
                borderRadius: '2px 2px 0 0',
                minHeight: prob > 0 ? '2px' : '0'
              }}
            />
            <div style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>{idx + 1}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#888' }}>
        <span>Position</span>
        <span>Max: {maxProb.toFixed(1)}%</span>
      </div>
    </div>
  );
};

export default function EuroLeaguePredictor() {
  const [teams, setTeams] = useState(initialTeams);
  const [matches, setMatches] = useState([]);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [predictions, setPredictions] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('standings');
  const [newMatch, setNewMatch] = useState({ home: '', away: '', homeScore: '', awayScore: '' });
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [selectedRound, setSelectedRound] = useState(22);

  // New state for features
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [headToHead, setHeadToHead] = useState({});
  const [favoriteTeam, setFavoriteTeam] = useState(null);
  const [whatIfResults, setWhatIfResults] = useState({});
  const [showChart, setShowChart] = useState(null);
  const [playoffResults, setPlayoffResults] = useState(null);
  const [gamePredictions, setGamePredictions] = useState([]);
  const [gameFilterTeam, setGameFilterTeam] = useState('');
  const [gameFilterRound, setGameFilterRound] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const teamsData = await window.storage.get('euroleague-teams');
        const matchesData = await window.storage.get('euroleague-matches');
        const h2hData = await window.storage.get('euroleague-h2h');
        const favData = await window.storage.get('euroleague-favorite');
        const whatIfData = await window.storage.get('euroleague-whatif');
        const lastUpdateData = await window.storage.get('euroleague-lastupdate');
        const predictionsData = await window.storage.get('euroleague-predictions');
        const playoffsData = await window.storage.get('euroleague-playoffs');
        const gamePredictionsData = await window.storage.get('euroleague-gamepredictions');

        if (teamsData?.value) setTeams(JSON.parse(teamsData.value));
        if (matchesData?.value) setMatches(JSON.parse(matchesData.value));
        if (h2hData?.value) setHeadToHead(JSON.parse(h2hData.value));
        if (favData?.value) setFavoriteTeam(favData.value);
        if (whatIfData?.value) setWhatIfResults(JSON.parse(whatIfData.value));
        if (lastUpdateData?.value) setLastUpdate(lastUpdateData.value);
        if (predictionsData?.value) setPredictions(JSON.parse(predictionsData.value));
        if (playoffsData?.value) setPlayoffResults(JSON.parse(playoffsData.value));
        if (gamePredictionsData?.value) setGamePredictions(JSON.parse(gamePredictionsData.value));
      } catch (e) {
        console.log('No saved data found, using defaults');
      }
    };
    loadData();
  }, []);

  // Save data to storage
  const saveData = async (newTeams, newMatches) => {
    try {
      await window.storage.set('euroleague-teams', JSON.stringify(newTeams));
      await window.storage.set('euroleague-matches', JSON.stringify(newMatches));
    } catch (e) {
      console.error('Failed to save:', e);
    }
  };

  // Calculate game predictions when teams or schedule change
  // Calculate schedule previews (for Schedule tab - pre-simulation win probabilities)
  const [schedulePreview, setSchedulePreview] = useState({});

  useEffect(() => {
    const ratings = {};
    teams.forEach(t => {
      ratings[t.code] = calculateRating(t);
    });

    const preds = {};
    schedule.forEach((game, idx) => {
      const homeRating = ratings[game.home] || 1500;
      const awayRating = ratings[game.away] || 1500;

      // Get H2H bonus if available
      const h2hKey = `${game.home}-${game.away}`;
      const h2hRecord = headToHead[h2hKey];
      let h2hBonus = 0;
      if (h2hRecord) {
        const h2hWinRate = h2hRecord.wins / (h2hRecord.wins + h2hRecord.losses);
        h2hBonus = (h2hWinRate - 0.5) * 50; // Max 25 point bonus
      }

      const homeWinProb = expectedWinProb(homeRating, awayRating, true, h2hBonus);
      preds[idx] = {
        homeWinProb: homeWinProb * 100,
        awayWinProb: (1 - homeWinProb) * 100,
        homeRating,
        awayRating
      };
    });
    setSchedulePreview(preds);
  }, [teams, schedule, headToHead]);

  // Fetch live standings from API
  const fetchLiveStandings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/competitions/${COMPETITION}/seasons/${SEASON_CODE}/standings`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch standings');

      const data = await response.json();
      const standings = data.data || [];

      // Map API data to our format
      const updatedTeams = standings.map(team => ({
        code: team.club?.code || team.code,
        name: team.club?.name || team.name,
        wins: team.gamesWon || 0,
        losses: team.gamesLost || 0,
        ptsFor: team.pointsFor || 0,
        ptsAgainst: team.pointsAgainst || 0
      }));

      if (updatedTeams.length > 0) {
        setTeams(updatedTeams);
        await window.storage.set('euroleague-teams', JSON.stringify(updatedTeams));
        setLastUpdate(new Date().toISOString());
        await window.storage.set('euroleague-lastupdate', new Date().toISOString());
      }
    } catch (e) {
      console.error('Failed to fetch standings:', e);
      // Try alternative method - fetch from game results
      await fetchStandingsFromGames();
    } finally {
      setIsLoading(false);
    }
  };

  // Alternative method to build standings from game results
  const fetchStandingsFromGames = async () => {
    try {
      const teamStats = {};
      initialTeams.forEach(t => {
        teamStats[t.code] = { ...t, wins: 0, losses: 0, ptsFor: 0, ptsAgainst: 0 };
      });

      // Fetch completed games for each round
      for (let round = 1; round <= 21; round++) {
        try {
          const response = await fetch(
            `${API_BASE}/competitions/${COMPETITION}/seasons/${SEASON_CODE}/games?phaseTypeCode=RS&roundNumber=${round}`,
            { headers: { 'Accept': 'application/json' } }
          );

          if (response.ok) {
            const data = await response.json();
            const games = data.data || [];

            games.forEach(game => {
              if (game.played) {
                const homeCode = game.home?.code;
                const awayCode = game.away?.code;
                const homeScore = game.home?.score || 0;
                const awayScore = game.away?.score || 0;

                if (teamStats[homeCode]) {
                  teamStats[homeCode].ptsFor += homeScore;
                  teamStats[homeCode].ptsAgainst += awayScore;
                  if (homeScore > awayScore) {
                    teamStats[homeCode].wins++;
                  } else {
                    teamStats[homeCode].losses++;
                  }
                }

                if (teamStats[awayCode]) {
                  teamStats[awayCode].ptsFor += awayScore;
                  teamStats[awayCode].ptsAgainst += homeScore;
                  if (awayScore > homeScore) {
                    teamStats[awayCode].wins++;
                  } else {
                    teamStats[awayCode].losses++;
                  }
                }

                // Update H2H records
                const h2hKey = `${homeCode}-${awayCode}`;
                const reverseKey = `${awayCode}-${homeCode}`;
                setHeadToHead(prev => {
                  const updated = { ...prev };
                  if (!updated[h2hKey]) updated[h2hKey] = { wins: 0, losses: 0 };
                  if (!updated[reverseKey]) updated[reverseKey] = { wins: 0, losses: 0 };

                  if (homeScore > awayScore) {
                    updated[h2hKey].wins++;
                    updated[reverseKey].losses++;
                  } else {
                    updated[h2hKey].losses++;
                    updated[reverseKey].wins++;
                  }
                  return updated;
                });
              }
            });
          }
        } catch (e) {
          console.log(`Failed to fetch round ${round}`);
        }
      }

      const updatedTeams = Object.values(teamStats);
      if (updatedTeams.some(t => t.wins > 0 || t.losses > 0)) {
        setTeams(updatedTeams);
        await window.storage.set('euroleague-teams', JSON.stringify(updatedTeams));
        await window.storage.set('euroleague-h2h', JSON.stringify(headToHead));
        setLastUpdate(new Date().toISOString());
        await window.storage.set('euroleague-lastupdate', new Date().toISOString());
      }
    } catch (e) {
      console.error('Failed to fetch games:', e);
    }
  };

  // Reset to initial data
  const resetData = async () => {
    if (confirm('Reset all data to current official standings?')) {
      setTeams(initialTeams);
      setMatches([]);
      setPredictions(null);
      setHeadToHead({});
      setWhatIfResults({});
      setPlayoffResults(null);
      setGamePredictions([]);
      try {
        await window.storage.delete('euroleague-teams');
        await window.storage.delete('euroleague-matches');
        await window.storage.delete('euroleague-h2h');
        await window.storage.delete('euroleague-whatif');
        await window.storage.delete('euroleague-predictions');
        await window.storage.delete('euroleague-playoffs');
        await window.storage.delete('euroleague-gamepredictions');
      } catch (e) {}
    }
  };

  // Add a new match result
  const addMatch = () => {
    if (!newMatch.home || !newMatch.away || !newMatch.homeScore || !newMatch.awayScore) return;
    if (newMatch.home === newMatch.away) return;

    const homeScore = parseInt(newMatch.homeScore);
    const awayScore = parseInt(newMatch.awayScore);

    const updatedTeams = teams.map(t => {
      if (t.code === newMatch.home) {
        return {
          ...t,
          wins: homeScore > awayScore ? t.wins + 1 : t.wins,
          losses: homeScore < awayScore ? t.losses + 1 : t.losses,
          ptsFor: t.ptsFor + homeScore,
          ptsAgainst: t.ptsAgainst + awayScore
        };
      }
      if (t.code === newMatch.away) {
        return {
          ...t,
          wins: awayScore > homeScore ? t.wins + 1 : t.wins,
          losses: awayScore < homeScore ? t.losses + 1 : t.losses,
          ptsFor: t.ptsFor + awayScore,
          ptsAgainst: t.ptsAgainst + homeScore
        };
      }
      return t;
    });

    // Update H2H
    const h2hKey = `${newMatch.home}-${newMatch.away}`;
    const reverseKey = `${newMatch.away}-${newMatch.home}`;
    setHeadToHead(prev => {
      const updated = { ...prev };
      if (!updated[h2hKey]) updated[h2hKey] = { wins: 0, losses: 0 };
      if (!updated[reverseKey]) updated[reverseKey] = { wins: 0, losses: 0 };

      if (homeScore > awayScore) {
        updated[h2hKey].wins++;
        updated[reverseKey].losses++;
      } else {
        updated[h2hKey].losses++;
        updated[reverseKey].wins++;
      }
      return updated;
    });

    const newMatchRecord = {
      id: Date.now(),
      date: new Date().toISOString(),
      home: newMatch.home,
      away: newMatch.away,
      homeScore,
      awayScore
    };

    const updatedMatches = [...matches, newMatchRecord];
    setTeams(updatedTeams);
    setMatches(updatedMatches);
    saveData(updatedTeams, updatedMatches);
    setNewMatch({ home: '', away: '', homeScore: '', awayScore: '' });
    setShowAddMatch(false);
    setPredictions(null);
  };

  // Delete a match
  const deleteMatch = (matchId) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const updatedTeams = teams.map(t => {
      if (t.code === match.home) {
        return {
          ...t,
          wins: match.homeScore > match.awayScore ? t.wins - 1 : t.wins,
          losses: match.homeScore < match.awayScore ? t.losses - 1 : t.losses,
          ptsFor: t.ptsFor - match.homeScore,
          ptsAgainst: t.ptsAgainst - match.awayScore
        };
      }
      if (t.code === match.away) {
        return {
          ...t,
          wins: match.awayScore > match.homeScore ? t.wins - 1 : t.wins,
          losses: match.awayScore < match.homeScore ? t.losses - 1 : t.losses,
          ptsFor: t.ptsFor - match.awayScore,
          ptsAgainst: t.ptsAgainst - match.homeScore
        };
      }
      return t;
    });

    const updatedMatches = matches.filter(m => m.id !== matchId);
    setTeams(updatedTeams);
    setMatches(updatedMatches);
    saveData(updatedTeams, updatedMatches);
    setPredictions(null);
  };

  // Set what-if game result
  const setWhatIfResult = (gameIdx, result) => {
    setWhatIfResults(prev => {
      const updated = { ...prev };
      if (result === null) {
        delete updated[gameIdx];
      } else {
        updated[gameIdx] = result; // 'home' or 'away'
      }
      window.storage.set('euroleague-whatif', JSON.stringify(updated));
      return updated;
    });
    setPredictions(null);
  };

  // Run Monte Carlo simulation using actual schedule
  const runSimulation = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const ratings = {};
      teams.forEach(t => {
        ratings[t.code] = calculateRating(t);
      });

      // Track position finishes for each team
      const positionCounts = {};
      teams.forEach(t => {
        positionCounts[t.code] = Array(20).fill(0);
      });

      // Track playoff appearances
      const playoffCounts = {};
      const finalFourCounts = {};
      const championCounts = {};
      // Track total wins for projected final record
      const totalWins = {};
      const totalLosses = {};
      teams.forEach(t => {
        playoffCounts[t.code] = 0;
        finalFourCounts[t.code] = 0;
        championCounts[t.code] = 0;
        totalWins[t.code] = 0;
        totalLosses[t.code] = 0;
      });

      // Track game win counts for predictions
      const gameWinCounts = {}; // gameIdx -> { home: count, away: count }

      // Run simulations
      for (let sim = 0; sim < SIMULATIONS; sim++) {
        // Clone current standings
        const simTeams = {};
        teams.forEach(t => {
          simTeams[t.code] = {
            ...t,
            simWins: t.wins,
            simLosses: t.losses,
            simPtsFor: t.ptsFor,
            simPtsAgainst: t.ptsAgainst
          };
        });

        // Simulate each game in the actual schedule
        schedule.forEach((game, idx) => {
          const homeTeam = simTeams[game.home];
          const awayTeam = simTeams[game.away];

          if (!homeTeam || !awayTeam) return;

          // Initialize game win counts
          if (!gameWinCounts[idx]) {
            gameWinCounts[idx] = { home: 0, away: 0 };
          }

          // Check for what-if override
          if (whatIfResults[idx]) {
            if (whatIfResults[idx] === 'home') {
              homeTeam.simWins++;
              awayTeam.simLosses++;
              gameWinCounts[idx].home++;
            } else {
              awayTeam.simWins++;
              homeTeam.simLosses++;
              gameWinCounts[idx].away++;
            }
            return;
          }

          // Get H2H bonus
          const h2hKey = `${game.home}-${game.away}`;
          const h2hRecord = headToHead[h2hKey];
          let h2hBonus = 0;
          if (h2hRecord && (h2hRecord.wins + h2hRecord.losses) > 0) {
            const h2hWinRate = h2hRecord.wins / (h2hRecord.wins + h2hRecord.losses);
            h2hBonus = (h2hWinRate - 0.5) * 50;
          }

          // Calculate win probability for home team (with home advantage)
          const homeWinProb = expectedWinProb(
            ratings[game.home],
            ratings[game.away],
            true,
            h2hBonus
          );

          // Determine winner
          if (Math.random() < homeWinProb) {
            homeTeam.simWins++;
            awayTeam.simLosses++;
            gameWinCounts[idx].home++;
          } else {
            awayTeam.simWins++;
            homeTeam.simLosses++;
            gameWinCounts[idx].away++;
          }
        });

        // Convert to array and sort using EuroLeague tiebreaker rules
        const simTeamsArray = Object.values(simTeams);
        simTeamsArray.sort((a, b) => {
          // Primary: Win-loss record
          if (b.simWins !== a.simWins) return b.simWins - a.simWins;

          // Secondary: Head-to-head record
          const h2hKeyAB = `${a.code}-${b.code}`;
          const h2hKeyBA = `${b.code}-${a.code}`;
          const h2hA = headToHead[h2hKeyAB];
          const h2hB = headToHead[h2hKeyBA];

          if (h2hA && h2hB) {
            const aWinsVsB = h2hA.wins || 0;
            const bWinsVsA = h2hB.wins || 0;
            if (aWinsVsB !== bWinsVsA) return bWinsVsA - aWinsVsB;
          }

          // Tertiary: Point differential
          const aDiff = a.simPtsFor - a.simPtsAgainst;
          const bDiff = b.simPtsFor - b.simPtsAgainst;
          return bDiff - aDiff;
        });

        // Record positions and final W-L
        simTeamsArray.forEach((team, idx) => {
          positionCounts[team.code][idx]++;
          totalWins[team.code] += team.simWins;
          totalLosses[team.code] += team.simLosses;
        });

        // Simulate playoffs (top 6 + play-in for 7-10)
        const playoffTeams = simTeamsArray.slice(0, 6).map(t => t.code);
        const playInTeams = simTeamsArray.slice(6, 10).map(t => t.code);

        // Play-in: 7 vs 8, 9 vs 10, then losers play for final spot
        if (playInTeams.length >= 4) {
          const game1Winner = Math.random() < 0.55 ? playInTeams[0] : playInTeams[1]; // 7 vs 8
          const game2Winner = Math.random() < 0.55 ? playInTeams[2] : playInTeams[3]; // 9 vs 10
          const game1Loser = game1Winner === playInTeams[0] ? playInTeams[1] : playInTeams[0];
          const finalWinner = Math.random() < 0.55 ? game1Loser : game2Winner;

          playoffTeams.push(game1Winner);
          playoffTeams.push(finalWinner);
        }

        // Mark playoff appearances
        playoffTeams.forEach(code => {
          playoffCounts[code]++;
        });

        // Simulate playoff series (best of 5, 2-2-1 format)
        // Higher seed hosts games 1, 2, 5; lower seed hosts games 3, 4
        const simulateSeries = (higherSeed, lowerSeed) => {
          const rating1 = ratings[higherSeed] || 1500;
          const rating2 = ratings[lowerSeed] || 1500;
          let wins1 = 0, wins2 = 0;
          let gameNum = 0;

          while (wins1 < 3 && wins2 < 3) {
            gameNum++;
            // 2-2-1 format: higher seed home for games 1, 2, 5
            const isHigherSeedHome = gameNum === 1 || gameNum === 2 || gameNum === 5;
            const prob = expectedWinProb(rating1, rating2, isHigherSeedHome);
            if (Math.random() < prob) {
              wins1++;
            } else {
              wins2++;
            }
          }
          return wins1 === 3 ? higherSeed : lowerSeed;
        };

        // Greek teams get a boost in Final Four (Athens 2026)
        const GREEK_TEAMS = ['PAN', 'OLY']; // PAN = Panathinaikos, OLY = Olympiacos
        const GREEK_F4_BOOST = 0.10; // +10% win probability for Greek teams in F4

        // Simulate single elimination game (for Final Four)
        const simulateGame = (team1, team2, isFinalFour = false) => {
          const rating1 = ratings[team1] || 1500;
          const rating2 = ratings[team2] || 1500;
          let prob = expectedWinProb(rating1, rating2, false); // neutral venue

          // Apply Greek team boost for Final Four games in Athens
          if (isFinalFour) {
            const team1IsGreek = GREEK_TEAMS.includes(team1);
            const team2IsGreek = GREEK_TEAMS.includes(team2);

            if (team1IsGreek && !team2IsGreek) {
              // Team 1 is Greek, gets boost
              prob = Math.min(0.95, prob + GREEK_F4_BOOST);
            } else if (team2IsGreek && !team1IsGreek) {
              // Team 2 is Greek, team 1's prob decreases
              prob = Math.max(0.05, prob - GREEK_F4_BOOST);
            }
            // If both are Greek or neither is Greek, no adjustment
          }

          return Math.random() < prob ? team1 : team2;
        };

        if (playoffTeams.length >= 8) {
          // Quarterfinals (best-of-5, 2-2-1 format): 1v8, 4v5, 2v7, 3v6
          const qf1 = simulateSeries(playoffTeams[0], playoffTeams[7]);
          const qf2 = simulateSeries(playoffTeams[3], playoffTeams[4]);
          const qf3 = simulateSeries(playoffTeams[1], playoffTeams[6]);
          const qf4 = simulateSeries(playoffTeams[2], playoffTeams[5]);

          // Final Four participants
          finalFourCounts[qf1]++;
          finalFourCounts[qf2]++;
          finalFourCounts[qf3]++;
          finalFourCounts[qf4]++;

          // Final Four - Single elimination (Athens 2026 - Greek teams get boost)
          // Semifinal 1: QF1 winner vs QF2 winner
          // Semifinal 2: QF3 winner vs QF4 winner
          const finalist1 = simulateGame(qf1, qf2, true); // F4 game
          const finalist2 = simulateGame(qf3, qf4, true); // F4 game

          // Championship Game (Athens - Greek teams get boost)
          const champion = simulateGame(finalist1, finalist2, true); // F4 game
          championCounts[champion]++;
        }
      }

      // Calculate probabilities
      const results = teams.map(team => {
        const positions = positionCounts[team.code].map(count => (count / SIMULATIONS) * 100);
        const avgPosition = positions.reduce((sum, prob, idx) => sum + prob * (idx + 1), 0) / 100;
        const playoffProb = positions.slice(0, 6).reduce((a, b) => a + b, 0);
        const playInProb = positions.slice(6, 10).reduce((a, b) => a + b, 0);
        const eliminatedProb = positions.slice(10).reduce((a, b) => a + b, 0);

        // Projected final W-L (average across simulations)
        const projectedWins = Math.round(totalWins[team.code] / SIMULATIONS);
        const projectedLosses = Math.round(totalLosses[team.code] / SIMULATIONS);

        return {
          ...team,
          rating: ratings[team.code],
          positions,
          avgPosition,
          playoffProb,
          playInProb,
          eliminatedProb,
          makePlayoffs: (playoffCounts[team.code] / SIMULATIONS) * 100,
          finalFour: (finalFourCounts[team.code] / SIMULATIONS) * 100,
          champion: (championCounts[team.code] / SIMULATIONS) * 100,
          projectedWins,
          projectedLosses
        };
      });

      // Calculate game predictions
      const gamePredictions = schedule.map((game, idx) => {
        const counts = gameWinCounts[idx] || { home: 0, away: 0 };
        const total = counts.home + counts.away;
        const homeWinPct = total > 0 ? (counts.home / total) * 100 : 50;
        const predictedWinner = homeWinPct >= 50 ? game.home : game.away;
        const confidence = Math.max(homeWinPct, 100 - homeWinPct);
        return {
          ...game,
          homeWinPct,
          awayWinPct: 100 - homeWinPct,
          predictedWinner,
          confidence
        };
      });

      results.sort((a, b) => a.avgPosition - b.avgPosition);
      setPredictions(results);

      // Set playoff results and game predictions
      const playoffData = {
        playoffCounts,
        finalFourCounts,
        championCounts
      };
      setPlayoffResults(playoffData);
      setGamePredictions(gamePredictions);

      // Save simulation results to localStorage
      try {
        await window.storage.set('euroleague-predictions', JSON.stringify(results));
        await window.storage.set('euroleague-playoffs', JSON.stringify(playoffData));
        await window.storage.set('euroleague-gamepredictions', JSON.stringify(gamePredictions));
      } catch (e) {
        console.error('Failed to save simulation results:', e);
      }

      setIsSimulating(false);
    }, 100);
  };

  // Export predictions to CSV
  const exportToCSV = () => {
    if (!predictions) return;

    const headers = ['Rank', 'Team', 'Code', 'Rating', 'Avg Position', 'Playoff %', 'Play-In %', 'Eliminated %', 'Make Playoffs %', 'Final Four %', 'Champion %'];
    const rows = predictions.map((team, idx) => [
      idx + 1,
      team.name,
      team.code,
      team.rating.toFixed(0),
      team.avgPosition.toFixed(2),
      team.playoffProb.toFixed(1),
      team.playInProb.toFixed(1),
      team.eliminatedProb.toFixed(1),
      team.makePlayoffs.toFixed(1),
      team.finalFour.toFixed(1),
      team.champion.toFixed(1)
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `euroleague-predictions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to JSON
  const exportToJSON = () => {
    if (!predictions) return;

    const data = {
      exportDate: new Date().toISOString(),
      simulations: SIMULATIONS,
      teams: predictions,
      schedule: schedule,
      whatIfResults: whatIfResults
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `euroleague-predictions-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Set favorite team
  const setFavorite = async (code) => {
    setFavoriteTeam(code);
    await window.storage.set('euroleague-favorite', code);
  };

  // Sort teams by current standings using EuroLeague tiebreaker rules
  const sortedTeams = useMemo(() => {
    const sorted = [...teams].sort((a, b) => {
      // Primary: Win percentage (accounts for different games played)
      const aWinPct = a.wins / (a.wins + a.losses);
      const bWinPct = b.wins / (b.wins + b.losses);
      if (Math.abs(bWinPct - aWinPct) > 0.001) return bWinPct - aWinPct;

      // Secondary: Head-to-head record
      const h2hKeyAB = `${a.code}-${b.code}`;
      const h2hKeyBA = `${b.code}-${a.code}`;
      const h2hA = headToHead[h2hKeyAB];
      const h2hB = headToHead[h2hKeyBA];

      if (h2hA && h2hB) {
        const aWinsVsB = h2hA.wins || 0;
        const bWinsVsA = h2hB.wins || 0;
        if (aWinsVsB !== bWinsVsA) return bWinsVsA - aWinsVsB;
      }

      // Tertiary: Point differential
      const aDiff = a.ptsFor - a.ptsAgainst;
      const bDiff = b.ptsFor - b.ptsAgainst;
      return bDiff - aDiff;
    });
    return sorted;
  }, [teams, headToHead]);

  // Get favorite team's remaining games
  const favoriteGames = useMemo(() => {
    if (!favoriteTeam) return [];
    return schedule.filter(g => g.home === favoriteTeam || g.away === favoriteTeam);
  }, [favoriteTeam, schedule]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#e8e8e8',
      fontFamily: "'Outfit', 'Segoe UI', sans-serif",
      padding: '0'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; }

        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #e8e8e8;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .btn-small {
          padding: 6px 12px;
          font-size: 12px;
        }

        .tab {
          padding: 12px 28px;
          background: transparent;
          border: none;
          color: #888;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
        }

        .tab.active {
          color: #ff6b35;
        }

        .tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 3px;
          background: #ff6b35;
          border-radius: 3px 3px 0 0;
        }

        input, select {
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(0, 0, 0, 0.3);
          color: #e8e8e8;
          font-family: inherit;
          font-size: 14px;
        }

        input:focus, select:focus {
          outline: none;
          border-color: #ff6b35;
        }

        select option {
          background: #1a1a2e;
        }

        .probability-bar {
          height: 28px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          overflow: hidden;
          display: flex;
        }

        .prob-segment {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          color: white;
          min-width: 0;
          transition: all 0.3s;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .loading {
          background: linear-gradient(90deg, #1a1a2e 25%, #2a2a4e 50%, #1a1a2e 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .favorite-row {
          background: rgba(255, 107, 53, 0.15) !important;
          border-left: 3px solid #ff6b35;
        }

        .whatif-btn {
          padding: 4px 8px;
          font-size: 11px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .whatif-btn.home {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .whatif-btn.away {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .whatif-btn.active {
          transform: scale(1.1);
        }

        .whatif-btn.home.active {
          background: #22c55e;
          color: white;
        }

        .whatif-btn.away.active {
          background: #ef4444;
          color: white;
        }

        .win-prob {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .info-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: #888;
          font-size: 10px;
          cursor: help;
          margin-left: 6px;
          position: relative;
        }

        .info-icon:hover {
          background: rgba(255, 107, 53, 0.3);
          color: #ff6b35;
        }

        .tooltip {
          position: relative;
          display: inline-block;
        }

        .tooltip .tooltip-text {
          visibility: hidden;
          width: 250px;
          background: rgba(26, 26, 46, 0.98);
          color: #e8e8e8;
          text-align: left;
          border-radius: 8px;
          padding: 12px;
          position: absolute;
          z-index: 100;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.2s;
          font-size: 12px;
          line-height: 1.5;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .tooltip:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }

        .help-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #888;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .help-btn:hover {
          background: rgba(255, 107, 53, 0.2);
          color: #ff6b35;
          border-color: #ff6b35;
        }
      `}</style>

      {/* Header */}
      <header style={{
        padding: '24px 40px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>🏀</div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>EuroLeague Predictor</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#666', fontFamily: "'Space Mono', monospace" }}>
              2025-26 Season · Monte Carlo Simulation
              {lastUpdate && (
                <span style={{ marginLeft: '12px', color: '#888' }}>
                  · Updated: {new Date(lastUpdate).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Favorite Team Selector */}
          <select
            value={favoriteTeam || ''}
            onChange={e => setFavorite(e.target.value || null)}
            style={{ minWidth: '150px' }}
          >
            <option value="">Select favorite...</option>
            {teams.map(t => (
              <option key={t.code} value={t.code}>{t.name}</option>
            ))}
          </select>
          <button
            className="btn btn-secondary"
            onClick={fetchLiveStandings}
            disabled={isLoading}
            style={{ fontSize: '13px' }}
          >
            {isLoading ? '...' : '↻ Refresh Data'}
          </button>
          <button className="btn btn-secondary" onClick={resetData} style={{ fontSize: '13px' }}>
            Reset
          </button>
          <button className="help-btn" onClick={() => setShowHelp(true)} title="Help & Info">
            ?
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        display: 'flex',
        gap: '8px',
        padding: '0 40px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <button className={`tab ${activeTab === 'standings' ? 'active' : ''}`} onClick={() => setActiveTab('standings')}>
          Standings
        </button>
        <button className={`tab ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
          Schedule ({schedule.length})
        </button>
        <button className={`tab ${activeTab === 'predictions' ? 'active' : ''}`} onClick={() => setActiveTab('predictions')}>
          Predictions
        </button>
        <button className={`tab ${activeTab === 'playoffs' ? 'active' : ''}`} onClick={() => setActiveTab('playoffs')}>
          Playoffs
        </button>
        {favoriteTeam && (
          <button className={`tab ${activeTab === 'favorite' ? 'active' : ''}`} onClick={() => setActiveTab('favorite')}>
            My Team
          </button>
        )}
        <button className={`tab ${activeTab === 'matches' ? 'active' : ''}`} onClick={() => setActiveTab('matches')}>
          Matches ({matches.length})
        </button>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '32px 40px' }}>

        {/* Standings Tab */}
        {activeTab === 'standings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Current Standings</h2>
              <button className="btn btn-primary" onClick={() => setShowAddMatch(true)}>
                + Add Match Result
              </button>
            </div>

            <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#888', fontWeight: 500 }}>#</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#888', fontWeight: 500 }}>TEAM</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 500 }}>GP</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 500 }}>W</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 500 }}>L</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 500 }}>WIN%</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 500 }}>PTS+</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 500 }}>PTS-</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 500 }}>+/-</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 500 }}>RATING</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTeams.map((team, idx) => {
                    const games = team.wins + team.losses;
                    const diff = team.ptsFor - team.ptsAgainst;
                    const zone = idx < 6 ? 'playoff' : idx < 10 ? 'playin' : 'out';
                    const isFavorite = team.code === favoriteTeam;

                    return (
                      <tr key={team.code} className={isFavorite ? 'favorite-row' : ''} style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        background: isFavorite ? undefined :
                                   zone === 'playoff' ? 'rgba(34, 197, 94, 0.08)' :
                                   zone === 'playin' ? 'rgba(234, 179, 8, 0.08)' : 'transparent'
                      }}>
                        <td style={{ padding: '14px 16px', fontFamily: "'Space Mono', monospace", color: '#666' }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              background: isFavorite ? 'linear-gradient(135deg, #ff6b35, #f7931e)' : 'linear-gradient(135deg, #2a2a4e, #1a1a2e)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 700,
                              fontFamily: "'Space Mono', monospace"
                            }}>{team.code}</span>
                            <span style={{ fontWeight: isFavorite ? 700 : 500 }}>{team.name}</span>
                            {isFavorite && <span style={{ fontSize: '14px' }}>⭐</span>}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>{games}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: '#22c55e', fontWeight: 600 }}>{team.wins}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: '#ef4444', fontWeight: 600 }}>{team.losses}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: "'Space Mono', monospace" }}>
                          {games > 0 ? ((team.wins / games) * 100).toFixed(1) : 0}%
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: '#888' }}>{team.ptsFor}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: '#888' }}>{team.ptsAgainst}</td>
                        <td style={{
                          padding: '14px 16px',
                          textAlign: 'center',
                          fontFamily: "'Space Mono', monospace",
                          color: diff > 0 ? '#22c55e' : diff < 0 ? '#ef4444' : '#888',
                          fontWeight: 600
                        }}>
                          {diff > 0 ? '+' : ''}{diff}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: '#ff6b35', fontWeight: 600 }}>
                          {calculateRating(team).toFixed(0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginTop: '16px', fontSize: '13px', color: '#666' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(34, 197, 94, 0.4)' }}></span>
                Direct Playoffs (1-6)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(234, 179, 8, 0.4)' }}></span>
                Play-In (7-10)
              </span>
              {favoriteTeam && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(255, 107, 53, 0.4)' }}></span>
                  Your Team
                </span>
              )}
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Upcoming Schedule</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
                  {schedule.length} games remaining · Click to set what-if outcomes
                  {Object.keys(whatIfResults).length > 0 && (
                    <span style={{ color: '#ff6b35', marginLeft: '8px' }}>
                      ({Object.keys(whatIfResults).length} what-if set)
                    </span>
                  )}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {Object.keys(whatIfResults).length > 0 && (
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => { setWhatIfResults({}); window.storage.set('euroleague-whatif', '{}'); }}
                  >
                    Clear What-Ifs
                  </button>
                )}
                <select
                  value={selectedRound}
                  onChange={e => setSelectedRound(parseInt(e.target.value))}
                  style={{ minWidth: '150px' }}
                >
                  <option value={0}>All Rounds</option>
                  {[...new Set(schedule.map(g => g.round))].sort((a, b) => a - b).map(round => (
                    <option key={round} value={round}>Round {round}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(selectedRound === 0 ? schedule : schedule.filter(g => g.round === selectedRound))
                .map((game, idx) => {
                  const actualIdx = schedule.findIndex(g => g === game);
                  const homeTeam = teams.find(t => t.code === game.home);
                  const awayTeam = teams.find(t => t.code === game.away);
                  const gameDate = new Date(game.date);
                  const pred = schedulePreview[actualIdx];
                  const whatIf = whatIfResults[actualIdx];
                  const isHomeFavorite = game.home === favoriteTeam;
                  const isAwayFavorite = game.away === favoriteTeam;

                  return (
                    <div key={idx} className="glass" style={{
                      padding: '16px 24px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderLeft: (isHomeFavorite || isAwayFavorite) ? '3px solid #ff6b35' : 'none'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
                        <div style={{
                          fontSize: '12px',
                          color: '#ff6b35',
                          fontFamily: "'Space Mono', monospace",
                          minWidth: '60px',
                          fontWeight: 600
                        }}>
                          R{game.round}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#666',
                          fontFamily: "'Space Mono', monospace",
                          minWidth: '100px'
                        }}>
                          {gameDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                          <div style={{ flex: 1, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <span style={{ fontWeight: isHomeFavorite ? 700 : 500 }}>
                              {homeTeam?.name || game.home}
                              {isHomeFavorite && ' ⭐'}
                            </span>
                            <span style={{ color: '#666', fontSize: '12px' }}>(H)</span>
                            {pred && (
                              <span className="win-prob" style={{
                                background: pred.homeWinProb > 50 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                color: pred.homeWinProb > 50 ? '#22c55e' : '#888'
                              }}>
                                {pred.homeWinProb.toFixed(0)}%
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              className={`whatif-btn home ${whatIf === 'home' ? 'active' : ''}`}
                              onClick={() => setWhatIfResult(actualIdx, whatIf === 'home' ? null : 'home')}
                            >
                              W
                            </button>
                            <div style={{
                              padding: '6px 12px',
                              background: whatIf ? 'rgba(255, 107, 53, 0.3)' : 'rgba(255, 107, 53, 0.15)',
                              borderRadius: '8px',
                              fontFamily: "'Space Mono', monospace",
                              fontWeight: 600,
                              fontSize: '14px',
                              color: '#ff6b35'
                            }}>
                              vs
                            </div>
                            <button
                              className={`whatif-btn away ${whatIf === 'away' ? 'active' : ''}`}
                              onClick={() => setWhatIfResult(actualIdx, whatIf === 'away' ? null : 'away')}
                            >
                              W
                            </button>
                          </div>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {pred && (
                              <span className="win-prob" style={{
                                background: pred.awayWinProb > 50 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                color: pred.awayWinProb > 50 ? '#22c55e' : '#888'
                              }}>
                                {pred.awayWinProb.toFixed(0)}%
                              </span>
                            )}
                            <span style={{ fontWeight: isAwayFavorite ? 700 : 500 }}>
                              {awayTeam?.name || game.away}
                              {isAwayFavorite && ' ⭐'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Season Predictions</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
                  Based on {SIMULATIONS.toLocaleString()} Monte Carlo simulations
                  {Object.keys(whatIfResults).length > 0 && (
                    <span style={{ color: '#ff6b35' }}> · {Object.keys(whatIfResults).length} what-if scenarios applied</span>
                  )}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {predictions && (
                  <>
                    <button className="btn btn-secondary btn-small" onClick={exportToCSV}>
                      Export CSV
                    </button>
                    <button className="btn btn-secondary btn-small" onClick={exportToJSON}>
                      Export JSON
                    </button>
                  </>
                )}
                <button
                  className="btn btn-primary"
                  onClick={runSimulation}
                  disabled={isSimulating}
                  style={{ opacity: isSimulating ? 0.7 : 1 }}
                >
                  {isSimulating ? 'Simulating...' : 'Run Simulation'}
                </button>
              </div>
            </div>

            {!predictions && !isSimulating && (
              <div className="glass" style={{
                padding: '80px 40px',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <h3 style={{ margin: '0 0 8px', fontWeight: 600 }}>Ready to Predict</h3>
                <p style={{ margin: 0, color: '#666', maxWidth: '400px', marginInline: 'auto' }}>
                  Click "Run Simulation" to generate predictions. Use the Schedule tab to set what-if scenarios first.
                </p>
              </div>
            )}

            {isSimulating && (
              <div className="glass" style={{ padding: '40px', borderRadius: '16px' }}>
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="loading" style={{ height: '48px', borderRadius: '8px', marginBottom: '8px' }}></div>
                ))}
              </div>
            )}

            {predictions && !isSimulating && (
              <div>
                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                  <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Title Favorite</div>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{predictions[0]?.name}</div>
                    <div style={{ fontSize: '14px', color: '#22c55e', fontFamily: "'Space Mono', monospace" }}>
                      {predictions[0]?.champion.toFixed(1)}% to win title
                    </div>
                  </div>
                  <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Final Four Lock</div>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>
                      {predictions.filter(t => t.finalFour > 50).length} teams
                    </div>
                    <div style={{ fontSize: '14px', color: '#3b82f6', fontFamily: "'Space Mono', monospace" }}>
                      &gt;50% Final Four odds
                    </div>
                  </div>
                  <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Play-In Battle</div>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>
                      {predictions.filter(t => t.playInProb > 20 && t.playInProb < 60).length} teams
                    </div>
                    <div style={{ fontSize: '14px', color: '#eab308', fontFamily: "'Space Mono', monospace" }}>
                      fighting for 7-10
                    </div>
                  </div>
                  <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Elimination Risk</div>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>
                      {predictions.filter(t => t.eliminatedProb > 50).length} teams
                    </div>
                    <div style={{ fontSize: '14px', color: '#ef4444', fontFamily: "'Space Mono', monospace" }}>
                      likely out
                    </div>
                  </div>
                </div>

                {/* Position Chart Modal */}
                {showChart && (
                  <div
                    style={{
                      position: 'fixed',
                      inset: 0,
                      background: 'rgba(0, 0, 0, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000
                    }}
                    onClick={() => setShowChart(null)}
                  >
                    <div
                      className="glass"
                      style={{
                        padding: '24px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                        minWidth: '500px'
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <PositionChart positions={showChart.positions} teamName={showChart.name} />
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowChart(null)}
                        style={{ marginTop: '16px', width: '100%' }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {/* Predictions Table */}
                <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#888', fontWeight: 500 }}>#</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#888', fontWeight: 500 }}>TEAM</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 500 }}>PROJ W-L</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 500 }}>AVG</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#888', fontWeight: 500, width: '20%' }}>REGULAR SEASON</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 500 }}>PLAYOFFS</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 500 }}>F4</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 500 }}>CHAMP</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 500 }}>CHART</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.map((team, idx) => {
                        const isFavorite = team.code === favoriteTeam;
                        return (
                          <tr key={team.code} className={isFavorite ? 'favorite-row' : ''} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <td style={{ padding: '14px 16px', fontFamily: "'Space Mono', monospace", color: '#666' }}>
                              {idx + 1}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '8px',
                                  background: isFavorite ? 'linear-gradient(135deg, #ff6b35, #f7931e)' : 'linear-gradient(135deg, #2a2a4e, #1a1a2e)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  fontFamily: "'Space Mono', monospace"
                                }}>{team.code}</span>
                                <div>
                                  <div style={{ fontWeight: isFavorite ? 700 : 500 }}>
                                    {team.name} {isFavorite && '⭐'}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#666', fontFamily: "'Space Mono', monospace" }}>
                                    Rating: {team.rating.toFixed(0)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                              <span style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: '15px',
                                fontWeight: 600,
                                color: '#22c55e'
                              }}>{team.projectedWins}</span>
                              <span style={{ color: '#666', margin: '0 2px' }}>-</span>
                              <span style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: '15px',
                                fontWeight: 600,
                                color: '#ef4444'
                              }}>{team.projectedLosses}</span>
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                              <span style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: '18px',
                                fontWeight: 700
                              }}>{team.avgPosition.toFixed(1)}</span>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div className="probability-bar">
                                {team.playoffProb > 3 && (
                                  <div
                                    className="prob-segment"
                                    style={{
                                      width: `${team.playoffProb}%`,
                                      background: 'linear-gradient(135deg, #22c55e, #16a34a)'
                                    }}
                                  >
                                    {team.playoffProb >= 10 && `${team.playoffProb.toFixed(0)}%`}
                                  </div>
                                )}
                                {team.playInProb > 3 && (
                                  <div
                                    className="prob-segment"
                                    style={{
                                      width: `${team.playInProb}%`,
                                      background: 'linear-gradient(135deg, #eab308, #ca8a04)'
                                    }}
                                  >
                                    {team.playInProb >= 10 && `${team.playInProb.toFixed(0)}%`}
                                  </div>
                                )}
                                {team.eliminatedProb > 3 && (
                                  <div
                                    className="prob-segment"
                                    style={{
                                      width: `${team.eliminatedProb}%`,
                                      background: 'linear-gradient(135deg, #ef4444, #dc2626)'
                                    }}
                                  >
                                    {team.eliminatedProb >= 10 && `${team.eliminatedProb.toFixed(0)}%`}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: team.makePlayoffs > 50 ? '#22c55e' : '#888' }}>
                              {team.makePlayoffs.toFixed(1)}%
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: team.finalFour > 20 ? '#3b82f6' : '#888' }}>
                              {team.finalFour.toFixed(1)}%
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: team.champion > 5 ? '#f59e0b' : '#888', fontWeight: team.champion > 10 ? 700 : 400 }}>
                              {team.champion.toFixed(1)}%
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                              <button
                                className="btn btn-secondary btn-small"
                                onClick={() => setShowChart(team)}
                                style={{ padding: '6px 10px' }}
                              >
                                📊
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', gap: '24px', marginTop: '16px', fontSize: '13px', color: '#666' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#22c55e' }}></span>
                    Top 6 (Direct Playoffs)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#eab308' }}></span>
                    Play-In (7-10)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444' }}></span>
                    Eliminated (11-20)
                  </span>
                </div>

                {/* Game Predictions Section */}
                {gamePredictions && gamePredictions.length > 0 && (
                  <div className="glass" style={{ borderRadius: '16px', padding: '24px', marginTop: '32px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>
                      Simulated Game Results
                      <span style={{ fontSize: '13px', color: '#666', fontWeight: 400, marginLeft: '12px' }}>
                        {(() => {
                          const filtered = gamePredictions.filter(g => {
                            if (gameFilterTeam && g.home !== gameFilterTeam && g.away !== gameFilterTeam) return false;
                            if (gameFilterRound && g.round !== parseInt(gameFilterRound)) return false;
                            return true;
                          });
                          return `${filtered.length} of ${gamePredictions.length} games`;
                        })()}
                      </span>
                    </h3>

                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      <select
                        value={gameFilterTeam}
                        onChange={(e) => setGameFilterTeam(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#fff',
                          fontSize: '13px',
                          cursor: 'pointer',
                          minWidth: '160px'
                        }}
                      >
                        <option value="">All Teams</option>
                        {teams.sort((a, b) => a.name.localeCompare(b.name)).map(team => (
                          <option key={team.code} value={team.code}>{team.name}</option>
                        ))}
                      </select>

                      <select
                        value={gameFilterRound}
                        onChange={(e) => setGameFilterRound(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#fff',
                          fontSize: '13px',
                          cursor: 'pointer',
                          minWidth: '120px'
                        }}
                      >
                        <option value="">All Rounds</option>
                        {[...new Set(gamePredictions.map(g => g.round))].sort((a, b) => a - b).map(round => (
                          <option key={round} value={round}>Round {round}</option>
                        ))}
                      </select>

                      {(gameFilterTeam || gameFilterRound) && (
                        <button
                          onClick={() => { setGameFilterTeam(''); setGameFilterRound(''); }}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#888',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'rgba(255, 255, 255, 0.03)', position: 'sticky', top: 0 }}>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', color: '#888', fontWeight: 500 }}>ROUND</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', color: '#888', fontWeight: 500 }}>DATE</th>
                            <th style={{ padding: '12px', textAlign: 'right', fontSize: '11px', color: '#888', fontWeight: 500 }}>HOME</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontSize: '11px', color: '#888', fontWeight: 500 }}>WIN %</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', color: '#888', fontWeight: 500 }}>AWAY</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontSize: '11px', color: '#888', fontWeight: 500 }}>PREDICTED</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gamePredictions
                            .filter(g => {
                              if (gameFilterTeam && g.home !== gameFilterTeam && g.away !== gameFilterTeam) return false;
                              if (gameFilterRound && g.round !== parseInt(gameFilterRound)) return false;
                              return true;
                            })
                            .map((game, idx) => {
                            const homeTeam = teams.find(t => t.code === game.home);
                            const awayTeam = teams.find(t => t.code === game.away);
                            const isHomeWinner = game.predictedWinner === game.home;
                            return (
                              <tr key={idx} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#666', fontFamily: "'Space Mono', monospace" }}>
                                  R{game.round}
                                </td>
                                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#888' }}>
                                  {game.date}
                                </td>
                                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                  <span style={{
                                    fontWeight: isHomeWinner ? 700 : 400,
                                    color: isHomeWinner ? '#22c55e' : '#888'
                                  }}>
                                    {homeTeam?.name || game.home}
                                    {game.home === favoriteTeam && ' ⭐'}
                                  </span>
                                </td>
                                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                                    <span style={{
                                      fontFamily: "'Space Mono', monospace",
                                      fontSize: '12px',
                                      color: game.homeWinPct >= 50 ? '#22c55e' : '#888'
                                    }}>{game.homeWinPct.toFixed(0)}%</span>
                                    <span style={{ color: '#444' }}>-</span>
                                    <span style={{
                                      fontFamily: "'Space Mono', monospace",
                                      fontSize: '12px',
                                      color: game.awayWinPct > 50 ? '#22c55e' : '#888'
                                    }}>{game.awayWinPct.toFixed(0)}%</span>
                                  </div>
                                </td>
                                <td style={{ padding: '10px 12px' }}>
                                  <span style={{
                                    fontWeight: !isHomeWinner ? 700 : 400,
                                    color: !isHomeWinner ? '#22c55e' : '#888'
                                  }}>
                                    {awayTeam?.name || game.away}
                                    {game.away === favoriteTeam && ' ⭐'}
                                  </span>
                                </td>
                                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                  <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    background: game.confidence > 65 ? 'rgba(34, 197, 94, 0.2)' : game.confidence > 55 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                    color: game.confidence > 65 ? '#22c55e' : game.confidence > 55 ? '#eab308' : '#888'
                                  }}>
                                    {isHomeWinner ? (homeTeam?.code || game.home) : (awayTeam?.code || game.away)} ({game.confidence.toFixed(0)}%)
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ marginTop: '16px', fontSize: '12px', color: '#666', display: 'flex', gap: '16px' }}>
                      <span><span style={{ color: '#22c55e' }}>●</span> High confidence (&gt;65%)</span>
                      <span><span style={{ color: '#eab308' }}>●</span> Medium confidence (55-65%)</span>
                      <span><span style={{ color: '#888' }}>●</span> Low confidence (&lt;55%)</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Playoffs Tab */}
        {activeTab === 'playoffs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Playoff Bracket & Predictions</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
                  Based on {SIMULATIONS.toLocaleString()} simulated seasons · Best-of-5 playoffs · Single-elimination Final Four
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#3b82f6' }}>
                  🇬🇷 Athens 2026: PAN & OLY get +10% boost in Final Four (home crowd advantage)
                </p>
              </div>
              {!predictions ? (
                <button
                  className="btn btn-primary"
                  onClick={runSimulation}
                  disabled={isSimulating}
                >
                  {isSimulating ? 'Simulating...' : 'Run Simulation'}
                </button>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={runSimulation}
                  disabled={isSimulating}
                >
                  {isSimulating ? 'Simulating...' : 'Re-run'}
                </button>
              )}
            </div>

            {!predictions ? (
              <div className="glass" style={{
                padding: '80px 40px',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
                <h3 style={{ margin: '0 0 8px', fontWeight: 600 }}>Run Simulation First</h3>
                <p style={{ margin: 0, color: '#666' }}>
                  Run the Monte Carlo simulation to see playoff predictions.
                </p>
              </div>
            ) : (
              <div>
                {/* Projected Seeding */}
                <div className="glass" style={{ padding: '20px 24px', borderRadius: '16px', marginBottom: '24px' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#888' }}>PROJECTED PLAYOFF SEEDING</h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {predictions.slice(0, 10).map((team, idx) => {
                      const isFavorite = team.code === favoriteTeam;
                      const isPlayoff = idx < 6;
                      const isPlayIn = idx >= 6;
                      return (
                        <div key={team.code} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          background: isFavorite ? 'rgba(255, 107, 53, 0.2)' : isPlayoff ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                          borderRadius: '8px',
                          border: `1px solid ${isFavorite ? '#ff6b35' : isPlayoff ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`
                        }}>
                          <span style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: isPlayoff ? '#22c55e' : '#eab308',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#000'
                          }}>{idx + 1}</span>
                          <span style={{ fontWeight: isFavorite ? 700 : 500, fontSize: '14px' }}>{team.name}</span>
                          {isFavorite && <span>⭐</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', color: '#666' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></span>
                      Direct to Playoffs (1-6)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }}></span>
                      Play-In Tournament (7-10)
                    </span>
                  </div>
                </div>

                {/* Visual Bracket */}
                <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px', overflow: 'auto' }}>
                  <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 600, color: '#888' }}>PLAYOFF BRACKET</h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', minWidth: '900px', gap: '16px' }}>
                    {/* Quarterfinals */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#666', textAlign: 'center', fontWeight: 600, marginBottom: '8px' }}>QUARTERFINALS</div>
                      <div style={{ fontSize: '10px', color: '#888', textAlign: 'center', marginBottom: '4px' }}>Best of 5 (2-2-1)</div>

                      {/* QF1: 1 vs 8 */}
                      {(() => {
                        const seed1 = predictions[0];
                        const seed8 = predictions[7];
                        return (
                          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: '#22c55e', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>1</span>
                                <span style={{ fontWeight: seed1?.code === favoriteTeam ? 700 : 500, fontSize: '13px' }}>{seed1?.name}</span>
                                {seed1?.code === favoriteTeam && <span style={{ fontSize: '12px' }}>⭐</span>}
                              </div>
                              <span style={{ color: '#22c55e', fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>{(100 - (seed8?.makePlayoffs || 0) * 0.3).toFixed(0)}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: '#eab308', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>8</span>
                                <span style={{ fontWeight: seed8?.code === favoriteTeam ? 700 : 500, fontSize: '13px', color: '#888' }}>{seed8?.name || 'Play-In Winner'}</span>
                                {seed8?.code === favoriteTeam && <span style={{ fontSize: '12px' }}>⭐</span>}
                              </div>
                              <span style={{ color: '#888', fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>{((seed8?.makePlayoffs || 0) * 0.3).toFixed(0)}%</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* QF2: 4 vs 5 */}
                      {(() => {
                        const seed4 = predictions[3];
                        const seed5 = predictions[4];
                        const total = (seed4?.finalFour || 0) + (seed5?.finalFour || 0);
                        return (
                          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: '#22c55e', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>4</span>
                                <span style={{ fontWeight: seed4?.code === favoriteTeam ? 700 : 500, fontSize: '13px' }}>{seed4?.name}</span>
                                {seed4?.code === favoriteTeam && <span style={{ fontSize: '12px' }}>⭐</span>}
                              </div>
                              <span style={{ color: '#22c55e', fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>{total > 0 ? ((seed4?.finalFour / total) * 100).toFixed(0) : 50}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: '#22c55e', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>5</span>
                                <span style={{ fontWeight: seed5?.code === favoriteTeam ? 700 : 500, fontSize: '13px', color: '#888' }}>{seed5?.name}</span>
                                {seed5?.code === favoriteTeam && <span style={{ fontSize: '12px' }}>⭐</span>}
                              </div>
                              <span style={{ color: '#888', fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>{total > 0 ? ((seed5?.finalFour / total) * 100).toFixed(0) : 50}%</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* QF3: 2 vs 7 */}
                      {(() => {
                        const seed2 = predictions[1];
                        const seed7 = predictions[6];
                        return (
                          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: '#22c55e', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>2</span>
                                <span style={{ fontWeight: seed2?.code === favoriteTeam ? 700 : 500, fontSize: '13px' }}>{seed2?.name}</span>
                                {seed2?.code === favoriteTeam && <span style={{ fontSize: '12px' }}>⭐</span>}
                              </div>
                              <span style={{ color: '#22c55e', fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>{(100 - (seed7?.makePlayoffs || 0) * 0.4).toFixed(0)}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: '#eab308', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>7</span>
                                <span style={{ fontWeight: seed7?.code === favoriteTeam ? 700 : 500, fontSize: '13px', color: '#888' }}>{seed7?.name || 'Play-In Winner'}</span>
                                {seed7?.code === favoriteTeam && <span style={{ fontSize: '12px' }}>⭐</span>}
                              </div>
                              <span style={{ color: '#888', fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>{((seed7?.makePlayoffs || 0) * 0.4).toFixed(0)}%</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* QF4: 3 vs 6 */}
                      {(() => {
                        const seed3 = predictions[2];
                        const seed6 = predictions[5];
                        const total = (seed3?.finalFour || 0) + (seed6?.finalFour || 0);
                        return (
                          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: '#22c55e', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>3</span>
                                <span style={{ fontWeight: seed3?.code === favoriteTeam ? 700 : 500, fontSize: '13px' }}>{seed3?.name}</span>
                                {seed3?.code === favoriteTeam && <span style={{ fontSize: '12px' }}>⭐</span>}
                              </div>
                              <span style={{ color: '#22c55e', fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>{total > 0 ? ((seed3?.finalFour / total) * 100).toFixed(0) : 50}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: '#22c55e', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>6</span>
                                <span style={{ fontWeight: seed6?.code === favoriteTeam ? 700 : 500, fontSize: '13px', color: '#888' }}>{seed6?.name}</span>
                                {seed6?.code === favoriteTeam && <span style={{ fontSize: '12px' }}>⭐</span>}
                              </div>
                              <span style={{ color: '#888', fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>{total > 0 ? ((seed6?.finalFour / total) * 100).toFixed(0) : 50}%</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Connector Lines */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '80px', padding: '40px 0' }}>
                      <div style={{ width: '30px', height: '2px', background: 'rgba(255,255,255,0.2)' }}></div>
                      <div style={{ width: '30px', height: '2px', background: 'rgba(255,255,255,0.2)' }}></div>
                    </div>

                    {/* Final Four */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#666', textAlign: 'center', fontWeight: 600, marginBottom: '8px' }}>FINAL FOUR</div>
                      <div style={{ fontSize: '10px', color: '#888', textAlign: 'center', marginBottom: '4px' }}>Athens · May 22-24</div>

                      {/* SF1 - Teams from QF1 (1v8) and QF2 (4v5) */}
                      {(() => {
                        // SF1 participants come from seeds 1, 8, 4, 5
                        const sf1Seeds = [0, 7, 3, 4]; // indices for seeds 1, 8, 4, 5
                        const sf1Teams = sf1Seeds
                          .map(idx => predictions[idx])
                          .filter(t => t && t.finalFour > 0)
                          .sort((a, b) => b.finalFour - a.finalFour)
                          .slice(0, 4);
                        return (
                          <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                            <div style={{ fontSize: '10px', color: '#3b82f6', marginBottom: '8px', fontWeight: 600 }}>SEMIFINAL 1</div>
                            <div style={{ color: '#aaa', fontSize: '13px', marginBottom: '4px' }}>Winner QF1 vs Winner QF2</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {sf1Teams.map(team => (
                                <span key={team.code} style={{
                                  padding: '4px 8px',
                                  background: team.code === favoriteTeam ? 'rgba(255, 107, 53, 0.3)' : 'rgba(255,255,255,0.05)',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: team.code === favoriteTeam ? 700 : 500
                                }}>
                                  {team.name} {team.finalFour.toFixed(0)}%
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                      {/* SF2 - Teams from QF3 (2v7) and QF4 (3v6) */}
                      {(() => {
                        // SF2 participants come from seeds 2, 7, 3, 6
                        const sf2Seeds = [1, 6, 2, 5]; // indices for seeds 2, 7, 3, 6
                        const sf2Teams = sf2Seeds
                          .map(idx => predictions[idx])
                          .filter(t => t && t.finalFour > 0)
                          .sort((a, b) => b.finalFour - a.finalFour)
                          .slice(0, 4);
                        return (
                          <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                            <div style={{ fontSize: '10px', color: '#3b82f6', marginBottom: '8px', fontWeight: 600 }}>SEMIFINAL 2</div>
                            <div style={{ color: '#aaa', fontSize: '13px', marginBottom: '4px' }}>Winner QF3 vs Winner QF4</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {sf2Teams.map(team => (
                                <span key={team.code} style={{
                                  padding: '4px 8px',
                                  background: team.code === favoriteTeam ? 'rgba(255, 107, 53, 0.3)' : 'rgba(255,255,255,0.05)',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: team.code === favoriteTeam ? 700 : 500
                                }}>
                                  {team.name} {team.finalFour.toFixed(0)}%
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Connector Lines */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ width: '30px', height: '2px', background: 'rgba(255,255,255,0.2)' }}></div>
                    </div>

                    {/* Championship */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#666', textAlign: 'center', fontWeight: 600, marginBottom: '8px' }}>CHAMPION</div>
                      <div style={{ fontSize: '10px', color: '#888', textAlign: 'center', marginBottom: '12px' }}>May 24, 2026</div>

                      <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))', borderRadius: '12px', padding: '16px', border: '1px solid rgba(245, 158, 11, 0.4)', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
                          {predictions[0]?.name}
                          {predictions[0]?.code === favoriteTeam && ' ⭐'}
                        </div>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: 700,
                          color: '#f59e0b',
                          fontFamily: "'Space Mono', monospace"
                        }}>
                          {predictions[0]?.champion.toFixed(1)}%
                        </div>
                        <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Championship Odds</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Four Probability Table */}
                <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#888' }}>FINAL FOUR PROBABILITIES</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {predictions
                      .filter(t => t.finalFour > 5)
                      .sort((a, b) => b.finalFour - a.finalFour)
                      .slice(0, 8)
                      .map(team => {
                        const isFavorite = team.code === favoriteTeam;
                        return (
                          <div key={team.code} style={{
                            background: isFavorite ? 'rgba(255, 107, 53, 0.15)' : 'rgba(255,255,255,0.02)',
                            borderRadius: '8px',
                            padding: '12px',
                            textAlign: 'center',
                            border: isFavorite ? '1px solid rgba(255, 107, 53, 0.4)' : '1px solid rgba(255,255,255,0.05)'
                          }}>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: '#3b82f6', fontFamily: "'Space Mono', monospace" }}>
                              {team.finalFour.toFixed(1)}%
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: isFavorite ? 700 : 500, marginTop: '4px' }}>
                              {team.name} {isFavorite && '⭐'}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Championship Odds Chart */}
                <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#888' }}>CHAMPIONSHIP ODDS</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {predictions
                      .filter(t => t.champion > 1)
                      .sort((a, b) => b.champion - a.champion)
                      .map((team, idx) => {
                        const isFavorite = team.code === favoriteTeam;
                        const maxChamp = predictions[0]?.champion || 1;
                        return (
                          <div key={team.code} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '24px', textAlign: 'center', fontFamily: "'Space Mono', monospace", color: '#666', fontSize: '12px' }}>
                              {idx + 1}
                            </div>
                            <div style={{ width: '120px', fontWeight: isFavorite ? 700 : 500, fontSize: '13px' }}>
                              {team.name} {isFavorite && '⭐'}
                            </div>
                            <div style={{ flex: 1, height: '28px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${(team.champion / maxChamp) * 100}%`,
                                height: '100%',
                                background: isFavorite
                                  ? 'linear-gradient(135deg, #ff6b35, #f7931e)'
                                  : 'linear-gradient(135deg, #f59e0b, #d97706)',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: '12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                minWidth: team.champion > 3 ? '60px' : '0'
                              }}>
                                {team.champion >= 3 && `${team.champion.toFixed(1)}%`}
                              </div>
                            </div>
                            <div style={{ width: '50px', textAlign: 'right', fontFamily: "'Space Mono', monospace", color: '#f59e0b', fontSize: '13px', fontWeight: 600 }}>
                              {team.champion.toFixed(1)}%
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Favorite Team Tab */}
        {activeTab === 'favorite' && favoriteTeam && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
                {teams.find(t => t.code === favoriteTeam)?.name} ⭐
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
                {favoriteGames.length} remaining games
              </p>
            </div>

            {/* Team Stats */}
            {predictions && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {(() => {
                  const team = predictions.find(t => t.code === favoriteTeam);
                  if (!team) return null;
                  return (
                    <>
                      <div className="glass" style={{ padding: '20px', borderRadius: '12px', borderLeft: '3px solid #ff6b35' }}>
                        <div style={{ fontSize: '12px', color: '#888' }}>Projected Finish</div>
                        <div style={{ fontSize: '28px', fontWeight: 700 }}>{team.avgPosition.toFixed(1)}</div>
                      </div>
                      <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '12px', color: '#888' }}>Playoff Odds</div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: '#22c55e' }}>{team.makePlayoffs.toFixed(1)}%</div>
                      </div>
                      <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '12px', color: '#888' }}>Final Four</div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: '#3b82f6' }}>{team.finalFour.toFixed(1)}%</div>
                      </div>
                      <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '12px', color: '#888' }}>Championship</div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>{team.champion.toFixed(1)}%</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Remaining Schedule */}
            <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Remaining Schedule</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {favoriteGames.map((game, idx) => {
                  const actualIdx = schedule.findIndex(g => g === game);
                  const isHome = game.home === favoriteTeam;
                  const opponent = teams.find(t => t.code === (isHome ? game.away : game.home));
                  const pred = schedulePreview[actualIdx];
                  const winProb = isHome ? pred?.homeWinProb : pred?.awayWinProb;
                  const whatIf = whatIfResults[actualIdx];
                  const didWin = whatIf === (isHome ? 'home' : 'away');
                  const didLose = whatIf && !didWin;

                  return (
                    <div key={idx} style={{
                      padding: '12px 16px',
                      background: didWin ? 'rgba(34, 197, 94, 0.1)' : didLose ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '12px',
                          color: '#ff6b35',
                          fontFamily: "'Space Mono', monospace",
                          fontWeight: 600
                        }}>R{game.round}</span>
                        <span style={{
                          padding: '2px 8px',
                          background: isHome ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                          color: isHome ? '#22c55e' : '#3b82f6',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600
                        }}>
                          {isHome ? 'HOME' : 'AWAY'}
                        </span>
                        <span style={{ fontWeight: 500 }}>vs {opponent?.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {whatIf ? (
                          <span style={{
                            padding: '4px 12px',
                            background: didWin ? '#22c55e' : '#ef4444',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 600
                          }}>
                            {didWin ? 'WIN' : 'LOSS'}
                          </span>
                        ) : (
                          <span style={{
                            fontFamily: "'Space Mono', monospace",
                            color: winProb > 50 ? '#22c55e' : '#ef4444',
                            fontWeight: 600
                          }}>
                            {winProb?.toFixed(0)}% win
                          </span>
                        )}
                        <span style={{ fontSize: '12px', color: '#666' }}>
                          {new Date(game.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Match Results Added</h2>
              <button className="btn btn-primary" onClick={() => setShowAddMatch(true)}>
                + Add Match Result
              </button>
            </div>

            {matches.length === 0 ? (
              <div className="glass" style={{
                padding: '80px 40px',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <h3 style={{ margin: '0 0 8px', fontWeight: 600 }}>No Matches Added Yet</h3>
                <p style={{ margin: 0, color: '#666', maxWidth: '400px', marginInline: 'auto' }}>
                  Add new match results as they happen to update standings and predictions.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[...matches].reverse().map(match => {
                  const homeTeam = teams.find(t => t.code === match.home);
                  const awayTeam = teams.find(t => t.code === match.away);
                  const homeWon = match.homeScore > match.awayScore;

                  return (
                    <div key={match.id} className="glass" style={{
                      padding: '16px 24px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
                        <div style={{ fontSize: '12px', color: '#666', fontFamily: "'Space Mono', monospace", minWidth: '100px' }}>
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                          <div style={{
                            flex: 1,
                            textAlign: 'right',
                            fontWeight: homeWon ? 700 : 400,
                            color: homeWon ? '#fff' : '#888'
                          }}>
                            {homeTeam?.name} <span style={{ color: '#666', fontSize: '12px' }}>(H)</span>
                          </div>
                          <div style={{
                            padding: '8px 16px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '8px',
                            fontFamily: "'Space Mono', monospace",
                            fontWeight: 700,
                            fontSize: '18px',
                            minWidth: '100px',
                            textAlign: 'center'
                          }}>
                            <span style={{ color: homeWon ? '#22c55e' : '#888' }}>{match.homeScore}</span>
                            <span style={{ color: '#444', margin: '0 8px' }}>-</span>
                            <span style={{ color: !homeWon ? '#22c55e' : '#888' }}>{match.awayScore}</span>
                          </div>
                          <div style={{
                            flex: 1,
                            fontWeight: !homeWon ? 700 : 400,
                            color: !homeWon ? '#fff' : '#888'
                          }}>
                            {awayTeam?.name}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteMatch(match.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#666',
                          cursor: 'pointer',
                          padding: '8px',
                          fontSize: '16px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Match Modal */}
      {showAddMatch && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowAddMatch(false)}>
          <div
            className="glass"
            style={{
              padding: '32px',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '480px',
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 600 }}>Add Match Result</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px' }}>HOME TEAM</label>
                <select
                  value={newMatch.home}
                  onChange={e => setNewMatch({ ...newMatch, home: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="">Select team...</option>
                  {teams.map(t => (
                    <option key={t.code} value={t.code}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px' }}>AWAY TEAM</label>
                <select
                  value={newMatch.away}
                  onChange={e => setNewMatch({ ...newMatch, away: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="">Select team...</option>
                  {teams.filter(t => t.code !== newMatch.home).map(t => (
                    <option key={t.code} value={t.code}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px' }}>HOME SCORE</label>
                  <input
                    type="number"
                    value={newMatch.homeScore}
                    onChange={e => setNewMatch({ ...newMatch, homeScore: e.target.value })}
                    placeholder="0"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px' }}>AWAY SCORE</label>
                  <input
                    type="number"
                    value={newMatch.awayScore}
                    onChange={e => setNewMatch({ ...newMatch, awayScore: e.target.value })}
                    placeholder="0"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button className="btn btn-secondary" onClick={() => setShowAddMatch(false)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={addMatch} style={{ flex: 1 }}>
                Add Match
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflow: 'auto',
          padding: '40px'
        }} onClick={() => setShowHelp(false)}>
          <div
            className="glass"
            style={{
              padding: '32px',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>How It Works</h2>
              <button
                onClick={() => setShowHelp(false)}
                style={{ background: 'none', border: 'none', color: '#888', fontSize: '24px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Monte Carlo Explanation */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ color: '#ff6b35', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🎲</span> Monte Carlo Simulation
              </h3>
              <p style={{ color: '#aaa', lineHeight: 1.7, margin: 0 }}>
                This app runs <strong style={{ color: '#fff' }}>5,000 simulated seasons</strong> to predict outcomes.
                Each simulation plays out all remaining games based on team ratings and historical data.
                By running thousands of scenarios, we can estimate the probability of each team finishing in any position,
                making the playoffs, reaching the Final Four, or winning the championship.
              </p>
            </div>

            {/* Rating System */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ color: '#ff6b35', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>📊</span> Team Rating System
              </h3>
              <p style={{ color: '#aaa', lineHeight: 1.7, margin: '0 0 12px' }}>
                Each team has an ELO-style rating calculated as:
              </p>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontFamily: "'Space Mono', monospace",
                color: '#ff6b35',
                marginBottom: '12px'
              }}>
                Rating = 1500 + (WinPct - 0.5) × 400 + AvgMargin × 10
              </div>
              <p style={{ color: '#aaa', lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: '#fff' }}>1500</strong> is the baseline. Teams above 1500 are above average.
                <strong style={{ color: '#fff' }}> Win percentage</strong> and <strong style={{ color: '#fff' }}>point differential</strong> both factor in.
                Higher ratings mean higher win probability in simulated games.
              </p>
            </div>

            {/* Win Probability */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ color: '#ff6b35', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🎯</span> Win Probability Calculation
              </h3>
              <p style={{ color: '#aaa', lineHeight: 1.7, margin: 0 }}>
                Win probability uses the ELO expected score formula with these factors:<br/>
                • <strong style={{ color: '#fff' }}>Team ratings</strong> - Higher rated team is favored<br/>
                • <strong style={{ color: '#fff' }}>Home court advantage</strong> - +50 rating points for home team<br/>
                • <strong style={{ color: '#fff' }}>Head-to-head history</strong> - Up to ±25 points based on H2H record
              </p>
            </div>

            {/* Icons Legend */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ color: '#ff6b35', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🔣</span> Icons & Colors Legend
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#aaa' }}>
                  <span style={{ fontSize: '18px' }}>⭐</span>
                  <span>Your favorite team (selected in header)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#aaa' }}>
                  <span style={{ fontSize: '18px' }}>📊</span>
                  <span>View position distribution chart</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#aaa' }}>
                  <span style={{ width: '18px', height: '18px', background: '#22c55e', borderRadius: '4px' }}></span>
                  <span>Playoffs (Top 6) / Win / Positive</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#aaa' }}>
                  <span style={{ width: '18px', height: '18px', background: '#eab308', borderRadius: '4px' }}></span>
                  <span>Play-In Tournament (7-10)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#aaa' }}>
                  <span style={{ width: '18px', height: '18px', background: '#ef4444', borderRadius: '4px' }}></span>
                  <span>Eliminated (11-20) / Loss / Negative</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#aaa' }}>
                  <span style={{ width: '18px', height: '18px', background: '#ff6b35', borderRadius: '4px' }}></span>
                  <span>Your team highlight / Accent color</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#aaa' }}>
                  <span style={{ width: '18px', height: '18px', background: '#3b82f6', borderRadius: '4px' }}></span>
                  <span>Final Four probability</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#aaa' }}>
                  <span style={{ width: '18px', height: '18px', background: '#f59e0b', borderRadius: '4px' }}></span>
                  <span>Championship probability</span>
                </div>
              </div>
            </div>

            {/* What-If Scenarios */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ color: '#ff6b35', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🔮</span> What-If Scenarios
              </h3>
              <p style={{ color: '#aaa', lineHeight: 1.7, margin: 0 }}>
                In the Schedule tab, click the <strong style={{ color: '#22c55e' }}>W</strong> buttons next to each team to set
                a hypothetical winner. This locks that game's outcome in all simulations.
                Use this to explore questions like "What if my team wins their next 5 games?"
              </p>
            </div>

            {/* EuroLeague Format */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ color: '#ff6b35', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🏆</span> EuroLeague 2025-26 Format
              </h3>
              <div style={{ color: '#aaa', lineHeight: 1.7 }}>
                <p style={{ margin: '0 0 8px' }}><strong style={{ color: '#fff' }}>Regular Season:</strong> 20 teams, 38 games each (home & away vs all opponents)</p>
                <p style={{ margin: '0 0 8px' }}><strong style={{ color: '#fff' }}>Tiebreakers:</strong> 1) Head-to-head record, 2) Point differential</p>
                <p style={{ margin: '0 0 8px' }}><strong style={{ color: '#fff' }}>Play-In (7-10):</strong> 7v8 and 9v10, then loser of 7v8 vs winner of 9v10</p>
                <p style={{ margin: '0 0 8px' }}><strong style={{ color: '#fff' }}>Playoffs:</strong> Best-of-5 series, 2-2-1 format (higher seed hosts G1, G2, G5)</p>
                <p style={{ margin: 0 }}><strong style={{ color: '#fff' }}>Final Four:</strong> Single elimination at Athens 2026</p>
                <p style={{ margin: '8px 0 0', color: '#3b82f6' }}><strong>🇬🇷 Greek Advantage:</strong> PAN & OLY receive +10% win probability boost in Final Four games due to home crowd support in Athens</p>
              </div>
            </div>

            {/* Column Definitions */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ color: '#ff6b35', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>📋</span> Column Definitions
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', color: '#aaa' }}>
                <div><strong style={{ color: '#fff' }}>GP:</strong> Games Played</div>
                <div><strong style={{ color: '#fff' }}>W/L:</strong> Wins / Losses</div>
                <div><strong style={{ color: '#fff' }}>WIN%:</strong> Win Percentage</div>
                <div><strong style={{ color: '#fff' }}>PTS+/-:</strong> Points For/Against</div>
                <div><strong style={{ color: '#fff' }}>+/-:</strong> Point Differential</div>
                <div><strong style={{ color: '#fff' }}>RATING:</strong> Team strength rating</div>
                <div><strong style={{ color: '#fff' }}>AVG:</strong> Average predicted finish</div>
                <div><strong style={{ color: '#fff' }}>PLAYOFFS:</strong> % to make playoffs (top 8)</div>
                <div><strong style={{ color: '#fff' }}>F4:</strong> % to reach Final Four</div>
                <div><strong style={{ color: '#fff' }}>CHAMP:</strong> % to win championship</div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setShowHelp(false)}
              style={{ width: '100%', marginTop: '8px' }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
