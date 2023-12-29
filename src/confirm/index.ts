import { confirm } from './confirm'

async function main() {
  const shouldContinue = await confirm({ message: 'Continue?' })

  if (shouldContinue) {
    console.log('Continuing...')
  } else {
    console.log('Exiting...')
    process.exit(0)
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
