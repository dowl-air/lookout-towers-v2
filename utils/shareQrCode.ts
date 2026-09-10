export const createShareableQrFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    if (blob.type !== "image/png") {
        throw new Error("The QR code must be a PNG image.");
    }

    return new File([blob], fileName, { type: blob.type });
};
