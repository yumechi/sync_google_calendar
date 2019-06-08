export {};

/**
 * String Extender
 */
declare global {
  interface String {
    /**
     * Return True if string starts with the prefix, otherwise return False.
     * @param word
     */
    startsWith(word: string): boolean;
    /**
     * Return True if string ends with the prefix, otherwise return False.
     * @param word
     */
    endsWith(word: string): boolean;
  }
}

String.prototype.startsWith = function(word: string) {
  return this.indexOf(word) === 0;
};

String.prototype.endsWith = function(word: string) {
  return (
    this.lastIndexOf(word) + word.length === this.length &&
    word.length <= this.length
  );
};
