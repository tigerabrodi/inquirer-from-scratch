import * as readline from 'node:readline/promises'

export async function confirm({ message }: { message: string }) {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const answer = await readlineInterface.question(`${message} (y/n)`)

  readlineInterface.close()

  return answer === 'y'
}
