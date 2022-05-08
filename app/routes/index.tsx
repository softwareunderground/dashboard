import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { Octokit } from "octokit";

export const loader: LoaderFunction = async () => {
  const octo = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const resp = await octo.request(
    "GET /search/repositories?q=topic%3Aswung-stack",
    {}
  );
  // TODO will need to do pagination after 100 repos

  const items = resp.data.items.map((repo: any) => {
    const {
      id,
      name,
      full_name,
      owner,
      html_url,
      stargazers_count,
      watchers_count,
      language,
    } = repo;
    return {
      id,
      name,
      full_name,
      html_url,
      owner,
      stargazers_count,
      watchers_count,
      language,
      details: repo,
    };
  });
  console.log(items);
  return json(items);
};

export default function Index() {
  const repos = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {repos.map(
        ({
          id,
          full_name,
          html_url,
          stargazers_count,
          watchers_count,
          language,
        }: any) => {
          const link = <a href={`${html_url}`}>{full_name}</a>;
          return (
            <div key={id}>
              {`${id} | `}
              {link}
              {` | ⭐️ ${stargazers_count} | 👁 ${watchers_count} | ${
                language ?? " - "
              }`}
            </div>
          );
        }
      )}
    </div>
  );
}
