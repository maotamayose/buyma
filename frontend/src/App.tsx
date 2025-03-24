import { useState } from "react";
import axios from "axios";

function App() {
  const [brand, setBrand] = useState("");
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<string[]>([]);
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

    try {
      const res = await axios.get("http://localhost:3001/product", {
        params: {
          brand,
          keyword,
        },
      });

      setResults(res.data.results || []);
    } catch (err: any) {
      console.error(err);
      setError("検索に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>商品検索</h1>
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

      <ul>
        {results.map((url, index) => (
          <li key={index}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
