import { ReactNode } from "react"
import { FlatListProps, ModalProps, StyleProp, ViewStyle } from "react-native"
import { CountryProvider, DEFAULT_COUNTRY_CONTEXT } from "./CountryContext"
import { CountryFilterProps } from "./CountryFilter"
import { CountryPicker, TriggerProps } from "./CountryPicker"
import { DEFAULT_THEME, Theme, ThemeProvider } from "./CountryTheme"
import { FlagButtonProps } from "./FlagButton"
import {
	Country,
	CountryCode,
	Region,
	Subregion,
	TranslationLanguageCode,
} from "./types"

interface Props {
	trigger?: TriggerProps
	countryCode: CountryCode
	region?: Region
	subregion?: Subregion
	countryCodes?: CountryCode[]
	excludeCountries?: CountryCode[]
	preferredCountries?: CountryCode[]
	theme?: Theme
	translation?: TranslationLanguageCode
	modalProps?: ModalProps
	filterProps?: CountryFilterProps
	flatListProps?: FlatListProps<Country>
	placeholder?: string
	withAlphaFilter?: boolean
	withCallingCode?: boolean
	withCurrency?: boolean
	withEmoji?: boolean
	withCountryNameButton?: boolean
	withCurrencyButton?: boolean
	withCallingCodeButton?: boolean
	withCloseButton?: boolean
	withFlagButton?: boolean
	withFilter?: boolean
	withFlag?: boolean
	withModal?: boolean
	disableNativeModal?: boolean
	visible?: boolean
	containerButtonStyle?: StyleProp<ViewStyle>
	additional?: Country[]
	renderFlagButton?(props: FlagButtonProps): ReactNode
	renderCountryFilter?(props: CountryFilterProps): ReactNode
	onSelect(country: Country): void
	onOpen?(): void
	onClose?(): void
}

export default function Main({ theme, translation, ...props }: Props) {
	return (
		<ThemeProvider theme={{ ...DEFAULT_THEME, ...theme }}>
			<CountryProvider value={{ ...DEFAULT_COUNTRY_CONTEXT, translation }}>
				<CountryPicker {...props} />
			</CountryProvider>
		</ThemeProvider>
	)
}

Main.defaultProps = {
	onSelect: () => {},
	withEmoji: true,
}

export { CountryFilter } from "./CountryFilter"
export { CountryList } from "./CountryList"
export { CountryModal } from "./CountryModal"
export { CountryModalProvider } from "./CountryModalProvider"
export {
	getCountriesAsync as getAllCountries,
	getCountryCallingCodeAsync as getCallingCode,
} from "./CountryService"
export { DARK_THEME, DEFAULT_THEME } from "./CountryTheme"
export { Flag } from "./Flag"
export { FlagButton } from "./FlagButton"
export { ModalHeader } from "./v2/ModalHeader"
export * from "./types"
