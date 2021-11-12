import DIRECTION from './direction';

export default class Vector2 {
	constructor({ x, y }) {
		this.x = x;
		this.y = y;
	}

	static fromDirection(direction) {
		switch (direction) {
			case DIRECTION.UP:
				return new Vector2({ x: 0, y: -1 });
			case DIRECTION.DOWN:
				return new Vector2({ x: 0, y: 1 });
			case DIRECTION.RIGHT:
				return new Vector2({ x: 1, y: 0 });
			case DIRECTION.LEFT:
				return new Vector2({ x: -1, y: 0 });
			default:
				return null;
		}
	}

	static fromAngle(angle) {
		switch (angle) {
			case 0:
				return new Vector2({ x: 0, y: -1 });
			case 90:
				return new Vector2({ x: 1, y: 0 });
			case 180:
				return new Vector2({ x: 0, y: 1 });
			case 270:
				return new Vector2({ x: -1, y: 0 });
			case 360:
				return new Vector2({ x: 0, y: -1 });
			default:
				return null;
		}
	}

	copy() {
		return new Vector2({ x: this.x, y: this.y });
	}

	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}

	multiply(vector) {
		this.x *= vector.x;
		this.y *= vector.y;
		return this;
	}

	divide(scalar) {
		this.x /= scalar;
		this.y /= scalar;
		return this;
	}

	invert() {
		this.x *= -1;
		this.y *= -1;
		return this;
	}
}
