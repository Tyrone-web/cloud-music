import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import MusicalNote from "../../baseUI/MusicNote";
import LazyLoad, { forceCheck } from "react-lazyload";
import { getName } from "../../api/utils";
import {
  Container,
  ShortcutWrapper,
  HotKey,
  List,
  ListItem,
  SongItem,
} from "./style";
import SearchBox from "./../../baseUI/SearchBox";
import Scroll from "../../baseUI/Scroll";
import Loading from "./../../baseUI/Loading";
import {
  getHotKeyWords,
  changeEnterLoading,
  getSuggestList,
} from "./store/actionCreators";
import { getSongDetail } from "../Player/store/actionCreators";

const Search = (props) => {
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();

  const hotList = useSelector((state) => state.getIn(["search", "hotList"]));
  const enterLoading = useSelector((state) =>
    state.getIn(["search", "enterLoading"])
  );
  const immutableSuggestList = useSelector((state) =>
    state.getIn(["search", "suggestList"])
  );
  const songsCount = useSelector((state) =>
    state.getIn(["search", "songsCount"])
  );
  const immutableSongsList = useSelector((state) =>
    state.getIn(["search", "songsList"])
  );

  const musicNoteRef = useRef();

  const suggestList = immutableSuggestList.toJS();
  const songsList = immutableSongsList.toJS();

  const getHotKeyWordsDispatch = () => dispatch(getHotKeyWords());
  const getSongDetailDispatch = (id) => dispatch(getSongDetail(id));
  const changeEnterLoadingDispatch = (data) =>
    dispatch(changeEnterLoading(data));
  const getSuggestListDispatch = (data) => dispatch(getSuggestList(data));

  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  const selectItem = (e, id) => {
    getSongDetailDispatch(id);
    musicNoteRef.current.startAnimation({
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY,
    });
  };

  const renderSingers = () => {
    let singers = suggestList.artists;
    if (!singers || !singers.length) return;
    return (
      <List>
        <h1 className="title"> 相关歌手 </h1>
        {singers.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + "" + index}
              onClick={() => props.history.push(`/singers/${item.id}`)}
            >
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require("./singer.png").default}
                      alt="singer"
                    />
                  }
                >
                  <img
                    src={item.picUrl}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className="name"> 歌手: {item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };
  const renderAlbum = () => {
    let albums = suggestList.playlists;
    if (!albums || !albums.length) return;
    return (
      <List>
        <h1 className="title"> 相关歌单 </h1>
        {albums.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + "" + index}
              onClick={() => props.history.push(`/album/${item.id}`)}
            >
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require("./music.png").default}
                      alt="music"
                    />
                  }
                >
                  <img
                    src={item.coverImgUrl}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className="name"> 歌单: {item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };
  const renderSongs = () => {
    return (
      <SongItem style={{ paddingLeft: "20px" }}>
        {songsList.map((item) => {
          return (
            <li key={item.id} onClick={(e) => selectItem(e, item.id)}>
              <div className="info">
                <span>{item.name}</span>
                <span>
                  {getName(item.artists)} - {item.album.name}
                </span>
              </div>
            </li>
          );
        })}
      </SongItem>
    );
  };

  const handleQuery = (q) => {
    setQuery(q);
    if (!q) return;
    changeEnterLoadingDispatch(true);
    getSuggestListDispatch(q);
  };

  useEffect(() => {
    setShow(true);
    if (!hotList.size) getHotKeyWordsDispatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderHotKey = () => {
    let list = hotList ? hotList.toJS() : [];
    return (
      <ul>
        {list.map((item) => {
          return (
            <li
              className="item"
              key={item.first}
              onClick={() => setQuery(item.first)}
            >
              <span>{item.first}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container>
        <div className="search_box_wrapper">
          <SearchBox
            back={searchBack}
            newQuery={query}
            handleQuery={handleQuery}
          ></SearchBox>
        </div>
        <ShortcutWrapper show={!query}>
          <Scroll>
            <div>
              <HotKey>
                <h1 className="title"> 热门搜索 </h1>
                {renderHotKey()}
              </HotKey>
            </div>
          </Scroll>
        </ShortcutWrapper>
        <ShortcutWrapper show={query}>
          <Scroll onScorll={forceCheck}>
            <div>
              {renderSingers()}
              {renderAlbum()}
              {renderSongs()}
            </div>
          </Scroll>
        </ShortcutWrapper>
        {enterLoading ? <Loading></Loading> : null}
        <MusicalNote ref={musicNoteRef}></MusicalNote>
      </Container>
    </CSSTransition>
  );
};

export default Search;
