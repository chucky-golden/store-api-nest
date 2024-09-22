import zlib from 'zlib';

export async function compressSent (data){
    try {
        data = JSON.stringify(data); 
        // Convert the JSON string to a Buffer
        data = Buffer.from(data);
        // Compress the data
        return zlib.gzipSync(data);
    } catch (error) {
        console.error('compression error:', error);
        throw new Error('Error during compression');
    }
}