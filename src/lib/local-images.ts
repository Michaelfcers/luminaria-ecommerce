import fs from 'fs';
import path from 'path';

export async function getLocalProductImage(code: string | undefined | null): Promise<string | null> {
    if (!code) return null;

    try {
        const publicDir = path.join(process.cwd(), 'public');
        const productDir = path.join(publicDir, 'products', code);

        console.log(`Checking for local images in: ${productDir}`);

        // Check if directory exists
        if (!fs.existsSync(productDir)) {
            console.log(`Directory not found: ${productDir}`);
            return null;
        }

        // Read files in the directory
        const files = await fs.promises.readdir(productDir);
        console.log(`Files found in ${code}:`, files);

        // Filter for image files
        const imageFiles = files.filter(file =>
            /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
        );

        if (imageFiles.length > 0) {
            // Return the path relative to public directory
            // We use the first image found
            const imagePath = `/products/${code}/${imageFiles[0]}`;
            console.log(`Found image for ${code}: ${imagePath}`);
            return imagePath;
        }

        console.log(`No images found for ${code}`);
        return null;
    } catch (error) {
        console.error(`Error finding local image for product ${code}:`, error);
        return null;
    }
}
