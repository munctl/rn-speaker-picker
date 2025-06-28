import { MaterialIcons } from "@expo/vector-icons"
import { cssInterop } from "nativewind"
import { Pressable } from "react-native-gesture-handler"

export const StyledMaterialIcon = cssInterop(MaterialIcons, {
	className: {
		target: "style",
	},
})
