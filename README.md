<h1 align="center">Welcome to Deboucing Results</h1>
<p>
The `ts-deboucing-results` is a TypeScript library that applies debouncing principles to ensure response stability and consistency. It waits for the result to remain unchanged for a specified period before returning, providing a reliable and consistent output for your applications.
</p>

## TL;DR

**Why?**

Sometimes we need to consume an external service that is still running, but every time we call it, its results may change.

To determine when the task is complete, you can utilize this library to efficiently call the asynchronous function multiple times until its response remains unchanged.

I am using this library to gather logs from a downstream service execution. I am unable to determine if the downstream has finished and if the logs are complete. Therefore, I debounce the response multiple times until the logs remain unchanged. At that point, I safely assume that the downstream has finished.

## Features

```js
deboucingResults
(config: DeboucingConfig, func: Function, customMatcher?: Function):
Promise<any[]>
```

**DeboucingConfig**

```js
    const config: DeboucingConfig = {
        debounceLimit: 3,
        debounceIntervalMs: 2000,
        timeoutMs: 40000,
    }
```

**debounceLimit**: how many times the function should be called before returning.
**debounceIntervalMs**: how many milliseconds the function should wait before calling it again.
**timeoutMs**: how long the deboucing function should wait before timing out.
*

**func**: the function to be debounced. It should return a promise that resolves to the result of the function call.
**customMatcher**: an optional function that can be used to determine if the result is unchanged. If the function returns true, the result will not be debounced. internally use `_.isEqual` from `underscore`.

## Install

```sh
npm i ts-deboucing-results
```

## Usage

```js
import { DeboucingConfig, deboucingResults } from 'ts-deboucing-results'
```

**Testing Example**

```js 
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
```



