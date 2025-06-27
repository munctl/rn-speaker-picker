import { ReactNode } from "react"
import { StyleSheet, View, ViewProps } from "react-native"

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
})

export const Row = (
	props: ViewProps & { children?: ReactNode; fullWidth?: boolean },
) => (
	<View
		{...props}
		style={[
			styles.row,
			props.style,
			props.fullWidth && {
				width: "100%",
				justifyContent: "space-between",
				padding: 10,
				paddingHorizontal: 50,
			},
		]}
	/>
)
