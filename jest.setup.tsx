import "react-native-gesture-handler/jestSetup"
jest.mock("react-native-safe-area-context", () => {
	const React = require("react")
	const { View } = require("react-native")
	return {
		SafeAreaProvider: ({ children }: any) => <View>{children}</View>,
		SafeAreaView: ({ children, ...rest }: any) => (
			<View {...rest}>{children}</View>
		),
		SafeAreaInsetsContext: React.createContext({
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
		}),
		useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
	}
})

jest.mock("react-native-reanimated", () => {
	const Reanimated = require("react-native-reanimated/mock")
	Reanimated.default.call = () => {}
	return Reanimated
})

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper")

jest.mock("@shopify/flash-list", () => {
	const React = require("react")
	const { FlatList } = require("react-native")
	return {
		FlashList: React.forwardRef((props: any, ref: any) => (
			<FlatList ref={ref} {...props} />
		)),
	}
})

if (!(global as any).fetch) {
	;(global as any).fetch = jest.fn()
}
