import { createContext, useContext as uc } from "react"
import {
	getCountriesAsync,
	getCountryCallingCodeAsync,
	getCountryCurrencyAsync,
	getCountryInfoAsync,
	getCountryNameAsync,
	getEmojiFlagAsync,
	getImageFlagAsync,
	getLetters,
	search,
} from "./v2/CountryService"
import { TranslationLanguageCode } from "./types"

export interface CountryContextParam {
	translation?: TranslationLanguageCode
	getCountryNameAsync: typeof getCountryNameAsync
	getImageFlagAsync: typeof getImageFlagAsync
	getEmojiFlagAsync: typeof getEmojiFlagAsync
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
	getEmojiFlagAsync,
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

export const useContext = () => uc(CountryContext)

export const { Provider: CountryProvider, Consumer: CountryConsumer } =
	CountryContext
