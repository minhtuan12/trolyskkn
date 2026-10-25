import React, { useState, useEffect, useMemo } from 'react';
import WriterAssistant from './components/WriterAssistant.jsx';
import { WRITER_SUGGESTIONS, buildLocalOutline, pickRandomSuggestions } from './data/writerSuggestions.js';

// ==================== CÁC BỘ TIÊU CHÍ CHẤM ĐIỂM CHUẨN MẦM NON ====================
const PRESET_CRITERIA_SETS = [
    {
        id: 'preschool_standard_100',
        name: 'Bộ tiêu chí chuẩn Mầm non (Thang điểm 100 - Cấp Cơ sở / Huyện)',
        description: 'Đánh giá toàn diện theo chuẩn Hướng dẫn chấm SKKN giáo dục Mầm non.',
        totalMax: 100,
        criteria: [
            {
                id: 'c1',
                group: 'I. TÍNH MỚI VÀ SÁNG TẠO (25 điểm)',
                name: '1. Tính mới và tính sáng tạo của giải pháp',
                desc: 'Giải pháp hoàn toàn mới hoặc cải tiến sáng tạo, không sao chép giải pháp đã công bố; phát hiện cách làm hay, linh hoạt, phù hợp thực tế trường/lớp mầm non.',
                max: 15,
                score: 12,
                comment: ''
            },
            {
                id: 'c2',
                group: 'I. TÍNH MỚI VÀ SÁNG TẠO (25 điểm)',
                name: '2. Ứng dụng phương pháp giáo dục đổi mới',
                desc: 'Tích hợp sáng tạo STEAM, lấy trẻ làm trung tâm, giáo dục cảm xúc (SEL), ứng dụng công nghệ và nguyên vật liệu thiên nhiên tái chế.',
                max: 10,
                score: 8,
                comment: ''
            },
            {
                id: 'c3',
                group: 'II. TÍNH KHẢ THI VÀ ÁP DỤNG THỰC TIỄN (30 điểm)',
                name: '3. Phù hợp đặc điểm tâm sinh lý trẻ & thực tiễn trường',
                desc: 'Phù hợp độ tuổi nhóm/lớp (nhà trẻ, 3-4, 4-5, 5-6 tuổi), phù hợp điều kiện thực tế của Trường MN Tô Hiến Thành.',
                max: 15,
                score: 13,
                comment: ''
            },
            {
                id: 'c4',
                group: 'II. TÍNH KHẢ THI VÀ ÁP DỤNG THỰC TIỄN (30 điểm)',
                name: '4. Biện pháp chi tiết, rõ ràng, có quy trình tổ chức',
                desc: 'Các biện pháp có các bước rõ ràng (Mục tiêu, Chuẩn bị, Cách tiến hành, Ví dụ hoạt động, Tình huống xử lý sư phạm).',
                max: 15,
                score: 12,
                comment: ''
            },
            {
                id: 'c5',
                group: 'III. HIỆU QUẢ VÀ MINH CHỨNG ĐỐI CHỨNG (30 điểm)',
                name: '5. Minh chứng và số liệu khảo sát đối chứng trước - sau',
                desc: 'Có bảng khảo sát đầu năm và cuối năm, số liệu đối chứng rõ ràng, tỷ lệ % tăng giảm hợp lý, minh chứng hình ảnh/sản phẩm của trẻ.',
                max: 15,
                score: 12,
                comment: ''
            },
            {
                id: 'c6',
                group: 'III. HIỆU QUẢ VÀ MINH CHỨNG ĐỐI CHỨNG (30 điểm)',
                name: '6. Hiệu quả đối với trẻ, giáo viên, phụ huynh & nhà trường',
                desc: 'Trẻ hứng thú, chuyển biến rõ rệt; phụ huynh đồng thuận; có giá trị nhân rộng trong tổ chuyên môn và nhà trường.',
                max: 15,
                score: 13,
                comment: ''
            },
            {
                id: 'c7',
                group: 'IV. THỂ THỨC TRÌNH BÀY VÀ VĂN PHONG (15 điểm)',
                name: '7. Bố cục, văn phong sư phạm và kỹ thuật soạn thảo',
                desc: 'Cấu trúc 3 phần (A. Đặt vấn đề, B. Giải quyết vấn đề, C. Kết luận & kiến nghị); không lỗi chính tả, văn phong chuẩn mực sư phạm.',
                max: 15,
                score: 13,
                comment: ''
            }
        ]
    },
    {
        id: 'school_quick_50',
        name: 'Bộ tiêu chí đánh giá nhanh Cấp Trường (Thang điểm 50)',
        description: 'Dành cho Tổ chuyên môn thẩm định sơ khảo tại Trường MN Tô Hiến Thành.',
        totalMax: 50,
        criteria: [
            { id: 'sq1', group: 'ĐÁNH GIÁ SƠ KHẢO', name: '1. Tính mới & Sự tâm huyết của giáo viên', desc: 'Có sự đầu tư suy nghĩ, tìm tòi giải pháp phù hợp nhóm lớp.', max: 10, score: 8, comment: '' },
            { id: 'sq2', group: 'ĐÁNH GIÁ SƠ KHẢO', name: '2. Tính khả thi của các biện pháp', desc: 'Dễ làm, đồ dùng đồ chơi tự tạo an toàn, trẻ hứng thú tham gia.', max: 15, score: 12, comment: '' },
            { id: 'sq3', group: 'ĐÁNH GIÁ SƠ KHẢO', name: '3. Hiệu quả cải thiện sự phát triển của trẻ', desc: 'Có sự chuyển biến tích cực ở kỹ năng hoặc thể chất của trẻ.', max: 15, score: 12, comment: '' },
            { id: 'sq4', group: 'ĐÁNH GIÁ SƠ KHẢO', name: '4. Thể thức trình bày và tính trung thực', desc: 'Đúng quy cách văn bản ngành, số liệu chân thực.', max: 10, score: 8, comment: '' }
        ]
    }
];

// Kho gợi ý thực tế có sẵn cho mầm non
const PRESET_QUICK_SUGGESTIONS = {
    advantages: [
        "Ban Giám hiệu luôn quan tâm chỉ đạo sâu sát, đầu tư đầy đủ trang thiết bị, giấy vẽ, sáp màu, kéo an toàn và phòng học rộng rãi, thoáng mát, đủ ánh sáng.",
        "Bản thân giáo viên nhiệt tình, tâm huyết, yêu nghề mến trẻ, có năng khiếu tạo hình và luôn tích cực tự học, đổi mới phương pháp giảng dạy.",
        "Lớp học được phân chia theo đúng độ tuổi mẫu giáo bé (3 - 4 tuổi), sĩ số trẻ trong lớp đạt định mức quy định của Điều lệ trường mầm non.",
        "Đa số phụ huynh nhiệt tình ủng hộ, sẵn sàng phối hợp cùng cô giáo sưu tầm các loại nguyên vật liệu thiên nhiên và phế liệu an toàn phục vụ giờ học.",
        "Môi trường xung quanh khuôn viên Trường Mầm non Tô Hiến Thành có nhiều cây xanh, hoa lá, cung cấp nguồn học liệu thiên nhiên phong phú cho trẻ quan sát và trải nghiệm."
    ],
    difficulties: [
        "Đầu năm học, nhiều trẻ mới từ nhà trẻ lên hoặc lần đầu đến trường nên còn bỡ ngỡ, hay khóc, chưa quen với nền nếp sinh hoạt và hoạt động có chủ đích.",
        "Kỹ năng vận động tinh của trẻ 3 - 4 tuổi còn yếu, cơ tay vụng về, trẻ cầm bút sáp, chấm hồ dán hoặc xé dán còn lóng ngóng, dễ làm rách giấy.",
        "Khả năng tập trung chú ý của lứa tuổi mẫu giáo bé chưa bền vững, trẻ nhanh chán, dễ phân tán sự chú ý sang các đồ chơi khác trong lớp.",
        "Một số trẻ còn nhút nhát, e dè, sợ lấm lem tay khi tiếp xúc với màu nước, đất nặn, chưa tự tin tham gia thể hiện sản phẩm của mình.",
        "Nhận thức và sự khéo léo giữa các trẻ trong lớp không đồng đều; một số phụ huynh quá nuông chiều làm thay con ở nhà khiến trẻ thiếu kỹ năng tự lập."
    ],
    measures: [
        "Xây dựng môi trường không gian góc nghệ thuật mở, sắp xếp đồ dùng trực quan, bắt mắt, đa dạng học liệu tạo cảm hứng sáng tạo cho trẻ.",
        "Đổi mới phương pháp dạy học bằng cách tích hợp các bài thơ, đồng dao, câu chuyện kể và trò chơi âm nhạc sinh động để dẫn dắt trẻ vào giờ tạo hình.",
        "Rèn luyện các kỹ năng tạo hình từ cơ bản đến nâng cao phù hợp độ tuổi 3-4 tuổi: in dấu vân tay, chấm màu tăm bông, xé dán giấy mềm, lăn màu bằng bi, in hình lá cây.",
        "Tận dụng tối đa các nguyên vật liệu thiên nhiên gần gũi (hột hạt, lá khô, cành cây nhỏ, vỏ ngao) và vỏ hộp tái chế an toàn kích thích trí tò mò của trẻ.",
        "Khen ngợi, khích lệ kịp thời từng tiến bộ nhỏ của trẻ; tổ chức 'Triển lãm tranh nhí' tại lớp để trẻ tự hào về sản phẩm do chính tay mình tạo ra.",
        "Tuyên truyền, phối hợp chặt chẽ với phụ huynh qua góc phụ huynh và nhóm Zalo lớp để hướng dẫn cha mẹ cùng con rèn kỹ năng tạo hình tại nhà."
    ]
};

// Kho mẫu đề tài hay
const SAMPLE_TOPICS = [
    {
        domain: "Phát triển Thẩm mỹ / Tạo hình",
        title: "Một số biện pháp giúp trẻ 3-4 tuổi hứng thú tham gia hoạt động tạo hình tại Trường Mầm non Tô Hiến Thành",
        field: "Phát triển thẩm mỹ",
        audience: "Trẻ mẫu giáo bé (3 - 4 tuổi)"
    },
    {
        domain: "Phát triển Ngôn ngữ & Kỹ năng",
        title: "Biện pháp rèn luyện kỹ năng giao tiếp mạnh dạn, tự tin cho trẻ 5-6 tuổi sẵn sàng bước vào lớp 1",
        field: "Phát triển ngôn ngữ",
        audience: "Trẻ mẫu giáo lớn (5 - 6 tuổi)"
    },
    {
        domain: "Phương pháp Giáo dục STEAM",
        title: "Ứng dụng phương pháp giáo dục STEAM trong việc tổ chức các hoạt động khám phá khoa học cho trẻ mầm non",
        field: "Khám phá khoa học - STEAM",
        audience: "Trẻ 4 - 5 tuổi và 5 - 6 tuổi"
    },
    {
        domain: "Giáo dục Kỹ năng sống & Tình cảm",
        title: "Một số kinh nghiệm giáo dục kỹ năng tự phục vụ và bảo vệ bản thân cho trẻ 3-4 tuổi trong trường mầm non",
        field: "Kỹ năng xã hội",
        audience: "Trẻ mẫu giáo bé (3 - 4 tuổi)"
    },
    {
        domain: "Phối hợp Gia đình & Nhà trường",
        title: "Nâng cao hiệu quả phối kết hợp giữa cô giáo và phụ huynh trong việc chăm sóc, nuôi dưỡng trẻ bán trú tại trường mầm non Tô Hiến Thành",
        field: "Công tác phối hợp phụ huynh",
        audience: "Nhóm trẻ và mẫu giáo"
    }
];

export default function App() {
    // Mode chính: 'writer' (Trợ lý soạn thảo) hoặc 'evaluator' (Chấm điểm sáng kiến)
    const [appMode, setAppMode] = React.useState('writer');

    // State Module Soạn thảo
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Đang xử lý...');
    const [toast, setToast] = useState('');
    const [error, setError] = useState(null);
    const [result, setResult] = useState('');
    const [level, setLevel] = useState('Tốt');
    const [showTemplatesModal, setShowTemplatesModal] = useState(false);

    // Dữ liệu biểu mẫu soạn thảo
    const [formData, setFormData] = useState({
        school: 'Trường Mầm non Tô Hiến Thành',
        author: 'Cô giáo Phạm Thị Tuyết',
        schoolYear: '2025 - 2026',
        title: '',
        field: '',
        audience: '',
        advantages: '',
        difficulties: '',
        measures: '',
        results: '',
        surveyBefore: '',
        surveyAfter: ''
    });

    // Gợi ý AI cho Soạn thảo
    const [advSuggestions, setAdvSuggestions] = useState([]);
    const [diffSuggestions, setDiffSuggestions] = useState([]);
    const [measureSuggestions, setMeasureSuggestions] = useState([]);
    const [titleSuggestions, setTitleSuggestions] = useState([]);
    const [outline, setOutline] = useState('');
    const [suggestingField, setSuggestingField] = useState(null);

    // State Module Chấm điểm Sáng kiến
    const [evalTab, setEvalTab] = useState('evalForm'); // 'evalForm' | 'upload' | 'aiAudit' | 'criteriaConfig' | 'history'
    const [evalMeta, setEvalMeta] = useState({
        title: '',
        author: 'Cô giáo Phạm Thị Tuyết',
        coAuthors: '',
        school: 'Trường Mầm non Tô Hiến Thành',
        field: '',
        evalLevel: 'Cấp cơ sở (Cấp Trường / Quận / Huyện)',
        schoolYear: '2025 - 2026',
        evaluatorName: 'Hội đồng Khoa học & Sáng kiến Trường MN Tô Hiến Thành',
        evalDate: new Date().toISOString().split('T')[0]
    });

    const [initiativeContent, setInitiativeContent] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [selectedPresetId, setSelectedPresetId] = useState('preschool_standard_100');
    const [criteriaList, setCriteriaList] = useState(PRESET_CRITERIA_SETS[0].criteria);

    const [overallStrengths, setOverallStrengths] = useState('Đề tài bám sát tâm lý lứa tuổi 3-4 tuổi, các hình thức tổ chức tạo hình (chấm vân tay, in lá cây, xé dán giấy mềm) rất gần gũi và kích thích được sự tập trung của trẻ.');
    const [overallWeaknesses, setOverallWeaknesses] = useState('Phần minh chứng đối chứng cần bổ sung thêm hình ảnh sản phẩm tạo hình đầu năm so với cuối năm của trẻ để tăng tính thuyết phục.');
    const [improvementSuggestions, setImprovementSuggestions] = useState('Bổ sung thêm 2-3 tình huống sư phạm khi trẻ làm hỏng tranh hoặc dính bẩn vào quần áo; lồng ghép thêm góc trưng bày sản phẩm do chính trẻ tự đặt tên tranh.');

    const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
    const [aiAnalyzing, setAiAnalyzing] = useState(false);

    // Lịch sử chấm
    const [evalHistory, setEvalHistory] = useState([
        {
            id: 'SK-2026-001',
            title: 'Một số biện pháp giúp trẻ 4-5 tuổi phát triển thẩm mỹ qua hoạt động tạo hình từ nguyên vật liệu thiên nhiên',
            author: 'Cô giáo Phạm Thị Tuyết',
            field: 'Phát triển Thẩm mỹ',
            evalDate: '2026-03-15',
            evaluatorName: 'Ban Giám Hiệu',
            totalScore: 91,
            maxScore: 100,
            rank: 'Xuất sắc / Loại A',
            recommendation: 'Đề nghị công nhận phạm vi ảnh hưởng cấp Huyện/Thành phố'
        },
        {
            id: 'SK-2026-002',
            title: 'Ứng dụng giáo dục STEAM trong việc tổ chức hoạt động khám phá khoa học cho trẻ 5-6 tuổi',
            author: 'Cô giáo Phạm Thị Tuyết',
            field: 'Khám phá khoa học - STEAM',
            evalDate: '2026-03-20',
            evaluatorName: 'Tổ Chuyên Môn Mẫu Giáo',
            totalScore: 84,
            maxScore: 100,
            rank: 'Tốt / Loại B',
            recommendation: 'Đạt sáng kiến cấp cơ sở, áp dụng nhân rộng toàn trường'
        }
    ]);

    // Đảm bảo các script mở rộng (Mammoth & PDF.js) có sẵn nếu cần đọc file
    useEffect(() => {
        if (!window.mammoth) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
            document.head.appendChild(script);
        }
        if (!window.pdfjsLib) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
            script.onload = () => {
                if (window.pdfjsLib) {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                }
            };
            document.head.appendChild(script);
        }
    }, []);

    const showNotification = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3500);
    };

    // Hàm gọi AI Gemini
    const callGemini = async (prompt, systemInstruction = "", msg = "Đang xử lý...") => {
        setLoading(true);
        setLoadingMessage(msg);
        setError(null);
        
        let retries = 0;
        const maxRetries = 3;
        
        const executeRequest = async () => {
            try {
                const response = await fetch('/api/gemini', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt,
                        systemInstruction
                    })
                });

                if (!response.ok) throw new Error('Yêu cầu không thành công.');
                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text;
            } catch (err) {
                if (retries < maxRetries) {
                    const delay = Math.pow(2, retries) * 1000;
                    retries++;
                    await new Promise(res => setTimeout(res, delay));
                    return executeRequest();
                }
                throw err;
            }
        };

        try {
            const text = await executeRequest();
            setLoading(false);
            return text;
        } catch {
            setLoading(false);
            setError("Đã có sự cố kết nối AI. Thầy Cô vui lòng kiểm tra kết nối mạng hoặc thử lại nhé! 🌿");
            return null;
        }
    };

    // Điểm số và xếp loại
    const totalScore = useMemo(() => {
        return criteriaList.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
    }, [criteriaList]);

    const totalMaxScore = useMemo(() => {
        return criteriaList.reduce((acc, curr) => acc + (Number(curr.max) || 0), 0);
    }, [criteriaList]);

    const ratingRank = useMemo(() => {
        if (totalMaxScore === 0) return { rank: 'Chưa xác định', color: 'bg-slate-100 text-slate-700', badge: 'Chưa chấm' };
        const percentage = (totalScore / totalMaxScore) * 100;
        if (percentage >= 85) return { rank: 'Xuất sắc / Loại A', color: 'bg-emerald-600 text-white', badge: 'Đề nghị cấp cao hơn công nhận', percent: percentage.toFixed(1) };
        if (percentage >= 70) return { rank: 'Tốt / Loại B', color: 'bg-blue-600 text-white', badge: 'Đạt sáng kiến cấp cơ sở', percent: percentage.toFixed(1) };
        if (percentage >= 50) return { rank: 'Đạt / Loại C', color: 'bg-amber-500 text-white', badge: 'Công nhận cấp trường', percent: percentage.toFixed(1) };
        return { rank: 'Không đạt yêu cầu', color: 'bg-rose-600 text-white', badge: 'Cần bổ sung hoàn thiện lại', percent: percentage.toFixed(1) };
    }, [totalScore, totalMaxScore]);

    // Xử lý điểm từng tiêu chí
    const handleScoreChange = (id, newScore) => {
        const item = criteriaList.find(c => c.id === id);
        const maxVal = item ? item.max : 100;
        const num = Math.max(0, Math.min(newScore, maxVal));
        setCriteriaList(prev => prev.map(c => c.id === id ? { ...c, score: num } : c));
    };

    const handleCommentChange = (id, text) => {
        setCriteriaList(prev => prev.map(c => c.id === id ? { ...c, comment: text } : c));
    };

    const handleSelectPreset = (presetId) => {
        setSelectedPresetId(presetId);
        const found = PRESET_CRITERIA_SETS.find(p => p.id === presetId);
        if (found) {
            setCriteriaList(JSON.parse(JSON.stringify(found.criteria)));
            showNotification(`Đã áp dụng: ${found.name}`);
        }
    };

    // Đọc file Word (DOCX) hoặc PDF
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploadedFileName(file.name);
        setInitiativeContent('');

        try {
            const ext = file.name.split('.').pop().toLowerCase();
            let fullText = '';

            if (ext === 'docx') {
                const arrayBuffer = await file.arrayBuffer();
                if (window.mammoth) {
                    const res = await window.mammoth.extractRawText({ arrayBuffer });
                    fullText = res.value || '';
                } else {
                    throw new Error('Thư viện Mammoth chưa sẵn sàng');
                }
            } else if (ext === 'pdf') {
                const arrayBuffer = await file.arrayBuffer();
                if (window.pdfjsLib) {
                    const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
                    const pdf = await loadingTask.promise;
                    let extracted = '';
                    for (let i = 1; i <= Math.min(pdf.numPages, 40); i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        extracted += `\n--- Trang ${i} ---\n` + pageText;
                    }
                    fullText = extracted;
                } else {
                    throw new Error('Thư viện PDF.js chưa sẵn sàng');
                }
            } else {
                fullText = await file.text();
            }

            setInitiativeContent(fullText);
            showNotification(`Tải thành công tệp "${file.name}"!`);

            if (fullText.length > 80) {
                autoRecognizeMetadata(fullText);
            }
        } catch (err) {
            console.error(err);
            setError(`Không thể giải nén file ${file.name}. Bạn có thể dán văn bản trực tiếp nhé!`);
        }
    };

    // AI nhận diện thông tin tác giả và đề tài
    const autoRecognizeMetadata = async (textSample) => {
        const sample = textSample.substring(0, 3500);
        const systemPrompt = `Bạn là thư ký hội đồng chấm sáng kiến kinh nghiệm mầm non.
        Trích xuất thông tin sang JSON:
        {
          "title": "Tên sáng kiến kinh nghiệm",
          "author": "Họ và tên tác giả chính",
          "coAuthors": "Đồng tác giả (nếu có)",
          "school": "Tên trường / đơn vị",
          "field": "Lĩnh vực nghiên cứu",
          "schoolYear": "Năm học"
        }
        Chỉ trả về JSON thuần túy.`;

        try {
            const res = await callGemini(sample, systemPrompt, "Đang tự động nhận diện thông tin đề tài...");
            if (res) {
                const cleanJson = res.replace(/```json/gi, '').replace(/```/gi, '').trim();
                const parsed = JSON.parse(cleanJson);
                setEvalMeta(prev => ({
                    ...prev,
                    title: parsed.title || prev.title,
                    author: parsed.author || prev.author,
                    coAuthors: parsed.coAuthors || prev.coAuthors,
                    school: parsed.school || prev.school,
                    field: parsed.field || prev.field,
                    schoolYear: parsed.schoolYear || prev.schoolYear
                }));
                showNotification("Đã tự động trích xuất thông tin tác giả & đề tài!");
            }
        } catch (e) {
            console.log('Không parse được JSON metadata:', e);
        }
    };

    // AI Thẩm định khách quan
    const handleRunAIEvaluation = async () => {
        const textToEvaluate = initiativeContent.trim() || result.trim();
        if (!textToEvaluate || textToEvaluate.length < 100) {
            showNotification("Vui lòng tải tệp sáng kiến hoặc dán nội dung văn bản để AI thẩm định!");
            setEvalTab('upload');
            return;
        }

        setAiAnalyzing(true);
        const criteriaDesc = criteriaList.map((c, i) => `${i + 1}. ${c.name} (Tối đa: ${c.max}đ): ${c.desc}`).join('\n');

        const systemPrompt = `Bạn là Chủ tịch Hội đồng thẩm định Sáng kiến kinh nghiệm bậc Mầm non.
Thẩm định khách quan, khoa học, phát hiện nội dung còn yếu, thiếu minh chứng hoặc chưa rõ tính mới.

BỘ TIÊU CHÍ:
${criteriaDesc}

QUY TẮC:
1. Phát hiện cụ thể phần lý thuyết sáo rỗng, thiếu khảo sát trước-sau hoặc thiếu ví dụ thực tế.
2. Gợi ý điểm số khách quan.
3. Đưa ra hướng nâng cấp lên loại Tốt/Xuất sắc mà không làm thay đổi ý tưởng gốc.

CẤU TRÚC KẾT QUẢ:
# KẾT QUẢ THẨM ĐỊNH SÁNG KIẾN KINH NGHIỆM
## 1. TỔNG QUAN ĐÁNH GIÁ & ĐIỂM SỐ DỰ KIẾN
## 2. PHÂN TÍCH ĐIỂM MẠNH NỔI BẬT
## 3. CÁC HẠN CHẾ & NỘI DUNG CẦN BỔ SUNG MINH CHỨNG
## 4. GỢI Ý ĐẶC BIỆT ĐỂ ĐẠT ĐIỂM CAO`;

        const userPrompt = `Đề tài: ${evalMeta.title}\nTác giả: ${evalMeta.author} - Trường: ${evalMeta.school}\nLĩnh vực: ${evalMeta.field}\nNội dung sáng kiến:\n${textToEvaluate.substring(0, 8000)}`;

        const res = await callGemini(userPrompt, systemPrompt, "Chủ tịch Hội đồng AI đang thẩm định từng tiêu chí...");
        setAiAnalyzing(false);
        if (res) {
            setAiAnalysisResult(res);
            setEvalTab('aiAudit');
            showNotification("Thẩm định AI hoàn tất! Xem phân tích rubric chi tiết.");
        }
    };

    const handleSaveEvaluation = () => {
        if (!evalMeta.title.trim()) {
            showNotification("Vui lòng nhập tên sáng kiến trước khi lưu!");
            return;
        }

        const newRecord = {
            id: `SK-${new Date().getFullYear()}-${String(evalHistory.length + 1).padStart(3, '0')}`,
            title: evalMeta.title,
            author: evalMeta.author || 'Cô giáo Phạm Thị Tuyết',
            field: evalMeta.field || 'Giáo dục Mầm non',
            evalDate: evalMeta.evalDate,
            evaluatorName: evalMeta.evaluatorName,
            totalScore: totalScore,
            maxScore: totalMaxScore,
            rank: ratingRank.rank,
            recommendation: ratingRank.badge,
            criteriaSnapshot: JSON.parse(JSON.stringify(criteriaList))
        };

        setEvalHistory([newRecord, ...evalHistory]);
        showNotification(`Đã lưu phiếu chấm [${newRecord.id}] vào lịch sử! 🎉`);
        setEvalTab('history');
    };

    // Xuất phiếu chấm điểm ra Word (.doc)
    const handleExportScoreSheetWord = () => {
        const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>Phieu_Cham_SKKN_${evalMeta.author}</title>
            <style>
                @page { size: A4; margin: 2.0cm 2.0cm 2.0cm 2.5cm; }
                body { font-family: 'Times New Roman', serif; line-height: 1.45; font-size: 13pt; color: #000; }
                .text-center { text-align: center; }
                .bold { font-weight: bold; }
                .uppercase { text-transform: uppercase; }
                table { width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 15px; }
                th, td { border: 1px solid #000; padding: 6px 8px; font-size: 12pt; vertical-align: top; }
                th { background-color: #f2f2f2; text-align: center; font-weight: bold; }
            </style>
        </head>
        <body>
            <table style="border: none; margin-bottom: 10px;">
                <tr style="border: none;">
                    <td style="border: none; width: 45%; text-align: center; font-size: 11pt;">
                        <strong>PHÒNG GD&ĐT HUYỆN ĐAN PHƯỢNG</strong><br>
                        <strong>${evalMeta.school.toUpperCase()}</strong><br>
                        ----------------
                    </td>
                    <td style="border: none; width: 55%; text-align: center; font-size: 11pt;">
                        <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
                        <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
                        ----------------
                    </td>
                </tr>
            </table>

            <div class="text-center">
                <div style="font-size: 15pt; font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 5px;">PHIẾU ĐÁNH GIÁ, CHẤM ĐIỂM SÁNG KIẾN KINH NGHIỆM</div>
                <div style="font-style: italic; margin-bottom: 15px;">Năm học: ${evalMeta.schoolYear} - Cấp đánh giá: ${evalMeta.evalLevel}</div>
            </div>

            <table style="border: none; margin-bottom: 12px;">
                <tr style="border: none;"><td style="border: none; padding: 3px 0;"><strong>1. Tên sáng kiến:</strong> ${evalMeta.title}</td></tr>
                <tr style="border: none;"><td style="border: none; padding: 3px 0;"><strong>2. Tác giả sáng kiến:</strong> ${evalMeta.author} ${evalMeta.coAuthors ? `(Đồng tác giả: ${evalMeta.coAuthors})` : ''}</td></tr>
                <tr style="border: none;"><td style="border: none; padding: 3px 0;"><strong>3. Đơn vị công tác:</strong> ${evalMeta.school} | <strong>Lĩnh vực:</strong> ${evalMeta.field}</td></tr>
                <tr style="border: none;"><td style="border: none; padding: 3px 0;"><strong>4. Họ và tên người chấm/Hội đồng:</strong> ${evalMeta.evaluatorName}</td></tr>
                <tr style="border: none;"><td style="border: none; padding: 3px 0;"><strong>5. Ngày đánh giá:</strong> ${evalMeta.evalDate}</td></tr>
            </table>

            <div class="bold" style="margin-top: 10px; margin-bottom: 6px;">BẢNG ĐÁNH GIÁ CHI TIẾT THEO TIÊU CHÍ:</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 8%;">STT</th>
                        <th style="width: 47%;">Nội dung / Tiêu chí đánh giá</th>
                        <th style="width: 12%;">Điểm tối đa</th>
                        <th style="width: 13%;">Điểm chấm</th>
                        <th style="width: 20%;">Ý kiến nhận xét cụ thể</th>
                    </tr>
                </thead>
                <tbody>
                    ${criteriaList.map((c, idx) => `
                        <tr>
                            <td class="text-center">${idx + 1}</td>
                            <td><strong>${c.name}</strong><br><span style="font-size: 10.5pt; color: #333;">${c.desc}</span></td>
                            <td class="text-center bold">${c.max}</td>
                            <td class="text-center bold" style="font-size: 13pt; color: #b91c1c;">${c.score}</td>
                            <td style="font-size: 11pt;">${c.comment || '-'}</td>
                        </tr>
                    `).join('')}
                    <tr style="background-color: #f8fafc;">
                        <td colspan="2" class="text-center bold" style="font-size: 13pt;">TỔNG CỘNG ĐIỂM ĐÁNH GIÁ</td>
                        <td class="text-center bold" style="font-size: 13pt;">${totalMaxScore}</td>
                        <td class="text-center bold" style="font-size: 15pt; color: #b91c1c;">${totalScore}</td>
                        <td class="bold text-center">${ratingRank.rank}</td>
                    </tr>
                </tbody>
            </table>

            <div style="margin-top: 15px;">
                <p><strong>Xếp loại chung:</strong> <span style="font-size: 14pt; font-weight: bold; color: #b91c1c;">${ratingRank.rank}</span> (${ratingRank.badge})</p>
                <p><strong>Ưu điểm nổi bật:</strong> ${overallStrengths}</p>
                <p><strong>Mặt còn hạn chế cần bổ sung:</strong> ${overallWeaknesses}</p>
                <p><strong>Gợi ý chỉnh sửa, hoàn thiện:</strong> ${improvementSuggestions}</p>
            </div>

            <table style="border: none; margin-top: 30px;">
                <tr style="border: none;">
                    <td style="border: none; width: 50%; text-align: center;">
                        <strong>XÁC NHẬN CỦA TỔ CHUYÊN MÔN</strong><br>
                        <em>(Ký, ghi rõ họ tên)</em>
                        <br><br><br><br><br>
                    </td>
                    <td style="border: none; width: 50%; text-align: center;">
                        <em>Hà Nội, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}</em><br>
                        <strong>NGƯỜI CHẤM / CHỦ TỊCH HỘI ĐỒNG</strong><br>
                        <em>(Ký, ghi rõ họ tên)</em>
                        <br><br><br><br><br>
                        <strong>${evalMeta.evaluatorName}</strong>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;

        const blob = new Blob(['\ufeff', header], { type: 'application/msword' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeName = (evalMeta.author || 'giao_vien').replace(/[^a-z0-9]/gi, '_');
        a.download = `Phieu_Cham_SKKN_${safeName}_${totalScore}d.doc`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showNotification("Đã xuất phiếu chấm sáng kiến sang Word (.doc) thành công!");
    };

    // Gợi ý cục bộ cho Thuận lợi, Khó khăn, Biện pháp — không gọi API AI.
    const handleSuggestField = (fieldType) => {
        const catalog = WRITER_SUGGESTIONS[fieldType] || [];
        const list = pickRandomSuggestions(catalog, 6);
        setSuggestingField(fieldType);

        if (fieldType === 'advantages') setAdvSuggestions(list);
        else if (fieldType === 'difficulties') setDiffSuggestions(list);
        else setMeasureSuggestions(list);

        setSuggestingField(null);
        showNotification(`Đã chọn ngẫu nhiên ${list.length} gợi ý có sẵn, không dùng API AI.`);
    };

    const appendSuggestion = (fieldType, text) => {
        const currentText = (formData[fieldType] || '').trim();
        const newText = currentText ? `${currentText}\n${text}` : text;
        setFormData(prev => ({ ...prev, [fieldType]: newText }));
        showNotification("Đã thêm gợi ý vào bài viết! 🌿");
    };

    const appendAllSuggestions = (fieldType, list) => {
        if (!list || list.length === 0) return;
        const currentText = (formData[fieldType] || '').trim();
        const joined = list.join('\n');
        const newText = currentText ? `${currentText}\n${joined}` : joined;
        setFormData(prev => ({ ...prev, [fieldType]: newText }));
        showNotification(`Đã thêm toàn bộ ${list.length} gợi ý vào bài! ✨`);
    };

    const applyPresetSuggestions = (fieldType) => {
        const list = PRESET_QUICK_SUGGESTIONS[fieldType] || [];
        appendAllSuggestions(fieldType, list);
    };

    // Gợi ý tên đề tài từ kho cục bộ.
    const handleOptimizeTitle = () => {
        setTitleSuggestions(pickRandomSuggestions(WRITER_SUGGESTIONS.titles, 6));
        setStep(2);
        showNotification("Đã chọn 6 tên đề tài từ kho 50 mẫu có sẵn.");
    };

    // Lập dàn ý theo cấu trúc chuẩn từ dữ liệu đã nhập, không gọi API AI.
    const handleGenerateOutline = () => {
        setOutline(buildLocalOutline(formData));
        setStep(3);
        showNotification("Đã tạo dàn ý A–B–C từ dữ liệu hiện có.");
    };

    // Viết toàn văn SKKN
    const handleGenerateFullText = async () => {
        const systemPrompt = `Bạn là chuyên gia viết Sáng kiến kinh nghiệm xuất sắc cấp Huyện/Thành phố bậc Mầm non.
Hãy viết một bài Sáng kiến kinh nghiệm hoàn chỉnh, sâu sắc, đạt chất lượng ${level}.
Văn phong chuẩn mực sư phạm, đượm tình yêu thương con trẻ, thực tế tại Trường Mầm non Tô Hiến Thành.
YÊU CẦU ĐẶC BIỆT:
- Đặt vấn đề thuyết phục, trích dẫn chủ trương đổi mới GDMN.
- Phân tích rõ thực trạng: Thuận lợi & Khó khăn.
- CÓ BẢNG KHẢO SÁT ĐỐI CHỨNG (Trước và Sau áp dụng) với số liệu % rõ ràng.
- Mỗi biện pháp phải có: 1. Mục tiêu, 2. Cách tiến hành, 3. Ví dụ tình huống lớp học sinh động và phản ứng của trẻ.
- Dùng gạch đầu dòng rõ ràng, không dùng dấu gạch ngang phân cách.`;

        const userPrompt = `Đề tài: ${formData.title}
Tác giả: ${formData.author} - Đơn vị: ${formData.school} - Năm học: ${formData.schoolYear}
Đối tượng: ${formData.audience} - Lĩnh vực: ${formData.field}
Thuận lợi: ${formData.advantages}
Khó khăn: ${formData.difficulties}
Biện pháp áp dụng: ${formData.measures}
Số liệu khảo sát: Đầu năm ${formData.surveyBefore} - Cuối năm ${formData.surveyAfter}
Kết quả: ${formData.results}`;

        const res = await callGemini(userPrompt, systemPrompt, "Đang soạn thảo toàn văn sáng kiến chuẩn mực...");
        if (res) {
            setResult(res);
            setStep(4);
        }
    };

    // Xuất toàn văn ra Word (.doc)
    const handleExportWriterWord = () => {
        if (!result) {
            showNotification("Chưa có nội dung bài viết. Vui lòng bấm 'VIẾT TOÀN VĂN SÁNG KIẾN' trước nhé!");
            return;
        }

        let formattedContent = result
            .replace(/^# (.*$)/gim, '<h1 style="text-align: center; font-size: 16pt; font-weight: bold; text-transform: uppercase; margin-top: 20px; margin-bottom: 15px; color: #000;">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 style="font-size: 14pt; font-weight: bold; margin-top: 16px; margin-bottom: 8px; color: #000; text-transform: uppercase;">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 style="font-size: 13pt; font-weight: bold; margin-top: 12px; margin-bottom: 6px; color: #000;">$1</h3>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/^- (.*$)/gim, '<li style="font-size: 13pt; margin-bottom: 5px; text-align: justify;">$1</li>')
            .replace(/\n\n/g, '</p><p style="font-size: 13pt; text-indent: 1.27cm; line-height: 1.5; margin-bottom: 8px; text-align: justify;">')
            .replace(/\n/g, '<br/>');

        formattedContent = formattedContent.replace(/(<li.*<\/li>)/gis, '<ul style="margin-left: 20px; padding-left: 15px;">$1</ul>');

        const wordTemplate = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>${formData.title || 'Sang_Kien_Kinh_Nghiem'}</title>
            <style>
                @page Section1 {
                    size: 21.0cm 29.7cm;
                    margin: 2.0cm 2.0cm 2.0cm 2.5cm;
                }
                div.Section1 { page: Section1; }
                body { font-family: 'Times New Roman', serif; line-height: 1.5; font-size: 13pt; color: #000; }
                p { font-size: 13pt; text-indent: 1.27cm; margin-bottom: 6pt; text-align: justify; line-height: 1.45; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 12px; }
                th, td { border: 1px solid #000; padding: 6px 8px; font-size: 12pt; }
                th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
                .page-break { page-break-before: always; }
            </style>
        </head>
        <body>
            <div class="Section1">
                <!-- TRANG BÌA CHÍNH QUY -->
                <div style="border: 4px double #000; padding: 25px 20px; min-height: 820px; text-align: center; box-sizing: border-box;">
                    <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">
                        PHÒNG GIÁO DỤC VÀ ĐÀO TẠO HUYỆN ĐAN PHƯỢNG
                    </div>
                    <div style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">
                        ${formData.school.toUpperCase()}
                    </div>
                    <div style="font-size: 12pt; margin-bottom: 50px;">-----------------***-----------------</div>

                    <div style="font-size: 20pt; font-weight: bold; text-transform: uppercase; color: #1e3a8a; margin-top: 60px; margin-bottom: 15px; line-height: 1.3;">
                        BÁO CÁO SÁNG KIẾN KINH NGHIỆM
                    </div>

                    <div style="font-size: 15pt; font-weight: bold; text-transform: uppercase; margin-top: 30px; margin-bottom: 50px; padding: 0 15px; line-height: 1.4; color: #000;">
                        ĐỀ TÀI: "${formData.title || 'MỘT SỐ BIỆN PHÁP CHĂM SÓC GIÁO DỤC TRẺ MẦM NON'}"
                    </div>

                    <div style="margin-top: 100px; text-align: left; margin-left: 70px; font-size: 13pt; line-height: 1.9;">
                        <p style="text-indent: 0; margin-bottom: 6px;"><strong>Lĩnh vực nghiên cứu:</strong> ${formData.field || 'Giáo dục Mầm non'}</p>
                        <p style="text-indent: 0; margin-bottom: 6px;"><strong>Đối tượng áp dụng:</strong> ${formData.audience || 'Trẻ mầm non'}</p>
                        <p style="text-indent: 0; margin-bottom: 6px;"><strong>Tác giả:</strong> <span style="font-size: 14pt; font-weight: bold; text-transform: uppercase;">${formData.author}</span></p>
                        <p style="text-indent: 0; margin-bottom: 6px;"><strong>Chức vụ:</strong> Giáo viên</p>
                        <p style="text-indent: 0; margin-bottom: 6px;"><strong>Đơn vị công tác:</strong> ${formData.school}</p>
                    </div>

                    <div style="margin-top: 90px; font-size: 13pt; font-weight: bold; text-transform: uppercase;">
                        HÀ NỘI, NĂM HỌC ${formData.schoolYear}
                    </div>
                </div>

                <div class="page-break"></div>

                <div style="text-align: center; margin-bottom: 25px;">
                    <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div style="font-size: 12pt; font-weight: bold;">Độc lập - Tự do - Hạnh phúc</div>
                    <div style="font-size: 11pt;">-----------------o0o-----------------</div>
                </div>

                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="font-size: 16pt; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">
                        BÁO CÁO KẾT QUẢ NGHIÊN CỨU, ÁP DỤNG SÁNG KIẾN
                    </h2>
                    <div style="font-style: italic; font-size: 12pt;">(Áp dụng đánh giá, công nhận cấp cơ sở năm học ${formData.schoolYear})</div>
                </div>

                <div style="margin-top: 15px;">
                    <p style="font-size: 13pt; text-indent: 1.27cm; line-height: 1.5; margin-bottom: 8px; text-align: justify;">
                        ${formattedContent}
                    </p>
                </div>

                <div style="margin-top: 40px; page-break-inside: avoid;">
                    <table style="border: none; width: 100%;">
                        <tr style="border: none;">
                            <td style="border: none; width: 50%; text-align: center; vertical-align: top;">
                                <strong>XÁC NHẬN CỦA BAN GIÁM HIỆU</strong><br>
                                <strong>TRƯỜNG MẦM NON TÔ HIẾN THÀNH</strong><br>
                                <em>(Ký, đóng dấu và ghi rõ họ tên)</em>
                                <br/><br/><br/><br/><br/>
                            </td>
                            <td style="border: none; width: 50%; text-align: center; vertical-align: top;">
                                <em>Hà Nội, ngày ...... tháng ...... năm 2026</em><br>
                                <strong>TÁC GIẢ SÁNG KIẾN</strong><br>
                                <em>(Ký và ghi rõ họ tên)</em>
                                <br/><br/><br/><br/><br/>
                                <strong>${formData.author}</strong>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </body>
        </html>`;

        const blob = new Blob(['\ufeff', wordTemplate], { type: 'application/msword' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        const safeFileName = (formData.title || 'SKKN_ToHienThanh')
            .replace(/[^a-zA-Z0-9\u00C0-\u1EF9\s]/g, '')
            .trim()
            .replace(/\s+/g, '_')
            .substring(0, 50);
        a.download = `SKKN_${safeFileName}_${formData.author.replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_')}.doc`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
        showNotification("Đã tải toàn văn bài SKKN (.doc) thành công! 📄✨");
    };

    // Chuyển kết quả sang Module Chấm điểm
    const transferToEvaluator = () => {
        if (!result) {
            showNotification("Vui lòng viết bài trước khi chuyển sang chấm điểm!");
            return;
        }
        setInitiativeContent(result);
        setEvalMeta(prev => ({
            ...prev,
            title: formData.title || prev.title,
            author: formData.author || prev.author,
            school: formData.school || prev.school,
            field: formData.field || prev.field,
            schoolYear: formData.schoolYear || prev.schoolYear
        }));
        setAppMode('evaluator');
        setEvalTab('evalForm');
        showNotification("Đã chuyển nội dung bài viết sang bộ chấm điểm sáng kiến! ⚖️");
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden text-slate-800 bg-gradient-to-br from-emerald-50/50 via-sky-50/30 to-pink-50/40">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white border-2 border-emerald-400 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce text-xs font-black">
                    <span className="text-base text-emerald-400">✨</span>
                    <span>{toast}</span>
                </div>
            )}

            {/* Error Notification */}
            {error && (
                <div className="fixed bottom-5 right-5 z-50 bg-rose-900 text-white border-2 border-rose-400 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold">
                    <span>⚠️</span>
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-2 text-rose-300 hover:text-white font-black">✕</button>
                </div>
            )}

            {/* HEADER CHÍNH */}
            <header className="bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 text-white p-4 md:p-5 shadow-2xl flex flex-wrap justify-between items-center px-6 md:px-12 rounded-b-[2.5rem] z-20 gap-4 border-b-4 border-emerald-300">
                <div className="flex items-center gap-3.5">
                    <div className="bg-white p-3 rounded-2xl shadow-xl rotate-2 hover:rotate-0 transition-transform cursor-pointer">
                        <span className="text-3xl">🏫</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white drop-shadow-md">
                                Trường mầm non Tô Hiến Thành
                            </h1>
                            <span className="bg-amber-400 text-slate-900 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase shadow">
                                Hệ Thống SKKN 2026
                            </span>
                            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow border border-white/30 flex items-center gap-1">
                                <span>👩‍🏫</span> Chủ sở hữu: Cô giáo Phạm Thị Tuyết
                            </span>
                        </div>
                        <p className="text-xs text-emerald-100 font-semibold mt-0.5">
                            Cổng Soạn Thảo & Chấm Điểm Sáng Kiến Kinh Nghiệm Chuẩn Ngành Giáo Dục ✨
                        </p>
                    </div>
                </div>

                {/* Chuyển đổi Mode: Trợ lý Soạn thảo trước, Chấm điểm sáng kiến sau */}
                <div className="flex items-center bg-white/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/30 gap-1.5">
                    <button
                        onClick={() => setAppMode('writer')}
                        className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all flex items-center gap-2 shadow-sm ${
                            appMode === 'writer'
                                ? 'bg-white text-teal-900 shadow-lg scale-105'
                                : 'text-white hover:bg-white/10'
                        }`}
                    >
                        <span className="text-base">✍️</span>
                        <span>TRỢ LÝ SOẠN THẢO</span>
                    </button>

                    <button
                        onClick={() => setAppMode('evaluator')}
                        className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all flex items-center gap-2 shadow-sm ${
                            appMode === 'evaluator'
                                ? 'bg-white text-emerald-900 shadow-lg scale-105'
                                : 'text-white hover:bg-white/10'
                        }`}
                    >
                        <span className="text-base">⚖️</span>
                        <span>CHẤM ĐIỂM SÁNG KIẾN</span>
                        <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold animate-pulse">MỚI</span>
                    </button>
                </div>
            </header>

            {/* MAIN CONTAINER */}
            <main className="flex-1 container mx-auto p-3 md:p-6 max-w-7xl z-10">
                {/* ========================================================= */}
                {/* PHẦN 1: TRỢ LÝ SOẠN THẢO SKKN                             */}
                {/* ========================================================= */}
                {appMode === 'writer' && (
                    <WriterAssistant
                        step={step}
                        setStep={setStep}
                        formData={formData}
                        setFormData={setFormData}
                        level={level}
                        setLevel={setLevel}
                        result={result}
                        loading={loading}
                        loadingMessage={loadingMessage}
                        advSuggestions={advSuggestions}
                        diffSuggestions={diffSuggestions}
                        measureSuggestions={measureSuggestions}
                        titleSuggestions={titleSuggestions}
                        outline={outline}
                        suggestingField={suggestingField}
                        onSuggestField={handleSuggestField}
                        onAppendSuggestion={appendSuggestion}
                        onAppendAllSuggestions={appendAllSuggestions}
                        onPresetSuggestions={applyPresetSuggestions}
                        onOptimizeTitle={handleOptimizeTitle}
                        onGenerateOutline={handleGenerateOutline}
                        onApplyTitle={(title) => {
                            setFormData((current) => ({ ...current, title }));
                            showNotification("Đã áp dụng tên đề tài đã chọn.");
                        }}
                        onClearSuggestions={(fieldType) => {
                            if (fieldType === 'advantages') setAdvSuggestions([]);
                            else if (fieldType === 'difficulties') setDiffSuggestions([]);
                            else if (fieldType === 'measures') setMeasureSuggestions([]);
                            else if (fieldType === 'titles') setTitleSuggestions([]);
                        }}
                        onGenerateFullText={handleGenerateFullText}
                        onExportWord={handleExportWriterWord}
                        onTransferToEvaluator={transferToEvaluator}
                        onCopyResult={() => {
                            if (!result) return;
                            navigator.clipboard.writeText(result);
                            showNotification("Đã sao chép toàn bộ bài viết!");
                        }}
                        onOpenTemplates={() => setShowTemplatesModal(true)}
                    />
                )}
                {appMode === 'legacy-writer' && (
                    <div className="space-y-4">
                        {/* Thanh chỉ mục tiến trình */}
                        <div className="flex justify-between mb-4 bg-white/90 p-2 rounded-2xl backdrop-blur-md overflow-x-auto gap-2 border-2 border-emerald-200 shadow-md">
                            {[
                                { step: 1, label: '1. Dữ liệu thực tế', icon: '📝' },
                                { step: 2, label: '2. Tối ưu tên đề tài', icon: '💡' },
                                { step: 3, label: '3. Lập dàn ý chuẩn', icon: '🏗️' },
                                { step: 4, label: '4. Toàn văn SKKN', icon: '🏆' }
                            ].map((item) => (
                                <button 
                                    key={item.step}
                                    onClick={() => setStep(item.step)}
                                    className={`py-2.5 px-5 whitespace-nowrap text-xs md:text-sm font-extrabold transition-all rounded-xl flex items-center gap-2 ${
                                        step === item.step 
                                            ? 'text-white bg-gradient-to-r from-emerald-600 to-sky-600 shadow-md' 
                                            : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                                    }`}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                            {/* Cột trái: Form nhập liệu */}
                            <div className="lg:col-span-5 space-y-4">
                                <div className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-emerald-200 relative max-h-[82vh] overflow-y-auto">
                                    <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-emerald-100">
                                        <h2 className="text-sm font-black text-emerald-800 flex items-center gap-2">
                                            <span className="bg-emerald-100 p-1.5 rounded-xl">🎨</span>
                                            Dữ liệu lớp mầm non
                                        </h2>
                                        <button 
                                            onClick={() => setShowTemplatesModal(true)}
                                            className="text-xs font-black text-teal-700 hover:underline flex items-center gap-1"
                                        >
                                            ⚡ Mẫu đề tài hay
                                        </button>
                                    </div>

                                    <div className="space-y-3.5">
                                        <div className="grid grid-cols-2 gap-2.5 bg-emerald-50/60 p-3 rounded-2xl border-2 border-emerald-200">
                                            <div>
                                                <label className="text-[10px] font-black text-emerald-900 uppercase block mb-1">Tác giả 👩‍🏫</label>
                                                <input 
                                                    className="w-full bg-white border border-emerald-200 p-2 rounded-xl text-xs font-bold text-slate-800 outline-none" 
                                                    value={formData.author}
                                                    onChange={e => setFormData({...formData, author: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-emerald-900 uppercase block mb-1">Năm học 📅</label>
                                                <input 
                                                    className="w-full bg-white border border-emerald-200 p-2 rounded-xl text-xs font-bold text-slate-800 outline-none" 
                                                    value={formData.schoolYear}
                                                    onChange={e => setFormData({...formData, schoolYear: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-[11px] font-black text-emerald-800 uppercase block">Tên đề tài / Ý tưởng cốt lõi 🌿</label>
                                                <button
                                                    onClick={handleOptimizeTitle}
                                                    className="text-[10px] font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 px-2 py-0.5 rounded-lg flex items-center gap-1"
                                                >
                                                    ✨ Tối ưu tên
                                                </button>
                                            </div>
                                            <textarea 
                                                className="w-full bg-emerald-50/40 border-2 border-emerald-200 focus:border-emerald-500 p-3 rounded-2xl outline-none text-xs font-bold text-slate-800 h-20 resize-none"
                                                value={formData.title}
                                                onChange={e => setFormData({...formData, title: e.target.value})}
                                                placeholder="Nhập tên đề tài hoặc ý tưởng cốt lõi của sáng kiến..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] font-black text-amber-800 uppercase block mb-1">Lĩnh vực 📚</label>
                                                <input 
                                                    className="w-full bg-amber-50/60 border border-amber-300 p-2 rounded-xl text-xs font-bold text-slate-800 outline-none" 
                                                    value={formData.field}
                                                    onChange={e => setFormData({...formData, field: e.target.value})}
                                                    placeholder="VD: Phát triển thẩm mỹ..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-sky-800 uppercase block mb-1">Đối tượng trẻ 👶</label>
                                                <input 
                                                    className="w-full bg-sky-50/60 border border-sky-300 p-2 rounded-xl text-xs font-bold text-slate-800 outline-none" 
                                                    value={formData.audience}
                                                    onChange={e => setFormData({...formData, audience: e.target.value})}
                                                    placeholder="VD: Trẻ mẫu giáo bé (3 - 4 tuổi)..."
                                                />
                                            </div>
                                        </div>

                                        {/* THUẬN LỢI & KHÓ KHĂN VỚI GỢI Ý THÔNG MINH */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {/* Thuận lợi */}
                                            <div className="bg-emerald-50/40 p-2.5 rounded-2xl border-2 border-emerald-200 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <label className="text-[10px] font-black text-emerald-800 uppercase">🍀 Thuận lợi</label>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => applyPresetSuggestions('advantages')}
                                                                className="text-[9px] font-bold bg-white text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded-md"
                                                            >
                                                                Mẫu sẵn
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                onClick={() => handleSuggestField('advantages')}
                                                                disabled={suggestingField === 'advantages'}
                                                                className="text-[9px] font-black bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                                                            >
                                                                {suggestingField === 'advantages' ? '🌀' : '✨ Gợi ý'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <textarea 
                                                        className="w-full bg-white border border-emerald-200 focus:border-emerald-500 p-2 rounded-xl text-xs font-semibold text-slate-800 h-24 resize-none outline-none leading-relaxed"
                                                        value={formData.advantages}
                                                        onChange={e => setFormData({...formData, advantages: e.target.value})}
                                                        placeholder="Nhập thuận lợi hoặc bấm Gợi ý..."
                                                    />
                                                </div>

                                                {advSuggestions.length > 0 && (
                                                    <div className="mt-2 p-2 bg-white rounded-xl border border-emerald-300 shadow-sm space-y-1.5">
                                                        <div className="flex justify-between items-center text-[10px] font-black text-emerald-800">
                                                            <span>Gợi ý thuận lợi (Bấm để thêm):</span>
                                                            <div className="flex items-center gap-1.5">
                                                                <button 
                                                                    onClick={() => appendAllSuggestions('advantages', advSuggestions)}
                                                                    className="text-[9px] font-black text-emerald-700 hover:underline"
                                                                >
                                                                    + Thêm hết
                                                                </button>
                                                                <button onClick={() => setAdvSuggestions([])} className="text-slate-400 hover:text-rose-600 font-bold">✕</button>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1 max-h-36 overflow-y-auto pr-0.5">
                                                            {advSuggestions.map((item, idx) => (
                                                                <div 
                                                                    key={idx}
                                                                    onClick={() => appendSuggestion('advantages', item)}
                                                                    className="text-[10px] bg-emerald-50/70 hover:bg-emerald-100 p-1.5 rounded-lg text-emerald-950 cursor-pointer font-medium transition-all flex items-start gap-1"
                                                                >
                                                                    <span className="text-emerald-600 font-bold">➕</span>
                                                                    <span className="flex-1">{item}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Khó khăn */}
                                            <div className="bg-rose-50/40 p-2.5 rounded-2xl border-2 border-rose-200 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <label className="text-[10px] font-black text-rose-800 uppercase">🌵 Khó khăn</label>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => applyPresetSuggestions('difficulties')}
                                                                className="text-[9px] font-bold bg-white text-rose-700 hover:bg-rose-100 border border-rose-200 px-1.5 py-0.5 rounded-md"
                                                            >
                                                                Mẫu sẵn
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                onClick={() => handleSuggestField('difficulties')}
                                                                disabled={suggestingField === 'difficulties'}
                                                                className="text-[9px] font-black bg-rose-600 hover:bg-rose-700 text-white px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                                                            >
                                                                {suggestingField === 'difficulties' ? '🌀' : '✨ Gợi ý'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <textarea 
                                                        className="w-full bg-white border border-rose-200 focus:border-rose-500 p-2 rounded-xl text-xs font-semibold text-slate-800 h-24 resize-none outline-none leading-relaxed"
                                                        value={formData.difficulties}
                                                        onChange={e => setFormData({...formData, difficulties: e.target.value})}
                                                        placeholder="Nhập khó khăn hoặc bấm Gợi ý..."
                                                    />
                                                </div>

                                                {diffSuggestions.length > 0 && (
                                                    <div className="mt-2 p-2 bg-white rounded-xl border border-rose-300 shadow-sm space-y-1.5">
                                                        <div className="flex justify-between items-center text-[10px] font-black text-rose-800">
                                                            <span>Gợi ý khó khăn (Bấm để thêm):</span>
                                                            <div className="flex items-center gap-1.5">
                                                                <button 
                                                                    onClick={() => appendAllSuggestions('difficulties', diffSuggestions)}
                                                                    className="text-[9px] font-black text-rose-700 hover:underline"
                                                                >
                                                                    + Thêm hết
                                                                </button>
                                                                <button onClick={() => setDiffSuggestions([])} className="text-slate-400 hover:text-rose-600 font-bold">✕</button>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1 max-h-36 overflow-y-auto pr-0.5">
                                                            {diffSuggestions.map((item, idx) => (
                                                                <div 
                                                                    key={idx}
                                                                    onClick={() => appendSuggestion('difficulties', item)}
                                                                    className="text-[10px] bg-rose-50/70 hover:bg-rose-100 p-1.5 rounded-lg text-rose-950 cursor-pointer font-medium transition-all flex items-start gap-1"
                                                                >
                                                                    <span className="text-rose-600 font-bold">➕</span>
                                                                    <span className="flex-1">{item}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Biện pháp */}
                                        <div className="bg-teal-50/50 p-3 rounded-2xl border-2 border-teal-200">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label className="text-[10px] font-black text-teal-900 uppercase">✨ Các biện pháp thực hiện</label>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => applyPresetSuggestions('measures')}
                                                        className="text-[9px] font-bold bg-white text-teal-800 hover:bg-teal-100 border border-teal-200 px-2 py-0.5 rounded-md"
                                                    >
                                                        Biện pháp mẫu
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleSuggestField('measures')}
                                                        disabled={suggestingField === 'measures'}
                                                        className="text-[9px] font-black bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                                                    >
                                                        {suggestingField === 'measures' ? '🌀' : '✨ AI Gợi ý'}
                                                    </button>
                                                </div>
                                            </div>
                                            <textarea 
                                                className="w-full bg-white border border-teal-200 focus:border-teal-500 p-2.5 rounded-xl text-xs font-semibold text-slate-800 h-24 resize-none outline-none leading-relaxed"
                                                value={formData.measures}
                                                onChange={e => setFormData({...formData, measures: e.target.value})}
                                                placeholder="Nhập các biện pháp sư phạm hoặc bấm AI Gợi ý..."
                                            />

                                            {measureSuggestions.length > 0 && (
                                                <div className="mt-2 p-2.5 bg-white rounded-xl border border-teal-300 shadow-sm space-y-1.5">
                                                    <div className="flex justify-between items-center text-[10px] font-black text-teal-900">
                                                        <span>Gợi ý biện pháp sáng tạo từ AI:</span>
                                                        <div className="flex items-center gap-1.5">
                                                            <button 
                                                                onClick={() => appendAllSuggestions('measures', measureSuggestions)}
                                                                className="text-[9px] font-black text-teal-700 hover:underline"
                                                            >
                                                                + Thêm toàn bộ
                                                            </button>
                                                            <button onClick={() => setMeasureSuggestions([])} className="text-slate-400 hover:text-rose-600 font-bold">✕</button>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 max-h-40 overflow-y-auto pr-0.5">
                                                        {measureSuggestions.map((item, idx) => (
                                                            <div 
                                                                key={idx}
                                                                onClick={() => appendSuggestion('measures', item)}
                                                                className="text-[11px] bg-teal-50/70 hover:bg-teal-100 p-1.5 rounded-lg text-teal-950 cursor-pointer font-medium transition-all flex items-start gap-1"
                                                            >
                                                                <span className="text-teal-600 font-bold">➕</span>
                                                                <span className="flex-1">{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-2">
                                            <button 
                                                onClick={handleGenerateFullText}
                                                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white py-3.5 rounded-2xl font-black text-xs shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <span>🚀</span> VIẾT TOÀN VĂN SÁNG KIẾN KINH NGHIỆM
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cột phải: Khung hiển thị & Xuất file */}
                            <div className="lg:col-span-7 flex flex-col h-[82vh]">
                                <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-emerald-200 flex flex-col h-full overflow-hidden relative">
                                    {/* Thanh công cụ */}
                                    <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 p-3 border-b-2 border-emerald-200 flex flex-wrap gap-2 items-center justify-between">
                                        <button
                                            onClick={transferToEvaluator}
                                            disabled={!result}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm ${
                                                result ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            }`}
                                        >
                                            <span>⚖️</span> Chuyển sang CHẤM ĐIỂM
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleExportWriterWord}
                                                disabled={!result}
                                                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
                                                    result 
                                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' 
                                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                }`}
                                                title="Tải toàn văn bài viết kèm trang bìa chuẩn Microsoft Word"
                                            >
                                                <span>📥</span>
                                                <span>Tải file Word (.doc)</span>
                                            </button>

                                            <button 
                                                onClick={() => {
                                                    if (!result) return;
                                                    navigator.clipboard.writeText(result);
                                                    showNotification("Đã sao chép toàn bộ bài viết!");
                                                }}
                                                disabled={!result}
                                                className="bg-white text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-1"
                                            >
                                                <span>📋</span> Sao chép
                                            </button>
                                        </div>
                                    </div>

                                    {/* Khung nội dung */}
                                    <div className="flex-1 p-6 overflow-y-auto relative bg-gradient-to-b from-white to-emerald-50/20">
                                        {loading && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-30 backdrop-blur-sm">
                                                <div className="text-5xl mb-2 animate-bounce">🌱</div>
                                                <p className="text-emerald-800 font-black text-sm italic">{loadingMessage}</p>
                                            </div>
                                        )}

                                        {result ? (
                                            <div className="whitespace-pre-wrap text-slate-800 text-sm leading-relaxed font-sans">
                                                {result}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                                                <span className="text-5xl">✍️</span>
                                                <h3 className="text-base font-bold text-slate-600">Trợ Lý Soạn Thảo SKKN</h3>
                                                <p className="text-xs text-center max-w-sm">
                                                    Nhập dữ liệu ở cột bên trái để AI hỗ trợ viết bài hoặc chuyển sang tab <strong>"CHẤM ĐIỂM SÁNG KIẾN"</strong> trên thanh tiêu đề để thẩm định bài có sẵn.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================= */}
                {/* PHẦN 2: MODULE CHẤM ĐIỂM SÁNG KIẾN                        */}
                {/* ========================================================= */}
                {appMode === 'evaluator' && (
                    <div className="space-y-5">
                        {/* Thanh Tab Chấm điểm */}
                        <div className="bg-white/95 p-2 rounded-2xl shadow-md border-2 border-emerald-200 flex flex-wrap gap-2 justify-between items-center backdrop-blur-md">
                            <div className="flex flex-wrap gap-1.5 overflow-x-auto">
                                {[
                                    { id: 'evalForm', label: '1. Phiếu chấm & Nhận xét', icon: '📝' },
                                    { id: 'upload', label: '2. Tải lên tài liệu (DOCX/PDF)', icon: '📤' },
                                    { id: 'aiAudit', label: '3. AI Thẩm định khách quan', icon: '🤖' },
                                    { id: 'criteriaConfig', label: '4. Cấu hình tiêu chí chấm', icon: '⚙️' },
                                    { id: 'history', label: '5. Lịch sử & Tổng hợp kết quả', icon: '📊' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setEvalTab(tab.id)}
                                        className={`px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all flex items-center gap-1.5 ${
                                            evalTab === tab.id
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                                                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                                        }`}
                                    >
                                        <span>{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    onClick={handleExportScoreSheetWord}
                                    className="bg-sky-600 hover:bg-sky-700 text-white px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                                >
                                    <span>📥</span>
                                    <span>Xuất Phiếu Word (.doc)</span>
                                </button>
                                <button
                                    onClick={handleSaveEvaluation}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                                >
                                    <span>💾</span>
                                    <span>Lưu phiếu chấm</span>
                                </button>
                            </div>
                        </div>

                        {/* TAB 1: PHIẾU CHẤM ĐIỂM CHI TIẾT */}
                        {evalTab === 'evalForm' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                                {/* Cột trái: Thông tin hành chính & Tổng điểm */}
                                <div className="lg:col-span-4 space-y-4">
                                    <div className="bg-white p-5 rounded-[2rem] shadow-xl border-4 border-emerald-200 text-center relative overflow-hidden">
                                        <div className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                                            Tổng Điểm Thẩm Định
                                        </div>
                                        <div className="my-2 flex items-baseline justify-center gap-1">
                                            <span className="text-5xl font-black text-emerald-700">{totalScore}</span>
                                            <span className="text-xl font-extrabold text-slate-400">/{totalMaxScore}</span>
                                        </div>

                                        <div className={`py-2 px-4 rounded-xl text-xs font-black inline-block uppercase tracking-wider ${ratingRank.color} shadow-sm`}>
                                            {ratingRank.rank}
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-600 mt-2">
                                            {ratingRank.badge} ({ratingRank.percent || 0}%)
                                        </p>

                                        <div className="w-full bg-slate-100 h-3 rounded-full mt-3 overflow-hidden border border-slate-200">
                                            <div
                                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500"
                                                style={{ width: `${Math.min(100, (totalScore / (totalMaxScore || 1)) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Form Thông tin sáng kiến đánh giá */}
                                    <div className="bg-white p-5 rounded-[2rem] shadow-xl border-4 border-emerald-100 space-y-3">
                                        <h3 className="text-xs font-black uppercase text-emerald-800 flex items-center gap-2 pb-2 border-b border-emerald-100">
                                            <span>📋</span> Thông tin sáng kiến đánh giá
                                        </h3>

                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Tên sáng kiến kinh nghiệm *</label>
                                            <textarea
                                                rows={2}
                                                className="w-full bg-emerald-50/50 border-2 border-emerald-200 focus:border-emerald-500 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none resize-none"
                                                value={evalMeta.title}
                                                onChange={e => setEvalMeta({ ...evalMeta, title: e.target.value })}
                                                placeholder="Nhập tên sáng kiến cần chấm..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Tác giả</label>
                                                <input
                                                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold outline-none"
                                                    value={evalMeta.author}
                                                    onChange={e => setEvalMeta({ ...evalMeta, author: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Đồng tác giả</label>
                                                <input
                                                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold outline-none"
                                                    value={evalMeta.coAuthors}
                                                    onChange={e => setEvalMeta({ ...evalMeta, coAuthors: e.target.value })}
                                                    placeholder="Nếu có..."
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Lĩnh vực</label>
                                                <input
                                                    className="w-full bg-sky-50/50 border border-sky-200 rounded-xl p-2 text-xs font-bold outline-none"
                                                    value={evalMeta.field}
                                                    onChange={e => setEvalMeta({ ...evalMeta, field: e.target.value })}
                                                    placeholder="Lĩnh vực giáo dục..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Năm học</label>
                                                <input
                                                    className="w-full bg-sky-50/50 border border-sky-200 rounded-xl p-2 text-xs font-bold outline-none"
                                                    value={evalMeta.schoolYear}
                                                    onChange={e => setEvalMeta({ ...evalMeta, schoolYear: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Người chấm / Hội đồng thẩm định</label>
                                            <input
                                                className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold outline-none"
                                                value={evalMeta.evaluatorName}
                                                onChange={e => setEvalMeta({ ...evalMeta, evaluatorName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Cột phải: Bảng tiêu chí chấm điểm */}
                                <div className="lg:col-span-8 space-y-4">
                                    <div className="bg-white p-6 md:p-7 rounded-[2.5rem] shadow-xl border-4 border-emerald-200">
                                        <div className="flex flex-wrap justify-between items-center pb-4 mb-4 border-b-2 border-emerald-100 gap-3">
                                            <div>
                                                <h2 className="text-base font-black text-emerald-900 flex items-center gap-2">
                                                    <span>⚖️</span>
                                                    Phiếu Chấm Chi Tiết Theo Tiêu Chí
                                                </h2>
                                                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                                                    Kéo thanh trượt hoặc nhập điểm trực tiếp cho từng tiêu chí.
                                                </p>
                                            </div>

                                            <button
                                                onClick={handleRunAIEvaluation}
                                                className="bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                                            >
                                                <span>🤖</span>
                                                <span>AI Thẩm định & Nhận xét</span>
                                            </button>
                                        </div>

                                        {/* Danh sách tiêu chí */}
                                        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                                            {criteriaList.map((crit, idx) => (
                                                <div key={crit.id} className="p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-300 bg-slate-50/40 transition-all space-y-2.5">
                                                    <div className="flex flex-wrap justify-between items-start gap-2">
                                                        <div className="flex-1 min-w-[260px]">
                                                            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                                                                {crit.group || `Tiêu chí ${idx + 1}`}
                                                            </div>
                                                            <h4 className="text-sm font-extrabold text-slate-800">
                                                                {crit.name}
                                                            </h4>
                                                            <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-relaxed">
                                                                {crit.desc}
                                                            </p>
                                                        </div>

                                                        {/* Khung nhập điểm */}
                                                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border-2 border-emerald-300 shadow-xs">
                                                            <span className="text-xs font-bold text-slate-500">Điểm:</span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={crit.max}
                                                                step="0.5"
                                                                value={crit.score}
                                                                onChange={(e) => handleScoreChange(crit.id, parseFloat(e.target.value) || 0)}
                                                                className="w-14 text-center font-black text-base text-emerald-700 outline-none"
                                                            />
                                                            <span className="text-xs font-extrabold text-slate-400">/{crit.max}đ</span>
                                                        </div>
                                                    </div>

                                                    {/* Thanh trượt */}
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max={crit.max}
                                                            step="0.5"
                                                            value={crit.score}
                                                            onChange={(e) => handleScoreChange(crit.id, parseFloat(e.target.value) || 0)}
                                                            className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                                                        />
                                                        <span className="text-[11px] font-bold text-slate-500 min-w-[38px] text-right">
                                                            {((crit.score / crit.max) * 100).toFixed(0)}%
                                                        </span>
                                                    </div>

                                                    {/* Nhận xét tiêu chí */}
                                                    <input
                                                        type="text"
                                                        placeholder="Ghi nhận xét ưu điểm hoặc điểm cần khắc phục của tiêu chí này..."
                                                        value={crit.comment}
                                                        onChange={(e) => handleCommentChange(crit.id, e.target.value)}
                                                        className="w-full text-xs bg-white border border-slate-200 focus:border-emerald-400 rounded-lg px-3 py-1.5 font-medium outline-none text-slate-700"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Nhận xét tổng kết */}
                                        <div className="mt-5 pt-4 border-t-2 border-slate-100 space-y-3">
                                            <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                                                <span>✍️</span> Nhận xét chung của Hội đồng / Giám khảo
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-emerald-700 block mb-1">
                                                        Ưu điểm nổi bật 🌟
                                                    </label>
                                                    <textarea
                                                        rows={2}
                                                        className="w-full bg-emerald-50/40 border-2 border-emerald-200 rounded-xl p-2.5 text-xs font-semibold outline-none resize-none"
                                                        value={overallStrengths}
                                                        onChange={e => setOverallStrengths(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-rose-700 block mb-1">
                                                        Hạn chế cần khắc phục ⚠️
                                                    </label>
                                                    <textarea
                                                        rows={2}
                                                        className="w-full bg-rose-50/40 border-2 border-rose-200 rounded-xl p-2.5 text-xs font-semibold outline-none resize-none"
                                                        value={overallWeaknesses}
                                                        onChange={e => setOverallWeaknesses(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-black uppercase text-blue-700 block mb-1">
                                                    Gợi ý nâng cao chất lượng sáng kiến (Không đổi nội dung gốc) 💡
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    className="w-full bg-sky-50/40 border-2 border-sky-200 rounded-xl p-2.5 text-xs font-semibold outline-none resize-none"
                                                    value={improvementSuggestions}
                                                    onChange={e => setImprovementSuggestions(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: TẢI LÊN TÀI LIỆU SÁNG KIẾN */}
                        {evalTab === 'upload' && (
                            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border-4 border-emerald-200 space-y-5">
                                <div className="flex justify-between items-center pb-3 border-b-2 border-emerald-100">
                                    <div>
                                        <h3 className="text-base font-black text-emerald-900 flex items-center gap-2">
                                            <span>📤</span> Nạp Tài Liệu Sáng Kiến Kinh Nghiệm
                                        </h3>
                                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                                            Hỗ trợ tệp <strong>Word (.docx)</strong>, <strong>PDF (.pdf)</strong> hoặc dán văn bản trực tiếp.
                                        </p>
                                    </div>
                                    {uploadedFileName && (
                                        <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-xl">
                                            Tệp: {uploadedFileName}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                    <div className="md:col-span-5 flex flex-col justify-center border-4 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 rounded-3xl p-6 text-center cursor-pointer transition-all">
                                        <input
                                            type="file"
                                            accept=".docx,.pdf,.txt"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="reactFileUploadInput"
                                        />
                                        <label htmlFor="reactFileUploadInput" className="cursor-pointer space-y-3">
                                            <div className="w-16 h-16 bg-white text-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-md border-2 border-emerald-200">
                                                📄
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-emerald-900">Bấm để chọn tệp DOCX hoặc PDF</h4>
                                                <p className="text-[11px] text-slate-500 font-bold mt-1">Tự động trích xuất tác giả & tên đề tài</p>
                                            </div>
                                            <span className="inline-block bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-sm">
                                                Tải tệp từ máy tính ➔
                                            </span>
                                        </label>
                                    </div>

                                    <div className="md:col-span-7 flex flex-col">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="text-xs font-black uppercase text-slate-700">Hoặc dán toàn văn bài viết vào đây:</label>
                                            <span className="text-[11px] font-bold text-slate-500">
                                                {initiativeContent ? `${initiativeContent.length} ký tự` : 'Chưa có nội dung'}
                                            </span>
                                        </div>
                                        <textarea
                                            rows={10}
                                            placeholder="Dán toàn bộ bài sáng kiến kinh nghiệm vào đây..."
                                            value={initiativeContent}
                                            onChange={e => setInitiativeContent(e.target.value)}
                                            className="w-full flex-1 bg-slate-50 border-2 border-slate-200 focus:border-emerald-400 rounded-2xl p-4 text-xs font-medium text-slate-800 outline-none resize-none leading-relaxed"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-t-2 border-slate-100">
                                    <button
                                        onClick={() => {
                                            setEvalTab('evalForm');
                                            showNotification("Đã chuyển sang phiếu chấm!");
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-md"
                                    >
                                        Bắt đầu Chấm điểm ➔
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: AI THẨM ĐỊNH KHÁCH QUAN */}
                        {evalTab === 'aiAudit' && (
                            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border-4 border-emerald-200 space-y-4">
                                <div className="flex flex-wrap justify-between items-center pb-3 border-b-2 border-emerald-100 gap-3">
                                    <div>
                                        <h3 className="text-base font-black text-emerald-900 flex items-center gap-2">
                                            <span>🤖</span> Hội Đồng Thẩm Định AI Khách Quan
                                        </h3>
                                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                                            Rà soát tính mới, tính khả thi, phát hiện thiếu sót minh chứng & gợi ý nâng bậc xếp loại.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleRunAIEvaluation}
                                        disabled={aiAnalyzing}
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                                    >
                                        <span>{aiAnalyzing ? '🌀' : '⚡'}</span>
                                        <span>{aiAnalyzing ? 'Đang thẩm định...' : 'Chạy lại Thẩm định AI'}</span>
                                    </button>
                                </div>

                                {aiAnalyzing ? (
                                    <div className="py-16 text-center space-y-3">
                                        <div className="text-5xl animate-bounce">⚖️</div>
                                        <p className="text-emerald-800 font-black text-sm italic">
                                            Hội đồng AI đang đối chiếu bài viết với Bộ tiêu chí chuẩn ngành...
                                        </p>
                                    </div>
                                ) : aiAnalysisResult ? (
                                    <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 whitespace-pre-wrap text-sm leading-relaxed text-slate-800 max-h-[60vh] overflow-y-auto">
                                        {aiAnalysisResult}
                                    </div>
                                ) : (
                                    <div className="py-16 text-center space-y-3 text-slate-400">
                                        <div className="text-5xl opacity-40">📊</div>
                                        <h4 className="text-sm font-bold text-slate-600">Chưa có kết quả thẩm định</h4>
                                        <p className="text-xs max-w-md mx-auto">
                                            Bấm nút <strong>"Chạy lại Thẩm định AI"</strong> để phân tích chuyên sâu bài viết.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 4: CẤU HÌNH TIÊU CHÍ */}
                        {evalTab === 'criteriaConfig' && (
                            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border-4 border-emerald-200 space-y-5">
                                <div className="flex justify-between items-center pb-3 border-b-2 border-emerald-100">
                                    <h3 className="text-base font-black text-emerald-900 flex items-center gap-2">
                                        <span>⚙️</span> Cấu Hình Bộ Tiêu Chí & Thang Điểm
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {PRESET_CRITERIA_SETS.map(preset => (
                                        <div
                                            key={preset.id}
                                            onClick={() => handleSelectPreset(preset.id)}
                                            className={`p-4 rounded-2xl border-3 cursor-pointer transition-all ${
                                                selectedPresetId === preset.id
                                                    ? 'border-emerald-500 bg-emerald-50/70 shadow-md'
                                                    : 'border-slate-200 hover:border-emerald-300 bg-white'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-black text-emerald-800">{preset.name}</span>
                                                <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                                    {preset.totalMax} điểm
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 font-medium">{preset.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 5: LỊCH SỬ CHẤM SÁNG KIẾN */}
                        {evalTab === 'history' && (
                            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border-4 border-emerald-200 space-y-5">
                                <div className="flex justify-between items-center pb-3 border-b-2 border-emerald-100">
                                    <h3 className="text-base font-black text-emerald-900 flex items-center gap-2">
                                        <span>📊</span> Lịch Sử Chấm & Tổng Hợp Kết Quả Sáng Kiến
                                    </h3>
                                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1.5 rounded-xl">
                                        Tổng số: {evalHistory.length} sáng kiến
                                    </span>
                                </div>

                                <div className="overflow-x-auto rounded-2xl border-2 border-slate-200">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead className="bg-emerald-700 text-white font-extrabold">
                                            <tr>
                                                <th className="p-3">Mã số</th>
                                                <th className="p-3">Tên sáng kiến kinh nghiệm</th>
                                                <th className="p-3">Tác giả</th>
                                                <th className="p-3">Lĩnh vực</th>
                                                <th className="p-3 text-center">Tổng điểm</th>
                                                <th className="p-3 text-center">Xếp loại</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 font-semibold text-slate-700">
                                            {evalHistory.map((item) => (
                                                <tr key={item.id} className="hover:bg-emerald-50/50 transition-colors">
                                                    <td className="p-3 font-mono font-bold text-slate-500">{item.id}</td>
                                                    <td className="p-3 font-bold text-slate-900 max-w-xs">{item.title}</td>
                                                    <td className="p-3">{item.author}</td>
                                                    <td className="p-3">{item.field}</td>
                                                    <td className="p-3 text-center font-black text-emerald-700 text-sm">
                                                        {item.totalScore}/{item.maxScore}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2 py-0.5 rounded-full">
                                                            {item.rank}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* MODAL KHO ĐỀ TÀI MẪU */}
            {showTemplatesModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-4 border-emerald-300">
                        <div className="flex justify-between items-center mb-3 pb-2 border-b-2 border-emerald-100">
                            <h3 className="text-sm font-black text-emerald-900 flex items-center gap-2">
                                <span>📚</span> Kho đề tài Sáng kiến kinh nghiệm Mầm non mẫu
                            </h3>
                            <button 
                                onClick={() => setShowTemplatesModal(false)}
                                className="text-slate-400 hover:text-rose-600 font-black text-base"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-2.5">
                            {SAMPLE_TOPICS.map((item, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, title: item.title, field: item.field, audience: item.audience }));
                                        setEvalMeta(prev => ({ ...prev, title: item.title, field: item.field }));
                                        setShowTemplatesModal(false);
                                        showNotification("Đã chọn đề tài mẫu!");
                                    }}
                                    className="p-3 rounded-2xl border-2 border-emerald-100 hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer transition-all"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-black uppercase text-white bg-emerald-600 px-2 py-0.5 rounded-md">
                                            {item.domain}
                                        </span>
                                        <span className="text-xs text-emerald-700 font-black">Chọn mẫu ➔</span>
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="p-4 text-center z-10 text-xs font-black text-emerald-900 tracking-wider flex flex-col items-center justify-center gap-1 mt-auto">
                <div>
                    💖 Trường mầm non Tô Hiến Thành - Cổng Thẩm Định & Đánh Giá Sáng Kiến Sư Phạm 💖
                </div>
                <div className="text-[11px] font-extrabold text-teal-800 bg-white/70 px-4 py-1 rounded-full shadow-xs border border-emerald-200">
                    Bản quyền phần mềm & Quản trị: Cô giáo Phạm Thị Tuyết • Trường MN Tô Hiến Thành
                </div>
            </footer>
        </div>
    );
}
