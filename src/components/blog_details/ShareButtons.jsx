import React from "react";
import { ShareSocial } from "react-share-social";

export default function ShareButtons({ id }) {
  return (
    <div className="share__buttons">
      <ShareSocial
        style={style}
        url={`aryhomes.netlify.app/blog`}
        socialTypes={["facebook", "twitter", "reddit", "linkedin"]}
        onSocialButtonClicked={() => alert("hiiiiii")}
      />
    </div>
  );
}

const style = {
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  borderRadius: 3,
  border: 0,
  color: "white",
  padding: "0 30px",
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
};
