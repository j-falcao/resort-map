const { spawn } = require("child_process");
const path = require("path");

// Resolve --map and --bookings paths relative to CWD (root) before passing to backend
const args = process.argv.slice(2).map((arg, i, arr) => {
  if (arr[i - 1] === "--map" || arr[i - 1] === "--bookings") {
    return path.resolve(arg); // absolute path, so backend's cwd doesn't matter
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