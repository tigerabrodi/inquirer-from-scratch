import { input } from './input'

async function main() {
  const answer = await input()
  console.log('This is the answer: ', answer)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
