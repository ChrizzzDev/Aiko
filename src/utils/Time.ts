function formatDuration(ms: number): string {
	const units = [
		{ label: 'w', ms: 604800000 }, // week
		{ label: 'd', ms: 86400000 }, // day
		{ label: 'h', ms: 3600000 }, // hour
		{ label: 'min', ms: 60000 }, // minute
		{ label: 's', ms: 1000 }, // second
		{ label: 'ms', ms: 1 }, // millisecond
	];

	let remainingMs = ms;
	return units.reduce((acc, { label, ms: unitMs }) => {
		const value = Math.floor(remainingMs / unitMs);
		remainingMs %= unitMs;
		return value > 0 ? `${acc} ${value}${label}`.trim() : acc;
	}, '');
}

export function ms(duration: string): number;
export function ms(duration: number): string;
export function ms(duration: string | number): string | number {
	if (typeof duration === 'string') {
		const regex = /(\d+)(ms|s|min|h|d|w|m)/g;
		let match;
		let totalMs = 0;
		const unitToMs: { [key: string]: number } = {
			ms: 1,
			s: 1000,
			min: 60000,
			h: 3600000,
			d: 86400000,
			w: 604800000,
			m: 2592000000,
		};

		while ((match = regex.exec(duration)) !== null) {
			totalMs += parseInt(match[1], 10) * unitToMs[match[2]];
		}

		return totalMs;
	}

	return formatDuration(duration);
}
