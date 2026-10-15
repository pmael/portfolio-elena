// The same text without its marks (**bold**, *italic*) and line breaks: for labels read by screen readers.
export const plain = (text) => text.replace(/\*+/g, '').replace(/\s*\n\s*/g, ' ');
