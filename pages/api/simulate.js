// simulate.js
// This is a lightweight serverless route that supports saving/loading simulations
// and returning example datasets. It does not perform heavy computation — client-side
// handles simulation. The server helps with 'export' files and demo datasets.
// Deploy on Vercel as /api/simulate

const micro = require("micro");
const { send } = micro;

module.exports = async (req, res) => {
  try {
    if (req.method === "POST") {
      const body = await micro.json(req);
      // support action "export" to return downloadable text
      if (body.action === "export") {
        const payload = body.payload || "";
        // return file content as plain text
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=simulation_export.txt");
        return send(res, 200, payload);
      }
      if (body.action === "demo") {
        const demoType = body.demoType || "sequential";
        if (demoType === "sequential") {
          return send(res, 200, {
            name: "Sequential Demo",
            description: "Demo dataset for sequential file simulation",
            records: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, size: 20 + (i % 5) * 10, name: `R${i + 1}` }))
          });
        } else if (demoType === "variable") {
          return send(res, 200, {
            name: "Variable-length Demo",
            records: [
              { id: 1, size: 50, name: "A" },
              { id: 2, size: 30, name: "B" },
              { id: 3, size: 120, name: "C" },
              { id: 4, size: 10, name: "D" },
              { id: 5, size: 80, name: "E" }
            ]
          });
        } else {
          return send(res, 200, { name: "Empty demo", records: [] });
        }
      }

      return send(res, 200, { status: "ok", received: body });
    } else if (req.method === "GET") {
      // show status
      return send(res, 200, {
        name: "File Organization Simulator API",
        version: "1.0",
        status: "ready"
      });
    } else {
      return send(res, 405, { error: "Method not allowed" });
    }
  } catch (err) {
    return send(res, 500, { error: String(err) });
  }
};
