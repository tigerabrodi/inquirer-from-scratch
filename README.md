# Inquirer from scratch

Building Inquirer from scratch.

## TODO

- [x] input
- [x] select
- [ ] checkbox
- [ ] confirm
- [ ] password

## Run it

Clone it.

`npm install`.

more info coming soon

## Background information

I had a great experience with Inquirer. Got curious how it worked under the hood. Select function especially was way more tougher than I thought.

## Reflection and Learnings

The Select function was much harder than expected. Many of the things were new to me. It was really interesting though. I want to one day build my own text editor as a practice. This exposed me to some low level stuff when dealing with the terminal.

- `Promise<Choices[number]['value']>` - This return type tells TypeScript to look at the type of value in each element (Choice) of the array and use that as the return type for the promise.
- `process.stdin` - This is a readable stream. It is a stream of data coming into the program. In this case, it is the user input from the terminal.
- `process.stdout` - This is a writable stream. It is a stream of data going out of the program. In this case, it is the output to the terminal.
- `emitKeypressEvents` - We have to do this for the `process.stdin` to emit keypress events.
- `process.stdin.isTTY` - This is a boolean that tells us if the program is running in a terminal.
- `process.stdin.setRawMode` - This is a function that sets the terminal to raw mode.
- **Without Raw Mode:** Normally, the terminal waits for the user to press Enter before it sends their input to your program. This is called "cooked" or "canonical" mode.
- **With Raw Mode:** When setRawMode(true) is set, the terminal sends each keystroke directly to your program as it's typed, without waiting for Enter. This allows your program to react to each key press in real-time, which is useful for interactive applications like command-line games, text editors, or custom prompts.
- `cursorTo` - This function moves the cursor to a specific position in the terminal. `readline.cursorTo(stream, x, y)`
- `clearScreenDown` - This function clears the screen from the current position of the cursor to the end of the screen. `readline.clearScreenDown(stream)`
- The reason we do `process.stdin.on('keypress', keypressHandler)` is to attach an event listener to the `process.stdin` stream. This is how we get the user input. This would not work if we didn't do `emitKeypressEvents` and `process.stdin.setRawMode(true)`. `emitKeypressEvents` is what allows the `process.stdin` stream to emit keypress events. `process.stdin.setRawMode(true)` is what allows the `process.stdin` stream to emit keypress events without waiting for the user to press Enter.
- Interestingly, similar to JavaScript browser stuff, we need to detach the listener when done `process.stdin.off`.
- `rl.close()` - This closes the readline interface, which means we are done with the prompt. This is how we exit asking the user for input.

## Circular calculation

```js
// Determine the previous highlightedId in circular fashion
// Suppose choices.length = 4, and the current highlightedId = 0
// 0 - 1 = -1
// -1 + 4 = 3
// 3 is the previous highlightedId which is the last choice
highlightedId = (highlightedId - 1 + choices.length) % choices.length // up calculation
displayChoices()

// Determine the next highlightedId in circular fashion
// Suppose choices.length = 4, and the current highlightedId = 3
// 3 + 1 = 4
// 4 % 4 = 0
// 0 is the next highlightedId which is the first choice
highlightedId = (highlightedId + 1) % choices.length // down calculation
```

## Select function demo

https://github.com/narutosstudent/inquirer-from-scratch/assets/49603590/19fbcaef-7c77-4dd7-8041-b5612f9d277f
