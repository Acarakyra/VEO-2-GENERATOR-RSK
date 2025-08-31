export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3';

export type ImageData = {
  data: string; // base64 encoded string
  mimeType: string;
  preview: string; // data URL for preview
};
