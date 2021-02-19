class Vector {
    constructor(x, y, z) {
        this.x = x || 0
        this.y = y || 0
        this.z = z || 0
    }

    clone() {
        return new Vector(this.x, this.y, this.z)
    }

    add(x, y, z) {
        if (x instanceof Vector) {
            this.x += x.x || 0;
            this.y += x.y || 0;
            this.z += x.z || 0;
            return this;
        }
        if (x instanceof Array) {
            this.x += x[0] || 0;
            this.y += x[1] || 0;
            this.z += x[2] || 0;
            return this;
        }
        this.x += x || 0;
        this.y += y || 0;
        this.z += z || 0;
        return this;
    }

    sub(x, y, z) {
        if (x instanceof Vector) {
            this.x -= x.x || 0;
            this.y -= x.y || 0;
            this.z -= x.z || 0;
            return this;
        }
        if (x instanceof Array) {
            this.x -= x[0] || 0;
            this.y -= x[1] || 0;
            this.z -= x[2] || 0;
            return this;
        }
        this.x -= x || 0;
        this.y -= y || 0;
        this.z -= z || 0;
        return this;
    }
    
    mult(x, y, z) {
        if (x instanceof Vector) {
            this.x *= x.x;
            this.y *= x.y;
            this.z *= x.z;
            return this;
        }
        if (x instanceof Array) {
            if (x.length === 1) {
                this.x *= x[0];
                this.y *= x[0];
                this.z *= x[0];
            } else if (x.length === 2) {
                this.x *= x[0];
                this.y *= x[1];
            } else if (x.length === 3) {
                this.x *= x[0];
                this.y *= x[1];
                this.z *= x[2];
            }
        }
        if (arguments.length === 1) {
            this.x *= x;
            this.y *= x;
            this.z *= x;
        }
        if (arguments.length === 2) {
            this.x *= x;
            this.y *= y;
        }
        if (arguments.length === 3) {
            this.x *= x;
            this.y *= y;
            this.z *= z;
        } 
        return this
    }

    div(x, y, z) {
        if (x instanceof Vector) {
            this.x /= x.x;
            this.y /= x.y;
            this.z /= x.z;
            return this;
        }
        if (x instanceof Array) {
            if (x.length === 1) {
                this.x /= x[0];
                this.y /= x[0];
                this.z /= x[0];
            } else if (x.length === 2) {
                this.x /= x[0];
                this.y /= x[1];
            } else if (x.length === 3) {
                this.x /= x[0];
                this.y /= x[1];
                this.z /= x[2];
            }
        }
        if (arguments.length === 1) {
            this.x /= x;
            this.y /= x;
            this.z /= x;
        }
        if (arguments.length === 2) {
            this.x /= x;
            this.y /= y;
        }
        if (arguments.length === 3) {
            this.x /= x;
            this.y /= y;
            this.z /= z;
        } 
        return this
    }

    magSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    
    mag() {
        return Math.sqrt(this.magSq());
    }
    

    normalize() {
        const len = this.mag()
        if(len !== 0) {
            this.mult(1 / len)
        }
        return this
    }

    setMag(len) {
        let oldLength = this.mag()
        if(oldLength !== 0 && len !== oldLength) {
            this.mult(len / oldLength)
        }
        return this
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    limit(max) {
        const mSq = this.magSq();
        if (mSq > max * max) {
          this.div(Math.sqrt(mSq)) //normalize it
            .mult(max);
        }
        return this
    }

    asArray() {
        return [this.x, this.y, this.z]
    }

    toString() {
        return this.x + ", " + this.y + ", " + this.z
    }

    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v1.z)
    }

    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v1.z)
    }

    static mult(v1, v2) {
        return new Vector(v1.x * v2.x, v1.y * v2.y, v1.z * v1.z)
    }

    static div(v1, v2) {
        return new Vector(v1.x / v2.x, v1.y / v2.y, v1.z / v1.z)
    }

    static of(x, y, z) {
        return new Vector(x, y, z)
    }

    static fromTheta(theta) {
        return new Vector(Math.cos(theta), Math.sin(theta))
    }
}

module.exports = Vector