import request from "supertest";

import { createApp } from "../server";
import { resetBookings } from "../bookingService";

let app: any;

beforeAll(() => {
  app = createApp();
});

beforeEach(() => {
  resetBookings();
});

describe("API", () => {

  test("GET /map returns grid", async () => {
    const res = await request(app).get("/map");

    expect(res.status).toBe(200);
    expect(res.body.grid).toBeDefined();
    expect(Array.isArray(res.body.grid)).toBe(true);
  });

  test("POST /book success", async () => {
    const res = await request(app)
      .post("/book")
      .send({
        cabanaId: "cabana-1",
        room: "101",
        name: "Alice Smith"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.cabanaId).toBe("cabana-1");
  });

  test("POST /book rejects invalid guest", async () => {
    const res = await request(app)
      .post("/book")
      .send({
        cabanaId: "cabana-1",
        room: "999",
        name: "Fake"
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid guest credentials");
  });

  test("booking updates cabana availability in map response", async () => {
    // Book a cabana
    const bookRes = await request(app)
        .post("/book")
        .send({
        cabanaId: "cabana-1",
        room: "101",
        name: "Alice Smith"
        });

    expect(bookRes.status).toBe(200);

    // Fetch map again
    const mapRes = await request(app).get("/map");

    expect(mapRes.status).toBe(200);

    // Flatten grid to inspect tiles
    const tiles = mapRes.body.grid.flat();

    const bookedCabana = tiles.find(
        (tile: any) => tile.id === "cabana-1"
    );

    expect(bookedCabana).toBeDefined();
    expect(bookedCabana.available).toBe(false);
    });
});
