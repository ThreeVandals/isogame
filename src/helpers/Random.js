/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 * https://gist.github.com/blixt/f17b47c62508be59987b
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 */
function Random(seed) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
}

/**
   * Returns a pseudo-random value between 1 and 2^32 - 2.
   */
Random.prototype.next = function next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed;
};


/**
   * Returns a pseudo-random floating point number in range [0, 1).
   */
Random.prototype.nextFloat = function nextFloat() {
    // We know that result of next() will be 1 to 2147483646 (inclusive).
    return (this.next() - 1) / 2147483646;
};

Random.prototype.nextInt = function nextInt(min, max) {
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
};

module.exports = Random;
