import { input } from './input'

async function main() {
  const firstName = await input({ message: "What's your first name?" })
  const lastName = await input({ message: "What's your last name?" })
  const age = await input({ message: "What's your age?" })

  console.log(`Hello ${firstName} ${lastName}! You are ${age} years old.`)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
