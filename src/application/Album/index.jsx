import { useState, useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, TopDesc, Menu, SongItem, SongList } from "./style";
import { CSSTransition } from "react-transition-group";
import Header from "../../baseUI/Header";
import { getName, getCount, isEmptyObject } from "../../api/utils";
import Scroll from "../../baseUI/Scroll";
import style from "../../assets/global-style";
import { getAlbumList } from "./store/actionCreators";
import Loading from "../../baseUI/Loading";

export const HEADER_HEIGHT = 45;
const Album = (props) => {
  const [showStatus, setShowStatus] = useState(true);
  const [title, setTitle] = useState("歌单");
  const [isMarquee, setIsMarquee] = useState(false); // 是否跑马灯
  const currentAlbum = useSelector((state) =>
    state.getIn(["album", "currentAlbum"])
  );
  const enterLoading = useSelector((state) =>
    state.getIn(["album", "enterLoading"])
  );
  const currentAlbumJS = currentAlbum?.toJS();

  const headerEl = useRef();
  const dispatch = useDispatch();

  const id = props.match.params.id;
  useEffect(() => {
    dispatch(getAlbumList(id));
  }, [dispatch, id]);

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);

  const handleScroll = useCallback(
    (pos) => {
      let minScrollY = -HEADER_HEIGHT;
      let percent = Math.abs(pos.y / minScrollY);
      let headerDom = headerEl.current;
      // 滑过顶部的高度开始变化
      if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = style["theme-color"];
        headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
        setTitle(currentAlbumJS.name);
        setIsMarquee(true);
      } else {
        headerDom.style.backgroundColor = "";
        headerDom.style.opacity = 1;
        setTitle("歌单");
        setIsMarquee(false);
      }
    },
    [currentAlbumJS.name]
  );

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbumJS.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbumJS.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">
              {getCount(currentAlbumJS.subscribedCount)}
            </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbumJS.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbumJS.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbumJS.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    );
  };

  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    );
  };

  const renderSongList = () => {
    return (
      <SongList>
        <div className="first_line">
          <div className="play_all">
            <i className="iconfont">&#xe6e3;</i>
            <span>
              {" "}
              播放全部{" "}
              <span className="sum">
                (共 {currentAlbumJS.tracks.length} 首)
              </span>
            </span>
          </div>
          <div className="add_list">
            <i className="iconfont">&#xe62d;</i>
            <span> 收藏 ({getCount(currentAlbumJS.subscribedCount)})</span>
          </div>
        </div>
        <SongItem>
          {currentAlbumJS.tracks.map((item, index) => {
            return (
              <li key={index}>
                <span className="index">{index + 1}</span>
                <div className="info">
                  <span>{item.name}</span>
                  <span>
                    {getName(item.ar)} - {item.al.name}
                  </span>
                </div>
              </li>
            );
          })}
        </SongItem>
      </SongList>
    );
  };

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container>
        <Header
          ref={headerEl}
          title={title}
          handleClick={handleBack}
          isMarquee={isMarquee}
        />
        {!isEmptyObject(currentAlbumJS) && (
          <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
              {renderTopDesc()}
              {renderMenu()}
              {renderSongList()}
            </div>
          </Scroll>
        )}
        {enterLoading ? <Loading></Loading> : null}
      </Container>
    </CSSTransition>
  );
};

export default Album;
