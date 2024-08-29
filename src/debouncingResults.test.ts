import _ from 'underscore'
import { DeboucingConfig, deboucingResults } from './debouncingResults'

describe('Testing DebouncingConfig', () => {
    it('should have default values', () => {
        const config = new DeboucingConfig()
        expect(config.debounceLimit).toEqual(3)
        expect(config.debounceIntervalMs).toEqual(2 * 1000)
        expect(config.timeoutMs).toEqual(30 * 1000)
    })
})

describe('Testing debouncingResults function with numbers.', () => {
    it('should debounce correctly four times and return 1.', async () => {
        const generateRandomNumbers = () => Math.floor(Math.random() * 1) + 1
        const config: DeboucingConfig = {
            debounceLimit: 3,
            debounceIntervalMs: 2000,
            timeoutMs: 40000,
        }
        const actual = await deboucingResults(config, generateRandomNumbers)
        expect(actual.result).toEqual(1)
    })
    it('should debounce correctly three times and return 1 using custom matcher.', async () => {
        const generateRandomNumbers = () => Math.floor(Math.random() * 1) + 1
        const matcher = (n: any, prev: any) => n === prev
        const config: DeboucingConfig = {
            debounceLimit: 3,
            debounceIntervalMs: 2000,
            timeoutMs: 40000,
        }
        const actual = await deboucingResults(config, generateRandomNumbers, matcher)
        expect(actual.result).toEqual(1)
    })
    it('should return the last value when a timeout occurs.', async () => {
        const generateRandomNumbers = () => Math.floor(Math.random() * 1) + 1
        const config: DeboucingConfig = {
            debounceLimit: 3,
            debounceIntervalMs: 2000,
            timeoutMs: 2000,
        }
        const actual = await deboucingResults(config, generateRandomNumbers)
        expect(actual.result).toEqual(1)
    })
    it('should debounce correctly 2 times and return 1.', async () => {
        const results = [5, 5, 5, 1, 1]
        const inputFunction = () => results.pop()
        const config: DeboucingConfig = {
            debounceLimit: 2,
            debounceIntervalMs: 2000,
            timeoutMs: 40000,
        }
        const actual = await deboucingResults(config, inputFunction)
        expect(actual.result).toEqual(1)
        expect(actual.allResults).toHaveLength(2)
        expect(actual.allResults).toStrictEqual([1, 1])
        expect(actual.retries).toEqual(2)
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
        expect(actual.result).toEqual(5)
        expect(actual.allResults).toHaveLength(5)
        expect(actual.allResults).toStrictEqual([1, 1, 5, 5, 5])
        expect(actual.retries).toEqual(5)
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
        expect(actual.result).toEqual('abc')
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
        expect(actual.result).toEqual('abc')
    })
})
