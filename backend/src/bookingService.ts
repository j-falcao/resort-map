import fs from "fs";

const bookedCabanas = new Set<string>();

type Guest = {
    room: string;
    name: string;
};

let validGuests: Guest[] = [];


export function loadGuests(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  validGuests = JSON.parse(content);
}

function isValidGuest(room: string, name: string): boolean {
  return validGuests.some(
    (g) => g.room === room && g.name.toLowerCase() === name.toLowerCase()
  );
}

export function isCabanaBooked(id: string) {
  return bookedCabanas.has(id);
}

export function bookCabana(
  cabanaId: string,
  room: string,
  name: string
) {
  if (!isValidGuest(room, name)) {
    return { success: false, error: "Invalid guest credentials" };
  }

  if (bookedCabanas.has(cabanaId)) {
    return { success: false, error: "Cabana already booked" };
  }

  bookedCabanas.add(cabanaId);

  return { success: true };
}
