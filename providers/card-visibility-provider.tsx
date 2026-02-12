import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

// Create a context to hold the visibility state
const CardVisibilityContext = createContext({
	isCardVisible: false,
	setIsCardVisible: (_visible: boolean) => {},
});

export const CardVisibilityProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isCardVisible, setIsCardVisible] = useState(true);

	return (
		<CardVisibilityContext.Provider
			value={{ isCardVisible, setIsCardVisible }}
		>
			{children}
		</CardVisibilityContext.Provider>
	);
};

export const useCardVisibility = (ref: React.RefObject<Element> | null) => {
	const { isCardVisible, setIsCardVisible } = useContext(
		CardVisibilityContext
	);
	const previousRef = useRef<React.RefObject<Element> | null>(null); // Track the previous ref

	// Use the useInView hook only when a ref is provided
	const inView = ref
		? useInView(ref, { once: false, amount: 0.5 })
		: isCardVisible;

	useEffect(() => {
		// Check if the ref has changed (and is not null)
		if (ref && ref !== previousRef.current) {
			// Reset the visibility state when a new ref is passed
			setIsCardVisible(false);
			previousRef.current = ref; // Update the previous ref to the current one
		}

		// Only update the visibility if ref is valid
		if (ref) {
			setIsCardVisible(inView);
		}
	}, [inView, ref]);

	return isCardVisible;
};
