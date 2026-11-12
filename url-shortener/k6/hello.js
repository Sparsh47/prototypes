import http from "k6/http"
import { check, sleep } from 'k6'

const options = {
    vus: 1,
    duration: '10s'
};

export default function () {
    const res = http.get("http://localhost:3000/api/links");

    check(res, {
        "status is 200": (res) => res.status === 200
    });

    sleep(1);
}