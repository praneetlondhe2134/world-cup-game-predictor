# Sports Match Prediction Platform — World Cup Edition

A full-stack sports prediction platform where users can view World Cup-style fixtures, submit match predictions, compare their picks against a simple app-generated baseline predictor, and compete on a leaderboard after results are entered.

This project was built as a portfolio-ready full-stack application using Next.js, PostgreSQL, Prisma, Docker, and TypeScript.

## Live Demo

[View the deployed app here](https://world-cup-game-predictor-5zihxtc5c-praneetlondhe2134s-projects.vercel.app)

## Features

* View match fixtures loaded from the database
* Submit user predictions from the browser
* Predict home win, away win, or draw
* Optionally submit predicted scores
* Prevent duplicate predictions for the same match and display name
* Display a leaderboard ranked by total points
* Submit match results through an internal result endpoint
* Automatically score predictions after match results are entered
* Show an app-generated baseline prediction for each match
* Import external-style fixture data from a local JSON source

## Tech Stack

* Next.js
* TypeScript
* React
* Tailwind CSS
* PostgreSQL
* Prisma ORM
* Docker Compose
* Node.js / npm

## Project Overview

The app has two prediction flows:

1. **User predictions**
   Users submit their own predictions for each match.

2. **App-generated predictions**
   The app uses a simple rating-based baseline model to predict the likely result of a match.

The app does not currently use machine learning or live sports data. The MVP uses local fixture import data and a transparent rating-based predictor.

## Scoring Rules

Prediction points are awarded only after a match result is submitted.

* Correct winner or correct draw: **3 points**
* Exact scoreline bonus: **+2 points**
* Incorrect result: **0 points**

Example:

If Australia beats Japan 2–1:

* Predict Australia win: 3 points
* Predict Australia win and 2–1 score: 5 points
* Predict Japan win: 0 points
* Predict draw: 0 points

## App Predictor

The app predictor uses a simple team rating comparison.

Each team has a numeric `rating`. The predictor compares the home team rating with the away team rating and returns:

* predicted result
* predicted winner, or draw
* confidence label
* short explanation

This is intentionally simple and explainable. It is not presented as advanced AI or machine learning.

## Database Models

### Team

Stores team information.

Key fields:

* `id`
* `name`
* `code`
* `group`
* `rating`

### Match

Stores fixture and result information.

Key fields:

* `id`
* `slug`
* `homeTeamId`
* `awayTeamId`
* `kickoffTime`
* `stage`
* `status`
* `homeScore`
* `awayScore`

### Prediction

Stores user predictions.

Key fields:

* `id`
* `matchId`
* `displayName`
* `predictedWinnerId`
* `predictedHomeScore`
* `predictedAwayScore`
* `pointsAwarded`

A unique constraint prevents the same `displayName` from submitting multiple predictions for the same match.

## API Endpoints

### `GET /api/matches`

Returns all matches with team details and app-generated predictions.

### `POST /api/predictions`

Creates a user prediction.

Expected body:

```json
{
  "matchId": "match-id",
  "displayName": "TestUser",
  "predictedWinnerId": "team-id-or-null",
  "predictedHomeScore": 2,
  "predictedAwayScore": 1
}
```

Use `null` for `predictedWinnerId` when predicting a draw.

### `GET /api/leaderboard`

Returns users ranked by total prediction points.

### `POST /api/matches/[matchId]/result`

Internal/manual endpoint for submitting a match result and scoring predictions.

Expected body:

```json
{
  "homeScore": 2,
  "awayScore": 1
}
```

This updates the match result, marks the match as completed, recalculates prediction points, and updates the leaderboard.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/praneetlondhe2134/world-cup-game-predictor.git
cd world-cup-game-predictor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start PostgreSQL with Docker

```bash
docker compose up -d
```

Confirm the database container is running:

```bash
docker ps
```

### 4. Set up environment variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/world_cup_predictor"
```

### 5. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 6. Seed local demo data

```bash
npx prisma db seed
```

### 7. Import local fixture data

```bash
npm run import:fixtures
```

### 8. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Useful Commands

Run lint:

```bash
npm run lint
```

Start database:

```bash
docker compose up -d
```

Stop database:

```bash
docker compose down
```

Open Prisma Studio:

```bash
npx prisma studio
```

Seed database:

```bash
npx prisma db seed
```

Import fixture data:

```bash
npm run import:fixtures
```

## Data Integration

The MVP uses a local JSON fixture source:

```text
data/world-cup-fixtures.json
```

The import script reads this external-style fixture data and upserts teams and matches into the database.

This keeps the app working locally without relying on paid APIs, API keys, or rate limits.

Future improvement:

* replace the local JSON source with a live football data API
* normalize API responses into the same fixture shape
* reuse the existing import/upsert logic

## Current Limitations

* No authentication yet
* No admin UI for entering results
* Result submission is done through an internal API endpoint
* Fixture data is imported from a local JSON file
* App predictor is rating-based, not machine learning-based
* Team ratings are simple demo values

## Future Improvements

* Add authentication
* Add admin dashboard for result entry
* Connect to a live football data API
* Add automated fixture/result syncing
* Improve team rating model
* Add tests for scoring and predictor logic
* Add deployment setup
* Add screenshots and demo video
* Improve responsive UI polish

## Project Status

Core MVP completed:

* match display
* user prediction submission
* app-generated predictions
* scoring engine
* leaderboard
* fixture import flow

Next planned work:

* production deployment
* README screenshots
* `.env.example`
* final portfolio polish
