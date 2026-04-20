import fs from "fs";

const bookedCabanas = new Set<string>();

type Guest = {
  room: string;
  guestName: string;
};

let validGuests: Guest[] = [];


export function loadGuests(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  validGuests = JSON.parse(content);
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
    return { success: false, error: "Invalid guest credentials" };
  }

  if (bookedCabanas.has(cabanaId)) {
    return { success: false, error: "Cabana already booked" };
  }

  bookedCabanas.add(cabanaId);

  return { success: true };
}
