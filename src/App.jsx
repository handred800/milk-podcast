import { useMemo, useState } from "react";
import { uniq, filter, some } from "lodash";
import csv from "./dataSheet.csv";
import { mentionParser } from "./parser";

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

  const filtedData = useMemo(() => {
    if (keyword === "") return data;
    const lowerKeyword = keyword.toLowerCase();
    return filter(
      data,
      ({ title, mention }) =>
        title.toLowerCase().includes(lowerKeyword) ||
        some(mention, (name) => name.toLowerCase().includes(lowerKeyword))
    );
  }, [keyword]);

  return (
    <>
      <div className="hero is-dark">
        <div className="hero-body">
          <div className="container is-max-desktop">
            <h1 className="title">尼爾喝牛奶 - 節目成分表🥛</h1>
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
                <input type="search" className="input" id="search" />
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
      <div className="container is-max-desktop mt-6">
        <ul>
          {filtedData.map((item, index) => (
            <li key={`${item.ep}${index}`}>
              <div className="mb-1">{item.createAt}</div>
              <details open={false}>
                <summary className="title is-5 is-clickable">
                  {item.ep} | {item.title}
                </summary>
                <div className="notification content mb-5">
                  {item.description && <p>{item.description}</p>}
                  <div className="buttons are-small">
                    {item.mention.map((name, index) => (
                      <a
                        href={`https://www.google.com/search?q=${name}`}
                        target="_blank"
                        className="button is-rounded"
                        style={{ lineHeight: 1 }}
                        key={index}
                      >
                        #{name}
                      </a>
                    ))}
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
