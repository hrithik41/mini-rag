export function chunkText(text, chunkSize = 1000, overlap = 200) {
    if (!text || typeof text !== 'string') return [];

    const cleanedText = text.replace(/\s+/g, ' ').trim();

    const chunks = [];
    let currentIndex = 0;

    while (currentIndex < cleanedText.length) {
        let chunk = cleanedText.slice(currentIndex, currentIndex + chunkSize);
        chunks.push(chunk);
        currentIndex += (chunkSize - overlap);
    }

    return chunks;
}