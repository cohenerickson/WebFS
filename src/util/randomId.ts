import { FSProvider } from "../classes/FSProvider";

export function randomId(): number {
  return Math.ceil(Math.random() * Number.MIN_SAFE_INTEGER);
}