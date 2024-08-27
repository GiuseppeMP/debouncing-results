<h1 align="center">Welcome to Deboucing Results! 👐</h1>

The `ts-deboucing-results` is a library that applies debouncing principles to ensure response stability and consistency.  

It waits for the result to remain unchanged for a specified period before returning, then you can safely assume that the result is
stable and consistent.  

Use it to debounce your asynchronous functions that may change their results over time, such as consuming logs.

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

**func**: the function to be debounced. It should return a promise that resolves to the result of the function call.  

**customMatcher**: an optional function that can be used to determine if the result is unchanged. Internally use `_.isEqual` from `underscore` to compare the results.

## Install

```sh
npm i ts-deboucing-results
```

## Usage

```js
import { DeboucingConfig, deboucingResults } from 'ts-deboucing-results'
```


### **Testing Example**  

In this example, every time you call the input function, it executes a pop in the results list. It only returns when the result is the same 3 times (debounceLimit).

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

And if you change the debounceLimit to 2 the return should be 1:

```js
    it('should debounce correctly 2 times and return 1.', async () => {
        const results = [5, 5, 5, 1, 1]
        const inputFunction = () => results.pop()
        const config: DeboucingConfig = {
            debounceLimit: 2,
            debounceIntervalMs: 2000,
            timeoutMs: 40000,
        }
        const actual = await deboucingResults(config, inputFunction)
        expect(actual).toEqual(1)
    })
```


### **Real scenarios**

In this example, the axios.get will execute until its result remains the same for 3 consecutive times due to `debounceLimit: 3`. If this does not happen, it will return the last result obtained before the timeout.

```js
        const apiCall = async () => axios.get(...)
        const config: DeboucingConfig = {
            debounceLimit: 3,
            debounceIntervalMs: 2000,
            timeoutMs: 40000,
        }
        const data = await deboucingResults(config, apiCall)
```
