import { memo } from "react";
import { getCount } from "../../../api/utils";
import { ListWrapper, ListItem, List } from "./style";
import LazyLoad from "react-lazyload";
const defaultImg = require("./music.png").default;

function RecommendList(props) {
  return (
    <ListWrapper>
      <h1 className="title"> 推荐歌单 </h1>
      <List>
        {props.recommendList.map((item) => {
          return (
            <ListItem key={item.id}>
              <div className="img_wrapper">
                <div className="decorate"></div>
                {/* 加此参数可以减小请求的图片资源大小 */}
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
                    src={item.picUrl + "?param=300x300"}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
                <div className="play_count">
                  <i className="iconfont play">&#xe885;</i>
                  <span className="count">{getCount(item.playCount)}</span>
                </div>
              </div>
              <div className="desc">{item.name}</div>
            </ListItem>
          );
        })}
      </List>
    </ListWrapper>
  );
}

export default memo(RecommendList);
