import { useMemo, useState } from "react";
import { uniq, filter, some, isEmpty } from "lodash";
import "./style.css";
import csv from "./dataSheet.csv";
import { mentionParser } from "./parser";
import useModal from "./useModal";
import Modal from "./modal";

let list = csv.map(({ title, mention, ...res }) => {
  return {
    title,
    mention: uniq([...mentionParser(title), ...mentionParser(mention)]),
    ...res,
  };
});

function App() {
  const [data, setData] = useState(list);
  const [keyword, setKeyword] = useState("");
  const { isShowing, toggle } = useModal();

  const filtedData = useMemo(() => {
    if (keyword === "") return data;
    const lowerKeyword = keyword.toLowerCase();
    return filter(
      data,
      ({ title, description, mention }) =>
        title.toLowerCase().includes(lowerKeyword) ||
        description.toLowerCase().includes(lowerKeyword) ||
        some(mention, (name) => name.toLowerCase().includes(lowerKeyword))
    );
  }, [keyword]);

  return (
    <>
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
                const val = document.querySelector("#search").value;
                setKeyword(val);
              }}
            >
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
          <ul className="px-3">
            {filtedData.map((item, index) => (
              <li key={`${item.ep}${index}`}>
                <div className="mb-1">{item.createAt}</div>
                <details open={false}>
                  <summary
                    className="title is-5 is-clickable"
                    title={index + 1}
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
          <li>目前與資料來源非同步(不會即時更新)，等有空會改成同步</li>
          <li>
            在 discord 中 <code>@handred800</code> 可以找到我 :D
          </li>
        </ul>
      </Modal>
    </>
  );
}

export default App;
