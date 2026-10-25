# Thiết kế tách 4 tab Trợ lý soạn thảo

## Mục tiêu

Biến bốn tab hiện đang dùng chung một form thành quy trình soạn SKKN bốn bước rõ ràng cho giáo viên mầm non, giữ dữ liệu xuyên suốt và giảm phụ thuộc vào Gemini.

## Phạm vi

- Chỉ thay đổi module **Trợ lý soạn thảo**; module **Chấm điểm sáng kiến** và các chức năng không liên quan được giữ nguyên.
- Bốn tab dùng chung một `formData`, nhưng mỗi tab chỉ hiển thị dữ liệu và thao tác phù hợp với bước đó.
- Các nút `Gợi ý` / `AI gợi ý`, tối ưu tên và lập dàn ý không gọi API AI.
- `Mẫu sẵn` giữ hành vi hiện tại.
- Chỉ nút **Viết toàn văn sáng kiến kinh nghiệm** ở tab 4 tiếp tục gọi Gemini.

## Luồng đã chọn

1. **Dữ liệu thực tế**: tác giả, đơn vị, năm học, lĩnh vực, đối tượng, thuận lợi, khó khăn và số liệu khảo sát. Bổ sung kiểm tra mức độ đầy đủ và bộ gợi ý ngẫu nhiên cục bộ cho thuận lợi/khó khăn.
2. **Tối ưu tên đề tài**: nhập ý tưởng/tên ban đầu, lọc kho theo chủ đề và chọn một trong các tên đề tài gợi ý. Có chức năng tạo lượt gợi ý khác, áp dụng tên và đánh dấu phương án đang chọn.
3. **Lập dàn ý chuẩn**: nhập/chọn biện pháp, kết quả dự kiến; tạo dàn ý A–B–C từ dữ liệu đã có mà không gọi API. Có checklist hoàn thiện và gợi ý biện pháp cục bộ.
4. **Toàn văn SKKN**: hiển thị bản tổng hợp đầu vào, chọn mức chất lượng, nút viết toàn văn duy nhất và vùng kết quả ngay bên dưới; giữ sao chép, xuất Word và chuyển sang chấm điểm khi đã có kết quả.

## Kho gợi ý cục bộ

- Khoảng 50 mục cho mỗi nhóm: tên đề tài, thuận lợi, khó khăn và biện pháp.
- Mỗi lượt lấy ngẫu nhiên một tập nhỏ không trùng trong cùng lượt.
- Dữ liệu được lưu trong module riêng để không làm `App.jsx` lớn thêm và để kiểm thử độc lập.
- Nội dung phủ các chủ đề mầm non như STEAM, ngôn ngữ, vận động, cảm xúc, kỹ năng sống, dinh dưỡng, môi trường, phối hợp phụ huynh và chuyển đổi số.

## Trạng thái và khả năng sử dụng

- Tab dùng nút semantic, có `aria-current`, focus rõ và mục tiêu chạm tối thiểu 44px.
- Nội dung tab có tiêu đề, mô tả và hành động chính riêng; tab 1–3 có nút chuyển bước tiếp theo.
- Không khóa người dùng theo thứ tự cứng: vẫn có thể mở bất kỳ tab nào để sửa dữ liệu.
- Thông báo nói rõ gợi ý đến từ kho nội dung có sẵn, không gắn nhãn là kết quả AI mới sinh.
- Trên màn hình nhỏ, form và kết quả xếp một cột, không dùng chiều cao cố định khiến nội dung bị cắt.

## Phương án đã cân nhắc

- **Đã chọn:** quy trình bốn bước nối tiếp, dùng chung dữ liệu — rõ ràng và không buộc nhập lại.
- Bốn tab độc lập — loại vì tạo dữ liệu trùng và khó tổng hợp.
- Một form dài với tab neo — loại vì không giải quyết việc bốn tab có giao diện giống nhau.

## Ngoài phạm vi

- Không thay đổi API Gemini phục vụ viết toàn văn hoặc chấm điểm.
- Không thay đổi chức năng tải/đọc tài liệu, bộ tiêu chí, lịch sử chấm và xuất phiếu chấm.
- Không tạo hình ảnh hoặc nhận diện thương hiệu mới.
