const PRESCHOOL_THEMES = [
  { topic: 'phát triển ngôn ngữ qua kể chuyện sáng tạo', skill: 'giao tiếp và vốn từ', material: 'tranh truyện, rối tay và góc sách mở' },
  { topic: 'tổ chức hoạt động giáo dục STEAM', skill: 'quan sát, thử nghiệm và giải quyết vấn đề', material: 'vật liệu tái chế an toàn và học liệu mở' },
  { topic: 'rèn kỹ năng tự phục vụ', skill: 'tự lập trong sinh hoạt hằng ngày', material: 'bảng quy trình bằng hình ảnh và đồ dùng vừa tầm trẻ' },
  { topic: 'giáo dục cảm xúc tích cực', skill: 'nhận biết và điều hòa cảm xúc', material: 'thẻ cảm xúc, câu chuyện tình huống và góc bình yên' },
  { topic: 'phát triển vận động tinh', skill: 'phối hợp tay mắt và sự khéo léo', material: 'đất nặn, kẹp gỗ, hạt lớn và giấy thủ công' },
  { topic: 'khám phá thiên nhiên', skill: 'tò mò khoa học và ý thức bảo vệ môi trường', material: 'vườn trường, lá cây và nhật ký quan sát' },
  { topic: 'hình thành thói quen dinh dưỡng lành mạnh', skill: 'lựa chọn thực phẩm và vệ sinh ăn uống', material: 'mô hình bữa ăn, vườn rau và trò chơi phân loại' },
  { topic: 'phát triển thẩm mỹ qua tạo hình', skill: 'cảm thụ màu sắc và biểu đạt sáng tạo', material: 'màu nước, nguyên liệu thiên nhiên và góc nghệ thuật mở' },
  { topic: 'tăng cường phối hợp gia đình và nhà trường', skill: 'duy trì thói quen học tập nhất quán', material: 'sổ kết nối, video hướng dẫn ngắn và ngày hội trải nghiệm' },
  { topic: 'ứng dụng công nghệ số an toàn', skill: 'khám phá có mục đích và tương tác chủ động', material: 'học liệu số ngắn, máy chiếu và hoạt động trải nghiệm trực tiếp' },
]

const TITLE_PATTERNS = [
  ({ topic }) => `Một số biện pháp nâng cao hiệu quả ${topic} cho trẻ mầm non theo quan điểm lấy trẻ làm trung tâm`,
  ({ topic }) => `Giải pháp đổi mới hình thức ${topic} nhằm tạo hứng thú và phát huy tính chủ động của trẻ 4 - 5 tuổi`,
  ({ topic }) => `Xây dựng môi trường giáo dục mở hỗ trợ ${topic} cho trẻ 5 - 6 tuổi tại trường mầm non`,
  ({ topic }) => `Kinh nghiệm phối hợp với phụ huynh trong ${topic} cho trẻ 3 - 4 tuổi`,
  ({ topic }) => `Vận dụng hoạt động trải nghiệm để cải thiện chất lượng ${topic} trong lớp mẫu giáo`,
]

const ADVANTAGE_PATTERNS = [
  ({ topic }) => `Ban giám hiệu quan tâm chỉ đạo chuyên môn và tạo điều kiện để giáo viên triển khai ${topic} theo kế hoạch của lớp.`,
  ({ skill }) => `Giáo viên hiểu đặc điểm phát triển của trẻ, chủ động học hỏi và có kinh nghiệm tổ chức hoạt động rèn ${skill}.`,
  ({ material }) => `Lớp học có không gian an toàn, đủ ánh sáng và có thể linh hoạt bố trí ${material} để trẻ tự lựa chọn.`,
  ({ topic }) => `Phần lớn trẻ hào hứng với ${topic}, mạnh dạn tham gia khi hoạt động được tổ chức dưới hình thức chơi và trải nghiệm.`,
  ({ topic }) => `Phụ huynh đồng thuận với mục tiêu ${topic}, sẵn sàng chia sẻ thông tin và hỗ trợ nguyên vật liệu phù hợp cho lớp.`,
]

const DIFFICULTY_PATTERNS = [
  ({ skill }) => `Mức độ ${skill} giữa các trẻ chưa đồng đều nên giáo viên phải điều chỉnh yêu cầu và tốc độ hoạt động cho từng nhóm.`,
  ({ topic }) => `Một số trẻ còn nhút nhát, thời gian tập trung ngắn và dễ bỏ cuộc khi tham gia ${topic} ở nhiệm vụ có nhiều bước.`,
  ({ material }) => `Nguồn ${material} chưa phong phú hoặc chưa được bổ sung thường xuyên, làm hạn chế cơ hội thực hành lặp lại của trẻ.`,
  ({ topic }) => `Một bộ phận phụ huynh chưa hiểu đầy đủ vai trò của ${topic}, còn làm thay trẻ hoặc duy trì thói quen chưa thống nhất ở nhà.`,
  ({ skill }) => `Giáo viên cần thêm thời gian quan sát, ghi chép minh chứng và thiết kế tiêu chí phù hợp để đánh giá sự tiến bộ về ${skill}.`,
]

const MEASURE_PATTERNS = [
  ({ topic, material }) => `Xây dựng môi trường ${topic} theo hướng mở, sắp xếp ${material} vừa tầm để trẻ được chọn, thử và tự cất sau hoạt động.`,
  ({ skill }) => `Khảo sát đầu năm, chia nhóm linh hoạt và thiết kế nhiệm vụ từ dễ đến khó nhằm rèn ${skill} theo nhịp phát triển của từng trẻ.`,
  ({ topic }) => `Tổ chức ${topic} qua trò chơi, câu chuyện và tình huống gần gũi; thay đổi cách dẫn dắt để duy trì sự chú ý tích cực của trẻ.`,
  ({ topic, skill }) => `Phối hợp phụ huynh bằng nhiệm vụ ngắn tại nhà, hướng dẫn cách khuyến khích trẻ và phản hồi định kỳ về tiến bộ trong ${topic} và ${skill}.`,
  ({ skill }) => `Lập hồ sơ minh chứng trước - sau bằng sản phẩm, ảnh quan sát và bảng tiêu chí; dùng kết quả để điều chỉnh hoạt động phát triển ${skill}.`,
]

const expandSuggestions = (patterns) =>
  PRESCHOOL_THEMES.flatMap((theme) => patterns.map((pattern) => pattern(theme)))

export const WRITER_SUGGESTIONS = Object.freeze({
  titles: Object.freeze(expandSuggestions(TITLE_PATTERNS)),
  advantages: Object.freeze(expandSuggestions(ADVANTAGE_PATTERNS)),
  difficulties: Object.freeze(expandSuggestions(DIFFICULTY_PATTERNS)),
  measures: Object.freeze(expandSuggestions(MEASURE_PATTERNS)),
})

export function pickRandomSuggestions(items, count = 6, random = Math.random) {
  if (!Array.isArray(items) || items.length === 0 || count <= 0) return []

  const pool = [...items]
  const picked = []
  const limit = Math.min(Math.floor(count), pool.length)

  while (picked.length < limit) {
    const index = Math.min(Math.floor(random() * pool.length), pool.length - 1)
    picked.push(pool.splice(index, 1)[0])
  }

  return picked
}

const valueOrPrompt = (value, prompt) => value?.trim() || `[${prompt}]`

export function buildLocalOutline(formData = {}) {
  const title = valueOrPrompt(formData.title, 'Bổ sung tên đề tài')
  const audience = valueOrPrompt(formData.audience, 'Bổ sung đối tượng áp dụng')
  const advantages = valueOrPrompt(formData.advantages, 'Bổ sung thuận lợi thực tế')
  const difficulties = valueOrPrompt(formData.difficulties, 'Bổ sung khó khăn thực tế')
  const measures = valueOrPrompt(formData.measures, 'Bổ sung các biện pháp thực hiện')
  const results = valueOrPrompt(formData.results, 'Bổ sung kết quả dự kiến hoặc đã đạt được')

  return `ĐỀ TÀI: ${title}

A. ĐẶT VẤN ĐỀ
1. Lý do chọn đề tài
2. Mục đích nghiên cứu
3. Đối tượng và phạm vi áp dụng: ${audience}
4. Phương pháp nghiên cứu và cách thu thập minh chứng

B. GIẢI QUYẾT VẤN ĐỀ
1. Cơ sở lý luận và cơ sở thực tiễn
2. Thực trạng trước khi áp dụng
   - Thuận lợi: ${advantages}
   - Khó khăn: ${difficulties}
   - Số liệu khảo sát ban đầu: ${valueOrPrompt(formData.surveyBefore, 'Bổ sung số liệu trước áp dụng')}
3. Các biện pháp thực hiện
${measures}
4. Hiệu quả của sáng kiến
   - Kết quả: ${results}
   - Số liệu đối chứng: ${valueOrPrompt(formData.surveyAfter, 'Bổ sung số liệu sau áp dụng')}

C. KẾT LUẬN VÀ KIẾN NGHỊ
1. Bài học kinh nghiệm
2. Khả năng áp dụng và nhân rộng
3. Kiến nghị với tổ chuyên môn, nhà trường và phụ huynh`
}
