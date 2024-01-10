import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images");
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split(".")[1];
        const filename = `${Date.now()}.${ext}`;

        cb(null, filename);
        req.filename = filename;
    },
});

const upload = multer({ storage });

export default upload;
