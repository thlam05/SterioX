import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';
import { StreamKeyField } from '@/components/stream/StreamKeyField';
import {
  Video,
  Image as ImageIcon,
  Sparkles,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Globe,
  Lock,
  Link2,
  KeyRound,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { streamApi, streamKeyApi } from '@/api/streamApi';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router';
import { PATHS } from '@/routes/paths';
import { categoryApi } from '@/api/categoryApi';
import type { CategoryResponse } from '@/types/categoryType';

const streamStatus = {
  public: 'PUBLIC',
  unlisted: 'UNLISTED',
  private: 'PRIVATE',
};

const streamLatency = {
  normal: 'NORMAL',
  low: 'LOW',
  ultra: 'ULTRA',
};

export default function StreamSetupPage() {
  const { user } = useAuthStore();

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(streamStatus.public);
  const [streamKey, setStreamKey] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [copied, setCopied] = useState<'streamUrl' | 'streamKey' | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [thumbnailError, setThumbnailError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [latency, setLatency] = useState(streamLatency.normal);
  const [dvr, setDvr] = useState(true);
  const [vod, setVod] = useState(true);

  const [parentCategory, setParentCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');
  const [categoriesData, setCategoriesData] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchCategories = async () => {
      try {
        const categories = await categoryApi.getCategories();
        if (!abortController.signal.aborted && categories)
          setCategoriesData(categories);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.log(error);
      }
    };

    fetchCategories();

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const abortController = new AbortController();

    const loadStreamKey = async () => {
      try {
        const data = await streamKeyApi.getStreamKey(user.id);
        if (!abortController.signal.aborted) {
          setStreamKey(data.streamKey ?? null);
          setStreamUrl(data.streamUrl ?? null);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.error('Không thể tải stream key', error);
      }
    };

    loadStreamKey();

    return () => abortController.abort();
  }, [user?.id]);

  const handleCreateStreamKey = async () => {
    if (!user?.id) return;

    try {
      const data = await streamKeyApi.createStreamKey({
        userId: user.id,
        isActive: false,
      });
      setStreamKey(data.streamKey ?? null);
      setStreamUrl(data.streamUrl ?? null);
    } catch (error) {
      console.error('Failed to create or load stream key', error);
    }
  };

  const handleCopyStreamKey = () => {
    if (streamKey) {
      navigator.clipboard.writeText(streamKey);
      setCopied('streamKey');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleCopyStreamUrl = () => {
    if (streamUrl) {
      navigator.clipboard.writeText(streamUrl);
      setCopied('streamUrl');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleThumbnailChange = () => {
    fileInputRef.current?.click();
  };

  const handleThumbnailSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setThumbnailError('Vui lòng chọn tệp hình ảnh hợp lệ.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setThumbnailError('Kích thước ảnh không được vượt quá 5MB.');
      return;
    }

    setThumbnailFile(file);
    setThumbnail(file.name);
    setThumbnailError('');

    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
  };

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const validateForm = () => {
    let isValid = true;

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const selectedParentCategory = parentCategory.trim();

    if (!trimmedTitle) {
      setTitleError('Tiêu đề không được để trống.');
      isValid = false;
    } else if (trimmedTitle.length < 5) {
      setTitleError('Tiêu đề phải có ít nhất 5 ký tự.');
      isValid = false;
    } else if (trimmedTitle.length > 100) {
      setTitleError('Tiêu đề không được quá 100 ký tự.');
      isValid = false;
    } else {
      setTitleError('');
    }

    if (!trimmedDescription) {
      setDescriptionError('Mô tả không được để trống.');
      isValid = false;
    } else if (trimmedDescription.length < 10) {
      setDescriptionError('Mô tả phải có ít nhất 10 ký tự.');
      isValid = false;
    } else {
      setDescriptionError('');
    }

    if (!thumbnailFile) {
      setThumbnailError('Vui lòng chọn ảnh thumbnail cho buổi livestream.');
      isValid = false;
    } else {
      setThumbnailError('');
    }

    if (!selectedParentCategory) {
      setCategoryError('Vui lòng chọn chuyên mục cấp 1 và cấp 2.');
      isValid = false;
    } else {
      setCategoryError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitError('');
    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      setSubmitError('Bạn cần đăng nhập để lưu thiết lập livestream.');
      return;
    }

    setIsSubmitting(true);

    try {
      const categoryIds = [];
      if (parentCategory) categoryIds.push(parentCategory);
      if (subCategory) categoryIds.push(subCategory);
      await streamApi.createStream({
        userId: user.id,
        title,
        description,
        thumbnail: thumbnailFile,
        categoryIds,
      });
      navigate(PATHS.STREAMS.DASHBOARD);
      return;
    } catch (error) {
      console.error('Failed to save livestream settings', error);
      setSubmitError('Không thể lưu thiết lập lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeParent = categoriesData.find((cat) => cat.id === parentCategory);

  const handleParentSelect = (id: string) => {
    setParentCategory(id);
    setSubCategory('');
    setCategoryError('');
  };

  return (
    <main className="w-full bg-background text-foreground font-sans space-y-10 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Điền các thông số livestream */}
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

              {/* UI phần chuyên mục phân cấp: Chọn cấp 1 xong rồi chọn cấp 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold tracking-widest opacity-60 uppercase">
                    Chuyên mục phân cấp
                  </label>
                </div>

                <div className="space-y-4">
                  {/* Cấp 1: Chọn chuyên mục chính */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-secondary">
                      Bước 1: Chọn chuyên mục chính
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categoriesData.map((cat) => {
                        const isSelected = parentCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleParentSelect(cat.id)}
                            className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                              isSelected
                                ? 'border-primary bg-selection text-foreground'
                                : 'border-accent bg-background text-secondary hover:border-primary/50 hover:text-foreground'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold">
                                {cat.name}
                              </span>
                            </div>
                            <ChevronRight
                              className={`w-4 h-4 transition-transform ${isSelected ? 'text-primary rotate-90' : 'text-accent'}`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cấp 2: Chọn chuyên mục phụ (Chỉ hiển thị khi đã chọn cấp 1) */}
                  {parentCategory && activeParent && (
                    <div className="space-y-2 pt-2 border-t border-accent border-dashed animate-in fade-in slide-in-from-top-2 duration-200">
                      <span className="text-[11px] font-bold text-secondary">
                        Bước 2: Chọn danh mục chi tiết thuộc {activeParent.name}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeParent.subCategories &&
                          activeParent.subCategories.map((sub) => {
                            const isSubSelected = subCategory === sub.id;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => setSubCategory(sub.id)}
                                className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                                  isSubSelected
                                    ? 'border-primary bg-selection text-foreground'
                                    : 'border-accent bg-background text-secondary hover:border-primary/50 hover:text-foreground'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-bold">
                                    {sub.name}
                                  </span>
                                </div>
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSubSelected ? 'border-primary' : 'border-accent'}`}
                                >
                                  {isSubSelected && (
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Trạng thái hiển thị lựa chọn hiện tại */}
                <div className="p-3 bg-accent/30 rounded-xl flex items-center gap-2 text-xs">
                  <span className="font-bold text-secondary">Đã chọn:</span>
                  {parentCategory ? (
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <span>{activeParent?.name}</span>
                      {subCategory && (
                        <>
                          <ChevronRight className="w-3 h-3 text-secondary" />
                          <span className="text-primary">
                            {activeParent?.subCategories &&
                              activeParent?.subCategories.find(
                                (s) => s.id === subCategory,
                              )?.name}
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <span className="italic text-secondary">
                      Vui lòng chọn đầy đủ chuyên mục 2 cấp
                    </span>
                  )}
                </div>
                {categoryError && (
                  <p className="text-danger text-xs mt-1">{categoryError}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold tracking-widest opacity-60 uppercase">
                    Quyền riêng tư
                  </label>
                  <div className="space-y-3">
                    {[
                      {
                        id: streamStatus.public,
                        label: 'Công khai',
                        desc: 'Ai cũng thấy',
                        icon: Globe,
                      },
                      {
                        id: streamStatus.unlisted,
                        label: 'Không công khai',
                        desc: 'Chỉ người có link',
                        icon: Link2,
                      },
                      {
                        id: streamStatus.private,
                        label: 'Riêng tư',
                        desc: 'Chỉ mình bạn',
                        icon: Lock,
                      },
                    ].map((item) => (
                      <label
                        key={item.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:border-primary/50 ${status === item.id ? 'border-primary bg-selection' : 'border-accent'}`}
                      >
                        <input
                          type="radio"
                          name="status"
                          className="hidden"
                          checked={status === item.id}
                          onChange={() => setStatus(item.id)}
                        />
                        <item.icon
                          className={`w-5 h-5 ${status === item.id ? 'text-primary' : 'text-secondary'}`}
                        />
                        <div className="flex-grow">
                          <p className="text-sm font-bold">{item.label}</p>
                          <p className="text-[10px] text-secondary">
                            {item.desc}
                          </p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${status === item.id ? 'border-primary' : 'border-accent'}`}
                        >
                          {status === item.id && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold tracking-widest opacity-60 uppercase">
                    Hình thu nhỏ
                  </label>
                  <div
                    onClick={handleThumbnailChange}
                    className={`group relative border border-dashed rounded-3xl aspect-video flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-accent ${thumbnailError ? 'border-danger' : 'border-accent hover:border-primary'}`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailSelect}
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
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-accent">
                {submitError && (
                  <p className="text-danger text-xs">{submitError}</p>
                )}
                <div className="flex items-center justify-end gap-3">
                  {/* <Button variant="outline" type="button">Hủy thay đổi</Button> */}
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

        {/* Cột phải: Cấu hình khóa luồng kỹ thuật */}
        <div className="space-y-6">
          {/* Section Stream Key - Có kiểm tra trạng thái */}
          <section className="bg-background border border-accent rounded-3xl p-6 relative overflow-hidden min-h-[250px] flex flex-col justify-center">
            {streamKey ? (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-black tracking-tight uppercase">
                    Cấu hình phần mềm
                  </h3>
                </div>

                <StreamKeyField
                  streamUrl={streamUrl}
                  streamKey={streamKey}
                  showStreamKey={showStreamKey}
                  copied={copied}
                  onToggleShowKey={() => setShowStreamKey(!showStreamKey)}
                  onCopyUrl={handleCopyStreamUrl}
                  onCopyKey={handleCopyStreamKey}
                />
              </div>
            ) : (
              /* Trạng thái chưa đăng ký Key */
              <div className="text-center space-y-4 py-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-selection rounded-full flex items-center justify-center mx-auto mb-2 text-primary border border-primary/20">
                  <KeyRound className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase">
                    Chưa có khóa luồng
                  </h3>
                  <p className="text-[10px] text-secondary mt-1 px-4">
                    Bạn cần khởi tạo Stream Key để bắt đầu truyền tín hiệu từ
                    phần mềm (OBS, vMix...)
                  </p>
                </div>
                <Button
                  onClick={handleCreateStreamKey}
                  variant="primary"
                  className="w-full max-w-[200px] rounded-xl font-bold uppercase tracking-tight gap-2"
                >
                  <Zap className="w-4 h-4" /> Khởi tạo ngay
                </Button>
              </div>
            )}
          </section>

          {/* Cấu hình nâng cao tối ưu phát sóng */}
          <section className="bg-background border border-accent rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-black tracking-tight uppercase">
              Tối ưu phát sóng
            </h3>

            <div className="space-y-3">
              <label className="text-xs font-bold text-secondary uppercase">
                Độ trễ (Latency)
              </label>
              <div className="flex p-1 bg-accent rounded-xl border border-accent">
                {[
                  streamLatency.normal,
                  streamLatency.low,
                  streamLatency.ultra,
                ].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLatency(l)}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${latency === l ? 'bg-background text-primary shadow-sm' : 'text-secondary hover:text-foreground'}`}
                  >
                    {l === streamLatency.normal
                      ? 'Thường'
                      : l === streamLatency.low
                        ? 'Thấp'
                        : 'Cực thấp'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 border-b border-accent">
                <div className="space-y-0.5">
                  <p
                    className={`text-xs font-bold ${dvr ? 'text-foreground' : 'text-secondary'}`}
                  >
                    Chế độ tua lại (DVR)
                  </p>
                  <p
                    className={`text-[10px] italic ${dvr ? 'text-secondary' : 'text-secondary opacity-70'}`}
                  >
                    Cho phép người xem tua lại
                  </p>
                </div>
                <button type="button" onClick={() => setDvr(!dvr)}>
                  {dvr ? (
                    <ToggleRight className="w-8 h-8 text-primary" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-secondary" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <p
                    className={`text-xs font-bold ${vod ? 'text-foreground' : 'text-secondary'}`}
                  >
                    Lưu bản ghi (VOD)
                  </p>
                  <p
                    className={`text-[10px] italic ${vod ? 'text-secondary' : 'text-secondary opacity-70'}`}
                  >
                    Tự động lưu sau khi kết thúc
                  </p>
                </div>
                <button type="button" onClick={() => setVod(!vod)}>
                  {vod ? (
                    <ToggleRight className="w-8 h-8 text-primary" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-secondary" />
                  )}
                </button>
              </div>
            </div>

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
