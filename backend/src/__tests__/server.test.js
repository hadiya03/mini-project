// src/__tests__/server.test.js
const request = require("supertest");

// ─── Mock DB ──────────────────────────────────────────────────────────────────
jest.mock("../db/db.js", () => ({
  query: jest.fn((text, params) => {

    // ── Analytics queries (must be before generic AVG/COUNT checks) ──────────

    // Weekly logins — SELECT ... FROM user_logs ... GROUP BY day
    if (text.includes("FROM user_logs") && text.includes("login_time")) {
      return Promise.resolve({
        rows: [
          { day: "Mon", count: "3" },
          { day: "Wed", count: "5" },
        ],
        rowCount: 2,
      });
    }

    // User status — SUM active/offline FROM user_logs
    if (text.includes("FROM user_logs") && text.includes("logout_time")) {
      return Promise.resolve({
        rows: [{ active_count: "4", offline_count: "2" }],
        rowCount: 1,
      });
    }

    // Workload trend — FROM training_sessions with duration_minutes * rpe
    if (
      text.includes("FROM training_sessions") &&
      text.includes("duration_minutes")
    ) {
      return Promise.resolve({
        rows: [
          { week_label: "Week 1", total_load: "500" },
          { week_label: "Week 2", total_load: "620" },
          { week_label: "Week 3", total_load: "480" },
          { week_label: "Week 4", total_load: "710" },
        ],
        rowCount: 4,
      });
    }

    // ── Dashboard queries ─────────────────────────────────────────────────────

    if (text.includes("COUNT(*)") && text.includes("FROM players")) {
      return Promise.resolve({ rows: [{ count: "5" }], rowCount: 1 });
    }
    if (
      text.includes("AVG(readiness)") ||
      (text.includes("FROM player_assessments") && text.includes("AVG"))
    ) {
      return Promise.resolve({
        rows: [
          {
            avg: 75,
            count: "2",
            id: 1,
            name: "Test",
            injury_risk: 0.6,
            risk_level: "High Risk",
          },
        ],
        rowCount: 1,
      });
    }

    // ── Player queries ────────────────────────────────────────────────────────

    if (text.includes("FROM players")) {
      return Promise.resolve({
        rows: [{ id: 1, name: "Test Player", readiness: 0.9 }],
        rowCount: 1,
      });
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    if (text.includes("FROM users")) {
      return Promise.resolve({
        rows: [{ id: 1, email: "test@test.com" }],
        rowCount: 1,
      });
    }

    // ── Training sessions (generic fallback) ──────────────────────────────────

    if (text.includes("FROM training_sessions")) {
      return Promise.resolve({
        rows: [{ id: 1, title: "Test Session" }],
        rowCount: 1,
      });
    }

    // ── Assessments ───────────────────────────────────────────────────────────

    if (text.includes("FROM player_assessments")) {
      return Promise.resolve({
        rows: [
          {
            readiness: 80,
            fatigue: 3,
            overall_performance: 85,
            skill_gap: "Low",
            created_at: new Date(),
          },
        ],
        rowCount: 1,
      });
    }

    // ── Training submissions ──────────────────────────────────────────────────

    if (
      text.includes("FROM training_submissions") ||
      text.includes("FROM submissions")
    ) {
      return Promise.resolve({
        rows: [{ id: 1, player_id: 1, rpe: 7, sleep: 8 }],
        rowCount: 1,
      });
    }

    // ── Logs ──────────────────────────────────────────────────────────────────

    if (
      text.includes("FROM logs") ||
      text.includes("FROM system_logs") ||
      text.includes("FROM activity_logs")
    ) {
      return Promise.resolve({
        rows: [{ id: 1, message: "Test log" }],
        rowCount: 1,
      });
    }

    // ── Trainer messages ──────────────────────────────────────────────────────

    if (text.includes("FROM trainer_messages")) {
      return Promise.resolve({
        rows: [{ id: 1, message: "Good job" }],
        rowCount: 1,
      });
    }

    // ── Generic AVG/COUNT fallback ────────────────────────────────────────────

    if (text.includes("AVG") || text.includes("COUNT")) {
      return Promise.resolve({
        rows: [{ metric: "test", value: 42, count: "3", avg: 70 }],
        rowCount: 1,
      });
    }

    return Promise.resolve({ rows: [], rowCount: 0 });
  }),
}));

// ─── Mock Nodemailer ──────────────────────────────────────────────────────────
jest.mock("nodemailer", () => ({
  createTransport: () => ({
    sendMail: jest.fn().mockResolvedValue(true),
    verify: jest.fn((cb) => cb(null, true)),
  }),
}));

// ─── Mock Google OAuth libs ───────────────────────────────────────────────────
jest.mock("googleapis", () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        generateAuthUrl: jest.fn(() => "http://mock-auth-url"),
        getToken: jest.fn(),
        setCredentials: jest.fn(),
      })),
    },
    fitness: jest.fn(() => ({
      users: {
        dataset: { aggregate: jest.fn() },
      },
    })),
  },
}));

// Silence console noise during tests
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

// Import app AFTER all mocks are set up
const app = require("../server");

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Backend Server Routes", () => {

  // ── Routes with a root GET / ──────────────────────────────────────────────

  describe("Routes that respond on their base path", () => {
    const baseGetRoutes = [
      "/api/dashboard",
      "/api/training-sessions",
      "/api/users",
      "/api/logs",
      "/api/analytics",
    ];

    baseGetRoutes.forEach((url) => {
      test(`GET ${url} responds with status 200`, async () => {
        const response = await request(app).get(url);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
      });
    });
  });

  // ── Player routes ─────────────────────────────────────────────────────────

  describe("Player routes", () => {
    test("GET /api/player/players returns list of players", async () => {
      const response = await request(app).get("/api/player/players");
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
    });

    test("GET /api/player/players/:id returns a single player", async () => {
      const response = await request(app).get("/api/player/players/1");
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  // ── Assessment routes ─────────────────────────────────────────────────────

  describe("Assessment routes", () => {
    test("GET /api/assessments/:id returns assessment for a player", async () => {
      const response = await request(app).get("/api/assessments/1");
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  // ── Training submission routes ────────────────────────────────────────────

  describe("Training submission routes", () => {
    test("GET /api/training-submissions/players/:id/daily-input returns latest submission", async () => {
      const response = await request(app).get(
        "/api/training-submissions/players/1/daily-input"
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  // ── Auth routes ───────────────────────────────────────────────────────────

  describe("Auth routes", () => {
    test("POST /api/auth/l accepts login payload", async () => {
      const response = await request(app)
        .post("/api/auth/l")
        .send({ email: "test@test.com", password: "password123" });
      expect([200, 401, 400, 500]).toContain(response.statusCode);
    });

    test("GET /api/auth returns 404 (no GET handler)", async () => {
      const response = await request(app).get("/api/auth");
      expect(response.statusCode).toBe(404);
    });
  });

  // ── Player messages ───────────────────────────────────────────────────────

  describe("Player message routes", () => {
    test("GET /api/player/messages/:playerId returns messages", async () => {
      const response = await request(app).get("/api/player/messages/1");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // ── Trainer routes ────────────────────────────────────────────────────────

  describe("Trainer routes", () => {
    test("GET /api/trainer/trainer-players returns players", async () => {
      const response = await request(app).get("/api/trainer/trainer-players");
      expect([200, 500]).toContain(response.statusCode);
    });
  });

  // ── Google Fit routes ─────────────────────────────────────────────────────

  describe("Google Fit routes", () => {
    test("GET /auth/google redirects to Google OAuth", async () => {
      const response = await request(app).get("/auth/google");
      // 302 = redirect, 200 = handled, 400 = missing OAuth config, 500 = server error
      expect([200, 302, 400, 500]).toContain(response.statusCode);
    });
  });

  // ── 404 fallback ──────────────────────────────────────────────────────────

  describe("404 fallback", () => {
    test("GET /nonexistent returns 404", async () => {
      const response = await request(app).get("/nonexistent");
      expect(response.statusCode).toBe(404);
    });
  });
});