import { useQuery } from '@tanstack/react-query'
import {
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'

import {
  Box,
  Button,
  Flex,
  Icon,
  ListboxInput,
  ListboxOption,
  Text,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import { CURRENCIES } from '../constants/currencies'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function ConversionRatesHistoryGraph() {
  const { derivedThemeColor: themeColor } = usePersonalization()
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('MYR')
  const currenciesQuery = useQuery(forgeAPI.getCurrencies.queryOptions())

  const historyQuery = useQuery(
    forgeAPI.getRatesHistory
      .input({ from: fromCurrency, to: toCurrency })
      .queryOptions({
        enabled: !!fromCurrency && !!toCurrency && fromCurrency !== toCurrency
      })
  )

  const supportedCurrencies = currenciesQuery.data ?? []

  const chartData: ChartData<'line'> = useMemo(() => {
    if (!historyQuery.data) {
      return { labels: [], datasets: [] }
    }

    return {
      labels: historyQuery.data.map(entry =>
        new Date(entry.date).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short'
        })
      ),
      datasets: [
        {
          label: `${fromCurrency} to ${toCurrency}`,
          data: historyQuery.data.map(entry => entry.rate),
          borderColor: themeColor,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: themeColor,
          pointHoverBorderColor: themeColor,
          lineTension: 0.4
        }
      ]
    }
  }, [historyQuery.data, fromCurrency, toCurrency, themeColor])

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          displayColors: false
        }
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 6
        }
      },
      scales: {
        x: {
          grid: {
            lineWidth: 0
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 12
          }
        },
        y: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 7
          }
        }
      },
      hover: {
        mode: 'index',
        intersect: false
      }
    }),
    []
  )

  return (
    <>
      <Flex
        centered
        direction={{ base: 'column', sm: 'row' }}
        gap="sm"
        width="100%"
      >
        <ListboxInput
          icon="tabler:arrow-up"
          label="From"
          renderContent={() => (
            <Flex align="center" gap="sm">
              {CURRENCIES[fromCurrency] && (
                <Icon
                  icon={`circle-flags:${CURRENCIES[fromCurrency][3].toLowerCase()}`}
                />
              )}
              <Text>
                {fromCurrency} - {CURRENCIES[fromCurrency]?.[0]}
              </Text>
            </Flex>
          )}
          value={fromCurrency}
          onChange={setFromCurrency}
        >
          {supportedCurrencies.map(code => (
            <ListboxOption
              key={code}
              icon={
                <Icon
                  icon={`circle-flags:${CURRENCIES[code]?.[3].toLowerCase()}`}
                />
              }
              label={`${code} - ${CURRENCIES[code]?.[0] || ''}`}
              value={code}
            />
          ))}
        </ListboxInput>
        <Button
          icon="tabler:arrows-exchange"
          width={{ base: '100%', sm: 'auto' }}
          onClick={() => {
            setFromCurrency(toCurrency)
            setToCurrency(fromCurrency)
          }}
        />
        <ListboxInput
          icon="tabler:arrow-down"
          label="To"
          renderContent={() => (
            <Flex align="center" gap="sm">
              {CURRENCIES[toCurrency] && (
                <Icon
                  icon={`circle-flags:${CURRENCIES[toCurrency][3].toLowerCase()}`}
                />
              )}
              <Text>
                {toCurrency} - {CURRENCIES[toCurrency]?.[0]}
              </Text>
            </Flex>
          )}
          value={toCurrency}
          onChange={setToCurrency}
        >
          {supportedCurrencies.map(code => (
            <ListboxOption
              key={code}
              icon={
                <Icon
                  icon={`circle-flags:${CURRENCIES[code]?.[3].toLowerCase()}`}
                />
              }
              label={`${code} - ${CURRENCIES[code]?.[0] || ''}`}
              value={code}
            />
          ))}
        </ListboxInput>
      </Flex>

      <Box flex="1" minHeight="16rem" mt="md" position="relative">
        {historyQuery.isLoading ? (
          <Flex centered height="100%" width="100%">
            <Box className="loader" />
          </Flex>
        ) : (
          Object.keys(chartData).length > 0 && (
            <Box height="100%">
              <Line data={chartData} options={options as any} />
            </Box>
          )
        )}
      </Box>
    </>
  )
}
