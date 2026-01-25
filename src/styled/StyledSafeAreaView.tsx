import { cssInterop } from "nativewind"
import { SafeAreaView } from "react-native-safe-area-context"

export const StyledSafeAreaView = cssInterop(SafeAreaView, {
	className: {
		target: "style",
	},
})
