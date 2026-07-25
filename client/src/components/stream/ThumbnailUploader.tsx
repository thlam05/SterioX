import { Image as ImageIcon } from 'lucide-react';

type ThumbnailUploaderProps = {
  thumbnailPreview: string | null;
  thumbnail: string | null;
  thumbnailError: string;
  onButtonClick: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ThumbnailUploader({
  thumbnailPreview,
  thumbnail,
  thumbnailError,
  onButtonClick,
  onFileSelect,
}: ThumbnailUploaderProps) {
  return (
    <div className="space-y-4">
      <label className="text-xs font-bold tracking-widest opacity-60 uppercase">
        Hình thu nhỏ
      </label>
      <div
        onClick={onButtonClick}
        className={`group relative border border-dashed rounded-3xl aspect-video flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-accent ${thumbnailError ? 'border-danger' : 'border-accent hover:border-primary'}`}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileSelect}
        />
        {thumbnailPreview ? (
          <>
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 p-4 text-center">
              <ImageIcon className="w-8 h-8 text-success mb-2" />
              <p className="text-xs font-bold text-foreground truncate w-full px-4">
                {thumbnail}
              </p>
              <p className="text-[10px] text-secondary mt-1 underline">
                Nhấp để thay đổi
              </p>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6 text-secondary group-hover:text-primary" />
            </div>
            <p className="text-xs font-bold">Tải ảnh lên</p>
            <p className="text-[10px] text-secondary mt-1">
              Chuẩn 16:9 (1280x720)
            </p>
          </div>
        )}
      </div>
      {thumbnailError && (
        <p className="text-danger text-xs mt-1">{thumbnailError}</p>
      )}
    </div>
  );
}
