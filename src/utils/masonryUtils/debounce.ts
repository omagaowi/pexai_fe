type GenericFunction = (...args: unknown[]) => unknown;

export const debounce = <F extends GenericFunction>(
	func: F,
	wait: number
): ((...args: Parameters<F>) => void) => {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<F>): void => {
		if (timeout !== null) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => func(...args), wait);
	};
};
