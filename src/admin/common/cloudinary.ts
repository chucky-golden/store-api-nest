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

        try{
            // Convert the buffer to a readable stream
            const bufferStream = streamifier.createReadStream(image.buffer);
            // Create a stream from the buffer
            const stream = cloudinaryV2.uploader.upload_stream(async (error, result) => {
                if (error) {
                    console.error(error);
                    return {}
                } else {
                    return { 'uploadUrl': result.secure_url, 'publicId': result.public_id }
                }
            })

            bufferStream.pipe(stream);
        }catch(e){
            console.log('upload error: ' + e.message);
            return {}
        }

    }
}