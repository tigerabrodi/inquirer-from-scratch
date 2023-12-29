import * as readline from 'node:readline'

import chalk from 'chalk'

type Choice = {
  name: string
  value: string
}

export async function checkbox<Choices extends ReadonlyArray<Choice>>({
  message,
  choices,
}: {
  message: string
  choices: Choices
}): Promise<Array<Choices[number]['value']>> {
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

  const selectedIds = new Set<number>()
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
      if (selectedIds.has(index)) {
        if (index === highlightedId) {
          console.log(chalk.blueBright(`> [x] ${choice.name}`))
        } else {
          console.log(`[x] ${choice.name}`)
        }
      } else {
        if (index === highlightedId) {
          console.log(chalk.blueBright(`> [ ] ${choice.name}`))
        } else {
          console.log(`[ ] ${choice.name}`)
        }
      }
    })

    console.log('\n')
  }

  // Initial display
  displayChoices()

  return new Promise((resolve, reject) => {
    const keypressHandler = (str: string, key: readline.Key) => {
      const isExitKey = key.ctrl && key.name === 'c'
      const isUpKey = key.name === 'up'
      const isDownKey = key.name === 'down'
      const isReturnKey = key.name === 'return' // this is enter
      const isSpaceKey = key.name === 'space'

      if (isExitKey) {
        reject(new Error('Cancelled by user'))
      } else if (isUpKey) {
        highlightedId = (highlightedId - 1 + choices.length) % choices.length
        displayChoices()
      } else if (isDownKey) {
        highlightedId = (highlightedId + 1) % choices.length
        displayChoices()
      } else if (isSpaceKey) {
        if (selectedIds.has(highlightedId)) {
          selectedIds.delete(highlightedId)
        } else {
          selectedIds.add(highlightedId)
        }
        displayChoices()
      } else if (isReturnKey) {
        resolve(
          choices
            .filter((_, index) => selectedIds.has(index))
            .map((choice) => choice.value)
        )

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
