export const contract = {
  "getCurrencies": {
    "method": "get",
    "description": "Get supported currency codes",
    "noAuth": false,
    "encrypted": true,
    "isDownloadable": false,
    "media": null,
    "input": {},
    "output": {
      "OK": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    }
  },
  "getRatesHistory": {
    "method": "get",
    "description": "Get historical exchange rates",
    "noAuth": false,
    "encrypted": true,
    "isDownloadable": false,
    "media": null,
    "input": {
      "query": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "from": {
            "type": "string"
          },
          "to": {
            "type": "string"
          }
        },
        "required": [
          "from",
          "to"
        ],
        "additionalProperties": false
      }
    },
    "output": {
      "OK": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "date": {
              "type": "string"
            },
            "rate": {
              "type": "number"
            }
          },
          "required": [
            "date",
            "rate"
          ],
          "additionalProperties": false
        }
      }
    }
  }
} as const

export default contract
