import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Rate } from "k6/metrics";

const baseline_duration = new Trend('baseline_duration', true);
const baseline_failed = new Rate('baseline_failed');

export const options = {
    stages: [
        { duration: "1m", target: 5 },
        { duration: "2m", target: 5 },
        { duration: "1m", target: 10 },
        { duration: "2m", target: 10 },
        { duration: "1m", target: 25 },
        { duration: "2m", target: 25 },
        { duration: "1m", target: 50 },
        { duration: "2m", target: 50 },
        { duration: "1m", target: 0 },
    ],
    scenarios: {
        warmup: {
            executor: "constant-vus",
            vus: 1,
            duration: "30s",
            exec: "warmup"
        },
        baseline: {
            executor: "constant-vus",
            vus: 1,
            startTime: "30s",
            duration: "5m",
            exec: "measure"
        }
    },
    thresholds: {
        baseline_duration: [
            "p(50)<200",
            "p(95)<500",
            "p(99)<1000"
        ],
        baseline_failed: [
            "rate<0.01"
        ]
    }
}

function createShortUrl() {
    const payload = `www.example.com/${Math.random()}`
    return http.post("http://localhost:3000/api/shorten",
        JSON.stringify({ url: payload }), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export function warmup() {
    const res = createShortUrl();

    check(res, {
        "warmup: status is 201": (r) => r.status === 201,
    })

    sleep(0.2);
}

export function measure() {
    const res = createShortUrl();

    baseline_duration.add(res.timings.duration);
    baseline_failed.add(res.status !== 201);

    check(res, {
        "measure: status is 201": (r) => r.status === 201,
        "measure: response has body": (r) => r.body.length > 0,
        "measure: response body has shorturl": (r) => JSON.parse(r.body).short != null
    })

    sleep(0.2);
}