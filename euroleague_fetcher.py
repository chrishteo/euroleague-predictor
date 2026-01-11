#!/usr/bin/env python3
"""
EuroLeague Data Fetcher
-----------------------
Fetches game results, standings, and player stats from the official EuroLeague API.
Run this script locally to get fresh data that you can use in the predictor app.

Usage:
    pip install euroleague-api pandas
    python euroleague_fetcher.py

Output:
    - euroleague_games.json: All game results
    - euroleague_standings.json: Current standings
    - euroleague_player_stats.json: Player statistics
"""

import json
import os
from datetime import datetime

import requests

try:
    from euroleague_api.game_stats import GameStats
    from euroleague_api.standings import Standings
    from euroleague_api.player_stats import PlayerStats
    import pandas as pd
except ImportError:
    print("Required packages not found. Please install them:")
    print("  pip install euroleague-api pandas")
    print()
    print("Or if you get environment errors:")
    print("  pip install --user euroleague-api pandas")
    print("  # or")
    print("  pip install --break-system-packages euroleague-api pandas")
    exit(1)


# Configuration
SEASON = 2025  # 2025-26 season (API uses start year)
COMPETITION = "E"  # E = EuroLeague, U = EuroCup
OUTPUT_DIR = "euroleague_data"


def fetch_standings(max_round=38):
    """Fetch current standings"""
    print("Fetching standings...")
    standings = Standings(COMPETITION)
    
    # Try to find the latest round with data
    for round_num in range(max_round, 0, -1):
        try:
            df = standings.get_standings(SEASON, round_num)
            if not df.empty:
                print(f"  Found standings for round {round_num}")
                return df, round_num
        except Exception as e:
            continue
    
    return None, 0


def fetch_all_games(max_round):
    """Fetch all game results for the season"""
    print(f"Fetching games (rounds 1-{max_round})...")
    game_stats = GameStats(COMPETITION)

    all_games = []

    for round_num in range(1, max_round + 1):
        try:
            # Get game header info for this round
            df = game_stats.get_game_report_round(SEASON, round_num)

            if df is not None and not df.empty:
                for _, row in df.iterrows():
                    # Use the actual API column names
                    game_code = row.get("Gamecode", row.get("gamecode", ""))
                    date = row.get("date", "")
                    home = row.get("local.club.code", "")
                    away = row.get("road.club.code", "")
                    home_score = row.get("local.score", 0)
                    away_score = row.get("road.score", 0)
                    home_name = row.get("local.club.name", "")
                    away_name = row.get("road.club.name", "")

                    game = {
                        "round": round_num,
                        "gameCode": str(game_code),
                        "date": str(date),
                        "home": str(home),
                        "away": str(away),
                        "homeName": str(home_name),
                        "awayName": str(away_name),
                        "homeScore": int(home_score) if pd.notna(home_score) else 0,
                        "awayScore": int(away_score) if pd.notna(away_score) else 0,
                    }
                    all_games.append(game)

                print(f"  Round {round_num}: {len(df)} games")
        except Exception as e:
            print(f"  Round {round_num}: Error - {e}")

    return all_games


def fetch_player_stats():
    """Fetch aggregated player statistics"""
    print("Fetching player stats...")
    player_stats = PlayerStats(COMPETITION)

    try:
        df = player_stats.get_player_stats_single_season(
            endpoint="traditional",
            season=SEASON,
            phase_type_code="RS",  # Regular Season
            statistic_mode="PerGame"
        )
        print(f"  Found {len(df)} player records")
        return df
    except Exception as e:
        print(f"  Error fetching player stats: {e}")
        return None


def fetch_team_stats():
    """Fetch team statistics"""
    print("Fetching team stats...")

    try:
        from euroleague_api.team_stats import TeamStats
        team_stats = TeamStats(COMPETITION)
        df = team_stats.get_team_stats_single_season(
            endpoint="traditional",
            season=SEASON,
            phase_type_code="RS",
            statistic_mode="PerGame"
        )
        print(f"  Found {len(df)} team stat records")
        return df
    except Exception as e:
        print(f"  Error fetching team stats: {e}")
        return None


def fetch_upcoming_schedule(current_round, max_round=38):
    """Fetch upcoming games schedule from incrowdsports feed API"""
    print(f"Fetching upcoming schedule (rounds {current_round + 1}-{max_round})...")

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
    }

    all_upcoming = []
    season_code = f"E{SEASON}"

    for round_num in range(current_round + 1, max_round + 1):
        try:
            url = f"https://feeds.incrowdsports.com/provider/euroleague-feeds/v2/competitions/{COMPETITION}/seasons/{season_code}/games?phaseTypeCode=RS&roundNumber={round_num}"
            resp = requests.get(url, headers=headers, timeout=30)

            if resp.status_code == 200:
                data = resp.json()
                games = data.get('data', [])

                for g in games:
                    game = {
                        "round": round_num,
                        "gameCode": g.get('code', ''),
                        "date": g.get('date', ''),
                        "home": g.get('home', {}).get('code', ''),
                        "away": g.get('away', {}).get('code', ''),
                        "homeName": g.get('home', {}).get('name', ''),
                        "awayName": g.get('away', {}).get('name', ''),
                        "status": g.get('status', 'scheduled'),
                        "venue": g.get('venue', {}).get('name', ''),
                    }
                    all_upcoming.append(game)

                print(f"  Round {round_num}: {len(games)} games")
            else:
                print(f"  Round {round_num}: HTTP {resp.status_code}")
        except Exception as e:
            print(f"  Round {round_num}: Error - {e}")

    return all_upcoming


def convert_standings_to_app_format(df):
    """Convert standings DataFrame to the format expected by the React app"""
    teams = []
    
    for _, row in df.iterrows():
        team = {
            "code": row.get("club.code", row.get("clubCode", "")),
            "name": row.get("club.name", row.get("clubName", "")),
            "wins": int(row.get("gamesWon", row.get("wins", 0))),
            "losses": int(row.get("gamesLost", row.get("losses", 0))),
            "ptsFor": int(row.get("pointsFor", row.get("pf", 0))),
            "ptsAgainst": int(row.get("pointsAgainst", row.get("pa", 0))),
        }
        teams.append(team)
    
    return teams


def convert_games_to_app_format(games):
    """Convert games to the format expected by the React app"""
    app_games = []
    
    for game in games:
        if game["homeScore"] > 0 or game["awayScore"] > 0:  # Only played games
            app_game = {
                "id": f"api-{game['gameCode']}",
                "date": game["date"],
                "round": game["round"],
                "home": game["home"],
                "away": game["away"],
                "homeScore": game["homeScore"],
                "awayScore": game["awayScore"],
            }
            app_games.append(app_game)
    
    return app_games


def generate_js_data_file(teams, games):
    """Generate a JavaScript file that can be imported into the React app"""
    
    js_content = f"""// Auto-generated EuroLeague data
// Generated: {datetime.now().isoformat()}
// Season: {SEASON}-{SEASON + 1}

export const INITIAL_TEAMS = {json.dumps(teams, indent=2)};

export const INITIAL_GAMES = {json.dumps(games, indent=2)};

// Team code mapping for reference
export const TEAM_NAMES = {{
{chr(10).join(f'  "{t["code"]}": "{t["name"]}",' for t in teams)}
}};
"""
    return js_content


def main():
    print("=" * 50)
    print(f"EuroLeague Data Fetcher - Season {SEASON}-{SEASON + 1}")
    print("=" * 50)
    print()
    
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Fetch standings first to determine current round
    standings_df, current_round = fetch_standings()
    
    if standings_df is None:
        print("ERROR: Could not fetch standings. Check your internet connection.")
        return
    
    # Fetch all games up to current round
    games = fetch_all_games(current_round)

    # Fetch upcoming schedule
    upcoming_games = fetch_upcoming_schedule(current_round)

    # Fetch player stats
    player_stats_df = fetch_player_stats()

    # Fetch team stats
    team_stats_df = fetch_team_stats()

    print()
    print("Processing data...")
    
    # Convert to app format
    teams = convert_standings_to_app_format(standings_df)
    app_games = convert_games_to_app_format(games)
    
    # Save raw data as JSON
    with open(f"{OUTPUT_DIR}/standings_raw.json", "w") as f:
        json.dump(standings_df.to_dict(orient="records"), f, indent=2, default=str)
    
    with open(f"{OUTPUT_DIR}/games_raw.json", "w") as f:
        json.dump(games, f, indent=2, default=str)
    
    # Save app-formatted data
    with open(f"{OUTPUT_DIR}/teams.json", "w") as f:
        json.dump(teams, f, indent=2)

    with open(f"{OUTPUT_DIR}/games.json", "w") as f:
        json.dump(app_games, f, indent=2)

    # Save upcoming schedule
    with open(f"{OUTPUT_DIR}/schedule.json", "w") as f:
        json.dump(upcoming_games, f, indent=2)
    print(f"  Saved {len(upcoming_games)} upcoming games")
    
    # Save player stats if available
    if player_stats_df is not None and not player_stats_df.empty:
        with open(f"{OUTPUT_DIR}/player_stats.json", "w") as f:
            json.dump(player_stats_df.to_dict(orient="records"), f, indent=2, default=str)
        print(f"  Saved {len(player_stats_df)} player records")
    
    # Save team stats if available
    if team_stats_df is not None and not team_stats_df.empty:
        with open(f"{OUTPUT_DIR}/team_stats.json", "w") as f:
            json.dump(team_stats_df.to_dict(orient="records"), f, indent=2, default=str)
        print(f"  Saved {len(team_stats_df)} team stat records")
    
    # Generate JavaScript import file
    js_data = generate_js_data_file(teams, app_games)
    with open(f"{OUTPUT_DIR}/euroleague_data.js", "w") as f:
        f.write(js_data)
    
    # Print summary
    print()
    print("=" * 50)
    print("SUMMARY")
    print("=" * 50)
    print(f"Season: {SEASON}-{SEASON + 1}")
    print(f"Current Round: {current_round}")
    print(f"Teams: {len(teams)}")
    print(f"Games played: {len(app_games)}")
    print(f"Upcoming games: {len(upcoming_games)}")
    print()
    print("Files saved to:", OUTPUT_DIR)
    print("  - teams.json (for app)")
    print("  - games.json (for app)")
    print("  - schedule.json (upcoming games)")
    print("  - euroleague_data.js (importable JS)")
    print("  - standings_raw.json")
    print("  - games_raw.json")
    if player_stats_df is not None:
        print("  - player_stats.json")
    if team_stats_df is not None:
        print("  - team_stats.json")
    print()
    print("To use in the React app:")
    print("1. Copy the contents of teams.json")
    print("2. Replace the 'initialTeams' array in the app")
    print("3. Or use euroleague_data.js as an import")
    print()
    
    # Print current standings
    print("Current Standings:")
    print("-" * 40)
    for i, team in enumerate(sorted(teams, key=lambda x: (-x["wins"], x["losses"])), 1):
        diff = team["ptsFor"] - team["ptsAgainst"]
        diff_str = f"+{diff}" if diff > 0 else str(diff)
        print(f"{i:2}. {team['name'][:20]:<20} {team['wins']:2}-{team['losses']:<2} ({diff_str})")


if __name__ == "__main__":
    main()
