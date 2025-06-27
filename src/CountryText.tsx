import { ReactNode } from "react"
import { Text, TextProps } from "react-native"
import { useTheme } from "./CountryTheme"

export function CountryText(props: TextProps & { children: ReactNode }) {
	const { fontFamily, fontSize, onBackgroundTextColor } = useTheme()
	return (
		<Text
			{...props}
			style={{ fontFamily, fontSize, color: onBackgroundTextColor }}
		/>
	)
}
