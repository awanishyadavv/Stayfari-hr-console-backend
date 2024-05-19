import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './my-uploads')
    },
    filename: function (req, file, cb) {
        const uniqueFileName = Date.now() + '-' + file.originalname;
        cb(null, uniqueFileName);
    }
})

export const upload = multer({ storage: storage })