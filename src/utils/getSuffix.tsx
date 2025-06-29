interface GetSuffixProps {
	withCallingCode: boolean
	withCurrency: boolean
	callingCode: string
	currency: string

	parentheses?: boolean
}

/***
 * Generates a suffix string based on the provided options.
 * @param {Object} props - The properties to determine the suffix.
 * @param {boolean} props.withCallingCode - Whether to include the calling code.
 * @param {boolean} props.withCurrency - Whether to include the currency.
 * @param {string} props.callingCode - The calling code to include if applicable.
 * @param {string} props.currency - The currency to include if applicable.
 * @returns {string} The formatted suffix string.
 ***/
export default function getSuffix({
	withCallingCode,
	withCurrency,
	callingCode,
	currency,

	parentheses = true,
}: GetSuffixProps): string {
	const p = (i: string): string => (parentheses ? `(${i})` : i)

	if (
		withCurrency &&
		currency?.length > 0 &&
		withCallingCode &&
		callingCode?.length > 0
	)
		return p(`+${callingCode}, ${currency}`)
	if (withCurrency && currency?.length > 0) return p(currency)
	if (withCallingCode && callingCode?.length > 0) return p(`+${callingCode}`)

	return ""
}
