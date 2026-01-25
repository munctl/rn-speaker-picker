import { CountryProvider, DEFAULT_COUNTRY_CONTEXT } from "./CountryContext"
import { CountryPicker, CountryPickerProps } from "./CountryPicker"
import { TranslationLanguageCode } from "./types"
import "./assets/global.css"

type Props = CountryPickerProps & {
	translation?: TranslationLanguageCode
}

/***
 * Main component for the Speaker Picker library.
 ***/
function Main({
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

export default Main
export const SpeakerPicker = Main

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
