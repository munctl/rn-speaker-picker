interface GetSuffixProps {
	withCallingCode: boolean
	withCurrency: boolean
	callingCode: string
	currency: string
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
}: GetSuffixProps): string {
	if (
		withCurrency &&
		currency.length > 0 &&
		withCallingCode &&
		callingCode.length > 0
	)
		return `(+${callingCode}, ${currency})`
	if (withCurrency && currency.length > 0) return `(${currency})`
	if (withCallingCode && callingCode.length > 0) return `(+${callingCode})`
	return ""
}
