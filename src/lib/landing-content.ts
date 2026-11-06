/** Publish only with the student's explicit consent and verified source. */
export interface StudentStory {
  id: string;
  name: string;
  quote: string;
  context: string;
  consentToPublish: true;
  verifiedAt: string;
  sourceReference: string;
}
export interface PricingPlan {
  id: string;
  name: string;
  price: { amount: number; currency: "VND"; period: string };
  benefits: string[];
  checkoutHref: string;
}
// Owner confirmed: pricing and approved stories have not been published.
export const studentStories: StudentStory[] = [];
export const pricingPlans: PricingPlan[] = [];

export const landingFaq = [
  {
    category: "Luyện tập",
    question: "Tôi có thể luyện những kỹ năng nào?",
    answer:
      "Bạn có thể chọn Listening, Reading, Speaking hoặc Writing trong thư viện luyện tập. Mỗi bài có trang hướng dẫn trước khi bắt đầu. Grammar & Vocabulary chưa nằm trong phạm vi luyện tập hiện tại.",
  },
  {
    category: "Luyện tập",
    question: "Đây có phải website thi Aptis chính thức không?",
    answer:
      "AptisPlus là nền tảng luyện tập độc lập, không đại diện cho đơn vị tổ chức thi. Phòng thi mô phỏng giúp bạn làm quen với thao tác; thông tin kỳ thi chính thức cần được kiểm tra với đơn vị tổ chức.",
  },
  {
    category: "Luyện tập",
    question: "Tôi cần chuẩn bị gì để luyện Speaking?",
    answer:
      "Hãy dùng tai nghe và microphone, cho phép trình duyệt truy cập mic rồi ghi âm và nghe lại tại bước kiểm tra thiết bị. Khi làm bài, câu trả lời được ghi theo thời gian của từng phần.",
  },
  {
    category: "Bài làm & dữ liệu",
    question: "Lịch sử bài làm được lưu ở đâu?",
    answer:
      "Bản frontend hiện tại lưu bài làm trên trình duyệt đang dùng. Bản ghi Speaking được lưu cục bộ bằng IndexedDB. Dữ liệu chưa đồng bộ giữa các thiết bị và có thể mất nếu bạn xóa dữ liệu trình duyệt.",
  },
  {
    category: "Bài làm & dữ liệu",
    question: "Tôi đã được AI chấm điểm ngay chưa?",
    answer:
      "Chưa. Luồng chấm điểm AI đang được chuẩn bị và chưa kết nối dịch vụ chấm thật. Bạn vẫn có thể xem lại câu trả lời, lịch sử bài làm và bản ghi Speaking đã lưu.",
  },
  {
    category: "Truy cập",
    question: "Các gói học có giá bao nhiêu?",
    answer:
      "Bảng giá, thời hạn truy cập và chính sách của từng gói chưa được công bố. Trang hiện chưa có bước mua gói hoặc thanh toán.",
  },
  {
    category: "Truy cập",
    question: "Tôi có thể bắt đầu từ đâu?",
    answer:
      "Mở trang Luyện tập để chọn kỹ năng và xem hướng dẫn bài thi. Trong Không gian học tập, bạn có thể chủ động thêm lịch luyện và tiếp tục bài còn dang dở.",
  },
];
