import { Analytics } from "@vercel/analytics/react";
import "./style.css";
import { useEffect, useMemo, useState } from "react";
import { chain, uniq, isEmpty,  } from "lodash";
import useModal from "./useModal";
import Modal from "./modal";
import {
  mentionParser,
  csvFormatter,
  arraryContainCheck,
} from "./helper";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [type, setType] = useState("");
  const [keyword, setKeyword] = useState("");
  const { isShowing, toggle } = useModal();

  useEffect(() => {
    fetch(
      "https://sheets.googleapis.com/v4/spreadsheets/1BK64BqcqWTxdIDiqvB6ku3SN4P5F_zSlvQYDRIJn-lA/values/podcast?key=AIzaSyAVlwHA4EQx7AWjK1QsT87shL37vhKWrl4"
    )
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        const list = csvFormatter(data.values).map(
          ({ title, mention, ...res }) => {
            return {
              title,
              mention: uniq([
                ...mentionParser(title),
                ...mentionParser(mention),
              ]),
              ...res,
            };
          }
        ).reverse();

        setData(list);
      });
  }, []);

  const filtedData = useMemo(() => {
    if (type === "" && keyword === "") return data;
    const keywords = keyword.split(" ");
    const types = type.split(" ");
    return chain(data)
      .filter(({ ep }) => {
        return arraryContainCheck([ep], types);
      })
      .filter(({ title, description, mention }) =>
        arraryContainCheck([title, description, ...mention], keywords)
      )
      .value();
  }, [data, type, keyword]);

  return (
    <>
      <Analytics />
      {/* header */}
      <div className="hero is-dark">
        <div className="hero-body">
          <div className="container is-max-desktop">
            <h1 className="title is-size-4-mobile">
              尼爾喝牛奶 - 節目成分表🥛
            </h1>
            <div className="subtitle is-6">
              資料來源：
              <a
                href="https://docs.google.com/spreadsheets/d/1FFK6mHo1nMUpGIH_Y9Vfq0u3BWZ5BkaDw9gNE7Bwm0k"
                target="_blank"
                style={{ textDecoration: "underline" }}
              >
                尼爾喝牛奶共筆
              </a>
              ，目前共<strong>{data.length}</strong>集
            </div>
            <form
              className="field has-addons"
              onSubmit={(e) => {
                e.preventDefault();
                const _keyword = document.querySelector("#search").value;
                const _type = document.querySelector("#type").value;
                setKeyword(_keyword);
                setType(_type);
              }}
            >
              <div className="control">
                <div className="select">
                  <select id="type">
                    <option value="">全部</option>
                    <option value="EP">EP</option>
                    <option value="雜談 不喝牛奶">雜談/不喝牛奶</option>
                    <option value="棉花糖">棉花糖</option>
                    <option value="LIVE">LIVE Podcast</option>
                  </select>
                </div>
              </div>
              <div className="control">
                <input
                  type="search"
                  className="input"
                  id="search"
                  placeholder="蝸牛打炮"
                />
              </div>
              <div className="control">
                <button type="submit" className="button is-light">
                  search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* main */}
      <main>
        <div className="container is-max-desktop pt-6">
        { isLoading && (<div className="title is-5">牛奶準備中...</div>) }
          <ul className="px-3">
            {filtedData.map((item, index) => (
              <li key={`${item.ep}${index}`}>
                <div className="mb-1">{item.createAt}</div>
                <details open={false}>
                  <summary
                    className="title is-5 is-clickable"
                    title={`第${index + 1}集`}
                  >
                    {item.ep} | {item.title}
                  </summary>
                  <div className="notification content mb-5">
                    {item.description && <p>{item.description}</p>}
                    <div className="buttons are-small mb-0">
                      {item.mention.map((name, index) => (
                        <a
                          href={`https://www.google.com/search?q=${name}`}
                          target="_blank"
                          className="button is-rounded has-text-weight-bold"
                          key={index}
                          title="有請 google 大神"
                        >
                          #{name}
                        </a>
                      ))}
                    </div>
                    {!isEmpty(item.link) && (
                      <a href={item.link} target="_blank">
                        podcast連結
                      </a>
                    )}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </main>
      {/* fixed toolbar */}
      <div className="fixed-buttons">
        <a href="#" className="button is-rounded" title="電梯向上">
          ▴
        </a>
        <button className="button is-rounded" title="備註" onClick={toggle}>
          ⓘ
        </button>
      </div>
      <Modal isShowing={isShowing} toggle={toggle}>
        <div className="title is-4">備註</div>
        <ul>
          <li>
            <button
              style={{ verticalAlign: "middle" }}
              className="button is-small is-rounded mr-1"
            >
              #標籤
            </button>
            是解析<code>標題, 提及作品</code>欄位中的<code>《》</code>
            自動生成
          </li>
          <li>目前資料"應該"是同步的，如果發現怪怪的請告訴我喔</li>
          <li>
            在 discord 中 <code>@handred800</code> 可以找到我，也歡迎聊天 :D
          </li>
        </ul>
      </Modal>
    </>
  );
}

export default App;
