import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  ErrorScreen,
  Flex,
  Icon,
  LoadingScreen,
  Text
} from '@lifeforge/ui'

import { useCurrencies } from '../hooks/useCurrencies'
import type { ExchangeRates } from '../interfaces/currency_converter_interfaces'

interface ConversionResultProps {
  amount: number
  fromCurrency: string
  toCurrency: string
  result: number | null
  ratesData: ExchangeRates | null
  isLoading: boolean
  error: Error | null
  lastUpdated: string | null
}

function ConversionResult({
  amount,
  fromCurrency,
  toCurrency,
  result,
  ratesData,
  isLoading,
  error,
  lastUpdated
}: ConversionResultProps) {
  const { t } = useModuleTranslation()
  const { currencies } = useCurrencies()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorScreen message={error.message} />
  }

  return (
    <Box style={{ textAlign: 'center' }}>
      {ratesData && ratesData.rates && ratesData.rates[toCurrency] ? (
        <>
          <Flex centered gap="sm" wrap="wrap">
            <Flex centered gap="sm">
              <Icon
                icon={`circle-flags:${currencies.find(c => c.code === fromCurrency)?.country.toLowerCase()}`}
                mr="xs"
                size="1.5rem"
              />
              <Text size="3xl" weight="bold">
                {amount.toLocaleString()}
              </Text>
              <Text color="muted" size="3xl" weight="bold">
                {fromCurrency}
              </Text>
            </Flex>
            <Box mx="md" width={{ base: '100%', md: 'auto' }}>
              <Text size="3xl" weight="bold">
                =
              </Text>
            </Box>
            <Flex centered gap="sm">
              <Icon
                icon={`circle-flags:${currencies.find(c => c.code === toCurrency)?.country.toLowerCase()}`}
                mr="xs"
                size="1.5rem"
              />
              <Text size="3xl" weight="bold">
                {result?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                })}
              </Text>
              <Text color="muted" size="3xl" weight="bold">
                {toCurrency}
              </Text>
            </Flex>
          </Flex>
          <Box mt="md">
            <Text color="muted">
              1 {fromCurrency} = {ratesData.rates[toCurrency].toFixed(4)}{' '}
              {toCurrency} • {t('misc.updatedMsg')}{' '}
              {lastUpdated ||
                new Date(ratesData.timestamp * 1000).toLocaleTimeString()}
            </Text>
          </Box>
        </>
      ) : (
        <Text as="p" color="muted" py="md" size="xl">
          {toCurrency
            ? `Exchange rate for ${fromCurrency} to ${toCurrency} is not available`
            : 'No conversion data available'}
        </Text>
      )}
    </Box>
  )
}

export default ConversionResult
