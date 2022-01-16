const Readable = require("stream").Readable;

/**
 * Converts a buffer into a readable data stream
 * @param {Uint8Array} buffer Image buffer array
 * @returns Readable data stream
 */

const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

module.exports = { bufferToStream };
