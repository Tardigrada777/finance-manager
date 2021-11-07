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
export const SAVE_TRANSACTION_QUERY = /[+,-]\s\d+\s([^\x00-\x7F]|\w)+/gm;

/**
 * Match query:
 *
 * ```
 * "/archivate"
 * ```
 */
export const ARCHIVATE_QUERY = /\/archivate/gm;
