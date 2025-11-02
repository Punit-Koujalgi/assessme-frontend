# AssessMe (Frontend)

Live demo: http://Punit-Koujalgi.github.io/assessme-frontend 

This repository contains the React frontend for AssessMe — a small app that accepts a text context (for example, study material or passages) and generates different kinds of assessment questions by calling a backend API.

The frontend is intentionally lightweight and expects a single API endpoint to return a structured JSON response containing four types of questions: FITB (fill-in-the-blanks), MCQ (multiple-choice), MTF (match-the-following), and TF (true/false).

(Currently, the project is deployed with Github Actions to Github pages!)

## Quick overview

- App: AssessMe (React)
- How it works: user pastes or loads a passage, clicks Evaluate, frontend POSTs the context to the backend `/api` endpoint, and renders the returned question sets.

## Running locally

Install dependencies and start the dev server:

```bash
npm install
npm start
```

By default the frontend will POST requests to the URL defined by the `REACT_APP_API_URL` environment variable. If that variable is not set, it will use `http://127.0.0.1:7860` as default. The frontend appends `/api` to that base URL, so the full request URL becomes `${REACT_APP_API_URL || 'http://127.0.0.1:7860'}/api`.

Example (start dev server with a custom backend URL):

```bash
# macOS / Linux (bash)
REACT_APP_API_URL="http://localhost:5000" npm start
```

## Frontend integration notes

- The main UI lives in `src/App.js` and `src/components/Content.js`.
- `Content.js` reads the textarea with id `context` when you click Evaluate and calls `src/components/utilities/Data.js::fetchDataAPI(context, ...)`.
- `fetchDataAPI` performs a `POST` to `${apiBase}/api` with a JSON body of the shape: `{ "context": "<text>" }` and expects a JSON response (see schema below). On success the raw response is stored in state and the appropriate view (FITB/MCQ/MTF/TF) is rendered.
- The UI assumes the backend returns structured data using the exact keys: `FITB`, `MCQ`, `MTF`, and `TF`.

## API contract

Endpoint: POST /api

Request body (JSON):

```json
{
	"context": "<the text to generate questions from>"
}
```

Successful response (JSON) — the backend must return a single JSON object with these keys:

```json
{
	"FITB": [
		{ "answer": "college", "id": 0, "question": "Today the _________ ..." }
	],
	"MCQ": [
		{ "answer": "engineering", "distractors": ["Computer Science","Aerospace","Mechatronics","Materials Science"], "id": 0, "question": "What college was established in 1920?" }
	],
	"MTF": {
		"defs": ["the practical application of science to commerce or industry","the body of faculty and students of a college","a particular branch of scientific knowledge"],
		"keys": ["engineering", "college", "science"]
	},
	"TF": [
		{ "answer": false, "id": 0, "sentence": "The College of Engineering never was established in 1920..." }
	]
}
```

Notes about the response shape and how the frontend uses it:
- `FITB` — array of objects. Each object should include `id` (number), `answer` (string), and `question` (string). The frontend displays the question text which should include an underscore blank (the UI looks for underscores and displays them as the blank). Example question includes a long blank (underscore run).
- `MCQ` — array of objects. Each object should include `id`, `question`, `answer` (string) and `distractors` (array of strings). The frontend will combine the `answer` and up to 3 distractors, shuffle them, and render as four options. To work well, supply exactly four options (1 correct + 3 distractors) or at least enough similar distractors.
- `MTF` — a single object with two arrays: `keys` (array of short keywords) and `defs` (array of corresponding short definitions). The frontend shuffles both columns to render a match-the-following UI. Keep individual `defs` under 60 characters for better display.
- `TF` — array of objects. Each object should include `id`, `sentence` (string) and `answer` (boolean). The frontend displays sentences in random order for the user to mark True/False.
