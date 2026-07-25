import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Video, HelpCircle } from 'lucide-react';
import { StreamKeySection } from '@/components/stream/StreamKeySection';
import { CategorySelector } from '@/components/stream/CategorySelector';
import { PrivacySelector } from '@/components/stream/PrivacySelector';
import { ThumbnailUploader } from '@/components/stream/ThumbnailUploader';
import { LatencySelector } from '@/components/stream/LatencySelector';
import { DvrVodToggles } from '@/components/stream/DvrVodToggles';
import { useStreamSetup } from '@/hooks/stream/useStreamSetup';

export default function StreamSetupPage() {
  const {
    title, setTitle,
    description, setDescription,
    status, setStatus,
    streamKey, streamUrl,
    showStreamKey, setShowStreamKey,
    copied,
    thumbnail, thumbnailPreview,
    titleError, descriptionError, thumbnailError, categoryError,
    isSubmitting, submitError,
    latency, setLatency,
    dvr, setDvr,
    vod, setVod,
    parentCategory, subCategory, setSubCategory, categoriesData,
    activeParent,
    handleCreateStreamKey,
    handleCopyStreamKey,
    handleCopyStreamUrl,
    handleThumbnailChange,
    handleThumbnailSelect,
    handleSubmit,
    handleParentSelect,
  } = useStreamSetup();

  return (
    <main className="w-full bg-background text-foreground font-sans space-y-10 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-background border border-accent rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4 border-b border-accent pb-6">
              <div className="w-12 h-12 rounded-2xl bg-selection text-primary flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight">
                  Chi tiết buổi phát
                </h1>
                <p className="text-xs text-secondary">
                  Cấu hình cách người xem nhìn thấy livestream của bạn
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest opacity-60 uppercase">
                  Tiêu đề
                </label>
                <Input
                  placeholder="Nhập tiêu đề hấp dẫn..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={titleError ? 'border-danger' : ''}
                  required
                />
                <div className="flex justify-between text-[10px] font-medium text-secondary">
                  <span>Mẹo: Tiêu đề ngắn gọn sẽ thu hút hơn</span>
                  <span className={title.length > 90 ? 'text-danger' : ''}>
                    {title.length}/100
                  </span>
                </div>
                {titleError && (
                  <p className="text-danger text-xs mt-1">{titleError}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest opacity-60 uppercase">
                  Mô tả
                </label>
                <textarea
                  className={`w-full min-h-[160px] px-4 py-3 bg-background border rounded-2xl text-sm focus:border-primary outline-none transition-all resize-none ${descriptionError ? 'border-danger' : 'border-accent'}`}
                  placeholder="Bạn muốn chia sẻ điều gì trong buổi live này?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {descriptionError && (
                  <p className="text-danger text-xs mt-1">{descriptionError}</p>
                )}
              </div>

              <CategorySelector
                categoriesData={categoriesData}
                parentCategory={parentCategory}
                subCategory={subCategory}
                activeParent={activeParent}
                categoryError={categoryError}
                onParentSelect={handleParentSelect}
                onSubSelect={setSubCategory}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PrivacySelector value={status} onChange={setStatus} />

                <ThumbnailUploader
                  thumbnailPreview={thumbnailPreview}
                  thumbnail={thumbnail}
                  thumbnailError={thumbnailError}
                  onButtonClick={handleThumbnailChange}
                  onFileSelect={handleThumbnailSelect}
                />
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-accent">
                {submitError && (
                  <p className="text-danger text-xs">{submitError}</p>
                )}
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!streamKey || isSubmitting || !parentCategory}
                  >
                    {isSubmitting ? 'Đang lưu...' : 'Lưu thiết lập phát sóng'}
                  </Button>
                </div>
              </div>
            </form>
          </section>
        </div>

        <div className="space-y-6">
          <StreamKeySection
            streamKey={streamKey}
            streamUrl={streamUrl}
            showStreamKey={showStreamKey}
            copied={copied}
            onToggleShowKey={() => setShowStreamKey(!showStreamKey)}
            onCopyUrl={handleCopyStreamUrl}
            onCopyKey={handleCopyStreamKey}
            onCreateKey={handleCreateStreamKey}
          />

          <section className="bg-background border border-accent rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-black tracking-tight uppercase">
              Tối ưu phát sóng
            </h3>

            <LatencySelector value={latency} onChange={setLatency} />

            <DvrVodToggles
              dvr={dvr}
              vod={vod}
              onDvrChange={setDvr}
              onVodChange={setVod}
            />

            <div className="p-4 bg-selection rounded-2xl flex gap-3 border border-primary/10">
              <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-secondary italic">
                Để có chất lượng tốt nhất, hãy cấu hình Bitrate khoảng 4500-6000
                Kbps trong phần mềm OBS.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
