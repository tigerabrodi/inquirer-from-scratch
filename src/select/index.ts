import { select } from './select'

async function main() {
  const color = await select({
    message: "What's your favorite color?",
    choices: [
      {
        name: 'red',
        value: 'red',
        description: 'red is a color',
      },
      {
        name: 'blue',
        value: 'blue',
        description: 'blue is a color',
      },
      {
        name: 'green',
        value: 'green',
        description: 'green is a color',
      },
    ],
  })

  console.log(`You chose ${color}`)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
