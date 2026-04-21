import fs from "fs";

const bookedCabanas = new Set<string>();
const guestsWithBookedCabana = new Map<string, string>();

type Guest = {
  room: string;
  guestName: string;
};

let validGuests: Guest[] = [];


export function loadGuests(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Invalid JSON in bookings file");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Bookings file must be an array");
  }

  validGuests = parsed.map((g) => {
    if (!g.room || !g.guestName) {
      throw new Error("Invalid guest entry in bookings file");
    }

    return {
      room: String(g.room),
      guestName: String(g.guestName),
    };
  });
}

function isValidGuest(room: string, guestName: string): boolean {
  return validGuests.some(
    (g) => g.room === room && g.guestName.toLowerCase() === guestName.toLowerCase()
  );
}

export function isCabanaBooked(id: string) {
  return bookedCabanas.has(id);
}

export function bookCabana(
  cabanaId: string,
  room: string,
  guestName: string
) {
  if (!isValidGuest(room, guestName)) {
    throw new BookingError("Invalid guest credentials");
  }

  if (bookedCabanas.has(cabanaId)) {
    throw new BookingError("Cabana already booked");
  }

  if (guestsWithBookedCabana.has(`${room}:${guestName}`)) {
    throw new BookingError("Guest already has a booked cabana");
  }

  bookedCabanas.add(cabanaId);
  guestsWithBookedCabana.set(`${room}:${guestName}`, cabanaId);

  return { cabanaId };
}

export class BookingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingError";
  }
}
