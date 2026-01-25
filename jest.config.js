module.exports = {
	preset: "jest-expo",
	setupFilesAfterEnv: [
		"<rootDir>/jest.setup.tsx",
	],
	testPathIgnorePatterns: ["/node_modules/", "/dist/", "/android/", "/ios/"],
	transformIgnorePatterns: [
"node_modules/(?!.*(@expo|expo|expo-modules-core|@expo(nent)?/.*|@react-native|react-native|@react-native-community|@react-navigation|@shopify/flash-list))",	],
	moduleNameMapper: {
		"react-native/Libraries/Animated/NativeAnimatedHelper": "<rootDir>/__mocks__/NativeAnimatedHelper.ts",
	},
}
