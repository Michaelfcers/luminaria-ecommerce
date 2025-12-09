import { getLocalProductImage } from './src/lib/local-images';

async function test() {
    console.log('Testing getLocalProductImage...');
    const code = '7012813';
    const image = await getLocalProductImage(code);
    console.log(`Result for ${code}:`, image);
}

test().catch(console.error);
