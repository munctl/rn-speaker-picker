import { cssInterop } from "nativewind"
import { Pressable } from "react-native-gesture-handler"

export const StyledPressable = cssInterop(Pressable, {
	className: {
		target: "style",
	},
})
