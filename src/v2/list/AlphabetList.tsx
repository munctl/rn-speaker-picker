import React, { useState } from "react"
import {
	Animated,
	StyleProp,
	Text,
	TextStyle,
	TouchableOpacity,
	useAnimatedValue,
	View,
	ViewStyle,
} from "react-native"
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
	GestureStateChangeEvent,
	GestureUpdateEvent,
	PanGestureChangeEventPayload,
	PanGestureHandlerEventPayload,
	State,
} from "react-native-gesture-handler"
import { runOnJS, runOnUI } from "react-native-reanimated"

/*
Courtesy of https://github.com/kkaushik90/react-native-lexical-list
 */

export interface AlphabetListProps {
	data: (string | number)[]
	itemHeight: number
	itemStyle?: StyleProp<TextStyle>
	onItemSelect: (item: string | number, index: number) => void
	containerStyle?: StyleProp<ViewStyle>
	indicatorStyle?: StyleProp<ViewStyle>
	indicatorTextStyle?: StyleProp<TextStyle>
}

const INDICATOR_RADIUS = 24 // TODO support shapes other than a circle

export const AlphabetList = ({
	data,
	itemHeight,
	itemStyle,
	onItemSelect,
	containerStyle,
	indicatorStyle,
	indicatorTextStyle,
}: AlphabetListProps) => {
	const [selectedItem, setSelectedItem] = useState(data[0])
	const [indicatorActive, setIndicatorActive] = useState(false)
	const dragY = useAnimatedValue(0)

	function onPanGestureEvent(
		e: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
	) {
		const positionY = e.y
		runOnJS(calculateAndUpdateSelectedItem)(positionY)
		runOnJS(dragY.setValue)(positionY - INDICATOR_RADIUS)
	}

	function calculateAndUpdateSelectedItem(positionY: number) {
		const itemIndex = Math.floor(positionY / itemHeight)
		if (itemIndex >= 0 && itemIndex < data.length) {
			onItemSelected(data[itemIndex], itemIndex)
		}
	}

	function onItemSelected(newItem: string | number, index: number) {
		setSelectedItem((prevState) => {
			if (prevState !== newItem) {
				onItemSelect(newItem, index)
				return newItem
			}
			return prevState
		})
	}

	function onPanGestureStateChange(
		e: GestureUpdateEvent<
			PanGestureHandlerEventPayload & PanGestureChangeEventPayload
		>,
	) {
		const nativeEvent = e
		setTimeout(() => setIndicatorActive(nativeEvent.state === State.ACTIVE), 50)
	}

	const pan = Gesture.Pan()
		.onBegin(onPanGestureEvent)
		.onChange(onPanGestureStateChange)

	return (
		<View className="flex-row items-start">
			{indicatorActive && (
				<Animated.View
					style={[
						{
							width: INDICATOR_RADIUS * 2,
							height: INDICATOR_RADIUS * 2,
							marginRight: 24,
							alignItems: "center",
							justifyContent: "center",
						},
						{ transform: [{ translateY: dragY }] },
					]}
				>
					<View
						style={[
							{
								position: "absolute",
								width: INDICATOR_RADIUS * 2,
								height: INDICATOR_RADIUS * 2,
								borderRadius: INDICATOR_RADIUS,
								alignSelf: "stretch",
								flex: 1,
								opacity: 0.5,
								backgroundColor: "#FE4042",
							},
							indicatorStyle,
						]}
					/>
					<Text
						style={[
							{ color: "white", fontWeight: "bold", fontSize: 24 },
							indicatorTextStyle,
						]}
					>
						{selectedItem}
					</Text>
				</Animated.View>
			)}
			<GestureHandlerRootView>
				<GestureDetector gesture={pan}>
					<View className="items-center w-8" style={[containerStyle]}>
						{data.map((item, index) => (
							<TouchableOpacity
								style={{ height: itemHeight }}
								key={item}
								onPress={() => onItemSelected(item, index)}
							>
								<Text style={[itemStyle, { maxHeight: itemHeight }]}>
									{item}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</GestureDetector>
			</GestureHandlerRootView>
		</View>
	)
}
