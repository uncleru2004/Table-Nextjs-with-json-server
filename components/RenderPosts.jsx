export default function RenderPosts({ post }) {
  //console.log(post);
  if (post) {
    const { id, title, body } = post;

    return (
      <>
        <p>{id}</p>
        <h3>{title}</h3>
        <p>"{body}"</p>
      </>
    );
  }
}
