import { useEffect, useState } from "react";
import { infoFetcher } from "./fetcher";

export default function ItemsFetcher({ value = "", onLoadCallback, children }) {
  const [data, setData] = useState(null),
    [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const t = await infoFetcher(value);
        setData(t);
        onLoadCallback(t);
        setError(null);
      } catch (error) {
        setError(error);
      }
    }
    fetchItems();
  }, [onLoadCallback, value]);

  if (error) return <Error error={error} />;
  if (data) return <>{children}</>;
  return <Spinner />;
}

function Error({ error }) {
  return <h2>Error: {error.toString()}</h2>;
}

function Spinner() {
  return <p>Loading...</p>;
}
