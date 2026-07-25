export const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email không được để trống.',
  EMAIL_INVALID: 'Email không hợp lệ.',
  PASSWORD_REQUIRED: 'Mật khẩu không được để trống.',
  PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 6 ký tự.',
  NAME_REQUIRED: 'Họ và tên không được để trống.',
  NAME_MIN_LENGTH: 'Họ và tên phải có ít nhất 2 ký tự.',
  TERMS_REQUIRED: 'Bạn phải đồng ý với điều khoản dịch vụ để tiếp tục.',
} as const;

export const API_ERROR_MESSAGES = {
  LOGIN_FAILED: 'Đăng nhập thất bại. Vui lòng thử lại sau.',
  REGISTER_FAILED: 'Đăng ký thất bại. Vui lòng thử lại sau.',
} as const;

export const SETUP_VALIDATION = {
  TITLE_REQUIRED: 'Tiêu đề không được để trống.',
  TITLE_MIN_LENGTH: 'Tiêu đề phải có ít nhất 5 ký tự.',
  TITLE_MAX_LENGTH: 'Tiêu đề không được quá 100 ký tự.',
  DESCRIPTION_REQUIRED: 'Mô tả không được để trống.',
  DESCRIPTION_MIN_LENGTH: 'Mô tả phải có ít nhất 10 ký tự.',
  THUMBNAIL_REQUIRED: 'Vui lòng chọn ảnh thumbnail cho buổi livestream.',
  THUMBNAIL_TYPE: 'Vui lòng chọn tệp hình ảnh hợp lệ.',
  THUMBNAIL_SIZE: 'Kích thước ảnh không được vượt quá 5MB.',
  CATEGORY_REQUIRED: 'Vui lòng chọn chuyên mục cấp 1 và cấp 2.',
  NOT_LOGGED_IN: 'Bạn cần đăng nhập để lưu thiết lập livestream.',
  SAVE_FAILED: 'Không thể lưu thiết lập lúc này. Vui lòng thử lại sau.',
} as const;
