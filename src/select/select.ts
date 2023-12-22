import * as readline from 'node:readline'

import chalk from 'chalk'

type Choice = {
  name: string
  value: string
  description: string
}

export async function select<Choices extends Array<Choice>>({
  message,
  choices,
}: {
  message: string
  choices: Choices
  // Choices[number]['value'] is a TypeScript way to infer the type of the value property from the elements of the Choices array. It tells TypeScript to look at the type of value in each element (Choice) of the array and use that as the return type for the promise.
}): Promise<Choices[number]['value']> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  // Make the stdin emit keypress events, otherwise it won't emit them
  readline.emitKeypressEvents(process.stdin, rl)

  // `process.stdin.isTTY` is true if the stdin is a terminal
  if (process.stdin.isTTY) {
    // set the terminal in raw mode, so that we can capture the input for all keys
    process.stdin.setRawMode(true)
  }

  let highlightedId = 0

  // Display the choices
  const displayChoices = () => {
    // clear the terminal, both needed for the initial display and when the user presses up/down
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)

    // display the message
    console.log(message)

    console.log('\n')

    // display the choices
    choices.forEach((choice, index) => {
      if (index === highlightedId) {
        console.log(chalk.blueBright(`> ${choice.name}`))
      } else {
        console.log(`  ${choice.name}`)
      }
    })

    console.log('\n')

    // display the description
    console.log(choices[highlightedId].description)
  }

  // Initial display
  displayChoices()

  return new Promise((resolve, reject) => {
    const keypressHandler = (str: string, key: readline.Key) => {
      const isExitKey = key.ctrl && key.name === 'c'
      const isUpKey = key.name === 'up'
      const isDownKey = key.name === 'down'
      const isReturnKey = key.name === 'return' // this is enter

      if (isExitKey) {
        reject(new Error('Cancelled by user'))
      } else if (isUpKey) {
        // Determine the previous highlightedId in circular fashion
        // Suppose choices.length = 4, and the current highlightedId = 0
        // 0 - 1 = -1
        // -1 + 4 = 3
        // 3 is the previous highlightedId which is the last choice
        highlightedId = (highlightedId - 1 + choices.length) % choices.length
        displayChoices()
      } else if (isDownKey) {
        // Determine the next highlightedId in circular fashion
        // Suppose choices.length = 4, and the current highlightedId = 3
        // 3 + 1 = 4
        // 4 % 4 = 0
        // 0 is the next highlightedId which is the first choice
        highlightedId = (highlightedId + 1) % choices.length
        displayChoices()
      } else if (isReturnKey) {
        resolve(choices[highlightedId].value)

        // cleanup the event listener
        process.stdin.off('keypress', keypressHandler)

        if (process.stdin.isTTY) {
          // restore the terminal settings
          process.stdin.setRawMode(false)
        }

        // close the readline interface, we are done with it
        rl.close()
      }
    }

    process.stdin.on('keypress', keypressHandler)
  })
}
