import { columns } from "./fetcher";

export default function RenderUser({ user }) {
  //console.log("renderUser");

  return (
    <tr id={user.id} data-id="tr">
      {columns.map(({ title, getVal }) => (
        <td key={title}>{getVal(user)}</td>
      ))}
    </tr>
  );
}
