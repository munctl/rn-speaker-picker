import { ReactNode } from "react"
import { CountryCode } from "../../types"

export interface TriggerProps {
	render?: (arg0: TriggerProps) => ReactNode
	onOpen?: () => void

	wrapperClassName?: string
	textClassName?: string
	flagSize?: number

	withCountryName?: boolean
	withFlag?: boolean
	withCallingCode?: boolean
	withCurrency?: boolean

	placeholder?: string
	countryCode?: CountryCode
}
