/** Helpers for hand-placed SVG drawings (run at build time only). */

export type Point = readonly [x: number, y: number];

const fmt = ([x, y]: Point) => `${+x.toFixed(1)} ${+y.toFixed(1)}`;

/** A smooth path through the points: a Catmull–Rom spline written as cubic Béziers. */
export function curve(points: readonly Point[]): string {
	let d = `M${fmt(points[0])}`;
	for (let i = 0; i < points.length - 1; i++) {
		const p0 = points[i - 1] ?? points[i];
		const p1 = points[i];
		const p2 = points[i + 1];
		const p3 = points[i + 2] ?? p2;
		const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
		const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
		d += `C${fmt(c1)} ${fmt(c2)} ${fmt(p2)}`;
	}
	return d;
}

/** An SVG transform placing a shape at point `i` of a curve, rotated along the curve there. */
export function along(points: readonly Point[], i: number): string {
	const [x, y] = points[i];
	const [ax, ay] = points[i - 1] ?? points[i];
	const [bx, by] = points[i + 1] ?? points[i];
	const angle = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
	return `translate(${+x.toFixed(1)} ${+y.toFixed(1)}) rotate(${+angle.toFixed(1)})`;
}
