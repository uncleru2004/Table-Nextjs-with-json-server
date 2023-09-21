export default function Form({ columns, values, setValues }) {
  return (
    <tr>
      {columns.map(({ title, setVal }, index) =>
        title === "del" ? (
          <td key={title}>
            <button id="ok">🆗</button>
          </td>
        ) : title === "ed" ? (
          <td key={title}>
            <button id="cancel">🗙</button>
          </td>
        ) : (
          <td key={title}>
            {setVal ? (
              <input
                type="text"
                value={values[index]}
                placeholder={title}
                onInput={(event) =>
                  setValues((old) => old.with(index, event.target.value))
                }
              />
            ) : (
              "..."
            )}
          </td>
        )
      )}
    </tr>
  );
}
