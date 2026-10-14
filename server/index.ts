import z from 'zod'

import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import forge from './forge'

const getCurrencies = forge
  .query({
    description: 'Get supported currency codes',
    output: {
      OK: z.array(z.string())
    }
  })
  .callback(async ({ response }) => {
    const res = await fetch('https://api.frankfurter.app/currencies')

    const data = await res.json()

    return response.ok(Object.keys(data))
  })

const getRatesHistory = forge
  .query({
    description: 'Get historical exchange rates',
    input: {
      query: z.object({
        from: z.string(),
        to: z.string()
      })
    },
    output: {
      OK: z.array(
        z.object({
          date: z.string(),
          rate: z.number()
        })
      )
    }
  })
  .callback(async ({ query: { from, to }, response }) => {
    const res = await fetch(
      `https://api.frankfurter.app/1999-01-04..?from=${from}&to=${to}`
    )

    const data = await res.json()

    const entries = Object.entries(data.rates).map(([date, rates]) => ({
      date,
      rate: Object.values(rates as Record<string, number>)[0] ?? 0
    }))

    return response.ok(entries)
  })

const routes = forgeRouter({
  getCurrencies,
  getRatesHistory
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
