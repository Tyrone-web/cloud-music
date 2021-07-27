import { useEffect } from "react";
import { memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getRankList } from "./store/index";
import { filterIndex } from "../../api/utils/index";
import { List, ListItem, SongList, Container } from "./style";
import Scroll from "../../baseUI/Scroll";
import { EnterLoading } from "../Singers/style";
import Loading from "../../baseUI/Loading";
import { renderRoutes } from "react-router-config";

const Rank = (props) => {
  const rankList = useSelector((state) => state.getIn(["rank", "rankList"]));
  const loading = useSelector((state) => state.getIn(["rank", "loading"]));
  console.log(rankList, "rankList");

  const rankListJS = rankList ? rankList.toJS() : [];

  const dispatch = useDispatch();
  const enterDetail = (detail) => {
    props.history.push(`/rank/${detail.id}`);
  };

  useEffect(() => {
    dispatch(getRankList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const globalStartIndex = filterIndex(rankListJS);
  const officialList = rankListJS.slice(0, globalStartIndex); // 官方榜
  const globalList = rankListJS.slice(globalStartIndex); // 全球榜

  console.log(rankListJS, "rankListJS");
  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {list.map((item) => {
          return (
            <ListItem
              key={item.coverImgId}
              tracks={item.tracks}
              onClick={() => enterDetail(item.name)}
            >
              <div className="img_wrapper">
                <img src={item.coverImgUrl} alt="" />
                <div className="decorate"></div>
                <span className="update_frequecy">{item.updateFrequency}</span>
              </div>
              {renderSongList(item.tracks)}
            </ListItem>
          );
        })}
      </List>
    );
  };

  const renderSongList = (list) => {
    return list?.length ? (
      <SongList>
        {list.map((item, index) => {
          return (
            <li key={index}>
              {index + 1}. {item.first} - {item.second}
            </li>
          );
        })}
      </SongList>
    ) : null;
  };

  // 榜单数据未加载出来之前都给隐藏
  const displayStyle = loading ? { display: "none" } : { display: "" };

  return (
    <Container>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>
            {" "}
            官方榜{" "}
          </h1>
          {renderRankList(officialList)}
          <h1 className="global" style={displayStyle}>
            {" "}
            全球榜{" "}
          </h1>
          {renderRankList(globalList, true)}
          {loading ? (
            <EnterLoading>
              <Loading></Loading>
            </EnterLoading>
          ) : null}
        </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Container>
  );
};

export default memo(Rank);
