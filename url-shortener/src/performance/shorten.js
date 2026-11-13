// Write path: creating links. Note the target URL is slow/unreliable on purpose in the second scenario.
import http from "k6/http";
import { check } from "k6";

export const options = {
    scenarios: {
        creates: { executor: "constant-arrival-rate", rate: 100, timeUnit: "1s", duration: "1m", preAllocatedVUs: 200, maxVUs: 1000 },
    },
    thresholds: { http_req_duration: ["p(95)<500"], http_req_failed: ["rate<0.01"] },
};

export default function () {
    const url = "https://example.com/?r=" + Math.random();
    const res = http.post(`${__ENV.BASE_URL || "http://localhost:3000"}/api/shorten`, JSON.stringify({ url }), { headers: { "Content-Type": "application/json" } });
    check(res, { ok: (r) => r.status === 200 });
}