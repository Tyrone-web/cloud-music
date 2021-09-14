import { useRef, useState, useEffect, useMemo } from "react";
import { debounce } from "./../../api/utils";
import { SearchBoxWrapper } from "./style";

const SearchBox = (props) => {
  const queryRef = useRef();
  const [query, setQuery] = useState("");

  const { newQuery } = props;
  const { handleQuery } = props;

  let handleQueryDebounce = useMemo(() => {
    return debounce(handleQuery, 500);
  }, [handleQuery]);

  useEffect(() => {
    queryRef.current.focus();
  }, []);

  useEffect(() => {
    handleQueryDebounce(query);
    // eslint-disable-next-line
  }, [query]);

  useEffect(() => {
    let curQuery = query;
    if (newQuery !== query) {
      curQuery = newQuery;
      queryRef.current.value = newQuery;
    }
    setQuery(curQuery);
    // eslint-disable-next-line
  }, [newQuery]);

  const handleChange = (e) => {
    let val = e.currentTarget.value;
    setQuery(val);
  };

  const clearQuery = () => {
    setQuery("");
    queryRef.current.value = "";
    queryRef.current.focus();
  };

  const displayStyle = query ? { display: "block" } : { display: "none" };

  return (
    <SearchBoxWrapper>
      <i className="iconfont icon-back" onClick={() => props.back()}>
        &#xe655;
      </i>
      <input
        ref={queryRef}
        className="box"
        placeholder="搜索歌曲、歌手、专辑"
        onChange={handleChange}
      />
      <i
        className="iconfont icon-delete"
        onClick={clearQuery}
        style={displayStyle}
      >
        &#xe600;
      </i>
    </SearchBoxWrapper>
  );
};

export default SearchBox;
