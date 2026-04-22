import path from "path";

import { bookCabana, loadGuests, isCabanaBooked, resetBookings } from "../bookingService";

beforeAll(() => {
  loadGuests(
    path.join(__dirname, "../../bookings.json")
  );
});

beforeEach(() => {
  resetBookings();
});

describe("Booking Service", () => {

  test("books a cabana successfully", () => {
    const result = bookCabana("cabana-1", "101", "Alice Smith");

    expect(result).toEqual({ cabanaId: "cabana-1" });
    expect(isCabanaBooked("cabana-1")).toBe(true);
  });

  test("rejects invalid guest", () => {
    expect(() =>
      bookCabana("cabana-1", "999", "Fake Name")
    ).toThrow("Invalid guest credentials");
  });

  test("rejects already booked cabana", () => {
    bookCabana("cabana-1", "101", "Alice Smith");

    expect(() =>
      bookCabana("cabana-1", "102", "Bob Jones")
    ).toThrow("Cabana already booked");
  });

  test("rejects same guest booking twice", () => {
    bookCabana("cabana-1", "101", "Alice Smith");

    expect(() =>
      bookCabana("cabana-2", "101", "Alice Smith")
    ).toThrow("Guest already has a booked cabana");
  });

});
