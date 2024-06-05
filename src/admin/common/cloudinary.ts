import { v2 as cloudinaryV2 } from 'cloudinary';
import * as streamifier from 'streamifier';
import { Injectable } from '@nestjs/common';


@Injectable()
export class UploadService {

    constructor(){
        cloudinaryV2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API,
            api_secret: process.env.CLOUD_SECRET
        });
    }


    async generateUploadURL(image: any) {
        try {
            // Convert the buffer to a readable stream
            const bufferStream = streamifier.createReadStream(image.buffer);
            
            // Create a promise to resolve the upload result
            return new Promise((resolve, reject) => {
                // Create a stream from the buffer
                const stream = cloudinaryV2.uploader.upload_stream((error, result) => {
                    if (error) {
                        console.error('Upload error:', error);
                        reject(error); // Reject the promise if there's an error
                    } else {
                        const data = { 'uploadUrl': result.secure_url, 'publicId': result.public_id };
                        resolve(data); // Resolve the promise with the upload data
                    }
                });
    
                // Pipe the buffer stream to the Cloudinary upload stream
                bufferStream.pipe(stream);
            });
        } catch(e) {
            console.error('Upload error:', e.message);
            throw e; // Rethrow the error
        }
    }

    generateUploadURLs(files: Express.Multer.File[]): Promise<any[]> {
        return Promise.all(files.map((file) => {
            return new Promise((resolve, reject) => {
                const bufferStream = streamifier.createReadStream(file.buffer);
    
                const uploadStream = cloudinaryV2.uploader.upload_stream((error: any, result: any) => {
                    if (error) {
                        console.error('Upload error:', error);
                        reject(error);
                    } else {
                        resolve({ uploadUrl: result.secure_url });
                    }
                });
    
                bufferStream.pipe(uploadStream);
            });
        }));
    }

    async deleteImage(id: any){
        try {
            // Use the Cloudinary API to delete the image
            await cloudinaryV2.uploader.destroy(id);
            console.log(`Image with public ID ${id} deleted from Cloudinary`);
        } catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
            throw error;
        }
    }
    
}