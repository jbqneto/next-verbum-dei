export const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

export const cleanHtmlResponse = (rawHtml: string | undefined) => {
    if (!rawHtml) return "";

    const cleanResponse = rawHtml.replace(/^```html\n|```$/g, '').trim();

    return cleanResponse.replace(/【\d+:\d+†source】/g, '');
}