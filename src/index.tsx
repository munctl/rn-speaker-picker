import { ReactNode } from "react"
import { FlatListProps, ModalProps, StyleProp, ViewStyle } from "react-native"
import { CountryProvider, DEFAULT_COUNTRY_CONTEXT } from "./CountryContext"
import { CountryFilterProps } from "./v2/modal/SearchElement"
import { CountryPicker } from "./CountryPicker"
import {
	Country,
	CountryCode,
	Region,
	Subregion,
	TranslationLanguageCode,
} from "./types"
import { TriggerProps } from "./v2/types/Props"

interface Props {
	trigger?: TriggerProps
	countryCode?: CountryCode
	region?: Region
	subregion?: Subregion
	countryCodes?: CountryCode[]
	excludeCountries?: CountryCode[]
	preferredCountries?: CountryCode[]
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
	renderCountryFilter?(props: CountryFilterProps): ReactNode
	onSelect(country: Country): void
	onOpen?(): void
	onClose?(): void
}

export default function Main({
	translation,
	onSelect = () => {},
	...props
}: Props) {
	return (
			<CountryProvider value={{ ...DEFAULT_COUNTRY_CONTEXT, translation }}>
				<CountryPicker {...{ onSelect, ...props }} />
			</CountryProvider>
	)
}

export { SearchElement } from "./v2/modal/SearchElement"
export { SpeakerList } from "./v2/modal/list/SpeakerList"
export { CountryModal } from "./v2/modal/CountryModal"
export { CountryModalProvider } from "./v2/modal/CountryModalProvider"
export {
	getCountriesAsync as getAllCountries,
	getCountryCallingCodeAsync as getCallingCode,
} from "./v2/CountryService"
export { Flag } from "./Flag"
export { FlagButton } from "./v2/trigger/FlagButton"
export { ModalHeader } from "./v2/modal/ModalHeader"
export * from "./types"
