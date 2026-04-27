export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const fileUrl = `/uploads/products/${req.file.filename}`;

        res.status(200).json({
            url: fileUrl,
            filename: req.file.filename,
        });
    } catch (error) {
        console.error('Local upload error:', error);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
};
