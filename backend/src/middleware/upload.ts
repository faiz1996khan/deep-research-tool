import multer from "multer";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedExtensions = new Set([".pdf", ".docx", ".xlsx", ".txt", ".html"]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const extension = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf("."));

    if (!allowedExtensions.has(extension)) {
      callback(new Error(`Unsupported file type: ${extension}`));
      return;
    }
    callback(null, true);
  },
});