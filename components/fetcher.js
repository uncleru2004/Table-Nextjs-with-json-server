export const API = "http://localhost:3333/users/",
  columns = [
    { title: "ID", getVal: ({ id }) => id },

    { title: "Name", getVal: ({ name }) => name, setVal: (name) => ({ name }) },
    {
      title: "Email",
      getVal: ({ email }) => email,
      setVal: (email) => ({ email }),
    },
    {
      title: "Address: city",
      getVal: ({ address: { city } }) => city,
      setVal: (city) => ({ address: { city } }),
    },
    {
      title: "Phone",
      getVal: ({ phone }) => phone,
      setVal: (phone) => ({ phone }),
    },
    {
      title: "del",
      getVal: () => <button id="delUser">❌</button>,
    },
    {
      title: "ed",
      getVal: () => <button id="editUser">✏️</button>,
    },
  ];

export async function fetcher() {
  const response = await fetch(API);

  if (!response.ok) throw new Error("fetch " + response.status);
  const result = await response.json();

  //console.log(result)
  return result;
}

export async function infoFetcher(value) {
  const response = await fetch(API+value);

  if (!response.ok) throw new Error("fetch " + response.status);
  const result = await response.json();

  //console.log(result)
  return result;
}
