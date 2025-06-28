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
	if (!withCallingCode && !withCurrency) return ""
	if (withCurrency && withCallingCode) return `(+${callingCode}, ${currency})`
	return withCallingCode ? `(+${callingCode})` : `(${currency})`
}
