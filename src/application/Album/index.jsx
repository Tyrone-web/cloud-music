import { useState, useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, TopDesc, Menu } from "./style";
import { CSSTransition } from "react-transition-group";
import Header from "../../baseUI/Header";
import { getCount, isEmptyObject } from "../../api/utils";
import Scroll from "../../baseUI/Scroll";
import style from "../../assets/global-style";
import { getAlbumList } from "./store/actionCreators";
import Loading from "../../baseUI/Loading";
import SongsList from "../SongList";
import MusicNote from "../../baseUI/MusicNote";

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
  const musicNoteRef = useRef();

  const dispatch = useDispatch();

  const id = props.match.params.id;
  useEffect(() => {
    dispatch(getAlbumList(id));
  }, [dispatch, id]);

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };

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
              <SongsList
                songs={currentAlbumJS.tracks}
                collectCount={currentAlbumJS.subscribedCount}
                showCollect={true}
                // loading={pullUpLoading}
                // musicAnimation={props.musicAnimation}
                musicAnimation={musicAnimation}
                showBackground
              ></SongsList>
            </div>
          </Scroll>
        )}
        {enterLoading ? <Loading></Loading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
};

export default Album;
