import { render } from "@testing-library/react-native"
import { CountryPicker } from "../src/CountryPicker"

it("Can be created", () => {
	const picker = render(<CountryPicker onSelect={() => {}} />)
	expect(picker).toBeDefined()
})
