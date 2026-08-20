import { getDitatToken } from "./lib/getDitatToken"

(async () => {
  const token = await getDitatToken();

  console.log(token)
})()
