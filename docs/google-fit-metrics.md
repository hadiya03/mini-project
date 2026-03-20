# Google Fit metrics: sleep, tiredness, and RPE

This document describes how the backend derives **sleep hours**, **tiredness (1–10)**, and **estimated RPE (1–10)** from Google Fit after OAuth sync. It matches the implementation in:

- `backend/src/services/googleFitSleep.js` — sleep
- `backend/src/services/googleFitDerived.js` — tiredness and RPE

These are **proxies**, not clinical measurements. RPE here is an **activity-load score**, not a subjective “how hard did it feel?” unless the user edits it in the UI.

---

## Time window

All of the above use the same **rolling wall-clock window**:

- **Default:** `[now − 24h, now]`
- **Configurable:** `GOOGLE_FIT_SLEEP_WINDOW_HOURS` (1–168, default 24)
- **Timezone label:** `GOOGLE_FIT_SLEEP_TZ` (optional; falls back to server/IANA default)

Sleep segments and activity aggregates are **clipped** to this window where applicable.

---

## Sleep (`sleepHours`)

**Data source:** Google Fit `com.google.sleep.segment` (Fitness API).

**Steps:**

1. Load sleep data for the window (prefer per–data-stream datasets; fallback to a single-bucket aggregate).
2. For each segment, read the sleep **stage** from the point value.
3. **Exclude** stages counted as awake or out-of-bed (`awake` = 1, `out of bed` = 3 in Google’s encoding).
4. **Sum** the duration of all other stages (non-awake sleep) that overlap the window (overlap is clipped to the window).
5. Convert nanoseconds → **hours**, rounded to **two decimal places**.
6. If staging cannot be interpreted but segments exist, fall back to **total time in bed** for those segments (still clipped).

If multiple data streams exist, the implementation takes the **maximum** total across streams (to reduce double-counting merged vs raw sources).

**Output:** a single number, **hours of sleep** (e.g. `7.25`), not a 1–10 score.

---

## Tiredness (`estimatedTiredness`, 1–10)

**Purpose:** A simple **fatigue proxy** from **sleep duration only** (shorter sleep → higher tiredness).

**Input:** `sleepHours` from the sleep pipeline above. If sleep is missing or ≤ 0, tiredness is **`null`** (not estimated).

**Rules:**

| Sleep duration | Tiredness |
|----------------|-----------|
| ≥ 8 h          | **1** (most rested) |
| ≤ 4 h          | **10** (most tired) |
| Between 4 h and 8 h | **Linear** between 10 and 1 |

**Formula** for \(4 < h < 8\):

\[
\text{tiredness} = \mathrm{round}\Bigl(10 - \frac{h - 4}{4} \times 9\Bigr)
\]

Then clamped to **1–10** (in practice the linear part already stays in range).

**Examples:**

- 8 h → 1  
- 6 h → \(\mathrm{round}(10 - 0.5 \times 9) = 6\)  
- 4 h → 10  

---

## RPE (`estimatedRpe`, 1–10 or `null`)

**Purpose:** **Load / exertion proxy** from **calories expended** and **logged workout session duration** in the **same rolling window** as sleep—not subjective RPE.

**Inputs (from Google Fit):**

| Input | API / data |
|--------|------------|
| `calories` | Aggregate `com.google.calories.expended` over the window |
| `sessionMinutes` | Sum of \((\text{end} - \text{start})\) for all **sessions** in the window (`fitness.users.sessions.list`), in minutes |

Let \(c\) = calories, \(m\) = session minutes (both ≥ 0).

**No meaningful activity**

If **both** \(c < 15\) **and** \(m < 1\):

- **`estimatedRpe` = `null`** (user can enter RPE manually).

**Very light activity**

If \(c < 25\) **and** \(m < 3\) (but not in the “no meaningful activity” band above):

- **`estimatedRpe` = 1**

**Otherwise**

Define:

\[
\text{load} = \frac{c}{200} + \frac{m}{40}
\]

Then:

\[
\text{RPE} = \mathrm{round}\bigl(1 + \text{load} \times 4.2\bigr)
\]

Finally clamp to **1–10**.

So RPE rises with higher calorie burn and longer session time in the window.

---

## API surface

`GET /api/googlefit/data` returns (among other fields):

- `sleepHours` — hours  
- `estimatedTiredness` — 1–10 or omitted/`null`  
- `estimatedRpe` — 1–10 or `null` when activity is negligible  
- `activityLoad` — `{ calories, sessionMinutes, sessionCount }` for transparency  

---

## OAuth scopes

Sleep and activity metrics use:

- `https://www.googleapis.com/auth/fitness.sleep.read`
- `https://www.googleapis.com/auth/fitness.activity.read`

(Activity read covers sessions and calorie aggregates used for RPE.)

---

## Related env vars

| Variable | Role |
|----------|------|
| `GOOGLE_FIT_SLEEP_TZ` | Timezone context for window labels |
| `GOOGLE_FIT_SLEEP_WINDOW_HOURS` | Length of rolling window (default 24) |
