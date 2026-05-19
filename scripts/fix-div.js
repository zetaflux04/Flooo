const fs = require("fs");
const path = require("path");

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (!["node_modules", ".next", ".git"].includes(f)) walk(p);
    } else if (/\.tsx$/.test(f)) {
      let c = fs.readFileSync(p, "utf8");
      const n = c
        .replace(/<motion\b/g, "<div")
        .replace(/<\/motion>/g, "</div>")
        .replace(/function motion\([\s\S]*?\n\}\n?/g, "");
      if (n !== c) {
        fs.writeFileSync(p, n);
        console.log("fixed", p);
      }
    }
  }
}

walk(path.join(__dirname, ".."));
