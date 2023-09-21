import { memo } from "react";

export default memo(function RenderInfo({ info }) {
  if (info) {
    const {
      id,
      name,
      username,
      email,
      address: {
        street,
        suite,
        city,
        zipcode,
        geo: { lat, lng } = "Нет данных",        
      } = "Нет данных",
      phone,
      website,
      company: { name: cname, catchPhrase, bs } = "Нет данных",
    } = info;

    return (
      <>
        <p>{id}</p>
        <h3>{name ? name : "Нет данных"}</h3>
        <a href={"URL" + website}>{website ? website : "Нет данных"}</a>
        <p>{cname ? cname : "Нет данных"}</p>
        <p>{bs ? bs : "Нет данных"}</p>
        <p>"{catchPhrase ? catchPhrase : "Нет данных"}"</p>
      </>
    );
  }
});
