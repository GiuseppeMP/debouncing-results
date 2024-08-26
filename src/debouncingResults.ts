import _ from "underscore";

export class DeboucingConfig {
    debounceLimit: number = 10;
    debounceIntervalMs: number = 3000;
    timeoutMs: number = 30 * 1000;
}

/**
 * Executes a function with debouncing logic to ensure that the function is only called once within a specified time interval.
 * 
 * @param config - The configuration object containing debounceLimit, debounceIntervalMs, and timeoutMs.
 * @param func - The function to be executed with debouncing logic.
 * @param customMatcher - Optional custom function to compare results and determine if they are different.
 * 
 * @returns A Promise that resolves to an array of results from the function calls.
 */

export async function deboucingResults(config: DeboucingConfig, func: Function, customMatcher?: Function): Promise<any[]> {
    let { debounceLimit: debounceEnd, debounceIntervalMs, timeoutMs } = config
    let results = []
    let resultsStillDifferent = true
    let retries = 0
    let debCounter = 1

    while (debCounter <= debounceEnd) {

        results.push(await func())

        if (retries * debounceIntervalMs >= timeoutMs) {
            break;
        }

        if (results.length > 1) {

            if (customMatcher !== undefined) {
                resultsStillDifferent = !customMatcher(results[results.length - 1], results[results.length - 2])
            } else {
                resultsStillDifferent = !_.isEqual(results[results.length - 1], results[results.length - 2])
            }

            if (resultsStillDifferent) {
                debCounter = 2
            } else {
                debCounter++
            }
            waitProcess(debounceIntervalMs);
        } else {
            debCounter++
        }

        retries++
    }
    return results.pop()
}

/**
 * Delays the execution of the program for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to delay the program execution for.
 * @returns {void}
 */
function waitProcess(ms: number): void {
    const currentTime = new Date().getTime()
    // eslint-disable-next-line no-empty
    while (currentTime + ms >= new Date().getTime()) {
    }
}
