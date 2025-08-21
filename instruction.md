# Goal
Build a small web app where the user chooses a mood (Happy, Chill, Sad, Focus, Energetic, Romantic, Party, Sleep), then shows curated Spotify playlists for that mood using the Spotify Web API.


# Tech Stack (no framework)

PHP  (server-side, routes/controllers)
HTML + Tailwind CSS (styling; mimic shadcn/ui look & spacing)
Vanilla JS for fetch & UI interactivity
Spotify Integration Requirements
Use Client Credentials Flow to get an app token (for public playlist search).
Securely load SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET from environment (e.g., .env + vlucas/phpdotenv or a simple config file excluded from VCS).

Implement a PHP helper spotify_token() that caches the bearer token (file cache or session) until expiry.
Implement endpoint /api/playlists.php?mood=happy that:


# Maps mood → list of search queries & categories (e.g., happy → [happy, feel good, good vibes]).

Calls Search API (type=playlist&q={query}) and dedupes by playlist ID.
Returns a normalized JSON payload: [{ id, name, description, image, owner, followers?, external_url }].
Handle rate limits (check Retry-After header) and surface friendly error messages.
Moods & Mapping (sample)
happy:       ["happy", "feel good", "good vibes"]
chill:       ["chill", "lofi", "laid back", "relax"]
sad:         ["sad", "heartbreak", "emo"]
focus:       ["focus", "deep work", "concentration", "instrumental"]
energetic:   ["workout", "hype", "power", "pump"]
romantic:    ["romantic", "love", "date night"]
party:       ["party", "dance", "club"]
sleep:       ["sleep", "calm", "ambient"]


# STYLING UI/UX (mimic shadcn look)

Top nav: app name “Moodify”, small subtle border bottom.

Hero: large heading “Pick a mood”, subtext “We’ll fetch playlists that match your vibe.”

Mood chips (buttons): rounded-2xl, soft shadow on hover, active state with subtle ring.

Results: responsive card grid (minmax 220px), each card shows cover image, playlist name, truncated description, owner, and a button “Open in Spotify”.

Loading skeletons (pulse blocks) while fetching.

Empty state: friendly illustration (placeholder div), “No playlists found for ‘xxx’”.

Error state: alert banner with retry action.

Styling Notes

Use Tailwind via CDN (acceptable) or built step, your choice.

Color palette: neutral background, subtle accents; use rounded-2xl, shadow-sm to shadow-md, ring-1 ring-muted for focus states.

Typography scale: title text-3xl/4xl, section text-xl, body text-sm/text-base.

Security & DX

Don’t expose client secret to the browser. All Spotify calls go through PHP.

Add simple rate limiting (IP-based 60 req/min) to /api/playlists.php.

.env.example with SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET.

README.md with setup steps (composer install, env, Tailwind setup if building).

Clean error handling: JSON with { error: true, message } and HTTP status codes.

Acceptance Criteria

Selecting a mood triggers AJAX to /api/playlists.php?mood={mood} and renders 12–24 playlists.

Works with no login (client credentials).

Handles token expiration seamlessly.

Mobile-first responsive.

No React, no external UI kit—just Tailwind.

# Use this for .env
SPOTIFY_CLIENT_ID=92e6274a46e0430ba75b3a1747bb2bd5
SPOTIFY_CLIENT_SECRET=42f1ba39b6d24333aa557dbd7c59f807
APP_ENV=local
APP_DEBUG=true
