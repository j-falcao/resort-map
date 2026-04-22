const { spawn } = require("child_process");
const path = require("path");

// Inject defaults relative to project root if not provided
const rawArgs = process.argv.slice(2);
console.log(rawArgs);
if (!rawArgs.includes("--map")) {
  rawArgs.push("--map", path.resolve("map.ascii"));
}
if (!rawArgs.includes("--bookings")) {
  rawArgs.push("--bookings", path.resolve("bookings.json"));
}

// Resolve explicit --map and --bookings paths relative to CWD (root)
const args = rawArgs.map((arg, i, arr) => {
  if (arr[i - 1] === "--map" || arr[i - 1] === "--bookings") {
    return path.resolve(arg);
  }
  return arg;
});

const backend = spawn(
  "npm",
  ["run", "dev", "--", ...args],
  { cwd: "./backend", shell: true, stdio: "inherit" }
);
const frontend = spawn(
  "npm",
  ["run", "dev"],
  { cwd: "./frontend", shell: true, stdio: "inherit" }
);
process.on("SIGINT", () => {
  backend.kill();
  frontend.kill();
});