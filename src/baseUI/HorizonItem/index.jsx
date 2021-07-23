import React, { useState, useRef, useEffect, memo } from "react";
import Scroll from "../Scroll/index";
import { PropTypes } from "prop-types";
import { List, ListItem } from "./style";

function Horizen(props) {
  const { list, oldVal, title, handleClick } = props;
  const Category = useRef(null);

  useEffect(() => {
    let categoryDOM = Category.current;
    let tagElems = categoryDOM.querySelectorAll("span");
    let totalWidth = 0;
    Array.from(tagElems).forEach((ele) => {
      totalWidth += ele.offsetWidth;
    });
    categoryDOM.style.width = `${totalWidth}px`;
  }, []);

  return (
    <Scroll direction={"horizontal"}>
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {list.map((item) => {
            return (
              <ListItem
                key={item.key}
                className={`${oldVal === item.key ? "selected" : ""}`}
                onClick={() => handleClick(item.key)}
              >
                {item.name}
              </ListItem>
            );
          })}
        </List>
      </div>
    </Scroll>
  );
}

Horizen.defaultProps = {
  list: [], // 列表数据
  oldVal: "", // 当前的 item 值
  title: "", // 列表左边的标题
  handleClick: null, // 为点击不同的 item 执行的方法
};

Horizen.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func,
};
export default memo(Horizen);
