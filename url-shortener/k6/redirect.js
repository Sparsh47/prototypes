// k6 run -e BASE_URL=http://localhost:3000 k6/redirect.js   (run seed-api.mjs first)
import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";

const codes = new SharedArray("codes", () => JSON.parse(open("../codes.json")));
const BASE = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
    stages: [
        { duration: "30s", target: 50 },
        { duration: "1m", target: 200 },
        { duration: "1m", target: 500 },
        { duration: "30s", target: 0 },
    ],
    thresholds: { http_req_duration: ["p(95)<200"], http_req_failed: ["rate<0.01"] },
};

export default function () {
    const code = codes[Math.floor(Math.random() * codes.length)];
    const res = http.get(`${BASE}/${code}`, { redirects: 0 });
    check(res, { "is redirect": (r) => r.status === 301 || r.status === 302 });
}