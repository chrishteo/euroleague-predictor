# EuroLeague Predictor

A Monte Carlo simulation-based prediction system for the EuroLeague basketball season. Predict final standings, playoff probabilities, and visualize the season race.

**Live Demo:** [euroleague-predictor-five.vercel.app](https://euroleague-predictor-five.vercel.app/)

![Season](https://img.shields.io/badge/Season-2025--26-orange)
![Teams](https://img.shields.io/badge/Teams-20-blue)
![Simulations](https://img.shields.io/badge/Simulations-5,000-green)

## Features

### Standings
- Current league standings with all 20 teams
- Win/Loss record, win percentage, points for/against
- Color-coded playoff zones (Top 6, Play-In 7-10, Eliminated 11-20)
- Team ratings based on performance

### Schedule & What-If
- View upcoming games with win probabilities
- Set what-if outcomes to see how results affect standings
- Filter by round

### Predictions
- Monte Carlo simulation (5,000 iterations)
- Projected final standings with position probabilities
- Playoff, Play-In, and elimination chances
- Championship probability
- Position distribution charts
- Export to CSV/JSON
- Share results

### Playoffs Visualization
- Play-In Tournament bracket (7v10, 8v9 format)
- Quarter-finals Best-of-5 matchups
- Final Four bracket
- Win probabilities for each series

### Season Race
- Animated bar chart showing teams' progress round by round
- Watch standings evolve through the predicted season
- Playback controls (Start, Pause, Reset)
- Adjustable speed (Slow, Normal, Fast, Very Fast)

### My Team
- Select a favorite team for personalized tracking
- See all upcoming games for your team
- Highlighted throughout the app

### Data Persistence
- Simulation results saved to browser storage
- What-if scenarios persist between sessions
- No account needed

## Tech Stack

- React 18
- Vite
- Deployed on Vercel

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Prediction Methodology

### Team Rating
```
Rating = 1500 + (WinPct - 0.5) * 400 + AvgMargin * 10
```

### Win Probability
```
P(Win) = 1 / (1 + 10^((OpponentRating - TeamRating - HomeAdvantage) / 400))
```

Home advantage: +50 rating points (~3-4 point spread)

### Greek Team F4 Boost
Athens 2026 Final Four: Panathinaikos and Olympiacos receive a slight boost in Final Four simulations to account for home advantage.

## Data Sources

- Official EuroLeague standings and schedule
- Manual updates for postponed games

## License

For educational and personal use. EuroLeague data is property of Euroleague Basketball.

---

**Enjoy predicting the EuroLeague season!**
