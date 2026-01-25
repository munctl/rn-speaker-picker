import * as CountryService from "../CountryService"
import { Country, FlagType } from "../../types"

const mockCountries: Record<string, Country> = {
	US: {
		cca2: "US",
		name: "United States",
		callingCode: ["1"],
		currency: ["USD"],
		flag: "🇺🇸",
		region: "Americas",
		subregion: "North America",
	},
	FR: {
		cca2: "FR",
		name: "France",
		callingCode: ["33"],
		currency: ["EUR"],
		flag: "🇫🇷",
		region: "Europe",
		subregion: "Western Europe",
	},
}

describe("CountryService", () => {
	beforeEach(() => {
		jest
			.spyOn(CountryService, "loadDataAsync")
			.mockImplementation(async () => mockCountries as any)
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	it("prioritizes preferred countries when alpha filter is disabled", async () => {
		const result = await CountryService.getCountriesAsync(
			FlagType.EMOJI,
			"common",
			undefined,
			undefined,
			undefined,
			undefined,
			["FR"],
			false,
		)

		expect(result[0].cca2).toBe("FR")
		expect(result.map((c) => c.cca2)).toContain("US")
	})

	it("excludes specified countries from the result set", async () => {
		const result = await CountryService.getCountriesAsync(
			FlagType.EMOJI,
			"common",
			undefined,
			undefined,
			undefined,
			["FR"],
		)

		expect(result.find((c) => c.cca2 === "FR")).toBeUndefined()
		expect(result.map((c) => c.cca2)).toContain("US")
	})

	it("returns translated country info with currency and calling code", async () => {
		const info = await CountryService.getCountryInfoAsync({
			countryCode: "FR",
		})

		expect(info).toEqual({
			countryName: "France",
			currency: "EUR",
			callingCode: "33",
		})
	})

	it("searches countries by name and code", () => {
		const formattedCountries: Country[] = Object.values(mockCountries).map(
			(country) => ({ ...country, name: (country.name as any).common }),
		)

		const results = CountryService.search("fr", formattedCountries)

		expect(results).toHaveLength(1)
		expect(results[0].cca2).toBe("FR")
	})
})
