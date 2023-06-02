import { ESLintUtils } from '@typescript-eslint/utils'
import { describe, it } from 'vitest'
import { dedent } from 'ts-dedent'

import rule, { RULE_NAME } from '../rules/sort-map-elements'
import { SortType, SortOrder } from '../typings'

describe(RULE_NAME, () => {
  let ruleTester = new ESLintUtils.RuleTester({
    parser: '@typescript-eslint/parser',
  })

  describe(`${RULE_NAME}: sorting by alphabetical order`, () => {
    let type = 'alphabetical-order'

    it(`${RULE_NAME}(${type}): does not break the property list`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              let routes = new Map([
                ['sign-in', '/auth/sign-in'],
                ['sign-up', '/auth/sign-up'],
                ...authErrors,
                ['reset-password', '/auth/reset-password'],
                ['sign-out', '/auth/sign-out'],
              ])
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              let map = new Map([
                ['products', '/products'],
                ['product', '/product/:id'],
                ...cartRouters,
                ['categories', '/categories'],
                ['category', '/categories/:id'],
                ['contacts', '/contacts'],
              ])
            `,
            output: dedent`
              let map = new Map([
                ['product', '/product/:id'],
                ['products', '/products'],
                ...cartRouters,
                ['categories', '/categories'],
                ['category', '/categories/:id'],
                ['contacts', '/contacts'],
              ])
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: "'products'",
                  second: "'product'",
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): not sorts spread elements`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              new Map([
                ...developers,
                ...designers,
              ])
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
          },
          {
            code: dedent`
              new Map([
                ...designers,
                ...developers,
              ])
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [],
      })
    })

    it(`${RULE_NAME}(${type}): works with variables as keys`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              new Map([
                [jessieName, jessieData],
                [raymondName, raymondData],
              ])
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              new Map([
                [raymondName, raymondData],
                [jessieName, jessieData],
              ])
            `,
            output: dedent`
              new Map([
                [jessieName, jessieData],
                [raymondName, raymondData],
              ])
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: 'raymondName',
                  second: 'jessieName',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): works with numbers as keys`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              new Map([
                [1, 'one'],
                [2, 'two'],
                [3, 'three'],
              ])
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              new Map([
                [2, 'two'],
                [1, 'one'],
                [3, 'three'],
              ])
            `,
            output: dedent`
              new Map([
                [1, 'one'],
                [2, 'two'],
                [3, 'three'],
              ])
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: '2',
                  second: '1',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): sorts variable identifiers`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              let apps = new Map([
                booksApp,
                mapsApp,
                musicApp,
                weatherApp,
              ])
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              let apps = new Map([
                mapsApp,
                booksApp,
                weatherApp,
                musicApp,
              ])
            `,
            output: dedent`
              let apps = new Map([
                booksApp,
                mapsApp,
                musicApp,
                weatherApp,
              ])
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: 'mapsApp',
                  second: 'booksApp',
                },
              },
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: 'weatherApp',
                  second: 'musicApp',
                },
              },
            ],
          },
        ],
      })
    })
  })

  describe(`${RULE_NAME}: sorting by natural order`, () => {
    let type = 'natural-order'

    it(`${RULE_NAME}(${type}): does not break the property list`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              let routes = new Map([
                ['sign-in', '/auth/sign-in'],
                ['sign-up', '/auth/sign-up'],
                ...authErrors,
                ['reset-password', '/auth/reset-password'],
                ['sign-out', '/auth/sign-out'],
              ])
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              let map = new Map([
                ['products', '/products'],
                ['product', '/product/:id'],
                ...cartRouters,
                ['categories', '/categories'],
                ['category', '/categories/:id'],
                ['contacts', '/contacts'],
              ])
            `,
            output: dedent`
              let map = new Map([
                ['product', '/product/:id'],
                ['products', '/products'],
                ...cartRouters,
                ['categories', '/categories'],
                ['category', '/categories/:id'],
                ['contacts', '/contacts'],
              ])
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: "'products'",
                  second: "'product'",
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): not sorts spread elements`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              new Map([
                ...developers,
                ...designers,
              ])
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
          },
          {
            code: dedent`
              new Map([
                ...designers,
                ...developers,
              ])
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [],
      })
    })

    it(`${RULE_NAME}(${type}): works with variables as keys`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              new Map([
                [jessieName, jessieData],
                [raymondName, raymondData],
              ])
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              new Map([
                [raymondName, raymondData],
                [jessieName, jessieData],
              ])
            `,
            output: dedent`
              new Map([
                [jessieName, jessieData],
                [raymondName, raymondData],
              ])
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: 'raymondName',
                  second: 'jessieName',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): works with numbers as keys`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              new Map([
                [1, 'one'],
                [2, 'two'],
                [3, 'three'],
              ])
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              new Map([
                [2, 'two'],
                [1, 'one'],
                [3, 'three'],
              ])
            `,
            output: dedent`
              new Map([
                [1, 'one'],
                [2, 'two'],
                [3, 'three'],
              ])
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: '2',
                  second: '1',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): sorts variable identifiers`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              let apps = new Map([
                booksApp,
                mapsApp,
                musicApp,
                weatherApp,
              ])
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              let apps = new Map([
                mapsApp,
                booksApp,
                weatherApp,
                musicApp,
              ])
            `,
            output: dedent`
              let apps = new Map([
                booksApp,
                mapsApp,
                musicApp,
                weatherApp,
              ])
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: 'mapsApp',
                  second: 'booksApp',
                },
              },
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: 'weatherApp',
                  second: 'musicApp',
                },
              },
            ],
          },
        ],
      })
    })
  })

  describe(`${RULE_NAME}: sorting by line length`, () => {
    let type = 'line-length-order'

    it(`${RULE_NAME}(${type}): does not break the property list`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              let routes = new Map([
                ['sign-in', '/auth/sign-in'],
                ['sign-up', '/auth/sign-up'],
                ...authErrors,
                ['reset-password', '/auth/reset-password'],
                ['sign-out', '/auth/sign-out'],
              ])
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              let map = new Map([
                ['products', '/products'],
                ['product', '/product/:id'],
                ...cartRouters,
                ['categories', '/categories'],
                ['category', '/categories/:id'],
                ['contacts', '/contacts'],
              ])
            `,
            output: dedent`
              let map = new Map([
                ['product', '/product/:id'],
                ['products', '/products'],
                ...cartRouters,
                ['category', '/categories/:id'],
                ['categories', '/categories'],
                ['contacts', '/contacts'],
              ])
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: "'products'",
                  second: "'product'",
                },
              },
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: "'categories'",
                  second: "'category'",
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): both key and value affect sorting by length`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              new Map([
                ['USD', 'United States dollar'],
                ['RUB', 'Russian ruble'],
                ['CNY', 'Renminbi'],
                ['GBP', 'Sterling'],
                ['EUR', 'Euro'],
              ])
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              new Map([
                ['EUR', 'Euro'],
                ['USD', 'United States dollar'],
              ])
            `,
            output: dedent`
              new Map([
                ['USD', 'United States dollar'],
                ['EUR', 'Euro'],
              ])
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: "'EUR'",
                  second: "'USD'",
                },
              },
            ],
          },
          {
            code: dedent`
              new Map([
                ['Europe', 'EUR'],
                ['United States', 'USD'],
              ])
            `,
            output: dedent`
              new Map([
                ['United States', 'USD'],
                ['Europe', 'EUR'],
              ])
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: "'Europe'",
                  second: "'United States'",
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): not sorts spread elements`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              new Map([
                ...developers,
                ...designers,
              ])
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
          },
          {
            code: dedent`
              new Map([
                ...designers,
                ...developers,
              ])
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
          },
        ],
        invalid: [],
      })
    })

    it(`${RULE_NAME}(${type}): works with variables as keys`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              new Map([
                [raymondName, raymondData],
                [jessieName, jessieData],
              ])
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              new Map([
                [jessieName, jessieData],
                [raymondName, raymondData],
              ])
            `,
            output: dedent`
              new Map([
                [raymondName, raymondData],
                [jessieName, jessieData],
              ])
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: 'jessieName',
                  second: 'raymondName',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): works with numbers as keys`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              new Map([
                [3, 'three'],
                [1, 'one'],
                [2, 'two'],
              ])
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              new Map([
                [2, 'two'],
                [1, 'one'],
                [3, 'three'],
              ])
            `,
            output: dedent`
              new Map([
                [3, 'three'],
                [1, 'one'],
                [2, 'two'],
              ])
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: '1',
                  second: '3',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): sorts variable identifiers`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              let apps = new Map([
                weatherApp,
                booksApp,
                musicApp,
                mapsApp,
              ])
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              let apps = new Map([
                mapsApp,
                booksApp,
                weatherApp,
                musicApp,
              ])
            `,
            output: dedent`
              let apps = new Map([
                weatherApp,
                musicApp,
                booksApp,
                mapsApp,
              ])
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: 'mapsApp',
                  second: 'booksApp',
                },
              },
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: 'booksApp',
                  second: 'weatherApp',
                },
              },
            ],
          },
        ],
      })
    })
  })

  describe(`${RULE_NAME}: misc`, () => {
    it(`${RULE_NAME}: sets alphabetical asc sorting as default`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          dedent`
              new Map([
                ['CNY', 'Renminbi'],
                ['EUR', 'Euro'],
                ['GBP', 'Sterling'],
                ['RUB', 'Russian ruble'],
                ['USD', 'United States dollar'],
              ])
            `,
        ],
        invalid: [
          {
            code: dedent`
              new Map([
                ['CNY', 'Renminbi'],
                ['RUB', 'Russian ruble'],
                ['USD', 'United States dollar'],
                ['EUR', 'Euro'],
                ['GBP', 'Sterling'],
              ])
            `,
            output: dedent`
              new Map([
                ['CNY', 'Renminbi'],
                ['EUR', 'Euro'],
                ['GBP', 'Sterling'],
                ['RUB', 'Russian ruble'],
                ['USD', 'United States dollar'],
              ])
            `,
            errors: [
              {
                messageId: 'unexpectedMapElementsOrder',
                data: {
                  first: "'USD'",
                  second: "'EUR'",
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}: works with empty map`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: ['new Map([[], []])'],
        invalid: [],
      })
    })
  })
})
