import { Box, Button, ComboboxInput, ComboboxOption, Flex } from '@lifeforge/ui'

import { useCurrencies } from '../hooks/useCurrencies'
import type { Currency } from '../interfaces/currency_converter_interfaces'

interface CurrencySelectorProps {
  currencies: Currency[]
  fromCurrency: string
  toCurrency: string
  setFromCurrency: (currency: string) => void
  setToCurrency: (currency: string) => void
  handleSwapCurrencies: () => void
}

function CurrencySelector({
  currencies,
  fromCurrency,
  toCurrency,
  setFromCurrency,
  setToCurrency,
  handleSwapCurrencies
}: CurrencySelectorProps) {
  const { filteredCurrencies, setQueries } = useCurrencies()

  return (
    <Flex
      align="center"
      direction={{ base: 'column', sm: 'row' }}
      gap="sm"
      mb="lg"
    >
      <Box width="100%">
        <ComboboxInput
          displayValue={value => {
            const currency = currencies.find(c => c.code === value)

            return currency ? `${currency.code} - ${currency.name}` : ''
          }}
          icon="tabler:arrow-up"
          label="From"
          value={fromCurrency}
          onChange={setFromCurrency}
          onQueryChanged={setQueries.from}
        >
          {filteredCurrencies.from.map(currency => (
            <ComboboxOption
              key={currency.code}
              label={`${currency.code} - ${currency.name}`}
              value={currency.code}
            />
          ))}
        </ComboboxInput>
      </Box>

      <Button
        icon="tabler:arrows-exchange"
        width={{ base: '100%', sm: 'auto' }}
        onClick={handleSwapCurrencies}
      />

      <Box width="100%">
        <ComboboxInput
          displayValue={value => {
            const currency = currencies.find(c => c.code === value)

            return currency ? `${currency.code} - ${currency.name}` : ''
          }}
          icon="tabler:arrow-down"
          label="To"
          value={toCurrency}
          onChange={setToCurrency}
          onQueryChanged={setQueries.to}
        >
          {filteredCurrencies.to.map(currency => (
            <ComboboxOption
              key={currency.code}
              label={`${currency.code} - ${currency.name}`}
              value={currency.code}
            />
          ))}
        </ComboboxInput>
      </Box>
    </Flex>
  )
}

export default CurrencySelector
