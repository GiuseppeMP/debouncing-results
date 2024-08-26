export class DeboucingConfig {
    debounceStart: number = 0;
    debounceEnd: number = 10;
    maxRetries: number = 5;
    debounceIntervalMs: number = 3000;
    timeoutMs: number = 30 * 1000;
}

export async function deboucingResults(config: DeboucingConfig, func: Function, customMatcher?: Function): Promise<any[]> {
    const { debounceStart: debStart, debounceEnd, maxRetries, debounceIntervalMs, timeoutMs } = config
    let results = []
    let resultsStillDifferent = true
    let retries = 0
    let debCounter = debStart

    while (resultsStillDifferent && retries < maxRetries) {

        results.push(await func())

        if (results.length > 1) {
            if (!areEqualLists(results[results.length - 1], results[results.length - 2])) {
                debCounter = debStart
            } else {
                debCounter++
                if (debCounter >= debounceEnd) {

                }
            }
            waitProcess(debounceIntervalMs);
        }
        retries++
    }
    return results.pop()
}

const entriesEqual = (e1: { [x: string]: any }, e2: { [x: string]: any }) => Object.keys(e1).length === Object.keys(e2).length && Object.keys(e1).every(pairs => e1[pairs] === e2[pairs]);

function areEqualLists(list1: any[], list2: any[]) {
    if (list1.length !== list2.length) {
        return false
    }
    for (const element of list1) {
        if (list2.find(e => entriesEqual(e, element)) === undefined) {
            return false
        }
    }
    return true
}

/**
 * Delays the execution of the program for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to delay the program execution for.
 * @returns {void}
 */
export function waitProcess(ms: number): void {
    const currentTime = new Date().getTime()
    // eslint-disable-next-line no-empty
    while (currentTime + ms >= new Date().getTime()) {
    }
}
