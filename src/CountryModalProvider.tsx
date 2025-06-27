import { createContext, ReactNode, useState } from "react"

export interface CountryModalContextParam {
	gate?: ReactNode
	teleport?(element: ReactNode): void
}

export const CountryModalContext = createContext<CountryModalContextParam>({
	gate: undefined,
	teleport: undefined,
})

interface CountryModalProvider {
	children: ReactNode
}
export function CountryModalProvider({ children }: CountryModalProvider) {
	const [gate, setGate] = useState<ReactNode>(undefined)
	const teleport = (element: ReactNode) => setGate(element)
	return (
		<CountryModalContext.Provider value={{ gate, teleport }}>
			{children}
			{gate}
		</CountryModalContext.Provider>
	)
}
