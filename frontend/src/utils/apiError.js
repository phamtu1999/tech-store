const ERROR_MESSAGE_MAP = {
  INVALID_PRODUCT_ID: 'Mã sản phẩm không hợp lệ',
  INVALID_CATEGORY_ID: 'Mã danh mục không hợp lệ',
  INVALID_ROLE: 'Vai trò không hợp lệ',
  INVALID_REQUEST_FIELD: 'Dữ liệu yêu cầu không hợp lệ',
  ENTITY_NOT_FOUND: 'Không tìm thấy dữ liệu',
  SLUG_ALREADY_EXISTS: 'Đường dẫn sản phẩm đã tồn tại',
  USER_EXISTED: 'Người dùng đã tồn tại',
  USER_NOT_EXISTED: 'Tài khoản không tồn tại',
  UNAUTHORIZED: 'Bạn không có quyền thực hiện thao tác này',
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không chính xác',
}

export const unwrapApiData = (response) => {
  const data = response?.data
  if (data && typeof data === 'object' && 'result' in data) {
    return data.result
  }
  return data
}

export const getApiErrorMessage = (error, fallback = 'Có lỗi xảy ra. Vui lòng thử lại.') => {
  const code = error?.response?.data?.code
  const responseMessage = error?.response?.data?.message

  if (typeof responseMessage === 'string' && responseMessage.trim()) {
    return responseMessage
  }

  if (code && ERROR_MESSAGE_MAP[code]) {
    return ERROR_MESSAGE_MAP[code]
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message
  }

  return fallback
}
