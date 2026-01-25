import getSuffix from "../getSuffix"

describe("getSuffix", () => {
	it("returns calling code and currency when both enabled", () => {
		expect(
			getSuffix({
				withCallingCode: true,
				withCurrency: true,
				callingCode: "1",
				currency: "USD",
			}),
		).toBe("(+1, USD)")
	})

	it("returns only currency when calling code disabled", () => {
		expect(
			getSuffix({
				withCallingCode: false,
				withCurrency: true,
				callingCode: "1",
				currency: "EUR",
			}),
		).toBe("(EUR)")
	})

	it("omits parentheses when disabled", () => {
		expect(
			getSuffix({
				withCallingCode: true,
				withCurrency: false,
				callingCode: "44",
				currency: "GBP",
				parentheses: false,
			}),
		).toBe("+44")
	})

	it("returns empty string when nothing provided", () => {
		expect(
			getSuffix({
				withCallingCode: false,
				withCurrency: false,
				callingCode: "",
				currency: "",
			}),
		).toBe("")
	})
})
