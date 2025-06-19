const multer = require('multer');
const cloudinary = require('../config/cloudinary.config');
const { v4: uuidv4 } = require('uuid');

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// 3. Middleware: upload single file
const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        const uploader = upload.single(fieldName);
        uploader(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ success: false, message: err.message });
            } else if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            next();
        });
    };
};

// 4. Cloudinary upload helper
const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        if (!file || !file.buffer) {
            return reject(new Error("No file buffer found"));
        }

        cloudinary.uploader.upload_stream(
            {
                folder: 'uploads',
                public_id: uuidv4(),
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(error);
                }
                resolve(result);
            }
        ).end(file.buffer);
    });
};

// 5. Middleware: upload any files
const uploadAny = () => {
    return (req, res, next) => {
        const uploader = upload.any(); // accepts any fieldname
        uploader(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ success: false, message: err.message });
            } else if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            next();
        });
    };
};


module.exports = {
    uploadSingle,
    uploadAny,
    uploadToCloudinary,
};

