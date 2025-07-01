import Fuse, { IFuseOptions } from "fuse.js"
import {
	Country,
	CountryCode,
	CountryCodeList,
	FlagType,
	Region,
	Subregion,
	TranslationLanguageCode,
	TranslationLanguageCodeMap,
} from "../types"

const imageJsonUrl =
	"https://xcarpentier.github.io/react-native-country-picker-modal/countries/"

type CountryMap = { [key in CountryCode]: Country }

interface DataCountry {
	emojiCountries?: CountryMap
	imageCountries?: CountryMap
}
const localData: DataCountry = {
	emojiCountries: undefined,
	imageCountries: undefined,
}

export const loadDataAsync = (
	(data: DataCountry) =>
	(dataType: FlagType = FlagType.EMOJI): Promise<CountryMap> => {
		return new Promise((resolve, reject) => {
			switch (dataType) {
				case FlagType.FLAT:
					if (!data.imageCountries) {
						fetch(imageJsonUrl)
							.then((response: Response) => response.json())
							.then((remoteData: any) => {
								data.imageCountries = remoteData
								resolve(data.imageCountries!)
							})
							.catch(reject)
					} else {
						resolve(data.imageCountries)
					}
					break
				default:
					if (!data.emojiCountries) {
						data.emojiCountries = require("../assets/data/countries-emoji.json")
						resolve(data.emojiCountries!)
					} else {
						resolve(data.emojiCountries)
					}
					break
			}
		})
	}
)(localData)

export async function getEmojiFlagAsync(countryCode: CountryCode) {
	const countries = await loadDataAsync()
	if (!countries) {
		throw new Error("Unable to find emoji because emojiCountries is undefined")
	}
	return countries[countryCode].flag
}

export async function getImageFlagAsync(countryCode: CountryCode) {
	const countries = await loadDataAsync(FlagType.FLAT)
	if (!countries) {
		throw new Error("Unable to find image because imageCountries is undefined")
	}
	return countries[countryCode].flag
}

export async function getCountryNameAsync(
	countryCode: CountryCode,
	translation: TranslationLanguageCode = "common",
) {
	const countries = await loadDataAsync()
	if (!countries) {
		throw new Error("Unable to find image because imageCountries is undefined")
	}

	return countries[countryCode].name
		? (countries[countryCode].name as TranslationLanguageCodeMap)[translation]
		: (countries[countryCode].name as unknown as TranslationLanguageCodeMap)[
				"common"
			]
}

export async function getCountryCallingCodeAsync(countryCode: CountryCode) {
	const countries = await loadDataAsync()
	if (!countries) {
		throw new Error("Unable to find image because imageCountries is undefined")
	}
	return countries[countryCode].callingCode[0]
}

export async function getCountryCurrencyAsync(countryCode: CountryCode) {
	const countries = await loadDataAsync()
	if (!countries) {
		throw new Error("Unable to find image because imageCountries is undefined")
	}
	return countries[countryCode].currency[0]
}

const isCountryPresent =
	(countries: { [key in CountryCode]: Country }) =>
	(countryCode: CountryCode) =>
		!!countries[countryCode]

const isRegion = (region?: Region) => (country: Country) =>
	region ? country.region === region : true

const isSubregion = (subregion?: Subregion) => (country: Country) =>
	subregion ? country.subregion === subregion : true

const isIncluded = (countryCodes?: CountryCode[]) => (country: Country) =>
	countryCodes && countryCodes.length > 0
		? countryCodes.includes(country.cca2)
		: true

const isExcluded = (excludeCountries?: CountryCode[]) => (country: Country) =>
	excludeCountries && excludeCountries.length > 0
		? !excludeCountries.includes(country.cca2)
		: true

export async function getCountriesAsync(
	flagType: FlagType,
	translation: TranslationLanguageCode = "common",
	region?: Region,
	subregion?: Subregion,
	countryCodes?: CountryCode[],
	excludeCountries?: CountryCode[],
	preferredCountries?: CountryCode[],
	withAlphaFilter?: boolean,
): Promise<Country[]> {
	const countriesRaw = await loadDataAsync(flagType)
	if (!countriesRaw) {
		return []
	}

	if (preferredCountries && !withAlphaFilter) {
		const newCountryCodeList = [
			...preferredCountries,
			...CountryCodeList.filter((code) => !preferredCountries.includes(code)),
		]

		return newCountryCodeList
			.filter(isCountryPresent(countriesRaw))
			.map((cca2: CountryCode) => ({
				...{
					...countriesRaw[cca2],
					name:
						(countriesRaw[cca2].name as TranslationLanguageCodeMap)[
							translation
						] ||
						(countriesRaw[cca2].name as TranslationLanguageCodeMap)["common"],
				},
				cca2,
			}))
			.filter(isRegion(region))
			.filter(isSubregion(subregion))
			.filter(isIncluded(countryCodes))
			.filter(isExcluded(excludeCountries))
	} else {
		return CountryCodeList.filter(isCountryPresent(countriesRaw))
			.map((cca2: CountryCode) => ({
				...{
					...countriesRaw[cca2],
					name:
						(countriesRaw[cca2].name as TranslationLanguageCodeMap)[
							translation
						] ||
						(countriesRaw[cca2].name as TranslationLanguageCodeMap)["common"],
				},
				cca2,
			}))
			.filter(isRegion(region))
			.filter(isSubregion(subregion))
			.filter(isIncluded(countryCodes))
			.filter(isExcluded(excludeCountries))
			.sort((country1: Country, country2: Country) =>
				(country1.name as string).localeCompare(country2.name as string),
			)
	}
}

const DEFAULT_FUSE_OPTION = {
	shouldSort: true,
	threshold: 0.3,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
	keys: ["name", "cca2", "callingCode"],
}
let fuse: Fuse<Country>

export function search(
	term: string = "",
	data: Country[] = [],
	options: IFuseOptions<Country> = DEFAULT_FUSE_OPTION,
) {
	if (data.length === 0) {
		return []
	}
	if (!fuse) {
		fuse = new Fuse<Country>(data, options)
	}
	if (term && term.length > 0) {
		return fuse.search(term).map((r) => r.item)
	} else {
		return data
	}
}
const unique = (arr: string[]) => Array.from(new Set(arr))

export const getLetters = (countries: Country[]) =>
	unique(
		countries
			.map((country: Country) =>
				(country.name as string).slice(0, 1).toLocaleUpperCase(),
			)
			.sort((l1: string, l2: string) => l1.localeCompare(l2)),
	)

export interface CountryInfo {
	countryName: string
	currency: string
	callingCode: string
}
export async function getCountryInfoAsync({
	countryCode,
	translation,
}: {
	countryCode: CountryCode
	translation?: TranslationLanguageCode
}): Promise<CountryInfo> {
	const countryName = await getCountryNameAsync(
		countryCode,
		translation || "common",
	)
	const currency = await getCountryCurrencyAsync(countryCode)
	const callingCode = await getCountryCallingCodeAsync(countryCode)
	return { countryName, currency, callingCode }
}
