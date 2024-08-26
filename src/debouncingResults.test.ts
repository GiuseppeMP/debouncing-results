import { DeboucingConfig, deboucingResults } from './debouncingResults'

describe('Testing debouncingResults function with numbers.', () => {
    it('should debounce correctly four times and return 1.', async () => {
        const generateRandomNumbers = () => Math.floor(Math.random() * 1) + 1
        const config: DeboucingConfig = {
            debounceLimit: 3,
            debounceIntervalMs: 2000,
            timeoutMs: 40000,
        }
        const actual = await deboucingResults(config, generateRandomNumbers)
        expect(actual).toEqual(1)
    })
    it('should return the last value when a timeout occurs.', async () => {
        const generateRandomNumbers = () => Math.floor(Math.random() * 1) + 1
        const config: DeboucingConfig = {
            debounceLimit: 3,
            debounceIntervalMs: 2000,
            timeoutMs: 2000,
        }
        const actual = await deboucingResults(config, generateRandomNumbers)
        expect(actual).toEqual(1)
    })
    it('should debounce correctly 3 times and return 5.', async () => {
        const results = [5, 5, 5, 1, 1]
        const inputFunction = () => results.pop()
        const config: DeboucingConfig = {
            debounceLimit: 3,
            debounceIntervalMs: 2000,
            timeoutMs: 40000,
        }
        const actual = await deboucingResults(config, inputFunction)
        expect(actual).toEqual(5)
    })
})

describe('Testing debouncingResults function with strings.', () => {
    it('should debounce correctly 5 times and return abc.', async () => {
        const results = ['abc', 'abc', 'abc', 'a', 'b']
        const inputFunction = () => results.pop()
        const config: DeboucingConfig = {
            debounceLimit: 3,
            debounceIntervalMs: 2000,
            timeoutMs: 40000,
        }
        const actual = await deboucingResults(config, inputFunction)
        expect(actual).toEqual('abc')
    })
})

describe('Testing debouncingResults function with random types.', () => {
    it('should debounce correctly 5 times and return abc.', async () => {
        const results = ['abc', 'abc', 'abc', undefined, []]
        const inputFunction = () => results.pop()
        const config: DeboucingConfig = {
            debounceLimit: 3,
            debounceIntervalMs: 2000,
            timeoutMs: 40000,
        }
        const actual = await deboucingResults(config, inputFunction)
        expect(actual).toEqual('abc')
    })
})
