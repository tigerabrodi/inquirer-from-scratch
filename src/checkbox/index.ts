import { checkbox } from './checkbox'

async function main() {
  const colors = await checkbox({
    message: "What's your favorite color?",
    choices: [
      {
        name: 'red',
        value: 'red',
      },
      {
        name: 'blue',
        value: 'blue',
      },
      {
        name: 'green',
        value: 'green',
      },
    ] as const,
  })

  console.log(`You chose ${colors.join(', ')}`)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
