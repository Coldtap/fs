import * as FileSystem from 'expo-file-system';

const fs = {
  /**
   * Reads the contents of a file asynchronously.
   * @param {string} path - The path to the file.
   * @param {string} [encoding='utf8'] - The encoding of the file.
   * @returns {Promise<string>} - The file contents.
   */
  readFile: async (path, encoding = 'utf8') => {
    try {
      const content = await FileSystem.readAsStringAsync(path, {
        encoding: FileSystem.EncodingType[encoding.toUpperCase()] || FileSystem.EncodingType.UTF8,
      });
      return content;
    } catch (error) {
      throw new Error(`Failed to read file at ${path}: ${error.message}`);
    }
  },

  /**
   * Writes data to a file asynchronously.
   * @param {string} path - The path to the file.
   * @param {string} data - The data to write.
   * @param {string} [encoding='utf8'] - The encoding of the data.
   * @returns {Promise<void>}
   */
  writeFile: async (path, data, encoding = 'utf8') => {
    try {
      await FileSystem.writeAsStringAsync(path, data, {
        encoding: FileSystem.EncodingType[encoding.toUpperCase()] || FileSystem.EncodingType.UTF8,
      });
    } catch (error) {
      throw new Error(`Failed to write file at ${path}: ${error.message}`);
    }
  },

  /**
   * Appends data to a file asynchronously.
   * @param {string} path - The path to the file.
   * @param {string} data - The data to append.
   * @returns {Promise<void>}
   */
  appendFile: async (path, data) => {
    try {
      const existingData = await fs.readFile(path);
      await fs.writeFile(path, existingData + data);
    } catch (error) {
      throw new Error(`Failed to append file at ${path}: ${error.message}`);
    }
  },

  /**
   * Deletes a file.
   * @param {string} path - The path to the file.
   * @returns {Promise<void>}
   */
  unlink: async (path) => {
    try {
      await FileSystem.deleteAsync(path);
    } catch (error) {
      throw new Error(`Failed to delete file at ${path}: ${error.message}`);
    }
  },

  /**
   * Checks if a file exists.
   * @param {string} path - The path to the file.
   * @returns {Promise<boolean>}
   */
  exists: async (path) => {
    try {
      const info = await FileSystem.getInfoAsync(path);
      return info.exists;
    } catch {
      return false;
    }
  },

  /**
   * Renames a file.
   * @param {string} oldPath - The current file path.
   * @param {string} newPath - The new file path.
   * @returns {Promise<void>}
   */
  rename: async (oldPath, newPath) => {
    try {
      await FileSystem.moveAsync({ from: oldPath, to: newPath });
    } catch (error) {
      throw new Error(`Failed to rename file from ${oldPath} to ${newPath}: ${error.message}`);
    }
  },

  /**
   * Creates a directory if it doesn't exist.
   * @param {string} path - The path to the directory.
   * @param {object} [options] - Options (recursive: boolean).
   * @returns {Promise<void>}
   */
  mkdir: async (path, options = { recursive: true }) => {
    try {
      await FileSystem.makeDirectoryAsync(path, { intermediates: options.recursive });
    } catch (error) {
      throw new Error(`Failed to create directory at ${path}: ${error.message}`);
    }
  },

  /**
   * Reads the contents of a directory.
   * @param {string} path - The path to the directory.
   * @returns {Promise<string[]>} - Array of directory contents.
   */
  readdir: async (path) => {
    try {
      const contents = await FileSystem.readDirectoryAsync(path);
      return contents;
    } catch (error) {
      throw new Error(`Failed to read directory at ${path}: ${error.message}`);
    }
  },

  /**
   * Retrieves information about a file or directory.
   * @param {string} path - The path to the file or directory.
   * @returns {Promise<object>} - File information (like stats).
   */
  stat: async (path) => {
    try {
      const info = await FileSystem.getInfoAsync(path, { size: true });
      return {
        isFile: () => info.isFile,
        isDirectory: () => info.isDirectory,
        size: info.size,
        modificationTime: info.modificationTime,
      };
    } catch (error) {
      throw new Error(`Failed to retrieve stats for ${path}: ${error.message}`);
    }
  },

  /**
   * Copies a file.
   * @param {string} srcPath - The source file path.
   * @param {string} destPath - The destination file path.
   * @returns {Promise<void>}
   */
  copyFile: async (srcPath, destPath) => {
    try {
      await FileSystem.copyAsync({ from: srcPath, to: destPath });
    } catch (error) {
      throw new Error(`Failed to copy file from ${srcPath} to ${destPath}: ${error.message}`);
    }
  },

  /**
   * Simulates a synchronous file existence check.
   * @param {string} path - The path to the file.
   * @returns {boolean} - True if the file exists, otherwise false.
   */
  existsSync: (path) => {
    let exists = false;
    FileSystem.getInfoAsync(path).then(info => {
      exists = info.exists;
    }).catch(() => {
      exists = false;
    });
    return exists;
  },

  /**
   * Simulates a synchronous file read.
   * @param {string} path - The path to the file.
   * @param {string} [encoding='utf8'] - The encoding of the file (defaults to 'utf8').
   * @returns {string} - The contents of the file.
   */
  readFileSync: (path, encoding = 'utf8') => {
    let content = '';
    FileSystem.readAsStringAsync(path, {
      encoding: FileSystem.EncodingType[encoding.toUpperCase()] || FileSystem.EncodingType.UTF8,
    }).then(data => {
      content = data;
    }).catch((error) => {
      throw new Error(`Failed to read file at ${path}: ${error.message}`);
    });
    return content;
  },
};

export default fs;