import { useState } from "react";
import axios from "axios";

function App() {
  const [brand, setBrand] = useState("");
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!brand || !keyword) {
      setError("ブランド名とキーワードを入力してください");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setImages([]);
    setSelected(new Set());

    try {
      const res = await axios.get("http://localhost:3001/product", {
        params: { brand, keyword },
      });

      const urls = res.data.results || [];
      setResults(urls);

      if (urls.length > 0) {
        // 最初のURLの画像を取得
        const imageRes = await axios.post(
          "http://localhost:3001/image/scrape",
          {
            url: urls[0],
          }
        );
        setImages(imageRes.data.images);
      }
    } catch (err: any) {
      console.error(err);
      setError("検索に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const toggleImage = (img: string) => {
    const newSet = new Set(selected);
    newSet.has(img) ? newSet.delete(img) : newSet.add(img);
    setSelected(newSet);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>商品検索 & 画像表示</h1>

      {/* 検索フォーム */}
      <input
        type="text"
        placeholder="ブランド名 (例: nike)"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="キーワード (例: エアマックス90)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <br />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "検索中..." : "検索"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 結果リンク */}
      <ul>
        {results.map((url, index) => (
          <li key={index}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </li>
        ))}
      </ul>

      {/* 画像一覧 */}
      <div style={{ marginTop: 30 }}>
        {images.length > 0 && <h2>画像一覧（{images.length}枚）</h2>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {images.map((img, index) => (
            <div key={`${img}-${index}`} style={{ textAlign: "center" }}>
              <img src={img} alt="" width="150" />
              <div>
                <input
                  type="checkbox"
                  checked={selected.has(img)}
                  onChange={() => toggleImage(img)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
