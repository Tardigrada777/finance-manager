/**
 * Match queries like: <type> <amount> <category>
 *
 * Examples:
 *
 * ```
 * + 5676 Bread
 * ```
 * ```
 * - 445 Taxi
 * ```
 */
export const SAVE_TRANSACTION_QUERY = /[+,-]\s\d+\s\w+/gm;
