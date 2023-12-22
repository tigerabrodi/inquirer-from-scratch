import * as readline from 'node:readline/promises'

export async function input({ message }: { message: string }) {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const answer = await readlineInterface.question(`${message} `)

  readlineInterface.close()

  return answer
}
