import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatBot.scss";
 
const OPENROUTER_API_KEY = "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";
const BASE_URL = "http://localhost:8080";

const MODELS = [
  
  "anthropic/claude-haiku-4.5",
];

async function fetchPosts(limit = 50) {

  try {

    const params = new URLSearchParams({ page: 0, size: limit, sort: "id,desc" });

    const res = await fetch(`${BASE_URL}/api/posts/search?${params}`);

    if (!res.ok) return [];

    const data = await res.json();

    return data.content || [];

  } catch {

    return [];

  }

}

function formatPostsForAI(posts) {
  if (!posts.length) return "Hiện không có phòng nào trong hệ thống.";
  return posts
    .map((p) => {
      const price = p.price ? `${Number(p.price).toLocaleString("vi-VN")}đ/tháng` : "Liên hệ";
      const area = p.area ? `${p.area}m²` : "?";
      const type = p.type?.type_name || "";
      return `[ID:${p.id}] ${p.title} (${type})
   Giá: ${price} | Diện tích: ${area}
   Địa chỉ: ${p.address || "Nha Trang"}
   Mô tả: ${(p.description || "").replace(/[\r\n]+/g, " ").slice(0, 800)}`;
    })
    .join("\n\n");
}

// Parse IDs từ JSON trong response AI

function parsePostIds(text) {

  try {

    const match = text.match(/SUGGEST?_IDS:\[([^\]]*)\]/) || text.match(/SUGGET_IDS:\[([^\]]*)\]/);

    if (!match) return [];

    return match[1]

      .split(",")

      .map((s) => parseInt(s.trim(), 10))

      .filter((n) => !isNaN(n));

  } catch {

    return [];

  }

}

// Bỏ dòng SUGGEST_IDS khỏi text hiển thị

function cleanText(text) {
  return text
    .replace(/SUGGEST_IDS:\[[^\]]*\]/g, "")
    .replace(/SUGGET_IDS:\[[^\]]*\]/g, "") // ← thêm dòng này
    .trim();
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
 

async function askAI(messages, postsContext, modelIndex = 0) {

  const systemPrompt = `Bạn là trợ lý AI của NhaTrangStay — nền tảng tìm phòng trọ tại Nha Trang.

Trả lời ngắn gọn, thân thiện bằng tiếng Việt.

DANH SÁCH PHÒNG HIỆN CÓ:

${postsContext}

Quy tắc:

- Dựa vào danh sách trên để tư vấn phòng phù hợp.

- Địa chỉ đầy đủ đã có trong từng phòng, đọc kỹ để xác định khu vực.

- "Trung tâm Nha Trang" gồm: Lộc Thọ, Xương Huân, Vạn Thắng, Tân Lập, Phước Hải.
- QUAN TRỌNG: Khi người dùng hỏi về đặc điểm phòng (view biển, có hồ bơi, có máy lạnh, gần biển, thú cưng, v.v.) hãy ĐỌC KỸ PHẦN MÔ TẢ của từng phòng để tìm phòng phù hợp. Không chỉ dựa vào tiêu đề.
- Không bịa thêm phòng ngoài danh sách.

- Nếu không có phòng phù hợp, nói thật và hướng dẫn dùng bộ lọc.

QUAN TRỌNG — Khi gợi ý phòng cụ thể, LUÔN thêm dòng này ở CUỐI response  (không giải thích thêm):

SUGGEST_IDS:[id1,id2,id3]

Ví dụ: SUGGEST_IDS:[12,7,23]

Đây là YÊU CẦU BẮT BUỘC khi có gợi ý phòng, không được bỏ qua.

Nếu không gợi ý phòng cụ thể thì không cần thêm dòng này.`;

try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "NhaTrangStay",
      },
      body: JSON.stringify({
        model: MODELS[modelIndex],
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });
    if (!res.ok) {
      if (modelIndex < MODELS.length - 1) {
      
        console.log(` Model ${MODELS[modelIndex]} lỗi, thử ${MODELS[modelIndex + 1]}`);
        return askAI(messages, postsContext, modelIndex + 1);
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Lỗi ${res.status}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "Xin lỗi, tôi chưa hiểu câu hỏi.";
  } catch (e) {
    if (modelIndex < MODELS.length - 1) {
      
      console.log(` Model ${MODELS[modelIndex]} lỗi, thử ${MODELS[modelIndex + 1]}`);
      return askAI(messages, postsContext, modelIndex + 1);
    }
    throw e;
  }
}

// ---- Mini Room Card ----

function MiniRoomCard({ post, navigate }) {

  const img = post.images?.[0]?.url;

  const price = post.price

    ? `${Number(post.price).toLocaleString("vi-VN")}đ/tháng`

    : "Liên hệ";

  const type = post.type?.type_name || "Phòng trọ";

  return (
<div

      className="mini-card"

      onClick={() => navigate(`/posts/${post.id}`)}

      title="Xem chi tiết"
>
<div className="mini-card__img">

        {img ? (
<img src={img} alt={post.title} />

        ) : (
<div className="mini-card__no-img">🏠</div>

        )}
</div>
<div className="mini-card__info">
<p className="mini-card__title">{post.title}</p>
<p className="mini-card__type">{type}</p>
<p className="mini-card__price">{price}</p>
<p className="mini-card__addr">

          📍 {(post.address || "").split(",").slice(-2).join(",").trim()}
</p>
</div>
<span className="mini-card__arrow">›</span>
</div>

  );

}

// ---- Main Component ----

export default function ChatBot() {

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useState([]);

  const [history, setHistory] = useState([

    {

      role: "assistant",

      content: "Xin chào! 👋 Tôi là trợ lý AI của NhaTrangStay.\nBạn muốn tìm phòng hay có thắc mắc gì về việc thuê phòng ở Nha Trang?",

      suggestedIds: [],

    },

  ]);

  const bottomRef = useRef(null);

  const inputRef = useRef(null);

  const postsMap = Object.fromEntries(posts.map((p) => [p.id, p]));

  useEffect(() => { fetchPosts(50).then(setPosts); }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history, loading]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 150); }, [open]);

  const send = async () => {

    const text = input.trim();

    if (!text || loading) return;

    const userMsg = { role: "user", content: text, suggestedIds: [] };

    const newHistory = [...history, userMsg];

    setHistory(newHistory);

    setInput("");

    setLoading(true);

    try {

      const postsContext = formatPostsForAI(posts);

      const apiMessages = newHistory
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

      const rawReply = await askAI(apiMessages, postsContext);

      const suggestedIds = parsePostIds(rawReply);

      const cleanReply = cleanText(rawReply);

      setHistory((prev) => [

        ...prev,

        { role: "assistant", content: cleanReply, suggestedIds },

      ]);

    } catch (err) {

      setHistory((prev) => [

        ...prev,

        { role: "assistant", content: ` ${err.message}. Vui lòng thử lại.`, suggestedIds: [] },

      ]);

    } finally {

      setLoading(false);

    }

  };

  const handleKey = (e) => {

    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }

  };

  const quickQuestions = ["Phòng trọ dưới 5 triệu?", "Chung cư rộng trên 25m²?", "Chung cư Khu trung tâm Nha Trang?"];

  return (
<div className="chatbot-wrapper">
<div className={`chatbot-window ${open ? "chatbot-window--open" : ""}`}>

        {/* Header */}
<div className="chatbot-header">
<div className="chatbot-header__info">
<div className="chatbot-header__avatar">🤖</div>
<div>
<p className="chatbot-header__name">NhaTrang AI</p>
<p className="chatbot-header__status">● Trực tuyến · {posts.length} phòng đang có</p>
</div>
</div>
<button className="chatbot-header__close" onClick={() => setOpen(false)}>✕</button>
</div>

        {/* Messages */}
<div className="chatbot-messages">

          {history.map((msg, i) => (
<div key={i}>
<div className={`chatbot-msg chatbot-msg--${msg.role}`}>

                {msg.role === "assistant" && <span className="chatbot-msg__avatar">🤖</span>}
<div className="chatbot-msg__bubble">{msg.content}</div>
</div>

              {/* Room cards gợi ý */}

              {msg.suggestedIds?.length > 0 && (
<div className="chatbot-cards">

                  {msg.suggestedIds

                    .map((id) => postsMap[id])

                    .filter(Boolean)

                    .map((post) => (
<MiniRoomCard key={post.id} post={post} navigate={navigate} />

                    ))}
</div>

              )}
</div>

          ))}

          {loading && (
<div className="chatbot-msg chatbot-msg--assistant">
<span className="chatbot-msg__avatar">🤖</span>
<div className="chatbot-msg__bubble chatbot-msg__bubble--typing">
<span /><span /><span />
</div>
</div>

          )}

          {history.length === 1 && !loading && (
<div className="chatbot-quick">

              {quickQuestions.map((q) => (
<button key={q} className="chatbot-quick__btn"

                  onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}>

                  {q}
</button>

              ))}
</div>

          )}
<div ref={bottomRef} />
</div>

        {/* Input */}
<div className="chatbot-input-row">
<textarea

            ref={inputRef}

            className="chatbot-input"

            rows={1}

            placeholder="Nhập câu hỏi... (Enter để gửi)"

            value={input}

            onChange={(e) => setInput(e.target.value)}

            onKeyDown={handleKey}

          />
<button className="chatbot-send" onClick={send} disabled={loading || !input.trim()}>➤</button>
</div>
</div>
<button className={`chatbot-fab ${open ? "chatbot-fab--active" : ""}`} onClick={() => setOpen((v) => !v)}>
<span className="chatbot-fab__icon">{open ? "✕" : "💬"}</span>

        {!open && <span className="chatbot-fab__pulse" />}
</button>
</div>

  );

}
 