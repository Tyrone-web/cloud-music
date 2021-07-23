import { memo, useState } from "react";
import HorizonItem from "../../baseUI/HorizonItem";
import { singerTypes, alphaTypes } from "../../api/config";
import { NavContainer } from "./style";

const Singers = (props) => {
  let [category, setCategory] = useState("");
  let [alpha, setAlpha] = useState("");

  let handleUpdateAlpha = (val) => {
    setAlpha(val);
  };

  let handleUpdateCatetory = (val) => {
    setCategory(val);
  };

  return (
    <NavContainer>
      <HorizonItem
        list={singerTypes}
        title={"分类 (默认热门):"}
        handleClick={handleUpdateCatetory}
        oldVal={category}
      />
      <HorizonItem
        list={alphaTypes}
        title={"首字母:"}
        handleClick={(val) => handleUpdateAlpha(val)}
        oldVal={alpha}
      />
    </NavContainer>
  );
};

export default memo(Singers);
