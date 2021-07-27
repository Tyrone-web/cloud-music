import { memo, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import HorizonItem from "../../baseUI/HorizonItem";
import Loading from "../../baseUI/Loading";
import * as actionTypes from "./store/actionCreators";
import LazyLoad, { forceCheck } from "react-lazyload";
import { singerTypes, alphaTypes } from "../../api/config";
import {
  NavContainer,
  List,
  ListContainer,
  ListItem,
  EnterLoading,
} from "./style";
import Scroll from "../../baseUI/Scroll";
const defaultImg = require("./singer.png").default;

const Singers = (props) => {
  // 从redux中读取数据
  const singerList = useSelector((state) =>
    state.getIn(["singers", "singerList"])
  );
  const enterLoading = useSelector((state) =>
    state.getIn(["singers", "enterLoading"])
  );
  const pullUpLoading = useSelector((state) =>
    state.getIn(["singers", "pullUpLoading"])
  );
  const pullDownLoading = useSelector((state) =>
    state.getIn(["singers", "pullDownLoading"])
  );
  const category = useSelector((state) => state.getIn(["singers", "category"]));
  const alpha = useSelector((state) => state.getIn(["singers", "alpha"]));

  const singerListJS = singerList ? singerList.toJS() : [];
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  // 滑到最底部刷新部分的处理
  const pullUpRefresh = (hot) => {
    dispatch(actionTypes.changePullUpLoading(true));
    if (hot) {
      dispatch(actionTypes.refreshMoreHotSingerList());
    } else {
      dispatch(actionTypes.refreshMoreSingerList());
    }
  };
  //顶部下拉刷新
  const pullDownRefresh = (category, alpha) => {
    dispatch(actionTypes.changePullDownLoading(true));
    dispatch(actionTypes.changeListOffset(0));
    if (category === "" && alpha === "") {
      dispatch(actionTypes.getHotSingerList());
    } else {
      dispatch(actionTypes.getSingerList());
    }
  };

  const updateCategory = (newVal) => {
    dispatch(actionTypes.changeCategory(newVal));
    dispatch(actionTypes.getSingerList());
  };
  const updateAlpha = (newVal) => {
    dispatch(actionTypes.changeAlpha(newVal));
    dispatch(actionTypes.getSingerList());
  };

  useEffect(() => {
    if (!singerListJS.length) {
      dispatch(actionTypes.getHotSingerList());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateAlpha = (newVal) => {
    if (alpha === newVal) return;
    updateAlpha(newVal);
    scrollRef.current.refresh();
  };

  const handleUpdateCatetory = (newVal) => {
    if (category === newVal) return;
    updateCategory(newVal);
    scrollRef.current.refresh();
  };

  const handlePullUp = () => {
    pullUpRefresh(category === "");
  };

  const handlePullDown = () => {
    pullDownRefresh(category, alpha);
  };

  // 渲染函数，返回歌手列表
  const renderSingerList = () => {
    return (
      <List>
        {singerListJS.map((item, index) => {
          console.log(item.picUrl, "picUrl");
          return (
            <ListItem key={item.accountId + "" + index}>
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={defaultImg}
                      alt="music"
                    />
                  }
                >
                  <img
                    src={`${item.picUrl}?param=300x300`}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className="name">{item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <>
      <NavContainer>
        <HorizonItem
          list={singerTypes}
          title={"分类 (默认热门):"}
          handleClick={(v) => handleUpdateCatetory(v)}
          oldVal={category}
        />
        <HorizonItem
          list={alphaTypes}
          title={"首字母:"}
          handleClick={(v) => handleUpdateAlpha(v)}
          oldVal={alpha}
        />
      </NavContainer>
      <ListContainer>
        <Scroll
          onScroll={forceCheck}
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          ref={scrollRef}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
        >
          {renderSingerList()}
        </Scroll>
      </ListContainer>
      {/* 入场加载动画 */}
      {enterLoading ? (
        <EnterLoading>
          <Loading></Loading>
        </EnterLoading>
      ) : null}
    </>
  );
};

export default memo(Singers);
