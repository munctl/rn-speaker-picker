import { createContext, useContext as uc } from "react"
import {
	getCountriesAsync,
	getCountryCallingCodeAsync,
	getCountryCurrencyAsync,
	getCountryInfoAsync,
	getCountryNameAsync,
	getImageFlagAsync,
	getLetters,
	search,
} from "./v2/CountryService"
import { TranslationLanguageCode } from "./types"

export interface CountryContextParam {
	translation?: TranslationLanguageCode
	getCountryNameAsync: typeof getCountryNameAsync
	getImageFlagAsync: typeof getImageFlagAsync
	getCountriesAsync: typeof getCountriesAsync
	getLetters: typeof getLetters
	getCountryCallingCodeAsync: typeof getCountryCallingCodeAsync
	getCountryCurrencyAsync: typeof getCountryCurrencyAsync
	search: typeof search
	getCountryInfoAsync: typeof getCountryInfoAsync
}
export const DEFAULT_COUNTRY_CONTEXT = {
	translation: "common" as TranslationLanguageCode,
	getCountryNameAsync,
	getImageFlagAsync,
	getCountriesAsync,
	getCountryCallingCodeAsync,
	getCountryCurrencyAsync,
	search,
	getLetters,
	getCountryInfoAsync,
}
export const CountryContext = createContext<CountryContextParam>(
	DEFAULT_COUNTRY_CONTEXT,
)

/**
 * useCountryContext - typed helper hook to access the CountryContext
 * Keeping `useContext` exported as an alias for backward compatibility.
 */
export const useCountryContext = () => uc(CountryContext)

export const useContext = useCountryContext

export const { Provider: CountryProvider, Consumer: CountryConsumer } =
	CountryContext
