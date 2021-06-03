export default async function fetchToJson(url: string) {
  return await (await fetch(url)).json();
}
