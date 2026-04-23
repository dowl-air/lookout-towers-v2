import {
    createHomepageShareImage,
    shareImageAlt as alt,
    shareImageContentType as contentType,
    shareImageSize as size,
} from "@/app/(with-navbar)/(with-footer)/shareImage";

export { alt, contentType, size };

export default function TwitterImage() {
    return createHomepageShareImage();
}
