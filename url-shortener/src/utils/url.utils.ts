import crypto from "node:crypto";
import { env } from "../config/env.config.ts";

export function generateCode(length = 6): string {
    let code = '';
    for (let i = 0; i < length; i++) {
        code += env.ALPHABET.charAt(crypto.randomInt(env.ALPHABET.length));
    }
    return code;
}