interface GetSuffixProps {
	withCallingCode: boolean
	withCurrency: boolean
	callingCode: string
	currency: string
}

export default function getSuffix({
	withCallingCode,
	withCurrency,
	callingCode,
	currency,
}: GetSuffixProps) {
	if (
		withCurrency &&
		currency.length > 0 &&
		withCallingCode &&
		callingCode.length > 0
	)
		return `(+${callingCode}, ${currency})`
	if (withCurrency && currency.length > 0) return `(${currency})`
	if (withCallingCode && callingCode.length > 0) return `(${callingCode})`
	return ""
}
